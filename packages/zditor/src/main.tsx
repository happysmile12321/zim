import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { render, VDomRoot } from "zim-leafer";

render(<App />, new VDomRoot({ view: window }));
