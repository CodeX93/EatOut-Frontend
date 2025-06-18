"use client"

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
} from "@mui/material"
import {
  Search as SearchIcon,
  CalendarToday,
  KeyboardArrowDown,
  Notifications,
  Settings,
  Menu as MenuIcon,
} from "@mui/icons-material"

export default function Header({ onMenuClick }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"))

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
      <Toolbar sx={{ justifyContent: "space-between", px: { xs: 1, sm: 3 } }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 3 } }}>
          {isMobile && (
            <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={onMenuClick} sx={{ mr: 1 }}>
              <MenuIcon />
            </IconButton>
          )}

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                bgcolor: "#da1818",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography sx={{ color: "white", fontWeight: "bold", fontSize: "14px" }}>E</Typography>
            </Box>
            <Typography sx={{ fontWeight: "bold", color: "#da1818", fontSize: "18px" }}>E.A.T</Typography>
          </Box>

          {!isSmall && (
            <TextField
              placeholder="Search"
              size="small"
              sx={{
                width: { sm: 200, md: 320 },
                "& .MuiOutlinedInput-root": {
                  bgcolor: "#efeff4",
                  borderRadius: "8px",
                  border: "none",
                  "& fieldset": { border: "none" },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#8a8a8f" }} />
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
              endIcon={<KeyboardArrowDown />}
              sx={{
                color: "#666666",
                textTransform: "none",
                display: { xs: "none", md: "flex" },
              }}
            >
              Wed 29 May 2026
            </Button>
          )}

          <IconButton size={isSmall ? "small" : "medium"}>
            <Notifications sx={{ color: "#666666" }} />
          </IconButton>

          <IconButton size={isSmall ? "small" : "medium"}>
            <Settings sx={{ color: "#666666" }} />
          </IconButton>

          <Avatar
            sx={{
              width: isSmall ? 28 : 32,
              height: isSmall ? 28 : 32,
              bgcolor: "#c8c7cc",
              color: "#666666",
            }}
          >
            JD
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
