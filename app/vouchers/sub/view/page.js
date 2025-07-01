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
  CircularProgress,
  Alert,
  Chip 
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { KeyboardArrowDown, ArrowBack } from "@mui/icons-material"
import { useRouter, useSearchParams } from "next/navigation"

// Firebase imports
import { db } from "../../../../firebaseConfig" // Adjust path as needed
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore"

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

const BackButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#da1818",
  color: "#ffffff",
  borderRadius: "4px",
  padding: "10px 24px",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#c41515",
  },
}))

export default function ViewVoucherDetails({ voucherId, voucherData }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Get voucher code from props or URL params
  const initialVoucherCode = voucherId || searchParams.get('id') || searchParams.get('code')

  // State for voucher data
  const [voucher, setVoucher] = useState({
    voucherType: "",
    valueOfSavings: "",
    voucherTitle: "",
    voucherDescription: "",
    termsAndConditions: "",
    quantity: "",
    expiryDate: "",
    voucherCode: "",
    usedCount: 0,
    status: "",
    createdAt: null,
    updatedAt: null,
  })

  // State for loading and error handling
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
        
        // Map Firestore data to state
        setVoucher({
          voucherType: data.voucherType || "",
          valueOfSavings: data.valueOfSavings?.toString() || "",
          voucherTitle: data.voucherTitle || "",
          voucherDescription: data.voucherDescription || "",
          termsAndConditions: data.termsAndConditions || "",
          quantity: data.quantity?.toString() || "",
          expiryDate: data.expiryDate || "",
          voucherCode: data.voucherCode || "",
          usedCount: data.usedCount || 0,
          status: data.status || "active",
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        })
      } else {
        // Fallback: try as document ID (in case someone passes document ID)
        console.log("Not found by voucherCode, trying as document ID:", voucherCode)
        
        const voucherRef = doc(db, "vouchers", voucherCode)
        const voucherSnap = await getDoc(voucherRef)
        
        if (voucherSnap.exists()) {
          const data = voucherSnap.data()
          console.log("Found voucher by document ID:", data)
          
          setVoucher({
            voucherType: data.voucherType || "",
            valueOfSavings: data.valueOfSavings?.toString() || "",
            voucherTitle: data.voucherTitle || "",
            voucherDescription: data.voucherDescription || "",
            termsAndConditions: data.termsAndConditions || "",
            quantity: data.quantity?.toString() || "",
            expiryDate: data.expiryDate || "",
            voucherCode: data.voucherCode || "",
            usedCount: data.usedCount || 0,
            status: data.status || "active",
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
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
      setVoucher({
        voucherType: voucherData.voucherType || "",
        valueOfSavings: voucherData.valueOfSavings?.toString() || "",
        voucherTitle: voucherData.voucherTitle || "",
        voucherDescription: voucherData.voucherDescription || "",
        termsAndConditions: voucherData.termsAndConditions || "",
        quantity: voucherData.quantity?.toString() || "",
        expiryDate: voucherData.expiryDate || "",
        voucherCode: voucherData.voucherCode || "",
        usedCount: voucherData.usedCount || 0,
        status: voucherData.status || "active",
        createdAt: voucherData.createdAt,
        updatedAt: voucherData.updatedAt,
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

  // Voucher type options (for display purposes)
  const voucherTypes = [
    "Percentage Discount",
    "Fixed Amount Discount",
    "Buy One Get One Free",
    "Free Item",
    "Free Shipping",
    "Cash Voucher",
  ]

  // Helper function to format date
  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown"
    
    try {
      // Handle Firestore timestamp
      if (timestamp.toDate) {
        return timestamp.toDate().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      }
      // Handle regular date string
      return new Date(timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch (error) {
      return "Invalid date"
    }
  }

  // Helper function to get status chip color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return { bgcolor: "#e8f5e8", color: "#00c17c" }
      case 'expired':
        return { bgcolor: "#ffebee", color: "#d32f2f" }
      case 'review':
        return { bgcolor: "#fff3e0", color: "#f57c00" }
      default:
        return { bgcolor: "#f5f5f5", color: "#666" }
    }
  }

  // Calculate usage percentage
  const usagePercentage = voucher.quantity > 0 ? (voucher.usedCount / parseInt(voucher.quantity)) * 100 : 0

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
            View A Voucher
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
            View Voucher: {voucher.voucherCode}
          </Typography>
          <Typography variant="body2" sx={{ color: "#666", mt: 1 }}>
            Read-only view of voucher details
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
          {/* Subheading with Status */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: "#da1818" }}>
              Voucher Details:
            </Typography>
            <Chip
              label={voucher.status?.charAt(0).toUpperCase() + voucher.status?.slice(1)}
              size="medium"
              sx={{
                ...getStatusColor(voucher.status),
                fontWeight: 500,
                fontSize: "14px",
                borderRadius: "8px",
              }}
            />
          </Box>

          {/* Usage Statistics */}
          <Box sx={{ 
            bgcolor: "#f8f9fa", 
            borderRadius: 2, 
            p: 2, 
            mb: 3,
            border: "1px solid #e9ecef"
          }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: "#495057" }}>
              Usage Statistics
            </Typography>
            <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              <Box>
                <Typography variant="body2" sx={{ color: "#6c757d" }}>Used</Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: "#da1818" }}>
                  {voucher.usedCount} / {voucher.quantity}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: "#6c757d" }}>Usage Rate</Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: "#28a745" }}>
                  {usagePercentage.toFixed(1)}%
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: "#6c757d" }}>Remaining</Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: "#007bff" }}>
                  {parseInt(voucher.quantity) - voucher.usedCount}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Form Grid */}
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 3, mb: 4 }}>
            {/* Voucher Code - Read Only */}
            <Box>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bolder' }}>
                Voucher Code
              </Typography>
              <StyledTextField
                fullWidth
                value={voucher.voucherCode}
                InputProps={{
                  readOnly: true,
                  style: { 
                    fontFamily: "monospace", 
                    fontWeight: "bold",
                    letterSpacing: "1px",
                    backgroundColor: "#f8f9fa"
                  },
                }}
              />
            </Box>

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

            {/* Voucher Quantity */}
            <Box>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bolder' }}>
                Voucher Quantity
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

            {/* Voucher Title */}
            <Box sx={{ gridColumn: "1 / -1" }}>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bolder' }}>
                Voucher Title
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
                Voucher Description
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
                Terms & Conditions
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

            {/* Created Date */}
            <Box>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bolder' }}>
                Created Date
              </Typography>
              <StyledTextField
                fullWidth
                value={formatDate(voucher.createdAt)}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Box>
          </Box>

          {/* Last Updated Info */}
          {voucher.updatedAt && (
            <Box sx={{ 
              bgcolor: "#f8f9fa", 
              borderRadius: 1, 
              p: 2, 
              mb: 3,
              border: "1px solid #e9ecef"
            }}>
              <Typography variant="body2" sx={{ color: "#6c757d" }}>
                Last updated: {formatDate(voucher.updatedAt)}
              </Typography>
            </Box>
          )}

          {/* Action Buttons */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
            <BackButton 
              variant="contained" 
              startIcon={<ArrowBack />}
              onClick={() => router.push("/vouchers")}
            >
              Back to Vouchers
            </BackButton>
            
            <Button
              variant="outlined"
              onClick={() => router.push(`/vouchers/sub/edit?id=${voucher.voucherCode}`)}
              sx={{
                borderColor: "#da1818",
                color: "#da1818",
                "&:hover": {
                  borderColor: "#c41515",
                  bgcolor: "rgba(218, 24, 24, 0.04)"
                }
              }}
            >
              Edit Voucher
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}