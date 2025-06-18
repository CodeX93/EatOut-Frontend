"use client"

import { useRouter } from "next/navigation"
import {
  Box,
  Typography,
  Card,
  Chip,
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
  IconButton,
} from "@mui/material"
import { Search as SearchIcon, FilterList } from "@mui/icons-material"
import ScrollableTable from "./ScrollableTable"

export default function MembersTable({ members, sortBy, setSortBy, relevantFilter, setRelevantFilter }) {
  const router = useRouter()

  const handleView = (memberId) => {
    router.push(`/members/sub/view?id=${memberId}`)
  }

  const handleEdit = (memberId) => {
    router.push(`/members/sub/edit?id=${memberId}`)
  }

  const handleDelete = (memberId) => {
    router.push(`/members/sub/delete?id=${memberId}`)
  }

  return (
    <Box sx={{ mb: 3, width: "100%", overflow: "hidden" }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 600,
          color: "#da1818",
          mb: { xs: 2, md: 3 },
          fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" },
        }}
      >
        Members Overview
      </Typography>

      {/* Search and Filters */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "stretch", md: "center" },
          gap: { xs: 2, md: 2 },
          mb: 3,
        }}
      >
        <TextField
          placeholder="Search Member"
          size="small"
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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 1, sm: 1 },
            ml: { md: "auto" },
            flexWrap: { xs: "wrap", sm: "nowrap" },
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "#666666",
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
              flexShrink: 0,
            }}
          >
            Sort by
          </Typography>
          <FormControl size="small">
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              sx={{
                minWidth: { xs: 80, sm: 100 },
                borderRadius: "8px",
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
              }}
            >
              <MenuItem value="Name">Name</MenuItem>
              <MenuItem value="Date">Date</MenuItem>
              <MenuItem value="Spending">Spending</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small">
            <Select
              value={relevantFilter}
              onChange={(e) => setRelevantFilter(e.target.value)}
              sx={{
                minWidth: { xs: 80, sm: 100 },
                borderRadius: "8px",
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
              }}
            >
              <MenuItem value="Relevant">Relevant</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Recent">Recent</MenuItem>
            </Select>
          </FormControl>
          <IconButton size="small">
            <FilterList sx={{ color: "#666666" }} />
          </IconButton>
        </Box>
      </Box>

      {/* Members Account List Header */}
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: "#000000",
            fontSize: { xs: "1rem", sm: "1.25rem" },
          }}
        >
          Members Account list
        </Typography>
      </Box>

      {/* Members Table */}
      <Card
        sx={{
          bgcolor: "#ffffff",
          border: "1px solid #dadada",
          borderRadius: "12px",
          mb: 3,
          overflow: "hidden",
        }}
      >
        <ScrollableTable minWidth={900} transparentScrollbar={true}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    color: "#8a8a8f",
                    fontWeight: 500,
                    fontSize: { xs: "0.625rem", sm: "14px" },
                    minWidth: { xs: 80, sm: 100 },
                  }}
                >
                  Member ID
                </TableCell>
                <TableCell
                  sx={{
                    color: "#8a8a8f",
                    fontWeight: 500,
                    fontSize: { xs: "0.625rem", sm: "14px" },
                    minWidth: { xs: 80, sm: 100 },
                  }}
                >
                  Name
                </TableCell>
                <TableCell
                  sx={{
                    color: "#8a8a8f",
                    fontWeight: 500,
                    fontSize: { xs: "0.625rem", sm: "14px" },
                    minWidth: { xs: 100, sm: 120 },
                  }}
                >
                  Telephone
                </TableCell>
                <TableCell
                  sx={{
                    color: "#8a8a8f",
                    fontWeight: 500,
                    fontSize: { xs: "0.625rem", sm: "14px" },
                    minWidth: { xs: 70, sm: 80 },
                  }}
                >
                  Vouchers
                </TableCell>
                <TableCell
                  sx={{
                    color: "#8a8a8f",
                    fontWeight: 500,
                    fontSize: { xs: "0.625rem", sm: "14px" },
                    minWidth: { xs: 70, sm: 80 },
                  }}
                >
                  Redeemed
                </TableCell>
                <TableCell
                  sx={{
                    color: "#8a8a8f",
                    fontWeight: 500,
                    fontSize: { xs: "0.625rem", sm: "14px" },
                    minWidth: { xs: 90, sm: 100 },
                  }}
                >
                  Join Date
                </TableCell>
                <TableCell
                  sx={{
                    color: "#8a8a8f",
                    fontWeight: 500,
                    fontSize: { xs: "0.625rem", sm: "14px" },
                    minWidth: { xs: 60, sm: 70 },
                  }}
                >
                  Status
                </TableCell>
                <TableCell
                  sx={{
                    color: "#8a8a8f",
                    fontWeight: 500,
                    fontSize: { xs: "0.625rem", sm: "14px" },
                    minWidth: { xs: 100, sm: 120 },
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {members.map((member, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#da1818",
                        fontSize: { xs: "0.625rem", sm: "15px" },
                        fontWeight: 500,
                      }}
                    >
                      {member.id}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ fontSize: { xs: "0.625rem", sm: "14px" } }}>{member.name}</TableCell>
                  <TableCell sx={{ fontSize: { xs: "0.625rem", sm: "14px" }, color: "#da1818" }}>
                    {member.phone}
                  </TableCell>
                  <TableCell sx={{ fontSize: { xs: "0.625rem", sm: "14px" } }}>{member.vouchers}</TableCell>
                  <TableCell sx={{ fontSize: { xs: "0.625rem", sm: "14px" } }}>{member.redeemed}</TableCell>
                  <TableCell sx={{ fontSize: { xs: "0.625rem", sm: "14px" } }}>{member.joinDate}</TableCell>
                  <TableCell>
                    <Chip
                      label={member.status}
                      size="small"
                      sx={{
                        bgcolor: "#e8f5e8",
                        color: "#00c17c",
                        fontWeight: 500,
                        fontSize: { xs: "0.5rem", sm: "12px" },
                        height: { xs: "16px", sm: "20px" },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        gap: { xs: 0.25, sm: 0.5 },
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
                      <Typography sx={{ color: "#8a8a8f", fontSize: { xs: "0.5rem", sm: "12px" } }}>/</Typography>
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
                      <Typography sx={{ color: "#8a8a8f", fontSize: { xs: "0.5rem", sm: "12px" } }}>/</Typography>
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
            justifyContent: "center",
            p: { xs: 1.5, sm: 2 },
          }}
        >
          <Button
            variant="contained"
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
            }}
          >
            158 Accounts
          </Button>
        </Box>
      </Card>
    </Box>
  )
}
