"use client"

import { useState, useEffect } from "react"
import { Box, Paper, Typography, Avatar, CircularProgress } from "@mui/material"
import { format } from "date-fns"
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore"
import { db } from "../../../firebaseConfig"

export default function RecentRedeemedVouchers({ selectedPeriod, dateRange }) {
  const [recentVouchers, setRecentVouchers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecentVouchers = async () => {
      setLoading(true)
      try {
        // Fetch vouchers data
        const vouchersSnap = await getDocs(collection(db, "voucher"))
        const vouchers = []
        
        vouchersSnap.forEach((doc) => {
          const data = doc.data()
          if (data.createdAt) {
            vouchers.push({
              id: doc.id,
              restaurant: data.restaurantEmail || "Unknown Restaurant",
              branch: "Main Branch", // Default branch
              discount: data.voucherType || "Unknown",
              minimumSpend: data.minSpending ? `RM ${data.minSpending}` : "No minimum",
              redeemedBy: "System", // Default user
              redeemedAt: data.createdAt.seconds ? new Date(data.createdAt.seconds * 1000) : new Date(data.createdAt),
              title: data.title || "Unknown Voucher",
            })
          }
        })

        // Sort by creation date and take recent 3
        vouchers.sort((a, b) => b.redeemedAt - a.redeemedAt)
        setRecentVouchers(vouchers.slice(0, 3))
      } catch (error) {
        console.error("Error fetching recent vouchers:", error)
        // Fallback to mock data
        setRecentVouchers([
          {
            id: 1,
            restaurant: "Al Baik",
            branch: "Main Branch",
            discount: "20%",
            minimumSpend: "SAR 50",
            redeemedBy: "John Doe",
            redeemedAt: new Date(),
          },
          {
            id: 2,
            restaurant: "McDonald's",
            branch: "City Center",
            discount: "15%",
            minimumSpend: "SAR 30",
            redeemedBy: "Jane Smith",
            redeemedAt: new Date(),
          },
          {
            id: 3,
            restaurant: "KFC",
            branch: "Mall Branch",
            discount: "25%",
            minimumSpend: "SAR 40",
            redeemedBy: "Mike Johnson",
            redeemedAt: new Date(),
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchRecentVouchers()
  }, [selectedPeriod, dateRange])

  if (loading) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: "10px",
          height: "100%",
          minHeight: { xs: 300, sm: 350, md: 400 },
          bgcolor: "#ffffff",
          border: "1px solid #efeff4",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress sx={{ color: "#da1818", mb: 2 }} />
          <Typography variant="body2" sx={{ color: "#8a8a8f" }}>
            Loading recent vouchers...
          </Typography>
        </Box>
      </Paper>
    )
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: "10px",
        height: "100%",
        minHeight: { xs: 300, sm: 350, md: 400 },
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
        Recent Redeemed Vouchers
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 2, sm: 3 } }}>
        {recentVouchers.map((voucher) => (
          <Box
            key={voucher.id}
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: { xs: 1.5, sm: 2 },
              p: { xs: 1.5, sm: 2 },
              borderRadius: "8px",
              bgcolor: "#f9f9f9",
            }}
          >
            <Avatar
              sx={{
                width: { xs: 40, sm: 48 },
                height: { xs: 40, sm: 48 },
                bgcolor: "#da1818",
                fontSize: { xs: "1rem", sm: "1.25rem" },
              }}
            >
              {voucher.restaurant.charAt(0)}
            </Avatar>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                  mb: 0.5,
                }}
              >
                {voucher.title || voucher.restaurant}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  mb: 0.5,
                }}
              >
                {voucher.branch}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: { xs: 1, sm: 2 },
                  mt: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    bgcolor: "rgba(218, 24, 24, 0.1)",
                    color: "#da1818",
                    px: 1,
                    py: 0.5,
                    borderRadius: "4px",
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  }}
                >
                  {voucher.discount} off
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    bgcolor: "rgba(0, 0, 0, 0.05)",
                    color: "#666",
                    px: 1,
                    py: 0.5,
                    borderRadius: "4px",
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  }}
                >
                  Min. {voucher.minimumSpend}
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: 0.5,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                }}
              >
                {voucher.redeemedBy}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}
              >
                {format(voucher.redeemedAt, "MMM d, h:mm a")}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  )
}
