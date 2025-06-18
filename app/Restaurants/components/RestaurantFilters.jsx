"use client"

import { useState } from "react"
import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material"
import { Search as SearchIcon, FilterList } from "@mui/icons-material"

export default function RestaurantFilters({ 
  onSearchChange, 
  onSortChange, 
  onFilterChange 
}) {
  const [sortBy, setSortBy] = useState("Name")
  const [relevantFilter, setRelevantFilter] = useState("Relevant")
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearchChange = (event) => {
    const value = event.target.value
    setSearchTerm(value)
    if (onSearchChange) {
      onSearchChange(value)
    }
  }

  const handleSortChange = (event) => {
    const value = event.target.value
    setSortBy(value)
    if (onSortChange) {
      onSortChange(value)
    }
  }

  const handleFilterChange = (event) => {
    const value = event.target.value
    setRelevantFilter(value)
    if (onFilterChange) {
      onFilterChange(value)
    }
  }

  return (
    <Box sx={{ 
      display: "flex", 
      flexDirection: { xs: "column", md: "row" },
      alignItems: { xs: "stretch", md: "center" }, 
      gap: { xs: 2, md: 2 }, 
      mb: 3,
    }}>
      <TextField
        placeholder="Search Restaurant"
        size="small"
        value={searchTerm}
        onChange={handleSearchChange}
        sx={{
          width: { xs: "100%", md: 300 },
          "& .MuiOutlinedInput-root": {
            bgcolor: "#ffffff",
            borderRadius: "8px",
            border: "1px solid #dadada",
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
      <Box sx={{ 
        display: "flex", 
        alignItems: "center", 
        gap: { xs: 1, sm: 1 }, 
        ml: { md: "auto" },
        flexWrap: { xs: "wrap", sm: "nowrap" },
      }}>
        <Typography 
          variant="body2" 
          sx={{ 
            color: "#666666",
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
            flexShrink: 0,
          }}
        >
          Sort by
        </Typography>
        <FormControl size="small">
          <Select
            value={sortBy}
            onChange={handleSortChange}
            sx={{ 
              minWidth: { xs: 80, sm: 100 }, 
              borderRadius: "8px",
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
            }}
          >
            <MenuItem value="Name">Name</MenuItem>
            <MenuItem value="Location">Location</MenuItem>
            <MenuItem value="Rating">Rating</MenuItem>
            <MenuItem value="Vouchers">Vouchers</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small">
          <Select
            value={relevantFilter}
            onChange={handleFilterChange}
            sx={{ 
              minWidth: { xs: 80, sm: 100 }, 
              borderRadius: "8px",
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
            }}
          >
            <MenuItem value="Relevant">Relevant</MenuItem>
            <MenuItem value="Popular">Popular</MenuItem>
            <MenuItem value="Recent">Recent</MenuItem>
            <MenuItem value="Newest">Newest</MenuItem>
          </Select>
        </FormControl>
        <IconButton size="small">
          <FilterList sx={{ color: "#666666" }} />
        </IconButton>
      </Box>
    </Box>
  )
}
