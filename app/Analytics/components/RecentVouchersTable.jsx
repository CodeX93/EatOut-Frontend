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

export default function RecentVouchersTable({ redemptions = [], onPeriodChange }) {
  const [selectedPeriod, setSelectedPeriod] = useState("Last 24h")

  const formatDate = (date) => {
    if (!date) return "-"
    return new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

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
      {redemptions.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="body2" sx={{ color: "#8a8a8f" }}>
            No recent redemptions found
          </Typography>
        </Box>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "#8a8a8f", fontWeight: 500, fontSize: "10px" }}>
                  Voucher Code
                </TableCell>
                <TableCell sx={{ color: "#8a8a8f", fontWeight: 500, fontSize: "10px" }}>
                  Title
                </TableCell>
                <TableCell sx={{ color: "#8a8a8f", fontWeight: 500, fontSize: "10px" }}>
                  User
                </TableCell>
                <TableCell sx={{ color: "#8a8a8f", fontWeight: 500, fontSize: "10px" }}>
                  Restaurant
                </TableCell>
                <TableCell sx={{ color: "#8a8a8f", fontWeight: 500, fontSize: "10px" }}>
                  Redeemed At
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {redemptions.map((redemption, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ fontSize: "10px", fontWeight: 600 }}>
                    {redemption.voucherCode || "-"}
                  </TableCell>
                  <TableCell sx={{ fontSize: "10px" }}>
                    {redemption.title || "-"}
                  </TableCell>
                  <TableCell sx={{ fontSize: "10px" }}>
                    {redemption.user || "-"}
                  </TableCell>
                  <TableCell sx={{ fontSize: "10px" }}>
                    {redemption.restaurant || "-"}
                  </TableCell>
                  <TableCell sx={{ fontSize: "10px" }}>
                    {formatDate(redemption.redeemedAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Card>
  )
}