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

const toMillis = (value) => {
  if (!value) return null
  if (typeof value === "number") {
    return value > 1e12 ? value : value * 1000
  }
  if (value instanceof Date) {
    return value.getTime()
  }
  if (typeof value === "string") {
    const parsed = Date.parse(value)
    return Number.isNaN(parsed) ? null : parsed
  }
  if (typeof value === "object") {
    // Handle Firestore Timestamp with toMillis method
    if (typeof value.toMillis === "function") {
      return value.toMillis()
    }
    // Handle Firestore Timestamp with toDate method
    if (typeof value.toDate === "function") {
      return value.toDate().getTime()
    }
    // Handle Firestore Timestamp with seconds property
    if (typeof value.seconds === "number") {
      const milliseconds = value.seconds * 1000
      // Also check for nanoseconds if available
      const nanoseconds = value.nanoseconds || 0
      return milliseconds + Math.floor(nanoseconds / 1000000)
    }
  }
  return null
}

const drawerWidth = 240

export default function MembersPage() {
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
        // Fetch referrals first to create email to userId map
        const referralsSnap = await getDocs(collection(db, "referrals"))
        const emailToReferralId = new Map()
        referralsSnap.forEach((referralDoc) => {
          const referralData = referralDoc.data() || {}
          const referralEmail = (referralData.email || "").toLowerCase().trim()
          if (referralEmail) {
            emailToReferralId.set(referralEmail, referralDoc.id)
          }
        })

        // Fetch all bowls data for all referrals
        const emailToGoldenBowlCount = new Map()
        for (const referralDoc of referralsSnap.docs) {
          const referralId = referralDoc.id
          const referralData = referralDoc.data() || {}
          const referralEmail = (referralData.email || "").toLowerCase().trim()
          
          if (referralEmail) {
            try {
              // Check if there's a direct balance field in the referral document FIRST
              const directBalance = Number(
                referralData.bowls || 
                referralData.bowlBalance || 
                referralData.currentBalance ||
                referralData.totalBowls ||
                referralData.goldenBowls ||
                referralData.goldenBowlCount ||
                0
              )
              
              // Always check the referral document balance first
              if (directBalance > 0) {
                emailToGoldenBowlCount.set(referralEmail, directBalance)
                continue
              }
              
              // If no direct balance, check the bowls subcollection
              const bowlsSnap = await getDocs(collection(db, "referrals", referralId, "bowls"))
              let totalEarned = 0
              let totalRedeemed = 0
              
              if (bowlsSnap.size === 0) {
                // No bowls subcollection and no direct balance, set to 0
                emailToGoldenBowlCount.set(referralEmail, 0)
                continue
              }
              
              // Check if there's a single balance document (some structures store balance in one doc)
              if (bowlsSnap.size === 1) {
                const singleDoc = bowlsSnap.docs[0]
                const singleDocData = singleDoc.data() || {}
                
                const singleBalance = Number(
                  singleDocData.balance ||
                  singleDocData.currentBalance ||
                  singleDocData.total ||
                  singleDocData.bowls ||
                  singleDocData.amount ||
                  0
                )
                
                if (singleBalance > 0) {
                  emailToGoldenBowlCount.set(referralEmail, singleBalance)
                  continue
                }
              }
              
              // Process multiple transaction documents
              bowlsSnap.forEach((bowlDoc) => {
                const bowlData = bowlDoc.data() || {}
                
                // Check for direct balance field first
                const balance = Number(
                  bowlData.balance ||
                  bowlData.currentBalance ||
                  bowlData.total ||
                  0
                )
                
                if (balance > 0) {
                  // If there's a balance field, use it directly
                  totalEarned = balance
                  totalRedeemed = 0
                  return
                }
                
                // Try multiple field names for the amount
                const bowlsAmount = Number(
                  bowlData.bowls || 
                  bowlData.amount || 
                  bowlData.quantity ||
                  bowlData.value ||
                  bowlData.count ||
                  0
                )
                
                // Try multiple field names for the type
                const type = (
                  bowlData.type || 
                  bowlData.transactionType ||
                  bowlData.action ||
                  ""
                ).toLowerCase()
                
                if (type === "earned" || type === "earn" || !type || type === "") {
                  totalEarned += bowlsAmount
                } else if (type === "redeemed" || type === "redeem" || type === "used") {
                  totalRedeemed += bowlsAmount
                }
              })
              
              const currentBalance = Math.max(0, totalEarned - totalRedeemed)
              emailToGoldenBowlCount.set(referralEmail, currentBalance)
            } catch (error) {
              console.error(`Error fetching bowls for referral ${referralId}:`, error)
              emailToGoldenBowlCount.set(referralEmail, 0)
            }
          }
        }
        

        const snap = await getDocs(collection(db, "members"))
        const rows = []
        const emailToName = {}
        snap.forEach((doc) => {
          const data = doc.data() || {}
          const redeemedList = Array.isArray(data.redeemedvouchers) ? data.redeemedvouchers : []

          const createdTimestamp =
            toMillis(data.timestamp) ??
            toMillis(data.createdAt) ??
            toMillis(data.createdDate) ??
            (typeof doc.createTime?.toMillis === "function" ? doc.createTime.toMillis() : null)

          // Extract lastSubscription data if available
          const lastSubscription = data.lastSubscription || {}
          

          // Use lastSubscription.expiryDate if available, otherwise fall back to other fields
          const membershipExpiryTimestamp =
            (lastSubscription.expiryDate ? toMillis(lastSubscription.expiryDate) : null) ??
            toMillis(data.membershipExpiryDate) ??
            toMillis(data.membershipExpiry) ??
            toMillis(data.subscriptionExpiryDate)

          // Extract dateOfSubscription from lastSubscription if available
          const dateOfSubscriptionTimestamp = lastSubscription.dateOfSubscription 
            ? toMillis(lastSubscription.dateOfSubscription) 
            : null
          
          const dateOfSubscriptionDisplay = dateOfSubscriptionTimestamp
            ? new Date(dateOfSubscriptionTimestamp).toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "-"

          const dateJoinedDisplay = createdTimestamp
            ? new Date(createdTimestamp).toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "-"

          const membershipExpiryDisplay = membershipExpiryTimestamp
            ? new Date(membershipExpiryTimestamp).toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "-"

          // Use lastSubscription.typeOfSubscription if available, otherwise fall back to other fields
          const membershipPlan = (lastSubscription.typeOfSubscription && lastSubscription.typeOfSubscription.trim()) 
            ? lastSubscription.typeOfSubscription 
            : (data.membershipPlan || data.subscriptionPlan || "N/A")

          const email = data.email || doc.id || "-"
          const name = data.name || "-"
          
          // Get Golden Bowl count from referrals/{userId}/bowls
          const memberEmailLower = (email || "").toLowerCase().trim()
          const goldenBowlCount = emailToGoldenBowlCount.has(memberEmailLower) 
            ? emailToGoldenBowlCount.get(memberEmailLower) 
            : 0

          rows.push({
            id: doc.id || email,
            name,
            gender: data.gender || data.memberGender || "N/A",
            email,
            mobile: data.mobileNumber || data.phone || "-",
            phone: data.mobileNumber || data.phone || "-",
            vouchers: redeemedList.length || 0,
            redeemed: redeemedList.length || 0,
            dateJoinedDisplay,
            dateJoinedValue: createdTimestamp || 0,
            joinDate: dateJoinedDisplay,
            membershipPlan,
            membershipExpiryDisplay,
            membershipExpiryValue: membershipExpiryTimestamp || 0,
            dateOfSubscriptionDisplay,
            dateOfSubscriptionValue: dateOfSubscriptionTimestamp || 0,
            transactionId: lastSubscription.transactionId || "-",
            goldenBowl: goldenBowlCount,
            status: data.status || "Active",
          })
          if (data.email) emailToName[data.email] = name || data.email
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
                <MembersTable members={membersData} />
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
