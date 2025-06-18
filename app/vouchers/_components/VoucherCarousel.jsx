"use client"

import { useRef, useState, useEffect } from "react"
import { Box, Typography, Button, IconButton, useTheme } from "@mui/material"
import { ChevronLeft, ChevronRight } from "@mui/icons-material"
import VoucherCard from "./VoucherCard"
import { useRouter } from "next/navigation"

export default function VoucherCarousel({ title, vouchers, type = "review" }) {
  const router = useRouter()
  const theme = useTheme()
  const carouselRef = useRef(null)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [maxScroll, setMaxScroll] = useState(0)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  const handleViewAll = () => {
    if (type === "review") {
      router.push("/vouchers/sub/AllReviewVouchers")
    } else if (type === "expired") {
      router.push("/vouchers/sub/AllExpiredVouchers")
    }
  }

  const updateScrollButtons = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current
      setScrollPosition(scrollLeft)
      setMaxScroll(scrollWidth - clientWidth)
      setShowLeftArrow(scrollLeft > 10)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    const carousel = carouselRef.current
    if (carousel) {
      updateScrollButtons()
      carousel.addEventListener("scroll", updateScrollButtons)
      window.addEventListener("resize", updateScrollButtons)

      return () => {
        carousel.removeEventListener("scroll", updateScrollButtons)
        window.addEventListener("resize", updateScrollButtons)
      }
    }
  }, [])

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const cardWidth = 320 // approximate card width with margin
      const scrollAmount = direction === "left" ? -cardWidth : cardWidth
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  return (
    <Box sx={{ mb: { xs: 3, md: 4 }, width: "100%", position: "relative" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 1, sm: 0 },
          mb: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: "#da1818",
            fontSize: { xs: "1rem", sm: "1.25rem" },
          }}
        >
          {title}
        </Typography>
        <Button
          variant="contained"
          onClick={handleViewAll}
          sx={{
            bgcolor: "#da1818",
            color: "white",
            borderRadius: "8px",
            textTransform: "none",
            px: { xs: 1.5, sm: 2 },
            py: { xs: 0.5, sm: 0.5 },
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
            "&:hover": {
              bgcolor: "#c41515",
            },
            cursor: "pointer",
            alignSelf: { xs: "flex-start", sm: "auto" },
          }}
        >
          View All
        </Button>
      </Box>

      {/* Carousel Container with Scroll Indicators */}
      <Box sx={{ position: "relative", overflow: "visible" }}>
        {/* Left scroll button */}
        <IconButton
          sx={{
            position: "absolute",
            left: { xs: -8, sm: -16 },
            top: "50%",
            transform: "translateY(-50%)",
            bgcolor: "white",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            zIndex: 2,
            width: { xs: 32, sm: 40 },
            height: { xs: 32, sm: 40 },
            "&:hover": { bgcolor: "white" },
            opacity: showLeftArrow ? 1 : 0,
            transition: "opacity 0.3s ease",
            visibility: showLeftArrow ? "visible" : "hidden",
          }}
          onClick={() => scrollCarousel("left")}
        >
          <ChevronLeft sx={{ fontSize: { xs: "1rem", sm: "1.5rem" } }} />
        </IconButton>

        {/* Carousel container */}
        <Box
          ref={carouselRef}
          sx={{
            display: "flex",
            gap: { xs: 1.5, sm: 2 },
            overflowX: "auto",
            pb: 2,
            pt: 1,
            px: { xs: 0.5, sm: 1 },
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
            scrollSnapType: "x mandatory",
            maskImage: {
              xs: "none",
              sm: "linear-gradient(to right, rgba(0,0,0,1) 80%, rgba(0,0,0,0))",
            },
            WebkitMaskImage: {
              xs: "none",
              sm: "linear-gradient(to right, rgba(0,0,0,1) 80%, rgba(0,0,0,0))",
            },
          }}
        >
          {vouchers.map((voucher, index) => (
            <Box
              key={index}
              sx={{
                minWidth: { xs: "260px", sm: "280px", md: "300px" },
                maxWidth: { xs: "260px", sm: "280px", md: "300px" },
                flexShrink: 0,
                scrollSnapAlign: "start",
                transition: "transform 0.2s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                },
              }}
            >
              <VoucherCard voucher={voucher} type={type} />
            </Box>
          ))}
        </Box>

        {/* Right scroll button */}
        <IconButton
          sx={{
            position: "absolute",
            right: { xs: -8, sm: -16 },
            top: "50%",
            transform: "translateY(-50%)",
            bgcolor: "white",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            zIndex: 2,
            width: { xs: 32, sm: 40 },
            height: { xs: 32, sm: 40 },
            "&:hover": { bgcolor: "white" },
            opacity: showRightArrow ? 1 : 0,
            transition: "opacity 0.3s ease",
            visibility: showRightArrow ? "visible" : "hidden",
          }}
          onClick={() => scrollCarousel("right")}
        >
          <ChevronRight sx={{ fontSize: { xs: "1rem", sm: "1.5rem" } }} />
        </IconButton>
      </Box>

      {/* Scroll Progress Indicator */}
      <Box
        sx={{
          display: { xs: "flex", md: "none" },
          justifyContent: "center",
          alignItems: "center",
          mt: 1,
          gap: 0.5,
        }}
      >
        {Array.from({ length: Math.min(5, Math.ceil(vouchers.length / 2)) }).map((_, i) => (
          <Box
            key={i}
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: i === Math.floor((scrollPosition / maxScroll) * 5) ? "#da1818" : "#e0e0e0",
              transition: "background-color 0.3s ease",
            }}
          />
        ))}
      </Box>
    </Box>
  )
}
