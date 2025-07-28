"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { Box, Typography, Button, Container } from "@mui/material"

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="md" sx={{ py: 8, textAlign: "center" }}>
          <Box>
            <Typography variant="h4" gutterBottom color="error">
              Oops! Something went wrong
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </Typography>
            <Button variant="contained" onClick={() => window.location.reload()} sx={{ mr: 2 }}>
              Refresh Page
            </Button>
            <Button variant="outlined" onClick={() => (window.location.href = "/")}>
              Go Home
            </Button>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <Box sx={{ mt: 4, p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
                <Typography variant="body2" component="pre" sx={{ textAlign: "left", fontSize: "0.8rem" }}>
                  {this.state.error.stack}
                </Typography>
              </Box>
            )}
          </Box>
        </Container>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
