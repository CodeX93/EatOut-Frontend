"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Switch,
  Divider,
} from "@mui/material"
import { Edit, RestaurantMenu } from "@mui/icons-material"

export default function EditCuisineModal({ open, onClose, onEdit, cuisine }) {
  const [cuisineName, setCuisineName] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (cuisine) {
      setCuisineName(cuisine.name || "")
      setIsActive(cuisine.isActive !== false) // Default to true if not specified
    }
  }, [cuisine])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!cuisineName.trim()) {
      setError("Please enter a cuisine name")
      return
    }

    if (cuisineName.trim() === cuisine?.name && isActive === (cuisine?.isActive !== false)) {
      setError("No changes made")
      return
    }

    setLoading(true)
    setError("")

    try {
      const success = await onEdit(cuisine.name, cuisineName.trim(), isActive)
      if (success) {
        onClose()
      } else {
        setError("Failed to update cuisine. Please try again.")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setCuisineName("")
      setIsActive(true)
      setError("")
      onClose()
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
          p: 1,
        },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <RestaurantMenu sx={{ color: "#da1818", fontSize: "24px" }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#000" }}>
            Edit Cuisine
          </Typography>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Typography variant="body2" sx={{ color: "#666", mb: 2 }}>
            Update the name of the cuisine.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            autoFocus
            fullWidth
            label="Cuisine Name"
            value={cuisineName}
            onChange={(e) => setCuisineName(e.target.value)}
            placeholder="e.g., Italian, Chinese, Mexican"
            disabled={loading}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
            }}
          />

          <Divider sx={{ my: 2 }} />

          <FormControl component="fieldset" fullWidth>
            <FormControlLabel
              control={
                <Switch
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  disabled={loading}
                  color="primary"
                />
              }
              label={
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    Status
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666" }}>
                    {isActive ? "Active - Cuisine is available for restaurants" : "Inactive - Cuisine is hidden from restaurants"}
                  </Typography>
                </Box>
              }
              sx={{ alignItems: "flex-start", gap: 1 }}
            />
          </FormControl>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={handleClose}
            disabled={loading}
            sx={{
              color: "#8a8a8f",
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !cuisineName.trim() || (cuisineName.trim() === cuisine?.name && isActive === (cuisine?.isActive !== false))}
            startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <Edit />}
            sx={{
              bgcolor: "#da1818",
              "&:hover": {
                bgcolor: "#b71c1c",
              },
              px: 3,
              py: 1,
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            {loading ? "Updating..." : "Update Cuisine"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
