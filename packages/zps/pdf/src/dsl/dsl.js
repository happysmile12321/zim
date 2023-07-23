export default {
    "hooks": {
        "doCurrentPage": {
            "input": "doCurrentPage",
            "inputInitValue": "1",
            "payloadType": "number",
            "hooksMeans": "当前所在的页码"
        },
        "doNext": {
            "input": "doNext",
            "inputInitValue": "0",
            "payloadType": "number",
            "hooksMeans": "点击下一页"
        },
        "doPrev": {
            "input": "doPrev",
            "inputInitValue": "0",
            "payloadType": "number",
            "hooksMeans": "点击上一页"
        },
        "doSearch": {
            "input": "doSearch",
            "output": "doSearchReturn",
            "inputInitValue": "null",
            "outputInitValue": "[]",
            "payloadType": "string",
            "hooksMeans": "搜索内容",
            "hooksReturnMeans": "搜索返回的内容"
        },
        "doHover": {
            "input": "doHover",
            "inputInitValue": "null",
            "payloadType": "[{pageNo:number, paragraphText: string}]",
            "hooksMeans": "将鼠标停留在段落上"
        },
        "doSelect": {
            "input": "doSelect",
            "inputInitValue": "null",
            "payloadType": "string",
            "hooksMeans": "选中的文字"
        },
        "doEnLarge": {
            "input": "doEnLarge",
            "inputInitValue": "0",
            "payloadType": "number",
            "hooksMeans": "放大"
        },
        "doShrink": {
            "input": "doShrink",
            "inputInitValue": "0",
            "payloadType": "number",
            "hooksMeans": "缩小"
        },
        "doOutline": {
            "input": "doOutline",
            "inputInitValue": "0",
            "payloadType": "number",
            "hooksMeans": "切换大纲"
        },
        "doOutlineJump": {
            "input": "doOutlineJump",
            "inputInitValue": "''",
            "payloadType": "string",
            "hooksMeans": "点击大纲跳转的值"
        }
    }
}