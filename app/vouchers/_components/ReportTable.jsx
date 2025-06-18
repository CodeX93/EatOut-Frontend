"use client"

import {
  Card,
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material"
import { KeyboardArrowDown } from "@mui/icons-material"
import ScrollableTable from "./ScrollableTable"

export default function ReportTable({ title, icon, data, columns }) {
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
          {icon}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "#da1818",
              fontSize: { xs: "0.875rem", sm: "1rem", md: "1.125rem" },
            }}
          >
            {title}
          </Typography>
        </Box>
        <FormControl size="small">
          <Select
            defaultValue="Last Month"
            sx={{
              minWidth: { xs: 80, sm: 100 },
              borderRadius: "8px",
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
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
      <ScrollableTable minWidth={500}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: "#f9f9f9" }}>
              {columns.map((column) => (
                <TableCell
                  key={column.key}
                  sx={{
                    color: "#8a8a8f",
                    fontWeight: 500,
                    fontSize: { xs: "0.625rem", sm: "12px" },
                    py: 1,
                    borderBottom: "1px solid #dadada",
                    display: column.hideOnMobile ? { xs: "none", sm: "table-cell" } : "table-cell",
                    minWidth: { xs: 60, sm: 80 },
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow
                key={index}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { bgcolor: "#f9f9f9" },
                }}
              >
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    sx={{
                      fontSize: { xs: "0.625rem", sm: "12px" },
                      py: 1,
                      color: column.highlight ? "#da1818" : "inherit",
                      display: column.hideOnMobile ? { xs: "none", sm: "table-cell" } : "table-cell",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: { xs: "80px", sm: "120px" },
                    }}
                  >
                    {row[column.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollableTable>
    </Card>
  )
}
