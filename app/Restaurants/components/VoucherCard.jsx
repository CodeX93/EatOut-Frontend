"use client"

import { Box, Typography, Button } from "@mui/material"

export default function VoucherCard({ voucher, onView }) {
  const handleView = () => {
    if (onView) {
      onView(voucher)
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        p: { xs: 1.5, sm: 2 },
        border: "2px solid #da1818",
        borderRadius: "12px",
        bgcolor: "#ffffff",
        position: "relative",
        cursor: "pointer",
        transition: "all 0.2s ease",
        gap: { xs: 1.5, sm: 2 },
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 4px 12px rgba(218, 24, 24, 0.15)",
        },
      }}
    >
      {/* Left side - E.A.T Logo */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: { xs: 32, sm: 40 },
          height: { xs: 32, sm: 40 },
          bgcolor: "#da1818",
          borderRadius: "50%",
          flexShrink: 0,
        }}
      >
        <Typography
          sx={{
            color: "white",
            fontWeight: "bold",
            fontSize: { xs: "0.625rem", sm: "12px" },
          }}
        >
          E
        </Typography>
      </Box>

      {/* Middle - Voucher Details */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 600,
            color: "#000000",
            fontSize: { xs: "0.75rem", sm: "14px" },
            lineHeight: 1.2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {voucher.restaurant}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: "#da1818",
            fontSize: { xs: "0.875rem", sm: "16px" },
            lineHeight: 1.2,
          }}
        >
          {voucher.discount}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: "#8a8a8f",
            fontSize: { xs: "0.5rem", sm: "10px" },
            lineHeight: 1.2,
          }}
        >
          Expiry: {voucher.expiry}
        </Typography>
      </Box>

      {/* Right side - View Button */}
      <Button
        variant="contained"
        size="small"
        onClick={handleView}
        sx={{
          bgcolor: "#da1818",
          color: "white",
          borderRadius: "6px",
          fontSize: { xs: "0.5rem", sm: "10px" },
          fontWeight: "bold",
          textTransform: "none",
          minWidth: { xs: "40px", sm: "50px" },
          height: { xs: "20px", sm: "24px" },
          flexShrink: 0,
          "&:hover": {
            bgcolor: "#c41515",
          },
        }}
      >
        View
      </Button>

      {/* Decorative notches */}
      <Box
        sx={{
          position: "absolute",
          left: { xs: -6, sm: -8 },
          top: "50%",
          transform: "translateY(-50%)",
          width: { xs: 12, sm: 16 },
          height: { xs: 12, sm: 16 },
          bgcolor: "#f9f9f9",
          borderRadius: "50%",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          right: { xs: -6, sm: -8 },
          top: "50%",
          transform: "translateY(-50%)",
          width: { xs: 12, sm: 16 },
          height: { xs: 12, sm: 16 },
          bgcolor: "#f9f9f9",
          borderRadius: "50%",
        }}
      />
    </Box>
  )
}
