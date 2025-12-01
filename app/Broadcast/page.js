"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Box,
  CircularProgress,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material"
import { collection, getDocs, addDoc, doc, setDoc, serverTimestamp, query, orderBy, limit } from "firebase/firestore"
import { db } from "../../firebaseConfig"

// Import your existing components
import AppLayout from "../components/AppLayout"

// Import the new components we created
import BroadcastBreadcrumb from "./_components/BroadcastBreadcrumb"
import BroadcastToggleButtons from "./_components/BroadcastToggleButtons"
import BroadcastForm from "./_components/BroadcastForm"
import RecentBroadcastsList from "./_components/RecentBroadcastsList"
import RecipientList from "./_components/RecipientList"

export default function BroadcastPage() {
  const [toggleValue, setToggleValue] = useState("individual")
  const [broadcastTitle, setBroadcastTitle] = useState("")
  const [broadcastMessage, setBroadcastMessage] = useState("")
  const [channel, setChannel] = useState("inApp") // "inApp" | "push"
  const [selectedRecipients, setSelectedRecipients] = useState([])
  const [members, setMembers] = useState([])
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [broadcasts, setBroadcasts] = useState([])

  const [memberFilters, setMemberFilters] = useState({
    inactivePeriod: "none",
    membershipType: "all",
    expiringSoon: "none",
    birthday: "none",
    dinedAtRestaurantId: "",
  })

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        // Fetch members
        const membersSnap = await getDocs(collection(db, "members"))
        const membersData = []
        membersSnap.forEach((doc) => {
          const data = doc.data() || {}

          // Membership / expiry information (mirrors logic from members page where possible)
          const lastSubscription = data.lastSubscription || {}

          const toMillis = (value) => {
            if (!value) return null
            if (typeof value === "number") return value
            if (value?.toMillis) return value.toMillis()
            if (value?.toDate) return value.toDate().getTime()
            if (typeof value === "object" && typeof value.seconds === "number") {
              return value.seconds * 1000
            }
            if (typeof value === "string") {
              const parsed = Date.parse(value)
              return Number.isNaN(parsed) ? null : parsed
            }
            return null
          }

          const membershipExpiryTimestamp =
            (lastSubscription.expiryDate ? toMillis(lastSubscription.expiryDate) : null) ??
            toMillis(data.membershipExpiryDate) ??
            toMillis(data.membershipExpiry) ??
            toMillis(data.subscriptionExpiryDate)

          const membershipPlan =
            (lastSubscription.typeOfSubscription && lastSubscription.typeOfSubscription.trim()) ?
              lastSubscription.typeOfSubscription :
              (data.membershipPlan || data.subscriptionPlan || "N/A")

          // Possible birthday fields
          const birthdayRaw = data.birthday || data.dob || data.dateOfBirth

          membersData.push({
            id: doc.id,
            name: data.name || "-",
            email: data.email || doc.id || "-",
            membershipPlan,
            membershipExpiryTimestamp,
            birthday: birthdayRaw,
            // Optional: track restaurants visited if the field exists
            visitedRestaurants: data.visitedRestaurants || data.dinedRestaurants || [],
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

  const handleToggleChange = (event, newValue) => {
    if (newValue !== null) {
      setToggleValue(newValue)
      // Clear selection when switching types
      setSelectedRecipients([])
    }
  }

  const filteredMembers = useMemo(() => {
    const now = new Date()

    return members.filter((m) => {
      // Membership type: "Free & Paid"
      if (memberFilters.membershipType !== "all") {
        const plan = (m.membershipPlan || "").toLowerCase()
        const isPaid = plan && plan !== "n/a" && !plan.includes("free")
        if (memberFilters.membershipType === "paid" && !isPaid) return false
        if (memberFilters.membershipType === "free" && isPaid) return false
      }

      // Membership expiring soon
      if (memberFilters.expiringSoon !== "none" && m.membershipExpiryTimestamp) {
        const expiryDate = new Date(m.membershipExpiryTimestamp)
        const diffDays = (expiryDate - now) / (1000 * 60 * 60 * 24)
        const daysThreshold = memberFilters.expiringSoon === "7" ? 7 : 30
        if (diffDays < 0 || diffDays > daysThreshold) {
          return false
        }
      }

      // Birthday filters (day/week/month)
      if (memberFilters.birthday !== "none" && m.birthday) {
        let birthdayDate
        const b = m.birthday
        if (b?.toDate) {
          birthdayDate = b.toDate()
        } else if (typeof b === "object" && typeof b.seconds === "number") {
          birthdayDate = new Date(b.seconds * 1000)
        } else if (typeof b === "string") {
          const parsed = Date.parse(b)
          if (!Number.isNaN(parsed)) birthdayDate = new Date(parsed)
        }

        if (birthdayDate) {
          const bdMonth = birthdayDate.getMonth()
          const bdDate = birthdayDate.getDate()

          const today = now
          const thisYearBirthday = new Date(today.getFullYear(), bdMonth, bdDate)
          const diffMs = thisYearBirthday - today
          const diffDays = diffMs / (1000 * 60 * 60 * 24)

          if (memberFilters.birthday === "day" && !(Math.abs(diffDays) < 1)) {
            return false
          }
          if (memberFilters.birthday === "week" && !(diffDays >= 0 && diffDays <= 7)) {
            return false
          }
          if (memberFilters.birthday === "month" && !(diffDays >= 0 && diffDays <= 31)) {
            return false
          }
        }
      }

      // Inactive period – best-effort using membership expiry if available
      if (memberFilters.inactivePeriod !== "none") {
        const daysInactive = memberFilters.inactivePeriod === "30" ? 30 : memberFilters.inactivePeriod === "60" ? 60 : 90
        if (m.membershipExpiryTimestamp) {
          const lastRelevant = new Date(m.membershipExpiryTimestamp)
          const diffDays = (now - lastRelevant) / (1000 * 60 * 60 * 24)
          if (diffDays < daysInactive) {
            return false
          }
        }
      }

      // Dined in a specific restaurant before – expect member.visitedRestaurants to contain ids/emails/names
      if (memberFilters.dinedAtRestaurantId) {
        const visited = Array.isArray(m.visitedRestaurants) ? m.visitedRestaurants : []
        const match = visited.some((v) =>
          String(v).toLowerCase() === memberFilters.dinedAtRestaurantId.toLowerCase()
        )
        if (!match) return false
      }

      return true
    })
  }, [members, memberFilters])

  const filteredRestaurants = useMemo(() => {
    // Currently no advanced filters for restaurants; placeholder to extend later
    return restaurants
  }, [restaurants])

  const handleSendMessage = async () => {
    if (broadcastTitle.trim() && broadcastMessage.trim() && selectedRecipients.length > 0) {
      const recipientData = toggleValue === "individual"
        ? filteredMembers.filter((m) => selectedRecipients.includes(m.id || m.email))
        : filteredRestaurants.filter((r) => selectedRecipients.includes(r.id || r.email))

      const recipientEmails = recipientData.map((r) => r.email).filter(Boolean)

      try {
        // Save broadcast to Firebase
        await addDoc(collection(db, "broadcasts"), {
          title: broadcastTitle,
          message: broadcastMessage,
          audience: toggleValue,
          channel,
          recipients: recipientEmails,
          recipientCount: selectedRecipients.length,
          recipientNames: recipientData.map((r) => r.name || r.restaurantName || r.email),
          createdAt: serverTimestamp(),
        })

        // Create in-app notification documents for each member
        // Only when sending to members AND channel includes in-app notifications
        if (toggleValue === "individual" && (channel === "inApp" || channel === "both")) {
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

        // Show success message
        alert(
          `Broadcast sent successfully to ${selectedRecipients.length} ` +
            `${toggleValue === "individual" ? "member(s)" : "restaurant(s)"} as ${channel === "inApp" ? "in-app" : channel === "push" ? "push" : "in-app & push"} notification!`
        )

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

            {/* Main Title */}
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: "#111827",
                  fontSize: { xs: "1.1rem", sm: "1.25rem" },
                }}
              >
                Broadcast Messages
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#6b7280", mt: 0.5 }}
              >
                Send targeted messages to your members and restaurants.
              </Typography>
            </Box>

            {/* Toggle Buttons */}
            <BroadcastToggleButtons toggleValue={toggleValue} onToggleChange={handleToggleChange} />

            {/* Filters */}
            {toggleValue === "individual" && (
              <Box sx={{ mb: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Inactive for</InputLabel>
                      <Select
                        label="Inactive for"
                        value={memberFilters.inactivePeriod}
                        onChange={(e) =>
                          setMemberFilters((prev) => ({ ...prev, inactivePeriod: e.target.value }))
                        }
                      >
                        <MenuItem value="none">Any time</MenuItem>
                        <MenuItem value="30">30+ days</MenuItem>
                        <MenuItem value="60">60+ days</MenuItem>
                        <MenuItem value="90">90+ days</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Membership type</InputLabel>
                      <Select
                        label="Membership type"
                        value={memberFilters.membershipType}
                        onChange={(e) =>
                          setMemberFilters((prev) => ({ ...prev, membershipType: e.target.value }))
                        }
                      >
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="free">Free</MenuItem>
                        <MenuItem value="paid">Paid</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Membership expiring</InputLabel>
                      <Select
                        label="Membership expiring"
                        value={memberFilters.expiringSoon}
                        onChange={(e) =>
                          setMemberFilters((prev) => ({ ...prev, expiringSoon: e.target.value }))
                        }
                      >
                        <MenuItem value="none">Any time</MenuItem>
                        <MenuItem value="7">Within 7 days</MenuItem>
                        <MenuItem value="30">Within 30 days</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Birthday</InputLabel>
                      <Select
                        label="Birthday"
                        value={memberFilters.birthday}
                        onChange={(e) =>
                          setMemberFilters((prev) => ({ ...prev, birthday: e.target.value }))
                        }
                      >
                        <MenuItem value="none">Any time</MenuItem>
                        <MenuItem value="day">Today</MenuItem>
                        <MenuItem value="week">This week</MenuItem>
                        <MenuItem value="month">This month</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Dined at restaurant</InputLabel>
                      <Select
                        label="Dined at restaurant"
                        value={memberFilters.dinedAtRestaurantId}
                        onChange={(e) =>
                          setMemberFilters((prev) => ({ ...prev, dinedAtRestaurantId: e.target.value }))
                        }
                      >
                        <MenuItem value="">Any restaurant</MenuItem>
                        {restaurants.map((r) => (
                          <MenuItem key={r.id} value={r.id}>
                            {r.restaurantName || r.name || r.email}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Recipient List */}
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 4 }}>
                <CircularProgress sx={{ color: "#da1818" }} />
              </Box>
            ) : (
              <RecipientList
                type={toggleValue}
                members={filteredMembers}
                restaurants={filteredRestaurants}
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
              channel={channel}
              setChannel={setChannel}
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
