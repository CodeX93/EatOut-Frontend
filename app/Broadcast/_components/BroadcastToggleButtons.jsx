"use client"

import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material"

export default function BroadcastToggleButtons({ toggleValue, onToggleChange }) {
  return (
    <Box sx={{ mb: 4 }}>
      <ToggleButtonGroup
        value={toggleValue}
        exclusive
        onChange={onToggleChange}
        sx={{
          "& .MuiToggleButton-root": {
            textTransform: "none",
            fontWeight: 500,
            fontSize: { xs: "12px", sm: "14px" },
            px: { xs: 2, sm: 3 },
            py: 1,
            border: "1px solid #dadada",
            borderRadius: "8px",
            color: "#8a8a8f",
            "&.Mui-selected": {
              bgcolor: "#da1818",
              color: "white",
              borderColor: "#da1818",
              "&:hover": {
                bgcolor: "#da1818",
              },
            },
            "&:hover": {
              bgcolor: "#f5f5f5",
            },
          },
        }}
      >
        <ToggleButton value="individual">Individual</ToggleButton>
        <ToggleButton value="restaurant">Restaurant</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  )
}
