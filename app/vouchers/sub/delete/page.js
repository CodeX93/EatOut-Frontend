"use client"

import { useState } from "react"
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  InputAdornment,
  FormControl,
  Select,
  Modal,
  Snackbar,
  Alert,
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

const DeleteButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#da1818",
  color: "#ffffff",
  borderRadius: "4px",
  padding: "10px 24px",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#c41515",
  },
}))

export default function DeleteVoucherDetails({ voucherId, voucherData, onDelete }) {
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
        expiryDate: "2023-05-30",
      },
      2: {
        voucherType: "Percentage Discount",
        valueOfSavings: "20%",
        voucherTitle: "WELCOME20",
        voucherDescription: "Welcome bonus for new customers. Enjoy 20% discount on your first order.",
        termsAndConditions: "Valid for new customers only. One-time use. Valid for 30 days from registration.",
        quantity: "1000",
        expiryDate: "2023-06-30",
      },
      3: {
        voucherType: "Fixed Amount Discount",
        valueOfSavings: "$5",
        voucherTitle: "SAVE5",
        voucherDescription: "Save $5 on orders above $25. Perfect for lunch deals.",
        termsAndConditions: "Minimum order value $25. Valid for delivery and pickup orders.",
        quantity: "250",
        expiryDate: "2023-06-15",
      },
    }
    return vouchers[id] || vouchers["1"] // Default to first voucher if ID not found
  }

  // State for form data
  const [formData, setFormData] = useState(getVoucherData(voucherId))

  // State for modal
  const [openModal, setOpenModal] = useState(false)

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

  // Handle Delete button click
  const handleDelete = () => {
    setOpenModal(true)
  }

  // Handle modal confirm
  const handleConfirmDelete = () => {
    // Close modal
    setOpenModal(false)

    // Call onDelete prop if provided
    if (onDelete) {
      onDelete(formData)
    }

    // Show success message
    setSnackbar({
      open: true,
      message: "Voucher Deleted successfully!",
      severity: "success",
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
          <Typography variant="h5" component="h1" sx={{ color: "#da1818", fontWeight: 'bolder' }}>
            Delete A Voucher
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
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bolder', color: "#da1818" }}>
            Delete a Voucher:
          </Typography>

          {/* Form Grid */}
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 3, mb: 4 }}>
            {/* Voucher Type */}
            <Box>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bold' }}>
                Voucher Type
              </Typography>
              <FormControl fullWidth>
                <Select
                  value={formData.voucherType}
                  onChange={(e) => handleChange("voucherType", e.target.value)}
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
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bold' }}>
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
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bold' }}>
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
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bold' }}>
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
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bold' }}>
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
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bold' }}>
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
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bold' }}>
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
              />
            </Box>
          </Box>

          {/* Delete Button */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
            <DeleteButton variant="contained" onClick={handleDelete}>
              Delete a Voucher
            </DeleteButton>
          </Box>
        </Box>

        {/* Delete Confirmation Modal */}
        <Modal open={openModal} onClose={() => setOpenModal(false)} aria-labelledby="Delete-modal-title">
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography id="Delete-modal-title" variant="h6" component="h2" sx={{ textAlign: "center", mb: 2 }}>
              Delete Voucher
            </Typography>
            <Typography sx={{ textAlign: "center", mb: 3 }}>
              Click on Delete to delete voucher or Discard to cancel.
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => setOpenModal(false)}
                sx={{
                  borderColor: "#e0e0e0",
                  color: "#666666",
                  "&:hover": {
                    borderColor: "#d0d0d0",
                    bgcolor: "#f5f5f5",
                  },
                }}
              >
                Discard
              </Button>
              <Button
                variant="contained"
                onClick={handleConfirmDelete}
                sx={{
                  bgcolor: "#da1818",
                  "&:hover": {
                    bgcolor: "#c41515",
                  },
                }}
              >
                Delete
              </Button>
            </Box>
          </Box>
        </Modal>

        {/* Success Snackbar */}
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
