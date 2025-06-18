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
import { TrendingUp } from "@mui/icons-material"
import ScrollableTable from "./ScrollableTable"

export default function TopSpenders({ topSpenders }) {
  return (
    <Card
      sx={{
        bgcolor: "#ffffff",
        border: "1px solid #dadada",
        borderRadius: "12px",
        mb: { xs: 2, md: 3 },
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
          <TrendingUp sx={{ color: "#da1818", fontSize: { xs: "14px", sm: "16px" } }} />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "#da1818",
              fontSize: { xs: "0.875rem", sm: "1.25rem" },
            }}
          >
            Top Spenders
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
      <ScrollableTable minWidth={600}>
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
                  minWidth: { xs: 70, sm: 90 },
                }}
              >
                Total Spent
              </TableCell>
              <TableCell
                sx={{
                  color: "#8a8a8f",
                  fontWeight: 500,
                  fontSize: { xs: "0.625rem", sm: "12px" },
                  py: 1,
                  minWidth: { xs: 50, sm: 60 },
                }}
              >
                Orders
              </TableCell>
              <TableCell
                sx={{
                  color: "#8a8a8f",
                  fontWeight: 500,
                  fontSize: { xs: "0.625rem", sm: "12px" },
                  py: 1,
                  minWidth: { xs: 80, sm: 100 },
                }}
              >
                Last Order Date
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {topSpenders.map((spender, index) => (
              <TableRow key={index}>
                <TableCell sx={{ fontSize: { xs: "0.625rem", sm: "12px" }, py: 1 }}>{spender.rank}</TableCell>
                <TableCell sx={{ fontSize: { xs: "0.625rem", sm: "12px" }, py: 1 }}>{spender.name}</TableCell>
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
                  {spender.email}
                </TableCell>
                <TableCell sx={{ fontSize: { xs: "0.625rem", sm: "12px" }, py: 1 }}>{spender.totalSpent}</TableCell>
                <TableCell sx={{ fontSize: { xs: "0.625rem", sm: "12px" }, py: 1 }}>{spender.orders}</TableCell>
                <TableCell sx={{ fontSize: { xs: "0.625rem", sm: "12px" }, py: 1 }}>{spender.lastOrder}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollableTable>
    </Card>
  )
}
