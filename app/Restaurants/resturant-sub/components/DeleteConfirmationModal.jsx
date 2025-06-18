import { Box, Typography, Button, Paper, Modal } from "@mui/material"

export default function DeleteConfirmationModal({ 
  open = false, 
  onClose,
  onConfirm,
  title = "Delete Restaurant",
  message = "Are you sure you want to delete restaurant?"
}) {
  const handleClose = () => {
    if (onClose) {
      onClose()
    }
  }

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm()
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
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
          {title}
        </Typography>
        <Typography variant="body1" sx={{ color: "#8a8a8f", mb: 4, lineHeight: 1.5 }}>
          {message}
        </Typography>
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
          <Button
            variant="outlined"
            onClick={handleClose}
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
            onClick={handleConfirm}
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
            Yes, Delete
          </Button>
        </Box>
      </Paper>
    </Modal>
  )
}