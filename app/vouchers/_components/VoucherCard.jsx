"use client"

import { Box, Typography, Button, IconButton, Tooltip } from "@mui/material"
import MoreHorizIcon from "@mui/icons-material/MoreHoriz"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import LocalOfferIcon from "@mui/icons-material/LocalOffer"
import RestaurantIcon from "@mui/icons-material/Restaurant"

const VoucherCard = ({
  // Firebase data fields
  discount = "30%",
  minimumSpend = "RM 100",
  restaurantName = "Ruby Restaurant & Bars",
  branch = "Main Branch",
  voucherCode = "1XQ135412A",
  usedDate = "Dec 23, 2024",
  type = "review",
  // Additional Firebase fields
  quantity = 1,
  usedCount = 0,
  expiryDate = null,
  voucherType = "Percentage Discount",
  voucherDescription = "",
  // Actions
  onMoreClick = null,
  onActionClick = null,
  ...rest
}) => {
  // Safety checks for all props
  const safeDiscount = typeof discount === "string" ? discount : "30%"
  const safeMinimumSpend = typeof minimumSpend === "string" ? minimumSpend : "RM 100"
  const safeRestaurantName = typeof restaurantName === "string" ? restaurantName : "Ruby Restaurant & Bars"
  const safeBranch = typeof branch === "string" ? branch : "Main Branch"
  const safeVoucherCode = typeof voucherCode === "string" ? voucherCode : "1XQ135412A"
  const safeUsedDate = typeof usedDate === "string" ? usedDate : "Dec 23, 2024"
  const safeType = typeof type === "string" ? type : "review"
  const safeQuantity = typeof quantity === "number" ? quantity : 1
  const safeUsedCount = typeof usedCount === "number" ? usedCount : 0
  const safeVoucherType = typeof voucherType === "string" ? voucherType : "Percentage Discount"
  const safeDescription = typeof voucherDescription === "string" ? voucherDescription : ""

  // Calculate remaining vouchers
  const remainingVouchers = Math.max(0, safeQuantity - safeUsedCount)
  
  // Format voucher type for display
  const getVoucherTypeIcon = (type) => {
    switch (type) {
      case "Percentage Discount":
        return "%"
      case "Fixed Amount Discount":
      case "Cash Voucher":
        return "$"
      case "Buy One Get One Free":
        return "BOGO"
      case "Free Item":
        return "FREE"
      case "Free Shipping":
        return "🚚"
      default:
        return "🎟️"
    }
  }

  // Get button text and color based on type
  const getButtonConfig = (type) => {
    switch (type) {
      case "expired":
        return {
          text: "Expired",
          backgroundColor: "#9e9e9e",
          hoverColor: "#757575"
        }
      case "review":
        return {
          text: "Review",
          backgroundColor: "#ff2d55",
          hoverColor: "#da1818"
        }
      case "active":
        return {
          text: "Active",
          backgroundColor: "#4caf50",
          hoverColor: "#388e3c"
        }
      default:
        return {
          text: "View",
          backgroundColor: "#2196f3",
          hoverColor: "#1976d2"
        }
    }
  }

  const buttonConfig = getButtonConfig(safeType)

  // Handle more options click
  const handleMoreClick = (event) => {
    event.stopPropagation()
    if (onMoreClick) {
      onMoreClick({ voucherCode: safeVoucherCode, type: safeType })
    }
  }

  // Handle action button click
  const handleActionClick = (event) => {
    event.stopPropagation()
    if (onActionClick) {
      onActionClick({ voucherCode: safeVoucherCode, type: safeType })
    }
  }

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
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
          transform: "translateY(-1px)",
        },
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
      {/* Voucher type badge */}
      <Box
        sx={{
          position: "absolute",
          top: "8px",
          left: "8px",
          backgroundColor: "rgba(255, 45, 85, 0.1)",
          borderRadius: "4px",
          padding: "2px 6px",
          display: "flex",
          alignItems: "center",
          gap: "2px",
        }}
      >
        <Typography
          sx={{
            fontSize: "8px",
            fontWeight: 600,
            color: "#ff2d55",
          }}
        >
          {getVoucherTypeIcon(safeVoucherType)}
        </Typography>
      </Box>

      {/* More options icon */}
      <Tooltip title="More options" arrow>
        <IconButton
          onClick={handleMoreClick}
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
      </Tooltip>

      {/* Top section with discount info */}
      <Box sx={{ paddingRight: "24px", paddingLeft: "24px", marginBottom: "4px", marginTop: "8px" }}>
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
        
        {/* Restaurant info with icon */}
        <Box sx={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "1px" }}>
          <RestaurantIcon sx={{ fontSize: "12px", color: "#666666" }} />
          <Typography
            sx={{
              fontSize: "13px",
              fontWeight: 600,
              color: "#333333",
              lineHeight: 1.2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {safeRestaurantName}
          </Typography>
        </Box>
        
        <Typography
          sx={{
            fontSize: "11px",
            color: "#666666",
            lineHeight: 1.2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {safeBranch}
        </Typography>

        {/* Quantity info for active vouchers */}
        {(safeType === "active" || safeType === "review") && (
          <Typography
            sx={{
              fontSize: "9px",
              color: remainingVouchers > 0 ? "#4caf50" : "#ff9800",
              fontWeight: 500,
              marginTop: "2px",
            }}
          >
            {remainingVouchers > 0 
              ? `${remainingVouchers} remaining`
              : `All used (${safeUsedCount}/${safeQuantity})`
            }
          </Typography>
        )}
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
          gap: "4px",
        }}
      >
        <LocalOfferIcon sx={{ fontSize: "14px", color: "#666666" }} />
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
        <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
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
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {safeType === "expired" ? `Expired: ${safeUsedDate}` : 
             safeType === "review" ? `Used: ${safeUsedDate}` :
             `Valid until: ${expiryDate || safeUsedDate}`
            }
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={handleActionClick}
          sx={{
            backgroundColor: buttonConfig.backgroundColor,
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
            marginLeft: "8px",
            "&:hover": {
              backgroundColor: buttonConfig.hoverColor,
              boxShadow: "none",
            },
            "&:active": {
              boxShadow: "none",
            },
          }}
        >
          {buttonConfig.text}
        </Button>
      </Box>
    </Box>
  )
}

export default VoucherCard