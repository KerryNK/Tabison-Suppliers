import type React from "react"
import { Card, CardActions, Box, Skeleton } from "@mui/material"

const SupplierCardSkeleton: React.FC = () => {
  return (
    <Card
      sx={{
        height: 400,
        display: "flex",
        flexDirection: "column",
        margin: 1,
      }}
    >
      <Box sx={{ p: 2 }}>
        <Skeleton variant="circular" width={60} height={60} sx={{ mb: 2 }} />
        <Skeleton variant="text" height={32} sx={{ mb: 1 }} />
        <Skeleton variant="text" height={20} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={80} sx={{ mb: 2 }} />

        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
          <Skeleton variant="rectangular" width={60} height={24} />
          <Skeleton variant="rectangular" width={80} height={24} />
          <Skeleton variant="rectangular" width={70} height={24} />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Skeleton variant="circular" width={16} height={16} />
          <Skeleton variant="text" width={120} height={20} />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Skeleton variant="circular" width={16} height={16} />
          <Skeleton variant="text" width={100} height={20} />
        </Box>
      </Box>

      <CardActions sx={{ mt: "auto", p: 2 }}>
        <Skeleton variant="rectangular" width={100} height={36} />
        <Skeleton variant="rectangular" width={80} height={36} />
      </CardActions>
    </Card>
  )
}

export default SupplierCardSkeleton
