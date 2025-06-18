"use client"

import { Box, TextField, InputAdornment, FormControl, Select, MenuItem, Typography, IconButton } from "@mui/material"
import { Search as SearchIcon, KeyboardArrowDown, TuneOutlined } from "@mui/icons-material"

export default function SearchAndFilters({ sortBy, setSortBy, relevantFilter, setRelevantFilter }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: { xs: "stretch", md: "center" },
        gap: 2,
        mb: 3,
      }}
    >
      <TextField
        placeholder="Search Vouchers"
        size="small"
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
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          ml: { xs: 0, md: "auto" },
          flexWrap: "wrap",
        }}
      >
        <Typography variant="body2" sx={{ color: "#666666", display: { xs: "none", sm: "block" } }}>
          Sort by
        </Typography>
        <FormControl size="small">
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            sx={{
              minWidth: 100,
              borderRadius: "8px",
              ".MuiOutlinedInput-notchedOutline": {
                borderColor: "#dadada",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#dadada",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#dadada",
              },
              ".MuiSvgIcon-root": {
                color: "#666666",
              },
            }}
            IconComponent={KeyboardArrowDown}
          >
            <MenuItem value="Name">Name</MenuItem>
            <MenuItem value="Date">Date</MenuItem>
            <MenuItem value="Usage">Usage</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small">
          <Select
            value={relevantFilter}
            onChange={(e) => setRelevantFilter(e.target.value)}
            sx={{
              minWidth: 100,
              borderRadius: "8px",
              ".MuiOutlinedInput-notchedOutline": {
                borderColor: "#dadada",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#dadada",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#dadada",
              },
              ".MuiSvgIcon-root": {
                color: "#666666",
              },
            }}
            IconComponent={KeyboardArrowDown}
          >
            <MenuItem value="Relevant">Relevant</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Expired">Expired</MenuItem>
          </Select>
        </FormControl>
        <IconButton sx={{ color: "#666666", border: "1px solid #dadada", borderRadius: "8px", p: 1 }}>
          <TuneOutlined fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  )
}
