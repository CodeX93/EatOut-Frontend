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
} from "@mui/material"
import { KeyboardArrowDown } from "@mui/icons-material"
import ScrollableTable from "./ScrollableTable"

export default function UserBowlBalanceTable() {
  const users = [
    {
      name: "Emily Johnson",
      email: "emily@email.com",
      totalBowls: 80,
      usedForCash: 0,
      usedForSub: 60,
      currentBalance: 20,
      lastAction: "13 May 2025",
    },
    {
      name: "Noah Miller",
      email: "noah@email.com",
      totalBowls: 100,
      usedForCash: 100,
      usedForSub: 0,
      currentBalance: 0,
      lastAction: "10 May 2025",
    },
    {
      name: "Ava Williams",
      email: "ava@email.com",
      totalBowls: 130,
      usedForCash: 30,
      usedForSub: 50,
      currentBalance: 50,
      lastAction: "12 May 2025",
    },
    {
      name: "Mason Davis",
      email: "masn@email.com",
      totalBowls: 150,
      usedForCash: 0,
      usedForSub: 150,
      currentBalance: 0,
      lastAction: "11 May 2025",
    },
  ]

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
        <FormControl size="small">
          <Select
            defaultValue="Last 24h"
            sx={{
              minWidth: { xs: 80, sm: 100 },
              borderRadius: "8px",
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#d1d5db",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#9ca3af",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#6366f1",
              },
            }}
            IconComponent={KeyboardArrowDown}
          >
            <MenuItem value="Last 24h">Last 24h</MenuItem>
            <MenuItem value="Last 7d">Last 7d</MenuItem>
            <MenuItem value="Last 30d">Last 30d</MenuItem>
          </Select>
        </FormControl>
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
            {users.map((user, index) => (
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
          </TableBody>
        </Table>
      </ScrollableTable>
    </Card>
  )
}
