"use client"

import { useEffect, useState } from "react"
import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material"
import { KeyboardArrowDown } from "@mui/icons-material"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../../../firebaseConfig"

export default function AllReferredUsersTable() {
  const [filter, setFilter] = useState("Last 24h")
  const [allReferredUsers, setAllReferredUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReferrals = async () => {
      setLoading(true)
      try {
        const querySnapshot = await getDocs(collection(db, "referrals"))
        const users = []
        querySnapshot.forEach((doc) => {
          users.push(doc.data())
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

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#000000", fontSize: { xs: "16px", sm: "18px" } }}>
            All Referred Users
          </Typography>
          <FormControl size="small">
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              sx={{
                minWidth: { xs: 80, sm: 100 },
                borderRadius: "8px",
                fontSize: { xs: "12px", sm: "14px" },
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
              <MenuItem value="Last 24h">Last 24h</MenuItem>
              <MenuItem value="Last Week">Last Week</MenuItem>
              <MenuItem value="Last Month">Last Month</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Paper
        elevation={0}
        sx={{
          bgcolor: "#ffffff",
          border: "1px solid #dadada",
          borderRadius: "12px",
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
                  {["Email", "Referred Users", "Total Rewards Earned", "Referral Code", "Created At"].map((header) => (
                    <TableCell
                      key={header}
                      sx={{
                        color: "#8a8a8f",
                        fontWeight: 500,
                        fontSize: { xs: "12px", sm: "14px" },
                        borderBottom: "1px solid #dadada",
                        py: 1.5,
                      }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {allReferredUsers.map((user, index) => (
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
                      {user.createdAt && user.createdAt.seconds
                        ? new Date(user.createdAt.seconds * 1000).toLocaleString()
                        : "-"}
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
