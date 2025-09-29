"use client"

import { useState, useEffect, Suspense, useRef } from "react"
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
  const [cuisines, setCuisines] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState("")
  const [modalValue, setModalValue] = useState("")
  const [modalField, setModalField] = useState("")
  const [cuisineDropdownOpen, setCuisineDropdownOpen] = useState(false)
  const cuisineDropdownRef = useRef(null)

  useEffect(() => {
    if (!restaurantId) {
      setRestaurant(null)
      setMenuItems([])
      setCuisines([])
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
          setCuisines([])
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
        
        // Fetch cuisines from admin collection
        const adminDocRef = doc(db, "admin", "admin")
        const adminDoc = await getDoc(adminDocRef)
        if (adminDoc.exists()) {
          const data = adminDoc.data()
          const cuisinesData = data.cuisines || {}
          const cuisinesArray = Object.entries(cuisinesData)
            .map(([name, data]) => ({
              name,
              numberOfRestUsing: data.numberOfRestUsing || 0,
              isActive: data.isActive !== false,
            }))
            .filter(cuisine => cuisine.isActive) // Only show active cuisines
            .sort((a, b) => a.name.localeCompare(b.name))
          setCuisines(cuisinesArray)
        }
      } catch (error) {
        console.error("Error fetching restaurant data:", error)
        setRestaurant(null)
        setMenuItems([])
        setCuisines([])
      } finally {
        setLoading(false)
      }
    }
    getRestaurantData()
  }, [restaurantId])

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cuisineDropdownRef.current && !cuisineDropdownRef.current.contains(event.target)) {
        setCuisineDropdownOpen(false)
      }
    }

    if (cuisineDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [cuisineDropdownOpen])

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

  const addCuisine = (cuisineName) => {
    if (!cuisineName || restaurant.cuisines.includes(cuisineName)) return
    setRestaurant((prev) => ({
      ...prev,
      cuisines: [...prev.cuisines, cuisineName],
    }))
    setCuisineDropdownOpen(false)
  }

  const handleCuisineSelect = (cuisineName) => {
    addCuisine(cuisineName)
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
            <Toolbar sx={{ 
              justifyContent: "space-between", 
              px: { xs: 1, sm: 2, md: 3 },
              minHeight: { xs: "56px", sm: "64px" }
            }}>
              <Box sx={{ 
                display: "flex", 
                alignItems: "center", 
                gap: { xs: 1, sm: 2, md: 3 },
                flex: 1,
                minWidth: 0,
              }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexShrink: 0 }}>
                  <Box
                    sx={{
                      width: { xs: 28, sm: 32 },
                      height: { xs: 28, sm: 32 },
                      bgcolor: "#ff2d55",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography sx={{ 
                      color: "white", 
                      fontWeight: "bold", 
                      fontSize: { xs: "12px", sm: "14px" }
                    }}>E</Typography>
                  </Box>
                  <Typography sx={{ 
                    fontWeight: "bold", 
                    color: "#ff2d55", 
                    fontSize: { xs: "14px", sm: "16px", md: "18px" }
                  }}>E.A.T</Typography>
                </Box>
                <TextField
                  placeholder="Search"
                  size="small"
                  sx={{
                    width: { xs: 0, sm: 200, md: 320 },
                    display: { xs: "none", sm: "block" },
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
              <Box sx={{ 
                display: "flex", 
                alignItems: "center", 
                gap: { xs: 1, sm: 2 },
                flexShrink: 0,
              }}>
                <Button
                  variant="text"
                  startIcon={<CalendarToday />}
                  endIcon={<KeyboardArrowDown />}
                  sx={{ 
                    color: "#666666", 
                    textTransform: "none",
                    display: { xs: "none", sm: "flex" },
                    fontSize: { sm: "0.75rem", md: "0.875rem" },
                  }}
                >
                  Wed 29 May 2026
                </Button>
                <IconButton size={window.innerWidth < 600 ? "small" : "medium"}>
                  <Notifications sx={{ 
                    color: "#666666",
                    fontSize: { xs: "18px", sm: "20px", md: "24px" }
                  }} />
                </IconButton>
                <IconButton size={window.innerWidth < 600 ? "small" : "medium"}>
                  <Settings sx={{ 
                    color: "#666666",
                    fontSize: { xs: "18px", sm: "20px", md: "24px" }
                  }} />
                </IconButton>
                <Avatar sx={{ 
                  width: { xs: 28, sm: 32 }, 
                  height: { xs: 28, sm: 32 }, 
                  bgcolor: "#c8c7cc", 
                  color: "#666666",
                  fontSize: { xs: "12px", sm: "14px" }
                }}>JM</Avatar>
              </Box>
            </Toolbar>
          </AppBar>
          {/* Main Content */}
          <Box component="main" sx={{ 
            flexGrow: 1, 
            p: { xs: 1.5, sm: 2, md: 3, lg: 4 },
            mt: { xs: "56px", sm: "64px" }
          }}>
            <Toolbar />

            {/* Page Title */}
            <Typography variant="h4" sx={{ 
              fontWeight: 600, 
              color: "#ff2d55", 
              mb: { xs: 2, sm: 3, md: 4 },
              fontSize: { xs: "1.25rem", sm: "1.5rem", md: "2rem", lg: "2.125rem" },
              lineHeight: 1.2,
            }}>
              Edit Restaurant Details
            </Typography>

            {/* Restaurant Details Card - Full Width */}
            <Paper sx={{ 
              p: { xs: 2, sm: 3, md: 4 }, 
              mb: { xs: 2, sm: 3, md: 3 }, 
              borderRadius: { xs: "6px", sm: "8px" }, 
              boxShadow: { xs: "none", sm: "0 1px 3px rgba(0,0,0,0.1)" }
            }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 600, 
                color: "#ff2d55", 
                mb: { xs: 2, sm: 3 },
                fontSize: { xs: "1rem", sm: "1.125rem", md: "1.25rem" },
                lineHeight: 1.3,
              }}>
                Restaurant Details
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 2, sm: 2.5, md: 3 } }}>
                {/* First Row - Name and Cuisines */}
                <Box sx={{ 
                  display: "flex", 
                  flexDirection: { xs: "column", sm: "row" },
                  gap: { xs: 2, sm: 3 }
                }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ 
                      mb: { xs: 0.5, sm: 1 }, 
                      fontWeight: 500, 
                      color: "#000000",
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    }}>
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
                          borderRadius: { xs: "4px", sm: "6px" },
                          fontSize: { xs: "13px", sm: "14px" },
                          fontWeight: 400,
                          color: "#333333",
                          height: { xs: "40px", sm: "44px" },
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
                          padding: { xs: "8px 10px", sm: "10px 12px" },
                          fontSize: { xs: "13px", sm: "14px" },
                          fontWeight: 400,
                          color: "#333333",
                        },
                      }}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ 
                      mb: { xs: 0.5, sm: 1 }, 
                      fontWeight: 500, 
                      color: "#000000",
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    }}>
                      Cuisines:
                    </Typography>
                    <Box sx={{ position: "relative" }} ref={cuisineDropdownRef}>
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: { xs: 0.5, sm: 1 },
                          alignItems: "center",
                          p: { xs: "8px 10px", sm: "10px 12px" },
                          border: "1px solid #e0e0e0",
                          borderRadius: { xs: "4px", sm: "6px" },
                          bgcolor: "#ffffff",
                          minHeight: { xs: "40px", sm: "44px" },
                          cursor: "pointer",
                          "&:hover": {
                            borderColor: "#ff2d55",
                          },
                        }}
                        onClick={() => setCuisineDropdownOpen(!cuisineDropdownOpen)}
                      >
                        {restaurant.cuisines && restaurant.cuisines.length > 0 ? (
                          restaurant.cuisines.map((cuisine) => (
                            <Chip
                              key={cuisine}
                              label={cuisine}
                              onDelete={(e) => {
                                e.stopPropagation()
                                removeCuisine(cuisine)
                              }}
                              deleteIcon={<Close sx={{ fontSize: { xs: "14px !important", sm: "16px !important" } }} />}
                              sx={{
                                bgcolor: "#efeff4",
                                color: "#333333",
                                borderRadius: { xs: "3px", sm: "4px" },
                                height: { xs: "20px", sm: "24px" },
                                fontSize: { xs: "11px", sm: "12px" },
                                fontWeight: 400,
                                "& .MuiChip-label": {
                                  px: { xs: 1, sm: 1.5 },
                                },
                                "& .MuiChip-deleteIcon": {
                                  color: "#8a8a8f",
                                  fontSize: { xs: "14px", sm: "16px" },
                                  "&:hover": {
                                    color: "#ff2d55",
                                  },
                                },
                              }}
                            />
                          ))
                        ) : (
                          <Typography sx={{ color: "#8a8a8f", fontSize: "14px" }}>
                            Select cuisines...
                          </Typography>
                        )}
                        <IconButton 
                          size="small" 
                          sx={{ color: "#8a8a8f", ml: "auto" }}
                          onClick={(e) => {
                            e.stopPropagation()
                            setCuisineDropdownOpen(!cuisineDropdownOpen)
                          }}
                        >
                          <KeyboardArrowDown />
                        </IconButton>
                      </Box>
                      
                      {/* Cuisines Dropdown */}
                      {cuisineDropdownOpen && (
                        <Paper
                          sx={{
                            position: "absolute",
                            top: "100%",
                            left: 0,
                            right: 0,
                            zIndex: 1000,
                            maxHeight: "200px",
                            overflow: "auto",
                            border: "1px solid #e0e0e0",
                            borderRadius: "6px",
                            bgcolor: "#ffffff",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            mt: 1,
                          }}
                        >
                          {cuisines
                            .filter(cuisine => !restaurant.cuisines?.includes(cuisine.name))
                            .map((cuisine) => (
                            <Box
                              key={cuisine.name}
                              sx={{
                                p: 2,
                                cursor: "pointer",
                                borderBottom: "1px solid #f0f0f0",
                                "&:hover": {
                                  bgcolor: "#f5f5f5",
                                },
                                "&:last-child": {
                                  borderBottom: "none",
                                },
                              }}
                              onClick={() => handleCuisineSelect(cuisine.name)}
                            >
                              <Typography sx={{ fontSize: "14px", color: "#333333" }}>
                                {cuisine.name}
                              </Typography>
                            </Box>
                          ))}
                          {cuisines.filter(cuisine => !restaurant.cuisines?.includes(cuisine.name)).length === 0 && (
                            <Box sx={{ p: 2, textAlign: "center" }}>
                              <Typography sx={{ fontSize: "14px", color: "#8a8a8f" }}>
                                All cuisines selected
                              </Typography>
                            </Box>
                          )}
                        </Paper>
                      )}
                    </Box>
                  </Box>
                </Box>

                {/* Second Row - Address, City, Phone */}
                <Box sx={{ 
                  display: "flex", 
                  flexDirection: { xs: "column", md: "row" },
                  gap: { xs: 2, md: 3 }
                }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: "#000000" }}>
                      Full Address
                    </Typography>
                    <TextField
                      fullWidth
                      value={restaurant.fullAddress || restaurant.address || ""}
                      onChange={(e) => handleInputChange("fullAddress", e.target.value)}
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
                      value={restaurant.branches?.[0]?.city || restaurant.city || ""}
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
                      value={restaurant.branches?.[0]?.telephone || restaurant.phone || ""}
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
            <Box sx={{ 
              display: "flex", 
              flexDirection: { xs: "column", lg: "row" },
              gap: { xs: 2, sm: 2.5, md: 3 }
            }}>
              {/* Left Column - Main Info Card */}
              <Box sx={{ flex: 1 }}>
                <Paper sx={{ 
                  p: { xs: 2, sm: 3, md: 4 }, 
                  borderRadius: { xs: "6px", sm: "8px" }, 
                  boxShadow: { xs: "none", sm: "0 1px 3px rgba(0,0,0,0.1)" }, 
                  height: "fit-content" 
                }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 600, 
                    color: "#ff2d55", 
                    mb: { xs: 2, sm: 3 },
                    fontSize: { xs: "1rem", sm: "1.125rem", md: "1.25rem" },
                    lineHeight: 1.3,
                  }}>
                    Main Info
                  </Typography>

                  <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 2, sm: 2.5, md: 3 } }}>
                    {/* Opening Days */}
                    <Box>
                      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: "#000000" }}>
                        Opening Days
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <FormControl size="small" sx={{ flex: 1 }}>
                          <Select
                            value={restaurant.openingSchedules?.[0]?.startDay || ""}
                            onChange={(e) => {
                              const newSchedules = [...(restaurant.openingSchedules || [])]
                              if (newSchedules[0]) {
                                newSchedules[0].startDay = e.target.value
                              } else {
                                newSchedules[0] = { startDay: e.target.value, endDay: "", startHour: "", endHour: "" }
                              }
                              handleInputChange("openingSchedules", newSchedules)
                            }}
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
                            <MenuItem value="Monday">Monday</MenuItem>
                            <MenuItem value="Tuesday">Tuesday</MenuItem>
                            <MenuItem value="Wednesday">Wednesday</MenuItem>
                            <MenuItem value="Thursday">Thursday</MenuItem>
                            <MenuItem value="Friday">Friday</MenuItem>
                            <MenuItem value="Saturday">Saturday</MenuItem>
                            <MenuItem value="Sunday">Sunday</MenuItem>
                          </Select>
                        </FormControl>
                        <Typography sx={{ color: "#8a8a8f", mx: 1, fontSize: "14px" }}>—</Typography>
                        <FormControl size="small" sx={{ flex: 1 }}>
                          <Select
                            value={restaurant.openingSchedules?.[0]?.endDay || ""}
                            onChange={(e) => {
                              const newSchedules = [...(restaurant.openingSchedules || [])]
                              if (newSchedules[0]) {
                                newSchedules[0].endDay = e.target.value
                              } else {
                                newSchedules[0] = { startDay: "", endDay: e.target.value, startHour: "", endHour: "" }
                              }
                              handleInputChange("openingSchedules", newSchedules)
                            }}
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
                            <MenuItem value="Monday">Monday</MenuItem>
                            <MenuItem value="Tuesday">Tuesday</MenuItem>
                            <MenuItem value="Wednesday">Wednesday</MenuItem>
                            <MenuItem value="Thursday">Thursday</MenuItem>
                            <MenuItem value="Friday">Friday</MenuItem>
                            <MenuItem value="Saturday">Saturday</MenuItem>
                            <MenuItem value="Sunday">Sunday</MenuItem>
                            <MenuItem value="Same Day">Same Day</MenuItem>
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
                            onChange={(e) => {
                              const newSchedules = [...(restaurant.openingSchedules || [])]
                              if (newSchedules[0]) {
                                newSchedules[0].startHour = e.target.value
                              } else {
                                newSchedules[0] = { startDay: "", endDay: "", startHour: e.target.value, endHour: "" }
                              }
                              handleInputChange("openingSchedules", newSchedules)
                            }}
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
                            <MenuItem value="12:40AM">12:40AM</MenuItem>
                            <MenuItem value="02:00AM">02:00AM</MenuItem>
                            <MenuItem value="07:00AM">07:00AM</MenuItem>
                            <MenuItem value="08:00AM">08:00AM</MenuItem>
                            <MenuItem value="09:00AM">09:00AM</MenuItem>
                            <MenuItem value="10:00AM">10:00AM</MenuItem>
                            <MenuItem value="11:00AM">11:00AM</MenuItem>
                            <MenuItem value="12:00PM">12:00PM</MenuItem>
                            <MenuItem value="01:00PM">01:00PM</MenuItem>
                            <MenuItem value="02:00PM">02:00PM</MenuItem>
                            <MenuItem value="03:00PM">03:00PM</MenuItem>
                            <MenuItem value="04:00PM">04:00PM</MenuItem>
                            <MenuItem value="05:00PM">05:00PM</MenuItem>
                            <MenuItem value="06:00PM">06:00PM</MenuItem>
                            <MenuItem value="07:00PM">07:00PM</MenuItem>
                            <MenuItem value="08:00PM">08:00PM</MenuItem>
                            <MenuItem value="09:00PM">09:00PM</MenuItem>
                            <MenuItem value="10:00PM">10:00PM</MenuItem>
                            <MenuItem value="11:00PM">11:00PM</MenuItem>
                            <MenuItem value="12:00AM">12:00AM</MenuItem>
                          </Select>
                        </FormControl>
                        <Typography sx={{ color: "#8a8a8f", mx: 1, fontSize: "14px" }}>—</Typography>
                        <FormControl size="small" sx={{ flex: 1 }}>
                          <Select
                            value={restaurant.openingSchedules?.[0]?.endHour || ""}
                            onChange={(e) => {
                              const newSchedules = [...(restaurant.openingSchedules || [])]
                              if (newSchedules[0]) {
                                newSchedules[0].endHour = e.target.value
                              } else {
                                newSchedules[0] = { startDay: "", endDay: "", startHour: "", endHour: e.target.value }
                              }
                              handleInputChange("openingSchedules", newSchedules)
                            }}
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
                            <MenuItem value="03:00AM">03:00AM</MenuItem>
                            <MenuItem value="04:00AM">04:00AM</MenuItem>
                            <MenuItem value="06:00AM">06:00AM</MenuItem>
                            <MenuItem value="07:00AM">07:00AM</MenuItem>
                            <MenuItem value="08:00AM">08:00AM</MenuItem>
                            <MenuItem value="09:00AM">09:00AM</MenuItem>
                            <MenuItem value="10:00AM">10:00AM</MenuItem>
                            <MenuItem value="11:00AM">11:00AM</MenuItem>
                            <MenuItem value="12:00PM">12:00PM</MenuItem>
                            <MenuItem value="01:00PM">01:00PM</MenuItem>
                            <MenuItem value="02:00PM">02:00PM</MenuItem>
                            <MenuItem value="03:00PM">03:00PM</MenuItem>
                            <MenuItem value="04:00PM">04:00PM</MenuItem>
                            <MenuItem value="05:00PM">05:00PM</MenuItem>
                            <MenuItem value="06:00PM">06:00PM</MenuItem>
                            <MenuItem value="07:00PM">07:00PM</MenuItem>
                            <MenuItem value="08:00PM">08:00PM</MenuItem>
                            <MenuItem value="09:00PM">09:00PM</MenuItem>
                            <MenuItem value="10:00PM">10:00PM</MenuItem>
                            <MenuItem value="11:00PM">11:00PM</MenuItem>
                            <MenuItem value="12:00AM">12:00AM</MenuItem>
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
                            value={restaurant.price || ""}
                            onChange={(e) => handleInputChange("price", e.target.value)}
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
                            <MenuItem value="Below RM50">Below RM50</MenuItem>
                            <MenuItem value="RM50 - RM80">RM50 - RM80</MenuItem>
                            <MenuItem value="RM80 - RM120">RM80 - RM120</MenuItem>
                            <MenuItem value="Above RM120">Above RM120</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: "#000000" }}>
                          Specialty
                        </Typography>
                        <TextField
                          fullWidth
                          value={restaurant.specialties?.[0] || ""}
                          onChange={(e) => handleInputChange("specialties", [e.target.value])}
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
                <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 2, sm: 2.5, md: 3 } }}>
                  {/* Facilities and Services Card */}
                  <Paper sx={{ 
                    p: { xs: 2, sm: 3, md: 4 }, 
                    borderRadius: { xs: "6px", sm: "8px" }, 
                    boxShadow: { xs: "none", sm: "0 1px 3px rgba(0,0,0,0.1)" }
                  }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: { xs: 1.5, sm: 2 } }}>
                      <Typography variant="h6" sx={{ 
                        fontWeight: 600, 
                        color: "#ff2d55",
                        fontSize: { xs: "1rem", sm: "1.125rem", md: "1.25rem" },
                        lineHeight: 1.3,
                      }}>
                        Facilities and Services
                      </Typography>
                      <IconButton size="small" onClick={() => handleOpenModal("array", "facilities")}> <Add /> </IconButton>
                    </Box>

                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: { xs: 0.5, sm: 1 } }}>
                      {Array.isArray(restaurant.facilities) && restaurant.facilities.map((facility, idx) => (
                        <Chip
                          key={idx}
                          icon={
                            idx === 0 ? (
                              <AcUnit sx={{ color: "white !important", fontSize: { xs: "14px", sm: "16px" } }} />
                            ) : idx === 1 ? (
                              <RestaurantIcon sx={{ color: "white !important", fontSize: { xs: "14px", sm: "16px" } }} />
                            ) : (
                              <ChildCare sx={{ color: "white !important", fontSize: { xs: "14px", sm: "16px" } }} />
                            )
                          }
                          label={facility}
                          sx={{
                            bgcolor: "#ff2d55",
                            color: "white",
                            borderRadius: { xs: "3px", sm: "4px" },
                            height: { xs: "28px", sm: "32px" },
                            fontSize: { xs: "11px", sm: "12px", md: "13px" },
                            fontWeight: 400,
                            "& .MuiChip-label": {
                              px: { xs: 1, sm: 1.5 },
                            },
                            "& .MuiChip-icon": {
                              color: "white",
                            },
                          }}
                        />
                      ))}
                    </Box>
                  </Paper>

                  {/* Payment Options Card */}
                  <Paper sx={{ 
                    p: { xs: 2, sm: 3, md: 4 }, 
                    borderRadius: { xs: "6px", sm: "8px" }, 
                    boxShadow: { xs: "none", sm: "0 1px 3px rgba(0,0,0,0.1)" }
                  }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: { xs: 1.5, sm: 2 } }}>
                      <Typography variant="h6" sx={{ 
                        fontWeight: 600, 
                        color: "#ff2d55",
                        fontSize: { xs: "1rem", sm: "1.125rem", md: "1.25rem" },
                        lineHeight: 1.3,
                      }}>
                        Payment Options
                      </Typography>
                      <IconButton size="small" onClick={() => handleOpenModal("array", "paymentOptions")}> <Add /> </IconButton>
                    </Box>

                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: { xs: 0.5, sm: 1 } }}>
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
                  <Paper sx={{ 
                    p: { xs: 2, sm: 3, md: 4 }, 
                    borderRadius: { xs: "6px", sm: "8px" }, 
                    boxShadow: { xs: "none", sm: "0 1px 3px rgba(0,0,0,0.1)" }
                  }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: { xs: 1.5, sm: 2 } }}>
                      <Typography variant="h6" sx={{ 
                        fontWeight: 600, 
                        color: "#ff2d55",
                        fontSize: { xs: "1rem", sm: "1.125rem", md: "1.25rem" },
                        lineHeight: 1.3,
                      }}>
                        Social Media
                      </Typography>
                      <IconButton size="small" onClick={() => handleOpenModal("social", "websiteUrl")}> <Add /> </IconButton>
                    </Box>

                    <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          placeholder="Enter Website Url (Optional)"
                          value={restaurant.websiteUrl || ""}
                          onChange={(e) => handleInputChange("websiteUrl", e.target.value)}
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
                          onChange={(e) => handleInputChange("facebookUrl", e.target.value)}
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
                          onChange={(e) => handleInputChange("instagramUrl", e.target.value)}
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
                          onChange={(e) => handleInputChange("tiktokUrl", e.target.value)}
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

