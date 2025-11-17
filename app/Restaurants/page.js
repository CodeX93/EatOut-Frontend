"use client"

import { useState, useEffect } from "react"
import { Box, Typography, CircularProgress } from "@mui/material"
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore"
import { db } from "../../firebaseConfig"

// Import layout components
import AppLayout from "../components/AppLayout"

// Import all the modular restaurant components
import RestaurantsTable from "./components/RestaurantsTable"
import PopularRestaurantsCard from "./components/PopularRestaurantsCard"
import PopularVouchersCard from "./components/PopularVouchersCard"
import RatingReviewsCard from "./components/RatingReviewsCard"
import TopVouchersCard from "./components/TopVouchersCard"

const drawerWidth = 240

// Mock API functions - replace with real API calls
const fetchRestaurants = async () => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return [
    {
      id: 1,
      name: "Scenic Brewing Company",
      address: "334 Rosewood Dr, Deptford, NJ 08096",
      location: "London",
      phone: "(60) 626-2021",
      vouchers: 12,
      redeemed: 6,
    },
    {
      id: 2,
      name: "Bourbon Streets Sports Bar",
      address: "1 3rd St, Hobey Carrigan, MT 5",
      location: "New York",
      phone: "(60) 626-2021",
      vouchers: 8,
      redeemed: 4,
    },
    {
      id: 3,
      name: "Beerhaus",
      address: "1 3rd St, Hobey Carrigan, MT 5",
      location: "Chicago",
      phone: "(60) 626-2021",
      vouchers: 15,
      redeemed: 10,
    },
    // Add more restaurants as needed
  ]
}

// Compute popular restaurants based on voucher usage
const computeTimeWindowMs = (period) => {
  const now = Date.now()
  switch (period) {
    case "Today":
      return now - 24 * 60 * 60 * 1000
    case "Week":
      return now - 7 * 24 * 60 * 60 * 1000
    case "Year":
      return now - 365 * 24 * 60 * 60 * 1000
    case "All":
      return 0
    case "Month":
    default:
      return now - 30 * 24 * 60 * 60 * 1000
  }
}

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
    if (typeof value.seconds === "number") {
      return value.seconds * 1000
    }
    if (typeof value.toDate === "function") {
      return value.toDate().getTime()
    }
  }
  return null
}

