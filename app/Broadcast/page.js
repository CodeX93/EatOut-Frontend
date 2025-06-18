"use client"

import { useState } from "react"
import { Box } from "@mui/material"

// Import your existing components
import Header from "../components/Header"
import Sidebar from "../components/SideNavbar"

// Import the new components we created
import BroadcastBreadcrumb from "./_components/BroadcastBreadcrumb"
import BroadcastTabs from "./_components/BroadcastTabs"
import BroadcastToggleButtons from "./_components/BroadcastToggleButtons"
import BroadcastForm from "./_components/BroadcastForm"
import RecentBroadcastsList from "./_components/RecentBroadcastsList"

export default function BroadcastPage() {
  const [tabValue, setTabValue] = useState(0)
  const [toggleValue, setToggleValue] = useState("members")
  const [broadcastTitle, setBroadcastTitle] = useState("")
  const [broadcastMessage, setBroadcastMessage] = useState("")

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handleToggleChange = (event, newValue) => {
    if (newValue !== null) {
      setToggleValue(newValue)
    }
  }

  const handleSendMessage = () => {
    if (broadcastTitle.trim() && broadcastMessage.trim()) {
      console.log("Sending broadcast:", {
        title: broadcastTitle,
        message: broadcastMessage,
        audience: toggleValue,
        tab: tabValue,
      })

      // Show success message or handle API call here
      alert("Broadcast sent successfully!")

      // Reset form
      setBroadcastTitle("")
      setBroadcastMessage("")
    }
  }

  return (
    <Box 
      component="div"
      sx={{ 
        display: "flex", 
        bgcolor: "#f9f9f9", 
        minHeight: "100vh",
        width: "100%"
      }}
    >
      {/* Header */}
      <Header />
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3,
          marginTop: '64px',
          marginLeft: '240px',
          '@media (max-width: 900px)': {
            marginLeft: 0,
          }
        }}
      >
        {/* Content Area */}
        <Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
          {/* Main Content */}
          <Box sx={{ flexGrow: 1, p: { xs: 2, sm: 3 }, overflow: "auto" }}>
            {/* Breadcrumb */}
            <BroadcastBreadcrumb />

            {/* Main Tabs */}
            <BroadcastTabs tabValue={tabValue} onTabChange={handleTabChange} />

            {/* Toggle Buttons */}
            <BroadcastToggleButtons toggleValue={toggleValue} onToggleChange={handleToggleChange} />

            {/* Broadcast Form */}
            <BroadcastForm
              broadcastTitle={broadcastTitle}
              setBroadcastTitle={setBroadcastTitle}
              broadcastMessage={broadcastMessage}
              setBroadcastMessage={setBroadcastMessage}
              onSendMessage={handleSendMessage}
            />
          </Box>

          {/* Right Sidebar */}
          <Box
            sx={{
              width: { xs: "100%", lg: 320 },
              p: { xs: 2, sm: 3 },
              pl: { xs: 2, lg: 0 },
              display: { xs: "none", lg: "block" },
            }}
          >
            <RecentBroadcastsList />
          </Box>
        </Box>

        {/* Mobile Recent Broadcasts - Show below form on mobile */}
        <Box sx={{ display: { xs: "block", lg: "none" }, p: { xs: 2, sm: 3 }, pt: 0 }}>
          <RecentBroadcastsList />
        </Box>
      </Box>
    </Box>
  )
}
