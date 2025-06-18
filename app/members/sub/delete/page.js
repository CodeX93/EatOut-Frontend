"use client"

import { useState } from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Grid from "@mui/material/Grid"
import TextField from "@mui/material/TextField"
import MenuItem from "@mui/material/MenuItem"
import Checkbox from "@mui/material/Checkbox"
import Radio from "@mui/material/Radio"
import RadioGroup from "@mui/material/RadioGroup"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import AddIcon from "@mui/icons-material/Add"
import Chip from "@mui/material/Chip"
import Modal from "@mui/material/Modal"
import Snackbar from "@mui/material/Snackbar"
import Alert from "@mui/material/Alert"
import MaleIcon from "@mui/icons-material/Male"
import FemaleIcon from "@mui/icons-material/Female"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import DeleteIcon from "@mui/icons-material/Delete"
import WarningIcon from "@mui/icons-material/Warning"
import { styled } from "@mui/material/styles"

// Sidebar component import
import Sidebar from "./../../../components/SideNavbar"

// Custom styled components
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: "8px",
  boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
  marginBottom: "24px",
}))

const SectionTitle = styled(Typography)(({ theme }) => ({
  color: "#ff2d55",
  fontWeight: 600,
  fontSize: "16px",
  marginBottom: "16px",
}))

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#f8f9fa",
    borderRadius: "6px",
    "& fieldset": {
      borderColor: "#e0e0e0",
    },
    "&:hover fieldset": {
      borderColor: "#e0e0e0",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#e0e0e0",
    },
  },
  "& .MuiInputBase-input": {
    color: "#666666",
  },
}))

const StyledChip = styled(Chip)(({ theme }) => ({
  backgroundColor: "#ff2d55",
  color: "#ffffff",
  borderRadius: "4px",
  margin: "0 8px 8px 0",
  "& .MuiChip-deleteIcon": {
    display: "none", // Hide delete icon in delete view
  },
}))

const PaymentMethodChip = styled(Box)(({ theme, selected }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "8px 12px",
  borderRadius: "8px",
  backgroundColor: selected ? "#fae3e3" : "#f8f8f8",
  border: selected ? "1px solid #ff2d55" : "1px solid #e0e0e0",
  marginRight: "8px",
  marginBottom: "8px",
  minWidth: "80px",
  flex: "1 1 auto",
  opacity: 0.7,
}))

const AddButton = styled(IconButton)(({ theme }) => ({
    backgroundColor: "#ff2d55",
    color: "#ffffff",
    borderRadius: "8px",       // Rounded rectangle
    width: "80px",             // Wide for rectangle shape
    height: "36px",            // Typical button height
    cursor: "not-allowed",     // For visual indication
    "& .MuiSvgIcon-root": {
      fontSize: "18px",
    },
    "&.Mui-disabled": {
      backgroundColor: "#ff2d55", // Optional: override default disabled bg
      color: "#ffffff",           // Optional: dimmed icon
    },
  }));
  
  

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