const fetchPopularRestaurants = async (period, emailToNameMap = {}) => {
  const fromTs = computeTimeWindowMs(period)

  // Aggregate usage from vouchers' redeemedUsers
  const vouchersSnap = await getDocs(collection(db, "voucher"))

  const emailToStats = new Map()
  const normalizeEmail = (e) => (e || "").toLowerCase().trim()

  for (const voucherDoc of vouchersSnap.docs) {
    const voucherData = voucherDoc.data() || {}
    const restaurantEmail = normalizeEmail(voucherData.restaurantEmail || "unknown")
    const isDebugEmail = (restaurantEmail || "").toLowerCase().trim() === "nanyangcafe@gmail.com" || (restaurantEmail || "").toLowerCase().trim() === "mmm@gmail.com"
    let debugVoucher = { id: voucherDoc.id, createdAt: voucherData.createdAt, quantity: voucherData.quantity, available: voucherData.available, countedFromRedeemedUsers: 0, countedFromFallback: 0 }
    // Load redeemedUsers for this voucher
    try {
      const redeemedSnap = await getDocs(collection(db, "voucher", voucherDoc.id, "redeemedUsers"))
      let stats = emailToStats.get(restaurantEmail)
      if (!stats) {
        stats = { orders: 0, memberSet: new Set() }
        emailToStats.set(restaurantEmail, stats)
      }
      redeemedSnap.forEach((ru) => {
        const r = ru.data() || {}
        // Robust timestamp parsing (supports number ms/seconds, Firestore Timestamp, Date string)
        let redeemedAtMs = 0
        const val = r.redeemedAt ?? r.validUntil ?? r.updatedAt ?? r.createdAt
        if (typeof val === 'number') {
          redeemedAtMs = val > 1e12 ? val : val * 1000
        } else if (val && typeof val.toDate === 'function') {
          redeemedAtMs = val.toDate().getTime()
        } else if (val && typeof val.seconds === 'number') {
          redeemedAtMs = val.seconds * 1000
        } else if (typeof val === 'string') {
          const t = Date.parse(val)
          redeemedAtMs = isNaN(t) ? 0 : t
        } else if (voucherData.createdAt?.seconds) {
          redeemedAtMs = voucherData.createdAt.seconds * 1000
        }

        const used = r.used === true || r.used === false ? r.used : true
        if (redeemedAtMs >= fromTs && used) {
          stats.orders += 1
          if (r.userEmail) stats.memberSet.add(r.userEmail)
        }
      })

      // Fallback: if no redeemedUsers found for this voucher, try voucher-level counters
      if (redeemedSnap.size === 0) {
        const quantity = Number(voucherData.quantity ?? 0)
        const available = Number(voucherData.available ?? quantity)
        const voucherUsed = Math.max(0, quantity - available)
        // If voucher has createdAt within window, include its used count as approximate orders
        let createdMs = 0
        const c = voucherData.createdAt
        if (c && typeof c.toDate === 'function') createdMs = c.toDate().getTime()
        else if (c && typeof c.seconds === 'number') createdMs = c.seconds * 1000
        else if (typeof c === 'number') createdMs = c > 1e12 ? c : c * 1000
        if (voucherUsed > 0 && createdMs >= fromTs) {
          stats.orders += voucherUsed
        }
      }
    } catch (e) {
      // Ignore subcollection errors for robustness
      // console.warn("Failed loading redeemedUsers for", voucherDoc.id, e)
    }
  }

  // Build ranked list (using REAL data - no fake revenue calculations)
  // Debug: surface stats for specific restaurants if present
  const debugEmails = new Set(["nanyangcafe@gmail.com", "mmm@gmail.com"]) 
  emailToStats.forEach((s, email) => {
    if (debugEmails.has(email)) {
      console.log("PopularRestaurants Debug:", { email, orders: s.orders, uniqueMembers: s.memberSet.size, period, fromTs })
    }
  })

  const results = Array.from(emailToStats.entries())
    .map(([email, s]) => {
      const members = s.memberSet.size
      const orders = s.orders
      // Show order count instead of fake revenue
      // NOTE: To show real revenue, add actualOrderAmount to redemption records
      const revenue = `${orders} orders` // Real count, not fake dollar amount
      // Approximate rating from redemption density, clamp between 3.5 and 5.0
      const rating = Math.max(3.5, Math.min(5.0, 3.5 + (orders / Math.max(50, members * 5))))
      return {
        id: email,
        name: emailToNameMap[normalizeEmail(email)] || email,
        rating: Number(rating.toFixed(1)),
        reviews: members,
        revenue, // Now shows "X orders" instead of fake "$X,XXX"
        highlighted: false,
        orders,
        members,
      }
    })
    .sort((a, b) => b.orders - a.orders || b.rating - a.rating)
    .slice(0, 5)

  // Highlight the top 1
  if (results[1]) results[1].highlighted = true
  return results
}

