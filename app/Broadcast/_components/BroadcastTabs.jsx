"use client"

import { Box, Tabs, Tab } from "@mui/material"

export default function BroadcastTabs({ tabValue, onTabChange }) {
  return (
    <Box sx={{ mb: 3 }}>
      <Tabs
        value={tabValue}
        onChange={onTabChange}
        sx={{
          "& .MuiTab-root": {
            textTransform: "none",
            fontWeight: 500,
            fontSize: { xs: "12px", sm: "14px" },
            minHeight: 40,
            px: { xs: 2, sm: 3 },
            py: 1,
            bgcolor: "transparent",
            color: "#8a8a8f",
            border: "1px solid #dadada",
            borderRadius: "8px",
            mr: 1,
            "&.Mui-selected": {
              bgcolor: "#da1818",
              color: "white",
              borderColor: "#da1818",
            },
          },
          "& .MuiTabs-indicator": {
            display: "none",
          },
        }}
      >
        <Tab label="Individuals" />
        <Tab label="Selected Merchants and Members" />
      </Tabs>
    </Box>
  )
}