export default function DeleteMemberDetails({ memberId }) {
  // Function to get member data based on ID
  const getMemberData = (id) => {
    // Mock data - in real app, this would fetch from API
    const members = {
      1: {
        preferredName: "Sara A",
        email: "sara@gmail.com",
        mobileNumber: "+60 000 000 000",
        gender: "female",
        dateOfBirth: { day: "12", month: "Jan", year: "1999" },
        referralCode: "1234",
        membershipPlan: "semi-annually",
        couponCode: "1234",
        address: "No. 23 A1 Jin Thamby Abdullah 1, Kuala Lumpur,Wilayah Persekutuan,Malaysia",
        maritalStatus: "Married",
        race: "Arab",
        religion: "Muslim",
        householdSize: "10",
        monthlyIncome: "$ 10000, ten thousand Dollar",
        facilities: [
          "Chinese",
          "Vietnamese",
          "Cafe",
          "Buffet",
          "Indian",
          "Steamboat",
          "Hong Kong",
          "American",
          "German",
          "European",
        ],
        paymentMethod: "mastercard",
        cardNumber: "1234**********",
        cardName: "Sara A",
        cardPhone: "+60 000 000 000",
        expiryMonth: "Month",
        expiryYear: "Year",
        cvv: "xxx",
      },
      2: {
        preferredName: "John Doe",
        email: "john@gmail.com",
        mobileNumber: "+60 111 111 111",
        gender: "male",
        dateOfBirth: { day: "15", month: "Mar", year: "1985" },
        referralCode: "5678",
        membershipPlan: "yearly",
        couponCode: "5678",
        address: "No. 45 Jalan Ampang, Kuala Lumpur, Malaysia",
        maritalStatus: "Single",
        race: "Asian",
        religion: "Christianity",
        householdSize: "2",
        monthlyIncome: "$ 5000, five thousand Dollar",
        facilities: ["Italian", "Japanese", "Korean", "Thai"],
        paymentMethod: "visa",
        cardNumber: "5678**********",
        cardName: "John Doe",
        cardPhone: "+60 111 111 111",
        expiryMonth: "12",
        expiryYear: "2025",
        cvv: "123",
      },
    }
    return members[id] || members["1"] // Default to first member if ID not found
  }

  // State for form data - initialize with member data
  const [formData] = useState(getMemberData(memberId))

  // State for modal
  const [openModal, setOpenModal] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  // Handle delete button click
  const handleDelete = () => {
    setOpenModal(true)
  }

  // Handle modal confirm
  const handleConfirmDelete = () => {
    setOpenModal(false)
    setSnackbar({
      open: true,
      message: `Member ${memberId} deleted successfully!`,
      severity: "success",
    })
    // In real app, redirect to members list after successful deletion
    // setTimeout(() => {
    //   router.push('/members')
    // }, 2000)
  }

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    })
  }

  // Months array for dropdown
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  // Generate years array for dropdown (1950-2010)
  const years = Array.from({ length: 61 }, (_, i) => (2010 - i).toString())

  // Generate days array for dropdown (1-31)
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString())

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
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h5" component="h1" sx={{ color: "#ff2d55", fontWeight: 600 }}>
            Delete Member Details
          </Typography>
        </Box>

        {/* Warning Message */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#fff3cd",
            border: "1px solid #ffeaa7",
            borderRadius: "8px",
            padding: "12px 16px",
            mb: 3,
          }}
        >
          <WarningIcon sx={{ color: "#856404", mr: 2 }} />
          <Typography sx={{ color: "#856404", fontWeight: 500 }}>
            Warning: This action cannot be undone. Please review the member details before proceeding with deletion.
          </Typography>
        </Box>

        {/* Personal Details Section - Full Width */}
        <StyledCard>
          <CardContent sx={{ p: 3 }}>
            <SectionTitle>Personal Details</SectionTitle>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Preferred Name
                </Typography>
                <StyledTextField
                  fullWidth
                  size="small"
                  value={formData.preferredName}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Email
                </Typography>
                <StyledTextField fullWidth size="small" value={formData.email} InputProps={{ readOnly: true }} />
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Mobile Number
                </Typography>
                <StyledTextField fullWidth size="small" value={formData.mobileNumber} InputProps={{ readOnly: true }} />
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Gender
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mr: 3,
                      color: formData.gender === "male" ? "#ff2d55" : "#999999",
                    }}
                  >
                    <Checkbox
                      icon={<MaleIcon />}
                      checkedIcon={<MaleIcon />}
                      checked={formData.gender === "male"}
                      disabled
                      sx={{
                        color: formData.gender === "male" ? "#ff2d55" : "#8a8a8f",
                        "&.Mui-checked": {
                          color: "#ff2d55",
                        },
                      }}
                    />
                    <Typography>Male</Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color: formData.gender === "female" ? "#ff2d55" : "#999999",
                    }}
                  >
                    <Checkbox
                      icon={<FemaleIcon />}
                      checkedIcon={<FemaleIcon />}
                      checked={formData.gender === "female"}
                      disabled
                      sx={{
                        color: formData.gender === "female" ? "#ff2d55" : "#8a8a8f",
                        "&.Mui-checked": {
                          color: "#ff2d55",
                        },
                      }}
                    />
                    <Typography>Female</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Date of Birth
                </Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <StyledTextField
                    select
                    size="small"
                    value={formData.dateOfBirth.day}
                    InputProps={{ readOnly: true }}
                    sx={{ width: "30%" }}
                  >
                    {days.map((day) => (
                      <MenuItem key={day} value={day}>
                        {day}
                      </MenuItem>
                    ))}
                  </StyledTextField>
                  <StyledTextField
                    select
                    size="small"
                    value={formData.dateOfBirth.month}
                    InputProps={{ readOnly: true }}
                    sx={{ width: "30%" }}
                  >
                    {months.map((month) => (
                      <MenuItem key={month} value={month}>
                        {month}
                      </MenuItem>
                    ))}
                  </StyledTextField>
                  <StyledTextField
                    select
                    size="small"
                    value={formData.dateOfBirth.year}
                    InputProps={{ readOnly: true }}
                    sx={{ width: "30%" }}
                  >
                    {years.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </StyledTextField>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Referral Code
                </Typography>
                <StyledTextField fullWidth size="small" value={formData.referralCode} InputProps={{ readOnly: true }} />
              </Grid>
            </Grid>
          </CardContent>
        </StyledCard>

        {/* Membership Plan Section - Full Width */}
        <StyledCard>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <SectionTitle sx={{ mb: 0 }}>Membership Plan</SectionTitle>
              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Coupon Code
                </Typography>
                <StyledTextField
                  size="small"
                  value={formData.couponCode}
                  InputProps={{ readOnly: true }}
                  sx={{ width: "120px" }}
                />
              </Box>
            </Box>
            <RadioGroup
              row
              value={formData.membershipPlan}
              sx={{ display: "flex", justifyContent: "flex-start", gap: 2 }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  border: formData.membershipPlan === "monthly" ? "1px solid #ff2d55" : "1px solid #e0e0e0",
                  borderRadius: "8px",
                  p: 1,
                  width: "200px",
                  bgcolor: formData.membershipPlan === "monthly" ? "#fae3e3" : "#ffffff",
                  opacity: 0.7,
                }}
              >
                <Radio
                  value="monthly"
                  disabled
                  sx={{
                    color: "#ff2d55",
                    "&.Mui-checked": {
                      color: "#ff2d55",
                    },
                  }}
                />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Monthly
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666666" }}>
                    $9.99
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  border: formData.membershipPlan === "semi-annually" ? "1px solid #ff2d55" : "1px solid #e0e0e0",
                  borderRadius: "8px",
                  p: 1,
                  width: "200px",
                  bgcolor: formData.membershipPlan === "semi-annually" ? "#fae3e3" : "#ffffff",
                  opacity: 0.7,
                }}
              >
                <Radio
                  value="semi-annually"
                  disabled
                  sx={{
                    color: "#ff2d55",
                    "&.Mui-checked": {
                      color: "#ff2d55",
                    },
                  }}
                />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Semi Annually
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666666" }}>
                    $29.99
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  border: formData.membershipPlan === "yearly" ? "1px solid #ff2d55" : "1px solid #e0e0e0",
                  borderRadius: "8px",
                  p: 1,
                  width: "200px",
                  bgcolor: formData.membershipPlan === "yearly" ? "#fae3e3" : "#ffffff",
                  opacity: 0.7,
                }}
              >
                <Radio
                  value="yearly"
                  disabled
                  sx={{
                    color: "#ff2d55",
                    "&.Mui-checked": {
                      color: "#ff2d55",
                    },
                  }}
                />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Yearly
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666666" }}>
                    $49.99
                  </Typography>
                </Box>
              </Box>
            </RadioGroup>
          </CardContent>
        </StyledCard>

        {/* 1x2 Grid Layout for Optional Info and Facilities/Payment */}
        <Box sx={{ display: "flex", gap: 3 }}>
          {/* Left column - Optional Information */}
          <Box sx={{ flex: 1, width: "50%" }}>
            <StyledCard sx={{ height: "100%" }}>
              <CardContent sx={{ p: 3 }}>
                <SectionTitle>Optional Information</SectionTitle>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                      Address
                    </Typography>
                    <StyledTextField fullWidth size="small" value={formData.address} InputProps={{ readOnly: true }} />
                  </Box>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                        Marital Status
                      </Typography>
                      <StyledTextField
                        select
                        fullWidth
                        size="small"
                        value={formData.maritalStatus}
                        InputProps={{ readOnly: true }}
                      >
                        <MenuItem value="Single">Single</MenuItem>
                        <MenuItem value="Married">Married</MenuItem>
                        <MenuItem value="Divorced">Divorced</MenuItem>
                        <MenuItem value="Widowed">Widowed</MenuItem>
                      </StyledTextField>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                        Race
                      </Typography>
                      <StyledTextField
                        select
                        fullWidth
                        size="small"
                        value={formData.race}
                        InputProps={{ readOnly: true }}
                      >
                        <MenuItem value="Asian">Asian</MenuItem>
                        <MenuItem value="Arab">Arab</MenuItem>
                        <MenuItem value="African">African</MenuItem>
                        <MenuItem value="Caucasian">Caucasian</MenuItem>
                        <MenuItem value="Hispanic">Hispanic</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </StyledTextField>
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                        Religion
                      </Typography>
                      <StyledTextField
                        select
                        fullWidth
                        size="small"
                        value={formData.religion}
                        InputProps={{ readOnly: true }}
                      >
                        <MenuItem value="Christianity">Christianity</MenuItem>
                        <MenuItem value="Islam">Islam</MenuItem>
                        <MenuItem value="Hinduism">Hinduism</MenuItem>
                        <MenuItem value="Buddhism">Buddhism</MenuItem>
                        <MenuItem value="Judaism">Judaism</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                        <MenuItem value="None">None</MenuItem>
                        <MenuItem value="Muslim">Muslim</MenuItem>
                      </StyledTextField>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                        No of People in Household
                      </Typography>
                      <StyledTextField
                        select
                        fullWidth
                        size="small"
                        value={formData.householdSize}
                        InputProps={{ readOnly: true }}
                      >
                        {Array.from({ length: 20 }, (_, i) => (i + 1).toString()).map((num) => (
                          <MenuItem key={num} value={num}>
                            {num}
                          </MenuItem>
                        ))}
                      </StyledTextField>
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                      Monthly Income
                    </Typography>
                    <StyledTextField
                      fullWidth
                      size="small"
                      value={formData.monthlyIncome}
                      InputProps={{ readOnly: true }}
                    />
                  </Box>
                </Box>
              </CardContent>
            </StyledCard>
          </Box>

          {/* Right column - Facilities and Payment Details (stacked) */}
          <Box sx={{ flex: 1, width: "50%", display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Facilities and Services Section */}
            <StyledCard>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <SectionTitle sx={{ mb: 0 }}>Facilities and Services</SectionTitle>
                  <AddButton disabled>
                    <AddIcon />
                  </AddButton>
                </Box>
                <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                  {formData.facilities.map((facility) => (
                    <StyledChip key={facility} label={facility} sx={{ mb: 1, mr: 1 }} />
                  ))}
                </Box>
              </CardContent>
            </StyledCard>

            {/* Payment Details Section */}
            <StyledCard>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <SectionTitle sx={{ mb: 0 }}>Payment Details</SectionTitle>
                  <AddButton disabled>
                    <AddIcon />
                  </AddButton>
                </Box>
                <Box sx={{ display: "flex", flexWrap: "wrap", mb: 3 }}>
                  <PaymentMethodChip selected={formData.paymentMethod === "mastercard"}>
                    <Box
                      component="img"
                      src="/placeholder.svg?height=24&width=36"
                      alt="Mastercard"
                      sx={{ height: 24 }}
                    />
                    <Typography sx={{ ml: 1, fontSize: "12px" }}>Mastercard</Typography>
                  </PaymentMethodChip>
                  <PaymentMethodChip selected={formData.paymentMethod === "creditcard"}>
                    <Box
                      component="img"
                      src="/placeholder.svg?height=24&width=36"
                      alt="Credit Card"
                      sx={{ height: 24 }}
                    />
                    <Typography sx={{ ml: 1, fontSize: "12px" }}>Credit Card</Typography>
                  </PaymentMethodChip>
                  <PaymentMethodChip selected={formData.paymentMethod === "visa"}>
                    <Box component="img" src="/placeholder.svg?height=24&width=36" alt="Visa" sx={{ height: 24 }} />
                    <Typography sx={{ ml: 1, fontSize: "12px" }}>Visa</Typography>
                  </PaymentMethodChip>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                      Card Number
                    </Typography>
                    <StyledTextField
                      fullWidth
                      size="small"
                      value={formData.cardNumber}
                      InputProps={{ readOnly: true }}
                    />
                  </Box>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                        Name
                      </Typography>
                      <StyledTextField
                        fullWidth
                        size="small"
                        value={formData.cardName}
                        InputProps={{ readOnly: true }}
                      />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                        Phone
                      </Typography>
                      <StyledTextField
                        fullWidth
                        size="small"
                        value={formData.cardPhone}
                        InputProps={{ readOnly: true }}
                      />
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                      Expiry Date
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <StyledTextField
                        select
                        size="small"
                        value={formData.expiryMonth}
                        InputProps={{ readOnly: true }}
                        sx={{ width: "48%" }}
                      >
                        <MenuItem value="Month">Month</MenuItem>
                        {Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, "0")).map((month) => (
                          <MenuItem key={month} value={month}>
                            {month}
                          </MenuItem>
                        ))}
                      </StyledTextField>
                      <StyledTextField
                        select
                        size="small"
                        value={formData.expiryYear}
                        InputProps={{ readOnly: true }}
                        sx={{ width: "48%" }}
                      >
                        <MenuItem value="Year">Year</MenuItem>
                        {Array.from({ length: 10 }, (_, i) => (new Date().getFullYear() + i).toString()).map((year) => (
                          <MenuItem key={year} value={year}>
                            {year}
                          </MenuItem>
                        ))}
                      </StyledTextField>
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                      CVV
                    </Typography>
                    <StyledTextField
                      fullWidth
                      size="small"
                      value={formData.cvv}
                      InputProps={{ readOnly: true }}
                      type="password"
                    />
                  </Box>
                </Box>
              </CardContent>
            </StyledCard>
          </Box>
        </Box>

        {/* Delete Button */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
          <DeleteButton variant="contained" onClick={handleDelete} startIcon={<DeleteIcon />}>
            Delete Member
          </DeleteButton>
        </Box>

        {/* Delete Confirmation Modal */}
        <Modal open={openModal} onClose={() => setOpenModal(false)} aria-labelledby="delete-modal-title">
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
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
              <DeleteIcon sx={{ color: "#da1818", fontSize: 40, mr: 1 }} />
              <Typography id="delete-modal-title" variant="h6" component="h2" sx={{ color: "#da1818" }}>
                Delete Member
              </Typography>
            </Box>
            <Typography sx={{ textAlign: "center", mb: 3, color: "#666666" }}>
              Are you sure you want to delete this member? This action cannot be undone and will permanently remove all
              member data.
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
                onClick={handleConfirmDelete}
                sx={{
                  bgcolor: "#da1818",
                  "&:hover": {
                    bgcolor: "#c41515",
                  },
                }}
                startIcon={<DeleteIcon />}
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
