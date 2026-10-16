import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import './index.css'
import App from './App.jsx'
import Login from './pages/login/Login'
import NotificationProvider from "./components/notifier/NotificationProvider";
import LoadingSpinnerProvider from "./components/loader/LoadingSpinnerProvider.jsx";
import AuthProvider from "./components/Authentication/AuthProvider.jsx";
import { getCurrentWebview } from "@tauri-apps/api/webview";
import { invoke } from "@tauri-apps/api/core";


const root = document.getElementById("root");

async function setDefaultZoom() {
	await getCurrentWebview().setZoom(0.8);
}

setDefaultZoom();

window.addEventListener("DOMContentLoaded", () => {
	setTimeout(async () => {
		try {
			console.log("Calling close_splashscreen...");

			await invoke("close_splashscreen");

			console.log("close_splashscreen succeeded");
		} catch (error) {
			console.error("close_splashscreen failed:", error);
		}
	}, 5_000);
});
async function startApp() {
	if (import.meta.env.DEV) {
		const { worker } = await import("./mocks/browser");
		await worker.start({ onUnhandledRequest: "bypass" });
	}

	ReactDOM.createRoot(root).render(
		<BrowserRouter>
			<LoadingSpinnerProvider>
				<NotificationProvider>
					<AuthProvider>
						<App />
					</AuthProvider>
				</NotificationProvider>
			</LoadingSpinnerProvider>
		</BrowserRouter>
	);
}

startApp();
