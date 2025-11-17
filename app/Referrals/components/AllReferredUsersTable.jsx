"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Box,
  Typography,
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
  Paper,
  TableSortLabel,
} from "@mui/material"
import { KeyboardArrowDown, Search as SearchIcon } from "@mui/icons-material"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../../../firebaseConfig"

const TIMELINE_OPTIONS = ["All", "Last 24h", "Last Week", "Last Month"]

export default function AllReferredUsersTable() {
  const [timelineFilter, setTimelineFilter] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [allReferredUsers, setAllReferredUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortConfig, setSortConfig] = useState({ orderBy: "createdAtValue", order: "desc" })

  useEffect(() => {
    const fetchReferrals = async () => {
      setLoading(true)
      try {
        const querySnapshot = await getDocs(collection(db, "referrals"))
        const users = []
        querySnapshot.forEach((doc) => {
          const data = doc.data() || {}
          const createdTimestamp =
            (typeof data.createdAtValue === "number" && data.createdAtValue) ||
            (data.createdAt?.seconds ? data.createdAt.seconds * 1000 : null) ||
            (data.createdAt?.toDate ? data.createdAt.toDate().getTime() : null) ||
            (typeof doc.createTime?.toMillis === "function" ? doc.createTime.toMillis() : null)

          users.push({
            ...data,
            createdAtValue: createdTimestamp || 0,
            createdAtDisplay: createdTimestamp
              ? new Date(createdTimestamp).toLocaleString("en-US", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "-",
          })
        })
        setAllReferredUsers(users)
      } catch (error) {
        console.error("Error fetching referrals:", error)
      }
      setLoading(false)
    }
    fetchReferrals()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filteredUsers = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase()
    const now = Date.now()

    return allReferredUsers.filter((user) => {
      const matchesSearch = normalizedTerm
        ? [user.email, user.referralCode]
            .filter((field) => typeof field === "string" && field.length > 0)
            .some((field) => field.toLowerCase().includes(normalizedTerm))
        : true

      const matchesTimeline =
        timelineFilter === "All" ||
        (user.createdAtValue &&
          ((timelineFilter === "Last 24h" && user.createdAtValue >= now - 24 * 60 * 60 * 1000) ||
            (timelineFilter === "Last Week" && user.createdAtValue >= now - 7 * 24 * 60 * 60 * 1000) ||
            (timelineFilter === "Last Month" && user.createdAtValue >= now - 30 * 24 * 60 * 60 * 1000)))

      return matchesSearch && matchesTimeline
    })
  }, [allReferredUsers, searchTerm, timelineFilter])

  const sortedUsers = useMemo(() => {
    const sorted = [...filteredUsers].sort((a, b) => {
      const getValue = (user) => {
        switch (sortConfig.orderBy) {
          case "email":
            return user.email || ""
          case "referredUsers":
            return Array.isArray(user.referredUsers) ? user.referredUsers.length : 0
          case "totalRewardsEarned":
            return Number(user.totalRewardsEarned || 0)
          case "referralCode":
            return user.referralCode || ""
          case "createdAtValue":
            return user.createdAtValue || 0
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

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Box sx={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          flexWrap: "wrap", 
          gap: { xs: 1, sm: 2 },
          flexDirection: { xs: "column", sm: "row" }
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#000000", fontSize: { xs: "16px", sm: "18px" } }}>
            All Referred Users
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr auto" },
              gap: { xs: 1, sm: 1.5 },
              alignItems: "center",
              width: "100%",
            }}
          >
            <TextField
              size="small"
              placeholder="Search email or code"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              sx={{
                width: "100%",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  border: "1px solid #dadada",
                  fontSize: { xs: "12px", sm: "13px" },
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
            <FormControl
              size="small"
              sx={{
                minWidth: { xs: "100%", sm: 140 },
                maxWidth: { xs: "100%", sm: 160 },
                justifySelf: { xs: "stretch", sm: "end" },
              }}
            >
              <Select
                value={timelineFilter}
                onChange={(e) => setTimelineFilter(e.target.value)}
                sx={{
                  borderRadius: "8px",
                  fontSize: { xs: "12px", sm: "14px" },
                  ".MuiOutlinedInput-notchedOutline": {
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
                {TIMELINE_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Box>

      <Paper
        elevation={0}
        sx={{
          bgcolor: "#ffffff",
          border: "1px solid #dadada",
          borderRadius: { xs: "8px", sm: "10px", md: "12px" },
          overflow: "hidden",
        }}
      >
        {loading ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography>Loading...</Typography>
          </Box>
        ) : (
          <TableContainer sx={{ maxHeight: "400px", overflow: "auto" }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f9f9f9" }}>
                  {[
                    { label: "Email", field: "email" },
                    { label: "Referred Users", field: "referredUsers" },
                    { label: "Total Rewards Earned", field: "totalRewardsEarned" },
                    { label: "Referral Code", field: "referralCode" },
                    { label: "Created At", field: "createdAtValue" },
                  ].map((column) => (
                    <TableCell
                      key={column.field}
                      sx={{
                        color: "#8a8a8f",
                        fontWeight: 500,
                        fontSize: { xs: "12px", sm: "14px" },
                        borderBottom: "1px solid #dadada",
                        py: 1.5,
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
                {sortedUsers.map((user, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      "&:hover": { bgcolor: "#f9f9f9" },
                    }}
                  >
                    <TableCell sx={{ fontSize: { xs: "12px", sm: "14px" }, py: 1.5, color: "#da1818" }}>
                      {user.email}
                    </TableCell>
                    <TableCell sx={{ fontSize: { xs: "12px", sm: "14px" }, py: 1.5 }}>
                      {user.referredUsers ? user.referredUsers.length : 0}
                    </TableCell>
                    <TableCell sx={{ fontSize: { xs: "12px", sm: "14px" }, py: 1.5 }}>
                      {user.totalRewardsEarned || 0}
                    </TableCell>
                    <TableCell sx={{ fontSize: { xs: "12px", sm: "14px" }, py: 1.5 }}>
                      {user.referralCode || "-"}
                    </TableCell>
                    <TableCell sx={{ fontSize: { xs: "12px", sm: "14px" }, py: 1.5 }}>
                      {user.createdAtDisplay}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </>
  )
}
