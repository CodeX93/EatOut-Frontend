"use client"

import { useState, useEffect } from "react"
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
  CircularProgress,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { KeyboardArrowDown } from "@mui/icons-material"
import { useRouter, useSearchParams } from "next/navigation"

// Firebase imports
import { db } from "../../../../firebaseConfig" // Adjust path as needed
import { doc, getDoc, updateDoc, serverTimestamp, collection, query, where, getDocs } from "firebase/firestore"

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

const UpdateButton = styled(Button)(({ theme }) => ({
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

export default function UpdateVoucherDetails({ voucherId, voucherData, onUpdate }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Get voucher code from props or URL params
  const initialVoucherCode = voucherId || searchParams.get('id') || searchParams.get('code')
  const [currentVoucherId, setCurrentVoucherId] = useState(null) // Document ID for updates

  // State for form data
  const initialDate = new Date().toISOString().split('T')[0];
  const [formData, setFormData] = useState({
    voucherType: "",
    valueOfSavings: "",
    voucherTitle: "",
    voucherDescription: "",
    termsAndConditions: "",
    quantity: "",
    expiryDate: initialDate,
    voucherCode: "",
  });

  // State for loading and error handling
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updating, setUpdating] = useState(false)
  const [isGeneratingCode, setIsGeneratingCode] = useState(false)

  // State for modal
  const [openModal, setOpenModal] = useState(false)

  // State for snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  // Function to generate random alphanumeric string
  const generateRandomString = (length) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  // Function to generate voucher code with format REV######
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
          setSnackbar({
            open: true,
            message: `New voucher code generated: ${newCode}`,
            severity: "success",
          })
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
  const fetchVoucherData = async (voucherCode) => {
    if (!voucherCode) {
      setError("No voucher code provided")
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      console.log("Fetching voucher with code:", voucherCode)

      // Search by voucherCode field (primary method)
      const vouchersQuery = query(
        collection(db, "vouchers"),
        where("voucherCode", "==", voucherCode)
      )
      
      const querySnapshot = await getDocs(vouchersQuery)
      
      if (!querySnapshot.empty) {
        // Found by voucherCode
        const docData = querySnapshot.docs[0]
        const data = docData.data()
        
        console.log("Found voucher by voucherCode:", data)
        
        // Store the document ID for updates
        setCurrentVoucherId(docData.id)
        
        // Map Firestore data to form structure
        setFormData({
          voucherType: data.voucherType || "",
          valueOfSavings: data.valueOfSavings?.toString() || "",
          voucherTitle: data.voucherTitle || "",
          voucherDescription: data.voucherDescription || "",
          termsAndConditions: data.termsAndConditions || "",
          quantity: data.quantity?.toString() || "",
          expiryDate: data.expiryDate || "",
          voucherCode: data.voucherCode || "",
        })
      } else {
        // Fallback: try as document ID (in case someone passes document ID)
        console.log("Not found by voucherCode, trying as document ID:", voucherCode)
        
        const voucherRef = doc(db, "vouchers", voucherCode)
        const voucherSnap = await getDoc(voucherRef)
        
        if (voucherSnap.exists()) {
          const data = voucherSnap.data()
          console.log("Found voucher by document ID:", data)
          
          setCurrentVoucherId(voucherCode)
          
          setFormData({
            voucherType: data.voucherType || "",
            valueOfSavings: data.valueOfSavings?.toString() || "",
            voucherTitle: data.voucherTitle || "",
            voucherDescription: data.voucherDescription || "",
            termsAndConditions: data.termsAndConditions || "",
            quantity: data.quantity?.toString() || "",
            expiryDate: data.expiryDate || "",
            voucherCode: data.voucherCode || "",
          })
        } else {
          console.log("Voucher not found with code or ID:", voucherCode)
          setError(`Voucher not found with code: ${voucherCode}`)
        }
      }
    } catch (err) {
      console.error("Error fetching voucher:", err)
      setError("Failed to load voucher data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Load voucher data on component mount
  useEffect(() => {
    if (voucherData) {
      // Use provided voucher data
      setFormData({
        voucherType: voucherData.voucherType || "",
        valueOfSavings: voucherData.valueOfSavings?.toString() || "",
        voucherTitle: voucherData.voucherTitle || "",
        voucherDescription: voucherData.voucherDescription || "",
        termsAndConditions: voucherData.termsAndConditions || "",
        quantity: voucherData.quantity?.toString() || "",
        expiryDate: voucherData.expiryDate || "",
        voucherCode: voucherData.voucherCode || "",
      })
      setLoading(false)
    } else if (initialVoucherCode) {
      // Fetch from Firestore using voucherCode
      fetchVoucherData(initialVoucherCode)
    } else {
      setError("No voucher code or data provided")
      setLoading(false)
    }
  }, [initialVoucherCode, voucherData])

  // Handle form changes
  const handleChange = (field, value) => {
    console.log(`Updating ${field} with value:`, value); // Debug log

    if (field === 'expiryDate') {
      // Ensure we have a valid date string
      const dateValue = value || initialDate;
      console.log('Setting date value:', dateValue); // Debug log
      setFormData(prev => ({
        ...prev,
        [field]: dateValue
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle update button click
  const handleUpdate = async () => {
    console.log('Current form data:', formData); // Debug log

    // First ensure there's a voucher code
    if (!formData.voucherCode) {
      const newCode = await generateUniqueVoucherCode();
      if (!newCode) {
        setSnackbar({
          open: true,
          message: "Failed to generate voucher code. Please try again.",
          severity: "error",
        });
        return;
      }
    }

    // Validate required fields
    const requiredFields = ["voucherType", "valueOfSavings", "voucherTitle", "quantity", "expiryDate"];
    const missingFields = requiredFields.filter((field) => {
      const value = formData[field];
      const isEmpty = !value || (typeof value === 'string' && value.trim() === '');
      
      if (isEmpty) {
        console.log(`Missing field: ${field}, value:`, value);
      }
      
      return isEmpty;
    });

    console.log("Validation results:", {
      missingFields,
      formData
    });

    if (missingFields.length > 0) {
      setSnackbar({
        open: true,
        message: `Please fill in the following required fields: ${missingFields.join(', ')}`,
        severity: "error",
      });
      return;
    }

    setOpenModal(true);
  };

  // Handle modal confirm - Update voucher in Firestore
  const handleConfirmUpdate = async () => {
    setOpenModal(false)
    setUpdating(true)

    try {
      // Prepare update data
      const updateData = {
        voucherType: formData.voucherType,
        valueOfSavings: parseFloat(formData.valueOfSavings) || formData.valueOfSavings,
        voucherTitle: formData.voucherTitle,
        voucherDescription: formData.voucherDescription || "",
        termsAndConditions: formData.termsAndConditions || "",
        quantity: parseInt(formData.quantity),
        expiryDate: formData.expiryDate,
        voucherCode: formData.voucherCode, // Include voucher code in case it was regenerated
        updatedAt: serverTimestamp(),
      }

      // Update in Firestore using the document ID
      const voucherRef = doc(db, "vouchers", currentVoucherId)
      await updateDoc(voucherRef, updateData)

      console.log("Voucher updated successfully")

      // Call onUpdate prop if provided (for parent component updates)
      if (onUpdate) {
        onUpdate({ id: currentVoucherId, ...updateData })
      }

      // Show success message
      setSnackbar({
        open: true,
        message: "Voucher updated successfully!",
        severity: "success",
      })

      // Optionally redirect back to vouchers list after a delay
      setTimeout(() => {
        router.push("/vouchers")
      }, 2000)

    } catch (err) {
      console.error("Error updating voucher:", err)
      setSnackbar({
        open: true,
        message: "Failed to update voucher. Please try again.",
        severity: "error",
      })
    } finally {
      setUpdating(false)
    }
  }

  // Helper function to check if field is missing and should show error
  const isFieldMissing = (fieldName) => {
    const value = formData[fieldName]
    return !value || (typeof value === 'string' && value.trim() === '')
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

  // Loading state
  if (loading) {
    return (
      <Box sx={{ display: "flex", bgcolor: "#f9f9f9", minHeight: "100vh" }}>
        <Sidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            ml: "240px",
            pt: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <CircularProgress size={60} sx={{ color: "#da1818", mb: 2 }} />
            <Typography variant="h6" sx={{ color: "#666" }}>
              Loading voucher details...
            </Typography>
          </Box>
        </Box>
      </Box>
    )
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ display: "flex", bgcolor: "#f9f9f9", minHeight: "100vh" }}>
        <Sidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            ml: "240px",
            pt: 2,
          }}
        >
          <Typography variant="h5" component="h1" sx={{ color: "#da1818", fontWeight: 'bolder', mb: 3 }}>
            Update A Voucher
          </Typography>
          <Alert severity="error" sx={{ maxWidth: 600 }}>
            {error}
            <Button 
              onClick={() => fetchVoucherData(initialVoucherCode)} 
              sx={{ mt: 1, color: "#da1818" }}
            >
              Try Again
            </Button>
          </Alert>
        </Box>
      </Box>
    )
  }

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
            Update Voucher: {formData.voucherCode}
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
            Update Voucher Details:
          </Typography>

          {/* Form Grid */}
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 3, mb: 4 }}>
            {/* Voucher Code - Read Only with Regeneration Option */}
            <Box>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bold' }}>
                Voucher Code
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <StyledTextField
                  fullWidth
                  value={formData.voucherCode}
                  InputProps={{
                    readOnly: true,
                    style: { 
                      fontFamily: "monospace", 
                      fontWeight: "bold",
                      letterSpacing: "1px",
                      backgroundColor: "#f5f5f5"
                    },
                    endAdornment: isGeneratingCode ? (
                      <InputAdornment position="end">
                        <CircularProgress size={20} />
                      </InputAdornment>
                    ) : null,
                  }}
                />
                <Button
                  variant="outlined"
                  size="small"
                  onClick={generateUniqueVoucherCode}
                  disabled={isGeneratingCode || updating}
                  sx={{
                    minWidth: "100px",
                    borderColor: "#da1818",
                    color: "#da1818",
                    "&:hover": {
                      borderColor: "#c41515",
                      backgroundColor: "rgba(218, 24, 24, 0.04)"
                    },
                    "&:disabled": {
                      borderColor: "#cccccc",
                      color: "#cccccc"
                    }
                  }}
                >
                  {isGeneratingCode ? "Generating..." : "Regenerate"}
                </Button>
              </Box>
              <Typography variant="caption" sx={{ color: "#666", mt: 0.5, display: "block" }}>
                ⚠️ Warning: Regenerating will create a new unique code. Use only if necessary.
              </Typography>
            </Box>

            {/* Voucher Type */}
            <Box>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bold' }}>
                Voucher Type *
                {isFieldMissing('voucherType') && (
                  <Typography component="span" sx={{ color: 'red', fontSize: '12px', ml: 1 }}>
                    (Required)
                  </Typography>
                )}
              </Typography>
              <FormControl fullWidth error={isFieldMissing('voucherType')}>
                <Select
                  value={formData.voucherType}
                  onChange={(e) => handleChange("voucherType", e.target.value)}
                  inputProps={{ "aria-label": "Voucher Type" }}
                  sx={{
                    bgcolor: "#ffffff",
                    borderRadius: "8px",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: isFieldMissing('voucherType') ? "#d32f2f" : "#efeff4",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: isFieldMissing('voucherType') ? "#d32f2f" : "#da1818",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: isFieldMissing('voucherType') ? "#d32f2f" : "#da1818",
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
                Value of Savings *
                {isFieldMissing('valueOfSavings') && (
                  <Typography component="span" sx={{ color: 'red', fontSize: '12px', ml: 1 }}>
                    (Required)
                  </Typography>
                )}
              </Typography>
              <StyledTextField
                fullWidth
                placeholder="Value of Savings"
                value={formData.valueOfSavings}
                onChange={(e) => handleChange("valueOfSavings", e.target.value)}
                error={isFieldMissing('valueOfSavings')}
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
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bold' }}>
                Enter Voucher Quantity *
                {isFieldMissing('quantity') && (
                  <Typography component="span" sx={{ color: 'red', fontSize: '12px', ml: 1 }}>
                    (Required)
                  </Typography>
                )}
              </Typography>
              <StyledTextField
                fullWidth
                placeholder="Enter Voucher Quantity"
                value={formData.quantity}
                onChange={(e) => handleChange("quantity", e.target.value)}
                type="number"
                error={isFieldMissing('quantity')}
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Box>

            {/* Voucher Title */}
            <Box sx={{ gridColumn: "1 / -1" }}>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bold' }}>
                Enter Voucher Title *
                {isFieldMissing('voucherTitle') && (
                  <Typography component="span" sx={{ color: 'red', fontSize: '12px', ml: 1 }}>
                    (Required)
                  </Typography>
                )}
              </Typography>
              <StyledTextField
                fullWidth
                placeholder="Enter Voucher Title"
                value={formData.voucherTitle}
                onChange={(e) => handleChange("voucherTitle", e.target.value)}
                error={isFieldMissing('voucherTitle')}
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

            {/* Expiry Date */}
            <Box sx={{ gridColumn: "1 / -1" }}>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bold' }}>
                Expiry Date *
                {isFieldMissing('expiryDate') && (
                  <Typography component="span" sx={{ color: 'red', fontSize: '12px', ml: 1 }}>
                    (Required)
                  </Typography>
                )}
              </Typography>
              <StyledTextField
                fullWidth
                type="date"
                defaultValue={initialDate}
                value={formData.expiryDate}
                onChange={(e) => handleChange("expiryDate", e.target.value)}
                error={isFieldMissing('expiryDate')}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  min: initialDate, // Prevent selecting past dates
                }}
                sx={{ maxWidth: "300px" }}
              />
            </Box>
          </Box>

          {/* Update Button */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
            <Button
              variant="outlined"
              onClick={() => router.push("/vouchers")}
              sx={{
                borderColor: "#e0e0e0",
                color: "#666666",
                "&:hover": {
                  borderColor: "#d0d0d0",
                  bgcolor: "#f5f5f5",
                },
              }}
            >
              Cancel
            </Button>
            <UpdateButton 
              variant="contained" 
              onClick={handleUpdate}
              disabled={updating || isGeneratingCode}
            >
              {updating ? "Updating..." : isGeneratingCode ? "Generating Code..." : "Update Voucher"}
            </UpdateButton>
          </Box>
        </Box>

        {/* Update Confirmation Modal */}
        <Modal open={openModal} onClose={() => setOpenModal(false)} aria-labelledby="update-modal-title">
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
            <Typography id="update-modal-title" variant="h6" component="h2" sx={{ textAlign: "center", mb: 2 }}>
              Update Voucher
            </Typography>
            <Typography sx={{ textAlign: "center", mb: 3 }}>
              Are you sure you want to update voucher <strong>{formData.voucherCode}</strong>?
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
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleConfirmUpdate}
                disabled={updating}
                sx={{
                  bgcolor: "#da1818",
                  "&:hover": {
                    bgcolor: "#c41515",
                  },
                }}
              >
                {updating ? "Updating..." : "Update"}
              </Button>
            </Box>
          </Box>
        </Modal>

        {/* Success/Error Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: "100%" }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  )
}