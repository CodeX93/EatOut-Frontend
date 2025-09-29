import { useEffect, useState } from "react"
import { Box, Card, CardContent, Typography } from "@mui/material"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { TrendingUp, TrendingDown, Groups, MonetizationOn, Campaign } from "@mui/icons-material"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../../../firebaseConfig"

export default function MonthlyReferralsChart() {
  const [monthlyReferralsData, setMonthlyReferralsData] = useState([])
  const [bottomMetrics, setBottomMetrics] = useState([
    { icon: <Groups sx={{ width: 14, height: 14, color: "#8a8a8f" }} />, label: "Monthly Referrals", value: "-", trend: "up", percentage: "-", description: "-" },
    { icon: <TrendingUp sx={{ width: 14, height: 14, color: "#8a8a8f" }} />, label: "Successful Referrals", value: "-", trend: "up", percentage: "-", description: "-" },
    { icon: <MonetizationOn sx={{ width: 14, height: 14, color: "#8a8a8f" }} />, label: "Referral Rewards", value: "-", trend: "down", percentage: "-", description: "-" },
    { icon: <Campaign sx={{ width: 14, height: 14, color: "#8a8a8f" }} />, label: "Active Campaigns", value: "2", trend: "up", percentage: "17%", description: "+0.17% this week" },
  ])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReferrals = async () => {
      setLoading(true)
      try {
        const querySnapshot = await getDocs(collection(db, "referrals"))
        const docs = []
        querySnapshot.forEach((doc) => docs.push(doc.data()))

        // Group by month
        const monthMap = {}
        let totalReferrals = 0
        let totalSuccessfulReferrals = 0
        let totalRewards = 0
        const now = new Date()
        const currentMonth = now.getMonth()
        const currentYear = now.getFullYear()
        let thisMonthReferrals = 0
        let thisMonthSuccessful = 0
        let thisMonthRewards = 0

        docs.forEach((ref) => {
          if (ref.createdAt && ref.createdAt.seconds) {
            const date = new Date(ref.createdAt.seconds * 1000)
            const month = date.toLocaleString("default", { month: "short" })
            const year = date.getFullYear()
            const key = `${month} ${year}`
            if (!monthMap[key]) monthMap[key] = 0
            monthMap[key]++
            totalReferrals++
            const successful = Array.isArray(ref.referredUsers) ? ref.referredUsers.length : 0
            totalSuccessfulReferrals += successful
            totalRewards += ref.totalRewardsEarned || 0
            if (year === currentYear && date.getMonth() === currentMonth) {
              thisMonthReferrals++
              thisMonthSuccessful += successful
              thisMonthRewards += ref.totalRewardsEarned || 0
            }
          }
        })

        // Get last 10 months (including current)
        const months = []
        for (let i = 9; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
          const m = d.toLocaleString("default", { month: "short" })
          const y = d.getFullYear()
          const key = `${m} ${y}`
          months.push({ month: m, year: y, key })
        }
        const chartData = months.map(({ month, year, key }) => ({
          month,
          referrals: monthMap[key] || 0,
        }))
        setMonthlyReferralsData(chartData)

        // Calculate trends (dummy for now)
        const trend = thisMonthReferrals >= 0 ? "up" : "down"
        const trendPerc = "12%"
        setBottomMetrics([
          {
            icon: <Groups sx={{ width: 14, height: 14, color: "#8a8a8f" }} />, label: "Monthly Referrals", value: thisMonthReferrals.toString(), trend, percentage: trendPerc, description: `+${trendPerc} this month`,
          },
          {
            icon: <TrendingUp sx={{ width: 14, height: 14, color: "#8a8a8f" }} />, label: "Successful Referrals", value: thisMonthSuccessful.toString(), trend, percentage: "3.1%", description: "+0.49% this month",
          },
          {
            icon: <MonetizationOn sx={{ width: 14, height: 14, color: "#8a8a8f" }} />, label: "Referral Rewards", value: `$${thisMonthRewards.toLocaleString()}`, trend: "down", percentage: "12%", description: "+12% this month",
          },
          {
            icon: <Campaign sx={{ width: 14, height: 14, color: "#8a8a8f" }} />, label: "Active Campaigns", value: "2", trend: "up", percentage: "17%", description: "+0.17% this week",
          },
        ])
      } catch (error) {
        console.error("Error fetching referrals for chart:", error)
      }
      setLoading(false)
    }
    fetchReferrals()
  }, [])

  return (
    <Card sx={{ 
      bgcolor: "#ffffff", 
      border: "1px solid #dadada", 
      borderRadius: { xs: "8px", sm: "10px", md: "12px" }, 
      mb: { xs: 3, sm: 4 } 
    }}>
      <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, fontSize: { xs: "16px", sm: "18px" } }}>
          Monthly Referrals
        </Typography>
        <Box sx={{ height: { xs: 200, sm: 250 }, position: "relative" }}>
          {loading ? (
            <Box sx={{ p: 4, textAlign: "center" }}>
              <Typography>Loading...</Typography>
            </Box>
          ) : (
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
                          {payload[0].value}
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
                    // Highlight current month
                    const now = new Date()
                    const currentMonth = now.toLocaleString("default", { month: "short" })
                    if (props.payload.month === currentMonth) {
                      return <circle key={`dot-${props.payload.month}`} cx={props.cx} cy={props.cy} r={6} fill="#da1818" stroke="#fff" strokeWidth={2} />
                    }
                    return <circle key={`dot-${props.payload.month}`} cx={props.cx} cy={props.cy} r={3} fill="#ffcc00" />
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {/* Highlighted tooltip for current month */}
          {/* You can optionally update this to show dynamic value */}
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
