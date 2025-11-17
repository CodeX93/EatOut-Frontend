"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
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
  Button,
  TableSortLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField as MuiTextField,
} from "@mui/material"

import RestaurantFilters from "./RestaurantFilters"
import RestaurantTableRow from "./RestaurantTableRow"

export default function RestaurantsTable({ 
  restaurants = [], 
  title = "Account list",
  subtitle = "51 Restaurants from 6 Categories"
}) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("All")
  const [selectedCuisine, setSelectedCuisine] = useState("All")
  const [sortConfig, setSortConfig] = useState({ orderBy: "name", order: "asc" })
  const [broadcastOpen, setBroadcastOpen] = useState(false)
  const [broadcastRecipients, setBroadcastRecipients] = useState([])
  const [broadcastMessage, setBroadcastMessage] = useState({ subject: "", body: "" })

  const locationOptions = useMemo(() => {
    const unique = new Set(
      restaurants
        .map((r) => r.location)
        .filter((loc) => typeof loc === "string" && loc.trim().length > 0)
    )
    return ["All", ...Array.from(unique).sort((a, b) => a.localeCompare(b))]
  }, [restaurants])

  const cuisineOptions = useMemo(() => {
    const unique = new Set()
    restaurants.forEach((r) => {
      if (Array.isArray(r.cuisines)) {
        r.cuisines.forEach((c) => {
          if (typeof c === "string" && c.trim()) {
            unique.add(c.trim())
          }
        })
      }
    })
    return ["All", ...Array.from(unique).sort((a, b) => a.localeCompare(b))]
  }, [restaurants])

  const filteredRestaurants = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase()
    return restaurants.filter((restaurant) => {
      const matchesSearch = normalizedTerm
        ? [restaurant.name, restaurant.email, restaurant.location, restaurant.phone]
            .concat(Array.isArray(restaurant.cuisines) ? restaurant.cuisines : [])
            .filter((field) => typeof field === "string" && field.length > 0)
            .some((field) => field.toLowerCase().includes(normalizedTerm))
        : true

      const matchesLocation =
        selectedLocation === "All" ||
        (restaurant.location || "").toLowerCase() === selectedLocation.toLowerCase()

      const matchesCuisine =
        selectedCuisine === "All" ||
        (Array.isArray(restaurant.cuisines) &&
          restaurant.cuisines.some(
            (cuisine) => cuisine.toLowerCase() === selectedCuisine.toLowerCase()
          ))

      return matchesSearch && matchesLocation && matchesCuisine
    })
  }, [restaurants, searchTerm, selectedLocation, selectedCuisine])

  const applySort = (items, orderBy, order) => {
    const sorted = [...items].sort((a, b) => {
      const getValue = (restaurant) => {
        switch (orderBy) {
          case "name":
            return restaurant.name || ""
          case "email":
            return restaurant.email || ""
          case "cuisine":
            return Array.isArray(restaurant.cuisines) && restaurant.cuisines.length > 0
              ? restaurant.cuisines.join(", ")
              : ""
          case "location":
            return restaurant.location || ""
          case "phone":
            return restaurant.phone || ""
          case "vouchers":
            return Number(restaurant.vouchers || 0)
          default:
            return ""
        }
      }

      const valueA = getValue(a)
      const valueB = getValue(b)

      if (typeof valueA === "number" && typeof valueB === "number") {
        return order === "asc" ? valueA - valueB : valueB - valueA
      }

      return order === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA)
    })
    return sorted
  }

  const sortedRestaurants = useMemo(
    () => applySort(filteredRestaurants, sortConfig.orderBy, sortConfig.order),
    [filteredRestaurants, sortConfig]
  )

  const handleSearchChange = (searchTerm) => {
    setSearchTerm(searchTerm)
  }

  const handleSortChange = (field) => {
    setSortConfig((prev) => {
      const isSameField = prev.orderBy === field
      const nextOrder = isSameField && prev.order === "asc" ? "desc" : "asc"
      return { orderBy: field, order: nextOrder }
    })
  }

  const handleLocationChange = (value) => {
    setSelectedLocation(value)
  }

  const handleCuisineChange = (value) => {
    setSelectedCuisine(value)
  }

  const handleView = (restaurant, index) => {
    router.push(`/Restaurants/resturant-sub/view?id=${restaurant.id}&name=${encodeURIComponent(restaurant.name)}&action=view`)
  }

  const handleViewEdit = (restaurant, index) => {
    router.push(`/Restaurants/resturant-sub/edit?id=${restaurant.id}&name=${encodeURIComponent(restaurant.name)}&action=edit`)
  }

  const handleDelete = (restaurant, index) => {
    router.push(`/Restaurants/resturant-sub/delete?id=${restaurant.id}&name=${encodeURIComponent(restaurant.name)}&action=delete`)
  }

  const openBroadcastDialog = (recipients) => {
    setBroadcastRecipients(recipients)
    setBroadcastMessage({ subject: "", body: "" })
    setBroadcastOpen(true)
  }

  const handleBroadcastSingle = (restaurant) => {
    openBroadcastDialog([restaurant])
  }

  return (
    <Box sx={{ width: "100%", overflow: "hidden" }}>
      {/* Filters */}
      <RestaurantFilters
        onSearchChange={handleSearchChange}
        searchTerm={searchTerm}
        locations={locationOptions}
        selectedLocation={selectedLocation}
        onLocationChange={handleLocationChange}
        cuisines={cuisineOptions}
        selectedCuisine={selectedCuisine}
        onCuisineChange={handleCuisineChange}
        sortConfig={sortConfig}
        onSortChange={handleSortChange}
      />

      {/* Table Header */}
      <Box sx={{ 
        mb: { xs: 1.5, sm: 2, md: 2.5 },
        px: { xs: 0.5, sm: 0 }
      }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600, 
            color: "#000000",
            fontSize: { xs: "0.875rem", sm: "1rem", md: "1.125rem", lg: "1.25rem" },
            lineHeight: 1.3,
            mb: { xs: 0.5, sm: 1 }
          }}
        >
          {title}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: "#8a8a8f",
            fontSize: { xs: "0.6875rem", sm: "0.75rem", md: "0.8125rem", lg: "0.875rem" },
            lineHeight: 1.4,
          }}
        >
          {subtitle}
        </Typography>
      </Box>

      {/* Restaurants Table */}
      <Card sx={{ 
        bgcolor: "#ffffff", 
        border: "1px solid #dadada", 
        borderRadius: { xs: "8px", sm: "10px", md: "12px" }, 
        mb: { xs: 2, sm: 2.5, md: 3 },
        overflow: "hidden",
        boxShadow: { xs: "none", sm: "0 1px 3px rgba(0,0,0,0.1)" },
      }}>
        <TableContainer sx={{ 
          overflowX: "auto",
          maxWidth: "100%",
          "&::-webkit-scrollbar": {
            height: { xs: "4px", sm: "6px" },
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#f1f1f1",
            borderRadius: "3px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#dadada",
            borderRadius: "3px",
            "&:hover": {
              backgroundColor: "#c0c0c0",
            },
          },
        }}>
          <Table sx={{ 
            minWidth: { xs: 900, sm: 950, md: 1000 },
            "& .MuiTableCell-root": {
              padding: { xs: "8px 6px", sm: "12px 8px", md: "16px 12px" },
            },
          }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#fafafa" }}>
                {[
                  { label: "Restaurant Name", field: "name", minWidth: { xs: 160, sm: 180, md: 200 } },
                  { label: "Email Address", field: "email", minWidth: { xs: 160, sm: 180, md: 200 } },
                  { label: "Cuisine", field: "cuisine", minWidth: { xs: 140, sm: 150, md: 180 } },
                  { label: "Location", field: "location", minWidth: { xs: 120, sm: 140, md: 160 } },
                  { label: "Telephone No.", field: "phone", minWidth: { xs: 120, sm: 140, md: 160 } },
                  { label: "No. Of Active Vouchers", field: "vouchers", minWidth: { xs: 140, sm: 160, md: 180 } },
                ].map((column) => (
                  <TableCell
                    key={column.field}
                    sx={{
                      color: "#8a8a8f",
                      fontWeight: 600,
                      fontSize: { xs: "0.625rem", sm: "0.6875rem", md: "0.75rem" },
                      minWidth: column.minWidth,
                      borderBottom: "2px solid #e0e0e0",
                    }}
                  >
                    <TableSortLabel
                      active={sortConfig.orderBy === column.field}
                      direction={sortConfig.orderBy === column.field ? sortConfig.order : "asc"}
                      onClick={() => handleSortChange(column.field)}
                      sx={{
                        "& .MuiTableSortLabel-icon": {
                          opacity: 1,
                          color: "#da1818",
                        },
                        "&.Mui-active": {
                          color: "#da1818",
                        },
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
                    fontSize: { xs: "0.625rem", sm: "0.6875rem", md: "0.75rem" },
                    minWidth: { xs: 110, sm: 130, md: 150 },
                    borderBottom: "2px solid #e0e0e0",
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedRestaurants.map((restaurant, index) => (
                <RestaurantTableRow
                  key={index}
                  restaurant={restaurant}
                  index={index}
                  onView={handleView}
                  onEdit={handleViewEdit}
                  onDelete={handleDelete}
                  onBroadcast={handleBroadcastSingle}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "stretch", sm: "center" },
            gap: { xs: 1, sm: 2 },
            p: { xs: 1.5, sm: 2 },
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "#8a8a8f",
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
            }}
          >
            Showing {sortedRestaurants.length} restaurants
          </Typography>
          <Button
            variant="contained"
            onClick={() => openBroadcastDialog(sortedRestaurants)}
            disabled={sortedRestaurants.length === 0}
            sx={{
              bgcolor: "#da1818",
              color: "white",
              borderRadius: "20px",
              px: { xs: 2, sm: 3 },
              textTransform: "none",
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
              "&:hover": {
                bgcolor: "#c41515",
              },
              "&.Mui-disabled": {
                bgcolor: "#f0b9b9",
              },
            }}
          >
            Broadcast Message
          </Button>
        </Box>
      </Card>

      <Dialog
        open={broadcastOpen}
        onClose={() => {
          setBroadcastOpen(false)
          setBroadcastRecipients([])
          setBroadcastMessage({ subject: "", body: "" })
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Broadcast Message</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            {broadcastRecipients.length === 1
              ? `Send a message to ${broadcastRecipients[0]?.name || "the selected restaurant"}.`
              : `Send a message to ${broadcastRecipients.length} selected restaurants.`}
          </DialogContentText>
          <MuiTextField
            label="Subject"
            fullWidth
            sx={{ mb: 2 }}
            value={broadcastMessage.subject}
            onChange={(event) =>
              setBroadcastMessage((prev) => ({ ...prev, subject: event.target.value }))
            }
          />
          <MuiTextField
            label="Message"
            fullWidth
            multiline
            minRows={4}
            value={broadcastMessage.body}
            onChange={(event) =>
              setBroadcastMessage((prev) => ({ ...prev, body: event.target.value }))
            }
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setBroadcastOpen(false)} sx={{ textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              console.log("Broadcast message", {
                recipients: broadcastRecipients.map((r) => r.email).filter(Boolean),
                ...broadcastMessage,
              })
              setBroadcastOpen(false)
              setBroadcastRecipients([])
              setBroadcastMessage({ subject: "", body: "" })
            }}
            disabled={!broadcastMessage.subject || !broadcastMessage.body}
            sx={{
              textTransform: "none",
              bgcolor: "#da1818",
              "&:hover": { bgcolor: "#c41515" },
            }}
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
