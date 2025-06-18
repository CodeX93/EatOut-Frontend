"use client"
import { useState, forwardRef, useImperativeHandle } from "react"
import { Box, Drawer, useMediaQuery, useTheme } from "@mui/material"
import { useRouter } from "next/navigation"
import { useAuth } from "../context/AuthContext"
import Link from "next/link"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import Typography from "@mui/material/Typography"
import GridViewIcon from "@mui/icons-material/GridView"
import InsightsIcon from "@mui/icons-material/Insights"
import RestaurantIcon from "@mui/icons-material/Restaurant"
import PeopleIcon from "@mui/icons-material/People"
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber"
import ShareIcon from "@mui/icons-material/Share"
import RamenDiningIcon from "@mui/icons-material/RamenDining"
import CampaignIcon from "@mui/icons-material/Campaign"
import LogoutIcon from "@mui/icons-material/Logout"

const SideNavbar = forwardRef((props, ref) => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const theme = useTheme()
  
  // Enhanced responsive breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"))
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"))
  
  const router = useRouter()
  const { logout } = useAuth()

  // Expose toggle function to parent components via ref
  useImperativeHandle(ref, () => ({
    toggleDrawer: () => {
      setMobileOpen(!mobileOpen)
    }
  }))

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleMenuItemClick = () => {
    // Close mobile drawer when menu item is clicked
    if (!isDesktop) {
      setMobileOpen(false)
    }
  }

  const menuItems = [
    { name: "Dashboard", icon: <GridViewIcon />, path: "/dashboard" },
    { name: "Analytics", icon: <InsightsIcon />, path: "/Analytics" },
    { name: "Restaurants", icon: <RestaurantIcon />, path: "/Restaurants" },
    { name: "Members", icon: <PeopleIcon />, path: "/members" },
    { name: "Vouchers", icon: <ConfirmationNumberIcon />, path: "/vouchers" },
    { name: "Referrals", icon: <ShareIcon />, path: "/Referrals" },
    { name: "Bowls", icon: <RamenDiningIcon />, path: "/Bowls" },
    { name: "Broadcast", icon: <CampaignIcon />, path: "/Broadcast" },
  ]

  // Dynamic width based on screen size
  const getDrawerWidth = () => {
    if (isMobile) return 280
    if (isTablet) return 260
    return 240
  }

  const drawerWidth = getDrawerWidth()

  const drawer = (
    <Box
      sx={{
        width: drawerWidth,
        bgcolor: "#ffffff",
        height: "100%",
        borderRight: "1px solid #e0e0e0",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Logo Section - Matching your Header's E.A.T branding */}
      <Box
        sx={{
          p: { xs: 3, sm: 2.5, md: 2 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: "1px solid #e0e0e0",
          minHeight: { xs: 72, sm: 68, md: 64 }, // Match header heights
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: { xs: 36, sm: 34, md: 32 },
              height: { xs: 36, sm: 34, md: 32 },
              bgcolor: "#da1818",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography 
              sx={{ 
                color: "white", 
                fontWeight: "bold", 
                fontSize: { xs: "16px", sm: "15px", md: "14px" }
              }}
            >
              E
            </Typography>
          </Box>
          <Typography 
            sx={{ 
              fontWeight: "bold", 
              color: "#da1818", 
              fontSize: { xs: "20px", sm: "19px", md: "18px" }
            }}
          >
            E.A.T
          </Typography>
        </Box>
      </Box>

      {/* Navigation Links */}
      <List 
        sx={{ 
          py: { xs: 3, sm: 2.5, md: 2 }, 
          flexGrow: 1, 
          px: { xs: 2, sm: 1.5, md: 1 }
        }}
      >
        {menuItems.map((item) => (
          <ListItem key={item.name} disablePadding sx={{ mb: { xs: 1, sm: 0.75, md: 0.5 } }}>
            <ListItemButton
              component={Link}
              href={item.path}
              onClick={handleMenuItemClick}
              sx={{
                borderRadius: { xs: "12px", sm: "10px", md: "8px" },
                mx: { xs: 1, sm: 0.75, md: 0.5 },
                py: { xs: 2, sm: 1.75, md: 1.5 },
                px: { xs: 2, sm: 1.5, md: 1 },
                color: "#666666",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  bgcolor: "#f5f5f5",
                  transform: "translateX(4px)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                },
                "&:active": {
                  bgcolor: "#e0e0e0",
                  transform: "translateX(2px)",
                },
              }}
            >
              <ListItemIcon 
                sx={{ 
                  minWidth: { xs: 52, sm: 46, md: 40 }, 
                  color: "#666666",
                  "& .MuiSvgIcon-root": {
                    fontSize: { xs: "26px", sm: "22px", md: "20px" }
                  }
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontSize: { xs: "17px", sm: "15px", md: "14px" },
                      fontWeight: 500,
                      lineHeight: 1.2,
                    }}
                  >
                    {item.name}
                  </Typography>
                } 
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Logout Button */}
      <Box sx={{ p: { xs: 3, sm: 2.5, md: 2 }, borderTop: "1px solid #e0e0e0" }}>
        <ListItemButton
          onClick={() => {
            handleLogout()
            handleMenuItemClick()
          }}
          sx={{
            borderRadius: { xs: "12px", sm: "10px", md: "8px" },
            py: { xs: 2, sm: 1.75, md: 1.5 },
            px: { xs: 2, sm: 1.5, md: 1 },
            color: "#d32f2f",
            transition: "all 0.3s ease-in-out",
            "&:hover": {
              bgcolor: "#ffebee",
              transform: "translateX(4px)",
              boxShadow: "0 2px 8px rgba(211,47,47,0.2)",
            },
          }}
        >
          <ListItemIcon 
            sx={{ 
              minWidth: { xs: 52, sm: 46, md: 40 }, 
              color: "#d32f2f",
              "& .MuiSvgIcon-root": {
                fontSize: { xs: "26px", sm: "22px", md: "20px" }
              }
            }}
          >
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText 
            primary={
              <Typography 
                variant="body2" 
                sx={{ 
                  fontSize: { xs: "17px", sm: "15px", md: "14px" },
                  fontWeight: 500,
                  lineHeight: 1.2,
                }}
              >
                Logout
              </Typography>
            } 
          />
        </ListItemButton>
      </Box>
    </Box>
  )

  return (
    <>
      {/* Desktop Sidebar - Fixed positioned */}
      <Box
        component="nav"
        sx={{
          width: { md: drawerWidth },
          flexShrink: { md: 0 },
          display: { xs: "none", md: "block" },
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          zIndex: theme.zIndex.drawer,
          borderRight: "1px solid #e0e0e0",
        }}
      >
        {drawer}
      </Box>

      {/* Mobile/Tablet Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { 
            boxSizing: "border-box", 
            width: drawerWidth,
            borderRadius: { 
              xs: "0 20px 20px 0", 
              sm: "0 16px 16px 0" 
            },
            boxShadow: { 
              xs: "0 8px 32px rgba(0,0,0,0.2)", 
              sm: "0 4px 24px rgba(0,0,0,0.15)" 
            },
          },
          "& .MuiBackdrop-root": {
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(6px)",
            transition: "all 0.3s ease-in-out",
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  )
})

SideNavbar.displayName = "SideNavbar"

export default SideNavbar