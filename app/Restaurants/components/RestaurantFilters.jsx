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
      flexDirection: { xs: "column", sm: "row" },
      alignItems: { xs: "stretch", sm: "center" }, 
      gap: { xs: 1.5, sm: 2, md: 2.5 }, 
      mb: { xs: 2, sm: 2.5, md: 3 },
      px: { xs: 0.5, sm: 0 },
    }}>
      {/* Search Field */}
      <TextField
        placeholder="Search Restaurant"
        size="small"
        value={searchTerm}
        onChange={handleSearchChange}
        sx={{
          width: { xs: "100%", sm: "100%", md: 320, lg: 350 },
          flex: { sm: "1 1 auto" },
          "& .MuiOutlinedInput-root": {
            bgcolor: "#ffffff",
            borderRadius: { xs: "6px", sm: "8px" },
            border: "1px solid #dadada",
            fontSize: { xs: "0.875rem", sm: "0.875rem", md: "0.9375rem" },
            height: { xs: "40px", sm: "42px", md: "44px" },
            "&:hover": {
              borderColor: "#c0c0c0",
            },
            "&.Mui-focused": {
              borderColor: "#da1818",
              boxShadow: "0 0 0 2px rgba(218, 24, 24, 0.1)",
            },
          },
          "& .MuiInputBase-input": {
            padding: { xs: "10px 12px", sm: "12px 14px" },
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start" sx={{ ml: { xs: 0.5, sm: 1 } }}>
              <SearchIcon sx={{ 
                color: "#8a8a8f",
                fontSize: { xs: "18px", sm: "20px" }
              }} />
            </InputAdornment>
          ),
        }}
      />
      
      {/* Filter Controls */}
      <Box sx={{ 
        display: "flex", 
        alignItems: "center", 
        gap: { xs: 1, sm: 1.5, md: 2 }, 
        ml: { sm: "auto" },
        flexWrap: { xs: "wrap", sm: "nowrap" },
        justifyContent: { xs: "space-between", sm: "flex-end" },
        width: { xs: "100%", sm: "auto" },
      }}>
        <Typography 
          variant="body2" 
          sx={{ 
            color: "#666666",
            fontSize: { xs: "0.75rem", sm: "0.8125rem", md: "0.875rem" },
            flexShrink: 0,
            fontWeight: 500,
            display: { xs: "none", sm: "block" },
          }}
        >
          Sort by
        </Typography>
        
        <FormControl size="small" sx={{ minWidth: { xs: "100px", sm: "110px", md: "120px" } }}>
          <Select
            value={sortBy}
            onChange={handleSortChange}
            sx={{ 
              borderRadius: { xs: "6px", sm: "8px" },
              fontSize: { xs: "0.75rem", sm: "0.8125rem", md: "0.875rem" },
              height: { xs: "36px", sm: "38px", md: "40px" },
              "& .MuiSelect-select": {
                padding: { xs: "8px 12px", sm: "10px 14px" },
              },
            }}
          >
            <MenuItem value="Name" sx={{ fontSize: { xs: "0.75rem", sm: "0.8125rem", md: "0.875rem" } }}>Name</MenuItem>
            <MenuItem value="Location" sx={{ fontSize: { xs: "0.75rem", sm: "0.8125rem", md: "0.875rem" } }}>Location</MenuItem>
            <MenuItem value="Rating" sx={{ fontSize: { xs: "0.75rem", sm: "0.8125rem", md: "0.875rem" } }}>Rating</MenuItem>
            <MenuItem value="Vouchers" sx={{ fontSize: { xs: "0.75rem", sm: "0.8125rem", md: "0.875rem" } }}>Vouchers</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl size="small" sx={{ minWidth: { xs: "100px", sm: "110px", md: "120px" } }}>
          <Select
            value={relevantFilter}
            onChange={handleFilterChange}
            sx={{ 
              borderRadius: { xs: "6px", sm: "8px" },
              fontSize: { xs: "0.75rem", sm: "0.8125rem", md: "0.875rem" },
              height: { xs: "36px", sm: "38px", md: "40px" },
              "& .MuiSelect-select": {
                padding: { xs: "8px 12px", sm: "10px 14px" },
              },
            }}
          >
            <MenuItem value="Relevant" sx={{ fontSize: { xs: "0.75rem", sm: "0.8125rem", md: "0.875rem" } }}>Relevant</MenuItem>
            <MenuItem value="Popular" sx={{ fontSize: { xs: "0.75rem", sm: "0.8125rem", md: "0.875rem" } }}>Popular</MenuItem>
            <MenuItem value="Recent" sx={{ fontSize: { xs: "0.75rem", sm: "0.8125rem", md: "0.875rem" } }}>Recent</MenuItem>
            <MenuItem value="Newest" sx={{ fontSize: { xs: "0.75rem", sm: "0.8125rem", md: "0.875rem" } }}>Newest</MenuItem>
          </Select>
        </FormControl>
        
        <IconButton 
          size="small"
          sx={{
            width: { xs: "36px", sm: "38px", md: "40px" },
            height: { xs: "36px", sm: "38px", md: "40px" },
            border: "1px solid #dadada",
            borderRadius: { xs: "6px", sm: "8px" },
            bgcolor: "#ffffff",
            "&:hover": {
              bgcolor: "#f5f5f5",
              borderColor: "#c0c0c0",
            },
          }}
        >
          <FilterList sx={{ 
            color: "#666666",
            fontSize: { xs: "18px", sm: "20px" }
          }} />
        </IconButton>
      </Box>
    </Box>
  )
}
