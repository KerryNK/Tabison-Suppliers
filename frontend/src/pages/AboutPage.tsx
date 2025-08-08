import type React from "react"
import { Box, Container, Typography, Grid, Paper } from "@mui/material"

const AboutPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom textAlign="center">
        About Tabison Suppliers
      </Typography>

      <Box sx={{ mb: 6 }}>
        <Typography variant="body1" paragraph>
          Tabison Suppliers is a leading manufacturer and supplier of high-quality military, safety, and official
          footwear in Kenya. With years of experience in the industry, we have built a reputation for delivering
          durable, comfortable, and reliable boots that meet the demanding requirements of professionals across various
          sectors.
        </Typography>

        <Typography variant="body1" paragraph>
          Our commitment to quality, competitive pricing, and customer satisfaction has made us the preferred choice for
          military personnel, police officers, security guards, and industrial workers throughout Kenya and beyond.
        </Typography>
      </Box>

      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 4, textAlign: "center", height: "100%" }}>
            <Typography variant="h5" gutterBottom color="primary">
              Our Mission
            </Typography>
            <Typography variant="body1">
              To provide high-quality, durable footwear solutions that protect and support professionals in their
              demanding work environments while maintaining competitive pricing and excellent service.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 4, textAlign: "center", height: "100%" }}>
            <Typography variant="h5" gutterBottom color="primary">
              Our Vision
            </Typography>
            <Typography variant="body1">
              To be the leading supplier of professional footwear in East Africa, known for innovation, quality, and
              reliability in serving the needs of military, safety, and security professionals.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 4, textAlign: "center", height: "100%" }}>
            <Typography variant="h5" gutterBottom color="primary">
              Our Values
            </Typography>
            <Typography variant="body1">
              Quality craftsmanship, customer satisfaction, competitive pricing, timely delivery, and continuous
              innovation in product development and manufacturing processes.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Typography variant="h4" gutterBottom>
        Why Choose Us?
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" gutterBottom>
            ✓ Quality Assurance
          </Typography>
          <Typography variant="body2" paragraph>
            All our products undergo rigorous quality testing to ensure they meet international standards and can
            withstand the toughest conditions.
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="h6" gutterBottom>
            ✓ Local Manufacturing
          </Typography>
          <Typography variant="body2" paragraph>
            Proudly manufactured in Kenya, supporting local employment and contributing to the growth of the domestic
            manufacturing sector.
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="h6" gutterBottom>
            ✓ Competitive Pricing
          </Typography>
          <Typography variant="body2" paragraph>
            Direct manufacturer pricing with flexible wholesale and retail options to suit different budget requirements
            and order quantities.
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="h6" gutterBottom>
            ✓ Reliable Service
          </Typography>
          <Typography variant="body2" paragraph>
            Committed to timely delivery, responsive customer service, and building long-term partnerships with our
            clients across Kenya.
          </Typography>
        </Grid>
      </Grid>
    </Container>
  )
}

export default AboutPage
