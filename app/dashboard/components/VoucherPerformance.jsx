"use client"

import { Box, Paper, Typography, LinearProgress } from "@mui/material"

const performanceData = [
  {
    category: "Food & Beverage",
    percentage: 75,
    value: "1,234",
    total: "1,645",
  },
  {
    category: "Retail",
    percentage: 45,
    value: "567",
    total: "1,234",
  },
  {
    category: "Entertainment",
    percentage: 30,
    value: "345",
    total: "1,123",
  },
]

export default function VouchersPerformance() {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: "10px",
        bgcolor: "#ffffff",
        border: "1px solid #efeff4",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          mb: { xs: 2, sm: 3 },
          fontSize: { xs: "1rem", sm: "1.25rem" },
          fontWeight: 600,
        }}
      >
        Vouchers Performance
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 2, sm: 3 } }}>
        {performanceData.map((item, index) => (
          <Box key={index}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                }}
              >
                {item.category}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                }}
              >
                {item.value} / {item.total}
              </Typography>
            </Box>

            <LinearProgress
              variant="determinate"
              value={item.percentage}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: "rgba(218, 24, 24, 0.1)",
                "& .MuiLinearProgress-bar": {
                  bgcolor: "#da1818",
                  borderRadius: 4,
                },
              }}
            />

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: "block",
                mt: 0.5,
                fontSize: { xs: "0.7rem", sm: "0.75rem" },
              }}
            >
              {item.percentage}% of total vouchers
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  )
}
