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
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
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
          height: "100vh",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          ml: { xs: 0, md: `${drawerWidth}px` },
          mt: { xs: "56px", sm: "64px" },
          overflow: "auto",
        }}
      >
        {children}
      </Box>
    </Box>
  )
}
