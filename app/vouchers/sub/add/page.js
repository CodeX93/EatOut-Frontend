"use client"

import { useState } from "react"
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  InputAdornment,
  Snackbar,
  Alert,
  FormControl,
  Select,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { KeyboardArrowDown } from "@mui/icons-material"

// Sidebar component import
import Sidebar from "../../../components/SideNavbar"

// Custom styled components
const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    "& fieldset": {
      borderColor: "#efeff4",
    },
    "&:hover fieldset": {
      borderColor: "#da1818",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#da1818",
    },
  },
}))

const CreateButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#da1818",
  color: "#ffffff",
  borderRadius: "4px",
  padding: "10px 24px",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#c41515",
  },
}))

export default function AddVoucher() {
  // State for form data
  const [formData, setFormData] = useState({
    voucherType: "",
    valueOfSavings: "",
    voucherTitle: "",
    voucherDescription: "",
    termsAndConditions: "",
    quantity: "",
    expiryDate: "",
  })

  // State for snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  // Handle form changes
  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  // Handle create button click
  const handleCreate = () => {
    // Check if all required fields are filled
    const requiredFields = ["voucherType", "valueOfSavings", "voucherTitle", "quantity", "expiryDate"]
    const missingFields = requiredFields.filter((field) => !formData[field])

    if (missingFields.length > 0) {
      setSnackbar({
        open: true,
        message: "Please fill in all required fields",
        severity: "error",
      })
      return
    }

    // Success case - would normally send data to API
    setSnackbar({
      open: true,
      message: "Voucher created successfully!",
      severity: "success",
    })

    // Reset form after successful creation
    setFormData({
      voucherType: "",
      valueOfSavings: "",
      voucherTitle: "",
      voucherDescription: "",
      termsAndConditions: "",
      quantity: "",
      expiryDate: "",
    })
  }

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    })
  }

  // Voucher type options
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
          <Typography variant="h5" component="h1" sx={{ color: "#da1818", fontWeight: 'bold' }}>
            Add a Voucher
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
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 800, color: "#da1818" }}>
            Create a New Voucher:
          </Typography>

          {/* Form Grid */}
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 3, mb: 4 }}>
            {/* All the existing form fields remain the same */}
            {/* Voucher Type */}
            <Box>
              <Typography variant="body1" sx={{ mb: 1, fontWeight:'bolder' }}>
                Voucher Type
              </Typography>
              <FormControl fullWidth>
                <Select
                  value={formData.voucherType}
                  onChange={(e) => handleChange("voucherType", e.target.value)}
                  displayEmpty
                  inputProps={{ "aria-label": "Voucher Type" }}
                  sx={{
                    bgcolor: "#ffffff",
                    borderRadius: "8px",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#efeff4",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#da1818",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#da1818",
                    },
                  }}
                  IconComponent={KeyboardArrowDown}
                  renderValue={(selected) => {
                    if (!selected) {
                      return <Typography sx={{ color: "#8a8a8f" }}>Enter a Voucher type</Typography>
                    }
                    return selected
                  }}
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
              <Typography variant="body1" sx={{ mb: 1, fontWeight:'bolder' }}>
                Value of Savings
              </Typography>
              <StyledTextField
                fullWidth
                placeholder="Value of Savings"
                value={formData.valueOfSavings}
                onChange={(e) => handleChange("valueOfSavings", e.target.value)}
                InputProps={{
                  startAdornment:
                    formData.voucherType === "Percentage Discount" ? (
                      <InputAdornment position="start">%</InputAdornment>
                    ) : formData.voucherType === "Fixed Amount Discount" || formData.voucherType === "Cash Voucher" ? (
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
                placeholder="Enter Voucher Title"
                value={formData.voucherTitle}
                onChange={(e) => handleChange("voucherTitle", e.target.value)}
              />
            </Box>

            {/* Voucher Description */}
            <Box>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bolder' }}>
                Enter Voucher Description
              </Typography>
              <StyledTextField
                fullWidth
                placeholder="Enter Voucher Description"
                value={formData.voucherDescription}
                onChange={(e) => handleChange("voucherDescription", e.target.value)}
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
                placeholder="Enter Voucher's Terms & Conditions"
                value={formData.termsAndConditions}
                onChange={(e) => handleChange("termsAndConditions", e.target.value)}
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
                placeholder="Enter Voucher Quantity"
                value={formData.quantity}
                onChange={(e) => handleChange("quantity", e.target.value)}
                type="number"
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Box>

            {/* Expiry Date */}
            <Box>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bolder' }}>
                Expiry Date
              </Typography>
              <StyledTextField
                fullWidth
                type="date"
                value={formData.expiryDate || ""}
                onChange={(e) => handleChange("expiryDate", e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  placeholder: "Select Expiry Date",
                }}
              />
            </Box>
          </Box>

          {/* Create Button */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
            <CreateButton variant="contained" onClick={handleCreate}>
              Create a Voucher
            </CreateButton>
          </Box>
        </Box>

        {/* Success/Error Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%" }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  )
}
