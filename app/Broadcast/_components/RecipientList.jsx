"use client"

import { useState, useMemo } from "react"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Checkbox,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
} from "@mui/material"
import { Search as SearchIcon } from "@mui/icons-material"

export default function RecipientList({
  type,
  members = [],
  restaurants = [],
  selectedRecipients,
  onSelectionChange,
}) {
  const [searchTerm, setSearchTerm] = useState("")

  const data = type === "individual" ? members : restaurants
  const dataKey = type === "individual" ? "members" : "restaurants"

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data

    const term = searchTerm.toLowerCase()
    return data.filter((item) => {
      if (type === "individual") {
        return (
          (item.name || "").toLowerCase().includes(term) ||
          (item.email || "").toLowerCase().includes(term)
        )
      } else {
        return (
          (item.name || item.restaurantName || "").toLowerCase().includes(term) ||
          (item.email || "").toLowerCase().includes(term) ||
          (item.location || "").toLowerCase().includes(term)
        )
      }
    })
  }, [data, searchTerm, type])

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allIds = filteredData.map((item) => item.id || item.email)
      onSelectionChange([...new Set([...selectedRecipients, ...allIds])])
    } else {
      const filteredIds = filteredData.map((item) => item.id || item.email)
      onSelectionChange(selectedRecipients.filter((id) => !filteredIds.includes(id)))
    }
  }

  const handleSelectOne = (id) => {
    if (selectedRecipients.includes(id)) {
      onSelectionChange(selectedRecipients.filter((selectedId) => selectedId !== id))
    } else {
      onSelectionChange([...selectedRecipients, id])
    }
  }

  const allSelected = filteredData.length > 0 && filteredData.every((item) => selectedRecipients.includes(item.id || item.email))
  const someSelected = filteredData.some((item) => selectedRecipients.includes(item.id || item.email))

  if (data.length === 0) {
    return (
      <Card
        sx={{
          bgcolor: "#ffffff",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          border: "1px solid #efeff4",
          borderRadius: "12px",
          mb: 3,
        }}
      >
        <CardContent sx={{ p: 3, textAlign: "center" }}>
          <Typography sx={{ color: "#8a8a8f" }}>
            No {type === "individual" ? "members" : "restaurants"} found.
          </Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      sx={{
        bgcolor: "#ffffff",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        border: "1px solid #efeff4",
        borderRadius: "12px",
        mb: 3,
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "#111827",
              mb: 2,
              fontSize: { xs: "1rem", sm: "1.125rem" },
            }}
          >
            Select {type === "individual" ? "Members" : "Restaurants"} ({selectedRecipients.length} selected)
          </Typography>
          <TextField
            placeholder={`Search ${type === "individual" ? "members" : "restaurants"}...`}
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#8a8a8f", fontSize: "20px" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                bgcolor: "#ffffff",
                borderRadius: "8px",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#dadada",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#dadada",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#da1818",
                },
              },
            }}
          />
        </Box>

        <TableContainer sx={{ maxHeight: 400, overflow: "auto" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" sx={{ bgcolor: "#f9fafb" }}>
                  <Checkbox
                    indeterminate={someSelected && !allSelected}
                    checked={allSelected}
                    onChange={handleSelectAll}
                    sx={{
                      color: "#8a8a8f",
                      "&.Mui-checked": {
                        color: "#da1818",
                      },
                      "&.MuiCheckbox-indeterminate": {
                        color: "#da1818",
                      },
                    }}
                  />
                </TableCell>
                <TableCell sx={{ bgcolor: "#f9fafb", fontWeight: 600, color: "#6b7280" }}>
                  {type === "individual" ? "Name" : "Restaurant Name"}
                </TableCell>
                <TableCell sx={{ bgcolor: "#f9fafb", fontWeight: 600, color: "#6b7280" }}>
                  Email
                </TableCell>
                {type === "restaurant" && (
                  <TableCell sx={{ bgcolor: "#f9fafb", fontWeight: 600, color: "#6b7280" }}>
                    Location
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((item) => {
                const itemId = item.id || item.email
                const isSelected = selectedRecipients.includes(itemId)
                return (
                  <TableRow
                    key={itemId}
                    hover
                    sx={{
                      cursor: "pointer",
                      bgcolor: isSelected ? "#fef2f2" : "transparent",
                      "&:hover": {
                        bgcolor: isSelected ? "#fee2e2" : "#f9fafb",
                      },
                    }}
                    onClick={() => handleSelectOne(itemId)}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={() => handleSelectOne(itemId)}
                        onClick={(e) => e.stopPropagation()}
                        sx={{
                          color: "#8a8a8f",
                          "&.Mui-checked": {
                            color: "#da1818",
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: { xs: "0.875rem", sm: "0.9375rem" }, color: "#111827" }}>
                        {type === "individual" ? item.name || "-" : item.name || item.restaurantName || "-"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: { xs: "0.875rem", sm: "0.9375rem" }, color: "#6b7280" }}>
                        {item.email || "-"}
                      </Typography>
                    </TableCell>
                    {type === "restaurant" && (
                      <TableCell>
                        <Typography sx={{ fontSize: { xs: "0.875rem", sm: "0.9375rem" }, color: "#6b7280" }}>
                          {item.location || "-"}
                        </Typography>
                      </TableCell>
                    )}
                  </TableRow>
                )
              })}
              {filteredData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={type === "restaurant" ? 4 : 3} sx={{ textAlign: "center", py: 3 }}>
                    <Typography sx={{ color: "#8a8a8f" }}>
                      No {type === "individual" ? "members" : "restaurants"} found matching your search.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )
}

