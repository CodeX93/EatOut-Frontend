"use client"

import { useState, useEffect, Suspense } from "react"
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
import { doc, getDoc, deleteDoc, collection, query, where, getDocs } from "firebase/firestore"

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
  "&:disabled": {
    backgroundColor: "#cccccc",
  },
}))

function DeleteVoucherPageContent({ voucherId, voucherData, onDelete }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Get voucher code from props or URL params
  const initialVoucherCode = voucherId || searchParams.get('id') || searchParams.get('code')
  const [currentVoucherId, setCurrentVoucherId] = useState(null) // Document ID for deletion

  // State for form data
  const [formData, setFormData] = useState({
    voucherType: "",
    valueOfSavings: "",
    voucherTitle: "",
    voucherDescription: "",
    termsAndConditions: "",
    quantity: "",
    expiryDate: "",
    voucherCode: "",
  })

  // State for loading and error handling
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // State for modal
  const [openModal, setOpenModal] = useState(false)

  // State for snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  // Fetch voucher data from Firestore using voucherCode
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
        
        // Store the document ID for deletion
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
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  // Handle Delete button click
  const handleDelete = () => {
    setOpenModal(true)
  }

  // Handle modal confirm - Delete voucher from Firestore
  const handleConfirmDelete = async () => {
    setOpenModal(false)
    setDeleting(true)

    try {
      // Delete from Firestore using the document ID
      const voucherRef = doc(db, "vouchers", currentVoucherId)
      await deleteDoc(voucherRef)

      console.log("Voucher deleted successfully")

      // Call onDelete prop if provided (for parent component updates)
      if (onDelete) {
        onDelete({ id: currentVoucherId, voucherCode: formData.voucherCode })
      }

      // Show success message
      setSnackbar({
        open: true,
        message: `Voucher ${formData.voucherCode} deleted successfully!`,
        severity: "success",
      })

      // Redirect back to vouchers list after a delay
      setTimeout(() => {
        router.push("/vouchers")
      }, 2000)

    } catch (err) {
      console.error("Error deleting voucher:", err)
      setSnackbar({
        open: true,
        message: "Failed to delete voucher. Please try again.",
        severity: "error",
      })
    } finally {
      setDeleting(false)
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
            Delete A Voucher
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
                label="Expiry Date"
                value={formData.expiryDate ? formData.expiryDate.slice(0, 10) : ""}
                onChange={(e) => handleChange("expiryDate", e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </Box>

          {/* Delete Button */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
            <DeleteButton 
              variant="contained" 
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete a Voucher"}
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
              Are you sure you want to permanently delete voucher <strong>{formData.voucherCode}</strong>? This action cannot be undone.
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => setOpenModal(false)}
                disabled={deleting}
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
                onClick={handleConfirmDelete}
                disabled={deleting}
                sx={{
                  bgcolor: "#da1818",
                  "&:hover": {
                    bgcolor: "#c41515",
                  },
                }}
              >
                {deleting ? "Deleting..." : "Delete"}
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

export default function DeleteVoucherPage(props) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DeleteVoucherPageContent {...props} />
    </Suspense>
  );
}