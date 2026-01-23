"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  CircularProgress,
  Alert,
  Snackbar,
  Grid,
  Card,
  CardMedia,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Autocomplete,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  RadioGroup,
  Radio,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Checkbox,
  Divider,
} from "@mui/material"
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  serverTimestamp,
  addDoc,
} from "firebase/firestore"
import { db } from "../../firebaseConfig"
import AppLayout from "../components/AppLayout"
import { Delete, CloudUpload, Add, Edit } from "@mui/icons-material"

const COLOR_OPTIONS = [
  { label: "Red", value: "#da1818" },
  { label: "Blue", value: "#1976d2" },
  { label: "Green", value: "#2e7d32" },
  { label: "Orange", value: "#ed6c02" },
  { label: "Purple", value: "#9c27b0" },
  { label: "Black", value: "#000000" },
  { label: "White", value: "#ffffff" },
  { label: "Gray", value: "#757575" },
]

const BANNER_TYPES = ["External Link", "Specific Page", "Specific Restaurant"]
const PAGE_OPTIONS = ["Medal", "Referral", "Search"]

// Cloudinary config (unsigned upload)
const CLOUDINARY_UPLOAD_PRESET = "eat_app_unsigned"
const CLOUDINARY_CLOUD_NAME = "di14lhy0f"

