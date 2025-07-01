"use client"

import { useState, useEffect } from "react"
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
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material"
import { KeyboardArrowDown, Groups } from "@mui/icons-material"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../../../firebaseConfig"

export default function ReferredUsersTable() {
  const [filter, setFilter] = useState("Last Month")
  const [referredUsers, setReferredUsers] = useState([])
  const [loading, setLoading] = useState(true)

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
              users.push({
                ...ru,
                referrer: data.email || "-",
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
        <FormControl size="small">
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            sx={{
              minWidth: { xs: 80, sm: 100 },
              borderRadius: "8px",
              fontSize: { xs: "11px", sm: "12px" },
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
      <TableContainer sx={{ maxHeight: "350px", overflow: "auto" }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: "#f9f9f9" }}>
              {["Referred", "Email", "Referrer", "Joined On", "Status"].map((header) => (
                <TableCell
                  key={header}
                  sx={{
                    color: "#8a8a8f",
                    fontWeight: 500,
                    fontSize: { xs: "10px", sm: "11px" },
                    py: 1,
                    borderBottom: "1px solid #dadada",
                    display:
                      header === "Referrer" || header === "Joined On" ? { xs: "none", sm: "table-cell" } : "table-cell",
                  }}
                >
                  {header}
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
            ) : referredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No referred users found.
                </TableCell>
              </TableRow>
            ) : (
              referredUsers.map((user, index) => (
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
                    {user.joinedOn || (user.createdAt && user.createdAt.seconds ? new Date(user.createdAt.seconds * 1000).toLocaleDateString() : "-")}
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
