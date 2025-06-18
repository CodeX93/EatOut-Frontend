"use client"
import { useState } from "react"
import {
  Box,
  Typography,
  Card,
  Chip,
  FormControl,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material"

export default function RecentVouchersTable({ vouchers = [], onPeriodChange }) {
  const [selectedPeriod, setSelectedPeriod] = useState("Last 24h")

  const defaultVouchers = [
    {
      code: "SAVE10",
      times: "112 times",
      discount: "$1,120",
      revenue: "$8,400",
      lastUsed: "13 May, 2025",
      status: "Active",
    },
    {
      code: "FIRSTBUY",
      times: "86 times",
      discount: "$860",
      revenue: "$6,100",
      lastUsed: "12 May, 2025",
      status: "Expired",
    },
    {
      code: "FREESHIP",
      times: "150 times",
      discount: "$0",
      revenue: "$5,200",
      lastUsed: "14 May, 2025",
      status: "Active",
    },
  ]

  const tableData = vouchers.length > 0 ? vouchers : defaultVouchers

  const handlePeriodChange = (event) => {
    const newPeriod = event.target.value
    setSelectedPeriod(newPeriod)
    if (onPeriodChange) {
      onPeriodChange(newPeriod)
    }
  }

  return (
    <Card sx={{ bgcolor: "#ffffff", border: "1px solid #dadada", borderRadius: "12px" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Recent redeemed vouchers
        </Typography>
        <FormControl size="small">
          <Select 
            value={selectedPeriod} 
            onChange={handlePeriodChange}
            sx={{ minWidth: 100, borderRadius: "8px" }}
          >
            <MenuItem value="Last 24h">Last 24h</MenuItem>
            <MenuItem value="Last 7d">Last 7d</MenuItem>
            <MenuItem value="Last 30d">Last 30d</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "#8a8a8f", fontWeight: 500, fontSize: "10px" }}>
                Voucher Code
              </TableCell>
              <TableCell sx={{ color: "#8a8a8f", fontWeight: 500, fontSize: "10px" }}>
                Times Redeemed
              </TableCell>
              <TableCell sx={{ color: "#8a8a8f", fontWeight: 500, fontSize: "10px" }}>
                Total Discount
              </TableCell>
              <TableCell sx={{ color: "#8a8a8f", fontWeight: 500, fontSize: "10px" }}>
                Total Revenue
              </TableCell>
              <TableCell sx={{ color: "#8a8a8f", fontWeight: 500, fontSize: "10px" }}>
                Last Used
              </TableCell>
              <TableCell sx={{ color: "#8a8a8f", fontWeight: 500, fontSize: "10px" }}>
                Status
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((voucher, index) => (
              <TableRow key={index}>
                <TableCell sx={{ fontSize: "10px" }}>{voucher.code}</TableCell>
                <TableCell sx={{ fontSize: "10px" }}>{voucher.times}</TableCell>
                <TableCell sx={{ fontSize: "10px" }}>{voucher.discount}</TableCell>
                <TableCell sx={{ fontSize: "10px" }}>{voucher.revenue}</TableCell>
                <TableCell sx={{ fontSize: "10px" }}>{voucher.lastUsed}</TableCell>
                <TableCell>
                  <Chip
                    label={voucher.status}
                    size="small"
                    sx={{
                      bgcolor: voucher.status === "Active" ? "#e8f5e8" : "#ffeaea",
                      color: voucher.status === "Active" ? "#00c17c" : "#da1818",
                      fontWeight: 500,
                      fontSize: "8px",
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  )
}