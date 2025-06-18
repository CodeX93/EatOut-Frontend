import { Box, Typography, Button, Chip, Paper } from "@mui/material"
import { 
  Add, 
  AcUnit, 
  Restaurant as RestaurantIcon, 
  ChildCare,
  Wifi,
  LocalParking,
  Pets
} from "@mui/icons-material"

export default function FacilitiesCard({ 
  facilities = [], 
  readOnly = false,
  onAddFacility,
  onRemoveFacility 
}) {
  const getFacilityIcon = (facility, index) => {
    const iconMap = {
      "Air Conditioning": <AcUnit sx={{ color: "white !important", fontSize: "16px" }} />,
      "Catering Available": <RestaurantIcon sx={{ color: "white !important", fontSize: "16px" }} />,
      "Baby Chair Available": <ChildCare sx={{ color: "white !important", fontSize: "16px" }} />,
      "WiFi": <Wifi sx={{ color: "white !important", fontSize: "16px" }} />,
      "Parking": <LocalParking sx={{ color: "white !important", fontSize: "16px" }} />,
      "Pet Friendly": <Pets sx={{ color: "white !important", fontSize: "16px" }} />,
    }
    
    return iconMap[facility] || <RestaurantIcon sx={{ color: "white !important", fontSize: "16px" }} />
  }

  const handleAddFacility = () => {
    if (onAddFacility && !readOnly) {
      onAddFacility()
    }
  }

  const handleRemoveFacility = (index) => {
    if (onRemoveFacility && !readOnly) {
      onRemoveFacility(index)
    }
  }

  return (
    <Paper sx={{ p: 4, borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: "#ff2d55" }}>
          Facilities and Services
        </Typography>
        {!readOnly && (
          <Button
            variant="contained"
            size="small"
            startIcon={<Add sx={{ fontSize: 16 }} />}
            onClick={handleAddFacility}
            sx={{
              bgcolor: "#ff2d55",
              color: "white",
              minWidth: "unset",
              height: 28,
              width: 28,
              padding: 0,
              borderRadius: "4px",
              "& .MuiButton-startIcon": {
                margin: 0,
              },
              "&:hover": { bgcolor: "#e6254d" },
            }}
          />
        )}
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {facilities.map((facility, index) => (
          <Chip
            key={index}
            icon={getFacilityIcon(facility, index)}
            label={facility}
            onDelete={!readOnly ? () => handleRemoveFacility(index) : undefined}
            sx={{
              bgcolor: "#ff2d55",
              color: "white",
              borderRadius: "4px",
              height: "32px",
              fontSize: "13px",
              fontWeight: 400,
              "& .MuiChip-icon": {
                color: "white",
              },
              "& .MuiChip-deleteIcon": {
                color: "white",
                "&:hover": {
                  color: "#ffcccc",
                },
              },
            }}
          />
        ))}
        {facilities.length === 0 && (
          <Typography variant="body2" sx={{ color: "#8a8a8f", fontStyle: "italic" }}>
            No facilities added yet
          </Typography>
        )}
      </Box>
    </Paper>
  )
}