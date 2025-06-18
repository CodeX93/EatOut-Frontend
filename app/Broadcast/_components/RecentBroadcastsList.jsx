"use client"

import { Box, Card, CardContent, Typography, IconButton, Link } from "@mui/material"
import { MoreVert } from "@mui/icons-material"

export default function RecentBroadcastsList() {
  const recentBroadcasts = [
    {
      title: "Broadcast Title",
      time: "2 hours ago",
      sentTo: "Sent to: All Users",
    },
    {
      title: "Important Announcement",
      time: "1 day ago",
      sentTo: "Sent to: All Subscribers",
    },
    {
      title: "Product Update",
      time: "3 weeks ago",
      sentTo: "Sent to: Premium Users",
    },
    {
      title: "Event Reminder",
      time: "4 hours ago",
      sentTo: "Sent to: Attendees",
    },
    {
      title: "Holiday Sale",
      time: "1 week ago",
      sentTo: "Sent to: Subscribers",
    },
    {
      title: "New Feature Alert",
      time: "2 days ago",
      sentTo: "Sent to: Beta Testers",
    },
    {
      title: "Webinar Invitation",
      time: "6 hours ago",
      sentTo: "Sent to: Registrants",
    },
    {
      title: "Survey Request",
      time: "3 days ago",
      sentTo: "Sent to: Participants",
    },
  ]

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
          {recentBroadcasts.map((broadcast, index) => (
            <Box key={index}>
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
          ))}
        </Box>

        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Link
            href="#"
            sx={{
              color: "#da1818",
              textDecoration: "none",
              fontSize: { xs: "13px", sm: "14px" },
              fontWeight: 500,
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            Show more
          </Link>
        </Box>
      </CardContent>
    </Card>
  )
}
