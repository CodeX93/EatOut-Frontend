"use client"

import { useState } from "react"
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material"
import { Restaurant, Star } from "@mui/icons-material"

export default function PopularRestaurantsCard({ 
  restaurants = [], 
  title = "Popular Restaurants",
  onPeriodChange 
}) {
  const [selectedPeriod, setSelectedPeriod] = useState("Today")

  const defaultRestaurants = [
    { name: "KFC", rating: 4.7, reviews: 100, revenue: "$243,217", highlighted: false },
    { name: "McDonalds", rating: 4.8, reviews: 104, revenue: "$174,543", highlighted: false },
    { name: "Al Baik", rating: 4.7, reviews: 89, revenue: "$127,999", highlighted: true },
  ]

  const displayRestaurants = restaurants.length > 0 ? restaurants : []

  const handlePeriodChange = (event) => {
    const newPeriod = event.target.value
    setSelectedPeriod(newPeriod)
    if (onPeriodChange) {
      onPeriodChange(newPeriod)
    }
  }

  return (
    <Card sx={{ 
      bgcolor: "#ffffff", 
      border: "1px solid #dadada", 
      borderRadius: { xs: "8px", sm: "10px", md: "12px" },
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      boxShadow: { xs: "none", sm: "0 1px 3px rgba(0,0,0,0.1)" },
    }}>
      <Box sx={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: { xs: "flex-start", sm: "center" },
        flexDirection: { xs: "column", sm: "row" },
        gap: { xs: 1, sm: 0 },
        p: { xs: 1.5, sm: 2 },
      }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600, 
            color: "#da1818",
            fontSize: { xs: "0.875rem", sm: "1rem", md: "1.125rem", lg: "1.25rem" },
            lineHeight: 1.3,
          }}
        >
          {title}
        </Typography>
        <FormControl size="small">
          <Select 
            value={selectedPeriod} 
            onChange={handlePeriodChange}
            sx={{ 
              minWidth: { xs: "80px", sm: "90px", md: "100px" }, 
              borderRadius: { xs: "6px", sm: "8px" },
              fontSize: { xs: "0.75rem", sm: "0.8125rem", md: "0.875rem" },
              height: { xs: "32px", sm: "34px", md: "36px" },
              "& .MuiSelect-select": {
                padding: { xs: "6px 10px", sm: "8px 12px" },
              },
            }}
          >
            <MenuItem value="Today" sx={{ fontSize: { xs: "0.75rem", sm: "0.8125rem", md: "0.875rem" } }}>Today</MenuItem>
            <MenuItem value="Week" sx={{ fontSize: { xs: "0.75rem", sm: "0.8125rem", md: "0.875rem" } }}>Week</MenuItem>
            <MenuItem value="Month" sx={{ fontSize: { xs: "0.75rem", sm: "0.8125rem", md: "0.875rem" } }}>Month</MenuItem>
            <MenuItem value="Year" sx={{ fontSize: { xs: "0.75rem", sm: "0.8125rem", md: "0.875rem" } }}>Year</MenuItem>
            <MenuItem value="All" sx={{ fontSize: { xs: "0.75rem", sm: "0.8125rem", md: "0.875rem" } }}>All-time</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <CardContent sx={{ 
        pt: 0, 
        p: { xs: 1.5, sm: 1.5, md: 2 },
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}>
        <Box sx={{ 
          display: "flex", 
          flexDirection: "column", 
          gap: { xs: 1, sm: 1.25, md: 1.5 },
          flex: 1,
        }}>
          {displayRestaurants.length === 0 ? (
            <Box sx={{ textAlign: "center", color: "#8a8a8f", py: 3, fontSize: { xs: "12px", sm: "13px" } }}>
              No data for this period
            </Box>
          ) : displayRestaurants.map((restaurant, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 1.25, sm: 1.5, md: 2 },
                p: { xs: 1, sm: 1.25, md: 1.5 },
                borderRadius: { xs: "6px", sm: "8px" },
                bgcolor: restaurant.highlighted ? "#da1818" : "transparent",
                color: restaurant.highlighted ? "white" : "inherit",
                cursor: "pointer",
                transition: "all 0.2s ease",
                border: restaurant.highlighted ? "none" : "1px solid #f0f0f0",
                "&:hover": {
                  bgcolor: restaurant.highlighted ? "#c41515" : "#f8f8f8",
                  borderColor: restaurant.highlighted ? "none" : "#e0e0e0",
                  transform: "translateY(-1px)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                },
              }}
            >
              <Avatar
                sx={{
                  width: { xs: 32, sm: 40 },
                  height: { xs: 32, sm: 40 },
                  bgcolor: "#c8c7cc",
                  color: restaurant.highlighted ? "#da1818" : "#666666",
                }}
              >
                <Restaurant sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }} />
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontWeight: 500, 
                    fontSize: { xs: "0.75rem", sm: "14px" },
                    lineHeight: 1.2,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {restaurant.name}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.25 }}>
                  <Star sx={{ 
                    width: { xs: 10, sm: 12 }, 
                    height: { xs: 10, sm: 12 }, 
                    color: "#ffcc00" 
                  }} />
                  <Typography 
                    variant="body2" 
                    sx={{ fontSize: { xs: "0.625rem", sm: "11px" } }}
                  >
                    {restaurant.rating}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontSize: { xs: "0.625rem", sm: "11px" }, 
                      opacity: 0.7 
                    }}
                  >
                    ({restaurant.reviews})
                  </Typography>
                </Box>
              </Box>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: "bold",
                  fontSize: { xs: "0.75rem", sm: "14px" },
                  color: restaurant.highlighted ? "white" : "#00c17c",
                  flexShrink: 0,
                }}
              >
                {restaurant.revenue}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}
