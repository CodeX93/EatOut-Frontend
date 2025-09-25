"use client"

import { useState, useEffect } from "react"
import { Box, Typography, CircularProgress } from "@mui/material"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../../firebaseConfig"

// Import layout components
import Sidebar from "../components/SideNavbar"
import Header from "../components/Header"

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
    case "Month":
    default:
      return now - 30 * 24 * 60 * 60 * 1000
  }
}

const fetchPopularRestaurants = async (period, emailToNameMap = {}) => {
  const fromTs = computeTimeWindowMs(period)

  // Aggregate usage from vouchers' redeemedUsers
  const vouchersSnap = await getDocs(collection(db, "voucher"))

  const emailToStats = new Map()

  for (const voucherDoc of vouchersSnap.docs) {
    const voucherData = voucherDoc.data() || {}
    const restaurantEmail = voucherData.restaurantEmail || "unknown"
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
        const redeemedAt = typeof r.redeemedAt === "number" ? r.redeemedAt : (typeof r.validUntil === "number" ? r.validUntil : 0)
        const used = r.used === true || r.used === false ? r.used : true
        if (redeemedAt >= fromTs && used) {
          stats.orders += 1
          if (r.userEmail) stats.memberSet.add(r.userEmail)
        }
      })
    } catch (e) {
      // Ignore subcollection errors for robustness
      // console.warn("Failed loading redeemedUsers for", voucherDoc.id, e)
    }
  }

  // Build ranked list
  const avgOrderValue = 85
  const results = Array.from(emailToStats.entries())
    .map(([email, s]) => {
      const members = s.memberSet.size
      const orders = s.orders
      const revenue = `$${(orders * avgOrderValue).toLocaleString()}`
      // Derive a pseudo-rating from orders (bounded 3.5 - 5.0)
      const rating = Math.max(3.5, Math.min(5.0, 3.5 + (orders / 100)))
      return {
        id: email,
        name: emailToNameMap[email] || email,
        rating: Number(rating.toFixed(1)),
        reviews: members,
        revenue,
        highlighted: false,
        orders,
        members,
      }
    })
    .sort((a, b) => b.orders - a.orders)
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
    let usedCountWindow = 0
    try {
      const redeemedSnap = await getDocs(collection(db, "voucher", vDoc.id, "redeemedUsers"))
      redeemedSnap.forEach((ru) => {
        const r = ru.data() || {}
        const redeemedAt = typeof r.redeemedAt === "number" ? r.redeemedAt : (typeof r.validUntil === "number" ? r.validUntil : 0)
        const used = r.used === true || r.used === false ? r.used : true
        if (redeemedAt >= fromTs && used) usedCountWindow += 1
      })
    } catch (e) {
      // ignore
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
          })
        })
        // Build a map from email to restaurantName for nicer labels
        const emailToName = restaurants.reduce((acc, r) => {
          if (r.email) acc[r.email] = r.name
          return acc
        }, {})

        const [popularRestaurants, popularVouchers] = await Promise.all([
          fetchPopularRestaurants("Month", emailToName),
          fetchPopularVouchers("Month"),
        ])
        setRestaurantsData(restaurants)
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
      <Box
        sx={{
          display: "flex",
          bgcolor: "#f9f9f9",
          minHeight: "100vh",
          height: "100vh",
          width: "100vw",
          overflow: "hidden",
        }}
      >
        <Header />
        <Sidebar />
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            width: "100%",
            ml: { xs: 0, sm: `${drawerWidth}px` },
            mt: { xs: "56px", sm: "64px" },
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
      </Box>
    )
  }

  // Calculate dynamic subtitle
  const dynamicSubtitle = `${restaurantsData.length} Restaurants from 6 Categories`

  return (
    <Box
      sx={{
        display: "flex",
        bgcolor: "#f9f9f9",
        minHeight: "100vh",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Header />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: "100vh",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          ml: { xs: 0, sm: `${drawerWidth}px` },
          mt: { xs: "56px", sm: "64px" },
          overflow: "hidden",
        }}
      >
        {/* Content Container with Scroll */}
        <Box
          sx={{
            flex: 1,
            p: { xs: 1, sm: 2, md: 3 },
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
            {/* Left Column - Main Content */}
            <Box
              sx={{
                flex: { xl: "1 1 65%" },
                width: { xs: "100%", xl: "65%" },
                display: "flex",
                flexDirection: "column",
                minHeight: { xs: "auto", xl: "100%" },
              }}
            >
              <Box sx={{ mb: { xs: 2, md: 3 }, flexShrink: 0 }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 600,
                    color: "#da1818",
                    mb: { xs: 2, md: 3 },
                    fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" },
                  }}
                >
                  Restaurants Overview
                </Typography>
              </Box>

              {/* Restaurants Table with Navigation - Takes remaining space */}
              <Box
                sx={{
                  flex: 1,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  minHeight: 0,
                }}
              >
                <RestaurantsTable restaurants={restaurantsData} title="Account list" subtitle={dynamicSubtitle} />
              </Box>
            </Box>

            {/* Right Column - Sidebar Cards */}
            <Box
              sx={{
                flex: { xl: "1 1 35%" },
                width: { xs: "100%", xl: "35%" },
                display: "flex",
                flexDirection: "column",
                gap: { xs: 2, md: 3 },
                minHeight: { xs: "auto", xl: "100%" },
                maxHeight: { xs: "none", xl: "calc(100vh - 64px)" }, // 64px header height
                overflowY: "auto",
                minHeight: 0,
              }}
            >
              {/* Popular Restaurants Card */}
              <Box sx={{ flexShrink: 0 }}>
                <PopularRestaurantsCard
                  restaurants={popularRestaurantsData}
                  title="Popular Restaurants"
                  onPeriodChange={handlePopularRestaurantsPeriodChange}
                  loading={popularRestaurantsLoading}
                />
              </Box>

              {/* Popular Vouchers Card */}
              <Box sx={{ flexShrink: 0 }}>
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
                    md: "1fr 1fr",
                    lg: "1fr",
                    xl: "1fr 1fr",
                  },
                  gap: { xs: 1.5, sm: 1, md: 1.5, xl: 2 },
                  flexShrink: 0,
                  width: "100%",
                  overflow: "hidden",
                }}
              >
                {/* Rating and Reviews Card */}
                <Box sx={{ minWidth: 0, overflow: "hidden" }}>
                  <RatingReviewsCard
                    rating={4.8}
                    positivePercentage={97}
                    negativePercentage={3}
                    title="Rating And Reviews"
                  />
                </Box>

                {/* Top Vouchers Card */}
                <Box sx={{ minWidth: 0, overflow: "hidden" }}>
                  <TopVouchersCard vouchers={topVouchersData} title="Top Vouchers" reviewsText="Al Baik Reviews" />
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
