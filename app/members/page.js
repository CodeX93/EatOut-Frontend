"use client"

import { useState } from "react"
import { Box } from "@mui/material"

// Components
import Header from "../components/Header"
import Sidebar from "../components/SideNavbar"
import MembersTable from "./components/MembersTable"
import TopSpenders from "./components/TopSpenders"
import MostFrequentUsers from "./components/MostFrequentUsers"
import VoucherRedemptions from "./components/VoucherRedemptions"

const drawerWidth = 240

export default function MembersPage() {
  const [sortBy, setSortBy] = useState("Name")
  const [relevantFilter, setRelevantFilter] = useState("Relevant")

  // Sample/mock data
  const members = [
    { id: "#00123", name: "Sara A.", phone: "(60) 626-2021", vouchers: 12, redeemed: 6, joinDate: "2023-11-12", status: "Active" },
    { id: "#00124", name: "John D.", phone: "(60) 626-2022", vouchers: 8, redeemed: 4, joinDate: "2023-10-15", status: "Active" },
    { id: "#00125", name: "Maria L.", phone: "(60) 626-2023", vouchers: 15, redeemed: 10, joinDate: "2023-09-20", status: "Active" },
    { id: "#00126", name: "Ahmed K.", phone: "(60) 626-2024", vouchers: 6, redeemed: 3, joinDate: "2023-11-01", status: "Active" },
    { id: "#00127", name: "Lisa M.", phone: "(60) 626-2025", vouchers: 20, redeemed: 12, joinDate: "2023-08-10", status: "Active" },
    { id: "#00128", name: "Robert B.", phone: "(60) 626-2026", vouchers: 4, redeemed: 2, joinDate: "2023-12-05", status: "Active" },
    { id: "#00129", name: "Emma W.", phone: "(60) 626-2027", vouchers: 18, redeemed: 9, joinDate: "2023-07-22", status: "Active" },
    { id: "#00130", name: "David R.", phone: "(60) 626-2028", vouchers: 11, redeemed: 7, joinDate: "2023-10-30", status: "Active" },
    { id: "#00131", name: "Sophie T.", phone: "(60) 626-2029", vouchers: 9, redeemed: 5, joinDate: "2023-09-15", status: "Active" },
    { id: "#00132", name: "Michael C.", phone: "(60) 626-2030", vouchers: 14, redeemed: 8, joinDate: "2023-11-18", status: "Active" },
    { id: "#00133", name: "Anna P.", phone: "(60) 626-2031", vouchers: 7, redeemed: 4, joinDate: "2023-08-25", status: "Active" },
    { id: "#00134", name: "James H.", phone: "(60) 626-2032", vouchers: 16, redeemed: 11, joinDate: "2023-12-12", status: "Active" },
  ]

  const topSpenders = [
    { rank: 1, name: "Sarah", email: "sarah@gmail.com", totalSpent: "$2,340.00", orders: 15, lastOrder: "13 May 2025" },
    { rank: 2, name: "John", email: "john@gmail.com", totalSpent: "$2,010.00", orders: 12, lastOrder: "11 May 2025" },
    { rank: 3, name: "Leena", email: "leena@gmail.com", totalSpent: "$1,980.50", orders: 10, lastOrder: "09 May 2025" },
    { rank: 4, name: "Amir", email: "amir@gmail.com", totalSpent: "$1,980.50", orders: 8, lastOrder: "07 May 2025" },
  ]

  const frequentUsers = [
    { rank: 1, name: "Sarah", email: "sarah@gmail.com", totalSpent: "$2,340.00", orders: 15, lastOrder: "13 May 2025" },
    { rank: 2, name: "John", email: "john@gmail.com", totalSpent: "$2,010.00", orders: 12, lastOrder: "11 May 2025" },
    { rank: 3, name: "Leena", email: "leena@gmail.com", totalSpent: "$1,980.50", orders: 10, lastOrder: "09 May 2025" },
  ]

  const voucherRedemptions = [
    { rank: 1, name: "Riya", email: "riya@gmail.com", vouchers: 8, discount: "$120.00", ordered: 8 },
    { rank: 2, name: "Amir", email: "amir@gmail.com", vouchers: 7, discount: "$105.00", ordered: 7 },
    { rank: 3, name: "Leena", email: "leena@gmail.com", vouchers: 6, discount: "$90.00", ordered: 6 },
    { rank: 4, name: "Zainab", email: "zainab@gmail.com", vouchers: 5, discount: "$80.00", ordered: 5 },
  ]

  return (
    <Box
      sx={{
        display: "flex",
        bgcolor: "#f9f9f9",
        minHeight: "100vh",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      <Header />
      <Sidebar activeItem="Members" />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: "100vh",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          ml: { xs: 0, sm: `${drawerWidth}px` },
          mt: { xs: "56px", sm: "64px" },
          overflow: "hidden",
        }}
      >
        {/* Content Container with Scroll */}
        <Box
          sx={{
            flex: 1,
            p: { xs: 1, sm: 2, md: 3 },
            overflow: "auto",
            height: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", xl: "row" },
              gap: { xs: 2, md: 3 },
              height: "100%",
              minHeight: "fit-content",
            }}
          >
            {/* Main Table Section */}
            <Box
              sx={{
                flex: { xl: "1 1 65%" },
                width: { xs: "100%", xl: "65%" },
                display: "flex",
                flexDirection: "column",
                minHeight: { xs: "auto", xl: "100%" },
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  minHeight: 0,
                }}
              >
                <MembersTable
                  members={members}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  relevantFilter={relevantFilter}
                  setRelevantFilter={setRelevantFilter}
                />
              </Box>
            </Box>

            {/* Right Panel */}
            <Box
              sx={{
                flex: { xl: "1 1 35%" },
                width: { xs: "100%", xl: "35%" },
                display: "flex",
                flexDirection: "column",
                gap: { xs: 2, md: 3 },
                minHeight: { xs: "auto", xl: "100%" },
              }}
            >
              <TopSpenders topSpenders={topSpenders} />
              <MostFrequentUsers frequentUsers={frequentUsers} />
              <VoucherRedemptions voucherRedemptions={voucherRedemptions} />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
