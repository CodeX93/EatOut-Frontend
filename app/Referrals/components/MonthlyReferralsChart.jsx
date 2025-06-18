import { Box, Card, CardContent, Typography } from "@mui/material"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { TrendingUp, TrendingDown, Groups, MonetizationOn, Campaign } from "@mui/icons-material"

export default function MonthlyReferralsChart() {
  const monthlyReferralsData = [
    { month: "Jan", referrals: 7200 },
    { month: "Feb", referrals: 8100 },
    { month: "Mar", referrals: 7800 },
    { month: "Apr", referrals: 8500 },
    { month: "May", referrals: 8700 },
    { month: "Jun", referrals: 8900 },
    { month: "Jul", referrals: 8200 },
    { month: "Aug", referrals: 7900 },
    { month: "Sep", referrals: 8400 },
    { month: "Oct", referrals: 7600 },
  ]

  const bottomMetrics = [
    {
      icon: <Groups sx={{ width: 14, height: 14, color: "#8a8a8f" }} />,
      label: "Monthly Referrals",
      value: "1250",
      trend: "up",
      percentage: "12%",
      description: "+12% this week",
    },
    {
      icon: <TrendingUp sx={{ width: 14, height: 14, color: "#8a8a8f" }} />,
      label: "Successful Referrals",
      value: "870",
      trend: "up",
      percentage: "3.1%",
      description: "+0.49% this week",
    },
    {
      icon: <MonetizationOn sx={{ width: 14, height: 14, color: "#8a8a8f" }} />,
      label: "Referral Rewards",
      value: "$8,900",
      trend: "down",
      percentage: "12%",
      description: "+12% this week",
    },
    {
      icon: <Campaign sx={{ width: 14, height: 14, color: "#8a8a8f" }} />,
      label: "Active Campaigns",
      value: "2",
      trend: "up",
      percentage: "17%",
      description: "+0.17% this week",
    },
  ]

  return (
    <Card sx={{ bgcolor: "#ffffff", border: "1px solid #dadada", borderRadius: "12px", mb: 4 }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, fontSize: { xs: "16px", sm: "18px" } }}>
          Monthly Referrals
        </Typography>
        <Box sx={{ height: { xs: 200, sm: 250 }, position: "relative" }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyReferralsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="referralsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffcc00" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ffcc00" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#8a8a8f" }} />
              <YAxis hide />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <Box
                        sx={{
                          bgcolor: "black",
                          color: "white",
                          px: 1.5,
                          py: 1,
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        $8,900
                      </Box>
                    )
                  }
                  return null
                }}
              />
              <Area
                key="referrals"
                type="monotone"
                dataKey="referrals"
                stroke="#ffcc00"
                strokeWidth={2}
                fill="url(#referralsGradient)"
                dot={(props) => {
                  if (props.payload.month === "Jun") {
                    return <circle key={`dot-${props.payload.month}`} cx={props.cx} cy={props.cy} r={6} fill="#da1818" stroke="#fff" strokeWidth={2} />
                  }
                  return <circle key={`dot-${props.payload.month}`} cx={props.cx} cy={props.cy} r={3} fill="#ffcc00" />
                }}
              />
            </AreaChart>
          </ResponsiveContainer>

          {/* Highlighted tooltip for June */}
          <Box
            sx={{
              position: "absolute",
              top: 60,
              left: "60%",
              transform: "translateX(-50%)",
              bgcolor: "black",
              color: "white",
              px: 1.5,
              py: 0.5,
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: "bold",
              display: { xs: "none", sm: "block" },
              "&::after": {
                content: '""',
                position: "absolute",
                top: "100%",
                left: "50%",
                transform: "translateX(-50%)",
                width: 0,
                height: 0,
                borderLeft: "6px solid transparent",
                borderRight: "6px solid transparent",
                borderTop: "6px solid black",
              },
            }}
          >
            $8,900
          </Box>
        </Box>

        {/* Bottom metrics */}
        <Box
          sx={{
            display: "flex",
            gap: { xs: 1, sm: 3 },
            mt: 2,
            pt: 2,
            borderTop: "1px solid #f0f0f0",
            flexWrap: "wrap",
          }}
        >
          {bottomMetrics.map((metric, index) => (
            <Box
              key={index}
              sx={{ flex: { xs: "1 1 calc(50% - 4px)", sm: "1" }, textAlign: "center", minWidth: "120px" }}
            >
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5, mb: 0.5 }}>
                {metric.icon}
                <Typography variant="caption" sx={{ color: "#8a8a8f", fontSize: { xs: "10px", sm: "11px" } }}>
                  {metric.label}
                </Typography>
              </Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "#000000", mb: 0.5, fontSize: { xs: "14px", sm: "18px" } }}
              >
                {metric.value}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                {metric.trend === "up" ? (
                  <TrendingUp sx={{ width: 10, height: 10, color: "#00c17c", mr: 0.5 }} />
                ) : (
                  <TrendingDown sx={{ width: 10, height: 10, color: "#da1818", mr: 0.5 }} />
                )}
                <Typography
                  variant="caption"
                  sx={{ color: metric.trend === "up" ? "#00c17c" : "#da1818", mr: 0.5, fontSize: "10px" }}
                >
                  {metric.percentage}
                </Typography>
                <Typography variant="caption" sx={{ color: "#8a8a8f", fontSize: "10px" }}>
                  {metric.description}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}
