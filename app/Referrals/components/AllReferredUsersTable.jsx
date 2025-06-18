"use client"

import { useState } from "react"
import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material"
import { KeyboardArrowDown } from "@mui/icons-material"

export default function AllReferredUsersTable() {
  const [filter, setFilter] = useState("Last 24h")

  const allReferredUsers = [
    {
      referrerName: "Sarah Ahmed",
      email: "sarah@email.com",
      referredUsers: 15,
      successfulReferrals: 13,
      rewardEarned: "$130",
      lastReferral: "12 May 2025",
    },
    {
      referrerName: "Omar Ali",
      email: "omar@email.com",
      referredUsers: 10,
      successfulReferrals: 9,
      rewardEarned: "$90",
      lastReferral: "10 May 2025",
    },
    {
      referrerName: "Riya Shah",
      email: "riya@email.com",
      referredUsers: 8,
      successfulReferrals: 8,
      rewardEarned: "$80",
      lastReferral: "11 May 2025",
    },
    {
      referrerName: "Jacob Smith",
      email: "jacob@email.com",
      referredUsers: 12,
      successfulReferrals: 10,
      rewardEarned: "$100",
      lastReferral: "09 May 2025",
    },
    {
      referrerName: "Olivia Brown",
      email: "olivia@email.com",
      referredUsers: 7,
      successfulReferrals: 6,
      rewardEarned: "$60",
      lastReferral: "08 May 2025",
    },
    {
      referrerName: "Emma Wilson",
      email: "emma@email.com",
      referredUsers: 9,
      successfulReferrals: 8,
      rewardEarned: "$80",
      lastReferral: "07 May 2025",
    },
  ]

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#000000", fontSize: { xs: "16px", sm: "18px" } }}>
            All Referred Users
          </Typography>
          <FormControl size="small">
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              sx={{
                minWidth: { xs: 80, sm: 100 },
                borderRadius: "8px",
                fontSize: { xs: "12px", sm: "14px" },
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
              <MenuItem value="Last 24h">Last 24h</MenuItem>
              <MenuItem value="Last Week">Last Week</MenuItem>
              <MenuItem value="Last Month">Last Month</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Paper
        elevation={0}
        sx={{
          bgcolor: "#ffffff",
          border: "1px solid #dadada",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <TableContainer sx={{ maxHeight: "400px", overflow: "auto" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f9f9f9" }}>
                {[
                  "Referrer Name",
                  "Email",
                  "Referred Users",
                  "Successful Referrals",
                  "Reward Earned",
                  "Last Referral",
                ].map((header) => (
                  <TableCell
                    key={header}
                    sx={{
                      color: "#8a8a8f",
                      fontWeight: 500,
                      fontSize: { xs: "12px", sm: "14px" },
                      borderBottom: "1px solid #dadada",
                      py: 1.5,
                      display:
                        header === "Successful Referrals" || header === "Last Referral"
                          ? { xs: "none", md: "table-cell" }
                          : "table-cell",
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {allReferredUsers.map((user, index) => (
                <TableRow
                  key={index}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    "&:hover": { bgcolor: "#f9f9f9" },
                  }}
                >
                  <TableCell sx={{ fontSize: { xs: "12px", sm: "14px" }, py: 1.5, fontWeight: 500 }}>
                    {user.referrerName}
                  </TableCell>
                  <TableCell sx={{ fontSize: { xs: "12px", sm: "14px" }, py: 1.5, color: "#da1818" }}>
                    {user.email}
                  </TableCell>
                  <TableCell sx={{ fontSize: { xs: "12px", sm: "14px" }, py: 1.5 }}>{user.referredUsers}</TableCell>
                  <TableCell
                    sx={{ fontSize: { xs: "12px", sm: "14px" }, py: 1.5, display: { xs: "none", md: "table-cell" } }}
                  >
                    {user.successfulReferrals}
                  </TableCell>
                  <TableCell sx={{ fontSize: { xs: "12px", sm: "14px" }, py: 1.5 }}>{user.rewardEarned}</TableCell>
                  <TableCell
                    sx={{ fontSize: { xs: "12px", sm: "14px" }, py: 1.5, display: { xs: "none", md: "table-cell" } }}
                  >
                    {user.lastReferral}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  )
}
