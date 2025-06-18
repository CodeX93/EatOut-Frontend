import { Box, Card, CardContent, Typography } from "@mui/material"
import { TrendingUp, TrendingDown, Groups, MonetizationOn, Campaign } from "@mui/icons-material"

export default function MetricsCards() {
  const metricsData = [
    {
      icon: <Groups sx={{ width: 16, height: 16, color: "#8a8a8f" }} />,
      label: "Total Referrals",
      value: "1,2500",
      trend: "up",
      percentage: "12%",
      description: "+12% this week",
    },
    {
      icon: <TrendingUp sx={{ width: 16, height: 16, color: "#8a8a8f" }} />,
      label: "Successful Referrals",
      value: "8700",
      trend: "down",
      percentage: "12%",
      description: "+17% this week",
    },
    {
      icon: <MonetizationOn sx={{ width: 16, height: 16, color: "#8a8a8f" }} />,
      label: "Referral Rewards",
      value: "$8,9000",
      trend: "up",
      percentage: "31%",
      description: "+0.49% this week",
    },
    {
      icon: <Campaign sx={{ width: 16, height: 16, color: "#8a8a8f" }} />,
      label: "Active Campaigns",
      value: "20",
      trend: "up",
      percentage: "17%",
      description: "+0.17% this week",
    },
  ]

  return (
    <Box sx={{ display: "flex", gap: 2, mb: 4, flexWrap: "wrap" }}>
      {metricsData.map((metric, index) => (
        <Card
          key={index}
          sx={{
            flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", lg: "1" },
            bgcolor: "#ffffff",
            border: "1px solid #dadada",
            borderRadius: "12px",
            minWidth: { xs: "100%", sm: "200px" },
          }}
        >
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              {metric.icon}
              <Typography variant="body2" sx={{ color: "#8a8a8f", fontSize: { xs: "12px", sm: "14px" } }}>
                {metric.label}
              </Typography>
            </Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", color: "#000000", mb: 1, fontSize: { xs: "20px", sm: "24px", md: "28px" } }}
            >
              {metric.value}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {metric.trend === "up" ? (
                <TrendingUp sx={{ width: 12, height: 12, color: "#00c17c", mr: 0.5 }} />
              ) : (
                <TrendingDown sx={{ width: 12, height: 12, color: "#da1818", mr: 0.5 }} />
              )}
              <Typography
                variant="body2"
                sx={{ color: metric.trend === "up" ? "#00c17c" : "#da1818", mr: 0.5, fontSize: "12px" }}
              >
                {metric.percentage}
              </Typography>
              <Typography variant="body2" sx={{ color: "#8a8a8f", fontSize: "12px" }}>
                {metric.description}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  )
}
