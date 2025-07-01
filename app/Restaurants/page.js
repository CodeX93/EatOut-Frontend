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

const fetchPopularRestaurants = async (period) => {
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Return different data based on period
  const data = {
    Today: [
      { id: 1, name: "KFC", rating: 4.7, reviews: 50, revenue: "$12,217", highlighted: false },
      { id: 2, name: "McDonalds", rating: 4.8, reviews: 45, revenue: "$8,543", highlighted: true },
      { id: 3, name: "Al Baik", rating: 4.6, reviews: 30, revenue: "$6,999", highlighted: false },
    ],
    Week: [
      { id: 1, name: "KFC", rating: 4.7, reviews: 200, revenue: "$85,217", highlighted: false },
      { id: 2, name: "McDonalds", rating: 4.8, reviews: 180, revenue: "$62,543", highlighted: false },
      { id: 3, name: "Al Baik", rating: 4.7, reviews: 150, revenue: "$45,999", highlighted: true },
    ],
    Month: [
      { id: 1, name: "KFC", rating: 4.7, reviews: 800, revenue: "$243,217", highlighted: false },
      { id: 2, name: "McDonalds", rating: 4.8, reviews: 750, revenue: "$174,543", highlighted: false },
      { id: 3, name: "Al Baik", rating: 4.7, reviews: 600, revenue: "$127,999", highlighted: true },
    ],
  }

  return data[period] || data["Month"]
}

const fetchPopularVouchers = async (period) => {
  await new Promise((resolve) => setTimeout(resolve, 500))

  return [
    { id: 1, restaurant: "Al Baik", discount: "30% off", expiry: "30-02-2025" },
    { id: 2, restaurant: "KFC", discount: "15% off", expiry: "28-02-2025" },
    { id: 3, restaurant: "McDonalds", discount: "20% off", expiry: "25-02-2025" },
  ]
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
          const data = doc.data()
          restaurants.push({
            id: doc.id,
            name: data.restaurantName || "-",
            address: data.address || "-",
            location: data.city || "-",
            phone: data.phone || "-",
            vouchers: 0, // Set to 0 for now
            redeemed: 0, // Set to 0 for now
            ...data,
          })
        })
        // Keep the rest of the data fetching as is
        const [popularRestaurants, popularVouchers] = await Promise.all([
          fetchPopularRestaurants("Month"),
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
      const data = await fetchPopularRestaurants(period)
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
