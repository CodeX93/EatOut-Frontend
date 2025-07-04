"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import {
  Box,
  Typography,
  TextField,
  Grid,
  Chip,
  Button,
  AppBar,
  Toolbar,
  Avatar,
  IconButton,
  InputAdornment,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Select,
  MenuItem,
  FormControl,
  Paper,
  Modal,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material"
import {
  Search as SearchIcon,
  CalendarToday,
  KeyboardArrowDown,
  Notifications,
  Settings,
  Logout,
  Dashboard,
  Analytics as AnalyticsIcon,
  Restaurant,
  People,
  CardGiftcard,
  Share,
  RoomService,
  Radio,
  AcUnit,
  Restaurant as RestaurantIcon,
  ChildCare,
  AttachMoney,
  AccountBalanceWallet,
  Add,
  Close,
} from "@mui/icons-material"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import SideNavbar from "../../../components/SideNavbar"
import { doc, getDoc, collection, getDocs, updateDoc } from "firebase/firestore"
import { db } from "../../../../firebaseConfig"

const theme = createTheme({
  palette: {
    primary: {
      main: "#ff2d55",
    },
    secondary: {
      main: "#00c17c",
    },
    background: {
      default: "#f9f9f9",
      paper: "#ffffff",
    },
    text: {
      primary: "#000000",
      secondary: "#8a8a8f",
    },
    divider: "#efeff4",
    grey: {
      100: "#efeff4",
      300: "#dadada",
      400: "#c8c7cc",
      500: "#8a8a8f",
      600: "#666666",
    },
  },
})

const drawerWidth = 240

