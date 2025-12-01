"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Chip,
} from "@mui/material"
import { collection, getDocs, doc, updateDoc, getDoc, serverTimestamp } from "firebase/firestore"
import { db } from "../../../firebaseConfig"
import { Search, Edit } from "@mui/icons-material"

const DEFAULT_MAX_IMAGES = 5
const DEFAULT_MAX_DISHES = 5
const MAX_IMAGES_LIMIT = 25
const MAX_DISHES_LIMIT = 15

export default function MerchantPermissions({ restaurantsData = [] }) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRestaurants, setSelectedRestaurants] = useState([])
  const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false)
  const [permissions, setPermissions] = useState({
    maxImages: DEFAULT_MAX_IMAGES,
    maxDishes: DEFAULT_MAX_DISHES,
  })
  const [restaurantPermissions, setRestaurantPermissions] = useState({})

  // Load existing permissions from registeredRestaurants collection
  useEffect(() => {
    const loadPermissions = async () => {
      setLoading(true)
      try {
        const restaurantsSnap = await getDocs(collection(db, "registeredRestaurants"))
        const permissionsMap = {}
        
        restaurantsSnap.forEach((doc) => {
          const data = doc.data()
          permissionsMap[doc.id] = {
            maxImages: data.maxImages || DEFAULT_MAX_IMAGES,
            maxDishes: data.maxDishes || DEFAULT_MAX_DISHES,
          }
        })
        
        setRestaurantPermissions(permissionsMap)
      } catch (e) {
        console.error("Error loading permissions:", e)
        setError("Failed to load permissions")
      } finally {
        setLoading(false)
      }
    }
    loadPermissions()
  }, [])

  // Get permission for a restaurant (default if not set)
  const getRestaurantPermission = (restaurantId) => {
    return restaurantPermissions[restaurantId] || {
      maxImages: DEFAULT_MAX_IMAGES,
      maxDishes: DEFAULT_MAX_DISHES,
    }
  }

  // Filter restaurants based on search term
  const filteredRestaurants = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return restaurantsData

    return restaurantsData.filter((restaurant) => {
      return (
        restaurant.name?.toLowerCase().includes(term) ||
        restaurant.email?.toLowerCase().includes(term) ||
        restaurant.location?.toLowerCase().includes(term)
      )
    })
  }, [restaurantsData, searchTerm])

  const handleToggleRestaurant = (restaurantId) => {
    setSelectedRestaurants((prev) => {
      if (prev.includes(restaurantId)) {
        return prev.filter((id) => id !== restaurantId)
      } else {
        return [...prev, restaurantId]
      }
    })
  }

  const handleSelectAll = () => {
    if (selectedRestaurants.length === filteredRestaurants.length) {
      setSelectedRestaurants([])
    } else {
      setSelectedRestaurants(filteredRestaurants.map((r) => r.id))
    }
  }

  const handleOpenPermissionsDialog = () => {
    if (selectedRestaurants.length === 0) {
      setError("Please select at least one restaurant")
      setTimeout(() => setError(""), 3000)
      return
    }

    // If only one restaurant selected, load its current permissions
    if (selectedRestaurants.length === 1) {
      const restaurantId = selectedRestaurants[0]
      const currentPerms = getRestaurantPermission(restaurantId)
      setPermissions({
        maxImages: currentPerms.maxImages,
        maxDishes: currentPerms.maxDishes,
      })
    } else {
      // For multiple, use defaults
      setPermissions({
        maxImages: DEFAULT_MAX_IMAGES,
        maxDishes: DEFAULT_MAX_DISHES,
      })
    }

    setPermissionsDialogOpen(true)
  }

  const handleClosePermissionsDialog = () => {
    setPermissionsDialogOpen(false)
    setPermissions({
      maxImages: DEFAULT_MAX_IMAGES,
      maxDishes: DEFAULT_MAX_DISHES,
    })
  }

  const handleSavePermissions = async () => {
    // Validate
    if (permissions.maxImages < 1 || permissions.maxImages > MAX_IMAGES_LIMIT) {
      setError(`Max Images must be between 1 and ${MAX_IMAGES_LIMIT}`)
      return
    }
    if (permissions.maxDishes < 1 || permissions.maxDishes > MAX_DISHES_LIMIT) {
      setError(`Max Dishes must be between 1 and ${MAX_DISHES_LIMIT}`)
      return
    }

    setSaving(true)
    setError("")

    try {
      // Save permissions for each selected restaurant by updating registeredRestaurants documents
      const savePromises = selectedRestaurants.map(async (restaurantId) => {
        const permissionData = {
          maxImages: Number(permissions.maxImages),
          maxDishes: Number(permissions.maxDishes),
          updatedAt: serverTimestamp(),
        }

        // Update the existing restaurant document
        const restaurantRef = doc(db, "registeredRestaurants", restaurantId)
        await updateDoc(restaurantRef, permissionData)
      })

      await Promise.all(savePromises)

      // Reload permissions from registeredRestaurants
      const restaurantsSnap = await getDocs(collection(db, "registeredRestaurants"))
      const permissionsMap = {}
      restaurantsSnap.forEach((doc) => {
        const data = doc.data()
        permissionsMap[doc.id] = {
          maxImages: data.maxImages || DEFAULT_MAX_IMAGES,
          maxDishes: data.maxDishes || DEFAULT_MAX_DISHES,
        }
      })
      setRestaurantPermissions(permissionsMap)

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      setSelectedRestaurants([])
      handleClosePermissionsDialog()
    } catch (e) {
      console.error("Error saving permissions:", e)
      setError("Failed to save permissions: " + e.message)
    } finally {
      setSaving(false)
    }
  }

  const handleEditSingleRestaurant = (restaurantId) => {
    setSelectedRestaurants([restaurantId])
    const currentPerms = getRestaurantPermission(restaurantId)
    setPermissions({
      maxImages: currentPerms.maxImages,
      maxDishes: currentPerms.maxDishes,
    })
    setPermissionsDialogOpen(true)
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: "#333",
          }}
        >
          Merchant Permissions Management
        </Typography>
        <Button
          variant="contained"
          onClick={handleOpenPermissionsDialog}
          disabled={selectedRestaurants.length === 0}
          sx={{
            bgcolor: "#da1818",
            "&:hover": {
              bgcolor: "#c41515",
            },
          }}
        >
          Set Permissions ({selectedRestaurants.length} selected)
        </Button>
      </Box>

      <Typography
        variant="body2"
        sx={{
          mb: 3,
          color: "text.secondary",
        }}
      >
        Manage merchant permissions for listing images and specialty dishes. By default, all merchants can upload up to 5 photos and list up to 5 dishes.
      </Typography>

      {/* Search Bar */}
      <Paper
        elevation={1}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 2,
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Search restaurants by name, email, or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {/* Restaurants Table */}
      <TableContainer component={Paper} elevation={1}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    selectedRestaurants.length > 0 &&
                    selectedRestaurants.length < filteredRestaurants.length
                  }
                  checked={
                    filteredRestaurants.length > 0 &&
                    selectedRestaurants.length === filteredRestaurants.length
                  }
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Restaurant Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Location</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Max Images</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Max Dishes</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRestaurants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    No restaurants found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredRestaurants.map((restaurant) => {
                const isSelected = selectedRestaurants.includes(restaurant.id)
                const perms = getRestaurantPermission(restaurant.id)
                const isDefault =
                  perms.maxImages === DEFAULT_MAX_IMAGES &&
                  perms.maxDishes === DEFAULT_MAX_DISHES

                return (
                  <TableRow
                    key={restaurant.id}
                    sx={{
                      bgcolor: isSelected ? "#e3f2fd" : "transparent",
                      "&:hover": {
                        bgcolor: isSelected ? "#e3f2fd" : "#f5f5f5",
                      },
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={() => handleToggleRestaurant(restaurant.id)}
                      />
                    </TableCell>
                    <TableCell>{restaurant.name || "-"}</TableCell>
                    <TableCell>{restaurant.email || "-"}</TableCell>
                    <TableCell>{restaurant.location || "-"}</TableCell>
                    <TableCell>
                      <Chip
                        label={perms.maxImages}
                        size="small"
                        color={isDefault ? "default" : "primary"}
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={perms.maxDishes}
                        size="small"
                        color={isDefault ? "default" : "primary"}
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        startIcon={<Edit />}
                        onClick={() => handleEditSingleRestaurant(restaurant.id)}
                        sx={{
                          color: "#da1818",
                          textTransform: "none",
                        }}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Permissions Dialog */}
      <Dialog
        open={permissionsDialogOpen}
        onClose={handleClosePermissionsDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Set Permissions
          {selectedRestaurants.length === 1 && (
            <Typography variant="caption" sx={{ display: "block", mt: 1, color: "text.secondary" }}>
              {filteredRestaurants.find((r) => r.id === selectedRestaurants[0])?.name}
            </Typography>
          )}
          {selectedRestaurants.length > 1 && (
            <Typography variant="caption" sx={{ display: "block", mt: 1, color: "text.secondary" }}>
              {selectedRestaurants.length} restaurants selected
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 1 }}>
            <TextField
              fullWidth
              label="Number of Listed Images"
              type="number"
              value={permissions.maxImages}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 0
                if (value >= 1 && value <= MAX_IMAGES_LIMIT) {
                  setPermissions((prev) => ({ ...prev, maxImages: value }))
                }
              }}
              inputProps={{
                min: 1,
                max: MAX_IMAGES_LIMIT,
              }}
              helperText={`Maximum ${MAX_IMAGES_LIMIT} images allowed. Default: ${DEFAULT_MAX_IMAGES}`}
            />
            <TextField
              fullWidth
              label="Number of Specialty Dishes"
              type="number"
              value={permissions.maxDishes}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 0
                if (value >= 1 && value <= MAX_DISHES_LIMIT) {
                  setPermissions((prev) => ({ ...prev, maxDishes: value }))
                }
              }}
              inputProps={{
                min: 1,
                max: MAX_DISHES_LIMIT,
              }}
              helperText={`Maximum ${MAX_DISHES_LIMIT} dishes allowed. Default: ${DEFAULT_MAX_DISHES}`}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePermissionsDialog} disabled={saving}>
            Cancel
          </Button>
          <Button
            onClick={handleSavePermissions}
            variant="contained"
            disabled={saving}
            sx={{
              bgcolor: "#da1818",
              "&:hover": {
                bgcolor: "#c41515",
              },
            }}
          >
            {saving ? <CircularProgress size={24} color="inherit" /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error/Success Snackbars */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={() => setError("")} severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: "100%" }}>
          Permissions saved successfully!
        </Alert>
      </Snackbar>
    </Box>
  )
}

