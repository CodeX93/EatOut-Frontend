"use client"

import { Box, Typography, TextField, Button, MenuItem, InputAdornment, FormControl, Select } from "@mui/material"
import { styled } from "@mui/material/styles"
import { KeyboardArrowDown } from "@mui/icons-material"

// Sidebar component import
import Sidebar from "../../../components/SideNavbar"

// Custom styled components
const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    "& fieldset": {
      borderColor: "#efeff4",
    },
    "&:hover fieldset": {
      borderColor: "#efeff4",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#efeff4",
    },
  },
}))

const DisabledButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#8a8a8f",
  color: "#ffffff",
  borderRadius: "4px",
  padding: "10px 24px",
  textTransform: "none",
  cursor: "not-allowed",
  "&:hover": {
    backgroundColor: "#8a8a8f",
  },
  "&:disabled": {
    backgroundColor: "#8a8a8f",
    color: "#ffffff",
  },
}))

export default function ViewVoucherDetails({ voucherId, voucherData }) {
  // Function to get voucher data based on ID or use provided data
  const getVoucherData = (id) => {
    // If voucherData prop is provided, use it
    if (voucherData) {
      return voucherData
    }

    // Mock data - in real app, this would fetch from API
    const vouchers = {
      1: {
        voucherType: "Free Item",
        valueOfSavings: "10%",
        voucherTitle: "SAVE10",
        voucherDescription: "Get 10% off on your next order. Valid for all menu items.",
        termsAndConditions:
          "Valid for one-time use only. Cannot be combined with other offers. Minimum order value $20.",
        quantity: "500",
        expiryDate: "1 May - 30 May",
      },
      2: {
        voucherType: "Percentage Discount",
        valueOfSavings: "20%",
        voucherTitle: "WELCOME20",
        voucherDescription: "Welcome bonus for new customers. Enjoy 20% discount on your first order.",
        termsAndConditions: "Valid for new customers only. One-time use. Valid for 30 days from registration.",
        quantity: "1000",
        expiryDate: "1 Jun - 30 Jun",
      },
      3: {
        voucherType: "Fixed Amount Discount",
        valueOfSavings: "$5",
        voucherTitle: "SAVE5",
        voucherDescription: "Save $5 on orders above $25. Perfect for lunch deals.",
        termsAndConditions: "Minimum order value $25. Valid for delivery and pickup orders.",
        quantity: "250",
        expiryDate: "15 May - 15 Jun",
      },
    }
    return vouchers[id] || vouchers["1"] // Default to first voucher if ID not found
  }

  // Get the voucher data
  const voucher = getVoucherData(voucherId)

  // Voucher type options (for display purposes)
  const voucherTypes = [
    "Percentage Discount",
    "Fixed Amount Discount",
    "Buy One Get One Free",
    "Free Item",
    "Free Shipping",
    "Cash Voucher",
  ]

  return (
    <Box sx={{ display: "flex", bgcolor: "#f9f9f9", minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: "240px",
          pt: 2,
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h1" sx={{ color: "#da1818", fontWeight: 'bolder' }}>
            View A Voucher
          </Typography>
        </Box>

        {/* Form Container - White Box */}
        <Box
          sx={{
            maxWidth: "1200px",
            mx: "auto",
            bgcolor: "#ffffff",
            borderRadius: "8px",
            boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
            p: 4,
          }}
        >
          {/* Subheading */}
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: "#da1818" }}>
            View a Voucher:
          </Typography>

          {/* Form Grid */}
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 3, mb: 4 }}>
            {/* Voucher Type */}
            <Box>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bolder' }}>
                Voucher Type
              </Typography>
              <FormControl fullWidth>
                <Select
                  value={voucher.voucherType}
                  disabled
                  inputProps={{ "aria-label": "Voucher Type" }}
                  sx={{
                    bgcolor: "#f8f9fa",
                    borderRadius: "8px",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#efeff4",
                    },
                    "&.Mui-disabled": {
                      bgcolor: "#f8f9fa",
                    },
                    "&.Mui-disabled .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#efeff4",
                    },
                  }}
                  IconComponent={KeyboardArrowDown}
                >
                  {voucherTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Value of Savings */}
            <Box>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bolder' }}>
                Value of Savings
              </Typography>
              <StyledTextField
                fullWidth
                value={voucher.valueOfSavings}
                InputProps={{
                  readOnly: true,
                  startAdornment:
                    voucher.voucherType === "Percentage Discount" ? (
                      <InputAdornment position="start">%</InputAdornment>
                    ) : voucher.voucherType === "Fixed Amount Discount" || voucher.voucherType === "Cash Voucher" ? (
                      <InputAdornment position="start">$</InputAdornment>
                    ) : null,
                }}
              />
            </Box>

            {/* Voucher Title */}
            <Box sx={{ gridColumn: "1 / -1" }}>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bolder' }}>
                Enter Voucher Title
              </Typography>
              <StyledTextField
                fullWidth
                value={voucher.voucherTitle}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Box>

            {/* Voucher Description */}
            <Box>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bolder' }}>
                Enter Voucher Description
              </Typography>
              <StyledTextField
                fullWidth
                value={voucher.voucherDescription}
                InputProps={{
                  readOnly: true,
                }}
                multiline
                rows={4}
              />
            </Box>

            {/* Terms & Conditions */}
            <Box>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bolder' }}>
                Enter Voucher's Terms & Conditions
              </Typography>
              <StyledTextField
                fullWidth
                value={voucher.termsAndConditions}
                InputProps={{
                  readOnly: true,
                }}
                multiline
                rows={4}
              />
            </Box>

            {/* Voucher Quantity */}
            <Box>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bolder' }}>
                Enter Voucher Quantity
              </Typography>
              <StyledTextField
                fullWidth
                value={voucher.quantity}
                InputProps={{
                  readOnly: true,
                }}
                type="number"
              />
            </Box>

            {/* Expiry Date */}
            <Box>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bolder' }}>
                Expiry Date
              </Typography>
              <StyledTextField
                fullWidth
                value={voucher.expiryDate}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Box>
          </Box>

          {/* Disabled Update Button */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
            <DisabledButton variant="contained" disabled>
              Update a Voucher
            </DisabledButton>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
