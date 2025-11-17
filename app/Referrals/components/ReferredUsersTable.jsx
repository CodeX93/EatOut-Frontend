"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Box,
  Typography,
  Card,
  FormControl,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TableSortLabel,
} from "@mui/material"
import { KeyboardArrowDown, Groups, Search as SearchIcon } from "@mui/icons-material"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../../../firebaseConfig"

export default function ReferredUsersTable() {
  const [timelineFilter, setTimelineFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [referredUsers, setReferredUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortConfig, setSortConfig] = useState({ orderBy: "joinedOnValue", order: "desc" })

  useEffect(() => {
    const fetchReferredUsers = async () => {
      setLoading(true)
      try {
        const querySnapshot = await getDocs(collection(db, "referrals"))
        const users = []
        querySnapshot.forEach((doc) => {
          const data = doc.data()
          if (Array.isArray(data.referredUsers)) {
            data.referredUsers.forEach((ru) => {
              const timestamp =
                (typeof ru.joinedOnValue === "number" && ru.joinedOnValue) ||
                (ru.joinedOn && !Number.isNaN(Date.parse(ru.joinedOn)) ? Date.parse(ru.joinedOn) : null) ||
                (ru.createdAt?.seconds ? ru.createdAt.seconds * 1000 : null)
              users.push({
                ...ru,
                referrer: data.email || "-",
                joinedOnValue: timestamp || 0,
                joinedOnDisplay: timestamp
                  ? new Date(timestamp).toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "-",
                status: ru.status || "Pending",
              })
            })
          }
        })
        setReferredUsers(users)
      } catch (error) {
        console.error("Error fetching referred users:", error)
      }
      setLoading(false)
    }
    fetchReferredUsers()
  }, [])

  const statusOptions = useMemo(() => {
    const unique = new Set(
      referredUsers
        .map((user) => user.status)
        .filter((status) => typeof status === "string" && status.trim().length > 0)
    )
    return ["All", ...Array.from(unique)]
  }, [referredUsers])

  const filteredUsers = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase()
    const now = Date.now()

    return referredUsers.filter((user) => {
      const matchesSearch = normalizedTerm
        ? [user.name, user.referred, user.email, user.referrer]
            .filter((field) => typeof field === "string" && field.length > 0)
            .some((field) => field.toLowerCase().includes(normalizedTerm))
        : true

      const matchesStatus =
        statusFilter === "All" ||
        (user.status || "").toLowerCase() === statusFilter.toLowerCase()

      const matchesTimeline =
        timelineFilter === "All" ||
        (user.joinedOnValue &&
          ((timelineFilter === "Last Week" && user.joinedOnValue >= now - 7 * 24 * 60 * 60 * 1000) ||
            (timelineFilter === "Last Month" && user.joinedOnValue >= now - 30 * 24 * 60 * 60 * 1000) ||
            (timelineFilter === "Last Year" && user.joinedOnValue >= now - 365 * 24 * 60 * 60 * 1000)))

      return matchesSearch && matchesStatus && matchesTimeline
    })
  }, [referredUsers, searchTerm, statusFilter, timelineFilter])

  const sortedUsers = useMemo(() => {
    const sorted = [...filteredUsers].sort((a, b) => {
      const getValue = (user) => {
        switch (sortConfig.orderBy) {
          case "referred":
            return user.name || user.referred || user.email || ""
          case "email":
            return user.email || ""
          case "referrer":
            return user.referrer || ""
          case "joinedOnValue":
            return user.joinedOnValue || 0
          case "status":
            return user.status || ""
          default:
            return ""
        }
      }

      const valueA = getValue(a)
      const valueB = getValue(b)

      if (typeof valueA === "number" && typeof valueB === "number") {
        return sortConfig.order === "asc" ? valueA - valueB : valueB - valueA
      }

      return sortConfig.order === "asc"
        ? String(valueA).localeCompare(String(valueB))
        : String(valueB).localeCompare(String(valueA))
    })
    return sorted
  }, [filteredUsers, sortConfig])

  const handleSortChange = (field) => {
    setSortConfig((prev) => {
      const isSameField = prev.orderBy === field
      const nextOrder = isSameField && prev.order === "asc" ? "desc" : "asc"
      return { orderBy: field, order: nextOrder }
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Reward Applied":
        return { bgcolor: "#e8f5e8", color: "#00c17c" }
      case "Pending":
        return { bgcolor: "#fff3cd", color: "#856404" }
      case "No Order Yet":
        return { bgcolor: "#f8d7da", color: "#721c24" }
      default:
        return { bgcolor: "#f8d7da", color: "#721c24" }
    }
  }

  return (
    <Card
      sx={{
        bgcolor: "#ffffff",
        border: "1px solid #dadada",
        borderRadius: "12px",
        mb: 3,
        height: "fit-content",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          pb: 1,
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Groups sx={{ color: "#da1818", fontSize: "16px" }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#da1818", fontSize: { xs: "14px", sm: "16px" } }}>
            Referred Users
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 1, sm: 1.5 },
            flexWrap: "wrap",
            width: "100%",
          }}
        >
          <TextField
            size="small"
            placeholder="Search referred user"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            sx={{
              width: { xs: "100%", sm: 200 },
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                fontSize: { xs: "11px", sm: "12px" },
                border: "1px solid #dadada",
                "&:hover": {
                  borderColor: "#cfcfcf",
                },
                "&.Mui-focused": {
                  borderColor: "#da1818",
                  boxShadow: "0 0 0 2px rgba(218, 24, 24, 0.08)",
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#8a8a8f", fontSize: "16px" }} />
                </InputAdornment>
              ),
            }}
          />
          <FormControl size="small">
            <Select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              sx={{
                minWidth: { xs: 110, sm: 120 },
                borderRadius: "8px",
                fontSize: { xs: "11px", sm: "12px" },
                border: "1px solid #dadada",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#dadada",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#cfcfcf",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#da1818",
                  boxShadow: "0 0 0 2px rgba(218, 24, 24, 0.08)",
                },
                ".MuiSvgIcon-root": {
                  color: "#666666",
                },
              }}
              IconComponent={KeyboardArrowDown}
            >
              {statusOptions.map((status) => (
                <MenuItem key={status} value={status}>
                  Status: {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small">
            <Select
              value={timelineFilter}
              onChange={(event) => setTimelineFilter(event.target.value)}
              sx={{
                minWidth: { xs: 110, sm: 120 },
                borderRadius: "8px",
                fontSize: { xs: "11px", sm: "12px" },
                border: "1px solid #dadada",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#dadada",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#cfcfcf",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#da1818",
                  boxShadow: "0 0 0 2px rgba(218, 24, 24, 0.08)",
                },
                ".MuiSvgIcon-root": {
                  color: "#666666",
                },
              }}
              IconComponent={KeyboardArrowDown}
            >
              {["All", "Last Week", "Last Month", "Last Year"].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>
      <TableContainer
        sx={{
          maxHeight: { xs: 320, sm: 360 },
          overflowY: "auto",
          overflowX: "auto",
          width: "100%",
          position: "relative",
        }}
      >
        <Table
          size="small"
          stickyHeader
          sx={{
            width: "100%",
            minWidth: 640,
          }}
        >
          <TableHead>
            <TableRow sx={{ bgcolor: "#f9f9f9" }}>
              {[
                { label: "Referred", field: "referred", hideOnXs: false },
                { label: "Email", field: "email", hideOnXs: false },
                { label: "Referrer", field: "referrer", hideOnXs: true },
                { label: "Joined On", field: "joinedOnValue", hideOnXs: true },
                { label: "Status", field: "status", hideOnXs: false },
              ].map((column) => (
                <TableCell
                  key={column.field}
                  sx={{
                    color: "#8a8a8f",
                    fontWeight: 500,
                      fontSize: { xs: "9px", sm: "10px" },
                      py: 0.6,
                      borderBottom: "1px solid #dadada",
                    display: column.hideOnXs ? { xs: "none", sm: "table-cell" } : "table-cell",
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
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : sortedUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No referred users found.
                </TableCell>
              </TableRow>
            ) : (
              sortedUsers.map((user, index) => (
                <TableRow
                  key={index}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    "&:hover": { bgcolor: "#f9f9f9" },
                  }}
                >
                  <TableCell sx={{ fontSize: { xs: "10px", sm: "11px" }, py: 0.8, fontWeight: 500 }}>
                    {user.name || user.referred || user.email || "-"}
                  </TableCell>
                  <TableCell sx={{ fontSize: { xs: "10px", sm: "11px" }, py: 0.8, color: "#da1818" }}>
                    {user.email || "-"}
                  </TableCell>
                  <TableCell
                    sx={{ fontSize: { xs: "10px", sm: "11px" }, py: 0.8, display: { xs: "none", sm: "table-cell" } }}
                  >
                    {user.referrer || "-"}
                  </TableCell>
                  <TableCell
                    sx={{ fontSize: { xs: "10px", sm: "11px" }, py: 0.8, display: { xs: "none", sm: "table-cell" } }}
                  >
                    {user.joinedOnDisplay}
                  </TableCell>
                  <TableCell sx={{ py: 0.8 }}>
                    <Chip
                      label={user.status || "Pending"}
                      size="small"
                      sx={{
                        ...getStatusColor(user.status || "Pending"),
                        fontWeight: 500,
                        fontSize: { xs: "8px", sm: "9px" },
                        height: "18px",
                        borderRadius: "4px",
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  )
}
