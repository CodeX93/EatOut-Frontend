import { Box, Typography, Card, CardContent } from "@mui/material"
import { SentimentVerySatisfied, SentimentVeryDissatisfied, Info } from "@mui/icons-material"

export default function RatingReviewsCard({
  rating = 4.8,
  positivePercentage = 97,
  negativePercentage = 3,
  title = "Rating And Reviews",
}) {
  // Generate star rating display
  const renderStars = () => {
    const stars = []
    const fullStars = Math.floor(rating)

    for (let i = 0; i < 5; i++) {
      stars.push(
        <Box
          key={i}
          component="span"
          sx={{
            fontSize: { xs: "1.25rem", sm: "1.5rem" },
            color: i < fullStars ? "#FFD700" : "#E0E0E0",
          }}
        >
          ★
        </Box>,
      )
    }
    return stars
  }

  return (
    <Card
      sx={{
        flex: 1,
        bgcolor: "#F5F5F5",
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

        {/* Star Rating Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: { xs: 2, sm: 3 },
            gap: 1,
          }}
        >
          <Box sx={{ display: "flex", gap: 0.25 }}>{renderStars()}</Box>
          <Typography
            variant="body1"
            sx={{
              fontWeight: "bold",
              fontSize: { xs: "0.875rem", sm: "1rem" },
              color: "#000",
              ml: 1,
            }}
          >
            {rating.toFixed(2)} Star
          </Typography>
          <Info
            sx={{
              fontSize: { xs: "1rem", sm: "1.25rem" },
              color: "#666",
              ml: 0.5,
            }}
          />
        </Box>

        {/* Reviews Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: { xs: 2, sm: 3 },
            position: "relative",
            px: { xs: 0.5, sm: 1 },
          }}
        >
          {/* Positive Reviews */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flex: 1,
              minWidth: 0,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <SentimentVerySatisfied
                sx={{
                  fontSize: { xs: "1rem", sm: "1.25rem" },
                  color: "#4CAF50",
                  mr: 0.5,
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                  fontWeight: "bold",
                  color: "#4CAF50",
                }}
              >
                {positivePercentage}%
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{
                fontSize: { xs: "0.625rem", sm: "0.75rem" },
                color: "#666",
                textAlign: "center",
                lineHeight: 1.2,
              }}
            >
              Positive Reviews
            </Typography>
          </Box>

          {/* Vertical Divider */}
          <Box
            sx={{
              width: "1px",
              height: { xs: "40px", sm: "50px" },
              bgcolor: "#DDD",
              mx: { xs: 1, sm: 2 },
              flexShrink: 0,
            }}
          />

          {/* Negative Reviews */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flex: 1,
              minWidth: 0,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <SentimentVeryDissatisfied
                sx={{
                  fontSize: { xs: "1rem", sm: "1.25rem" },
                  color: "#F44336",
                  mr: 0.5,
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                  fontWeight: "bold",
                  color: "#F44336",
                }}
              >
                {negativePercentage}%
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{
                fontSize: { xs: "0.625rem", sm: "0.75rem" },
                color: "#666",
                textAlign: "center",
                lineHeight: 1.2,
              }}
            >
              Negative Reviews
            </Typography>
          </Box>
        </Box>

        {/* Bottom Reviews Text */}
        <Box
          sx={{
            textAlign: "center",
            bgcolor: "#E8E8E8",
            borderRadius: "8px",
            p: { xs: 1, sm: 1.5 },
          }}
        >
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: "0.875rem", sm: "1rem" },
              color: "#333",
              fontWeight: 500,
            }}
          >
            Al Baik Reviews
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}
