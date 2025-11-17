"use client"

import {
  Box,
  Typography,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  FormControl,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  InputLabel,
} from "@mui/material"
import { KeyboardArrowDown, Search } from "@mui/icons-material"
import ScrollableTable from "./ScrollableTable"
import { useState } from "react"

export default function UserBowlBalanceTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [membershipFilter, setMembershipFilter] = useState("All")

  const users = [
    {
      name: "Emily Johnson",
      email: "emily@email.com",
      totalBowls: 80,
      usedForCash: 0,
      usedForSub: 60,
      currentBalance: 20,
      lastAction: "13 May 2025",
      membershipPlan: "Monthly",
    },
    {
      name: "Noah Miller",
      email: "noah@email.com",
      totalBowls: 100,
      usedForCash: 100,
      usedForSub: 0,
      currentBalance: 0,
      lastAction: "10 May 2025",
      membershipPlan: "Annually",
    },
    {
      name: "Ava Williams",
      email: "ava@email.com",
      totalBowls: 130,
      usedForCash: 30,
      usedForSub: 50,
      currentBalance: 50,
      lastAction: "12 May 2025",
      membershipPlan: "Semi Annually",
    },
    {
      name: "Mason Davis",
      email: "masn@email.com",
      totalBowls: 150,
      usedForCash: 0,
      usedForSub: 150,
      currentBalance: 0,
      lastAction: "11 May 2025",
      membershipPlan: "Monthly",
    },
  ]

  const membershipOptions = ["All", "Monthly", "Semi Annually", "Annually"]

  const filteredUsers = users.filter((user) => {
    const term = searchTerm.trim().toLowerCase()
    const matchesSearch =
      !term ||
      (user.name || "").toLowerCase().includes(term) ||
      (user.email || "").toLowerCase().includes(term)
    const matchesMembership =
      membershipFilter === "All" ||
      (user.membershipPlan || "").toLowerCase() === membershipFilter.toLowerCase()
    return matchesSearch && matchesMembership
  })

  return (
    <Card
      sx={{
        bgcolor: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: { xs: 2, sm: 3 },
          borderBottom: "1px solid #f3f4f6",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: "#111827",
            fontSize: { xs: "1rem", sm: "1.125rem" },
          }}
        >
          User Bowl Balance
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr auto" },
            gap: { xs: 1, sm: 1.5 },
            width: { xs: "100%", sm: "auto" },
            alignItems: "center",
          }}
        >
          <TextField
            size="small"
            placeholder="Search by user name or email"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: "#8a8a8f", fontSize: "16px" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              width: { xs: "100%", sm: 220 },
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                "&:hover": {
                  borderColor: "#9ca3af",
                },
                "&.Mui-focused": {
                  borderColor: "#da1818",
                  boxShadow: "0 0 0 2px rgba(218, 24, 24, 0.08)",
                },
              },
            }}
          />

          <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 160 } }}>
            <InputLabel>Membership Plan</InputLabel>
            <Select
              value={membershipFilter}
              label="Membership Plan"
              onChange={(event) => setMembershipFilter(event.target.value)}
              IconComponent={KeyboardArrowDown}
              sx={{
                borderRadius: "8px",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#d1d5db",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#9ca3af",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#da1818",
                },
              }}
            >
              {membershipOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option === "All" ? "All Plans" : option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Table */}
      <ScrollableTable minWidth={800} transparentScrollbar={true}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f9fafb" }}>
              <TableCell
                sx={{
                  color: "#6b7280",
                  fontWeight: 500,
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  py: 2,
                  minWidth: { xs: 120, sm: 150 },
                }}
              >
                User Name
              </TableCell>
              <TableCell
                sx={{
                  color: "#6b7280",
                  fontWeight: 500,
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  py: 2,
                  minWidth: { xs: 120, sm: 150 },
                  display: { xs: "none", md: "table-cell" },
                }}
              >
                Email
              </TableCell>
              <TableCell
                sx={{
                  color: "#6b7280",
                  fontWeight: 500,
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  py: 2,
                  minWidth: { xs: 80, sm: 100 },
                }}
              >
                Total Bowls
              </TableCell>
              <TableCell
                sx={{
                  color: "#6b7280",
                  fontWeight: 500,
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  py: 2,
                  minWidth: { xs: 80, sm: 100 },
                  display: { xs: "none", sm: "table-cell" },
                }}
              >
                Used for Cash
              </TableCell>
              <TableCell
                sx={{
                  color: "#6b7280",
                  fontWeight: 500,
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  py: 2,
                  minWidth: { xs: 80, sm: 100 },
                  display: { xs: "none", sm: "table-cell" },
                }}
              >
                Used for Sub
              </TableCell>
              <TableCell
                sx={{
                  color: "#6b7280",
                  fontWeight: 500,
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  py: 2,
                  minWidth: { xs: 80, sm: 100 },
                }}
              >
                Current Balance
              </TableCell>
              <TableCell
                sx={{
                  color: "#6b7280",
                  fontWeight: 500,
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  py: 2,
                  minWidth: { xs: 100, sm: 120 },
                  display: { xs: "none", lg: "table-cell" },
                }}
              >
                Last Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user, index) => (
              <TableRow
                key={index}
                sx={{
                  "&:hover": { bgcolor: "#f9fafb" },
                  "&:last-child td": { borderBottom: 0 },
                }}
              >
                <TableCell sx={{ py: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      fontWeight: 500,
                      color: "#111827",
                    }}
                  >
                    {user.name}
                  </Typography>
                </TableCell>
                <TableCell
                  sx={{
                    py: 2,
                    display: { xs: "none", md: "table-cell" },
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      color: "#6b7280",
                    }}
                  >
                    {user.email}
                  </Typography>
                </TableCell>
                <TableCell sx={{ py: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      color: "#111827",
                    }}
                  >
                    {user.totalBowls}
                  </Typography>
                </TableCell>
                <TableCell
                  sx={{
                    py: 2,
                    display: { xs: "none", sm: "table-cell" },
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      color: "#111827",
                    }}
                  >
                    {user.usedForCash}
                  </Typography>
                </TableCell>
                <TableCell
                  sx={{
                    py: 2,
                    display: { xs: "none", sm: "table-cell" },
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      color: "#111827",
                    }}
                  >
                    {user.usedForSub}
                  </Typography>
                </TableCell>
                <TableCell sx={{ py: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      color: "#111827",
                      fontWeight: 500,
                    }}
                  >
                    {user.currentBalance}
                  </Typography>
                </TableCell>
                <TableCell
                  sx={{
                    py: 2,
                    display: { xs: "none", lg: "table-cell" },
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      color: "#6b7280",
                    }}
                  >
                    {user.lastAction}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
            {filteredUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} sx={{ textAlign: "center", py: 3, color: "#6b7280" }}>
                  No members found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollableTable>
    </Card>
  )
}
