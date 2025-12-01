"use client"

import { Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography, Chip, Box, Button } from "@mui/material"
import { useRouter } from "next/navigation"
import ScrollableTable from "./ScrollableTable"

export default function VouchersTable({ vouchers }) {
  const router = useRouter()

  const handleView = (voucherCode) => {
    router.push(`/vouchers/sub/view?id=${voucherCode}`)
  }

  const handleEdit = (voucherCode) => {
    // Use voucherCode for editing (voucher.id contains the voucherCode now)
    router.push(`/vouchers/sub/edit?id=${voucherCode}`)
  }

  const handleDelete = (voucherCode) => {
    router.push(`/vouchers/sub/delete?id=${voucherCode}`)
  }

  const headers = [
    { key: "code", label: "Code", minWidth: 80 },
    { key: "type", label: "Type", minWidth: 70 },
    { key: "value", label: "Value", minWidth: 60 },
    { key: "validity", label: "Validity", minWidth: 100 },
    { key: "restaurantName", label: "Restaurant Name", minWidth: 120 },
    { key: "balance", label: "Balance/Total Quantity", minWidth: 140 },
    { key: "merchants", label: "Merchant(s)", minWidth: 80, hideOnMobile: true },
    { key: "usage", label: "Usage (Used/Limit)", minWidth: 120, hideOnMobile: true },
    { key: "status", label: "Status", minWidth: 70 },
    { key: "actions", label: "Actions", minWidth: 120 },
  ]

  // Debug logging to check data structure
  console.log("VouchersTable received vouchers:", vouchers)

  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: "#ffffff",
        border: "1px solid #dadada",
        borderRadius: "12px",
        mb: { xs: 3, md: 4 },
        overflow: "hidden",
        width: "100%",
      }}
    >
      <ScrollableTable minWidth={1000}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f9f9f9" }}>
              {headers.map((header) => (
                <TableCell
                  key={header.key}
                  sx={{
                    color: "#8a8a8f",
                    fontWeight: 500,
                    fontSize: { xs: "0.625rem", sm: "14px" },
                    borderBottom: "1px solid #dadada",
                    py: { xs: 1, sm: 1.5 },
                    minWidth: { xs: header.minWidth * 0.8, sm: header.minWidth },
                    display: header.hideOnMobile ? { xs: "none", md: "table-cell" } : "table-cell",
                  }}
                >
                  {header.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {vouchers.map((voucher, index) => {
              // Debug each voucher
              console.log(`Voucher ${index}:`, voucher)
              
              return (
                <TableRow
                  key={voucher.id || voucher.code || index}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    "&:hover": { bgcolor: "#f9f9f9" },
                  }}
                >
                  <TableCell sx={{ py: { xs: 1, sm: 1.5 } }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#da1818",
                        fontSize: { xs: "0.625rem", sm: "15px" },
                        fontWeight: 500,
                      }}
                    >
                      {voucher.code}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ fontSize: { xs: "0.625rem", sm: "14px" }, py: { xs: 1, sm: 1.5 } }}>
                    {voucher.type}
                  </TableCell>
                  <TableCell sx={{ fontSize: { xs: "0.625rem", sm: "14px" }, py: { xs: 1, sm: 1.5 } }}>
                    {voucher.value}
                  </TableCell>
                  <TableCell sx={{ fontSize: { xs: "0.625rem", sm: "14px" }, py: { xs: 1, sm: 1.5 } }}>
                    {voucher.validity}
                  </TableCell>
                  <TableCell sx={{ fontSize: { xs: "0.625rem", sm: "14px" }, py: { xs: 1, sm: 1.5 } }}>
                    {voucher.restaurantName || "N/A"}
                  </TableCell>
                  <TableCell sx={{ fontSize: { xs: "0.625rem", sm: "14px" }, py: { xs: 1, sm: 1.5 } }}>
                    {voucher.balance || "N/A"}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: { xs: "0.625rem", sm: "14px" },
                      py: { xs: 1, sm: 1.5 },
                      display: { xs: "none", md: "table-cell" },
                    }}
                  >
                    {voucher.merchants}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: { xs: "0.625rem", sm: "14px" },
                      py: { xs: 1, sm: 1.5 },
                      display: { xs: "none", md: "table-cell" },
                    }}
                  >
                    {voucher.usage}
                  </TableCell>
                  <TableCell sx={{ py: { xs: 1, sm: 1.5 } }}>
                    <Chip
                      label={voucher.status}
                      size="small"
                      sx={{
                        bgcolor: "#e8f5e8",
                        color: "#00c17c",
                        fontWeight: 500,
                        fontSize: { xs: "0.5rem", sm: "12px" },
                        height: { xs: "16px", sm: "20px" },
                        borderRadius: "4px",
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ py: { xs: 1, sm: 1.5 } }}>
                    <Box
                      sx={{
                        display: "flex",
                        gap: { xs: 0.25, sm: 0.5 },
                        flexDirection: { xs: "column", sm: "row" },
                        alignItems: { xs: "flex-start", sm: "center" },
                      }}
                    >
                      <Button
                        size="small"
                        onClick={() => handleView(voucher.id || voucher.code)}
                        sx={{
                          fontSize: { xs: "0.5rem", sm: "12px" },
                          color: "#da1818",
                          textTransform: "none",
                          minWidth: "auto",
                          p: 0,
                          cursor: "pointer",
                        }}
                      >
                        View
                      </Button>
                      <Typography
                        sx={{
                          color: "#8a8a8f",
                          fontSize: { xs: "0.5rem", sm: "12px" },
                          display: { xs: "none", sm: "block" },
                        }}
                      >
                        /
                      </Typography>
                      <Button
                        size="small"
                        onClick={() => {
                          console.log("Edit clicked for voucher:", voucher)
                          console.log("Using voucherCode:", voucher.id || voucher.code)
                          handleEdit(voucher.id || voucher.code)
                        }}
                        sx={{
                          fontSize: { xs: "0.5rem", sm: "12px" },
                          color: "#da1818",
                          textTransform: "none",
                          minWidth: "auto",
                          p: 0,
                          cursor: "pointer",
                        }}
                      >
                        Edit
                      </Button>
                      <Typography
                        sx={{
                          color: "#8a8a8f",
                          fontSize: { xs: "0.5rem", sm: "12px" },
                          display: { xs: "none", sm: "block" },
                        }}
                      >
                        /
                      </Typography>
                      <Button
                        size="small"
                        onClick={() => handleDelete(voucher.id || voucher.code)}
                        sx={{
                          fontSize: { xs: "0.5rem", sm: "12px" },
                          color: "#da1818",
                          textTransform: "none",
                          minWidth: "auto",
                          p: 0,
                          cursor: "pointer",
                        }}
                      >
                        Delete
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </ScrollableTable>
    </Paper>
  )
}