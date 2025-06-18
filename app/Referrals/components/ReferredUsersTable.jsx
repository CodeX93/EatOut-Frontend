"use client"

import { useState } from "react"
import {
  Box,
  Typography,
  Card,
  FormControl,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material"
import { KeyboardArrowDown, Groups } from "@mui/icons-material"

export default function ReferredUsersTable() {
  const [filter, setFilter] = useState("Last Month")

  const referredUsers = [
    {
      referred: "Ali H",
      email: "ali@gmail.com",
      referrer: "Sarah A",
      joinedOn: "05 May 2025",
      status: "Reward Applied",
    },
    {
      referred: "Fahad K",
      email: "fahad@gmail.com",
      referrer: "Riya Shah",
      joinedOn: "03 May 2025",
      status: "Reward Applied",
    },
    {
      referred: "Meera I",
      email: "meera@gmail.com",
      referrer: "Omar Ali",
      joinedOn: "08 May 2025",
      status: "Pending",
    },
    {
      referred: "Noah M",
      email: "noah@gmail.com",
      referrer: "Olivia Brown",
      joinedOn: "06 May 2025",
      status: "Reward Applied",
    },
    {
      referred: "Emily J",
      email: "emily@gmail.com",
      referrer: "Jacob Smith",
      joinedOn: "05 May 2025",
      status: "Reward Applied",
    },
    {
      referred: "Ava W",
      email: "ava@gmail.com",
      referrer: "Jacob Smith",
      joinedOn: "04 May 2025",
      status: "Reward Applied",
    },
    {
      referred: "Sophia T",
      email: "sophia@gmail.com",
      referrer: "Olivia Brown",
      joinedOn: "08 May 2025",
      status: "Pending",
    },
    {
      referred: "Harper T",
      email: "harper@gmail.com",
      referrer: "Jacob Smith",
      joinedOn: "08 May 2025",
      status: "No Order Yet",
    },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case "Reward Applied":
        return { bgcolor: "#e8f5e8", color: "#00c17c" }
      case "Pending":
        return { bgcolor: "#fff3cd", color: "#856404" }
      case "No Order Yet":
        return { bgcolor: "#f8d7da", color: "#721c24" }
      default:
        return { bgcolor: "#f8d7da", color: "#721c24" }
    }
  }

  return (
    <Card
      sx={{
        bgcolor: "#ffffff",
        border: "1px solid #dadada",
        borderRadius: "12px",
        mb: 3,
        height: "fit-content",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          pb: 1,
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Groups sx={{ color: "#da1818", fontSize: "16px" }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#da1818", fontSize: { xs: "14px", sm: "16px" } }}>
            Referred Users
          </Typography>
        </Box>
        <FormControl size="small">
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            sx={{
              minWidth: { xs: 80, sm: 100 },
              borderRadius: "8px",
              fontSize: { xs: "11px", sm: "12px" },
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
            <MenuItem value="Last Month">Last Month</MenuItem>
            <MenuItem value="Last Week">Last Week</MenuItem>
            <MenuItem value="Last Year">Last Year</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <TableContainer sx={{ maxHeight: "350px", overflow: "auto" }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: "#f9f9f9" }}>
              {["Referred", "Email", "Referrer", "Joined On", "Status"].map((header) => (
                <TableCell
                  key={header}
                  sx={{
                    color: "#8a8a8f",
                    fontWeight: 500,
                    fontSize: { xs: "10px", sm: "11px" },
                    py: 1,
                    borderBottom: "1px solid #dadada",
                    display:
                      header === "Referrer" || header === "Joined On" ? { xs: "none", sm: "table-cell" } : "table-cell",
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {referredUsers.map((user, index) => (
              <TableRow
                key={index}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { bgcolor: "#f9f9f9" },
                }}
              >
                <TableCell sx={{ fontSize: { xs: "10px", sm: "11px" }, py: 0.8, fontWeight: 500 }}>
                  {user.referred}
                </TableCell>
                <TableCell sx={{ fontSize: { xs: "10px", sm: "11px" }, py: 0.8, color: "#da1818" }}>
                  {user.email}
                </TableCell>
                <TableCell
                  sx={{ fontSize: { xs: "10px", sm: "11px" }, py: 0.8, display: { xs: "none", sm: "table-cell" } }}
                >
                  {user.referrer}
                </TableCell>
                <TableCell
                  sx={{ fontSize: { xs: "10px", sm: "11px" }, py: 0.8, display: { xs: "none", sm: "table-cell" } }}
                >
                  {user.joinedOn}
                </TableCell>
                <TableCell sx={{ py: 0.8 }}>
                  <Chip
                    label={user.status}
                    size="small"
                    sx={{
                      ...getStatusColor(user.status),
                      fontWeight: 500,
                      fontSize: { xs: "8px", sm: "9px" },
                      height: "18px",
                      borderRadius: "4px",
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
