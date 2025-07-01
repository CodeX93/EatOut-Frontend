"use client"

import { useState, useEffect } from "react"
import { Box, Typography, CircularProgress, Alert } from "@mui/material"
import SideNavbar from "../../../components/SideNavbar"
import VoucherCard from "../../_components/VoucherCard"

// Firebase imports
import { db } from "../../../../firebaseConfig" // Adjust path as needed
import { collection, query, where, getDocs, orderBy } from "firebase/firestore"

const AllReviewVouchers = () => {
  const [vouchers, setVouchers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Function to check if a voucher is pending review - SAME AS MAIN PAGE
  const isVoucherForReview = (voucher) => {
    const { usedCount = 0, quantity = 1, status, reviewStatus } = voucher
    const isActive = !isVoucherExpired(voucher.expiryDate)
    const isFullyUsed = usedCount >= quantity
    const needsReview = status === 'review' || reviewStatus === 'pending' || 
                       (isFullyUsed && isActive)
    return needsReview && isActive
  }

  // Function to check if a voucher is expired - SAME AS MAIN PAGE
  const isVoucherExpired = (expiryDate) => {
    if (!expiryDate) return false
    const today = new Date()
    const expiry = new Date(expiryDate)
    today.setHours(0, 0, 0, 0)
    expiry.setHours(23, 59, 59, 999)
    return today > expiry
  }

  // Function to format date for display
  const formatDate = (date) => {
    if (!date) return "Unknown"
    
    const dateObj = new Date(date)
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    })
  }

  // Function to map Firestore data to VoucherCard format
  const mapVoucherData = (firestoreVoucher, docId) => {
    const { 
      voucherType, 
      valueOfSavings, 
      voucherTitle, 
      expiryDate,
      quantity,
      usedCount = 0,
      usedDate // You might want to track when voucher was used
    } = firestoreVoucher

    // Generate discount display based on voucher type
    let discount = ""
    if (voucherType === "Percentage Discount") {
      discount = `${valueOfSavings}%`
    } else if (voucherType === "Fixed Amount Discount" || voucherType === "Cash Voucher") {
      discount = `$${valueOfSavings}`
    } else {
      discount = voucherType // For "Buy One Get One Free", "Free Item", etc.
    }

    // Generate voucher code from document ID
    const voucherCode = `REV${docId.slice(-6).toUpperCase()}`

    return {
      discount,
      minimumSpend: "RM 100", // You might want to add this field to your Firestore schema
      restaurantName: voucherTitle || "Restaurant Name",
      branch: "Main Branch", // You might want to add this field to your Firestore schema
      voucherCode,
      usedDate: formatDate(usedDate || new Date()), // Use actual used date or current date
      type: "review",
      id: docId,
      quantity,
      usedCount,
      expiryDate
    }
  }

  // Fetch review vouchers from Firestore
  const fetchReviewVouchers = async () => {
    try {
      setLoading(true)
      setError(null)

      // Query vouchers from Firestore
      // We'll fetch vouchers that are either:
      // 1. Explicitly marked for review, OR
      // 2. Have been used and need review
      const vouchersQuery = query(
        collection(db, "vouchers"),
        orderBy("createdAt", "desc")
      )

      const querySnapshot = await getDocs(vouchersQuery)
      const reviewVouchers = []

      querySnapshot.forEach((doc) => {
        const voucherData = doc.data()
        
        console.log("Checking voucher for review:", {
          code: voucherData.voucherCode,
          usedCount: voucherData.usedCount,
          quantity: voucherData.quantity,
          status: voucherData.status,
          reviewStatus: voucherData.reviewStatus,
          needsReview: isVoucherForReview(voucherData)
        })
        
        // Check if voucher needs review
        if (isVoucherForReview(voucherData)) {
          reviewVouchers.push({
            id: doc.id,
            ...voucherData
          })
        }
      })

      console.log("Found review vouchers:", reviewVouchers.length)

      // Alternative query if you have a specific status field for review vouchers:
      /*
      const reviewQuery = query(
        collection(db, "vouchers"),
        where("status", "==", "review"),
        orderBy("createdAt", "desc")
      )
      */

      // Map the data to the format expected by VoucherCard
      const mappedVouchers = reviewVouchers.map(voucher => 
        mapVoucherData(voucher, voucher.id)
      )

      // Enhanced validation with comprehensive null checks
      const validVouchers = mappedVouchers.filter((voucher, index) => {
        if (!voucher || typeof voucher !== "object") {
          console.error(`AllReviewVouchers: Invalid voucher at index ${index}:`, voucher)
          return false
        }

        const isValid =
          voucher.hasOwnProperty("discount") &&
          typeof voucher.discount === "string" &&
          voucher.hasOwnProperty("minimumSpend") &&
          typeof voucher.minimumSpend === "string" &&
          voucher.hasOwnProperty("restaurantName") &&
          typeof voucher.restaurantName === "string" &&
          voucher.hasOwnProperty("branch") &&
          typeof voucher.branch === "string" &&
          voucher.hasOwnProperty("voucherCode") &&
          typeof voucher.voucherCode === "string" &&
          voucher.hasOwnProperty("usedDate") &&
          typeof voucher.usedDate === "string" &&
          voucher.hasOwnProperty("type") &&
          voucher.type === "review" &&
          voucher.hasOwnProperty("id") &&
          voucher.id

        if (!isValid) {
          console.error(`AllReviewVouchers: Voucher validation failed at index ${index}:`, voucher)
        }

        return isValid
      })

      // Additional safety check
      if (validVouchers.length !== mappedVouchers.length) {
        console.warn(`AllReviewVouchers: Filtered out ${mappedVouchers.length - validVouchers.length} invalid vouchers`)
      }

      setVouchers(validVouchers)

    } catch (err) {
      console.error("Error fetching review vouchers:", err)
      setError("Failed to load review vouchers. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Fetch vouchers on component mount
  useEffect(() => {
    fetchReviewVouchers()
  }, [])

  // Loading state
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          backgroundColor: "#ffffff",
        }}
      >
        <SideNavbar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            marginLeft: "240px",
            padding: "24px 32px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <CircularProgress size={60} sx={{ color: "#ff2d55", mb: 2 }} />
            <Typography variant="h6" sx={{ color: "#666" }}>
              Loading review vouchers...
            </Typography>
          </Box>
        </Box>
      </Box>
    )
  }

  // Error state
  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          backgroundColor: "#ffffff",
        }}
      >
        <SideNavbar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            marginLeft: "240px",
            padding: "24px 32px",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontSize: "24px",
              fontWeight: 600,
              color: "#ff2d55",
              marginBottom: "24px",
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            All Review Vouchers
          </Typography>
          <Alert severity="error" sx={{ maxWidth: 600 }}>
            {error}
          </Alert>
        </Box>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#ffffff",
      }}
    >
      {/* SideNavbar component */}
      <SideNavbar />

      {/* Main content area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          marginLeft: "240px",
          padding: "24px 32px",
          minHeight: "100vh",
          backgroundColor: "#ffffff",
        }}
      >
        {/* Page Header */}
        <Box sx={{ marginBottom: "24px" }}>
          <Typography
            variant="h4"
            sx={{
              fontSize: "24px",
              fontWeight: 600,
              color: "#ff2d55",
              marginBottom: "8px",
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            All Review Vouchers
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#666",
              fontSize: "14px",
            }}
          >
            Found {vouchers.length} voucher{vouchers.length !== 1 ? 's' : ''} pending review
          </Typography>
        </Box>

        {/* Voucher Cards Grid */}
        {vouchers.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                color: "#8a8a8f", 
                mb: 1,
                fontSize: "18px",
                fontWeight: 500 
              }}
            >
              No review vouchers found
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ color: "#999" }}
            >
              No vouchers are currently pending review.
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "16px",
              "@media (max-width: 1400px)": {
                gridTemplateColumns: "repeat(3, 1fr)",
              },
              "@media (max-width: 1024px)": {
                gridTemplateColumns: "repeat(2, 1fr)",
              },
              "@media (max-width: 640px)": {
                gridTemplateColumns: "repeat(1, 1fr)",
              },
            }}
          >
            {vouchers.map((voucher, index) => {
              if (!voucher || typeof voucher !== "object") {
                console.error(`AllReviewVouchers: Undefined voucher found in map at index ${index}:`, voucher)
                return null
              }

              return (
                <VoucherCard
                  key={voucher.id || `voucher-${index}`}
                  discount={voucher.discount}
                  minimumSpend={voucher.minimumSpend}
                  restaurantName={voucher.restaurantName}
                  branch={voucher.branch}
                  voucherCode={voucher.voucherCode}
                  usedDate={voucher.usedDate}
                  type={voucher.type}
                />
              )
            })}
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default AllReviewVouchers