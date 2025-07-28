"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { Box, Typography, Button, Container, Alert } from "@mui/material"
import { Refresh, Home } from "@mui/icons-material"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo)
    this.setState({ error, errorInfo })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Box sx={{ textAlign: "center" }}>
            <Alert severity="error" sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                Oops! Something went wrong
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                We're sorry for the inconvenience. Please try refreshing the page or go back to the homepage.
              </Typography>

              {process.env.NODE_ENV === "development" && this.state.error && (
                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    bgcolor: "#f5f5f5",
                    borderRadius: 1,
                    textAlign: "left",
                    fontFamily: "monospace",
                    fontSize: "0.875rem",
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    Error Details:
                  </Typography>
                  <pre>{this.state.error.message}</pre>
                  {this.state.errorInfo && <pre>{this.state.errorInfo.componentStack}</pre>}
                </Box>
              )}

              <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<Refresh />}
                  onClick={this.handleReset}
                  sx={{ bgcolor: "#4fd1c5", "&:hover": { bgcolor: "#38b2ac" } }}
                >
                  Try Again
                </Button>
                <Button variant="outlined" startIcon={<Home />} onClick={() => (window.location.href = "/")}>
                  Go Home
                </Button>
              </Box>
            </Alert>
          </Box>
        </Container>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
