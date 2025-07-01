"use client"

import { useState, useEffect } from "react"
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
  CircularProgress,
  IconButton,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { KeyboardArrowDown, Refresh } from "@mui/icons-material"

// Firebase imports
import { db } from "../../../../firebaseConfig" // Adjust path as needed
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore"

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
  "&:disabled": {
    backgroundColor: "#cccccc",
  },
}))

// Helper function to get current date in YYYY-MM-DD format
const getCurrentDate = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export default function AddVoucher() {
  // State for form data - Initialize expiryDate with current date
  const [formData, setFormData] = useState({
    voucherType: "",
    valueOfSavings: "",
    voucherTitle: "",
    voucherDescription: "",
    termsAndConditions: "",
    quantity: "",
    expiryDate: getCurrentDate(), // Set current date as default
    voucherCode: "", // Auto-generated voucher code
  })

  // State for snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  // Loading state for create button
  const [isLoading, setIsLoading] = useState(false)
  
  // Loading state for voucher code generation
  const [isGeneratingCode, setIsGeneratingCode] = useState(false)

  // Function to generate random alphanumeric string
  const generateRandomString = (length) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  // Function to generate voucher code with format REVL72TID
  const generateVoucherCode = () => {
    const prefix = 'REV'
    const randomPart = generateRandomString(6) // Generates 6 random characters
    return prefix + randomPart
  }

  // Function to check if voucher code is unique
  const isVoucherCodeUnique = async (code) => {
    try {
      const vouchersQuery = query(
        collection(db, "vouchers"),
        where("voucherCode", "==", code)
      )
      const querySnapshot = await getDocs(vouchersQuery)
      return querySnapshot.empty // Returns true if no documents found (unique)
    } catch (error) {
      console.error("Error checking voucher code uniqueness:", error)
      return false
    }
  }

  // Function to generate unique voucher code
  const generateUniqueVoucherCode = async () => {
    setIsGeneratingCode(true)
    let attempts = 0
    const maxAttempts = 10
    
    try {
      while (attempts < maxAttempts) {
        const newCode = generateVoucherCode()
        const isUnique = await isVoucherCodeUnique(newCode)
        
        if (isUnique) {
          setFormData(prev => ({
            ...prev,
            voucherCode: newCode
          }))
          setIsGeneratingCode(false)
          return newCode
        }
        
        attempts++
      }
      
      // If we couldn't generate a unique code after max attempts
      throw new Error("Failed to generate unique voucher code after multiple attempts")
      
    } catch (error) {
      console.error("Error generating unique voucher code:", error)
      setSnackbar({
        open: true,
        message: "Failed to generate unique voucher code. Please try again.",
        severity: "error",
      })
      setIsGeneratingCode(false)
      return null
    }
  }

  // Generate voucher code on component mount
  useEffect(() => {
    generateUniqueVoucherCode()
  }, [])

  // Handle form changes
  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  // Handle voucher code regeneration
  const handleRegenerateCode = async () => {
    await generateUniqueVoucherCode()
  }

  // Handle create button click
  const handleCreate = async () => {
    // Check if all required fields are filled
    const requiredFields = ["voucherType", "valueOfSavings", "voucherTitle", "quantity", "expiryDate", "voucherCode"]
    const missingFields = requiredFields.filter((field) => !formData[field])

    if (missingFields.length > 0) {
      setSnackbar({
        open: true,
        message: "Please fill in all required fields",
        severity: "error",
      })
      return
    }

    // Check if voucher code is still generating
    if (isGeneratingCode) {
      setSnackbar({
        open: true,
        message: "Please wait for voucher code generation to complete",
        severity: "warning",
      })
      return
    }

    setIsLoading(true)

    try {
      // Double-check voucher code uniqueness before saving
      const isUnique = await isVoucherCodeUnique(formData.voucherCode)
      if (!isUnique) {
        // Regenerate code if it's no longer unique
        const newCode = await generateUniqueVoucherCode()
        if (!newCode) {
          setIsLoading(false)
          return
        }
      }

      // Prepare data for Firestore
      const voucherData = {
        voucherType: formData.voucherType,
        valueOfSavings: parseFloat(formData.valueOfSavings) || formData.valueOfSavings,
        voucherTitle: formData.voucherTitle,
        voucherDescription: formData.voucherDescription || "",
        termsAndConditions: formData.termsAndConditions || "",
        quantity: parseInt(formData.quantity),
        expiryDate: formData.expiryDate,
        voucherCode: formData.voucherCode, // Include the unique voucher code
        isActive: true, // Default to active
        usedCount: 0, // Track how many times voucher has been used
        status: "active", // active, review, expired
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }

      // Add document to Firestore
      const docRef = await addDoc(collection(db, "vouchers"), voucherData)
      
      console.log("Voucher created with ID: ", docRef.id)

      // Success case
      setSnackbar({
        open: true,
        message: `Voucher created successfully! Code: ${formData.voucherCode}`,
        severity: "success",
      })

      // Reset form after successful creation (with current date as default again)
      setFormData({
        voucherType: "",
        valueOfSavings: "",
        voucherTitle: "",
        voucherDescription: "",
        termsAndConditions: "",
        quantity: "",
        expiryDate: getCurrentDate(), // Reset to current date
        voucherCode: "",
      })

      // Generate new voucher code for next voucher
      setTimeout(() => {
        generateUniqueVoucherCode()
      }, 1000)

    } catch (error) {
      console.error("Error adding voucher: ", error)
      setSnackbar({
        open: true,
        message: "Failed to create voucher. Please try again.",
        severity: "error",
      })
    } finally {
      setIsLoading(false)
    }
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
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#f5f5f5" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <Box sx={{ flex: 1, padding: "24px", marginLeft: "250px" }}>
        {/* Header */}
        <Box sx={{ marginBottom: "24px" }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              color: "#333333",
              marginBottom: "8px",
            }}
          >
            Add a Voucher
          </Typography>
        </Box>

        {/* Form Container - White Box */}
        <Box
          sx={{
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            padding: "32px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* Subheading */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: "600",
              color: "#333333",
              marginBottom: "24px",
            }}
          >
            Create a New Voucher:
          </Typography>

          {/* Form Grid */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "24px",
              "@media (max-width: 768px)": {
                gridTemplateColumns: "1fr",
              },
            }}
          >
            {/* Voucher Code - Auto Generated */}
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: "600", marginBottom: "8px", color: "#333333" }}
              >
                Voucher Code (Auto-Generated) *
              </Typography>
              <StyledTextField
                fullWidth
                value={formData.voucherCode}
                disabled
                InputProps={{
                  endAdornment: formData.voucherCode ? (
                    <InputAdornment position="end">
                      <IconButton onClick={handleRegenerateCode} size="small">
                        <Refresh />
                      </IconButton>
                    </InputAdornment>
                  ) : isGeneratingCode ? (
                    <InputAdornment position="end">
                      <CircularProgress size={20} />
                    </InputAdornment>
                  ) : null,
                }}
                placeholder="Generating..."
              />
              <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
                Click refresh to generate a new code
              </Typography>
            </Box>

            {/* Voucher Type */}
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: "600", marginBottom: "8px", color: "#333333" }}
              >
                Voucher Type *
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
                      return <Box sx={{ color: "#9e9e9e" }}>Enter a Voucher type</Box>
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
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: "600", marginBottom: "8px", color: "#333333" }}
              >
                Value of Savings *
              </Typography>
              <StyledTextField
                fullWidth
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

            {/* Voucher Quantity */}
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: "600", marginBottom: "8px", color: "#333333" }}
              >
                Enter Voucher Quantity *
              </Typography>
              <StyledTextField
                fullWidth
                value={formData.quantity}
                onChange={(e) => handleChange("quantity", e.target.value)}
                type="number"
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Box>

            {/* Voucher Title */}
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: "600", marginBottom: "8px", color: "#333333" }}
              >
                Enter Voucher Title *
              </Typography>
              <StyledTextField
                fullWidth
                value={formData.voucherTitle}
                onChange={(e) => handleChange("voucherTitle", e.target.value)}
              />
            </Box>

            {/* Voucher Description */}
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: "600", marginBottom: "8px", color: "#333333" }}
              >
                Enter Voucher Description
              </Typography>
              <StyledTextField
                fullWidth
                value={formData.voucherDescription}
                onChange={(e) => handleChange("voucherDescription", e.target.value)}
                multiline
                rows={4}
              />
            </Box>

            {/* Terms & Conditions */}
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: "600", marginBottom: "8px", color: "#333333" }}
              >
                Enter Voucher's Terms & Conditions
              </Typography>
              <StyledTextField
                fullWidth
                value={formData.termsAndConditions}
                onChange={(e) => handleChange("termsAndConditions", e.target.value)}
                multiline
                rows={4}
              />
            </Box>

            {/* Expiry Date */}
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: "600", marginBottom: "8px", color: "#333333" }}
              >
                Expiry Date *
              </Typography>
              <StyledTextField
                fullWidth
                type="date"
                value={formData.expiryDate}
                onChange={(e) => handleChange("expiryDate", e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  placeholder: "Select Expiry Date",
                }}
                sx={{ maxWidth: "300px" }}
              />
            </Box>
          </Box>

          {/* Create Button */}
          <Box sx={{ marginTop: "32px", display: "flex", justifyContent: "center" }}>
            <CreateButton
              onClick={handleCreate}
              disabled={isLoading || isGeneratingCode}
              startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {isLoading ? "Creating..." : "Create a Voucher"}
            </CreateButton>
          </Box>
        </Box>

        {/* Success/Error Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  )
}