"use client"

import { Box, Grid, Paper, Typography, useMediaQuery, useTheme } from "@mui/material"
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward"
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward"

export default function StatsCards() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const stats = [
    {
      title: "Restaurant Registered",
      value: "323",
      change: 12,
      isPositive: true,
      comparedTo: "Compared to (300 last day)",
    },
    {
      title: "Total Vouchers",
      value: "635",
      change: 12,
      isPositive: false,
      comparedTo: "Compared to (700 last day)",
    },
    {
      title: "Members",
      value: "4,834",
      change: 17,
      isPositive: true,
      comparedTo: "Compared to (3847 last day)",
    },
  ]

  return (
    <Grid container spacing={{ xs: 2, sm: 3 }}>
      {stats.map((stat, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 2.5 },
              borderRadius: "10px",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              bgcolor: "#ffffff",
              border: "1px solid #efeff4",
            }}
          >
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                fontSize: { xs: "0.875rem", sm: "1rem" },
                mb: { xs: 1, sm: 1.5 }
              }}
            >
              {stat.title}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", mb: { xs: 0.5, sm: 1 } }}>
              <Typography 
                variant="h4" 
                component="div" 
                fontWeight="bold" 
                sx={{ 
                  mr: 1,
                  fontSize: { xs: "1.5rem", sm: "2rem" }
                }}
              >
                {stat.value}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  bgcolor: stat.isPositive ? "rgba(0, 193, 124, 0.1)" : "rgba(255, 45, 85, 0.1)",
                  color: stat.isPositive ? "#00c17c" : "#ff2d55",
                  borderRadius: "4px",
                  px: 0.5,
                  py: 0.2,
                }}
              >
                {stat.isPositive ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />}
                <Typography 
                  variant="caption" 
                  fontWeight="medium"
                  sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                >
                  {stat.change}%
                </Typography>
              </Box>
            </Box>

            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ 
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                opacity: 0.8
              }}
            >
              {stat.comparedTo}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  )
}
