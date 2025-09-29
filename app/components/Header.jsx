"use client"

import { useState } from "react"
import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material"
import {
  Search as SearchIcon,
  CalendarToday,
  Notifications,
  Menu as MenuIcon,
  Logout,
} from "@mui/icons-material"
import Image from "next/image"
import Link from "next/link"

export default function Header({ onMenuClick }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"))
  const isMedium = useMediaQuery(theme.breakpoints.up("md"))

  // State for dropdown menus
  const [notificationAnchor, setNotificationAnchor] = useState(null)
  const [profileAnchor, setProfileAnchor] = useState(null)

  const handleNotificationClick = (event) => {
    setNotificationAnchor(event.currentTarget)
  }

  const handleProfileClick = (event) => {
    setProfileAnchor(event.currentTarget)
  }

  const handleNotificationClose = () => {
    setNotificationAnchor(null)
  }

  const handleProfileClose = () => {
    setProfileAnchor(null)
  }

  const handleLogout = () => {
    // Add logout logic here
    console.log("Logout clicked")
    handleProfileClose()
  }

  // Use theme's toolbar minHeight for logo height
  const toolbarMinHeight = (theme.mixins.toolbar?.minHeight || 64) + 16;

  // Enlarge logo: 1.5x toolbar height
  const enlargedLogoHeight = toolbarMinHeight * 1.5;
  const headerCardRadius = 20;
  const headerCardShadow = '0 2px 12px 0 rgba(0,0,0,0.04)';

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: "#ffffff",
        color: "#000000",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        borderBottom: "1px solid #dadada",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", px: { xs: 1, sm: 3 }, minHeight: { xs: toolbarMinHeight, sm: toolbarMinHeight, md: toolbarMinHeight } }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 3 } }}>
          {isMobile && (
            <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={onMenuClick} sx={{ mr: 1 }}>
              <MenuIcon />
            </IconButton>
          )}

          <Link href="/dashboard" style={{ textDecoration: 'none' }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, height: toolbarMinHeight, cursor: 'pointer' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Image
                  src="/logo.svg"
                  alt="E.A.T Logo"
                  height={enlargedLogoHeight}
                  width={enlargedLogoHeight}
                  style={{ objectFit: 'contain', height: enlargedLogoHeight, width: "auto", marginTop: -(enlargedLogoHeight - toolbarMinHeight) / 2, marginBottom: -(enlargedLogoHeight - toolbarMinHeight) / 2 }}
                />
               
              </Box>
            </Box>
          </Link>

          {!isSmall && (
            <TextField
              placeholder="Search"
              size="small"
              sx={{
                width: { sm: 260, md: 400 },
                borderRadius: '32px',
                background: '#fafafb',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '32px',
                  bgcolor: '#fafafb',
                  border: 'none',
                  fontSize: '1rem',
                  '& fieldset': { border: 'none' },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#b0b0b0' }} />
                  </InputAdornment>
                ),
              }}
            />
          )}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 2 } }}>
          {!isSmall && (
            <Button
              variant="text"
              startIcon={<CalendarToday />}
              sx={{
                color: "#666666",
                textTransform: "none",
                display: { xs: "none", md: "flex" },
              }}
            >
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </Button>
          )}

          <IconButton 
            size={isSmall ? "small" : "medium"}
            onClick={handleNotificationClick}
          >
            <Notifications sx={{ color: "#666666" }} />
          </IconButton>

          <IconButton 
            size={isSmall ? "small" : "medium"}
            onClick={handleProfileClick}
          >
            <Avatar
              sx={{
                width: isSmall ? 28 : 32,
                height: isSmall ? 28 : 32,
                bgcolor: "#c8c7cc",
                color: "#666666",
                cursor: "pointer",
              }}
            >
              A
            </Avatar>
          </IconButton>
        </Box>
      </Toolbar>

      {/* Notification Dropdown */}
      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleNotificationClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 300,
            maxHeight: 400,
            overflow: "auto",
          },
        }}
      >
        <MenuItem onClick={handleNotificationClose}>
          <ListItemText 
            primary="New voucher available" 
            secondary="2 minutes ago"
          />
        </MenuItem>
        <MenuItem onClick={handleNotificationClose}>
          <ListItemText 
            primary="Restaurant added new menu" 
            secondary="1 hour ago"
          />
        </MenuItem>
        <MenuItem onClick={handleNotificationClose}>
          <ListItemText 
            primary="Weekly report ready" 
            secondary="3 hours ago"
          />
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleNotificationClose}>
          <ListItemText 
            primary="View all notifications" 
            sx={{ textAlign: "center", color: "primary.main" }}
          />
        </MenuItem>
      </Menu>

      {/* Profile Dropdown */}
      <Menu
        anchorEl={profileAnchor}
        open={Boolean(profileAnchor)}
        onClose={handleProfileClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 150,
          },
        }}
      >
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" sx={{ color: "#da1818" }} />
          </ListItemIcon>
          <ListItemText primary="Logout" sx={{ color: "#da1818" }} />
        </MenuItem>
      </Menu>
    </AppBar>
  )
}
