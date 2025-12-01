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
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  Button,
  FormControl,
  Select,
  MenuItem,
  TableSortLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material"
import { Search as SearchIcon } from "@mui/icons-material"
import ScrollableTable from "./ScrollableTable"

export default function MembersTable({ members = [] }) {
  const router = useRouter()

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGender, setSelectedGender] = useState("All")
  const [selectedPlan, setSelectedPlan] = useState("All")
  const [sortConfig, setSortConfig] = useState({ orderBy: "name", order: "asc" })
  const [broadcastOpen, setBroadcastOpen] = useState(false)
  const [broadcastRecipients, setBroadcastRecipients] = useState([])
  const [broadcastMessage, setBroadcastMessage] = useState({ subject: "", body: "" })

  const genderOptions = useMemo(() => {
    const unique = new Set(
      members
        .map((member) => member.gender)
        .filter((gender) => typeof gender === "string" && gender.trim().length > 0)
    )
    return ["All", ...Array.from(unique).sort((a, b) => a.localeCompare(b))]
  }, [members])

  const planOptions = useMemo(() => {
    const unique = new Set(
      members
        .map((member) => member.membershipPlan)
        .filter((plan) => typeof plan === "string" && plan.trim().length > 0 && plan !== "N/A")
    )
    return ["All", ...Array.from(unique).sort((a, b) => a.localeCompare(b))]
  }, [members])

  const filteredMembers = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase()
    return members.filter((member) => {
      const matchesSearch = normalizedTerm
        ? [member.name, member.email, member.mobile, member.membershipPlan]
            .filter((field) => typeof field === "string" && field.length > 0)
            .some((field) => field.toLowerCase().includes(normalizedTerm))
        : true

      const matchesGender =
        selectedGender === "All" ||
        (member.gender || "").toLowerCase() === selectedGender.toLowerCase()

      const matchesPlan =
        selectedPlan === "All" ||
        (member.membershipPlan || "").toLowerCase() === selectedPlan.toLowerCase()

      return matchesSearch && matchesGender && matchesPlan
    })
  }, [members, searchTerm, selectedGender, selectedPlan])

  const applySort = (items, orderBy, order) => {
    const sorted = [...items].sort((a, b) => {
      const getValue = (member) => {
        switch (orderBy) {
          case "name":
            return member.name || ""
          case "gender":
            return member.gender || ""
          case "email":
            return member.email || ""
          case "mobile":
            return member.mobile || ""
          case "dateJoined":
            return Number(member.dateJoinedValue || 0)
          case "membershipPlan":
            return member.membershipPlan || ""
          case "dateOfSubscription":
            return Number(member.dateOfSubscriptionValue || 0)
          case "membershipExpiry":
            return Number(member.membershipExpiryValue || 0)
          case "goldenBowl":
            return Number(member.goldenBowl || 0)
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
        ? String(valueA).localeCompare(String(valueB))
        : String(valueB).localeCompare(String(valueA))
    })
    return sorted
  }

  const sortedMembers = useMemo(
    () => applySort(filteredMembers, sortConfig.orderBy, sortConfig.order),
    [filteredMembers, sortConfig]
  )

  const handleSortChange = (field) => {
    setSortConfig((prev) => {
      const isSameField = prev.orderBy === field
      const nextOrder = isSameField && prev.order === "asc" ? "desc" : "asc"
      return { orderBy: field, order: nextOrder }
    })
  }

  const handleView = (memberId) => {
    router.push(`/members/sub/view?id=${memberId}`)
  }

  const handleEdit = (memberId) => {
    router.push(`/members/sub/edit?id=${memberId}`)
  }

  const handleDelete = (memberId) => {
    router.push(`/members/sub/delete?id=${memberId}`)
  }

  const openBroadcastDialog = (recipients) => {
    setBroadcastRecipients(recipients)
    setBroadcastMessage({ subject: "", body: "" })
    setBroadcastOpen(true)
  }

  const handleBroadcastSingle = (member) => {
    openBroadcastDialog([member])
  }

  return (
    <Box sx={{ mb: 3, width: "100%", overflow: "hidden" }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 600,
          color: "#da1818",
          mb: { xs: 2.5, sm: 3, md: 3 },
          mt: { xs: 1, sm: 0, md: 0 },
          fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" },
          lineHeight: 1.2,
        }}
      >
        Members Overview
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "stretch", md: "center" },
          gap: { xs: 1.5, md: 2 },
          mb: 3,
          flexWrap: "wrap",
        }}
      >
        <TextField
          placeholder="Search Member"
          size="small"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          sx={{
            width: { xs: "100%", md: 300 },
            "& .MuiOutlinedInput-root": {
              bgcolor: "#ffffff",
              borderRadius: "8px",
              border: "1px solid #dadada",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#8a8a8f" }} />
              </InputAdornment>
            ),
          }}
        />

        <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 150 }, flex: { xs: "0 0 auto" } }}>
          <Select
            value={selectedGender}
            onChange={(event) => setSelectedGender(event.target.value)}
            sx={{
              borderRadius: "8px",
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
            }}
          >
            {genderOptions.map((gender) => (
              <MenuItem key={gender} value={gender}>
                Gender: {gender}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 170 }, flex: { xs: "0 0 auto" } }}>
            <Select
            value={selectedPlan}
            onChange={(event) => setSelectedPlan(event.target.value)}
              sx={{
                borderRadius: "8px",
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
              }}
            >
            {planOptions.map((plan) => (
              <MenuItem key={plan} value={plan}>
                Plan: {plan}
              </MenuItem>
            ))}
            </Select>
          </FormControl>

        <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 170 }, flex: { xs: "0 0 auto" } }}>
            <Select
            value={sortConfig.orderBy}
            onChange={(event) => handleSortChange(event.target.value)}
              sx={{
                borderRadius: "8px",
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
              }}
            >
            <MenuItem value="name">Sort by: Name</MenuItem>
            <MenuItem value="gender">Sort by: Gender</MenuItem>
            <MenuItem value="email">Sort by: Email</MenuItem>
            <MenuItem value="mobile">Sort by: Mobile</MenuItem>
            <MenuItem value="dateJoined">Sort by: Date Joined</MenuItem>
            <MenuItem value="membershipPlan">Sort by: Membership Plan</MenuItem>
            <MenuItem value="dateOfSubscription">Sort by: Date of Subscription</MenuItem>
            <MenuItem value="membershipExpiry">Sort by: Membership Expiry</MenuItem>
            <MenuItem value="goldenBowl">Sort by: Golden Bowl</MenuItem>
            </Select>
          </FormControl>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: "#000000",
            fontSize: { xs: "1rem", sm: "1.25rem" },
          }}
        >
          Members Account List
        </Typography>
      </Box>

      <Card
        sx={{
          bgcolor: "#ffffff",
          border: "1px solid #dadada",
          borderRadius: "12px",
          mb: 3,
          overflow: "hidden",
        }}
      >
        <ScrollableTable minWidth={1300} transparentScrollbar>
          <Table>
            <TableHead>
              <TableRow>
                {[
                  { label: "Name", field: "name", minWidth: { xs: 140, sm: 160 } },
                  { label: "Gender", field: "gender", minWidth: { xs: 100, sm: 120 } },
                  { label: "Email Address", field: "email", minWidth: { xs: 160, sm: 200 } },
                  { label: "Mobile No.", field: "mobile", minWidth: { xs: 140, sm: 160 } },
                  { label: "Date Joined", field: "dateJoined", minWidth: { xs: 130, sm: 150 } },
                  { label: "Membership Plan", field: "membershipPlan", minWidth: { xs: 150, sm: 180 } },
                  {
                    label: "Date of Subscription",
                    field: "dateOfSubscription",
                    minWidth: { xs: 150, sm: 170 },
                  },
                  {
                    label: "Membership Expiry Date",
                    field: "membershipExpiry",
                    minWidth: { xs: 170, sm: 190 },
                  },
                  { label: "No. Of Golden Bowl", field: "goldenBowl", minWidth: { xs: 150, sm: 170 } },
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
                    minWidth: { xs: 140, sm: 180 },
                    borderBottom: "2px solid #e0e0e0",
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedMembers.map((member, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ fontSize: { xs: "0.625rem", sm: "14px" } }}>
                    {member.name}
                  </TableCell>
                  <TableCell sx={{ fontSize: { xs: "0.625rem", sm: "14px" } }}>
                    {member.gender || "N/A"}
                  </TableCell>
                  <TableCell
                      sx={{
                      fontSize: { xs: "0.625rem", sm: "14px" },
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: { xs: 180, sm: 220 },
                      }}
                    >
                    {member.email}
                  </TableCell>
                  <TableCell sx={{ fontSize: { xs: "0.625rem", sm: "14px" }, color: "#da1818" }}>
                    {member.mobile}
                  </TableCell>
                  <TableCell sx={{ fontSize: { xs: "0.625rem", sm: "14px" } }}>
                    {member.dateJoinedDisplay || member.joinDate || "-"}
                  </TableCell>
                  <TableCell sx={{ fontSize: { xs: "0.625rem", sm: "14px" } }}>
                    {member.membershipPlan || "N/A"}
                  </TableCell>
                  <TableCell sx={{ fontSize: { xs: "0.625rem", sm: "14px" } }}>
                    {member.dateOfSubscriptionDisplay || "-"}
                  </TableCell>
                  <TableCell sx={{ fontSize: { xs: "0.625rem", sm: "14px" } }}>
                    {member.membershipExpiryDisplay || "-"}
                  </TableCell>
                  <TableCell sx={{ fontSize: { xs: "0.625rem", sm: "14px" } }}>
                    {member.goldenBowl ?? 0}
                  </TableCell>
                  <TableCell sx={{ minWidth: { xs: 140, sm: 180 } }}>
                    <Box
                      sx={{
                        display: "flex",
                        gap: { xs: 0.5, sm: 1 },
                        alignItems: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      <Button
                        size="small"
                        onClick={() => handleView(member.id)}
                        sx={{
                          fontSize: { xs: "0.5rem", sm: "12px" },
                          color: "#da1818",
                          textTransform: "none",
                          minWidth: "auto",
                          p: 0,
                        }}
                      >
                        View
                      </Button>
                      <Typography
                        sx={{ color: "#8a8a8f", fontSize: { xs: "0.5rem", sm: "12px" } }}
                      >
                        /
                      </Typography>
                      <Button
                        size="small"
                        onClick={() => handleEdit(member.id)}
                        sx={{
                          fontSize: { xs: "0.5rem", sm: "12px" },
                          color: "#da1818",
                          textTransform: "none",
                          minWidth: "auto",
                          p: 0,
                        }}
                      >
                        Edit
                      </Button>
                      <Typography
                        sx={{ color: "#8a8a8f", fontSize: { xs: "0.5rem", sm: "12px" } }}
                      >
                        /
                      </Typography>
                      <Button
                        size="small"
                        onClick={() => handleDelete(member.id)}
                        sx={{
                          fontSize: { xs: "0.5rem", sm: "12px" },
                          color: "#da1818",
                          textTransform: "none",
                          minWidth: "auto",
                          p: 0,
                        }}
                      >
                        Delete
                      </Button>
                      <Typography
                        sx={{ color: "#8a8a8f", fontSize: { xs: "0.5rem", sm: "12px" } }}
                      >
                        /
                      </Typography>
                      <Button
                        size="small"
                        onClick={() => handleBroadcastSingle(member)}
                        sx={{
                          fontSize: { xs: "0.5rem", sm: "12px" },
                          color: "#da1818",
                          textTransform: "none",
                          minWidth: "auto",
                          p: 0,
                        }}
                      >
                        Broadcast
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollableTable>
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
            Showing {sortedMembers.length} members
          </Typography>
          <Button
            variant="contained"
            onClick={() => openBroadcastDialog(sortedMembers)}
            disabled={sortedMembers.length === 0}
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
              ? `Send a message to ${broadcastRecipients[0]?.name || "the selected member"}.`
              : `Send a message to ${broadcastRecipients.length} selected members.`}
          </DialogContentText>
          <TextField
            label="Subject"
            fullWidth
            sx={{ mb: 2 }}
            value={broadcastMessage.subject}
            onChange={(event) =>
              setBroadcastMessage((prev) => ({ ...prev, subject: event.target.value }))
            }
          />
          <TextField
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
          <Button
            onClick={() => {
              setBroadcastOpen(false)
              setBroadcastRecipients([])
              setBroadcastMessage({ subject: "", body: "" })
            }}
            sx={{ textTransform: "none" }}
          >
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
