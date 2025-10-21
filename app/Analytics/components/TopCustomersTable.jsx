"use client"
import {
  Box,
  Typography,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
} from "@mui/material"

export default function TopCustomersTable({ customers = [] }) {
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getAvatarColor = (index) => {
    const colors = ["#da1818", "#ffcc00", "#00c17c", "#8a8a8f", "#da1818"]
    return colors[index % colors.length]
  }

  return (
    <Card sx={{ bgcolor: "#ffffff", border: "1px solid #dadada", borderRadius: "12px" }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Top 5 Customers
        </Typography>
        {customers.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="body2" sx={{ color: "#8a8a8f" }}>
              No customer redemptions found
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: "#8a8a8f", fontWeight: 500, fontSize: "11px", py: 1 }}>
                    Rank
                  </TableCell>
                  <TableCell sx={{ color: "#8a8a8f", fontWeight: 500, fontSize: "11px", py: 1 }}>
                    Customer
                  </TableCell>
                  <TableCell sx={{ color: "#8a8a8f", fontWeight: 500, fontSize: "11px", py: 1 }}>
                    Spent
                  </TableCell>
                  <TableCell sx={{ color: "#8a8a8f", fontWeight: 500, fontSize: "11px", py: 1 }}>
                    Orders
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {customers.map((customer, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ fontSize: "12px", py: 1.5 }}>#{customer.rank}</TableCell>
                    <TableCell sx={{ py: 1.5 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Avatar
                          sx={{
                            width: 28,
                            height: 28,
                            fontSize: "11px",
                            bgcolor: getAvatarColor(index),
                          }}
                        >
                          {getInitials(customer.name)}
                        </Avatar>
                        <Typography sx={{ fontSize: "12px", fontWeight: 500 }}>
                          {customer.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontSize: "12px", py: 1.5, fontWeight: 600, color: "#00c17c" }}>
                      {customer.totalSpent}
                    </TableCell>
                    <TableCell sx={{ fontSize: "12px", py: 1.5 }}>{customer.orders}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Card>
  )
}