"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Box,
  Typography,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material"

import RestaurantFilters from "./RestaurantFilters"
import RestaurantTableRow from "./RestaurantTableRow"

export default function RestaurantsTable({ 
  restaurants = [], 
  title = "Account list",
  subtitle = "51 Restaurants from 6 Categories"
}) {
  const router = useRouter()
  const [filteredRestaurants, setFilteredRestaurants] = useState(restaurants)

  const handleSearchChange = (searchTerm) => {
    if (!searchTerm) {
      setFilteredRestaurants(restaurants)
      return
    }
    
    const filtered = restaurants.filter(restaurant =>
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.address.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredRestaurants(filtered)
  }

  const handleSortChange = (sortBy) => {
    const sorted = [...filteredRestaurants].sort((a, b) => {
      switch (sortBy) {
        case "Name":
          return a.name.localeCompare(b.name)
        case "Location":
          return a.location.localeCompare(b.location)
        case "Vouchers":
          return b.vouchers - a.vouchers
        default:
          return 0
      }
    })
    setFilteredRestaurants(sorted)
  }

  const handleFilterChange = (filter) => {
    // Handle filter logic based on the filter type
    console.log('Filter changed to:', filter)
    // You can implement specific filtering logic here
  }

  const handleView = (restaurant, index) => {
    router.push(`/Restaurants/resturant-sub/view?id=${restaurant.id}&name=${encodeURIComponent(restaurant.name)}&action=view`)
  }

  const handleViewEdit = (restaurant, index) => {
    router.push(`/Restaurants/resturant-sub/edit?id=${restaurant.id}&name=${encodeURIComponent(restaurant.name)}&action=edit`)
  }

  const handleDelete = (restaurant, index) => {
    router.push(`/Restaurants/resturant-sub/delete?id=${restaurant.id}&name=${encodeURIComponent(restaurant.name)}&action=delete`)
  }

  return (
    <Box sx={{ width: "100%", overflow: "hidden" }}>
      {/* Filters */}
      <RestaurantFilters
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange}
        onFilterChange={handleFilterChange}
      />

      {/* Table Header */}
      <Box sx={{ 
        mb: { xs: 1.5, sm: 2, md: 2.5 },
        px: { xs: 0.5, sm: 0 }
      }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600, 
            color: "#000000",
            fontSize: { xs: "0.875rem", sm: "1rem", md: "1.125rem", lg: "1.25rem" },
            lineHeight: 1.3,
            mb: { xs: 0.5, sm: 1 }
          }}
        >
          {title}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: "#8a8a8f",
            fontSize: { xs: "0.6875rem", sm: "0.75rem", md: "0.8125rem", lg: "0.875rem" },
            lineHeight: 1.4,
          }}
        >
          {subtitle}
        </Typography>
      </Box>

      {/* Restaurants Table */}
      <Card sx={{ 
        bgcolor: "#ffffff", 
        border: "1px solid #dadada", 
        borderRadius: { xs: "8px", sm: "10px", md: "12px" }, 
        mb: { xs: 2, sm: 2.5, md: 3 },
        overflow: "hidden",
        boxShadow: { xs: "none", sm: "0 1px 3px rgba(0,0,0,0.1)" },
      }}>
        <TableContainer sx={{ 
          overflowX: "auto",
          maxWidth: "100%",
          "&::-webkit-scrollbar": {
            height: { xs: "4px", sm: "6px" },
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#f1f1f1",
            borderRadius: "3px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#dadada",
            borderRadius: "3px",
            "&:hover": {
              backgroundColor: "#c0c0c0",
            },
          },
        }}>
          <Table sx={{ 
            minWidth: { xs: 700, sm: 750, md: 800 },
            "& .MuiTableCell-root": {
              padding: { xs: "8px 6px", sm: "12px 8px", md: "16px 12px" },
            },
          }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#fafafa" }}>
                <TableCell sx={{ 
                  color: "#8a8a8f", 
                  fontWeight: 600, 
                  fontSize: { xs: "0.625rem", sm: "0.6875rem", md: "0.75rem" },
                  minWidth: { xs: 140, sm: 160, md: 180 },
                  borderBottom: "2px solid #e0e0e0",
                }}>
                  Name & Address
                </TableCell>
                <TableCell sx={{ 
                  color: "#8a8a8f", 
                  fontWeight: 600, 
                  fontSize: { xs: "0.625rem", sm: "0.6875rem", md: "0.75rem" },
                  minWidth: { xs: 90, sm: 110, md: 130 },
                  borderBottom: "2px solid #e0e0e0",
                }}>
                  Location
                </TableCell>
                <TableCell sx={{ 
                  color: "#8a8a8f", 
                  fontWeight: 600, 
                  fontSize: { xs: "0.625rem", sm: "0.6875rem", md: "0.75rem" },
                  minWidth: { xs: 110, sm: 130, md: 150 },
                  borderBottom: "2px solid #e0e0e0",
                }}>
                  Telephone
                </TableCell>
                <TableCell sx={{ 
                  color: "#8a8a8f", 
                  fontWeight: 600, 
                  fontSize: { xs: "0.625rem", sm: "0.6875rem", md: "0.75rem" },
                  minWidth: { xs: 80, sm: 90, md: 100 },
                  borderBottom: "2px solid #e0e0e0",
                }}>
                  Vouchers
                </TableCell>
                <TableCell sx={{ 
                  color: "#8a8a8f", 
                  fontWeight: 600, 
                  fontSize: { xs: "0.625rem", sm: "0.6875rem", md: "0.75rem" },
                  minWidth: { xs: 80, sm: 90, md: 100 },
                  borderBottom: "2px solid #e0e0e0",
                }}>
                  Redeemed
                </TableCell>
                <TableCell sx={{ 
                  color: "#8a8a8f", 
                  fontWeight: 600, 
                  fontSize: { xs: "0.625rem", sm: "0.6875rem", md: "0.75rem" },
                  minWidth: { xs: 110, sm: 130, md: 150 },
                  borderBottom: "2px solid #e0e0e0",
                }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRestaurants.map((restaurant, index) => (
                <RestaurantTableRow
                  key={index}
                  restaurant={restaurant}
                  index={index}
                  onView={handleView}
                  onEdit={handleViewEdit}
                  onDelete={handleDelete}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ 
          display: "flex", 
          justifyContent: "center", 
          p: { xs: 1.5, sm: 2 },
        }}>
          <Button
            variant="contained"
            sx={{
              bgcolor: "#da1818",
              color: "white",
              borderRadius: "20px",
              px: { xs: 2, sm: 3 },
              textTransform: "none",
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
              "&:hover": {
                bgcolor: "#c41515",
              },
            }}
          >
            {filteredRestaurants.length} Accounts
          </Button>
        </Box>
      </Card>
    </Box>
  )
}
