#include "emscripten.h"
#include "mupdf/fitz.h"
#include "mupdf/fitz/buffer.h"
#include <string.h>
#include <math.h>

const float dpi = 96;

static fz_context *ctx;
static fz_document *doc;
static fz_page *lastPage = NULL;

EMSCRIPTEN_KEEPALIVE
int main()
{
	ctx = fz_new_context(NULL, NULL, 100 << 20);
	if (!ctx)
		EM_ASM({ throw new Error("Cannot create MuPDF context!"); });
	fz_register_document_handlers(ctx);
	return 0;
}

// EMSCRIPTEN_KEEPALIVE
// char *search(fz_document *doc, int number, float dpi, const char *needle)
// {
// 	static unsigned char *data = NULL;
// 	fz_buffer *buf = NULL;
// 	fz_quad hits[500];
// 	int i, n;

// 	fz_var(buf);

// 	fz_free(ctx, data);
// 	data = NULL;

// 	fz_try(ctx)
// 	{
// 		loadPage(doc, number);

// 		n = fz_search_page(ctx, lastPage, needle, NULL, hits, nelem(hits));

// 		buf = fz_new_buffer(ctx, 0);

// 		fz_append_string(ctx, buf, "[");
// 		for (i = 0; i < n; ++i)
// 		{
// 			fz_rect rect = fz_rect_from_quad(hits[i]);
// 			fz_irect bbox = fz_round_rect(fz_transform_rect(rect, fz_scale(dpi/72, dpi/72)));
// 			if (i > 0) fz_append_string(ctx, buf, ",");
// 			fz_append_printf(ctx, buf, "{%q:%d,", "x", bbox.x0);
// 			fz_append_printf(ctx, buf, "%q:%d,", "y", bbox.y0);
// 			fz_append_printf(ctx, buf, "%q:%d,", "w", bbox.x1 - bbox.x0);
// 			fz_append_printf(ctx, buf, "%q:%d}", "h", bbox.y1 - bbox.y0);
// 		}
// 		fz_append_string(ctx, buf, "]");
// 		fz_terminate_buffer(ctx, buf);

// 		fz_buffer_extract(ctx, buf, &data);
// 	}
// 	fz_always(ctx)
// 	{
// 		fz_drop_buffer(ctx, buf);
// 	}
// 	fz_catch(ctx)
// 	{
// 		wasm_rethrow(ctx);
// 	}

// 	return (char*)data;
// }

void wasm_rethrow(fz_context *ctx)
{
	if (fz_caught(ctx) == FZ_ERROR_TRYLATER)
		EM_ASM({ throw "trylater"; });
	else
		EM_ASM({ throw new Error(UTF8ToString($0)); }, fz_caught_message(ctx));
}

EMSCRIPTEN_KEEPALIVE
void openDocumentFromBuffer(unsigned char *data, int size)
{
	fz_buffer *buf = NULL;
	fz_stream *stm = NULL;

	/* NOTE: We take ownership of input data! */

	fz_try(ctx)
	{
		buf = fz_new_buffer_from_data(ctx, data, size);
		stm = fz_open_buffer(ctx, buf);
		doc = fz_open_document_with_stream(ctx, "application/pdf", stm);
	}
	fz_always(ctx)
	{
		fz_drop_stream(ctx, stm);
		fz_drop_buffer(ctx, buf);
	}
	fz_catch(ctx)
	{
		fz_free(ctx, data);
		wasm_rethrow(ctx);
	}
	return;
}

EMSCRIPTEN_KEEPALIVE
int countPages()
{
	int n = 1;
	fz_try(ctx)
	{
		n = fz_count_pages(ctx, doc);
	}
	fz_catch(ctx)
	{
		wasm_rethrow(ctx);
	}
	return n;
}

static void loadPage(int number)
{
	static fz_document *lastPageDoc = NULL;
	static int lastPageNumber = -1;
	if (lastPageNumber != number || lastPageDoc != doc)
	{
		if (lastPage)
		{
			fz_drop_page(ctx, lastPage);
			lastPage = NULL;
			lastPageDoc = NULL;
			lastPageNumber = -1;
		}
		lastPage = fz_load_page(ctx, doc, number - 1);
		lastPageDoc = doc;
		lastPageNumber = number;
	}
}

EMSCRIPTEN_KEEPALIVE
char *pageText(int number, float dpi)
{
	static unsigned char *data = NULL;
	fz_stext_page *text = NULL;
	fz_buffer *buf = NULL;
	fz_output *out = NULL;

	fz_var(buf);
	fz_var(out);
	fz_var(text);

	fz_stext_options opts = {FZ_STEXT_PRESERVE_SPANS};

	fz_free(ctx, data);
	data = NULL;

	fz_try(ctx)
	{
		loadPage(number);

		buf = fz_new_buffer(ctx, 0);
		out = fz_new_output_with_buffer(ctx, buf);
		text = fz_new_stext_page_from_page(ctx, lastPage, &opts);

		fz_print_stext_page_as_json(ctx, out, text, dpi / 72);
		fz_close_output(ctx, out);
		fz_terminate_buffer(ctx, buf);

		fz_buffer_extract(ctx, buf, &data);
	}
	fz_always(ctx)
	{
		fz_drop_stext_page(ctx, text);
		fz_drop_output(ctx, out);
		fz_drop_buffer(ctx, buf);
	}
	fz_catch(ctx)
	{
		wasm_rethrow(ctx);
	}

	return (char *)data;
}

