import "./style.css";
import { renderApp } from "./app.js";

const app = document.querySelector("#app");
if (!app) throw new Error("App container not found.");
renderApp(app);
