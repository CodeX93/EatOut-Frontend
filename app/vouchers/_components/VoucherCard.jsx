"use client"

import { Box, Typography, Button, IconButton } from "@mui/material"
import MoreHorizIcon from "@mui/icons-material/MoreHoriz"
import AccessTimeIcon from "@mui/icons-material/AccessTime"

const VoucherCard = ({ voucher, type }) => {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        minHeight: { xs: "160px", sm: "180px" },
        backgroundColor: "#eeeeee",
        borderRadius: "12px",
        padding: { xs: "12px", sm: "16px" },
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
        },
        // Create the left semi-circle cutout
        "&::before": {
          content: '""',
          position: "absolute",
          left: { xs: "-8px", sm: "-10px" },
          top: "50%",
          transform: "translateY(-50%)",
          width: { xs: "16px", sm: "20px" },
          height: { xs: "16px", sm: "20px" },
          backgroundColor: "#ffffff",
          borderRadius: "50%",
          zIndex: 1,
        },
        // Create the right semi-circle cutout
        "&::after": {
          content: '""',
          position: "absolute",
          right: { xs: "-8px", sm: "-10px" },
          top: "50%",
          transform: "translateY(-50%)",
          width: { xs: "16px", sm: "20px" },
          height: { xs: "16px", sm: "20px" },
          backgroundColor: "#ffffff",
          borderRadius: "50%",
          zIndex: 1,
        },
      }}
    >
      {/* Three dots menu */}
      <IconButton
        sx={{
          position: "absolute",
          top: { xs: "8px", sm: "12px" },
          right: { xs: "8px", sm: "12px" },
          padding: "4px",
          width: { xs: "20px", sm: "24px" },
          height: { xs: "20px", sm: "24px" },
          backgroundColor: "rgba(0, 0, 0, 0.08)",
          borderRadius: "50%",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.12)",
          },
        }}
      >
        <MoreHorizIcon sx={{ color: "#888888", fontSize: { xs: "14px", sm: "16px" } }} />
      </IconButton>

      {/* Top section */}
      <Box sx={{ paddingRight: { xs: "24px", sm: "30px" }, mb: 1 }}>
        <Typography
          sx={{
            fontSize: { xs: "14px", sm: "18px" },
            fontWeight: 700,
            color: "#333333",
            marginBottom: "4px",
            lineHeight: 1.2,
          }}
        >
          {voucher.discount || "30%"} off Total Bill
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: "10px", sm: "12px" },
            color: "#666666",
            marginBottom: { xs: "8px", sm: "12px" },
            lineHeight: 1.3,
          }}
        >
          {voucher.condition || "Valid with Minimum Spending of RM 100 and above"}
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: "14px", sm: "16px" },
            fontWeight: 700,
            color: "#333333",
            marginBottom: "2px",
            lineHeight: 1.2,
          }}
        >
          {voucher.restaurant || "Ruby Restaurant & Bars"}
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: "11px", sm: "13px" },
            color: "#666666",
            lineHeight: 1.2,
          }}
        >
          {voucher.branch || "Kuala Lumpur Branch"}
        </Typography>
      </Box>

      {/* Middle section with dashed line and voucher code */}
      <Box sx={{ flex: "1 0 auto", display: "flex", flexDirection: "column" }}>
        {/* Dashed separator line */}
        <Box
          sx={{
            width: { xs: "calc(100% + 24px)", sm: "calc(100% + 32px)" },
            height: "0px",
            marginLeft: { xs: "-12px", sm: "-16px" },
            marginRight: { xs: "-12px", sm: "-16px" },
            borderTop: "1px dashed #cccccc",
            marginBottom: { xs: "8px", sm: "12px" },
          }}
        />

        {/* Voucher code - centered */}
        <Box sx={{ textAlign: "center", mb: { xs: 1.5, sm: 2 } }}>
          <Typography
            sx={{
              fontSize: { xs: "14px", sm: "16px" },
              fontWeight: 700,
              color: "#333333",
              letterSpacing: "1.5px",
              fontFamily: "monospace",
            }}
          >
            {voucher.code || "1XQ135412A"}
          </Typography>
        </Box>
      </Box>

      {/* Bottom section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          marginTop: "auto",
          paddingTop: { xs: "6px", sm: "8px" },
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 1, sm: 0 },
        }}
      >
        {/* Used date with clock icon */}
        <Box sx={{ display: "flex", alignItems: "center", order: { xs: 2, sm: 1 } }}>
          <AccessTimeIcon
            sx={{
              fontSize: { xs: "12px", sm: "14px" },
              color: "#888888",
              marginRight: "4px",
            }}
          />
          <Typography
            sx={{
              fontSize: { xs: "10px", sm: "12px" },
              color: "#888888",
              fontWeight: 400,
            }}
          >
            Used: {voucher.usedDate || "Dec 23, 2024"}
          </Typography>
        </Box>

        {/* Review/Expired button */}
        <Button
          variant="contained"
          sx={{
            backgroundColor: type === "expired" ? "#9e9e9e" : "#d32f2f",
            color: "#ffffff",
            textTransform: "none",
            borderRadius: "20px",
            padding: { xs: "3px 12px", sm: "4px 16px" },
            fontSize: { xs: "11px", sm: "13px" },
            fontWeight: 500,
            minWidth: { xs: "60px", sm: "70px" },
            height: { xs: "24px", sm: "28px" },
            boxShadow: "none",
            lineHeight: 1,
            order: { xs: 1, sm: 2 },
            "&:hover": {
              backgroundColor: type === "expired" ? "#757575" : "#b71c1c",
              boxShadow: "none",
            },
            "&:active": {
              boxShadow: "none",
            },
          }}
        >
          {type === "expired" ? "Expired" : "Review"}
        </Button>
      </Box>
    </Box>
  )
}

export default VoucherCard