const fetchPopularVouchers = async (period) => {
  const fromTs = computeTimeWindowMs(period)
  // Load vouchers and count recent redemptions
  const vouchersSnap = await getDocs(collection(db, "voucher"))
  const results = []

  for (const vDoc of vouchersSnap.docs) {
    const vData = vDoc.data() || {}
    const restaurantEmail = (vData.restaurantEmail || "").toLowerCase().trim()
    const isDebugEmail = restaurantEmail === "nanyangcafe@gmail.com" || restaurantEmail === "mmm@gmail.com"
    let usedCountWindow = 0
    let debugVoucher = { id: vDoc.id, countedFromRedeemedUsers: 0, countedFromFallback: 0 }
    try {
      const redeemedSnap = await getDocs(collection(db, "voucher", vDoc.id, "redeemedUsers"))
      redeemedSnap.forEach((ru) => {
        const r = ru.data() || {}
        // Robust timestamp parsing
        let redeemedAtMs = 0
        const val = r.redeemedAt ?? r.validUntil ?? r.updatedAt ?? r.createdAt
        if (typeof val === 'number') redeemedAtMs = val > 1e12 ? val : val * 1000
        else if (val && typeof val.toDate === 'function') redeemedAtMs = val.toDate().getTime()
        else if (val && typeof val.seconds === 'number') redeemedAtMs = val.seconds * 1000
        else if (typeof val === 'string') {
          const t = Date.parse(val); redeemedAtMs = isNaN(t) ? 0 : t
        }
        const used = r.used === true || r.used === false ? r.used : true
        if (redeemedAtMs >= fromTs && used) {
          usedCountWindow += 1
          debugVoucher.countedFromRedeemedUsers += 1
        }
      })
      // Fallback: approximate by quantity-available and last activity time from voucher-level fields
      if (redeemedSnap.size === 0) {
        const quantity = Number(vData.quantity ?? 0)
        const available = Number(vData.available ?? quantity)
        const usedApprox = Math.max(0, quantity - available)

        // Derive lastActivityMs from various voucher fields (createdAt, expiryDate)
        const candidates = []
        const pushTs = (val) => {
          if (typeof val === 'number') candidates.push(val > 1e12 ? val : val * 1000)
          else if (val && typeof val.toDate === 'function') candidates.push(val.toDate().getTime())
          else if (val && typeof val.seconds === 'number') candidates.push(val.seconds * 1000)
          else if (typeof val === 'string') { const t = Date.parse(val); if (!isNaN(t)) candidates.push(t) }
        }
        pushTs(vData.updatedAt)
        pushTs(vData.createdAt)
        pushTs(vData.expiryDate)
        const lastActivityMs = candidates.length ? Math.max(...candidates) : 0

        if (usedApprox > 0 && lastActivityMs >= fromTs) {
          usedCountWindow += usedApprox
          debugVoucher.countedFromFallback += usedApprox
        }
      }
    } catch (e) {
      // ignore
    }
    if (isDebugEmail && (debugVoucher.countedFromRedeemedUsers > 0 || debugVoucher.countedFromFallback > 0)) {
      console.log("TopVouchers Debug voucher:", restaurantEmail, debugVoucher)
    }

    // Only include vouchers with at least one use in window
    if (usedCountWindow > 0) {
      const voucherType = vData.voucherType || ""
      const value = vData.valueOfSavings ?? ""
      const discount = voucherType === "Percentage Discount" ? `${value}%` : `${value}`
      results.push({
        id: vDoc.id,
        restaurant: vData.restaurantEmail || "Unknown",
        discount,
        expiry: vData.expiryDate ? new Date(vData.expiryDate).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : "",
        voucherCode: vData.voucherId || vDoc.id,
        usedCountWindow,
      })
    }
  }

  return results
    .sort((a, b) => b.usedCountWindow - a.usedCountWindow)
    .slice(0, 5)
}

