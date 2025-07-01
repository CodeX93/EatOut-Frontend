"use client"

import { useState, useEffect, Suspense } from "react"
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
} from "@mui/icons-material"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import SideNavbar from "../../../components/SideNavbar"
import { doc, getDoc, collection, getDocs, deleteDoc } from "firebase/firestore"
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

function DeletePageContent({ restaurantId = "1" }) {
  const [restaurant, setRestaurant] = useState(null)
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
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

  const handleDeleteClick = () => {
    setShowModal(true)
  }

  const handleModalDelete = async () => {
    setShowModal(false)
    setLoading(true)
    try {
      // Delete all menuItems in the subcollection
      const docRef = doc(db, "registeredRestaurants", restaurantId)
      const menuItemsSnapshot = await getDocs(collection(docRef, "menuItems"))
      const deletePromises = []
      menuItemsSnapshot.forEach((itemDoc) => {
        deletePromises.push(deleteDoc(itemDoc.ref))
      })
      await Promise.all(deletePromises)
      // Delete the restaurant document
      await deleteDoc(docRef)
      setShowSuccess(true)
      setRestaurant(null)
      setMenuItems([])
    } catch (error) {
      console.error("Error deleting restaurant:", error)
      // Optionally show an error message
    } finally {
      setLoading(false)
    }
  }

  const handleModalDiscard = () => {
    setShowModal(false)
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
              Delete Restaurant
            </Typography>

            {/* Restaurant Details Card - Full Width */}
            <Paper sx={{ p: 4, mb: 3, borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: "#ff2d55", mb: 3 }}>
                Restaurant Details
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {/* All fields should be disabled here */}
                {/* First Row - Name and Cuisines */}
                <Box sx={{ display: "flex", gap: 3 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: "#000000" }}>
                      First Name
                    </Typography>
                    <TextField
                      fullWidth
                      value={restaurant.restaurantName || ""}
                      disabled
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
                          disabled
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
                      <IconButton size="small" sx={{ color: "#8a8a8f", ml: "auto" }} disabled>
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
                      disabled
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
                      disabled
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
                      disabled
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
                    disabled
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
                            value={restaurant.openingDays?.start || ""}
                            disabled
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
                            value={restaurant.openingDays?.end || ""}
                            disabled
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
                            value={restaurant.openingHours?.start || ""}
                            disabled
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
                            value={restaurant.openingHours?.end || ""}
                            disabled
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
                            value={restaurant.closingHours?.start || ""}
                            disabled
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
                            value={restaurant.closingHours?.end || ""}
                            disabled
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
                            value={restaurant.priceRange || ""}
                            disabled
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
                          disabled
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
                        disabled
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
                      {/* Add button should also be disabled or removed */}
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<Add sx={{ fontSize: 16 }} />}
                        disabled
                        sx={{
                          bgcolor: "#ff2d55",
                          color: "white",
                          minWidth: "unset",
                          height: 28,
                          width: 28,
                          padding: 0,
                          borderRadius: "4px",
                          "& .MuiButton-startIcon": {
                            margin: 0,
                          },
                          "&:hover": { bgcolor: "#e6254d" },
                        }}
                      />
                    </Box>

                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {restaurant.facilities.map((facility, index) => (
                        <Chip
                          key={index}
                          icon={
                            index === 0 ? (
                              <AcUnit sx={{ color: "white !important", fontSize: "16px" }} />
                            ) : index === 1 ? (
                              <RestaurantIcon sx={{ color: "white !important", fontSize: "16px" }} />
                            ) : (
                              <ChildCare sx={{ color: "white !important", fontSize: "16px" }} />
                            )
                          }
                          label={facility}
                          disabled
                          sx={{
                            bgcolor: "#efeff4",
                            color: "#333333",
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
                      {/* Add button should also be disabled or removed */}
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<Add sx={{ fontSize: 16 }} />}
                        disabled
                        sx={{
                          bgcolor: "#ff2d55",
                          color: "white",
                          minWidth: "unset",
                          height: 28,
                          width: 28,
                          padding: 0,
                          borderRadius: "4px",
                          "& .MuiButton-startIcon": {
                            margin: 0,
                          },
                          "&:hover": { bgcolor: "#e6254d" },
                        }}
                      />
                    </Box>

                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {restaurant.paymentOptions.map((option, index) => (
                        <Chip
                          key={index}
                          icon={
                            index === 0 ? (
                              <AttachMoney sx={{ color: "white !important", fontSize: "16px" }} />
                            ) : (
                              <AccountBalanceWallet sx={{ color: "white !important", fontSize: "16px" }} />
                            )
                          }
                          label={option}
                          disabled
                          sx={{
                            bgcolor: "#efeff4",
                            color: "#333333",
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
                      {/* Add button should also be disabled or removed */}
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<Add sx={{ fontSize: 16 }} />}
                        disabled
                        sx={{
                          bgcolor: "#ff2d55",
                          color: "white",
                          minWidth: "unset",
                          height: 28,
                          width: 28,
                          padding: 0,
                          borderRadius: "4px",
                          "& .MuiButton-startIcon": {
                            margin: 0,
                          },
                          "&:hover": { bgcolor: "#e6254d" },
                        }}
                      />
                    </Box>

                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          placeholder="Enter Website Url (Optional)"
                          value={restaurant.websiteUrl || ""}
                          disabled
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
                          disabled
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
                          disabled
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
                          disabled
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

            {/* Delete Button */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
              <Button
                variant="contained"
                onClick={handleDeleteClick}
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
                Delete
              </Button>
            </Box>
          </Box>

          {/* Delete Confirmation Modal */}
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
                Delete Restaurant
              </Typography>
              <Typography variant="body1" sx={{ color: "#8a8a8f", mb: 4, lineHeight: 1.5 }}>
                Are you sure you want to delete this restaurant? This action cannot be undone.
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
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleModalDelete}
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
                  Delete
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
              Restaurant deleted successfully!
            </Alert>
          </Snackbar>
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default function DeletePage(props) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DeletePageContent {...props} />
    </Suspense>
  )
}
