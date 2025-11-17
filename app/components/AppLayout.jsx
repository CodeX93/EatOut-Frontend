"use client"

import { useRef } from "react"
import { Box } from "@mui/material"
import Header from "./Header"
import SideNavbar from "./SideNavbar"

const drawerWidth = 240

export default function AppLayout({ children }) {
  const sidebarRef = useRef()

  const handleMenuClick = () => {
    if (sidebarRef.current) {
      sidebarRef.current.toggleDrawer()
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        backgroundColor: "#f9f9f9",
        minHeight: "100vh",
        width: "100vw",
        overflowX: "hidden",
      }}
    >
      {/* Header */}
      <Header onMenuClick={handleMenuClick} />

      {/* Sidebar */}
      <SideNavbar ref={sidebarRef} />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          ml: { xs: 0, md: `${drawerWidth}px` },
          mt: { xs: "calc(56px + 8px)", sm: "calc(64px + 8px)" },
          minHeight: { xs: "calc(100vh - 56px - 8px)", sm: "calc(100vh - 64px - 8px)" },
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {children}
      </Box>
    </Box>
  )
}
