"use client"

import { useState, useEffect } from "react"
import { Box, Typography, Button, CircularProgress, Alert } from "@mui/material"
import { Add, CardGiftcard, People, Restaurant } from "@mui/icons-material"
import { useRouter } from "next/navigation"

// Firebase imports
import { db } from "../../firebaseConfig" // Adjust path as needed
import { collection, query, getDocs, orderBy, where } from "firebase/firestore"

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
  
  // Voucher data states
  const [activeVouchers, setActiveVouchers] = useState([])
  const [reviewVouchers, setReviewVouchers] = useState([])
  const [expiredVouchers, setExpiredVouchers] = useState([])
  
  // Report data states
  const [voucherUsageSummary, setVoucherUsageSummary] = useState([])
  const [memberBasedReport, setMemberBasedReport] = useState([])
  const [merchantBasedReport, setMerchantBasedReport] = useState([])
  
  // Loading and error states
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const handleAddNewVoucher = () => {
    router.push("/vouchers/sub/add")
  }

  // Utility functions
  const isVoucherExpired = (expiryDate) => {
    if (!expiryDate) return false
    const today = new Date()
    const expiry = new Date(expiryDate)
    today.setHours(0, 0, 0, 0)
    expiry.setHours(23, 59, 59, 999)
    return today > expiry
  }

  const isVoucherForReview = (voucher) => {
    const { usedCount = 0, quantity = 1, status, reviewStatus } = voucher
    const isActive = !isVoucherExpired(voucher.expiryDate)
    const isFullyUsed = usedCount >= quantity
    const needsReview = status === 'review' || reviewStatus === 'pending' || 
                       (isFullyUsed && isActive)
    return needsReview && isActive
  }

  const formatDate = (date) => {
    if (!date) return "Unknown"
    const dateObj = new Date(date)
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    })
  }

  // Map Firestore voucher to table format for active vouchers
  const mapToTableFormat = (voucher) => {
    const { 
      voucherCode, 
      voucherType, 
      valueOfSavings, 
      expiryDate, 
      quantity, 
      usedCount = 0,
      status = "active"
    } = voucher

    return {
      code: voucherCode,
      type: voucherType.replace(" Discount", "").replace(" Voucher", ""),
      value: voucherType === "Percentage Discount" ? `${valueOfSavings}%` : `$${valueOfSavings}`,
      validity: formatDate(expiryDate),
      merchants: "All", // You might want to add this field to your schema
      usage: `${usedCount} / ${quantity}`,
      status: status.charAt(0).toUpperCase() + status.slice(1),
    }
  }

  // Map Firestore voucher to carousel format
  const mapToCarouselFormat = (voucher, type) => {
    const { 
      voucherCode, 
      voucherType, 
      valueOfSavings, 
      voucherTitle, 
      expiryDate, 
      usedCount = 0, 
      quantity 
    } = voucher

    let discount = ""
    if (voucherType === "Percentage Discount") {
      discount = `${valueOfSavings}%`
    } else if (voucherType === "Fixed Amount Discount" || voucherType === "Cash Voucher") {
      discount = `${valueOfSavings}`
    } else {
      discount = voucherType
    }

    const mappedVoucher = {
      discount: discount || "N/A",
      minimumSpend: "RM 100", // Add this to your schema if needed
      restaurantName: voucherTitle || "Restaurant Name",
      branch: "Main Branch", // Add this to your schema if needed
      voucherCode: voucherCode || "N/A",
      usedDate: formatDate(expiryDate),
      type: type || "review",
      id: voucherCode || `voucher-${Date.now()}`,
      quantity: quantity || 1,
      usedCount: usedCount || 0,
      expiryDate: expiryDate || null
    }

    console.log("Mapped voucher for carousel:", mappedVoucher)
    return mappedVoucher
  }

  // Fetch all voucher data
  const fetchVoucherData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch all vouchers from `voucher` collection (matches Firestore structure)
      const vouchersQuery = query(
        collection(db, "voucher"),
        orderBy("createdAt", "desc")
      )

      const querySnapshot = await getDocs(vouchersQuery)
      const allVouchers = []

      querySnapshot.forEach((doc) => {
        const data = doc.data() || {}
        const quantity = Number(data.quantity ?? 0)
        const available = Number(data.available ?? 0)
        const usedCount = Math.max(0, quantity - available)

        // Normalize to UI-expected fields
        const normalized = {
          id: doc.id,
          voucherCode: data.voucherId || doc.id,
          voucherType: data.voucherType || "Unknown",
          valueOfSavings: data.valueOfSavings ?? 0,
          voucherTitle: data.title || "",
          expiryDate: data.expiryDate ?? null,
          quantity: quantity,
          usedCount: usedCount,
          status: data.isActive ? "active" : "inactive",
          createdAt: data.createdAt ?? null,
          minSpending: data.minSpending ?? 0,
          restaurantEmail: data.restaurantEmail ?? "",
          termsAndConditions: Array.isArray(data.termsAndConditions) ? data.termsAndConditions : [],
          description: data.description ?? "",
          available: available,
          voucherId: data.voucherId ?? doc.id,
        }

        allVouchers.push(normalized)
      })

      // Categorize vouchers
      const active = []
      const review = []
      const expired = []

      console.log("Total vouchers fetched:", allVouchers.length)

      allVouchers.forEach(voucher => {
        const isExpired = isVoucherExpired(voucher.expiryDate)
        const needsReview = isVoucherForReview(voucher)
        
        console.log(`Voucher ${voucher.voucherCode}:`, {
          expired: isExpired,
          needsReview: needsReview,
          expiryDate: voucher.expiryDate,
          usedCount: voucher.usedCount,
          quantity: voucher.quantity,
          status: voucher.status
        })

        if (isExpired) {
          const expiredVoucher = mapToCarouselFormat(voucher, "expired")
          console.log("Adding expired voucher:", expiredVoucher)
          expired.push(expiredVoucher)
        } else if (needsReview) {
          const reviewVoucher = mapToCarouselFormat(voucher, "review")
          console.log("Adding review voucher:", reviewVoucher)
          review.push(reviewVoucher)
        } else {
          // Active vouchers: not expired, not marked for review, and available for use
          active.push(mapToTableFormat(voucher))
        }
      })

      console.log("Categorization results:", {
        active: active.length,
        review: review.length,
        expired: expired.length
      })

      console.log("Review vouchers before setting state:", review)
      console.log("Expired vouchers before setting state:", expired)

      setActiveVouchers(active)
      setReviewVouchers(review.slice(0, 10)) // Limit to 10 for carousel
      setExpiredVouchers(expired.slice(0, 10)) // Limit to 10 for carousel

      // Generate usage summary from voucher data
      generateUsageSummary(allVouchers)

    } catch (err) {
      console.error("Error fetching voucher data:", err)
      setError("Failed to load voucher data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Generate usage summary from voucher data
  const generateUsageSummary = (vouchers) => {
    const usageSummary = vouchers
      .filter(voucher => voucher.usedCount > 0)
      .map(voucher => {
        const { 
          voucherCode, 
          usedCount = 0, 
          valueOfSavings, 
          voucherType 
        } = voucher

        // Calculate estimated values (you might want to track these separately)
        const avgOrderValue = 85 // Estimated average order value
        const totalDiscount = voucherType === "Percentage Discount" 
          ? `$${(usedCount * avgOrderValue * valueOfSavings / 100).toFixed(0)}`
          : `$${(usedCount * valueOfSavings).toFixed(0)}`
        
        const ordersGenerated = `$${(usedCount * avgOrderValue).toFixed(0)}`
        const memberSavings = totalDiscount
        const merchantSales = `$${(usedCount * avgOrderValue * 0.98).toFixed(0)}` // Minus small fee

        return {
          code: voucherCode,
          totalUsed: usedCount,
          totalDiscount,
          ordersGenerated,
          memberSavings,
          merchantSales,
        }
      })
      .slice(0, 4) // Top 4 most used vouchers

    setVoucherUsageSummary(usageSummary)

    // Generate mock member and merchant reports (replace with real data if available)
    generateMockReports()
  }

  // Generate mock reports (replace with real data fetching)
  const generateMockReports = () => {
    const memberData = [
      { name: "Sarah A", email: "sarah@gmail.com", vouchersUsed: 5, totalDiscount: "$100", totalSpend: "$850" },
      { name: "Omar A", email: "omar@gmail.com", vouchersUsed: 3, totalDiscount: "$75", totalSpend: "$620" },
      { name: "John D", email: "john@gmail.com", vouchersUsed: 2, totalDiscount: "$50", totalSpend: "$450" },
    ]

    const merchantData = [
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
      { 
        name: "Merchant C", 
        vouchersApplied: 30, 
        totalDiscount: "$750", 
        salesGenerated: "$1,250", 
        topVoucher: "SAVE20" 
      },
      { 
        name: "Merchant D", 
        vouchersApplied: 20, 
        totalDiscount: "$350", 
        salesGenerated: "$750", 
        topVoucher: "MERCH70" 
      },
    ]

    setMemberBasedReport(memberData)
    setMerchantBasedReport(merchantData)
  }

  // Fetch data on component mount
  useEffect(() => {
    fetchVoucherData()
  }, [])

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

  // Loading state
  if (loading) {
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
        <Header />
        <Sidebar />
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
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress size={60} sx={{ color: "#da1818", mb: 2 }} />
          <Typography variant="h6" sx={{ color: "#666" }}>
            Loading vouchers data...
          </Typography>
        </Box>
      </Box>
    )
  }

  // Error state
  if (error) {
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
        <Header />
        <Sidebar />
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
            p: 3,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              color: "#da1818",
              fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" },
              mb: 3,
            }}
          >
            Vouchers Overview
          </Typography>
          <Alert severity="error" sx={{ maxWidth: 600 }}>
            {error}
            <Button 
              onClick={fetchVoucherData} 
              sx={{ mt: 1, color: "#da1818" }}
            >
              Try Again
            </Button>
          </Alert>
        </Box>
      </Box>
    )
  }

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
                  <Box>
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
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#666",
                        fontSize: "14px",
                        mt: 0.5,
                      }}
                    >
                      Total: {activeVouchers.length} active, {reviewVouchers.length} for review, {expiredVouchers.length} expired
                    </Typography>
                  </Box>
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
                    All Active / Scheduled Vouchers List ({activeVouchers.length})
                  </Typography>
                </Box>

                {/* Vouchers Table */}
                {activeVouchers.length === 0 ? (
                  <Box sx={{ 
                    p: 4, 
                    textAlign: "center", 
                    bgcolor: "white", 
                    borderRadius: 1,
                    mb: 3 
                  }}>
                    <Typography sx={{ color: "#666" }}>
                      No active vouchers found. Create your first voucher!
                    </Typography>
                  </Box>
                ) : (
                  <VouchersTable vouchers={activeVouchers} />
                )}

                {/* Review Vouchers Carousel */}
                <Box
                  sx={{
                    mb: { xs: 3, md: 4 },
                    mx: { xs: -1, sm: 0 },
                  }}
                >
                  
                  {reviewVouchers.length > 0 ? (
                    <VoucherCarousel 
                      title={`Review Vouchers (${reviewVouchers.length})`} 
                      vouchers={reviewVouchers} 
                      type="review" 
                    />
                  ) : (
                    <Box sx={{ 
                      p: 4, 
                      textAlign: "center", 
                      bgcolor: "white", 
                      borderRadius: 1,
                      border: "1px dashed #ddd"
                    }}>
                      <Typography sx={{ color: "#666" }}>
                        No vouchers pending review. Vouchers appear here when they are fully used or marked for review.
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Expired Vouchers Carousel */}
                <Box
                  sx={{
                    mb: { xs: 3, md: 4 },
                    mx: { xs: -1, sm: 0 },
                  }}
                >
                 
                  {expiredVouchers.length > 0 ? (
                    <VoucherCarousel 
                      title={`Expired Vouchers (${expiredVouchers.length})`} 
                      vouchers={expiredVouchers} 
                      type="expired" 
                    />
                  ) : (
                    <Box sx={{ 
                      p: 4, 
                      textAlign: "center", 
                      bgcolor: "white", 
                      borderRadius: 1,
                      border: "1px dashed #ddd"
                    }}>
                      <Typography sx={{ color: "#666" }}>
                        No expired vouchers found. Vouchers appear here after their expiry date.
                      </Typography>
                    </Box>
                  )}
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