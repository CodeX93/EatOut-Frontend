import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import { Box } from "@mui/material"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "E.AT Admin Dashboard",
  description: "Admin dashboard for E.AT restaurant management system",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          <Box
            component="div"
            sx={{
              display: "flex",
              minHeight: "100vh",
              bgcolor: "#f9f9f9",
              overflow: "hidden",
              width: "100%",
            }}
          >
            {children}
          </Box>
        </Providers>
      </body>
    </html>
  )
}
