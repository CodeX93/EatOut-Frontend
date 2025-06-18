"use client"

import { Box, Typography } from "@mui/material"
import SideNavbar from "../../../components/SideNavbar"
import VoucherCard from "../../_components/VoucherCard"

// Mock data for review vouchers - creating many review vouchers to match the design
const voucherData = Array.from({ length: 24 }, (_, index) => ({
  discount: "30%",
  minimumSpend: "RM 100",
  restaurantName: "Ruby Restaurant & Bars",
  branch: "Kuala Lumpur Branch",
  voucherCode: `1XQ135412A`,
  usedDate: "Dec 23, 2024",
  type: "review",
  id: index + 1,
}))

const AllReviewVouchers = () => {
  const validVouchers = voucherData.filter((voucher, index) => {
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
        </Box>

        {/* Voucher Cards Grid */}
        {validVouchers.length === 0 ? (
          <Typography sx={{ textAlign: "center", color: "#8a8a8f", padding: "40px" }}>
            No review vouchers found.
          </Typography>
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
            {validVouchers.map((voucher, index) => {
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