export default function Restaurants() {
  // State management
  const [restaurantsData, setRestaurantsData] = useState([])
  const [popularRestaurantsData, setPopularRestaurantsData] = useState([])
  const [popularVouchersData, setPopularVouchersData] = useState([])
  const [loading, setLoading] = useState(true)
  const [popularRestaurantsLoading, setPopularRestaurantsLoading] = useState(false)
  const [popularVouchersLoading, setPopularVouchersLoading] = useState(false)
  const [reviewsStats, setReviewsStats] = useState({ rating: 0, pos: 0, neg: 0, label: "Reviews" })

  // Static data that doesn't change often
  const topVouchersData = [
    { id: 1, name: "Gloria Jeans", rating: "5 rating" },
    { id: 2, name: "Star Bucks", rating: "4.9 rating" },
    { id: 3, name: "Al Baik", rating: "4.8 rating" },
  ]

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true)
      try {
        // Fetch restaurants from Firestore
        const querySnapshot = await getDocs(collection(db, "registeredRestaurants"))
        const restaurants = []
        querySnapshot.forEach((doc) => {
          const data = doc.data() || {}
          const branches = Array.isArray(data.branches) ? data.branches : []
          const primaryBranch = branches[0] || {}
          const address = data.fullAddress || data.address || primaryBranch.fullAddress || "-"
          const location = data.city || primaryBranch.city || "-"
          const phone = data.phone || primaryBranch.telephone || "-"

          const createdTimestamp =
            toMillis(data.createdAt) ??
            toMillis(data.createdDate) ??
            toMillis(primaryBranch?.createdAt) ??
            (typeof doc.createTime?.toMillis === "function" ? doc.createTime.toMillis() : null)

          const membershipExpiryTimestamp =
            toMillis(data.membershipExpiryDate) ??
            toMillis(data.membershipExpiry) ??
            toMillis(primaryBranch?.membershipExpiryDate)

          restaurants.push({
            id: doc.id,
            name: data.restaurantName || data.name || "-",
            address,
            location,
            phone,
            cuisines: Array.isArray(data.cuisines) ? data.cuisines : [],
            facilities: Array.isArray(data.facilities) ? data.facilities : [],
            price: data.price || "-",
            email: data.email || doc.id,
            latitude: data.latitude ?? null,
            longitude: data.longitude ?? null,
            branches,
            vouchers: 0,
            redeemed: 0,
            gender: data.primaryContactGender || data.ownerGender || "N/A",
            mobile: data.mobileNumber || primaryBranch.telephone || phone || "-",
            dateJoinedDisplay: createdTimestamp
              ? new Date(createdTimestamp).toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "-",
            dateJoinedValue: createdTimestamp || 0,
            membershipPlan: data.membershipPlan || "N/A",
            membershipExpiryDisplay: membershipExpiryTimestamp
              ? new Date(membershipExpiryTimestamp).toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "-",
            membershipExpiryValue: membershipExpiryTimestamp || 0,
            goldenBowl: Number(data.goldenBowlCount ?? data.loyaltyPoints ?? 0),
          })
        })
        // Derive vouchers and redeemed counts per restaurant from backend
        const restaurantsWithStats = await Promise.all(
          restaurants.map(async (r) => {
            try {
              if (!r.email) return r
              const vq = query(collection(db, "voucher"), where("restaurantEmail", "==", r.email))
              const vouchersSnap = await getDocs(vq)
              let voucherCount = vouchersSnap.size
              let redeemedCount = 0
              for (const vDoc of vouchersSnap.docs) {
                try {
                  const redeemedSnap = await getDocs(collection(db, "voucher", vDoc.id, "redeemedUsers"))
                  redeemedSnap.forEach((ru) => {
                    const ruData = ru.data() || {}
                    const used = ruData.used === true || ruData.used === false ? ruData.used : true
                    if (used) redeemedCount += 1
                  })
                } catch (_) {}
              }
              return { ...r, vouchers: voucherCount, redeemed: redeemedCount }
            } catch {
              return r
            }
          })
        )

        // Build a map from email to restaurantName for nicer labels
        const emailToName = restaurantsWithStats.reduce((acc, r) => {
          if (r.email) acc[r.email] = r.name
          return acc
        }, {})

        // Compute simple reviews metrics for the first restaurant (or a chosen primary)
        let firstRestaurantEmail = restaurants[0]?.email || null
        let reviewsAgg = { rating: 0, pos: 0, neg: 0, count: 0 }
        if (firstRestaurantEmail) {
          try {
            const reviewsCol = collection(db, "registeredRestaurants", firstRestaurantEmail, "reviews")
            const reviewsSnap = await getDocs(reviewsCol)
            reviewsSnap.forEach((r) => {
              const d = r.data() || {}
              const stars = Number(d.rating ?? 0)
              if (!isNaN(stars) && stars > 0) {
                reviewsAgg.rating += stars
                reviewsAgg.count += 1
                if (stars >= 4) reviewsAgg.pos += 1
                else if (stars <= 2) reviewsAgg.neg += 1
              }
            })
          } catch (_) {}
        }
        const avgRating = reviewsAgg.count > 0 ? reviewsAgg.rating / reviewsAgg.count : 0
        const posPct = reviewsAgg.count > 0 ? Math.round((reviewsAgg.pos / reviewsAgg.count) * 100) : 0
        const negPct = reviewsAgg.count > 0 ? Math.round((reviewsAgg.neg / reviewsAgg.count) * 100) : 0
        setReviewsStats({ rating: Number(avgRating.toFixed(2)), pos: posPct, neg: negPct, label: restaurants[0]?.name ? `${restaurants[0].name} Reviews` : "Reviews" })

        const [popularRestaurants, popularVouchers] = await Promise.all([
          fetchPopularRestaurants("Month", emailToName),
          fetchPopularVouchers("Month"),
        ])
        setRestaurantsData(restaurantsWithStats)
        setPopularRestaurantsData(popularRestaurants)
        setPopularVouchersData(popularVouchers)
      } catch (error) {
        console.error("Error loading data:", error)
        // Handle error state here
      } finally {
        setLoading(false)
      }
    }
    loadInitialData()
  }, [])

  // Event handlers for period changes
  const handlePopularRestaurantsPeriodChange = async (period) => {
    console.log("Popular restaurants period changed to:", period)

    setPopularRestaurantsLoading(true)
    try {
      const emailToName = restaurantsData.reduce((acc, r) => {
        if (r.email) acc[r.email] = r.name
        return acc
      }, {})
      const data = await fetchPopularRestaurants(period, emailToName)
      setPopularRestaurantsData(data)
    } catch (error) {
      console.error("Error fetching popular restaurants:", error)
    } finally {
      setPopularRestaurantsLoading(false)
    }
  }

  const handlePopularVouchersPeriodChange = async (period) => {
    console.log("Popular vouchers period changed to:", period)

    setPopularVouchersLoading(true)
    try {
      const data = await fetchPopularVouchers(period)
      setPopularVouchersData(data)
    } catch (error) {
      console.error("Error fetching popular vouchers:", error)
    } finally {
      setPopularVouchersLoading(false)
    }
  }

  // Show loading state
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
            <Typography
              variant="h6"
              sx={{
                color: "#8a8a8f",
                fontSize: { xs: "1rem", sm: "1.25rem" },
              }}
            >
              Loading restaurants data...
            </Typography>
          </Box>
        </Box>
      </AppLayout>
    )
  }

  // Calculate dynamic subtitle
  const dynamicSubtitle = `${restaurantsData.length} Restaurants from 6 Categories`

  return (
    <AppLayout>
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          height: "auto",
          minHeight: "100%",
        }}
      >
        {/* Content Container with Scroll */}
        <Box
          sx={{
            flex: 1,
            p: { xs: 1, sm: 1.5, md: 2, lg: 3 },
            overflow: "visible",
            height: "auto",
          }}
        >
          {/* Page Header */}
          <Box sx={{ 
            mb: { xs: 2, sm: 2.5, md: 3 }, 
            flexShrink: 0,
            px: { xs: 0.5, sm: 0 }
          }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                color: "#da1818",
                fontSize: { 
                  xs: "1.25rem", 
                  sm: "1.5rem", 
                  md: "1.75rem", 
                  lg: "2rem",
                  xl: "2.125rem" 
                },
                lineHeight: 1.2,
                mb: { xs: 1, sm: 1.5, md: 2 },
              }}
            >
              Restaurants Overview
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#8a8a8f",
                fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
                lineHeight: 1.4,
              }}
            >
              {dynamicSubtitle}
            </Typography>
          </Box>

          {/* Main Layout Container */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", lg: "row" },
              gap: { xs: 2, sm: 2.5, md: 3, lg: 3 },
              height: "100%",
              minHeight: "fit-content",
            }}
          >
            {/* Left Column - Main Content */}
            <Box
              sx={{
                flex: { lg: "1 1 65%" },
                width: { xs: "100%", lg: "65%" },
                display: "flex",
                flexDirection: "column",
                minHeight: { xs: "auto", lg: "100%" },
                order: { xs: 2, lg: 1 },
              }}
            >
              {/* Restaurants Table */}
              <Box
                sx={{
                  flex: 1,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  minHeight: { xs: "400px", sm: "500px", lg: "600px" },
                }}
              >
                <RestaurantsTable 
                  restaurants={restaurantsData} 
                  title="Restaurant List" 
                  subtitle={dynamicSubtitle} 
                />
              </Box>
            </Box>

            {/* Right Column - Sidebar Cards */}
            <Box
              sx={{
                flex: { lg: "1 1 35%" },
                width: { xs: "100%", lg: "35%" },
                display: "flex",
                flexDirection: "column",
                gap: { xs: 1.5, sm: 2, md: 2.5, lg: 3 },
                minHeight: { xs: "auto", lg: "auto" },
                maxHeight: { xs: "none", lg: "none" },
                overflowY: "visible",
                order: { xs: 1, lg: 2 },
              }}
            >
              {/* Popular Restaurants Card */}
              <Box sx={{ 
                flexShrink: 0,
                minHeight: { xs: "200px", sm: "220px", md: "240px" }
              }}>
                <PopularRestaurantsCard
                  restaurants={popularRestaurantsData}
                  title="Popular Restaurants"
                  onPeriodChange={handlePopularRestaurantsPeriodChange}
                  loading={popularRestaurantsLoading}
                />
              </Box>

              {/* Popular Vouchers Card */}
              <Box sx={{ 
                flexShrink: 0,
                minHeight: { xs: "200px", sm: "220px", md: "240px" }
              }}>
                <PopularVouchersCard
                  vouchers={popularVouchersData}
                  title="Popular Vouchers"
                  onPeriodChange={handlePopularVouchersPeriodChange}
                  loading={popularVouchersLoading}
                />
              </Box>

              {/* Bottom Row - Rating Reviews + Top Vouchers */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1fr 1fr",
                    md: "1fr",
                    lg: "1fr",
                    xl: "1fr 1fr",
                  },
                  gap: { xs: 1.5, sm: 2, md: 2.5, xl: 2 },
                  flexShrink: 0,
                  width: "100%",
                  overflow: "hidden",
                }}
              >
                {/* Rating and Reviews Card */}
                <Box sx={{ 
                  minWidth: 0, 
                  overflow: "hidden",
                  minHeight: { xs: "180px", sm: "200px", md: "220px" }
                }}>
                  <RatingReviewsCard
                    rating={reviewsStats.rating}
                    positivePercentage={reviewsStats.pos}
                    negativePercentage={reviewsStats.neg}
                    title="Rating And Reviews"
                    bottomLabel={reviewsStats.label}
                  />
                </Box>

                {/* Top Vouchers Card */}
                <Box sx={{ 
                  minWidth: 0, 
                  overflow: "hidden",
                  minHeight: { xs: "180px", sm: "200px", md: "220px" }
                }}>
                  <TopVouchersCard 
                    vouchers={topVouchersData} 
                    title="Top Vouchers" 
                    reviewsText="Al Baik Reviews" 
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </AppLayout>
  )
}