export default function BannerAdsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [banners, setBanners] = useState([])
  const [restaurants, setRestaurants] = useState([])
  const [openDialog, setOpenDialog] = useState(false)
  const [editingBanner, setEditingBanner] = useState(null)

  // Form state for new/edit banner
  const [formData, setFormData] = useState({
    firstLineTitle: "",
    secondLineDescription: "",
    thirdLineTitle: "",
    fourthLineDescription: "",
    color: "#da1818",
    textColor: "#ffffff",
    backgroundImageUrl: "",
    enabled: false,
    imageSource: "", // "template" or "image"
    bannerType: "", // "External Link", "Specific Page", "Specific Restaurant"
    externalLink: "",
    pageType: "", // "Medal", "Referral", "Search"
    selectedRestaurants: [], // For Search page type (multiple)
    selectedRestaurant: null, // For Specific Restaurant type (single)
  })

  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState("")
  const [restaurantSearchTerm, setRestaurantSearchTerm] = useState("")

  // Load existing banners and restaurants
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        // Load banners
        const bannersSnap = await getDocs(collection(db, "bannerAds"))
        const bannersList = []
        bannersSnap.forEach((doc) => {
          bannersList.push({ id: doc.id, ...doc.data() })
        })
        setBanners(bannersList)

        // Load restaurants
        const restaurantsSnap = await getDocs(collection(db, "registeredRestaurants"))
        const restaurantsList = []
        restaurantsSnap.forEach((doc) => {
          const data = doc.data() || {}
          restaurantsList.push({
            id: doc.id,
            name: data.restaurantName || data.name || "-",
            email: data.email || doc.id,
            location: data.city || data.location || "-",
          })
        })
        setRestaurants(restaurantsList)
      } catch (e) {
        console.error("Error loading data:", e)
        setError("Failed to load data")
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Filter restaurants based on search
  const filteredRestaurants = useMemo(() => {
    const term = restaurantSearchTerm.trim().toLowerCase()
    if (!term) return restaurants
    return restaurants.filter(
      (r) =>
        r.name?.toLowerCase().includes(term) ||
        r.email?.toLowerCase().includes(term) ||
        r.location?.toLowerCase().includes(term)
    )
  }, [restaurants, restaurantSearchTerm])

  const handleInputChange = (field, value) => {
    // Apply character limits
    let maxLength = 0
    switch (field) {
      case "firstLineTitle":
        maxLength = 17
        break
      case "secondLineDescription":
        maxLength = 30
        break
      case "thirdLineTitle":
        maxLength = 13
        break
      case "fourthLineDescription":
        maxLength = 25
        break
      default:
        maxLength = Infinity
    }

    if (maxLength > 0 && value.length > maxLength) {
      return // Don't update if exceeds limit
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file")
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB")
        return
      }

      setImageFile(file)
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageUpload = async () => {
    if (!imageFile) {
      setError("Please select an image file")
      return
    }

    setUploading(true)
    setError("")

    try {
      const formDataToUpload = new FormData()
      formDataToUpload.append("file", imageFile)
      formDataToUpload.append("upload_preset", CLOUDINARY_UPLOAD_PRESET)

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formDataToUpload,
        }
      )

      if (!response.ok) {
        throw new Error("Cloudinary upload failed")
      }

      const data = await response.json()
      const downloadURL = data.secure_url

      setFormData((prev) => ({
        ...prev,
        backgroundImageUrl: downloadURL,
      }))

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (e) {
      console.error("Error uploading image:", e)
      setError("Failed to upload image: " + e.message)
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview("")
    setFormData((prev) => ({
      ...prev,
      backgroundImageUrl: "",
    }))
  }

  const handleOpenAddDialog = () => {
    setEditingBanner(null)
    setFormData({
      firstLineTitle: "",
      secondLineDescription: "",
      thirdLineTitle: "",
      fourthLineDescription: "",
      color: "#da1818",
      textColor: "#ffffff",
      backgroundImageUrl: "",
      enabled: false,
      imageSource: "",
      bannerType: "",
      externalLink: "",
      pageType: "",
      selectedRestaurants: [],
      selectedRestaurant: null,
    })
    setImageFile(null)
    setImagePreview("")
    setRestaurantSearchTerm("")
    setOpenDialog(true)
  }

  const handleOpenEditDialog = (banner) => {
    setEditingBanner(banner)
    setFormData({
      firstLineTitle: banner.firstLineTitle || "",
      secondLineDescription: banner.secondLineDescription || "",
      thirdLineTitle: banner.thirdLineTitle || "",
      fourthLineDescription: banner.fourthLineDescription || "",
      color: banner.color || "#da1818",
      textColor: banner.textColor || "#ffffff",
      backgroundImageUrl: banner.backgroundImageUrl || "",
      enabled: banner.enabled !== undefined ? banner.enabled : false,
      imageSource: banner.imageSource || "",
      bannerType: banner.bannerType || "",
      externalLink: banner.externalLink || "",
      pageType: banner.pageType || "",
      selectedRestaurants: banner.selectedRestaurants || [],
      selectedRestaurant: banner.selectedRestaurant || null,
    })
    if (banner.backgroundImageUrl) {
      setImagePreview(banner.backgroundImageUrl)
    }
    setImageFile(null)
    setRestaurantSearchTerm("")
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingBanner(null)
  }

  const handleToggleRestaurant = (restaurantId, restaurantEmail) => {
    if (formData.bannerType === "Specific Restaurant") {
      // Single selection
      setFormData((prev) => ({
        ...prev,
        selectedRestaurant: prev.selectedRestaurant?.id === restaurantId ? null : { id: restaurantId, email: restaurantEmail },
      }))
    } else if (formData.bannerType === "Specific Page" && formData.pageType === "Search") {
      // Multiple selection
      setFormData((prev) => {
        const existing = prev.selectedRestaurants.find((r) => r.id === restaurantId)
        if (existing) {
          return {
            ...prev,
            selectedRestaurants: prev.selectedRestaurants.filter((r) => r.id !== restaurantId),
          }
        } else {
          return {
            ...prev,
            selectedRestaurants: [...prev.selectedRestaurants, { id: restaurantId, email: restaurantEmail }],
          }
        }
      })
    }
  }

  const handleRemoveRestaurant = (restaurantId) => {
    if (formData.bannerType === "Specific Page" && formData.pageType === "Search") {
      setFormData((prev) => ({
        ...prev,
        selectedRestaurants: prev.selectedRestaurants.filter((r) => r.id !== restaurantId),
      }))
    }
  }

  const handleSave = async () => {
    // Validation
    if (!formData.firstLineTitle.trim()) {
      setError("Please enter the 1st Line (Title)")
      return
    }
    if (!formData.secondLineDescription.trim()) {
      setError("Please enter the 2nd Line (Description)")
      return
    }
    if (!formData.thirdLineTitle.trim()) {
      setError("Please enter the 3rd Line (Title)")
      return
    }
    if (!formData.fourthLineDescription.trim()) {
      setError("Please enter the 4th Line (Description)")
      return
    }
    if (!formData.imageSource) {
      setError("Please select image source (Template or Image)")
      return
    }
    if (!formData.backgroundImageUrl) {
      setError("Please upload a background image")
      return
    }
    if (!formData.bannerType) {
      setError("Please select banner type")
      return
    }
    if (formData.bannerType === "External Link" && !formData.externalLink.trim()) {
      setError("Please enter external link")
      return
    }
    if (formData.bannerType === "Specific Page" && !formData.pageType) {
      setError("Please select page type")
      return
    }
    if (formData.bannerType === "Specific Page" && formData.pageType === "Search" && formData.selectedRestaurants.length === 0) {
      setError("Please select at least one restaurant for Search page")
      return
    }
    if (formData.bannerType === "Specific Restaurant" && !formData.selectedRestaurant) {
      setError("Please select a restaurant")
      return
    }

    setSaving(true)
    setError("")

    try {
      const bannerAdData = {
        firstLineTitle: formData.firstLineTitle.trim(),
        secondLineDescription: formData.secondLineDescription.trim(),
        thirdLineTitle: formData.thirdLineTitle.trim(),
        fourthLineDescription: formData.fourthLineDescription.trim(),
        color: formData.color,
        textColor: formData.textColor,
        backgroundImageUrl: formData.backgroundImageUrl,
        enabled: formData.enabled,
        imageSource: formData.imageSource,
        bannerType: formData.bannerType,
        externalLink: formData.externalLink || "",
        pageType: formData.pageType || "",
        selectedRestaurants: formData.selectedRestaurants || [],
        selectedRestaurant: formData.selectedRestaurant || null,
        updatedAt: serverTimestamp(),
      }

      if (editingBanner) {
        // Update existing banner
        await setDoc(doc(db, "bannerAds", editingBanner.id), {
          ...bannerAdData,
          createdAt: editingBanner.createdAt || serverTimestamp(),
        })
      } else {
        // Create new banner
        await addDoc(collection(db, "bannerAds"), {
          ...bannerAdData,
          createdAt: serverTimestamp(),
        })
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)

      // Reload banners
      const bannersSnap = await getDocs(collection(db, "bannerAds"))
      const bannersList = []
      bannersSnap.forEach((doc) => {
        bannersList.push({ id: doc.id, ...doc.data() })
      })
      setBanners(bannersList)

      handleCloseDialog()
    } catch (e) {
      console.error("Error saving banner ad:", e)
      setError("Failed to save banner ad: " + e.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (bannerId) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) {
      return
    }

    try {
      await deleteDoc(doc(db, "bannerAds", bannerId))
      setBanners((prev) => prev.filter((b) => b.id !== bannerId))
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (e) {
      console.error("Error deleting banner:", e)
      setError("Failed to delete banner: " + e.message)
    }
  }

  if (loading) {
    return (
      <AppLayout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            color: "#333",
            fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
          }}
        >
          Banner Ad Management
        </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleOpenAddDialog}
          sx={{
              bgcolor: "#da1818",
              "&:hover": {
                bgcolor: "#c41515",
              },
            }}
          >
            Add Banner
          </Button>
        </Box>

        {/* Banners List */}
          <Grid container spacing={3}>
          {banners.map((banner) => (
            <Grid item xs={12} md={6} lg={4} key={banner.id}>
              <Card sx={{ position: "relative" }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={banner.backgroundImageUrl}
                  alt="Banner"
                  sx={{ objectFit: "cover" }}
                />
                <Box sx={{ p: 2 }}>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    {banner.firstLineTitle}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, color: "text.secondary" }}>
                    Type: {banner.bannerType}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<Edit />}
                      onClick={() => handleOpenEditDialog(banner)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      startIcon={<Delete />}
                      onClick={() => handleDelete(banner.id)}
                    >
                      Delete
                    </Button>
                  </Box>
                </Box>
                {banner.enabled && (
                  <Chip
                    label="Enabled"
                    color="success"
                    size="small"
                    sx={{ position: "absolute", top: 8, right: 8 }}
                  />
                )}
              </Card>
            </Grid>
          ))}
          {banners.length === 0 && (
            <Grid item xs={12}>
              <Paper sx={{ p: 4, textAlign: "center" }}>
                <Typography variant="body1" color="text.secondary">
                  No banners yet. Click "Add Banner" to create your first banner.
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>

        {/* Add/Edit Banner Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>{editingBanner ? "Edit Banner" : "Add New Banner"}</DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
            {/* Text Fields */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="1st Line (Title)"
                value={formData.firstLineTitle}
                onChange={(e) => handleInputChange("firstLineTitle", e.target.value)}
                helperText={`${formData.firstLineTitle.length}/17 characters`}
                inputProps={{ maxLength: 17 }}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="2nd Line (Description)"
                value={formData.secondLineDescription}
                onChange={(e) => handleInputChange("secondLineDescription", e.target.value)}
                helperText={`${formData.secondLineDescription.length}/30 characters`}
                inputProps={{ maxLength: 30 }}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="3rd Line (Title)"
                value={formData.thirdLineTitle}
                onChange={(e) => handleInputChange("thirdLineTitle", e.target.value)}
                helperText={`${formData.thirdLineTitle.length}/13 characters`}
                inputProps={{ maxLength: 13 }}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="4th Line (Description)"
                value={formData.fourthLineDescription}
                onChange={(e) => handleInputChange("fourthLineDescription", e.target.value)}
                helperText={`${formData.fourthLineDescription.length}/25 characters`}
                inputProps={{ maxLength: 25 }}
                required
              />
            </Grid>

              {/* Image Source Selection */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
                  Add Banner from Template or Image
                </Typography>
                <RadioGroup
                  row
                  value={formData.imageSource}
                  onChange={(e) => handleInputChange("imageSource", e.target.value)}
                >
                  <FormControlLabel value="template" control={<Radio />} label="Template" />
                  <FormControlLabel value="image" control={<Radio />} label="Image" />
                </RadioGroup>
              </Grid>

              {/* Banner Type Selection */}
              {formData.imageSource && (
                <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>Banner Type</InputLabel>
                    <Select
                      value={formData.bannerType}
                      label="Banner Type"
                      onChange={(e) => {
                        handleInputChange("bannerType", e.target.value)
                        // Reset type-specific fields
                        setFormData((prev) => ({
                          ...prev,
                          externalLink: "",
                          pageType: "",
                          selectedRestaurants: [],
                          selectedRestaurant: null,
                        }))
                      }}
                    >
                      {BANNER_TYPES.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}

              {/* External Link Field */}
              {formData.bannerType === "External Link" && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="External Link"
                    value={formData.externalLink}
                    onChange={(e) => handleInputChange("externalLink", e.target.value)}
                    placeholder="https://example.com"
                    required
                  />
                </Grid>
              )}

              {/* Specific Page Options */}
              {formData.bannerType === "Specific Page" && (
                <>
                  <Grid item xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel>Page Type</InputLabel>
                      <Select
                        value={formData.pageType}
                        label="Page Type"
                        onChange={(e) => {
                          handleInputChange("pageType", e.target.value)
                          if (e.target.value !== "Search") {
                            setFormData((prev) => ({
                              ...prev,
                              selectedRestaurants: [],
                            }))
                          }
                        }}
                      >
                        {PAGE_OPTIONS.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Search Page - Multiple Restaurants */}
                  {formData.pageType === "Search" && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
                        Select Restaurants (Multiple)
                      </Typography>
                      <TextField
                        fullWidth
                        label="Search Restaurants"
                        value={restaurantSearchTerm}
                        onChange={(e) => setRestaurantSearchTerm(e.target.value)}
                        sx={{ mb: 2 }}
                      />
                      <Paper sx={{ maxHeight: 300, overflow: "auto" }}>
                        <List dense>
                          {filteredRestaurants.map((restaurant) => (
                            <ListItem key={restaurant.id} disablePadding>
                              <ListItemButton
                                onClick={() => handleToggleRestaurant(restaurant.id, restaurant.email)}
                              >
                                <Checkbox
                                  checked={formData.selectedRestaurants.some((r) => r.id === restaurant.id)}
                                />
                                <ListItemText
                                  primary={restaurant.name}
                                  secondary={`${restaurant.email} • ${restaurant.location}`}
                                />
                              </ListItemButton>
                            </ListItem>
                          ))}
                        </List>
                      </Paper>
                      {formData.selectedRestaurants.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="caption" sx={{ display: "block", mb: 1 }}>
                            Selected Restaurants:
                          </Typography>
                          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                            {formData.selectedRestaurants.map((restaurant) => {
                              const restaurantData = restaurants.find((r) => r.id === restaurant.id)
                              return (
                                <Chip
                                  key={restaurant.id}
                                  label={restaurantData?.name || restaurant.email}
                                  onDelete={() => handleRemoveRestaurant(restaurant.id)}
                                  size="small"
                                />
                              )
                            })}
                          </Box>
                        </Box>
                      )}
                    </Grid>
                  )}
                </>
              )}

              {/* Specific Restaurant - Single Selection */}
              {formData.bannerType === "Specific Restaurant" && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
                    Select Restaurant (Single)
                  </Typography>
                  <TextField
                    fullWidth
                    label="Search Restaurant"
                    value={restaurantSearchTerm}
                    onChange={(e) => setRestaurantSearchTerm(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <Paper sx={{ maxHeight: 300, overflow: "auto" }}>
                    <List dense>
                      {filteredRestaurants.map((restaurant) => (
                        <ListItem key={restaurant.id} disablePadding>
                          <ListItemButton
                            onClick={() => handleToggleRestaurant(restaurant.id, restaurant.email)}
                            selected={formData.selectedRestaurant?.id === restaurant.id}
                          >
                            <Radio checked={formData.selectedRestaurant?.id === restaurant.id} />
                            <ListItemText
                              primary={restaurant.name}
                              secondary={`${restaurant.email} • ${restaurant.location}`}
                            />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                  {formData.selectedRestaurant && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="caption" sx={{ display: "block", mb: 1 }}>
                        Selected Restaurant:
                      </Typography>
                      <Chip
                        label={
                          restaurants.find((r) => r.id === formData.selectedRestaurant.id)?.name ||
                          formData.selectedRestaurant.email
                        }
                        onDelete={() =>
                          setFormData((prev) => ({
                            ...prev,
                            selectedRestaurant: null,
                          }))
                        }
                        color="primary"
                      />
                    </Box>
                  )}
                </Grid>
              )}

              {/* Banner Color Selection */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
                  Banner Color
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                {COLOR_OPTIONS.map((color) => (
                  <Box
                    key={color.value}
                    onClick={() => handleInputChange("color", color.value)}
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: 1,
                      bgcolor: color.value,
                      border: formData.color === color.value ? "3px solid #1976d2" : "2px solid #e0e0e0",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.2s",
                      "&:hover": {
                        transform: "scale(1.1)",
                        boxShadow: 2,
                      },
                    }}
                  >
                    {formData.color === color.value && (
                      <Typography
                        sx={{
                            color: "#fff",
                          fontSize: "0.75rem",
                          fontWeight: "bold",
                        }}
                      >
                        ✓
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
              <Typography variant="caption" sx={{ mt: 1, display: "block", color: "text.secondary" }}>
                Selected: {COLOR_OPTIONS.find((c) => c.value === formData.color)?.label || "Custom"}
              </Typography>
            </Grid>

              {/* Text Color Selection */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
                  Text Color
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                  {COLOR_OPTIONS.map((color) => (
                    <Box
                      key={color.value}
                      onClick={() => handleInputChange("textColor", color.value)}
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: 1,
                        bgcolor: color.value,
                        border: formData.textColor === color.value ? "3px solid #1976d2" : "2px solid #e0e0e0",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s",
                        "&:hover": {
                          transform: "scale(1.1)",
                          boxShadow: 2,
                        },
                      }}
                    >
                      {formData.textColor === color.value && (
                        <Typography
                          sx={{
                            color: "#fff",
                            fontSize: "0.75rem",
                            fontWeight: "bold",
                          }}
                        >
                          ✓
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Box>
                <Typography variant="caption" sx={{ mt: 1, display: "block", color: "text.secondary" }}>
                  Selected: {COLOR_OPTIONS.find((c) => c.value === formData.textColor)?.label || "Custom"}
                </Typography>
              </Grid>

            {/* Background Image Upload */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
                Background Image
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<CloudUpload />}
                    sx={{ minWidth: 150 }}
                  >
                    Select Image
                      <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                  </Button>
                  {imageFile && (
                    <Button
                      variant="contained"
                      onClick={handleImageUpload}
                      disabled={uploading}
                      sx={{ minWidth: 150, bgcolor: "#da1818" }}
                    >
                      {uploading ? <CircularProgress size={20} /> : "Upload Image"}
                    </Button>
                  )}
                  {formData.backgroundImageUrl && (
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Delete />}
                      onClick={handleRemoveImage}
                    >
                      Remove Image
                    </Button>
                  )}
                </Box>

                {imagePreview && (
                  <Card sx={{ maxWidth: 400, mt: 1 }}>
                    <CardMedia
                      component="img"
                      image={imagePreview}
                      alt="Banner preview"
                      sx={{ maxHeight: 200, objectFit: "contain" }}
                    />
                  </Card>
                )}

                {formData.backgroundImageUrl && !imageFile && (
                  <Typography variant="caption" sx={{ color: "success.main" }}>
                    Image uploaded successfully
                  </Typography>
                )}
              </Box>
            </Grid>

            {/* Enable/Disable Toggle */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.enabled}
                    onChange={(e) => handleInputChange("enabled", e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    Enable Banner Ad
                  </Typography>
                }
              />
              <Typography variant="caption" sx={{ display: "block", mt: 0.5, color: "text.secondary" }}>
                {formData.enabled
                  ? "Banner ad is currently enabled and will be displayed in the Member App"
                  : "Banner ad is currently disabled and will not be displayed"}
              </Typography>
            </Grid>

        {/* Preview Section */}
        {formData.backgroundImageUrl && (
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Preview
            </Typography>
            <Box
              sx={{
                position: "relative",
                width: "100%",
                minHeight: 200,
                borderRadius: 2,
                overflow: "hidden",
                backgroundImage: `url(${formData.backgroundImageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                p: 3,
                      color: formData.textColor,
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  mb: 1,
                  textAlign: "center",
                  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                {formData.firstLineTitle || "1st Line (Title)"}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 2,
                  textAlign: "center",
                  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                {formData.secondLineDescription || "2nd Line (Description)"}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 1,
                  textAlign: "center",
                  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                {formData.thirdLineTitle || "3rd Line (Title)"}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  textAlign: "center",
                  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                {formData.fourthLineDescription || "4th Line (Description)"}
              </Typography>
            </Box>
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              variant="contained"
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
            {editingBanner ? "Banner updated successfully!" : "Banner created successfully!"}
          </Alert>
        </Snackbar>
      </Box>
    </AppLayout>
  )
}
