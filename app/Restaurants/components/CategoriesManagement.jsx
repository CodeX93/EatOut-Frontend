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
  Grid,
  Checkbox,
  FormControlLabel,
  Card,
  CardContent,
  Chip,
  InputAdornment,
} from "@mui/material"
import { collection, getDocs, doc, setDoc, serverTimestamp } from "firebase/firestore"
import { db } from "../../../firebaseConfig"
import { Search } from "@mui/icons-material"

const CATEGORIES = [
  { id: "newRecommended", name: "New & Recommended", maxRestaurants: 25 },
  { id: "bestDiscounts", name: "Best Discounts & Deals", maxRestaurants: 25 },
  { id: "trendingNow", name: "Trending Now", maxRestaurants: 25 },
]

export default function CategoriesManagement({ restaurantsData = [] }) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  
  // State for selected restaurants per category
  const [selectedRestaurants, setSelectedRestaurants] = useState({
    newRecommended: [],
    bestDiscounts: [],
    trendingNow: [],
  })

  // Transform restaurantsData to match the format needed
  const restaurants = useMemo(() => {
    return restaurantsData.map((r) => ({
      id: r.id,
      restaurantId: r.id,
      name: r.name || "Unknown Restaurant",
      email: r.email || "",
      location: r.location || "",
      phone: r.phone || "",
      cuisines: Array.isArray(r.cuisines) ? r.cuisines : [],
    }))
  }, [restaurantsData])

  // Load existing category selections
  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true)
      try {
        const categoriesSnap = await getDocs(collection(db, "restaurantCategories"))
        if (!categoriesSnap.empty) {
          const categoriesData = {}
          categoriesSnap.forEach((doc) => {
            categoriesData[doc.id] = doc.data()
          })

          setSelectedRestaurants({
            newRecommended: categoriesData.newRecommended?.restaurantIds || [],
            bestDiscounts: categoriesData.bestDiscounts?.restaurantIds || [],
            trendingNow: categoriesData.trendingNow?.restaurantIds || [],
          })
        }
      } catch (e) {
        console.error("Error loading categories:", e)
        setError("Failed to load categories")
      } finally {
        setLoading(false)
      }
    }
    loadCategories()
  }, [])

  // Filter restaurants based on search term
  const filteredRestaurants = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return restaurants

    return restaurants.filter((restaurant) => {
      return (
        restaurant.name.toLowerCase().includes(term) ||
        restaurant.email.toLowerCase().includes(term) ||
        restaurant.location.toLowerCase().includes(term) ||
        restaurant.cuisines.some((c) => c.toLowerCase().includes(term))
      )
    })
  }, [restaurants, searchTerm])

  const handleToggleRestaurant = (categoryId, restaurantId) => {
    setSelectedRestaurants((prev) => {
      const currentSelection = prev[categoryId] || []
      const category = CATEGORIES.find((c) => c.id === categoryId)
      const maxRestaurants = category?.maxRestaurants || 25

      // Check if already selected
      if (currentSelection.includes(restaurantId)) {
        // Remove from selection
        return {
          ...prev,
          [categoryId]: currentSelection.filter((id) => id !== restaurantId),
        }
      } else {
        // Add to selection if under limit
        if (currentSelection.length >= maxRestaurants) {
          setError(`Maximum ${maxRestaurants} restaurants allowed for ${category?.name}`)
          setTimeout(() => setError(""), 3000)
          return prev
        }
        return {
          ...prev,
          [categoryId]: [...currentSelection, restaurantId],
        }
      }
    })
  }

  const handleSelectAll = (categoryId) => {
    const category = CATEGORIES.find((c) => c.id === categoryId)
    const maxRestaurants = category?.maxRestaurants || 25
    const currentSelection = selectedRestaurants[categoryId] || []
    
    if (currentSelection.length === filteredRestaurants.length && 
        currentSelection.length <= maxRestaurants) {
      // Deselect all
      setSelectedRestaurants((prev) => ({
        ...prev,
        [categoryId]: [],
      }))
    } else {
      // Select all (up to max)
      const toSelect = filteredRestaurants
        .slice(0, maxRestaurants)
        .map((r) => r.id)
        .filter((id) => !currentSelection.includes(id))
      
      if (currentSelection.length + toSelect.length > maxRestaurants) {
        setError(`Maximum ${maxRestaurants} restaurants allowed for ${category?.name}`)
        setTimeout(() => setError(""), 3000)
        return
      }

      setSelectedRestaurants((prev) => ({
        ...prev,
        [categoryId]: [...currentSelection, ...toSelect],
      }))
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError("")

    try {
      // Save each category
      for (const category of CATEGORIES) {
        const categoryData = {
          name: category.name,
          restaurantIds: selectedRestaurants[category.id] || [],
          maxRestaurants: category.maxRestaurants,
          updatedAt: serverTimestamp(),
        }

        await setDoc(doc(db, "restaurantCategories", category.id), {
          ...categoryData,
          createdAt: serverTimestamp(),
        }, { merge: true })
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (e) {
      console.error("Error saving categories:", e)
      setError("Failed to save categories: " + e.message)
    } finally {
      setSaving(false)
    }
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
      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
          mb: 2,
          color: "#333",
        }}
      >
        Categories Management
      </Typography>

      <Typography
        variant="body2"
        sx={{
          mb: 3,
          color: "text.secondary",
        }}
      >
        Select up to 25 restaurants for each category. These categories will be displayed on the main page with left-to-right scrolling.
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
          placeholder="Search restaurants by name, email, location, or cuisine..."
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

      {/* Category Sections */}
      <Grid container spacing={2}>
        {CATEGORIES.map((category) => {
          const selectedCount = selectedRestaurants[category.id]?.length || 0
          const isAtLimit = selectedCount >= category.maxRestaurants

          return (
            <Grid item xs={12} key={category.id}>
              <Card
                elevation={1}
                sx={{
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    bgcolor: "#da1818",
                    color: "white",
                    p: 1.5,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {category.name}
                  </Typography>
                  <Chip
                    label={`${selectedCount}/${category.maxRestaurants} selected`}
                    size="small"
                    sx={{
                      bgcolor: "rgba(255,255,255,0.2)",
                      color: "white",
                      fontWeight: 600,
                    }}
                    color={isAtLimit ? "error" : "default"}
                  />
                </Box>

                <CardContent>
                  <Box sx={{ mb: 2, display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleSelectAll(category.id)}
                      disabled={filteredRestaurants.length === 0}
                    >
                      {selectedCount === filteredRestaurants.length && selectedCount > 0 && selectedCount <= category.maxRestaurants
                        ? "Deselect All"
                        : "Select All"}
                    </Button>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                      {filteredRestaurants.length} restaurant(s) found
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      maxHeight: 300,
                      overflowY: "auto",
                      border: "1px solid #e0e0e0",
                      borderRadius: 1,
                      p: 1,
                    }}
                  >
                    {filteredRestaurants.length === 0 ? (
                      <Typography variant="body2" sx={{ p: 2, textAlign: "center", color: "text.secondary" }}>
                        No restaurants found
                      </Typography>
                    ) : (
                      filteredRestaurants.map((restaurant) => {
                        const isSelected = selectedRestaurants[category.id]?.includes(restaurant.id)
                        const isDisabled = !isSelected && isAtLimit

                        return (
                          <Box
                            key={restaurant.id}
                            sx={{
                              p: 1,
                              mb: 0.5,
                              borderRadius: 1,
                              bgcolor: isSelected ? "#e3f2fd" : "transparent",
                              border: isSelected ? "1px solid #1976d2" : "1px solid transparent",
                              "&:hover": {
                                bgcolor: isSelected ? "#e3f2fd" : "#f5f5f5",
                              },
                              opacity: isDisabled ? 0.5 : 1,
                              cursor: isDisabled ? "not-allowed" : "pointer",
                            }}
                            onClick={() => !isDisabled && handleToggleRestaurant(category.id, restaurant.id)}
                          >
                            <FormControlLabel
                              control={
                                <Checkbox
                                  size="small"
                                  checked={isSelected}
                                  disabled={isDisabled}
                                  onChange={() => handleToggleRestaurant(category.id, restaurant.id)}
                                />
                              }
                              label={
                                <Box>
                                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    {restaurant.name}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                                    {restaurant.location} • {restaurant.email}
                                    {restaurant.cuisines.length > 0 && ` • ${restaurant.cuisines.join(", ")}`}
                                  </Typography>
                                </Box>
                              }
                              sx={{ m: 0 }}
                            />
                          </Box>
                        )
                      })
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )
        })}
      </Grid>

      {/* Save Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
          sx={{
            bgcolor: "#da1818",
            minWidth: 150,
            "&:hover": {
              bgcolor: "#c41515",
            },
          }}
        >
          {saving ? <CircularProgress size={24} color="inherit" /> : "Save Categories"}
        </Button>
      </Box>

      {/* Summary */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mt: 3,
          bgcolor: "#f5f5f5",
          borderRadius: 2,
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          Selection Summary:
        </Typography>
        {CATEGORIES.map((category) => (
          <Typography key={category.id} variant="body2" sx={{ mb: 0.5 }}>
            • {category.name}: {selectedRestaurants[category.id]?.length || 0} restaurant(s) selected
          </Typography>
        ))}
      </Paper>

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
          Categories saved successfully!
        </Alert>
      </Snackbar>
    </Box>
  )
}

