import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App.tsx"
import "./index.css"
import { ThemeProvider, CssBaseline } from "@mui/material"
import theme from "./theme"
import { HelmetProvider } from "react-helmet-async"
import { Toaster } from "react-hot-toast"
import ErrorBoundary from "./ErrorBoundary.tsx"

// Debug logging
console.log("🚀 Starting React app...")
console.log("📦 Environment:", import.meta.env.MODE)
console.log("🌐 Base URL:", import.meta.env.BASE_URL)

const rootElement = document.getElementById("root")
if (!rootElement) {
  console.error("❌ Root element not found!")
  throw new Error("Root element not found")
}

console.log("✅ Root element found, creating React root...")

// FOR TESTING: Use this simple app first to check if React works
// const TestApp = () => {
//   return (
//     <div style={{ padding: "50px", textAlign: "center" }}>
//       <h1>✅ React is working!</h1>
//       <p>If you see this, the basic setup is correct.</p>
//       <p>Environment: {import.meta.env.MODE}</p>
//       <p>Base URL: {import.meta.env.BASE_URL}</p>
//     </div>
//   )
// }

const root = ReactDOM.createRoot(rootElement)

console.log("🎯 Rendering app...")

// Use THIS for testing (comment out the other render):
// root.render(
//   <React.StrictMode>
//     <TestApp />
//   </React.StrictMode>,
// )

// Use THIS for your actual app (uncomment when TestApp works):
root.render(
  <React.StrictMode>
    <ErrorBoundary>
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
    </ErrorBoundary>
  </React.StrictMode>,
)

console.log("🎉 App rendered successfully!")
