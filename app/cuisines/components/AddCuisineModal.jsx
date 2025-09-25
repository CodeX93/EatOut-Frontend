"use client"

import { useState } from "react"
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
} from "@mui/material"
import { Add, RestaurantMenu } from "@mui/icons-material"

export default function AddCuisineModal({ open, onClose, onAdd }) {
  const [cuisineName, setCuisineName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!cuisineName.trim()) {
      setError("Please enter a cuisine name")
      return
    }

    setLoading(true)
    setError("")

    try {
      const success = await onAdd(cuisineName.trim())
      if (success) {
        setCuisineName("")
        onClose()
      } else {
        setError("Failed to add cuisine. Please try again.")
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
            Add New Cuisine
          </Typography>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Typography variant="body2" sx={{ color: "#666", mb: 2 }}>
            Enter the name of the cuisine you want to add to the system.
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
            disabled={loading || !cuisineName.trim()}
            startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <Add />}
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
            {loading ? "Adding..." : "Add Cuisine"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
