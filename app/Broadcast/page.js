"use client"

import { useState } from "react"
import { Box } from "@mui/material"

// Import your existing components
import AppLayout from "../components/AppLayout"

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
    <AppLayout>
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: { xs: 1.5, sm: 2, md: 3 },
          pt: { xs: 2.5, sm: 3, md: 3 },
          pb: { xs: "80px", sm: "100px", md: "120px" },
          overflow: "auto",
          width: "100%",
          minHeight: "100%",
        }}
      >
        {/* Content Area */}
        <Box sx={{ 
          display: "flex", 
          flexGrow: 1, 
          flexDirection: { xs: "column", lg: "row" },
          gap: { xs: 2, sm: 2.5, md: 3 }
        }}>
          {/* Main Content */}
          <Box sx={{ 
            flexGrow: 1, 
            p: { xs: 1.5, sm: 2, md: 3 }, 
            overflow: "auto",
            width: { xs: "100%", lg: "auto" }
          }}>
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
              p: { xs: 1.5, sm: 2, md: 3 },
              pl: { xs: 1.5, lg: 0 },
              display: { xs: "none", lg: "block" },
              flexShrink: 0,
            }}
          >
            <RecentBroadcastsList />
          </Box>
        </Box>

        {/* Mobile Recent Broadcasts - Show below form on mobile */}
        <Box sx={{ 
          display: { xs: "block", lg: "none" }, 
          p: { xs: 1.5, sm: 2, md: 3 }, 
          pt: 0 
        }}>
          <RecentBroadcastsList />
        </Box>
      </Box>
    </AppLayout>
  )
}
