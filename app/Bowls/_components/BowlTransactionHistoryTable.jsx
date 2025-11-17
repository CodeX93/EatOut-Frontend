"use client"

import { useState } from "react"
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
  Chip,
  TextField,
  InputAdornment,
} from "@mui/material"
import { KeyboardArrowDown, Search } from "@mui/icons-material"
import ScrollableTable from "./ScrollableTable"

export default function BowlTransactionHistoryTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("All")

  const transactions = [
    {
      txnId: "TXN-1201",
      userName: "Emily Johnson",
      type: "Redeemed",
      bowls: "-60",
      redemptionMethod: "Subscription",
      planType: "Monthly",
      date: "10 May 2025",
      notes: "Covered May subscription",
    },
    {
      txnId: "TXN-1202",
      userName: "Noah Miller",
      type: "Redeemed",
      bowls: "-100",
      redemptionMethod: "Cash",
      planType: "---",
      date: "09 May 2025",
      notes: "Paid out to PayPal",
    },
    {
      txnId: "TXN-1203",
      userName: "Ava Williams",
      type: "Redeemed",
      bowls: "-50",
      redemptionMethod: "Subscription",
      planType: "Semi-Ann",
      date: "11 May 2025",
      notes: "",
    },
    {
      txnId: "TXN-1204",
      userName: "Ava Williams",
      type: "Redeemed",
      bowls: "-30",
      redemptionMethod: "Cash",
      planType: "---",
      date: "11 May 2025",
      notes: "",
    },
    {
      txnId: "TXN-1205",
      userName: "Mason Davis",
      type: "Redeemed",
      bowls: "-150",
      redemptionMethod: "Subscription",
      planType: "Yearly",
      date: "12 May 2025",
      notes: "Full plan covered",
    },
  ]

  const typeOptions = ["All", "Earned", "Redeemed", "Used for Subscription", "Used for Cash"]

  const filteredTransactions = transactions.filter((transaction) => {
    const term = searchTerm.trim().toLowerCase()
    const matchesSearch =
      !term ||
      (transaction.userName || "").toLowerCase().includes(term) ||
      (transaction.email || "").toLowerCase().includes(term) ||
      (transaction.reference || transaction.txnId || "").toLowerCase().includes(term)

    const matchesType =
      typeFilter === "All" ||
      (transaction.type || "").toLowerCase() === typeFilter.toLowerCase()

    return matchesSearch && matchesType
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
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr auto" },
          gap: { xs: 1, sm: 1.5 },
          width: { xs: "100%", sm: "auto" },
          alignItems: "center",
        }}
      >
        <TextField
          size="small"
          placeholder="Search transactions"
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

        <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 170 } }}>
          <Select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
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
            {typeOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option === "All" ? "All Types" : option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Table */}
      <ScrollableTable minWidth={1000} transparentScrollbar={true}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f9fafb" }}>
              <TableCell
                sx={{
                  color: "#6b7280",
                  fontWeight: 500,
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  py: 2,
                  minWidth: { xs: 80, sm: 100 },
                }}
              >
                Txn ID
              </TableCell>
              <TableCell
                sx={{
                  color: "#6b7280",
                  fontWeight: 500,
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  py: 2,
                  minWidth: { xs: 100, sm: 120 },
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
                  minWidth: { xs: 60, sm: 80 },
                }}
              >
                Type
              </TableCell>
              <TableCell
                sx={{
                  color: "#6b7280",
                  fontWeight: 500,
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  py: 2,
                  minWidth: { xs: 60, sm: 80 },
                }}
              >
                Bowls
              </TableCell>
              <TableCell
                sx={{
                  color: "#6b7280",
                  fontWeight: 500,
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  py: 2,
                  minWidth: { xs: 120, sm: 140 },
                  display: { xs: "none", md: "table-cell" },
                }}
              >
                Redemption Method
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
                Plan Type
              </TableCell>
              <TableCell
                sx={{
                  color: "#6b7280",
                  fontWeight: 500,
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  py: 2,
                  minWidth: { xs: 80, sm: 100 },
                  display: { xs: "none", lg: "table-cell" },
                }}
              >
                Date
              </TableCell>
              <TableCell
                sx={{
                  color: "#6b7280",
                  fontWeight: 500,
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  py: 2,
                  minWidth: { xs: 100, sm: 120 },
                  display: { xs: "none", xl: "table-cell" },
                }}
              >
                Notes
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTransactions.map((transaction, index) => (
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
                      color: "#111827",
                    }}
                  >
                    {transaction.txnId}
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
                    {transaction.userName}
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
                    {transaction.type}
                  </Typography>
                </TableCell>
                <TableCell sx={{ py: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      color: "#ef4444",
                      fontWeight: 500,
                    }}
                  >
                    {transaction.bowls}
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
                      color: "#111827",
                    }}
                  >
                    {transaction.redemptionMethod}
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
                    {transaction.planType}
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
                    {transaction.date}
                  </Typography>
                </TableCell>
                <TableCell
                  sx={{
                    py: 2,
                    display: { xs: "none", xl: "table-cell" },
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      color: "#6b7280",
                    }}
                  >
                    {transaction.notes || "—"}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
            {filteredTransactions.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} sx={{ textAlign: "center", py: 3, color: "#6b7280" }}>
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollableTable>
    </Card>
  )
}
