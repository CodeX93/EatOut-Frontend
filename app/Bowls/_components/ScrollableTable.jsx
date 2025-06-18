"use client"

import { useState, useRef, useEffect } from "react"
import { Box, IconButton } from "@mui/material"
import { ChevronLeft, ChevronRight } from "@mui/icons-material"

export default function ScrollableTable({ children, minWidth = 600, transparentScrollbar = false }) {
  const [showLeftScroll, setShowLeftScroll] = useState(false)
  const [showRightScroll, setShowRightScroll] = useState(false)
  const containerRef = useRef(null)

  const checkScrollPosition = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current
      setShowLeftScroll(scrollLeft > 0)
      setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  useEffect(() => {
    checkScrollPosition()
    const container = containerRef.current
    if (container) {
      container.addEventListener("scroll", checkScrollPosition)
      window.addEventListener("resize", checkScrollPosition)
      return () => {
        container.removeEventListener("scroll", checkScrollPosition)
        window.removeEventListener("resize", checkScrollPosition)
      }
    }
  }, [])

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -200, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 200, behavior: "smooth" })
    }
  }

  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      {/* Top Scroll Indicators */}
      <Box
        sx={{
          display: { xs: "flex", md: "none" },
          justifyContent: "space-between",
          alignItems: "center",
          px: 2,
          py: 1,
          bgcolor: "#f5f5f5",
          borderRadius: "8px 8px 0 0",
          border: "1px solid #dadada",
          borderBottom: "none",
        }}
      >
        <IconButton
          size="small"
          onClick={scrollLeft}
          disabled={!showLeftScroll}
          sx={{
            opacity: showLeftScroll ? 1 : 0.3,
            color: "#da1818",
          }}
        >
          <ChevronLeft />
        </IconButton>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          {Array.from({ length: 5 }).map((_, index) => (
            <Box
              key={index}
              sx={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                bgcolor: index === 0 ? "#da1818" : "#dadada",
              }}
            />
          ))}
        </Box>
        <IconButton
          size="small"
          onClick={scrollRight}
          disabled={!showRightScroll}
          sx={{
            opacity: showRightScroll ? 1 : 0.3,
            color: "#da1818",
          }}
        >
          <ChevronRight />
        </IconButton>
      </Box>

      {/* Table Container */}
      <Box
        ref={containerRef}
        sx={{
          overflowX: "auto",
          maxWidth: "100%",
          "&::-webkit-scrollbar": {
            height: transparentScrollbar ? 0 : 8,
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: transparentScrollbar ? "transparent" : "#f1f1f1",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: transparentScrollbar ? "transparent" : "#da1818",
            borderRadius: "4px",
            "&:hover": {
              backgroundColor: transparentScrollbar ? "transparent" : "#c41515",
            },
          },
          // For Firefox
          scrollbarWidth: transparentScrollbar ? "none" : "thin",
          scrollbarColor: transparentScrollbar ? "transparent transparent" : "#da1818 #f1f1f1",
        }}
      >
        <Box sx={{ minWidth }}>{children}</Box>
      </Box>

      {/* Bottom Scroll Indicators */}
      <Box
        sx={{
          display: { xs: "flex", md: "none" },
          justifyContent: "space-between",
          alignItems: "center",
          px: 2,
          py: 1,
          bgcolor: "#f5f5f5",
          borderRadius: "0 0 8px 8px",
          border: "1px solid #dadada",
          borderTop: "none",
        }}
      >
        <IconButton
          size="small"
          onClick={scrollLeft}
          disabled={!showLeftScroll}
          sx={{
            opacity: showLeftScroll ? 1 : 0.3,
            color: "#da1818",
          }}
        >
          <ChevronLeft />
        </IconButton>
        <Box
          sx={{
            flex: 1,
            height: 4,
            bgcolor: "#dadada",
            borderRadius: "2px",
            mx: 2,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              left: 0,
              top: 0,
              height: "100%",
              width: "30%",
              bgcolor: "#da1818",
              borderRadius: "2px",
              transition: "all 0.3s ease",
            }}
          />
        </Box>
        <IconButton
          size="small"
          onClick={scrollRight}
          disabled={!showRightScroll}
          sx={{
            opacity: showRightScroll ? 1 : 0.3,
            color: "#da1818",
          }}
        >
          <ChevronRight />
        </IconButton>
      </Box>
    </Box>
  )
}
