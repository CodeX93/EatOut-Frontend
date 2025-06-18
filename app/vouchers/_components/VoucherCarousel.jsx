"use client"

import { useRef, useState, useEffect } from "react"
import { Box, Typography, Button, IconButton, useTheme } from "@mui/material"
import { ChevronLeft, ChevronRight } from "@mui/icons-material"
import VoucherCard from "./VoucherCard"
import { useRouter } from "next/navigation"

export default function VoucherCarousel({ title, vouchers = [], type = "review" }) {
  const router = useRouter()
  const theme = useTheme()
  const carouselRef = useRef(null)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [maxScroll, setMaxScroll] = useState(0)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  // Debug logging
  console.log("VoucherCarousel received props:", { title, vouchers, type })

  // Enhanced safety check for vouchers array and validate each voucher
  const safeVouchers = Array.isArray(vouchers)
    ? vouchers.filter((voucher, index) => {
        // Check if voucher exists and is an object
        if (!voucher || typeof voucher !== "object") {
          console.warn(`VoucherCarousel: Invalid voucher at index ${index}:`, voucher)
          return false
        }

        // Ensure all required properties exist (they can be any type, we'll handle conversion in VoucherCard)
        const hasRequiredProps =
          voucher.hasOwnProperty("discount") &&
          voucher.hasOwnProperty("minimumSpend") &&
          voucher.hasOwnProperty("restaurantName") &&
          voucher.hasOwnProperty("branch") &&
          voucher.hasOwnProperty("voucherCode") &&
          voucher.hasOwnProperty("usedDate")

        if (!hasRequiredProps) {
          console.warn(`VoucherCarousel: Voucher missing required properties at index ${index}:`, voucher)
        }

        return hasRequiredProps
      })
    : []

  // Debug logging for filtered vouchers
  console.log("VoucherCarousel filtered vouchers:", safeVouchers)

  const handleViewAll = () => {
    // Ensure we have a valid type before navigation
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
        window.removeEventListener("resize", updateScrollButtons)
      }
    }
  }, [safeVouchers])

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const cardWidth = 320 // approximate card width with margin
      const scrollAmount = direction === "left" ? -cardWidth : cardWidth
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  // Early return if no valid vouchers
  if (!safeVouchers || safeVouchers.length === 0) {
    return (
      <Box component="div" sx={{ mb: 3, width: "100%" }}>
        <Box
          component="div"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
            mb: 2,
          }}
        >
          <Typography
            component="div"
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "#da1818",
              fontSize: "1.25rem",
            }}
          >
            {title}
          </Typography>
        </Box>
        <Typography component="div" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
          No vouchers available
        </Typography>
      </Box>
    )
  }

  return (
    <Box component="div" sx={{ mb: 3, width: "100%", position: "relative" }}>
      {/* Header */}
      <Box
        component="div"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          mb: 2,
        }}
      >
        <Typography
          component="div"
          variant="h6"
          sx={{
            fontWeight: 600,
            color: "#da1818",
            fontSize: "1.25rem",
          }}
        >
          {title}
        </Typography>
        <Button
          component="div"
          variant="contained"
          onClick={handleViewAll}
          sx={{
            bgcolor: "#da1818",
            color: "white",
            borderRadius: "8px",
            textTransform: "none",
            px: 2,
            py: 0.5,
            fontSize: "0.875rem",
            "&:hover": {
              bgcolor: "#c41515",
            },
            cursor: "pointer",
          }}
        >
          View All
        </Button>
      </Box>

      {/* Carousel Container with Scroll Indicators */}
      <Box component="div" sx={{ position: "relative", overflow: "visible" }}>
        {/* Left scroll button */}
        <IconButton
          component="div"
          sx={{
            position: "absolute",
            left: -16,
            top: "50%",
            transform: "translateY(-50%)",
            bgcolor: "white",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            zIndex: 2,
            width: 40,
            height: 40,
            "&:hover": { bgcolor: "white" },
            opacity: showLeftArrow ? 1 : 0,
            transition: "opacity 0.3s ease",
            visibility: showLeftArrow ? "visible" : "hidden",
          }}
          onClick={() => scrollCarousel("left")}
        >
          <ChevronLeft sx={{ fontSize: "1.5rem" }} />
        </IconButton>

        {/* Carousel container */}
        <Box
          component="div"
          ref={carouselRef}
          sx={{
            display: "flex",
            gap: 2,
            overflowX: "auto",
            pb: 2,
            pt: 1,
            px: 1,
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
            scrollSnapType: "x mandatory",
            maskImage: "linear-gradient(to right, rgba(0,0,0,1) 80%, rgba(0,0,0,0))",
            WebkitMaskImage: "linear-gradient(to right, rgba(0,0,0,1) 80%, rgba(0,0,0,0))",
          }}
        >
          {safeVouchers.map((voucher, index) => {
            // Additional safety check in the map function
            if (!voucher || typeof voucher !== "object") {
              console.error(`VoucherCarousel: Invalid voucher in map at index ${index}:`, voucher)
              return null
            }

            return (
              <Box
                component="div"
                key={voucher.voucherCode || voucher.id || `voucher-${index}`}
                sx={{
                  minWidth: "300px",
                  maxWidth: "300px",
                  flexShrink: 0,
                  scrollSnapAlign: "start",
                  transition: "transform 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                  },
                }}
              >
                <VoucherCard
                  discount={voucher.discount}
                  minimumSpend={voucher.minimumSpend}
                  restaurantName={voucher.restaurantName}
                  branch={voucher.branch}
                  voucherCode={voucher.voucherCode}
                  usedDate={voucher.usedDate}
                  type={type}
                />
              </Box>
            )
          })}
        </Box>

        {/* Right scroll button */}
        <IconButton
          component="div"
          sx={{
            position: "absolute",
            right: -16,
            top: "50%",
            transform: "translateY(-50%)",
            bgcolor: "white",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            zIndex: 2,
            width: 40,
            height: 40,
            "&:hover": { bgcolor: "white" },
            opacity: showRightArrow ? 1 : 0,
            transition: "opacity 0.3s ease",
            visibility: showRightArrow ? "visible" : "hidden",
          }}
          onClick={() => scrollCarousel("right")}
        >
          <ChevronRight sx={{ fontSize: "1.5rem" }} />
        </IconButton>
      </Box>
    </Box>
  )
}
