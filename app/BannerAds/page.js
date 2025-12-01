"use client"

import { useState, useEffect } from "react"
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
} from "@mui/material"
import { collection, getDocs, doc, setDoc, serverTimestamp } from "firebase/firestore"
import { db } from "../../firebaseConfig"
import AppLayout from "../components/AppLayout"
import { Delete, CloudUpload } from "@mui/icons-material"

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

// Cloudinary config (unsigned upload)
const CLOUDINARY_UPLOAD_PRESET = "eat_app_unsigned"
const CLOUDINARY_CLOUD_NAME = "di14lhy0f"

export default function BannerAdsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [bannerData, setBannerData] = useState(null)

  const [formData, setFormData] = useState({
    firstLineTitle: "",
    secondLineDescription: "",
    thirdLineTitle: "",
    fourthLineDescription: "",
    color: "#da1818",
    backgroundImageUrl: "",
    enabled: false,
  })

  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState("")

  // Load existing banner data
  useEffect(() => {
    const loadBannerData = async () => {
      setLoading(true)
      try {
        const snap = await getDocs(collection(db, "bannerAds"))
        if (!snap.empty) {
          const doc = snap.docs[0]
          const data = doc.data()
          setBannerData({ id: doc.id, ...data })
          setFormData({
            firstLineTitle: data.firstLineTitle || "",
            secondLineDescription: data.secondLineDescription || "",
            thirdLineTitle: data.thirdLineTitle || "",
            fourthLineDescription: data.fourthLineDescription || "",
            color: data.color || "#da1818",
            backgroundImageUrl: data.backgroundImageUrl || "",
            enabled: data.enabled !== undefined ? data.enabled : false,
          })
          if (data.backgroundImageUrl) {
            setImagePreview(data.backgroundImageUrl)
          }
        }
      } catch (e) {
        console.error("Error loading banner data:", e)
        setError("Failed to load banner data")
      } finally {
        setLoading(false)
      }
    }
    loadBannerData()
  }, [])

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
    if (!formData.backgroundImageUrl) {
      setError("Please upload a background image")
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
        backgroundImageUrl: formData.backgroundImageUrl,
        enabled: formData.enabled,
        updatedAt: serverTimestamp(),
      }

      // If banner data exists, update it; otherwise create new
      if (bannerData?.id) {
        await setDoc(doc(db, "bannerAds", bannerData.id), {
          ...bannerAdData,
          createdAt: bannerData.createdAt || serverTimestamp(),
        })
      } else {
        await setDoc(doc(db, "bannerAds", "current"), {
          ...bannerAdData,
          createdAt: serverTimestamp(),
        })
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)

      // Reload data
      const snap = await getDocs(collection(db, "bannerAds"))
      if (!snap.empty) {
        const doc = snap.docs[0]
        const data = doc.data()
        setBannerData({ id: doc.id, ...data })
      }
    } catch (e) {
      console.error("Error saving banner ad:", e)
      setError("Failed to save banner ad: " + e.message)
    } finally {
      setSaving(false)
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
        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            mb: 3,
            color: "#333",
            fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
          }}
        >
          Banner Ad Management
        </Typography>

        <Paper
          elevation={2}
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: 2,
          }}
        >
          <Grid container spacing={3}>
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

            {/* Color Selection */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
                Choice of Colour
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
                          color: color.value === "#ffffff" || color.value === "#000000" ? "#fff" : "#fff",
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
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageChange}
                    />
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

            {/* Save Button */}
            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
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
                  {saving ? <CircularProgress size={24} color="inherit" /> : "Save Banner Ad"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Preview Section */}
        {formData.backgroundImageUrl && (
          <Paper
            elevation={2}
            sx={{
              p: { xs: 2, sm: 3, md: 4 },
              borderRadius: 2,
              mt: 3,
            }}
          >
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
                color: formData.color,
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
          </Paper>
        )}

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
            Banner ad saved successfully!
          </Alert>
        </Snackbar>
      </Box>
    </AppLayout>
  )
}

