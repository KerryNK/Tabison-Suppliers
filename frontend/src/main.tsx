import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App.tsx"
import "./index.css"
import { ThemeProvider, CssBaseline } from "@mui/material"
import theme from "./theme"
import { HelmetProvider } from "react-helmet-async"
import { Toaster } from "react-hot-toast"

const rootElement = document.getElementById("root")
if (!rootElement) {
  throw new Error("Root element not found")
}

const root = ReactDOM.createRoot(rootElement)
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HelmetProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#363636",
              color: "#fff",
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: "#4aed88",
                secondary: "#fff",
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: "#ff6b6b",
                secondary: "#fff",
              },
            },
          }}
        />
      </HelmetProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
