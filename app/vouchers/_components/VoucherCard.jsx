"use client"

import { Box, Typography, Button, IconButton } from "@mui/material"
import MoreHorizIcon from "@mui/icons-material/MoreHoriz"
import AccessTimeIcon from "@mui/icons-material/AccessTime"

const VoucherCard = ({
  discount = "30%",
  minimumSpend = "RM 100",
  restaurantName = "Ruby Restaurant & Bars",
  branch = "Kuala Lumpur Branch",
  voucherCode = "1XQ135412A",
  usedDate = "Dec 23, 2024",
  type = "review",
  ...rest
}) => {
  const safeDiscount = typeof discount === "string" ? discount : "30%"
  const safeMinimumSpend = typeof minimumSpend === "string" ? minimumSpend : "RM 100"
  const safeRestaurantName = typeof restaurantName === "string" ? restaurantName : "Ruby Restaurant & Bars"
  const safeBranch = typeof branch === "string" ? branch : "Kuala Lumpur Branch"
  const safeVoucherCode = typeof voucherCode === "string" ? voucherCode : "1XQ135412A"
  const safeUsedDate = typeof usedDate === "string" ? usedDate : "Dec 23, 2024"
  const safeType = typeof type === "string" ? type : "review"

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "180px",
        backgroundColor: "#f5f5f5",
        borderRadius: "8px",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        overflow: "visible",
        // Left semi-circle cutout
        "&::before": {
          content: '""',
          position: "absolute",
          left: "-12px",
          top: "50%",
          transform: "translateY(-50%)",
          width: "24px",
          height: "24px",
          backgroundColor: "#ffffff",
          borderRadius: "50%",
          zIndex: 2,
          border: "1px solid #e0e0e0",
        },
        // Right semi-circle cutout
        "&::after": {
          content: '""',
          position: "absolute",
          right: "-12px",
          top: "50%",
          transform: "translateY(-50%)",
          width: "24px",
          height: "24px",
          backgroundColor: "#ffffff",
          borderRadius: "50%",
          zIndex: 2,
          border: "1px solid #e0e0e0",
        },
      }}
    >
      {/* More options icon */}
      <IconButton
        sx={{
          position: "absolute",
          top: "8px",
          right: "8px",
          padding: "2px",
          width: "20px",
          height: "20px",
          backgroundColor: "#c7c7cc",
          borderRadius: "50%",
          "&:hover": {
            backgroundColor: "#b0b0b5",
          },
        }}
      >
        <MoreHorizIcon sx={{ color: "#666666", fontSize: "14px" }} />
      </IconButton>

      {/* Top section with discount info */}
      <Box sx={{ paddingRight: "24px", marginBottom: "4px" }}>
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 600,
            color: "#333333",
            marginBottom: "2px",
            lineHeight: 1.2,
          }}
        >
          {safeDiscount} off Total Bill
        </Typography>
        <Typography
          sx={{
            fontSize: "10px",
            color: "#666666",
            marginBottom: "8px",
            lineHeight: 1.3,
          }}
        >
          Valid with Minimum Spending of {safeMinimumSpend} and above
        </Typography>
        <Typography
          sx={{
            fontSize: "13px",
            fontWeight: 600,
            color: "#333333",
            marginBottom: "1px",
            lineHeight: 1.2,
          }}
        >
          {safeRestaurantName}
        </Typography>
        <Typography
          sx={{
            fontSize: "11px",
            color: "#666666",
            lineHeight: 1.2,
          }}
        >
          {safeBranch}
        </Typography>
      </Box>

      {/* Dashed line separator */}
      <Box
        sx={{
          width: "calc(100% + 32px)",
          height: "0px",
          marginLeft: "-16px",
          marginRight: "-16px",
          borderTop: "1px dashed #cccccc",
          marginBottom: "8px",
        }}
      />

      {/* Voucher code */}
      <Box
        sx={{
          textAlign: "center",
          marginBottom: "12px",
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          sx={{
            fontSize: "16px",
            fontWeight: 700,
            color: "#333333",
            letterSpacing: "1.5px",
            fontFamily: "monospace",
          }}
        >
          {safeVoucherCode}
        </Typography>
      </Box>

      {/* Bottom section with date and button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "auto",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <AccessTimeIcon
            sx={{
              fontSize: "12px",
              color: "#888888",
              marginRight: "4px",
            }}
          />
          <Typography
            sx={{
              fontSize: "10px",
              color: "#888888",
              fontWeight: 400,
            }}
          >
            Used: {safeUsedDate}
          </Typography>
        </Box>

        <Button
          variant="contained"
          sx={{
            backgroundColor: safeType === "expired" ? "#9e9e9e" : "#ff2d55",
            color: "#ffffff",
            textTransform: "none",
            borderRadius: "12px",
            padding: "4px 12px",
            fontSize: "11px",
            fontWeight: 500,
            minWidth: "60px",
            height: "24px",
            boxShadow: "none",
            lineHeight: 1,
            "&:hover": {
              backgroundColor: safeType === "expired" ? "#757575" : "#da1818",
              boxShadow: "none",
            },
            "&:active": {
              boxShadow: "none",
            },
          }}
        >
          {safeType === "expired" ? "Expired" : "Review"}
        </Button>
      </Box>
    </Box>
  )
}

export default VoucherCard