function EditPageContent() {
  const searchParams = useSearchParams()
  const restaurantId = searchParams.get("id")
  const [restaurant, setRestaurant] = useState(null)
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState("")
  const [modalValue, setModalValue] = useState("")
  const [modalField, setModalField] = useState("")

  useEffect(() => {
    if (!restaurantId) {
      setRestaurant(null)
      setMenuItems([])
      setLoading(false)
      return
    }
    const getRestaurantData = async () => {
      setLoading(true)
      try {
        // Fetch restaurant document
        const docRef = doc(db, "registeredRestaurants", restaurantId)
        const docSnap = await getDoc(docRef)
        if (!docSnap.exists()) {
          setRestaurant(null)
          setMenuItems([])
          setLoading(false)
          return
        }
        setRestaurant({ id: docSnap.id, ...docSnap.data() })
        // Fetch menuItems subcollection
        const menuItemsSnapshot = await getDocs(collection(docRef, "menuItems"))
        const menuItemsArr = []
        menuItemsSnapshot.forEach((itemDoc) => {
          menuItemsArr.push({ id: itemDoc.id, ...itemDoc.data() })
        })
        setMenuItems(menuItemsArr)
      } catch (error) {
        console.error("Error fetching restaurant data:", error)
        setRestaurant(null)
        setMenuItems([])
      } finally {
        setLoading(false)
      }
    }
    getRestaurantData()
  }, [restaurantId])

  const handleUpdateClick = () => {
    setShowModal(true)
  }

  const handleModalUpdate = async () => {
    setShowModal(false)
    setLoading(true)
    try {
      // Update restaurant document in Firestore
      const docRef = doc(db, "registeredRestaurants", restaurantId)
      await updateDoc(docRef, restaurant)
      setShowSuccess(true)
    } catch (error) {
      console.error("Error updating restaurant:", error)
      // Optionally show an error message
    } finally {
      setLoading(false)
    }
  }

  const handleModalDiscard = () => {
    setShowModal(false)
  }

  const handleInputChange = (field, value) => {
    setRestaurant((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleNestedInputChange = (parent, field, value) => {
    setRestaurant((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }))
  }

  const removeCuisine = (cuisineToRemove) => {
    setRestaurant((prev) => ({
      ...prev,
      cuisines: prev.cuisines.filter((cuisine) => cuisine !== cuisineToRemove),
    }))
  }

  // Open modal for a specific field
  const handleOpenModal = (type, field) => {
    setModalType(type)
    setModalField(field)
    setModalValue("")
    setModalOpen(true)
  }

  // Add value to array field
  const handleAddValue = () => {
    if (!modalValue) return
    setRestaurant((prev) => {
      if (modalType === "array") {
        return {
          ...prev,
          [modalField]: Array.isArray(prev[modalField]) ? [...prev[modalField], modalValue] : [modalValue],
        }
      } else if (modalType === "social") {
        return {
          ...prev,
          [modalField]: modalValue,
        }
      }
      return prev
    })
    setModalOpen(false)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!restaurant) {
    return <div>Restaurant not found</div>
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <SideNavbar />
        {/* Main content area */}
        <Box sx={{ flexGrow: 1, ml: { md: '240px' } }}>
          {/* Header */}
          <AppBar
            position="fixed"
            sx={{
              zIndex: (theme) => theme.zIndex.drawer + 1,
              bgcolor: "#ffffff",
              color: "#000000",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              borderBottom: "1px solid #efeff4",
            }}
          >
            <Toolbar sx={{ justifyContent: "space-between", px: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: "#ff2d55",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography sx={{ color: "white", fontWeight: "bold", fontSize: "14px" }}>E</Typography>
                  </Box>
                  <Typography sx={{ fontWeight: "bold", color: "#ff2d55", fontSize: "18px" }}>E.A.T</Typography>
                </Box>
                <TextField
                  placeholder="Search"
                  size="small"
                  sx={{
                    width: 320,
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "#efeff4",
                      borderRadius: "8px",
                      border: "none",
                      "& fieldset": { border: "none" },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: "#8a8a8f" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Button
                  variant="text"
                  startIcon={<CalendarToday />}
                  endIcon={<KeyboardArrowDown />}
                  sx={{ color: "#666666", textTransform: "none" }}
                >
                  Wed 29 May 2026
                </Button>
                <IconButton>
                  <Notifications sx={{ color: "#666666" }} />
                </IconButton>
                <IconButton>
                  <Settings sx={{ color: "#666666" }} />
                </IconButton>
                <Avatar sx={{ width: 32, height: 32, bgcolor: "#c8c7cc", color: "#666666" }}>JM</Avatar>
              </Box>
            </Toolbar>
          </AppBar>
          {/* Main Content */}
          <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
            <Toolbar />

            {/* Page Title */}
            <Typography variant="h4" sx={{ fontWeight: 600, color: "#ff2d55", mb: 4 }}>
              Edit Restaurant Details
            </Typography>

            {/* Restaurant Details Card - Full Width */}
            <Paper sx={{ p: 4, mb: 3, borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: "#ff2d55", mb: 3 }}>
                Restaurant Details
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {/* First Row - Name and Cuisines */}
                <Box sx={{ display: "flex", gap: 3 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: "#000000" }}>
                      First Name
                    </Typography>
                    <TextField
                      fullWidth
                      value={restaurant.restaurantName || ""}
                      onChange={(e) => handleInputChange("restaurantName", e.target.value)}
                      variant="outlined"
                      size="small"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          bgcolor: "#ffffff",
                          borderRadius: "6px",
                          fontSize: "14px",
                          fontWeight: 400,
                          color: "#333333",
                          "& fieldset": {
                            borderColor: "#e0e0e0",
                            borderWidth: "1px",
                          },
                          "&:hover fieldset": {
                            borderColor: "#ff2d55",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#ff2d55",
                            borderWidth: "2px",
                          },
                        },
                        "& .MuiInputBase-input": {
                          padding: "10px 12px",
                          fontSize: "14px",
                          fontWeight: 400,
                          color: "#333333",
                        },
                      }}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: "#000000" }}>
                      Cuisines:
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,
                        alignItems: "center",
                        p: "10px 12px",
                        border: "1px solid #e0e0e0",
                        borderRadius: "6px",
                        bgcolor: "#ffffff",
                        minHeight: "40px",
                        "&:hover": {
                          borderColor: "#ff2d55",
                        },
                      }}
                    >
                      {restaurant.cuisines.map((cuisine) => (
                        <Chip
                          key={cuisine}
                          label={cuisine}
                          onDelete={() => removeCuisine(cuisine)}
                          deleteIcon={<Close sx={{ fontSize: "16px !important" }} />}
                          sx={{
                            bgcolor: "#efeff4",
                            color: "#333333",
                            borderRadius: "4px",
                            height: "24px",
                            fontSize: "12px",
                            fontWeight: 400,
                            "& .MuiChip-deleteIcon": {
                              color: "#8a8a8f",
                              fontSize: "16px",
                              "&:hover": {
                                color: "#ff2d55",
                              },
                            },
                          }}
                        />
                      ))}
                      <IconButton size="small" sx={{ color: "#8a8a8f", ml: "auto" }}>
                        <KeyboardArrowDown />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>

                {/* Second Row - Address, City, Phone */}
                <Box sx={{ display: "flex", gap: 3 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: "#000000" }}>
                      Full Address
                    </Typography>
                    <TextField
                      fullWidth
                      value={restaurant.address || ""}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      variant="outlined"
                      size="small"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          bgcolor: "#ffffff",
                          borderRadius: "6px",
                          fontSize: "14px",
                          fontWeight: 400,
                          color: "#333333",
                          "& fieldset": {
                            borderColor: "#e0e0e0",
                            borderWidth: "1px",
                          },
                          "&:hover fieldset": {
                            borderColor: "#ff2d55",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#ff2d55",
                            borderWidth: "2px",
                          },
                        },
                        "& .MuiInputBase-input": {
                          padding: "10px 12px",
                          fontSize: "14px",
                          fontWeight: 400,
                          color: "#333333",
                        },
                      }}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: "#000000" }}>
                      City/Location
                    </Typography>
                    <TextField
                      fullWidth
                      value={restaurant.city || ""}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      variant="outlined"
                      size="small"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          bgcolor: "#ffffff",
                          borderRadius: "6px",
                          fontSize: "14px",
                          fontWeight: 400,
                          color: "#333333",
                          "& fieldset": {
                            borderColor: "#e0e0e0",
                            borderWidth: "1px",
                          },
                          "&:hover fieldset": {
                            borderColor: "#ff2d55",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#ff2d55",
                            borderWidth: "2px",
                          },
                        },
                        "& .MuiInputBase-input": {
                          padding: "10px 12px",
                          fontSize: "14px",
                          fontWeight: 400,
                          color: "#333333",
                        },
                      }}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: "#000000" }}>
                      Telephone Number
                    </Typography>
                    <TextField
                      fullWidth
                      value={restaurant.phone || ""}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      variant="outlined"
                      size="small"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          bgcolor: "#ffffff",
                          borderRadius: "6px",
                          fontSize: "14px",
                          fontWeight: 400,
                          color: "#333333",
                          "& fieldset": {
                            borderColor: "#e0e0e0",
                            borderWidth: "1px",
                          },
                          "&:hover fieldset": {
                            borderColor: "#ff2d55",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#ff2d55",
                            borderWidth: "2px",
                          },
                        },
                        "& .MuiInputBase-input": {
                          padding: "10px 12px",
                          fontSize: "14px",
                          fontWeight: 400,
                          color: "#333333",
                        },
                      }}
                    />
                  </Box>
                </Box>

                {/* Third Row - Email */}
                <Box>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: "#000000" }}>
                    Email Address
                  </Typography>
                  <TextField
                    fullWidth
                    value={restaurant.email || ""}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    variant="outlined"
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "#ffffff",
                        borderRadius: "6px",
                        fontSize: "14px",
                        fontWeight: 400,
                        color: "#333333",
                        "& fieldset": {
                          borderColor: "#e0e0e0",
                          borderWidth: "1px",
                        },
                        "&:hover fieldset": {
                          borderColor: "#ff2d55",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#ff2d55",
                          borderWidth: "2px",
                        },
                      },
                      "& .MuiInputBase-input": {
                        padding: "10px 12px",
                        fontSize: "14px",
                        fontWeight: 400,
                        color: "#333333",
                      },
                    }}
                  />
                </Box>
              </Box>
            </Paper>

            {/* Two Column Layout */}
            <Box sx={{ display: "flex", gap: 3 }}>
              {/* Left Column - Main Info Card */}
              <Box sx={{ flex: 1 }}>
                <Paper sx={{ p: 4, borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", height: "fit-content" }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: "#ff2d55", mb: 3 }}>
                    Main Info
                  </Typography>

                  <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    {/* Opening Days */}
                    <Box>
                      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: "#000000" }}>
                        Opening Days
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <FormControl size="small" sx={{ flex: 1 }}>
                          <Select
                            value={restaurant.openingSchedules?.[0]?.startDay || ""}
                            onChange={(e) => handleNestedInputChange("openingSchedules", "startDay", e.target.value)}
                            sx={{
                              bgcolor: "#ffffff",
                              borderRadius: "6px",
                              fontSize: "14px",
                              fontWeight: 400,
                              color: "#333333",
                              "& fieldset": {
                                borderColor: "#e0e0e0",
                                borderWidth: "1px",
                              },
                              "&:hover fieldset": {
                                borderColor: "#ff2d55",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#ff2d55",
                                borderWidth: "2px",
                              },
                              "& .MuiSelect-select": {
                                padding: "10px 12px",
                                fontSize: "14px",
                                fontWeight: 400,
                                color: "#333333",
                              },
                            }}
                          >
                            <MenuItem value="20-03-2025">20-03-2025</MenuItem>
                            <MenuItem value="21-03-2025">21-03-2025</MenuItem>
                            <MenuItem value="22-03-2025">22-03-2025</MenuItem>
                          </Select>
                        </FormControl>
                        <Typography sx={{ color: "#8a8a8f", mx: 1, fontSize: "14px" }}>—</Typography>
                        <FormControl size="small" sx={{ flex: 1 }}>
                          <Select
                            value={restaurant.openingSchedules?.[0]?.endDay || ""}
                            onChange={(e) => handleNestedInputChange("openingSchedules", "endDay", e.target.value)}
                            sx={{
                              bgcolor: "#ffffff",
                              borderRadius: "6px",
                              fontSize: "14px",
                              fontWeight: 400,
                              color: "#333333",
                              "& fieldset": {
                                borderColor: "#e0e0e0",
                                borderWidth: "1px",
                              },
                              "&:hover fieldset": {
                                borderColor: "#ff2d55",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#ff2d55",
                                borderWidth: "2px",
                              },
                              "& .MuiSelect-select": {
                                padding: "10px 12px",
                                fontSize: "14px",
                                fontWeight: 400,
                                color: "#333333",
                              },
                            }}
                          >
                            <MenuItem value="25-03-2025">25-03-2025</MenuItem>
                            <MenuItem value="26-03-2025">26-03-2025</MenuItem>
                            <MenuItem value="27-03-2025">27-03-2025</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    </Box>

                    {/* Opening Hours */}
                    <Box>
                      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: "#000000" }}>
                        Opening Hours
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <FormControl size="small" sx={{ flex: 1 }}>
                          <Select
                            value={restaurant.openingSchedules?.[0]?.startHour || ""}
                            onChange={(e) => handleNestedInputChange("openingSchedules", "startHour", e.target.value)}
                            sx={{
                              bgcolor: "#ffffff",
                              borderRadius: "6px",
                              fontSize: "14px",
                              fontWeight: 400,
                              color: "#333333",
                              "& fieldset": {
                                borderColor: "#e0e0e0",
                                borderWidth: "1px",
                              },
                              "&:hover fieldset": {
                                borderColor: "#ff2d55",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#ff2d55",
                                borderWidth: "2px",
                              },
                              "& .MuiSelect-select": {
                                padding: "10px 12px",
                                fontSize: "14px",
                                fontWeight: 400,
                                color: "#333333",
                              },
                            }}
                          >
                            <MenuItem value="09:00 AM">09:00 AM</MenuItem>
                            <MenuItem value="10:00 AM">10:00 AM</MenuItem>
                            <MenuItem value="11:00 AM">11:00 AM</MenuItem>
                          </Select>
                        </FormControl>
                        <Typography sx={{ color: "#8a8a8f", mx: 1, fontSize: "14px" }}>—</Typography>
                        <FormControl size="small" sx={{ flex: 1 }}>
                          <Select
                            value={restaurant.openingSchedules?.[0]?.endHour || ""}
                            onChange={(e) => handleNestedInputChange("openingSchedules", "endHour", e.target.value)}
                            sx={{
                              bgcolor: "#ffffff",
                              borderRadius: "6px",
                              fontSize: "14px",
                              fontWeight: 400,
                              color: "#333333",
                              "& fieldset": {
                                borderColor: "#e0e0e0",
                                borderWidth: "1px",
                              },
                              "&:hover fieldset": {
                                borderColor: "#ff2d55",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#ff2d55",
                                borderWidth: "2px",
                              },
                              "& .MuiSelect-select": {
                                padding: "10px 12px",
                                fontSize: "14px",
                                fontWeight: 400,
                                color: "#333333",
                              },
                            }}
                          >
                            <MenuItem value="09:20 AM">09:20 AM</MenuItem>
                            <MenuItem value="10:20 AM">10:20 AM</MenuItem>
                            <MenuItem value="11:20 AM">11:20 AM</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    </Box>

                    {/* Closing Hours */}
                    <Box>
                      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: "#000000" }}>
                        Closing Hours
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <FormControl size="small" sx={{ flex: 1 }}>
                          <Select
                            value={restaurant.closingSchedules?.[0]?.startHour || ""}
                            onChange={(e) => handleNestedInputChange("closingSchedules", "startHour", e.target.value)}
                            sx={{
                              bgcolor: "#ffffff",
                              borderRadius: "6px",
                              fontSize: "14px",
                              fontWeight: 400,
                              color: "#333333",
                              "& fieldset": {
                                borderColor: "#e0e0e0",
                                borderWidth: "1px",
                              },
                              "&:hover fieldset": {
                                borderColor: "#ff2d55",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#ff2d55",
                                borderWidth: "2px",
                              },
                              "& .MuiSelect-select": {
                                padding: "10px 12px",
                                fontSize: "14px",
                                fontWeight: 400,
                                color: "#333333",
                              },
                            }}
                          >
                            <MenuItem value="09:00 PM">09:00 PM</MenuItem>
                            <MenuItem value="10:00 PM">10:00 PM</MenuItem>
                            <MenuItem value="11:00 PM">11:00 PM</MenuItem>
                          </Select>
                        </FormControl>
                        <Typography sx={{ color: "#8a8a8f", mx: 1, fontSize: "14px" }}>—</Typography>
                        <FormControl size="small" sx={{ flex: 1 }}>
                          <Select
                            value={restaurant.closingSchedules?.[0]?.endHour || ""}
                            onChange={(e) => handleNestedInputChange("closingSchedules", "endHour", e.target.value)}
                            sx={{
                              bgcolor: "#ffffff",
                              borderRadius: "6px",
                              fontSize: "14px",
                              fontWeight: 400,
                              color: "#333333",
                              "& fieldset": {
                                borderColor: "#e0e0e0",
                                borderWidth: "1px",
                              },
                              "&:hover fieldset": {
                                borderColor: "#ff2d55",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#ff2d55",
                                borderWidth: "2px",
                              },
                              "& .MuiSelect-select": {
                                padding: "10px 12px",
                                fontSize: "14px",
                                fontWeight: 400,
                                color: "#333333",
                              },
                            }}
                          >
                            <MenuItem value="10:00 PM">10:00 PM</MenuItem>
                            <MenuItem value="11:00 PM">11:00 PM</MenuItem>
                            <MenuItem value="12:00 AM">12:00 AM</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    </Box>

                    {/* Price Range and Specialty */}
                    <Box sx={{ display: "flex", gap: 3 }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: "#000000" }}>
                          Price Range
                        </Typography>
                        <FormControl fullWidth size="small">
                          <Select
                            value={restaurant.priceRange}
                            onChange={(e) => handleInputChange("priceRange", e.target.value)}
                            sx={{
                              bgcolor: "#ffffff",
                              borderRadius: "6px",
                              fontSize: "14px",
                              fontWeight: 400,
                              color: "#333333",
                              "& fieldset": {
                                borderColor: "#e0e0e0",
                                borderWidth: "1px",
                              },
                              "&:hover fieldset": {
                                borderColor: "#ff2d55",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#ff2d55",
                                borderWidth: "2px",
                              },
                              "& .MuiSelect-select": {
                                padding: "10px 12px",
                                fontSize: "14px",
                                fontWeight: 400,
                                color: "#333333",
                              },
                            }}
                          >
                            <MenuItem value="$500">$500</MenuItem>
                            <MenuItem value="$1000">$1000</MenuItem>
                            <MenuItem value="$1500">$1500</MenuItem>
                            <MenuItem value="$2000">$2000</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: "#000000" }}>
                          Specialty
                        </Typography>
                        <TextField
                          fullWidth
                          value={restaurant.specialty || ""}
                          onChange={(e) => handleInputChange("specialty", e.target.value)}
                          variant="outlined"
                          size="small"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              bgcolor: "#ffffff",
                              borderRadius: "6px",
                              fontSize: "14px",
                              fontWeight: 400,
                              color: "#333333",
                              "& fieldset": {
                                borderColor: "#e0e0e0",
                                borderWidth: "1px",
                              },
                              "&:hover fieldset": {
                                borderColor: "#ff2d55",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#ff2d55",
                                borderWidth: "2px",
                              },
                            },
                            "& .MuiInputBase-input": {
                              padding: "10px 12px",
                              fontSize: "14px",
                              fontWeight: 400,
                              color: "#333333",
                            },
                          }}
                        />
                      </Box>
                    </Box>

                    {/* Description */}
                    <Box>
                      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: "#000000" }}>
                        Description
                      </Typography>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        value={restaurant.description || ""}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            bgcolor: "#ffffff",
                            borderRadius: "6px",
                            fontSize: "14px",
                            fontWeight: 400,
                            color: "#333333",
                            "& fieldset": {
                              borderColor: "#e0e0e0",
                              borderWidth: "1px",
                            },
                            "&:hover fieldset": {
                              borderColor: "#ff2d55",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#ff2d55",
                              borderWidth: "2px",
                            },
                          },
                          "& .MuiInputBase-input": {
                            padding: "12px",
                            fontSize: "14px",
                            fontWeight: 400,
                            color: "#333333",
                          },
                        }}
                      />
                    </Box>
                  </Box>
                </Paper>
              </Box>

              {/* Right Column - Three Separate Cards */}
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {/* Facilities and Services Card */}
                  <Paper sx={{ p: 4, borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: "#ff2d55" }}>
                        Facilities and Services
                      </Typography>
                      <IconButton size="small" onClick={() => handleOpenModal("array", "facilities")}> <Add /> </IconButton>
                    </Box>

                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {Array.isArray(restaurant.facilities) && restaurant.facilities.map((facility, idx) => (
                        <Chip
                          key={idx}
                          icon={
                            idx === 0 ? (
                              <AcUnit sx={{ color: "white !important", fontSize: "16px" }} />
                            ) : idx === 1 ? (
                              <RestaurantIcon sx={{ color: "white !important", fontSize: "16px" }} />
                            ) : (
                              <ChildCare sx={{ color: "white !important", fontSize: "16px" }} />
                            )
                          }
                          label={facility}
                          sx={{
                            bgcolor: "#ff2d55",
                            color: "white",
                            borderRadius: "4px",
                            height: "32px",
                            fontSize: "13px",
                            fontWeight: 400,
                            "& .MuiChip-icon": {
                              color: "white",
                            },
                          }}
                        />
                      ))}
                    </Box>
                  </Paper>

                  {/* Payment Options Card */}
                  <Paper sx={{ p: 4, borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: "#ff2d55" }}>
                        Payment Options
                      </Typography>
                      <IconButton size="small" onClick={() => handleOpenModal("array", "paymentOptions")}> <Add /> </IconButton>
                    </Box>

                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {Array.isArray(restaurant.paymentOptions) && restaurant.paymentOptions.map((option, idx) => (
                        <Chip
                          key={idx}
                          icon={
                            idx === 0 ? (
                              <AttachMoney sx={{ color: "white !important", fontSize: "16px" }} />
                            ) : (
                              <AccountBalanceWallet sx={{ color: "white !important", fontSize: "16px" }} />
                            )
                          }
                          label={option}
                          sx={{
                            bgcolor: "#ff2d55",
                            color: "white",
                            borderRadius: "4px",
                            height: "32px",
                            fontSize: "13px",
                            fontWeight: 400,
                            "& .MuiChip-icon": {
                              color: "white",
                            },
                          }}
                        />
                      ))}
                    </Box>
                  </Paper>

                  {/* Social Media Card */}
                  <Paper sx={{ p: 4, borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: "#ff2d55" }}>
                        Social Media
                      </Typography>
                      <IconButton size="small" onClick={() => handleOpenModal("social", "websiteUrl")}> <Add /> </IconButton>
                    </Box>

                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          placeholder="Enter Website Url (Optional)"
                          value={restaurant.websiteUrl || ""}
                          onChange={(e) => handleNestedInputChange("socialMedia", "website", e.target.value)}
                          variant="outlined"
                          size="small"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              bgcolor: "#ffffff",
                              borderRadius: "6px",
                              fontSize: "14px",
                              fontWeight: 400,
                              color: "#333333",
                              "& fieldset": {
                                borderColor: "#e0e0e0",
                                borderWidth: "1px",
                              },
                              "&:hover fieldset": {
                                borderColor: "#ff2d55",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#ff2d55",
                                borderWidth: "2px",
                              },
                            },
                            "& .MuiInputBase-input": {
                              padding: "10px 12px",
                              fontSize: "14px",
                              fontWeight: 400,
                              "&::placeholder": {
                                color: "#8a8a8f",
                                opacity: 1,
                              },
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          placeholder="Enter Facebook Url (Optional)"
                          value={restaurant.facebookUrl || ""}
                          onChange={(e) => handleNestedInputChange("socialMedia", "facebook", e.target.value)}
                          variant="outlined"
                          size="small"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              bgcolor: "#ffffff",
                              borderRadius: "6px",
                              fontSize: "14px",
                              fontWeight: 400,
                              color: "#333333",
                              "& fieldset": {
                                borderColor: "#e0e0e0",
                                borderWidth: "1px",
                              },
                              "&:hover fieldset": {
                                borderColor: "#ff2d55",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#ff2d55",
                                borderWidth: "2px",
                              },
                            },
                            "& .MuiInputBase-input": {
                              padding: "10px 12px",
                              fontSize: "14px",
                              fontWeight: 400,
                              "&::placeholder": {
                                color: "#8a8a8f",
                                opacity: 1,
                              },
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          placeholder="Enter Instagram Url (Optional)"
                          value={restaurant.instagramUrl || ""}
                          onChange={(e) => handleNestedInputChange("socialMedia", "instagram", e.target.value)}
                          variant="outlined"
                          size="small"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              bgcolor: "#ffffff",
                              borderRadius: "6px",
                              fontSize: "14px",
                              fontWeight: 400,
                              color: "#333333",
                              "& fieldset": {
                                borderColor: "#e0e0e0",
                                borderWidth: "1px",
                              },
                              "&:hover fieldset": {
                                borderColor: "#ff2d55",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#ff2d55",
                                borderWidth: "2px",
                              },
                            },
                            "& .MuiInputBase-input": {
                              padding: "10px 12px",
                              fontSize: "14px",
                              fontWeight: 400,
                              "&::placeholder": {
                                color: "#8a8a8f",
                                opacity: 1,
                              },
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          placeholder="Enter TikTok Url (Optional)"
                          value={restaurant.tiktokUrl || ""}
                          onChange={(e) => handleNestedInputChange("socialMedia", "tiktok", e.target.value)}
                          variant="outlined"
                          size="small"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              bgcolor: "#ffffff",
                              borderRadius: "6px",
                              fontSize: "14px",
                              fontWeight: 400,
                              color: "#333333",
                              "& fieldset": {
                                borderColor: "#e0e0e0",
                                borderWidth: "1px",
                              },
                              "&:hover fieldset": {
                                borderColor: "#ff2d55",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#ff2d55",
                                borderWidth: "2px",
                              },
                            },
                            "& .MuiInputBase-input": {
                              padding: "10px 12px",
                              fontSize: "14px",
                              fontWeight: 400,
                              "&::placeholder": {
                                color: "#8a8a8f",
                                opacity: 1,
                              },
                            },
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                </Box>
              </Box>
            </Box>

            {/* Update Button */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
              <Button
                variant="contained"
                onClick={handleUpdateClick}
                sx={{
                  bgcolor: "#ff2d55",
                  color: "white",
                  borderRadius: "4px",
                  px: 4,
                  py: 1,
                  textTransform: "none",
                  fontSize: "14px",
                  fontWeight: 500,
                  "&:hover": {
                    bgcolor: "#e6254d",
                  },
                }}
              >
                Update
              </Button>
            </Box>
          </Box>

          {/* Update Confirmation Modal */}
          <Modal
            open={showModal}
            onClose={handleModalDiscard}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Paper
              sx={{
                width: 400,
                p: 4,
                borderRadius: "8px",
                textAlign: "center",
                outline: "none",
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 600, color: "#000000", mb: 2 }}>
                Edit Restaurant
              </Typography>
              <Typography variant="body1" sx={{ color: "#8a8a8f", mb: 4, lineHeight: 1.5 }}>
                Click On Update to make change and if not want to Click on discard to revert the changes.
              </Typography>
              <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
                <Button
                  variant="outlined"
                  onClick={handleModalDiscard}
                  sx={{
                    borderColor: "#e0e0e0",
                    color: "#8a8a8f",
                    borderRadius: "4px",
                    px: 3,
                    py: 1,
                    textTransform: "none",
                    fontSize: "14px",
                    fontWeight: 500,
                    "&:hover": {
                      borderColor: "#c8c7cc",
                      bgcolor: "#f5f5f5",
                    },
                  }}
                >
                  Discard
                </Button>
                <Button
                  variant="contained"
                  onClick={handleModalUpdate}
                  sx={{
                    bgcolor: "#ff2d55",
                    color: "white",
                    borderRadius: "4px",
                    px: 3,
                    py: 1,
                    textTransform: "none",
                    fontSize: "14px",
                    fontWeight: 500,
                    "&:hover": {
                      bgcolor: "#e6254d",
                    },
                  }}
                >
                  Update
                </Button>
              </Box>
            </Paper>
          </Modal>

          {/* Success Snackbar */}
          <Snackbar
            open={showSuccess}
            autoHideDuration={4000}
            onClose={() => setShowSuccess(false)}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Alert
              onClose={() => setShowSuccess(false)}
              severity="success"
              sx={{
                width: "100%",
                bgcolor: "#00c17c",
                color: "white",
                "& .MuiAlert-icon": {
                  color: "white",
                },
              }}
            >
              Restaurant details updated successfully!
            </Alert>
          </Snackbar>

          {/* Modal for adding values */}
          <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
            <DialogTitle>Add {modalType === "array" ? modalField : "Social Media Link"}</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label={modalType === "array" ? "Enter value" : "Enter URL"}
                type="text"
                fullWidth
                value={modalValue}
                onChange={(e) => setModalValue(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button onClick={handleAddValue} variant="contained">Add</Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default function EditPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditPageContent />
    </Suspense>
  )
}

