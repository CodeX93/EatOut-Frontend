"use client"

import { useState, useEffect } from "react"
import { Box, Typography, CircularProgress, Alert } from "@mui/material"
import SideNavbar from "../../../components/SideNavbar"
import VoucherCard from "../../_components/VoucherCard"

// Firebase imports
import { db } from "../../../../firebaseConfig" // Adjust path as needed
import { collection, query, where, getDocs, orderBy } from "firebase/firestore"

const AllExpiredVouchers = () => {
  const [vouchers, setVouchers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Function to check if a voucher is expired
  const isVoucherExpired = (expiryDate) => {
    if (!expiryDate) return false
    
    const today = new Date()
    const expiry = new Date(expiryDate)
    
    // Set time to start of day for accurate comparison
    today.setHours(0, 0, 0, 0)
    expiry.setHours(23, 59, 59, 999) // End of expiry day
    
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
      usedCount = 0 
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
    const voucherCode = `EXP${docId.slice(-6).toUpperCase()}`

    return {
      discount,
      minimumSpend: "RM 100", // You might want to add this field to your Firestore schema
      restaurantName: voucherTitle || "Restaurant Name",
      branch: "Main Branch", // You might want to add this field to your Firestore schema
      voucherCode,
      usedDate: formatDate(expiryDate),
      type: "expired",
      id: docId,
      quantity,
      usedCount,
      expiryDate
    }
  }

  // Fetch expired vouchers from Firestore
  const fetchExpiredVouchers = async () => {
    try {
      setLoading(true)
      setError(null)

      // Get current date for comparison
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const todayString = today.toISOString().split('T')[0]

      // Query vouchers from Firestore
      // We'll fetch all vouchers and filter client-side for more accurate expiry checking
      const vouchersQuery = query(
        collection(db, "vouchers"),
        orderBy("createdAt", "desc")
      )

      const querySnapshot = await getDocs(vouchersQuery)
      const allVouchers = []

      querySnapshot.forEach((doc) => {
        const voucherData = doc.data()
        
        // Validate expiry date exists and voucher is expired
        if (voucherData.expiryDate && isVoucherExpired(voucherData.expiryDate)) {
          allVouchers.push({
            id: doc.id,
            ...voucherData
          })
        }
      })

      // Map the data to the format expected by VoucherCard
      const mappedVouchers = allVouchers.map(voucher => 
        mapVoucherData(voucher, voucher.id)
      )

      // Enhanced validation with comprehensive null checks
      const validVouchers = mappedVouchers.filter((voucher, index) => {
        // First check if voucher exists and is an object
        if (!voucher || typeof voucher !== "object") {
          console.error(`AllExpiredVouchers: Invalid voucher at index ${index}:`, voucher)
          return false
        }

        // Then check all required properties exist and are the correct type
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
          voucher.type === "expired" &&
          voucher.hasOwnProperty("id") &&
          voucher.id

        if (!isValid) {
          console.error(`AllExpiredVouchers: Voucher validation failed at index ${index}:`, voucher)
        }

        return isValid
      })

      // Additional safety check - log if we have invalid data
      if (validVouchers.length !== mappedVouchers.length) {
        console.warn(`AllExpiredVouchers: Filtered out ${mappedVouchers.length - validVouchers.length} invalid vouchers`)
      }

      setVouchers(validVouchers)

    } catch (err) {
      console.error("Error fetching expired vouchers:", err)
      setError("Failed to load expired vouchers. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Fetch vouchers on component mount
  useEffect(() => {
    fetchExpiredVouchers()
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
            padding: "32px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <CircularProgress size={60} sx={{ color: "#d32f2f", mb: 2 }} />
            <Typography variant="h6" sx={{ color: "#666" }}>
              Loading expired vouchers...
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
            padding: "32px",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontSize: "24px",
              fontWeight: 700,
              color: "#d32f2f",
              marginBottom: "24px",
            }}
          >
            All Expired Vouchers
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
          padding: "32px",
          minHeight: "100vh",
        }}
      >
        {/* Page Header */}
        <Box sx={{ marginBottom: "24px" }}>
          <Typography
            variant="h4"
            sx={{
              fontSize: "24px",
              fontWeight: 700,
              color: "#d32f2f",
              marginBottom: "8px",
            }}
          >
            All Expired Vouchers
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#666",
              fontSize: "14px",
            }}
          >
            Found {vouchers.length} expired voucher{vouchers.length !== 1 ? 's' : ''}
          </Typography>
        </Box>

        {/* White container for voucher cards */}
        <Box
          sx={{
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            padding: "24px",
            boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.05)",
          }}
        >
          {/* Check if we have valid vouchers */}
          {vouchers.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: "#666", 
                  mb: 1,
                  fontSize: "18px",
                  fontWeight: 500 
                }}
              >
                No expired vouchers found
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ color: "#999" }}
              >
                All your vouchers are still active or you haven't created any yet.
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                margin: "-2px",
              }}
            >
              {vouchers.map((voucher, index) => {
                // Extra safety check in the map function
                if (!voucher || typeof voucher !== "object") {
                  console.error(`AllExpiredVouchers: Undefined voucher found in map at index ${index}:`, voucher)
                  return null
                }

                return (
                  <Box
                    key={voucher.id || `voucher-${index}`}
                    sx={{
                      width: "25%",
                      padding: "2px",
                      boxSizing: "border-box",
                      "@media (max-width: 1200px)": {
                        width: "25%",
                      },
                      "@media (max-width: 900px)": {
                        width: "33.333%",
                      },
                      "@media (max-width: 600px)": {
                        width: "50%",
                      },
                      "@media (max-width: 480px)": {
                        width: "100%",
                      },
                    }}
                  >
                    <VoucherCard
                      discount={voucher.discount}
                      minimumSpend={voucher.minimumSpend}
                      restaurantName={voucher.restaurantName}
                      branch={voucher.branch}
                      voucherCode={voucher.voucherCode}
                      usedDate={voucher.usedDate}
                      type={voucher.type}
                    />
                  </Box>
                )
              })}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default AllExpiredVouchers