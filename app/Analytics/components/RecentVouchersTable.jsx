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
    <Card sx={{ bgcolor: "#ffffff", border: "1px solid #dadada", borderRadius: "12px", overflow: "hidden", width: "100%", maxWidth: "100%", minWidth: "100%" }}>
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
        <TableContainer sx={{ height: "400px", overflow: "auto", width: "100%", maxWidth: "100%", minWidth: "100%", pb: 2 }}>
          <Table sx={{ width: "100%", minWidth: "100%" }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f9f9f9" }}>
                <TableCell sx={{ color: "#8a8a8f", fontWeight: 500, fontSize: "10px", borderBottom: "1px solid #dadada" }}>
                  Voucher Code
                </TableCell>
                <TableCell sx={{ color: "#8a8a8f", fontWeight: 500, fontSize: "10px", borderBottom: "1px solid #dadada" }}>
                  Title
                </TableCell>
                <TableCell sx={{ color: "#8a8a8f", fontWeight: 500, fontSize: "10px", borderBottom: "1px solid #dadada" }}>
                  User
                </TableCell>
                <TableCell sx={{ color: "#8a8a8f", fontWeight: 500, fontSize: "10px", borderBottom: "1px solid #dadada" }}>
                  Restaurant
                </TableCell>
                <TableCell sx={{ color: "#8a8a8f", fontWeight: 500, fontSize: "10px", borderBottom: "1px solid #dadada" }}>
                  Amount
                </TableCell>
                <TableCell sx={{ color: "#8a8a8f", fontWeight: 500, fontSize: "10px", borderBottom: "1px solid #dadada" }}>
                  Redeemed At
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {redemptions.map((redemption, index) => (
                <TableRow 
                  key={index}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    "&:hover": { bgcolor: "#f9f9f9" },
                  }}
                >
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
                  <TableCell sx={{ fontSize: "10px", fontWeight: 600 }}>
                    {redemption.amount > 0 ? `$${redemption.amount.toFixed(2)}` : "-"}
                  </TableCell>
                  <TableCell sx={{ fontSize: "10px" }}>
                    {formatDate(redemption.redeemedAt)}
                  </TableCell>
                </TableRow>
              ))}
              {/* Spacer row to ensure last row is fully visible */}
              <TableRow>
                <TableCell colSpan={6} sx={{ height: "20px", border: "none", p: 0 }} />
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Card>
  )
}