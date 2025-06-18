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
import { styled } from "@mui/material/styles"
import EditIcon from "@mui/icons-material/Edit"

// Sidebar component import
import Sidebar from "../../../components/SideNavbar"

// Custom styled components
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: "8px",
  boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
  marginBottom: "24px",
  backgroundColor: "#ffffff",
}))

const SectionTitle = styled(Typography)(({ theme }) => ({
  color: "#ff2d55",
  fontWeight: 600,
  fontSize: "16px",
  marginBottom: "16px",
}))

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#ffffff",
    borderRadius: "6px",
    "& fieldset": {
      borderColor: "#e0e0e0",
    },
    "&:hover fieldset": {
      borderColor: "#ff2d55",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#ff2d55",
    },
  },
}))

const StyledChip = styled(Chip)(({ theme }) => ({
  backgroundColor: "#ff2d55",
  color: "#ffffff",
  borderRadius: "4px",
  margin: "0 8px 8px 0",
  "& .MuiChip-deleteIcon": {
    color: "#ffffff",
    "&:hover": {
      color: "#f8f8f8",
    },
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
  cursor: "pointer",
  marginRight: "8px",
  marginBottom: "8px",
  minWidth: "80px",
  flex: "1 1 auto",
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
           // Optional: dimmed icon
  },
}));

const UpdateButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#ff2d55",
  color: "#ffffff",
  borderRadius: "4px",
  padding: "10px 24px",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#e6254d",
  },
}))

