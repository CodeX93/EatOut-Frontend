"use client"

import { useState, useEffect } from "react"
import { Box, CircularProgress } from "@mui/material"
import { collection, getDocs, addDoc, doc, setDoc, serverTimestamp, query, orderBy, limit } from "firebase/firestore"
import { db } from "../../firebaseConfig"

// Import your existing components
import AppLayout from "../components/AppLayout"

// Import the new components we created
import BroadcastBreadcrumb from "./_components/BroadcastBreadcrumb"
import BroadcastTabs from "./_components/BroadcastTabs"
import BroadcastToggleButtons from "./_components/BroadcastToggleButtons"
import BroadcastForm from "./_components/BroadcastForm"
import RecentBroadcastsList from "./_components/RecentBroadcastsList"
import RecipientList from "./_components/RecipientList"

export default function BroadcastPage() {
  const [tabValue, setTabValue] = useState(0)
  const [toggleValue, setToggleValue] = useState("individual")
  const [broadcastTitle, setBroadcastTitle] = useState("")
  const [broadcastMessage, setBroadcastMessage] = useState("")
  const [selectedRecipients, setSelectedRecipients] = useState([])
  const [members, setMembers] = useState([])
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [broadcasts, setBroadcasts] = useState([])

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        // Fetch members
        const membersSnap = await getDocs(collection(db, "members"))
        const membersData = []
        membersSnap.forEach((doc) => {
          const data = doc.data() || {}
          membersData.push({
            id: doc.id,
            name: data.name || "-",
            email: data.email || doc.id || "-",
          })
        })
        setMembers(membersData)

        // Fetch restaurants
        const restaurantsSnap = await getDocs(collection(db, "registeredRestaurants"))
        const restaurantsData = []
        restaurantsSnap.forEach((doc) => {
          const data = doc.data() || {}
          restaurantsData.push({
            id: doc.id,
            name: data.restaurantName || data.name || "-",
            restaurantName: data.restaurantName || data.name || "-",
            email: data.email || "-",
            location: data.location || "-",
          })
        })
        setRestaurants(restaurantsData)
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  useEffect(() => {
    const loadBroadcasts = async () => {
      try {
        const broadcastsRef = collection(db, "broadcasts")
        const q = query(broadcastsRef, orderBy("createdAt", "desc"), limit(10))
        const broadcastsSnap = await getDocs(q)
        const broadcastsData = []
        broadcastsSnap.forEach((doc) => {
          const data = doc.data() || {}
          broadcastsData.push({
            id: doc.id,
            title: data.title || "",
            message: data.message || "",
            audience: data.audience || "",
            recipientCount: data.recipientCount || 0,
            recipients: data.recipients || [],
            createdAt: data.createdAt,
          })
        })
        setBroadcasts(broadcastsData)
      } catch (error) {
        console.error("Error loading broadcasts:", error)
      }
    }
    loadBroadcasts()
  }, [])

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handleToggleChange = (event, newValue) => {
    if (newValue !== null) {
      setToggleValue(newValue)
      // Clear selection when switching types
      setSelectedRecipients([])
    }
  }

  const handleSendMessage = async () => {
    if (broadcastTitle.trim() && broadcastMessage.trim() && selectedRecipients.length > 0) {
      const recipientData = toggleValue === "individual"
        ? members.filter((m) => selectedRecipients.includes(m.id || m.email))
        : restaurants.filter((r) => selectedRecipients.includes(r.id || r.email))

      const recipientEmails = recipientData.map((r) => r.email).filter(Boolean)

      try {
        // Save broadcast to Firebase
        await addDoc(collection(db, "broadcasts"), {
          title: broadcastTitle,
          message: broadcastMessage,
          audience: toggleValue,
          recipients: recipientEmails,
          recipientCount: selectedRecipients.length,
          recipientNames: recipientData.map((r) => r.name || r.restaurantName || r.email),
          createdAt: serverTimestamp(),
        })

        // Create notification documents for each member (only for individual broadcasts)
        if (toggleValue === "individual") {
          const now = new Date()
          const dateString = now.toISOString().split("T")[0] // Format: YYYY-MM-DD
          
          // Create notifications for each recipient
          const notificationPromises = recipientEmails.map(async (email) => {
            if (!email) return
            
            try {
              // Create notification document in membersNotifications/{email}/items/{date}
              const notificationRef = doc(
                db,
                "membersNotifications",
                email,
                "items",
                dateString
              )
              
              await setDoc(notificationRef, {
                createdAt: serverTimestamp(),
                message: broadcastMessage,
                read: false,
                title: broadcastTitle,
                type: "broadcast",
              })
            } catch (error) {
              console.error(`Error creating notification for ${email}:`, error)
              // Continue with other notifications even if one fails
            }
          })
          
          // Wait for all notifications to be created
          await Promise.all(notificationPromises)
        }

        // Reload broadcasts to show the new one
        const broadcastsRef = collection(db, "broadcasts")
        const q = query(broadcastsRef, orderBy("createdAt", "desc"), limit(10))
        const broadcastsSnap = await getDocs(q)
        const broadcastsData = []
        broadcastsSnap.forEach((doc) => {
          const data = doc.data() || {}
          broadcastsData.push({
            id: doc.id,
            title: data.title || "",
            message: data.message || "",
            audience: data.audience || "",
            recipientCount: data.recipientCount || 0,
            recipients: data.recipients || [],
            createdAt: data.createdAt,
          })
        })
        setBroadcasts(broadcastsData)

      console.log("Sending broadcast:", {
        title: broadcastTitle,
        message: broadcastMessage,
        audience: toggleValue,
          recipients: recipientEmails,
          recipientCount: selectedRecipients.length,
        tab: tabValue,
      })

        // Show success message
        alert(`Broadcast sent successfully to ${selectedRecipients.length} ${toggleValue === "individual" ? "member(s)" : "restaurant(s)"}!`)

      // Reset form
      setBroadcastTitle("")
      setBroadcastMessage("")
        setSelectedRecipients([])
      } catch (error) {
        console.error("Error sending broadcast:", error)
        alert("Error sending broadcast. Please try again.")
      }
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

            {/* Recipient List */}
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 4 }}>
                <CircularProgress sx={{ color: "#da1818" }} />
              </Box>
            ) : (
              <RecipientList
                type={toggleValue}
                members={members}
                restaurants={restaurants}
                selectedRecipients={selectedRecipients}
                onSelectionChange={setSelectedRecipients}
              />
            )}

            {/* Broadcast Form */}
            <BroadcastForm
              broadcastTitle={broadcastTitle}
              setBroadcastTitle={setBroadcastTitle}
              broadcastMessage={broadcastMessage}
              setBroadcastMessage={setBroadcastMessage}
              onSendMessage={handleSendMessage}
              selectedCount={selectedRecipients.length}
              disabled={selectedRecipients.length === 0}
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
            <RecentBroadcastsList broadcasts={broadcasts} />
          </Box>
        </Box>

        {/* Mobile Recent Broadcasts - Show below form on mobile */}
        <Box sx={{ 
          display: { xs: "block", lg: "none" }, 
          p: { xs: 1.5, sm: 2, md: 3 }, 
          pt: 0 
        }}>
          <RecentBroadcastsList broadcasts={broadcasts} />
        </Box>
      </Box>
    </AppLayout>
  )
}
