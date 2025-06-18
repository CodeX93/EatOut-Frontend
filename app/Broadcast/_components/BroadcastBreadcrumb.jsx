"use client"

import { Breadcrumbs, Typography } from "@mui/material"
import { NavigateNext } from "@mui/icons-material"

export default function BroadcastBreadcrumb() {
  return (
    <Breadcrumbs separator={<NavigateNext fontSize="small" />} sx={{ mb: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 600, color: "#000000", fontSize: { xs: "20px", sm: "24px" } }}>
        Broadcast
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: 600, color: "#000000", fontSize: { xs: "20px", sm: "24px" } }}>
        All Users
      </Typography>
    </Breadcrumbs>
  )
}
