"use client"

import { Box, Card, CardContent, Typography } from "@mui/material"

export default function BowlMetricsCards() {
  const metrics = [
    {
      title: "Total Bowls Earned",
      subtitle: "/ Coins",
      value: "36,200",
      trend: "+12%",
      trendText: "+1.2% this week",
      trendDirection: "up",
      icon: "🥣",
    },
    {
      title: "Total Bowls Redeemed",
      subtitle: "/ Coins",
      value: "10,500",
      trend: "-12%",
      trendText: "+1.2% this week",
      trendDirection: "down",
      icon: "🥣",
    },
    {
      title: "Total Bowls Redeemed",
      subtitle: "(Subscription)",
      value: "17,800",
      trend: "+3.1%",
      trendText: "+0.49% this week",
      trendDirection: "up",
      icon: "🥣",
    },
    {
      title: "Active Users with",
      subtitle: "Bowls",
      value: "1,380",
      trend: "+17%",
      trendText: "+0.17% this week",
      trendDirection: "up",
      icon: "🥣",
    },
    {
      title: "Total Cash Paid via",
      subtitle: "Bowls",
      value: "$1,050",
      trend: "+3.1%",
      trendText: "+0.49% this week",
      trendDirection: "up",
      icon: "🥣",
    },
    {
      title: "Subscriptions via",
      subtitle: "Bowls",
      value: "240",
      trend: "+3.1%",
      trendText: "+0.49% this week",
      trendDirection: "up",
      icon: "🥣",
    },
  ]

  const getTrendColor = (direction) => {
    return direction === "up" ? "#10b981" : "#ef4444"
  }

  const getTrendIcon = (direction) => {
    return direction === "up" ? "↗" : "↘"
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
          lg: "repeat(6, 1fr)",
        },
        gap: { xs: 2, sm: 2.5, md: 3 },
      }}
    >
      {metrics.map((metric, index) => (
        <Card
          key={index}
          sx={{
            bgcolor: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
            transition: "all 0.2s ease",
            "&:hover": {
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              transform: "translateY(-1px)",
            },
            minHeight: { xs: "140px", sm: "160px" },
          }}
        >
          <CardContent
            sx={{
              p: { xs: 2, sm: 2.5 },
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {/* Header with Icon */}
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#6b7280",
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    fontWeight: 500,
                    lineHeight: 1.3,
                    mb: 0.5,
                  }}
                >
                  {metric.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#6b7280",
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    fontWeight: 500,
                    lineHeight: 1.3,
                  }}
                >
                  {metric.subtitle}
                </Typography>
              </Box>
              <Box
                sx={{
                  fontSize: { xs: "1.25rem", sm: "1.5rem" },
                  opacity: 0.7,
                }}
              >
                {metric.icon}
              </Box>
            </Box>

            {/* Value */}
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "#111827",
                fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
                lineHeight: 1.1,
                mb: 1.5,
              }}
            >
              {metric.value}
            </Typography>

            {/* Trend */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                flexWrap: "wrap",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <Typography
                  sx={{
                    color: getTrendColor(metric.trendDirection),
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    fontWeight: 600,
                  }}
                >
                  {getTrendIcon(metric.trendDirection)} {metric.trend}
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: "#6b7280",
                  fontSize: { xs: "0.7rem", sm: "0.75rem" },
                }}
              >
                {metric.trendText}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  )
}
