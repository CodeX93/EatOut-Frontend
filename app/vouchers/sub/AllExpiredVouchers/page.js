"use client"

import { Box, Typography } from "@mui/material"
import SideNavbar from "../../../components/SideNavbar"
import VoucherCard from "../../_components/VoucherCard"

// Mock data for expired vouchers - creating 20 expired vouchers
const voucherData = Array.from({ length: 20 }, (_, index) => ({
  discount: "30%",
  minimumSpend: "RM 100",
  restaurantName: "Ruby Restaurant & Bars",
  branch: "Kuala Lumpur Branch",
  voucherCode: `EXP${String(index + 1).padStart(3, "0")}`, // EXP001, EXP002, etc.
  usedDate: "Dec 23, 2024",
  type: "expired", // All should be expired type
  id: index + 1,
}))

const AllExpiredVouchers = () => {
  // Enhanced validation with comprehensive null checks
  const validVouchers = voucherData.filter((voucher, index) => {
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
  if (validVouchers.length !== voucherData.length) {
    console.warn(`AllExpiredVouchers: Filtered out ${voucherData.length - validVouchers.length} invalid vouchers`)
  }

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#ffffff", // White background to match the semi-circles
      }}
    >
      {/* SideNavbar component */}
      <SideNavbar />

      {/* Main content area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          marginLeft: "240px", // Adjust based on sidebar width
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
          {validVouchers.length === 0 ? (
            <Typography sx={{ textAlign: "center", color: "#666", padding: "40px" }}>
              No expired vouchers found.
            </Typography>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                margin: "-2px", // Compensate for the padding on card wrappers
              }}
            >
              {validVouchers.map((voucher, index) => {
                // Extra safety check in the map function
                if (!voucher || typeof voucher !== "object") {
                  console.error(`AllExpiredVouchers: Undefined voucher found in map at index ${index}:`, voucher)
                  return null
                }

                return (
                  <Box
                    key={voucher.id || `voucher-${index}`}
                    sx={{
                      width: "25%", // Exactly 4 cards per row (100% ÷ 4 = 25%)
                      padding: "2px",
                      boxSizing: "border-box",
                      // Responsive adjustments
                      "@media (max-width: 1200px)": {
                        width: "25%", // Still 4 cards on medium-large screens
                      },
                      "@media (max-width: 900px)": {
                        width: "33.333%", // 3 cards on medium screens
                      },
                      "@media (max-width: 600px)": {
                        width: "50%", // 2 cards on small screens
                      },
                      "@media (max-width: 480px)": {
                        width: "100%", // 1 card on very small screens
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
