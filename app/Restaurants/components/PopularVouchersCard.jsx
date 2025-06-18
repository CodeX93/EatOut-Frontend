"use client"

import { useState } from "react"
import {
  Box,
  Typography,
  Card,
  CardContent,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material"

import VoucherCard from "./VoucherCard"

export default function PopularVouchersCard({ 
  vouchers = [], 
  title = "Popular Vouchers",
  onPeriodChange 
}) {
  const [selectedPeriod, setSelectedPeriod] = useState("Today")

  const defaultVouchers = [
    { restaurant: "Al Baik", discount: "30% off", expiry: "30-02-2025" },
    { restaurant: "Al Baik", discount: "10% off", expiry: "30-02-2025" },
    { restaurant: "Al Baik", discount: "30% off", expiry: "30-02-2025" },
  ]

  const displayVouchers = vouchers.length > 0 ? vouchers : defaultVouchers

  const handlePeriodChange = (event) => {
    const newPeriod = event.target.value
    setSelectedPeriod(newPeriod)
    if (onPeriodChange) {
      onPeriodChange(newPeriod)
    }
  }

  const handleVoucherView = (voucher) => {
    console.log('View voucher:', voucher)
    // Handle voucher view logic here
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
          {displayVouchers.map((voucher, index) => (
            <VoucherCard
              key={index}
              voucher={voucher}
              onView={handleVoucherView}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}