EMSCRIPTEN_KEEPALIVE
char *drawPageAsSVG(int number, int style)
{
	static unsigned char *data = NULL;
	fz_buffer *buf;
	fz_output *out;
	fz_device *dev;
	fz_rect bbox;

	fz_free(ctx, data);
	data = NULL;

	loadPage(number);

	buf = fz_new_buffer(ctx, 0);
	{
		out = fz_new_output_with_buffer(ctx, buf);
		{
			bbox = fz_bound_page(ctx, lastPage);
			dev = fz_new_svg_device(ctx, out, bbox.x1 - bbox.x0, bbox.y1 - bbox.y0, style, 0);
			fz_run_page(ctx, lastPage, dev, fz_identity, NULL);
			fz_close_device(ctx, dev);
			fz_drop_device(ctx, dev);
		}
		fz_write_byte(ctx, out, 0);
		fz_close_output(ctx, out);
		fz_drop_output(ctx, out);
	}
	int len = fz_buffer_extract(ctx, buf, &data);
	data[len] = 0;
	fz_drop_buffer(ctx, buf);

	return (char *)data;
}

static fz_irect pageBounds(int number)
{
	fz_irect bbox = fz_empty_irect;
	fz_try(ctx)
	{
		loadPage(number);
		bbox = fz_round_rect(fz_bound_page(ctx, lastPage));
	}
	fz_catch(ctx)
		wasm_rethrow(ctx);
	return bbox;
}

static fz_irect pageBoundsDpi(int number, float dpi)
{
	fz_irect bbox = fz_empty_irect;
	fz_try(ctx)
	{
		loadPage(number);
		bbox = fz_round_rect(fz_transform_rect(fz_bound_page(ctx, lastPage), fz_scale(dpi / 72, dpi / 72)));
	}
	fz_catch(ctx)
		wasm_rethrow(ctx);
	return bbox;
}

EMSCRIPTEN_KEEPALIVE
int pageWidthDpi(int number, float dpi)
{
	fz_irect bbox = fz_empty_irect;
	fz_try(ctx)
	{
		loadPage(number);
		bbox = pageBoundsDpi(number, dpi);
	}
	fz_catch(ctx)
		wasm_rethrow(ctx);
	return bbox.x1 - bbox.x0;
}

EMSCRIPTEN_KEEPALIVE
int pageWidth(int number, float dpi)
{
	fz_irect bbox = fz_empty_irect;
	fz_try(ctx)
	{
		loadPage(number);
		bbox = pageBounds(number);
	}
	fz_catch(ctx)
		wasm_rethrow(ctx);
	return bbox.x1 - bbox.x0;
}

EMSCRIPTEN_KEEPALIVE
int pageHeightDpi(int number, float dpi)
{
	fz_irect bbox = fz_empty_irect;
	fz_try(ctx)
	{
		loadPage(number);
		bbox = pageBoundsDpi(number, dpi);
	}
	fz_catch(ctx)
		wasm_rethrow(ctx);
	return bbox.y1 - bbox.y0;
}

EMSCRIPTEN_KEEPALIVE
int pageHeight(int number)
{
	fz_irect bbox = fz_empty_irect;
	fz_try(ctx)
	{
		loadPage(number);
		bbox = pageBounds(number);
	}
	fz_catch(ctx)
		wasm_rethrow(ctx);
	return bbox.y1 - bbox.y0;
}

EMSCRIPTEN_KEEPALIVE
char *documentTitle()
{
	static char buf[100], *result = NULL;
	fz_try(ctx)
	{
		if (fz_lookup_metadata(ctx, doc, FZ_META_INFO_TITLE, buf, sizeof buf) > 0)
			result = buf;
	}
	fz_catch(ctx)
		wasm_rethrow(ctx);
	return result;
}

void outlineToJSON(fz_buffer *buf, fz_outline *outline);
void outlineToJSONArray(fz_buffer *buf, fz_outline *outline)
{
	fz_append_printf(ctx, buf, "[");
	outlineToJSON(buf, outline);
	fz_append_printf(ctx, buf, "]");
}
void outlineToJSON(fz_buffer *buf, fz_outline *outline)
{
	fz_append_printf(ctx, buf, "{\"title\":\"%s\"", outline->title);
	fz_append_printf(ctx, buf, ",\"page\":%d", outline->page.page);
	fz_append_printf(ctx, buf, ",\"x\":%f", outline->x);
	fz_append_printf(ctx, buf, ",\"y\":%f", outline->y);
	if (outline->down)
	{
		fz_append_printf(ctx, buf, ",\"children\":");
		outlineToJSONArray(buf, outline->down);
	}
	if (outline->next)
	{
		fz_append_printf(ctx, buf, "},");
		outlineToJSON(buf, outline->next);
	}
	else
	{
		fz_append_printf(ctx, buf, "}");
	}
}

EMSCRIPTEN_KEEPALIVE
char *loadOutline()
{
	fz_outline *outline = NULL;
	fz_buffer *buf = NULL;
	static unsigned char *data = NULL;
	fz_free(ctx, data);
	data = NULL;

	outline = fz_load_outline(ctx, doc);
	buf = fz_new_buffer(ctx, 0);

	outlineToJSONArray(buf, outline);
	int len = fz_buffer_extract(ctx, buf, &data);
	data[len] = 0;

	fz_drop_outline(ctx, outline);
	fz_drop_buffer(ctx, buf);
	return (char *)data;
}