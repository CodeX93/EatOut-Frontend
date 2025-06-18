"use client"

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
  TableHead,
  TableRow,
} from "@mui/material"
import ScrollableTable from "./ScrollableTable"

export default function VoucherRedemptions({ voucherRedemptions }) {
  return (
    <Card
      sx={{
        bgcolor: "#ffffff",
        border: "1px solid #dadada",
        borderRadius: "12px",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 1, sm: 0 },
          p: { xs: 1.5, sm: 2 },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: { xs: 10, sm: 12 },
              height: { xs: 10, sm: 12 },
              bgcolor: "#da1818",
              borderRadius: "50%",
            }}
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "#da1818",
              fontSize: { xs: "0.875rem", sm: "1.25rem" },
            }}
          >
            Most Voucher Redemptions
          </Typography>
        </Box>
        <FormControl size="small">
          <Select
            defaultValue="Last Month"
            sx={{
              minWidth: { xs: 80, sm: 100 },
              borderRadius: "8px",
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
            }}
          >
            <MenuItem value="Last Month">Last Month</MenuItem>
            <MenuItem value="Last Week">Last Week</MenuItem>
            <MenuItem value="Last Year">Last Year</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <ScrollableTable minWidth={550}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  color: "#8a8a8f",
                  fontWeight: 500,
                  fontSize: { xs: "0.625rem", sm: "12px" },
                  py: 1,
                  minWidth: { xs: 40, sm: 50 },
                }}
              >
                Rank
              </TableCell>
              <TableCell
                sx={{
                  color: "#8a8a8f",
                  fontWeight: 500,
                  fontSize: { xs: "0.625rem", sm: "12px" },
                  py: 1,
                  minWidth: { xs: 60, sm: 80 },
                }}
              >
                Name
              </TableCell>
              <TableCell
                sx={{
                  color: "#8a8a8f",
                  fontWeight: 500,
                  fontSize: { xs: "0.625rem", sm: "12px" },
                  py: 1,
                  minWidth: { xs: 100, sm: 120 },
                }}
              >
                Email
              </TableCell>
              <TableCell
                sx={{
                  color: "#8a8a8f",
                  fontWeight: 500,
                  fontSize: { xs: "0.625rem", sm: "12px" },
                  py: 1,
                  minWidth: { xs: 60, sm: 80 },
                }}
              >
                Vouchers
              </TableCell>
              <TableCell
                sx={{
                  color: "#8a8a8f",
                  fontWeight: 500,
                  fontSize: { xs: "0.625rem", sm: "12px" },
                  py: 1,
                  minWidth: { xs: 60, sm: 80 },
                }}
              >
                Discount
              </TableCell>
              <TableCell
                sx={{
                  color: "#8a8a8f",
                  fontWeight: 500,
                  fontSize: { xs: "0.625rem", sm: "12px" },
                  py: 1,
                  minWidth: { xs: 50, sm: 70 },
                }}
              >
                Ordered
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {voucherRedemptions.map((redemption, index) => (
              <TableRow key={index}>
                <TableCell sx={{ fontSize: { xs: "0.625rem", sm: "12px" }, py: 1 }}>{redemption.rank}</TableCell>
                <TableCell sx={{ fontSize: { xs: "0.625rem", sm: "12px" }, py: 1 }}>{redemption.name}</TableCell>
                <TableCell
                  sx={{
                    fontSize: { xs: "0.625rem", sm: "12px" },
                    py: 1,
                    color: "#da1818",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: { xs: "100px", sm: "120px" },
                  }}
                >
                  {redemption.email}
                </TableCell>
                <TableCell sx={{ fontSize: { xs: "0.625rem", sm: "12px" }, py: 1 }}>{redemption.vouchers}</TableCell>
                <TableCell sx={{ fontSize: { xs: "0.625rem", sm: "12px" }, py: 1 }}>{redemption.discount}</TableCell>
                <TableCell sx={{ fontSize: { xs: "0.625rem", sm: "12px" }, py: 1 }}>{redemption.ordered}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollableTable>
    </Card>
  )
}
