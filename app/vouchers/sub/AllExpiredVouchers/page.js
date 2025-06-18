import { Box, Typography, Grid } from "@mui/material"
import SideNavbar from "../../../components/SideNavbar"
import VoucherCard from "../../_components/VoucherCard"

// Mock data for vouchers - creating 20 vouchers with some expired
const voucherData = Array.from({ length: 20 }, (_, index) => ({
    discount: "30%",
    minimumSpend: "RM 100",
    restaurantName: "Ruby Restaurant & Bars",
    branch: "Kuala Lumpur Branch",
    voucherCode: "1XQ135412A",
    usedDate: "Dec 23, 2024",
    type: index >= 10 ? "expired" : "review", // Make the last row expired
    id: index + 1,
  }))
  
  const AllExpiredVouchers = () => {
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
            {/* Using flexbox directly for more control */}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                margin: "-2px", // Compensate for the padding on card wrappers
              }}
            >
              {voucherData.map((voucher) => (
                <Box
                  key={voucher.id}
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
                    type={voucher.type || 'expired'}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    )
  }
  
  export default AllExpiredVouchers
  