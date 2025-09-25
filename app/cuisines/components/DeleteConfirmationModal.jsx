"use client"

import { useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material"
import { Delete, Warning } from "@mui/icons-material"

export default function DeleteConfirmationModal({ open, onClose, onDelete, cuisine }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleDelete = async () => {
    setLoading(true)
    setError("")

    try {
      const success = await onDelete(cuisine.name)
      if (success) {
        onClose()
      } else {
        setError("Failed to delete cuisine. Please try again.")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
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
          <Warning sx={{ color: "#ff2d55", fontSize: "24px" }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#000" }}>
            Delete Cuisine
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Are you sure you want to delete the cuisine <strong>"{cuisine?.name}"</strong>?
        </Typography>
        
        <Alert severity="warning" sx={{ mb: 2 }}>
          This action cannot be undone. The cuisine will be permanently removed from the system.
        </Alert>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
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
          onClick={handleDelete}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <Delete />}
          sx={{
            bgcolor: "#ff2d55",
            "&:hover": {
              bgcolor: "#d32f2f",
            },
            px: 3,
            py: 1,
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          {loading ? "Deleting..." : "Delete Cuisine"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
