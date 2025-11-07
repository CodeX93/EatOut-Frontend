"use client"

import { useState, useEffect } from "react"
import { Box, CircularProgress, Typography } from "@mui/material"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../../firebaseConfig"

// Components
import AppLayout from "../components/AppLayout"
import MembersTable from "./components/MembersTable"
import TopSpenders from "./components/TopSpenders"
import MostFrequentUsers from "./components/MostFrequentUsers"
import VoucherRedemptions from "./components/VoucherRedemptions"

const drawerWidth = 240

export default function MembersPage() {
  const [sortBy, setSortBy] = useState("Name")
  const [relevantFilter, setRelevantFilter] = useState("Relevant")
  const [membersData, setMembersData] = useState([])
  const [loading, setLoading] = useState(true)
  const [topSpenders, setTopSpenders] = useState([])
  const [frequentUsers, setFrequentUsers] = useState([])
  const [voucherRedemptions, setVoucherRedemptions] = useState([])

  // Load members from Firestore
  useEffect(() => {
    const loadMembers = async () => {
      setLoading(true)
      try {
        const snap = await getDocs(collection(db, "members"))
        const rows = []
        const emailToName = {}
        snap.forEach((doc) => {
          const data = doc.data() || {}
          const redeemedList = Array.isArray(data.redeemedvouchers) ? data.redeemedvouchers : []
          const joinDate = data.timestamp?.toDate ? data.timestamp.toDate().toISOString().slice(0, 10) : (data.updatedAt ? String(data.updatedAt).slice(0, 10) : "-")
          rows.push({
            id: doc.id || data.email || "-",
            name: data.name || "-",
            phone: data.mobileNumber || data.phone || "-",
            vouchers: redeemedList.length || 0,
            redeemed: redeemedList.length || 0,
            joinDate,
            status: "Active",
          })
          if (data.email) emailToName[data.email] = data.name || data.email
        })
        setMembersData(rows)

        // After members loaded, compute aggregated metrics from voucher redemptions
        // Using REAL data - no fake $85 calculations
        const vouchersSnap = await getDocs(collection(db, "voucher"))
        const userAgg = new Map()

        for (const vDoc of vouchersSnap.docs) {
          const v = vDoc.data() || {}
          const voucherType = v.voucherType || ""
          const value = v.valueOfSavings ?? 0
          const minSpending = Number(v.minSpending) || 0 // Use voucher's actual minSpending requirement
          
          const redeemedSnap = await getDocs(collection(db, "voucher", vDoc.id, "redeemedUsers"))
          redeemedSnap.forEach((ru) => {
            const r = ru.data() || {}
            const email = r.userEmail || r.email
            if (!email) return
            const used = r.used === true || r.used === false ? r.used : true
            if (!used) return
            const redeemedAt = typeof r.redeemedAt === 'number' ? new Date(r.redeemedAt) : (v.expiryDate ? new Date(v.expiryDate) : null)

            // Use actual order amount if available, otherwise estimate from minSpending
            const estimatedOrderValue = r.actualOrderAmount || minSpending

            let discount = 0
            if (voucherType === "Percentage Discount") {
              discount = (estimatedOrderValue * value) / 100
            } else if (voucherType === "Fixed Amount Discount" || voucherType === "Cash Voucher") {
              discount = Number(value) || 0
            } else {
              discount = 0
            }

            let agg = userAgg.get(email)
            if (!agg) {
              agg = { orders: 0, estimatedSpending: 0, totalDiscount: 0, lastOrder: null, hasRealData: false }
              userAgg.set(email, agg)
            }
            agg.orders += 1
            agg.estimatedSpending += estimatedOrderValue
            agg.totalDiscount += discount
            if (r.actualOrderAmount) agg.hasRealData = true // Track if any real data exists
            if (redeemedAt && (!agg.lastOrder || redeemedAt > agg.lastOrder)) agg.lastOrder = redeemedAt
          })
        }

        const ranked = Array.from(userAgg.entries()).map(([email, a]) => ({
          email,
          name: emailToName[email] || email,
          orders: a.orders,
          totalSpent: a.hasRealData 
            ? `$${a.estimatedSpending.toFixed(2)}` 
            : `~$${a.estimatedSpending.toFixed(2)} (est)`, // Mark as estimated if no real data
          totalDiscount: `$${a.totalDiscount.toFixed(2)}`,
          lastOrder: a.lastOrder ? a.lastOrder.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : '-',
          spendingValue: a.estimatedSpending, // For sorting
        }))

        const topBySpend = [...ranked]
          .sort((x, y) => y.spendingValue - x.spendingValue)
          .slice(0, 5)
          .map((u, i) => ({ rank: i + 1, name: u.name, email: u.email, totalSpent: u.totalSpent, orders: u.orders, lastOrder: u.lastOrder }))

        const topByOrders = [...ranked]
          .sort((x, y) => y.orders - x.orders)
          .slice(0, 5)
          .map((u, i) => ({ rank: i + 1, name: u.name, email: u.email, totalSpent: u.totalSpent, orders: u.orders, lastOrder: u.lastOrder }))

        const topByRedemptions = [...ranked]
          .sort((x, y) => y.orders - x.orders)
          .slice(0, 5)
          .map((u, i) => ({ rank: i + 1, name: u.name, email: u.email, vouchers: u.orders, discount: u.totalDiscount, ordered: u.orders }))

        setTopSpenders(topBySpend)
        setFrequentUsers(topByOrders)
        setVoucherRedemptions(topByRedemptions)
      } catch (e) {
        console.error("Failed to load members", e)
        setMembersData([])
      } finally {
        setLoading(false)
      }
    }
    loadMembers()
  }, [])

  // Mock data removed - now using live data from Firestore

  if (loading) {
    return (
      <AppLayout>
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            width: "100%",
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <CircularProgress sx={{ color: "#da1818", mb: 2 }} />
            <Typography variant="h6" sx={{ color: "#8a8a8f" }}>
              Loading members data...
            </Typography>
          </Box>
        </Box>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <Box
        sx={{
          flex: 1,
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Content Container with Scroll */}
        <Box
          sx={{
            flex: 1,
            p: { xs: 2, sm: 2.5, md: 3 },
            pt: { xs: 3, sm: 3, md: 3 },
            overflow: "auto",
            height: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", xl: "row" },
              gap: { xs: 2, md: 3 },
              height: "100%",
              minHeight: "fit-content",
            }}
          >
            {/* Main Table Section */}
            <Box
              sx={{
                flex: { xl: "1 1 65%" },
                width: { xs: "100%", xl: "65%" },
                display: "flex",
                flexDirection: "column",
                minHeight: { xs: "auto", xl: "100%" },
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  minHeight: 0,
                }}
              >
                <MembersTable
                  members={membersData}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  relevantFilter={relevantFilter}
                  setRelevantFilter={setRelevantFilter}
                />
              </Box>
            </Box>

            {/* Right Panel */}
            <Box
              sx={{
                flex: { xl: "1 1 35%" },
                width: { xs: "100%", xl: "35%" },
                display: "flex",
                flexDirection: "column",
                gap: { xs: 2, md: 3 },
                minHeight: { xs: "auto", xl: "100%" },
              }}
            >
              <TopSpenders topSpenders={topSpenders} />
              <MostFrequentUsers frequentUsers={frequentUsers} />
              <VoucherRedemptions voucherRedemptions={voucherRedemptions} />
            </Box>
          </Box>
        </Box>
      </Box>
    </AppLayout>
  )
}
