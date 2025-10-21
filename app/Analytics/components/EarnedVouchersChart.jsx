"use client"
import { Box, Typography, Card, CardContent, IconButton } from "@mui/material"
import { MoreHoriz, TrendingUp } from "@mui/icons-material"
import {
  Area,
  AreaChart,
  ResponsiveContainer,
} from "recharts"

export default function EarnedVouchersChart({ 
  data = [], 
  totalEarned = 0, 
  growthPercentage = 0, 
  changeAmount = 0,
  changePercentage = 0 
}) {
  return (
    <Card sx={{ bgcolor: "#ffffff", border: "1px solid #dadada", borderRadius: "12px" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Earned Vouchers
        </Typography>
        <IconButton>
          <MoreHoriz />
        </IconButton>
      </Box>
      <CardContent sx={{ p: 0 }}>
        {data.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="body2" sx={{ color: "#8a8a8f" }}>
              No voucher redemptions found
            </Typography>
          </Box>
        ) : (
          <Box sx={{ position: "relative", bgcolor: "#f9f9f9", p: 3, borderRadius: "8px", m: 2 }}>
            <Box sx={{ height: 120, mb: 2, position: "relative" }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data}
                  margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                >
                  <defs>
                    <linearGradient id="earnedGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#da1818" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#da1818" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="earned"
                    stroke="#da1818"
                    strokeWidth={3}
                    fill="url(#earnedGradient)"
                    dot={false}
                    activeDot={{ r: 6, fill: "#da1818", stroke: "#fff", strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
              <Box
                sx={{
                  position: "absolute",
                  top: 10,
                  left: "50%",
                  transform: "translateX(-50%)",
                  bgcolor: "black",
                  color: "white",
                  px: 1.5,
                  py: 0.5,
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                +{changeAmount.toLocaleString()} ({changePercentage}%)
              </Box>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "end" }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: "bold", color: "#000000" }}>
                  {totalEarned.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ color: "#8a8a8f" }}>
                  Earned
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", color: "#00c17c" }}>
                <TrendingUp sx={{ width: 16, height: 16, mr: 0.5 }} />
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  {growthPercentage}%
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}