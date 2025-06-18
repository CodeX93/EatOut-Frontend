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

  const displayRestaurants = restaurants.length > 0 ? restaurants : defaultRestaurants

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
      borderRadius: "12px",
      width: "100%",
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
            fontSize: { xs: "1rem", sm: "1.25rem" },
          }}
        >
          {title}
        </Typography>
        <FormControl size="small">
          <Select 
            value={selectedPeriod} 
            onChange={handlePeriodChange}
            sx={{ 
              minWidth: { xs: 70, sm: 80 }, 
              borderRadius: "8px",
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
            }}
          >
            <MenuItem value="Today">Today</MenuItem>
            <MenuItem value="Week">Week</MenuItem>
            <MenuItem value="Month">Month</MenuItem>
            <MenuItem value="Year">Year</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <CardContent sx={{ pt: 0, p: { xs: 1.5, sm: 2 } }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 1.5, sm: 2 } }}>
          {displayRestaurants.map((restaurant, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 1.5, sm: 2 },
                p: { xs: 1.5, sm: 2 },
                borderRadius: "8px",
                bgcolor: restaurant.highlighted ? "#da1818" : "transparent",
                color: restaurant.highlighted ? "white" : "inherit",
                cursor: "pointer",
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: restaurant.highlighted ? "#c41515" : "#f5f5f5",
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
