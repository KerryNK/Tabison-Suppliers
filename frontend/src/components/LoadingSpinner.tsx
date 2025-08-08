import type React from "react"
import { Box, CircularProgress, Typography, Fade } from "@mui/material"

interface LoadingSpinnerProps {
  message?: string
  size?: number
  fullScreen?: boolean
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = "Loading...", size = 40, fullScreen = false }) => {
  const content = (
    <Fade in timeout={300}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          ...(fullScreen && {
            minHeight: "100vh",
            justifyContent: "center",
          }),
        }}
      >
        <CircularProgress size={size} sx={{ color: "#4fd1c5" }} />
        <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
          {message}
        </Typography>
      </Box>
    </Fade>
  )

  if (fullScreen) {
    return (
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(5px)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {content}
      </Box>
    )
  }

  return content
}

export default LoadingSpinner
