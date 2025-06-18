import { Box, Typography, Card, CardContent } from "@mui/material"

export default function TopVouchersCard({ vouchers = [], title = "Top Vouchers", reviewsText = "Al Baik Reviews" }) {
  const defaultVouchers = [
    { name: "Gloria Jeans", rating: "5 rating", color: "#2196F3" },
    { name: "Star Bucks", rating: "4.9 rating", color: "#FF9800" },
    { name: "Al Baik", rating: "4.8 rating", color: "#da1818", highlighted: true },
  ]

  const displayVouchers = vouchers.length > 0 ? vouchers : defaultVouchers

  return (
    <Card
      sx={{
        flex: 1,
        bgcolor: "#ffffff",
        border: "1px solid #dadada",
        borderRadius: "12px",
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        height: "fit-content",
        overflow: "hidden",
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            mb: { xs: 2, sm: 3 },
            fontSize: { xs: "1rem", sm: "1.25rem" },
            color: "#da1818",
            lineHeight: 1.2,
          }}
        >
          {title}
        </Typography>

        {/* Vouchers List */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 1, sm: 1.5 } }}>
          {displayVouchers.map((item, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                p: { xs: 0.25, sm: 0.5 },
                borderRadius: "8px",
                minWidth: 0,
                "&:hover": {
                  bgcolor: "#f5f5f5",
                },
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  color: "#000",
                  fontWeight: 500,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: "50%",
                  flexShrink: 1,
                }}
              >
                {item.name}
              </Typography>

              {item.highlighted ? (
                <Box
                  sx={{
                    bgcolor: "#FFE8E8",
                    border: `1px solid ${item.color || "#da1818"}`,
                    borderRadius: "20px",
                    px: { xs: 1, sm: 1.5 },
                    py: { xs: 0.25, sm: 0.5 },
                    flexShrink: 0,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: { xs: "0.625rem", sm: "0.75rem" },
                      color: item.color || "#da1818",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.rating}
                  </Typography>
                </Box>
              ) : (
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: { xs: "0.625rem", sm: "0.75rem" },
                    color: item.color || "#2196F3",
                    fontWeight: 600,
                    flexShrink: 0,
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.rating}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}
