"use client"

import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  useMediaQuery,
  useTheme,
  IconButton,
  Tooltip,
  TableSortLabel,
} from "@mui/material"
import { RestaurantMenu, Edit, Delete } from "@mui/icons-material"

const columns = [
  { label: "Cuisine Name", field: "name", width: "45%", align: "left" },
  { label: "Restaurants Using", field: "numberOfRestUsing", width: "25%", align: "center" },
  { label: "Status", field: "isActive", width: "20%", align: "center" },
]

export default function CuisinesTable({ cuisines, onEdit, onDelete, sortConfig, onSortChange }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  if (cuisines.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          bgcolor: "#ffffff",
          border: "1px solid #dadada",
          borderRadius: "12px",
          p: 4,
          textAlign: "center",
        }}
      >
        <RestaurantMenu sx={{ fontSize: 48, color: "#8a8a8f", mb: 2 }} />
        <Typography variant="h6" sx={{ color: "#8a8a8f", mb: 1 }}>
          No cuisines found
        </Typography>
        <Typography variant="body2" sx={{ color: "#8a8a8f" }}>
          Add your first cuisine to get started
        </Typography>
      </Paper>
    )
  }

  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: "#ffffff",
        border: "1px solid #dadada",
        borderRadius: "12px",
        overflow: "hidden",
        width: "100%",
        maxWidth: "100%",
        minWidth: "100%",
      }}
    >
      <TableContainer sx={{ maxHeight: "600px", overflow: "auto", width: "100%", maxWidth: "100%", minWidth: "100%" }}>
        <Table sx={{ width: "100%", minWidth: "100%", tableLayout: "fixed" }}>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f9f9f9" }}>
              {columns.map((column) => (
                <TableCell
                  key={column.field}
                  sx={{
                    color: "#8a8a8f",
                    fontWeight: 600,
                    fontSize: { xs: "12px", sm: "14px" },
                    borderBottom: "1px solid #dadada",
                    py: 2,
                    textAlign: column.align,
                    width: column.width,
                  }}
                >
                  <TableSortLabel
                    active={sortConfig?.orderBy === column.field}
                    direction={sortConfig?.orderBy === column.field ? sortConfig?.order : "asc"}
                    onClick={() => onSortChange && onSortChange(column.field)}
                    sx={{
                      "& .MuiTableSortLabel-icon": {
                        opacity: 1,
                        color: "#da1818",
                      },
                      "&.Mui-active": {
                        color: "#da1818",
                      },
                      fontSize: { xs: "12px", sm: "14px" },
                      fontWeight: 600,
                    }}
                  >
                    {column.label}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell
                sx={{
                  color: "#8a8a8f",
                  fontWeight: 600,
                  fontSize: { xs: "12px", sm: "14px" },
                  borderBottom: "1px solid #dadada",
                  py: 2,
                  textAlign: "center",
                  width: "10%",
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cuisines.map((cuisine, index) => (
              <TableRow
                key={index}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { bgcolor: "#f9f9f9" },
                }}
              >
                <TableCell
                  sx={{
                    fontSize: { xs: "12px", sm: "14px" },
                    py: 2,
                    fontWeight: 500,
                    width: "45%",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <RestaurantMenu
                      sx={{
                        color: "#da1818",
                        fontSize: { xs: "16px", sm: "18px" },
                      }}
                    />
                    {cuisine.name}
                  </Box>
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: { xs: "12px", sm: "14px" },
                    py: 2,
                    textAlign: "center",
                    fontWeight: 600,
                    color: cuisine.numberOfRestUsing > 0 ? "#00c17c" : "#8a8a8f",
                    width: "25%",
                  }}
                >
                  {cuisine.numberOfRestUsing}
                </TableCell>
                <TableCell
                  sx={{
                    py: 2,
                    textAlign: "center",
                    width: "20%",
                  }}
                >
                  <Chip
                    label={cuisine.isActive ? "Active" : "Inactive"}
                    size="small"
                    sx={{
                      bgcolor: cuisine.isActive ? "#e8f5e8" : "#f5f5f5",
                      color: cuisine.isActive ? "#00c17c" : "#8a8a8f",
                      fontWeight: 500,
                      fontSize: { xs: "10px", sm: "11px" },
                      height: "24px",
                      borderRadius: "12px",
                    }}
                  />
                </TableCell>
                <TableCell
                  sx={{
                    py: 2,
                    textAlign: "center",
                    width: "10%",
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "center", gap: 0.5 }}>
                    <Tooltip title="Edit Cuisine">
                      <IconButton
                        size="small"
                        onClick={() => {
                          console.log("Edit button clicked for:", cuisine)
                          onEdit(cuisine)
                        }}
                        sx={{
                          color: "#da1818",
                          "&:hover": {
                            bgcolor: "rgba(218, 24, 24, 0.1)",
                          },
                        }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Cuisine">
                      <IconButton
                        size="small"
                        onClick={() => {
                          console.log("Delete button clicked for:", cuisine)
                          onDelete(cuisine)
                        }}
                        sx={{
                          color: "#ff2d55",
                          "&:hover": {
                            bgcolor: "rgba(255, 45, 85, 0.1)",
                          },
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}
