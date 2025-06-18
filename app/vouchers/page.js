"use client"

import { useState } from "react"
import { Box, Typography, Button } from "@mui/material"
import { Add, CardGiftcard, People, Restaurant } from "@mui/icons-material"
import { useRouter } from "next/navigation"

// Import your existing components
import Header from "../components/Header"
import Sidebar from "../components/SideNavbar"

// Import the new components we created
import SearchAndFilters from "./_components/SearchAndFilters"
import VouchersTable from "./_components/VouchersTable"
import VoucherCarousel from "./_components/VoucherCarousel"
import ReportTable from "./_components/ReportTable"

const drawerWidth = 240

export default function VouchersPage() {
  const router = useRouter()
  const [sortBy, setSortBy] = useState("Name")
  const [relevantFilter, setRelevantFilter] = useState("Relevant")

  const handleAddNewVoucher = () => {
    router.push("/vouchers/sub/add")
  }

  // Sample data
  const activeVouchers = [
    {
      code: "SAVE10",
      type: "Free Item",
      value: "10%",
      validity: "01 May - 30 May",
      merchants: "All",
      usage: "120 / 500",
      status: "Active",
    },
    {
      code: "SAVE20",
      type: "Cash",
      value: "20%",
      validity: "01 May - 30 May",
      merchants: "All",
      usage: "120 / 500",
      status: "Active",
    },
    {
      code: "SAVE30",
      type: "Discount",
      value: "30%",
      validity: "01 May - 30 May",
      merchants: "All",
      usage: "120 / 500",
      status: "Active",
    },
  ]

  const voucherUsageSummary = [
    {
      code: "SAVE10",
      totalUsed: 120,
      totalDiscount: "$1,200",
      ordersGenerated: "$8,500",
      memberSavings: "$1,200",
      merchantSales: "$8,300",
    },
    {
      code: "MERCH50",
      totalUsed: 35,
      totalDiscount: "$1,750",
      ordersGenerated: "$6,000",
      memberSavings: "$1,750",
      merchantSales: "$4,250",
    },
    {
      code: "FREESHIP",
      totalUsed: 88,
      totalDiscount: "-",
      ordersGenerated: "$5,100",
      memberSavings: "$900",
      merchantSales: "$5,100",
    },
    {
      code: "SAVE20",
      totalUsed: 170,
      totalDiscount: "$1,800",
      ordersGenerated: "$10,500",
      memberSavings: "$1,900",
      merchantSales: "$10,300",
    },
  ]

  const memberBasedReport = [
    { name: "Sarah A", email: "sarah@gmail.com", vouchersUsed: 5, totalDiscount: "$100", totalSpend: "$850" },
    { name: "Omar A", email: "omar@gmail.com", vouchersUsed: 3, totalDiscount: "$75", totalSpend: "$620" },
    { name: "John D", email: "john@gmail.com", vouchersUsed: 2, totalDiscount: "$50", totalSpend: "$450" },
  ]

  const merchantBasedReport = [
    {
      name: "Merchant A",
      vouchersApplied: 65,
      totalDiscount: "$1,750",
      salesGenerated: "$4,250",
      topVoucher: "MERCH50",
    },
    {
      name: "Merchant B",
      vouchersApplied: 40,
      totalDiscount: "$1,250",
      salesGenerated: "$2,250",
      topVoucher: "SAVE10",
    },
    { name: "Merchant C", vouchersApplied: 30, totalDiscount: "$750", salesGenerated: "$1,250", topVoucher: "SAVE20" },
    { name: "Merchant D", vouchersApplied: 20, totalDiscount: "$350", salesGenerated: "$750", topVoucher: "MERCH70" },
  ]

  // Ensure all required properties exist and are strings
  const reviewVouchers = [
    {
      discount: "30%",
      minimumSpend: "RM 100",
      restaurantName: "Ruby Restaurant & Bars",
      branch: "Kuala Lumpur Branch",
      voucherCode: "1XQ135412A",
      usedDate: "Dec 23, 2024",
      type: "review",
      id: 1,
    },
    {
      discount: "30%",
      minimumSpend: "RM 100",
      restaurantName: "Ruby Restaurant & Bars",
      branch: "Kuala Lumpur Branch",
      voucherCode: "1XQ135412B",
      usedDate: "Dec 23, 2024",
      type: "review",
      id: 2,
    },
    {
      discount: "30%",
      minimumSpend: "RM 100",
      restaurantName: "Ruby Restaurant & Bars",
      branch: "Kuala Lumpur Branch",
      voucherCode: "1XQ135412C",
      usedDate: "Dec 23, 2024",
      type: "review",
      id: 3,
    },
    {
      discount: "30%",
      minimumSpend: "RM 100",
      restaurantName: "Ruby Restaurant & Bars",
      branch: "Kuala Lumpur Branch",
      voucherCode: "1XQ135412D",
      usedDate: "Dec 23, 2024",
      type: "review",
      id: 4,
    },
    {
      discount: "30%",
      minimumSpend: "RM 100",
      restaurantName: "Ruby Restaurant & Bars",
      branch: "Kuala Lumpur Branch",
      voucherCode: "1XQ135412E",
      usedDate: "Dec 23, 2024",
      type: "review",
      id: 5,
    },
  ]

  // Ensure all required properties exist and are strings
  const expiredVouchers = [
    {
      discount: "30%",
      minimumSpend: "RM 100",
      restaurantName: "Ruby Restaurant & Bars",
      branch: "Kuala Lumpur Branch",
      voucherCode: "EXP001",
      usedDate: "Dec 23, 2024",
      type: "expired",
      id: 1,
    },
    {
      discount: "30%",
      minimumSpend: "RM 100",
      restaurantName: "Ruby Restaurant & Bars",
      branch: "Kuala Lumpur Branch",
      voucherCode: "EXP002",
      usedDate: "Dec 23, 2024",
      type: "expired",
      id: 2,
    },
    {
      discount: "30%",
      minimumSpend: "RM 100",
      restaurantName: "Ruby Restaurant & Bars",
      branch: "Kuala Lumpur Branch",
      voucherCode: "EXP003",
      usedDate: "Dec 23, 2024",
      type: "expired",
      id: 3,
    },
    {
      discount: "30%",
      minimumSpend: "RM 100",
      restaurantName: "Ruby Restaurant & Bars",
      branch: "Kuala Lumpur Branch",
      voucherCode: "EXP004",
      usedDate: "Dec 23, 2024",
      type: "expired",
      id: 4,
    },
    {
      discount: "30%",
      minimumSpend: "RM 100",
      restaurantName: "Ruby Restaurant & Bars",
      branch: "Kuala Lumpur Branch",
      voucherCode: "EXP005",
      usedDate: "Dec 23, 2024",
      type: "expired",
      id: 5,
    },
  ]

  // Column configurations for report tables
  const usageSummaryColumns = [
    { key: "code", label: "Code", highlight: true },
    { key: "totalUsed", label: "Total Used" },
    { key: "totalDiscount", label: "Total Discount", hideOnMobile: true },
    { key: "ordersGenerated", label: "Orders Generated", hideOnMobile: true },
    { key: "memberSavings", label: "Member Savings", hideOnMobile: true },
    { key: "merchantSales", label: "Merchant Sales", hideOnMobile: true },
  ]

  const memberReportColumns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email", highlight: true, hideOnMobile: true },
    { key: "vouchersUsed", label: "Voucher Used" },
    { key: "totalDiscount", label: "Total Discount", hideOnMobile: true },
    { key: "totalSpend", label: "Total Spend" },
  ]

  const merchantReportColumns = [
    { key: "name", label: "Merchant Name" },
    { key: "vouchersApplied", label: "Vouchers Applied", hideOnMobile: true },
    { key: "totalDiscount", label: "Total Discount", hideOnMobile: true },
    { key: "salesGenerated", label: "Sales Generated" },
    { key: "topVoucher", label: "Top Voucher", highlight: true },
  ]

  return (
    <Box
      component="div"
      sx={{
        display: "flex",
        backgroundColor: "#f9f9f9",
        minHeight: "100vh",
        height: "100vh",
        width: "100vw",
      }}
    >
      {/* Header */}
      <Header />
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box
        component="div"
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
          component="div"
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
                flex: { xl: "1 1 66%" },
                width: { xs: "100%", xl: "66%" },
                display: "flex",
                flexDirection: "column",
                minHeight: { xs: "auto", xl: "100%" },
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  overflow: "auto",
                  pr: { xs: 0, xl: 1 },
                }}
              >
                {/* Page Header */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: "space-between",
                    alignItems: { xs: "stretch", sm: "center" },
                    mb: 3,
                    gap: 2,
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 600,
                      color: "#da1818",
                      fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" },
                    }}
                  >
                    Vouchers Overview
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleAddNewVoucher}
                    sx={{
                      bgcolor: "#da1818",
                      color: "white",
                      borderRadius: "8px",
                      textTransform: "none",
                      "&:hover": {
                        bgcolor: "#c41515",
                      },
                      px: { xs: 1.5, sm: 2 },
                      py: 1,
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      alignSelf: { xs: "flex-start", sm: "auto" },
                      cursor: "pointer",
                    }}
                  >
                    Add new Voucher
                  </Button>
                </Box>

                {/* Search and Filters */}
                <SearchAndFilters
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  relevantFilter={relevantFilter}
                  setRelevantFilter={setRelevantFilter}
                />

                {/* Active Vouchers Section */}
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: "#000000",
                      fontSize: { xs: "1rem", sm: "1.25rem" },
                    }}
                  >
                    All Active / Scheduled Vouchers List
                  </Typography>
                </Box>

                {/* Vouchers Table */}
                <VouchersTable vouchers={activeVouchers} />

                {/* Review Vouchers Carousel */}
                <Box
                  sx={{
                    mb: { xs: 3, md: 4 },
                    mx: { xs: -1, sm: 0 }, // Negative margin on mobile to allow full-width carousel
                  }}
                >
                  <VoucherCarousel title="Review Vouchers" vouchers={reviewVouchers} type="review" />
                </Box>

                {/* Expired Vouchers Carousel */}
                <Box
                  sx={{
                    mb: { xs: 3, md: 4 },
                    mx: { xs: -1, sm: 0 }, // Negative margin on mobile to allow full-width carousel
                  }}
                >
                  <VoucherCarousel title="Expired Vouchers" vouchers={expiredVouchers} type="expired" />
                </Box>
              </Box>
            </Box>

            {/* Right Column - Reports */}
            <Box
              sx={{
                flex: { xl: "1 1 33%" },
                width: { xs: "100%", xl: "33%" },
                display: "flex",
                flexDirection: "column",
                gap: { xs: 2, md: 3 },
                minHeight: { xs: "auto", xl: "100%" },
                overflow: "auto",
                pl: { xs: 0, xl: 1 },
              }}
            >
              {/* Voucher Usage Summary */}
              <ReportTable
                title="Voucher Usage Summary"
                icon={<CardGiftcard sx={{ color: "#da1818", fontSize: { xs: "14px", sm: "16px" } }} />}
                data={voucherUsageSummary}
                columns={usageSummaryColumns}
              />

              {/* Member-Based Report */}
              <ReportTable
                title="Member-Based Report"
                icon={<People sx={{ color: "#da1818", fontSize: { xs: "14px", sm: "16px" } }} />}
                data={memberBasedReport}
                columns={memberReportColumns}
              />

              {/* Merchant-Based Report */}
              <ReportTable
                title="Merchant-Based Report"
                icon={<Restaurant sx={{ color: "#da1818", fontSize: { xs: "14px", sm: "16px" } }} />}
                data={merchantBasedReport}
                columns={merchantReportColumns}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
