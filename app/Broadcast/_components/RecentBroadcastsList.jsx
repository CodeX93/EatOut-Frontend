"use client"

import { useMemo } from "react"
import { Box, Card, CardContent, Typography, IconButton } from "@mui/material"
import { MoreVert } from "@mui/icons-material"

const formatTimeAgo = (timestamp) => {
  if (!timestamp) return "Unknown time"

  // Handle Firestore Timestamp
  let date
  if (timestamp.toDate) {
    date = timestamp.toDate()
  } else if (timestamp.seconds) {
    date = new Date(timestamp.seconds * 1000)
  } else if (timestamp instanceof Date) {
    date = timestamp
  } else {
    return "Unknown time"
  }

  const now = new Date()
  const diffMs = now - date
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  const diffWeeks = Math.floor(diffDays / 7)
  const diffMonths = Math.floor(diffDays / 30)

  if (diffSecs < 60) {
    return `${diffSecs} second${diffSecs !== 1 ? "s" : ""} ago`
  } else if (diffMins < 60) {
    return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`
  } else if (diffWeeks < 4) {
    return `${diffWeeks} week${diffWeeks !== 1 ? "s" : ""} ago`
  } else if (diffMonths < 12) {
    return `${diffMonths} month${diffMonths !== 1 ? "s" : ""} ago`
  } else {
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }
}

export default function RecentBroadcastsList({ broadcasts = [] }) {
  const formattedBroadcasts = useMemo(() => {
    return broadcasts.map((broadcast) => {
      const audienceLabel = broadcast.audience === "individual" ? "Members" : "Restaurants"
      const sentToText = `Sent to: ${broadcast.recipientCount} ${audienceLabel}`
      
      return {
        ...broadcast,
        time: formatTimeAgo(broadcast.createdAt),
        sentTo: sentToText,
      }
    })
  }, [broadcasts])

  return (
    <Card
      sx={{
        bgcolor: "#ffffff",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        border: "1px solid #efeff4",
        borderRadius: "12px",
        height: "fit-content",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#000000", fontSize: { xs: "16px", sm: "18px" } }}>
            Recent Broadcasts
          </Typography>
          <IconButton size="small" sx={{ color: "#8a8a8f" }}>
            <MoreVert />
          </IconButton>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {formattedBroadcasts.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 2 }}>
              <Typography
                variant="body2"
                sx={{
                  color: "#8a8a8f",
                  fontSize: { xs: "13px", sm: "14px" },
                }}
              >
                No broadcasts yet
              </Typography>
            </Box>
          ) : (
            formattedBroadcasts.map((broadcast) => (
              <Box key={broadcast.id}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: "#000000",
                    mb: 0.5,
                    fontSize: { xs: "13px", sm: "14px" },
                    lineHeight: 1.4,
                  }}
                >
                  {broadcast.title}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#8a8a8f",
                    display: "block",
                    mb: 0.5,
                    fontSize: { xs: "11px", sm: "12px" },
                  }}
                >
                  {broadcast.time}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#8a8a8f",
                    fontSize: { xs: "10px", sm: "11px" },
                  }}
                >
                  {broadcast.sentTo}
                </Typography>
              </Box>
            ))
          )}
        </Box>
      </CardContent>
    </Card>
  )
}
