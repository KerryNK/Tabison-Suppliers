import type React from "react"
import { Box, Container, Typography, Grid, Paper } from "@mui/material"

const BlogPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom textAlign="center">
        Our Blog
      </Typography>

      <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
        Stay updated with the latest news, tips, and insights from Tabison Suppliers
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 4, textAlign: "center", height: "100%" }}>
            <Typography variant="h5" gutterBottom color="primary">
              Coming Soon
            </Typography>
            <Typography variant="body1">
              Our blog is under development. Check back soon for articles on military footwear, safety equipment, and industry insights.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 4, textAlign: "center", height: "100%" }}>
            <Typography variant="h5" gutterBottom color="primary">
              Industry Updates
            </Typography>
            <Typography variant="body1">
              Stay informed about the latest trends and innovations in professional footwear and safety equipment.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 4, textAlign: "center", height: "100%" }}>
            <Typography variant="h5" gutterBottom color="primary">
              Expert Tips
            </Typography>
            <Typography variant="body1">
              Learn from our experts about proper footwear selection, maintenance, and safety best practices.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default BlogPage