export default function EditMemberDetails({ memberId }) {
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
  const [formData, setFormData] = useState(getMemberData(memberId))

  // State for modal
  const [openModal, setOpenModal] = useState(false)
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

  // Handle nested changes
  const handleNestedChange = (parent, field, value) => {
    setFormData({
      ...formData,
      [parent]: {
        ...formData[parent],
        [field]: value,
      },
    })
  }

  // Handle update button click
  const handleUpdate = () => {
    setOpenModal(true)
  }

  // Handle modal confirm
  const handleConfirmUpdate = () => {
    setOpenModal(false)
    setSnackbar({
      open: true,
      message: `Member ${memberId} details updated successfully!`,
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

  // Handle facility chip delete
  const handleDeleteFacility = (facility) => {
    setFormData({
      ...formData,
      facilities: formData.facilities.filter((f) => f !== facility),
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
            Edit Member Details
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
                  onChange={(e) => handleChange("preferredName", e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Email
                </Typography>
                <StyledTextField
                  fullWidth
                  size="small"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Mobile Number
                </Typography>
                <StyledTextField
                  fullWidth
                  size="small"
                  value={formData.mobileNumber}
                  onChange={(e) => handleChange("mobileNumber", e.target.value)}
                />
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
                      cursor: "pointer",
                      color: formData.gender === "male" ? "#ff2d55" : "inherit",
                    }}
                    onClick={() => handleChange("gender", "male")}
                  >
                    <Checkbox
                      icon={<MaleIcon />}
                      checkedIcon={<MaleIcon />}
                      checked={formData.gender === "male"}
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
                      cursor: "pointer",
                      color: formData.gender === "female" ? "#ff2d55" : "inherit",
                    }}
                    onClick={() => handleChange("gender", "female")}
                  >
                    <Checkbox
                      icon={<FemaleIcon />}
                      checkedIcon={<FemaleIcon />}
                      checked={formData.gender === "female"}
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
                    onChange={(e) => handleNestedChange("dateOfBirth", "day", e.target.value)}
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
                    onChange={(e) => handleNestedChange("dateOfBirth", "month", e.target.value)}
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
                    onChange={(e) => handleNestedChange("dateOfBirth", "year", e.target.value)}
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
                <StyledTextField
                  fullWidth
                  size="small"
                  value={formData.referralCode}
                  onChange={(e) => handleChange("referralCode", e.target.value)}
                />
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
                  onChange={(e) => handleChange("couponCode", e.target.value)}
                  sx={{ width: "120px" }}
                />
              </Box>
            </Box>
            <RadioGroup
              row
              value={formData.membershipPlan}
              onChange={(e) => handleChange("membershipPlan", e.target.value)}
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
                }}
              >
                <Radio
                  value="monthly"
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
                }}
              >
                <Radio
                  value="semi-annually"
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
                }}
              >
                <Radio
                  value="yearly"
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

        {/* 1x2 Grid Layout: One Row, Two Equal Columns */}
        <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}>
          {/* Column 1: Optional Information (50% width) */}
          <Box sx={{ flex: 1, width: "50%" }}>
            <StyledCard>
              <CardContent sx={{ p: 3 }}>
                <SectionTitle>Optional Information</SectionTitle>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                      Address
                    </Typography>
                    <StyledTextField
                      fullWidth
                      size="small"
                      value={formData.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                    />
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
                        onChange={(e) => handleChange("maritalStatus", e.target.value)}
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
                        onChange={(e) => handleChange("race", e.target.value)}
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
                        onChange={(e) => handleChange("religion", e.target.value)}
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
                        onChange={(e) => handleChange("householdSize", e.target.value)}
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
                      onChange={(e) => handleChange("monthlyIncome", e.target.value)}
                    />
                  </Box>
                </Box>
              </CardContent>
            </StyledCard>
          </Box>

          {/* Column 2: Facilities and Payment Details Stacked (50% width) */}
          <Box sx={{ flex: 1, width: "50%", display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Facilities and Services Section */}
            <StyledCard>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <SectionTitle sx={{ mb: 0 }}>Facilities and Services</SectionTitle>
                  <AddButton>
                    <AddIcon />
                  </AddButton>
                </Box>
                <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                  {formData.facilities.map((facility) => (
                    <StyledChip
                      key={facility}
                      label={facility}
                      onDelete={() => handleDeleteFacility(facility)}
                      sx={{ mb: 1, mr: 1 }}
                    />
                  ))}
                </Box>
              </CardContent>
            </StyledCard>

            {/* Payment Details Section */}
            <StyledCard>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <SectionTitle sx={{ mb: 0 }}>Payment Details</SectionTitle>
                  <AddButton>
                    <AddIcon />
                  </AddButton>
                </Box>
                <Box sx={{ display: "flex", flexWrap: "wrap", mb: 3 }}>
                  <PaymentMethodChip
                    selected={formData.paymentMethod === "mastercard"}
                    onClick={() => handleChange("paymentMethod", "mastercard")}
                  >
                    <Box
                      component="img"
                      src="/placeholder.svg?height=24&width=36"
                      alt="Mastercard"
                      sx={{ height: 24 }}
                    />
                    <Typography sx={{ ml: 1, fontSize: "12px" }}>Mastercard</Typography>
                  </PaymentMethodChip>
                  <PaymentMethodChip
                    selected={formData.paymentMethod === "creditcard"}
                    onClick={() => handleChange("paymentMethod", "creditcard")}
                  >
                    <Box
                      component="img"
                      src="/placeholder.svg?height=24&width=36"
                      alt="Credit Card"
                      sx={{ height: 24 }}
                    />
                    <Typography sx={{ ml: 1, fontSize: "12px" }}>Credit Card</Typography>
                  </PaymentMethodChip>
                  <PaymentMethodChip
                    selected={formData.paymentMethod === "visa"}
                    onClick={() => handleChange("paymentMethod", "visa")}
                  >
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
                      onChange={(e) => handleChange("cardNumber", e.target.value)}
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
                        onChange={(e) => handleChange("cardName", e.target.value)}
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
                        onChange={(e) => handleChange("cardPhone", e.target.value)}
                      />
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                        Expiry Date
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <StyledTextField
                          select
                          size="small"
                          value={formData.expiryMonth}
                          onChange={(e) => handleChange("expiryMonth", e.target.value)}
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
                          onChange={(e) => handleChange("expiryYear", e.target.value)}
                          sx={{ width: "48%" }}
                        >
                          <MenuItem value="Year">Year</MenuItem>
                          {Array.from({ length: 10 }, (_, i) => (new Date().getFullYear() + i).toString()).map(
                            (year) => (
                              <MenuItem key={year} value={year}>
                                {year}
                              </MenuItem>
                            ),
                          )}
                        </StyledTextField>
                      </Box>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                        CVV
                      </Typography>
                      <StyledTextField
                        fullWidth
                        size="small"
                        value={formData.cvv}
                        onChange={(e) => handleChange("cvv", e.target.value)}
                        type="password"
                        InputProps={{
                          inputProps: { maxLength: 3 },
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </StyledCard>
          </Box>
        </Box>

        {/* Update Button */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
          <UpdateButton variant="contained" onClick={handleUpdate}>
            Update
          </UpdateButton>
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
              Edit Member
            </Typography>
            <Typography sx={{ textAlign: "center", mb: 3 }}>
              Click On Update to make change and if not want to Click on discard to revert the changes.
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
                onClick={handleConfirmUpdate}
                sx={{
                  bgcolor: "#ff2d55",
                  "&:hover": {
                    bgcolor: "#e6254d",
                  },
                }}
              >
                Update
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
