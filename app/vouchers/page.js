"use client"

import { useState, useEffect } from "react"
import { Box, Typography, Button, CircularProgress, Alert } from "@mui/material"
import { Add, CardGiftcard, People, Restaurant } from "@mui/icons-material"
import { useRouter } from "next/navigation"

// Firebase imports
import { db } from "../../firebaseConfig" // Adjust path as needed
import { collection, query, getDocs, orderBy, where } from "firebase/firestore"

// Import your existing components
import AppLayout from "../components/AppLayout"

// Import the new components we created
import SearchAndFilters from "./_components/SearchAndFilters"
import VouchersTable from "./_components/VouchersTable"
import VoucherCarousel from "./_components/VoucherCarousel"
import ReportTable from "./_components/ReportTable"


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
  const mapToTableFormat = (voucher, restaurantNameMap = {}) => {
    const { 
      voucherCode, 
      voucherType, 
      valueOfSavings, 
      expiryDate, 
      quantity, 
      usedCount = 0,
      status = "active",
      restaurantEmail = ""
    } = voucher

    const balance = Math.max(0, quantity - usedCount)
    const restaurantName = restaurantNameMap[restaurantEmail] || restaurantEmail || "N/A"

    return {
      code: voucherCode,
      type: voucherType.replace(" Discount", "").replace(" Voucher", ""),
      value: voucherType === "Percentage Discount" ? `${valueOfSavings}%` : `$${valueOfSavings}`,
      validity: formatDate(expiryDate),
      restaurantName: restaurantName,
      balance: `${balance} / ${quantity}`,
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

      // Fetch all vouchers from `vouchers` collection (matches Firestore structure)
      const vouchersQuery = query(
        collection(db, "vouchers"),
        orderBy("createdAt", "desc")
      )

      const querySnapshot = await getDocs(vouchersQuery)
      const allVouchers = []

      querySnapshot.forEach((doc) => {
        const data = doc.data() || {}
        const quantity = Number(data.quantity ?? 0)
        const usedCount = Number(data.usedCount ?? 0)
        const available = Number(data.available ?? (quantity - usedCount))

        // Normalize to UI-expected fields - matching actual Firebase structure
        const normalized = {
          id: doc.id,
          voucherCode: data.voucherCode || doc.id,
          voucherType: data.voucherType || "Unknown",
          valueOfSavings: data.valueOfSavings ?? 0,
          voucherTitle: data.voucherTitle || "",
          voucherDescription: data.voucherDescription || "",
          expiryDate: data.expiryDate ?? null,
          quantity: quantity,
          usedCount: usedCount,
          status: data.status || (data.isActive ? "active" : "inactive"),
          isActive: data.isActive !== undefined ? data.isActive : true,
          createdAt: data.createdAt ?? null,
          minSpending: data.minSpending ?? 0,
          restaurantEmail: data.restaurantEmail ?? "",
          termsAndConditions: typeof data.termsAndConditions === "string" 
            ? data.termsAndConditions 
            : (Array.isArray(data.termsAndConditions) ? data.termsAndConditions.join("\n") : ""),
          description: data.voucherDescription || "",
          available: available,
          voucherId: data.voucherCode || doc.id,
        }

        allVouchers.push(normalized)
      })

      // Fetch restaurant names for mapping
      const restaurantNameMap = {}
      try {
        const restaurantsSnap = await getDocs(collection(db, "registeredRestaurants"))
        restaurantsSnap.forEach((doc) => {
          const restaurantData = doc.data() || {}
          const email = restaurantData.email || doc.id
          if (email) {
            restaurantNameMap[email.toLowerCase().trim()] = 
              restaurantData.restaurantName || 
              restaurantData.name || 
              email
          }
        })
      } catch (error) {
        console.error("Error fetching restaurants:", error)
      }

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
          active.push(mapToTableFormat(voucher, restaurantNameMap))
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

      // Generate usage summary and reports from real redemption data
      await generateUsageSummary(allVouchers)

    } catch (err) {
      console.error("Error fetching voucher data:", err)
      setError("Failed to load voucher data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Generate usage summary and reports from real redemption data
  // Using REAL data - no fake $85 calculations
  const generateUsageSummary = async (vouchers) => {
    try {
      const allRedemptions = []
      const memberStats = new Map() // email -> { name, vouchersUsed, totalDiscount, totalSpend }
      const merchantStats = new Map() // restaurantEmail -> { name, vouchersApplied, totalDiscount, salesGenerated, voucherCounts }
      const voucherStats = new Map() // voucherCode -> { usedCount, totalDiscount, ordersGenerated }

      // Fetch redemptions for each voucher
      for (const voucher of vouchers) {
        try {
          const redeemedSnap = await getDocs(
            collection(db, "vouchers", voucher.id, "redeemedUsers")
          )

          let voucherUsedCount = 0
          let voucherTotalDiscount = 0
          let voucherOrdersGenerated = 0

          // Use voucher's minSpending for better estimates (or actualOrderAmount if available)
          const voucherMinSpending = Number(voucher.minSpending) || 0

          redeemedSnap.forEach((rDoc) => {
            const rData = rDoc.data() || {}
            
            // Only count redemptions where used === true
            if (rData.used === true) {
              const userEmail = rData.userEmail || rData.email || rDoc.id
              const restaurantEmail = voucher.restaurantEmail || ""
              
              // Use actual order amount if available, otherwise estimate from minSpending
              const orderValue = rData.actualOrderAmount || voucherMinSpending
              
              // Calculate discount based on voucher type
              let discount = 0
              if (voucher.voucherType === "Percentage Discount") {
                discount = (orderValue * voucher.valueOfSavings) / 100
              } else if (
                voucher.voucherType === "Fixed Amount Discount" ||
                voucher.voucherType === "Cash Voucher"
              ) {
                discount = Number(voucher.valueOfSavings) || 0
              }

              const memberSpend = orderValue

              // Track redemption
              allRedemptions.push({
                voucherId: voucher.id,
                voucherCode: voucher.voucherCode,
                userEmail,
                restaurantEmail,
                discount,
                orderValue,
                redeemedAt: rData.redeemedAt || voucher.createdAt || new Date(),
              })

              // Update voucher stats
              voucherUsedCount++
              voucherTotalDiscount += discount
              voucherOrdersGenerated += orderValue

              // Update member stats
              if (userEmail) {
                if (!memberStats.has(userEmail)) {
                  memberStats.set(userEmail, {
                    email: userEmail,
                    name: userEmail.split("@")[0], // Will be updated if member data available
                    vouchersUsed: 0,
                    totalDiscount: 0,
                    totalSpend: 0,
                  })
                }
                const member = memberStats.get(userEmail)
                member.vouchersUsed++
                member.totalDiscount += discount
                member.totalSpend += memberSpend
              }

              // Update merchant stats
              if (restaurantEmail) {
                if (!merchantStats.has(restaurantEmail)) {
                  merchantStats.set(restaurantEmail, {
                    email: restaurantEmail,
                    name: restaurantEmail.split("@")[0], // Will be updated if restaurant data available
                    vouchersApplied: 0,
                    totalDiscount: 0,
                    salesGenerated: 0,
                    voucherCounts: new Map(), // voucherCode -> count
                  })
                }
                const merchant = merchantStats.get(restaurantEmail)
                merchant.vouchersApplied++
                merchant.totalDiscount += discount
                merchant.salesGenerated += orderValue
                
                // Track top voucher
                const voucherCount = merchant.voucherCounts.get(voucher.voucherCode) || 0
                merchant.voucherCounts.set(voucher.voucherCode, voucherCount + 1)
              }
            }
          })

          // Store voucher-level stats for usage summary
          if (voucherUsedCount > 0) {
            voucherStats.set(voucher.voucherCode, {
              usedCount: voucherUsedCount,
              totalDiscount: voucherTotalDiscount,
              ordersGenerated: voucherOrdersGenerated,
            })
          }
        } catch (error) {
          console.error(`Error fetching redemptions for voucher ${voucher.id}:`, error)
        }
      }

      // Fetch member names if available
      try {
        const membersSnap = await getDocs(collection(db, "members"))
        membersSnap.forEach((doc) => {
          const memberData = doc.data() || {}
          if (memberData.email && memberStats.has(memberData.email)) {
            const member = memberStats.get(memberData.email)
            member.name = memberData.name || member.email.split("@")[0]
          }
        })
      } catch (error) {
        console.error("Error fetching members:", error)
      }

      // Fetch restaurant names if available
      try {
        const restaurantsSnap = await getDocs(collection(db, "registeredRestaurants"))
        restaurantsSnap.forEach((doc) => {
          const restaurantData = doc.data() || {}
          if (restaurantData.email && merchantStats.has(restaurantData.email)) {
            const merchant = merchantStats.get(restaurantData.email)
            merchant.name = restaurantData.restaurantName || restaurantData.name || merchant.email.split("@")[0]
          }
        })
      } catch (error) {
        console.error("Error fetching restaurants:", error)
      }

      // Generate Voucher Usage Summary
      const usageSummary = Array.from(voucherStats.entries())
        .map(([voucherCode, stats]) => ({
          code: voucherCode,
          totalUsed: stats.usedCount,
          totalDiscount: `$${stats.totalDiscount.toFixed(0)}`,
          ordersGenerated: `$${stats.ordersGenerated.toFixed(0)}`,
          memberSavings: `$${stats.totalDiscount.toFixed(0)}`,
          merchantSales: `$${(stats.ordersGenerated * 0.98).toFixed(0)}`, // Minus small fee
        }))
        .sort((a, b) => b.totalUsed - a.totalUsed)
        .slice(0, 4) // Top 4 most used vouchers

      setVoucherUsageSummary(usageSummary)

      // Generate Member-Based Report
      const memberReport = Array.from(memberStats.values())
        .map(member => ({
          name: member.name,
          email: member.email,
          vouchersUsed: member.vouchersUsed,
          totalDiscount: `$${member.totalDiscount.toFixed(2)}`,
          totalSpend: `$${member.totalSpend.toFixed(2)}`,
        }))
        .sort((a, b) => b.vouchersUsed - a.vouchersUsed)
        .slice(0, 10) // Top 10 members

      setMemberBasedReport(memberReport)

      // Generate Merchant-Based Report
      const merchantReport = Array.from(merchantStats.values())
        .map(merchant => {
          // Find top voucher
          let topVoucher = "N/A"
          let maxCount = 0
          merchant.voucherCounts.forEach((count, voucherCode) => {
            if (count > maxCount) {
              maxCount = count
              topVoucher = voucherCode
            }
          })

          return {
            name: merchant.name,
            vouchersApplied: merchant.vouchersApplied,
            totalDiscount: `$${merchant.totalDiscount.toFixed(2)}`,
            salesGenerated: `$${merchant.salesGenerated.toFixed(2)}`,
            topVoucher: topVoucher,
          }
        })
        .sort((a, b) => b.vouchersApplied - a.vouchersApplied)
        .slice(0, 10) // Top 10 merchants

      setMerchantBasedReport(merchantReport)

    } catch (error) {
      console.error("Error generating reports:", error)
      // Set empty data on error
      setVoucherUsageSummary([])
      setMemberBasedReport([])
      setMerchantBasedReport([])
    }
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
      <AppLayout>
        <Box
          component="div"
          sx={{
            flexGrow: 1,
            height: "100vh",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress size={60} sx={{ color: "#da1818", mb: 2 }} />
          <Typography variant="h6" sx={{ color: "#666" }}>
            Loading vouchers data...
          </Typography>
        </Box>
      </AppLayout>
    )
  }

  // Error state
  if (error) {
    return (
      <AppLayout>
        <Box
          component="div"
          sx={{
            flexGrow: 1,
            height: "100vh",
            width: "100%",
            display: "flex",
            flexDirection: "column",
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
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      {/* Main Content */}
      <Box
        component="div"
        sx={{
          flexGrow: 1,
          height: "100vh",
          width: "100%",
          display: "flex",
          flexDirection: "column",
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
    </AppLayout>
  )
}