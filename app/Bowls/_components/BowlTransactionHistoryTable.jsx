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

export default function BowlTransactionHistoryTable() {
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
          Bowl Transaction History
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
            {transactions.map((transaction, index) => (
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
                    {transaction.notes}
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
