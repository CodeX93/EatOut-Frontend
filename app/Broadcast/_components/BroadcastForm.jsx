"use client"

import { Box, Card, CardContent, TextField, Button } from "@mui/material"

export default function BroadcastForm({
  broadcastTitle,
  setBroadcastTitle,
  broadcastMessage,
  setBroadcastMessage,
  onSendMessage,
}) {
  return (
    <Card
      sx={{
        bgcolor: "#ffffff",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        border: "1px solid #efeff4",
        borderRadius: "12px",
      }}
    >
      <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <TextField
            placeholder="Enter Broadcast Title"
            value={broadcastTitle}
            onChange={(e) => setBroadcastTitle(e.target.value)}
            fullWidth
            size="medium"
            sx={{
              "& .MuiOutlinedInput-root": {
                bgcolor: "#ffffff",
                borderRadius: "8px",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#dadada",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#dadada",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#da1818",
                },
              },
            }}
          />
          <TextField
            placeholder="Enter Broadcast Message"
            value={broadcastMessage}
            onChange={(e) => setBroadcastMessage(e.target.value)}
            fullWidth
            multiline
            rows={6}
            sx={{
              "& .MuiOutlinedInput-root": {
                bgcolor: "#ffffff",
                borderRadius: "8px",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#dadada",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#dadada",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#da1818",
                },
              },
            }}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              onClick={onSendMessage}
              disabled={!broadcastTitle.trim() || !broadcastMessage.trim()}
              sx={{
                bgcolor: "#da1818",
                color: "white",
                textTransform: "none",
                fontWeight: 500,
                px: { xs: 3, sm: 4 },
                py: 1.5,
                borderRadius: "8px",
                fontSize: { xs: "14px", sm: "16px" },
                "&:hover": {
                  bgcolor: "#c41515",
                },
                "&:disabled": {
                  bgcolor: "#dadada",
                  color: "#8a8a8f",
                },
              }}
            >
              Send message
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}
