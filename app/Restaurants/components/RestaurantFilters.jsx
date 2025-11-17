"use client"

import { useEffect, useState } from "react"
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
} from "@mui/material"
import { Search as SearchIcon } from "@mui/icons-material"

export default function RestaurantFilters({
  searchTerm = "",
  onSearchChange,
  locations = [],
  selectedLocation = "All",
  onLocationChange,
  cuisines = [],
  selectedCuisine = "All",
  onCuisineChange,
  sortConfig = { orderBy: "name", order: "asc" },
  onSortChange,
}) {
  const [internalSearch, setInternalSearch] = useState(searchTerm)

  useEffect(() => {
    setInternalSearch(searchTerm)
  }, [searchTerm])

  const handleSearchChange = (event) => {
    const value = event.target.value
    setInternalSearch(value)
    onSearchChange?.(value)
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "stretch", sm: "center" },
        gap: { xs: 1.5, sm: 2, md: 2.5 },
        mb: { xs: 2, sm: 2.5, md: 3 },
        px: { xs: 0.5, sm: 0 },
        flexWrap: "wrap",
      }}
    >
      <TextField
        placeholder="Search Restaurant"
        size="small"
        value={internalSearch}
        onChange={handleSearchChange}
        sx={{
          width: { xs: "100%", sm: 260, md: 320, lg: 350 },
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
              <SearchIcon
                sx={{
                  color: "#8a8a8f",
                  fontSize: { xs: "18px", sm: "20px" },
                }}
              />
            </InputAdornment>
          ),
        }}
      />

      <FormControl
        size="small"
        sx={{
          minWidth: { xs: "100%", sm: 150, md: 170 },
        }}
      >
        <Select
          value={selectedLocation}
          onChange={(event) => onLocationChange?.(event.target.value)}
          sx={{
            borderRadius: { xs: "6px", sm: "8px" },
            fontSize: { xs: "0.75rem", sm: "0.8125rem", md: "0.875rem" },
            height: { xs: "36px", sm: "38px", md: "40px" },
            "& .MuiSelect-select": {
              padding: { xs: "8px 12px", sm: "10px 14px" },
            },
          }}
        >
          {(locations.length > 0 ? locations : ["All"]).map((location) => (
            <MenuItem
              key={location}
              value={location}
              sx={{ fontSize: { xs: "0.75rem", sm: "0.8125rem", md: "0.875rem" } }}
            >
              {location}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl
        size="small"
        sx={{
          minWidth: { xs: "100%", sm: 150, md: 170 },
        }}
      >
        <Select
          value={selectedCuisine}
          onChange={(event) => onCuisineChange?.(event.target.value)}
          sx={{
            borderRadius: { xs: "6px", sm: "8px" },
            fontSize: { xs: "0.75rem", sm: "0.8125rem", md: "0.875rem" },
            height: { xs: "36px", sm: "38px", md: "40px" },
            "& .MuiSelect-select": {
              padding: { xs: "8px 12px", sm: "10px 14px" },
            },
          }}
        >
          {(cuisines.length > 0 ? cuisines : ["All"]).map((cuisine) => (
            <MenuItem
              key={cuisine}
              value={cuisine}
              sx={{ fontSize: { xs: "0.75rem", sm: "0.8125rem", md: "0.875rem" } }}
            >
              {cuisine}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl
        size="small"
        sx={{
          minWidth: { xs: "100%", sm: 160, md: 180 },
        }}
      >
        <Select
          value={sortConfig.orderBy}
          onChange={(event) => onSortChange?.(event.target.value)}
          sx={{
            borderRadius: { xs: "6px", sm: "8px" },
            fontSize: { xs: "0.75rem", sm: "0.8125rem", md: "0.875rem" },
            height: { xs: "36px", sm: "38px", md: "40px" },
            "& .MuiSelect-select": {
              padding: { xs: "8px 12px", sm: "10px 14px" },
            },
          }}
        >
          <MenuItem value="name" sx={{ fontSize: { xs: "0.75rem", sm: "0.8125rem", md: "0.875rem" } }}>
            Sort by: Name
          </MenuItem>
          <MenuItem value="email" sx={{ fontSize: { xs: "0.75rem", sm: "0.8125rem", md: "0.875rem" } }}>
            Sort by: Email
          </MenuItem>
          <MenuItem value="cuisine" sx={{ fontSize: { xs: "0.75rem", sm: "0.8125rem", md: "0.875rem" } }}>
            Sort by: Cuisine
          </MenuItem>
          <MenuItem value="location" sx={{ fontSize: { xs: "0.75rem", sm: "0.8125rem", md: "0.875rem" } }}>
            Sort by: Location
          </MenuItem>
          <MenuItem value="phone" sx={{ fontSize: { xs: "0.75rem", sm: "0.8125rem", md: "0.875rem" } }}>
            Sort by: Telephone
          </MenuItem>
          <MenuItem value="vouchers" sx={{ fontSize: { xs: "0.75rem", sm: "0.8125rem", md: "0.875rem" } }}>
            Sort by: Active Vouchers
          </MenuItem>
        </Select>
      </FormControl>
    </Box>
  )
}
