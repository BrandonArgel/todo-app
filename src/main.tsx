import React from "react";
import ReactDOM from "react-dom/client";
import { ToDoContextProvider } from "@context";
import App from "./App";
import "./styles/global.scss";

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement as HTMLElement);
root.render(
	<React.StrictMode>
		<ToDoContextProvider>
			<App />
		</ToDoContextProvider>
	</React.StrictMode>
);

