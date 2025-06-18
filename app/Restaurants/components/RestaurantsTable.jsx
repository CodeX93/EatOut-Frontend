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
    console.log('View restaurant:', restaurant)
    // Navigate to restaurant view page
    router.push(`/Restaurants/resturant-sub/view?id=${index}&name=${encodeURIComponent(restaurant.name)}&action=view`)
  }

  const handleViewEdit = (restaurant, index) => {
    console.log('Edit restaurant:', restaurant)
    // Navigate to restaurant edit page
    router.push(`/Restaurants/resturant-sub/edit?id=${index}&name=${encodeURIComponent(restaurant.name)}&action=edit`)
  }

  const handleDelete = (restaurant, index) => {
    console.log('Delete restaurant:', restaurant)
    // Navigate to restaurant delete page (same route as requested)
    router.push(`/Restaurants/resturant-sub/delete?id=${index}&name=${encodeURIComponent(restaurant.name)}&action=delete`)
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
      <Box sx={{ mb: 2 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600, 
            color: "#000000",
            fontSize: { xs: "1rem", sm: "1.25rem" },
          }}
        >
          {title}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: "#8a8a8f",
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
          }}
        >
          {subtitle}
        </Typography>
      </Box>

      {/* Restaurants Table */}
      <Card sx={{ 
        bgcolor: "#ffffff", 
        border: "1px solid #dadada", 
        borderRadius: "12px", 
        mb: 3,
        overflow: "hidden",
      }}>
        <TableContainer sx={{ 
          overflowX: "auto",
          maxWidth: "100%",
        }}>
          <Table sx={{ minWidth: { xs: 600, sm: 650 } }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ 
                  color: "#8a8a8f", 
                  fontWeight: 500, 
                  fontSize: { xs: "0.625rem", sm: "12px" },
                  minWidth: { xs: 120, sm: 150 },
                }}>
                  Name & Address
                </TableCell>
                <TableCell sx={{ 
                  color: "#8a8a8f", 
                  fontWeight: 500, 
                  fontSize: { xs: "0.625rem", sm: "12px" },
                  minWidth: { xs: 80, sm: 100 },
                }}>
                  Location
                </TableCell>
                <TableCell sx={{ 
                  color: "#8a8a8f", 
                  fontWeight: 500, 
                  fontSize: { xs: "0.625rem", sm: "12px" },
                  minWidth: { xs: 100, sm: 120 },
                }}>
                  Telephone
                </TableCell>
                <TableCell sx={{ 
                  color: "#8a8a8f", 
                  fontWeight: 500, 
                  fontSize: { xs: "0.625rem", sm: "12px" },
                  minWidth: { xs: 70, sm: 80 },
                }}>
                  Vouchers
                </TableCell>
                <TableCell sx={{ 
                  color: "#8a8a8f", 
                  fontWeight: 500, 
                  fontSize: { xs: "0.625rem", sm: "12px" },
                  minWidth: { xs: 70, sm: 80 },
                }}>
                  Redeemed
                </TableCell>
                <TableCell sx={{ 
                  color: "#8a8a8f", 
                  fontWeight: 500, 
                  fontSize: { xs: "0.625rem", sm: "12px" },
                  minWidth: { xs: 100, sm: 120 },
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
