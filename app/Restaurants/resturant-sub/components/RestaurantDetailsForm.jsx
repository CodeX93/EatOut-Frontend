import { Box, Typography, TextField, Chip, IconButton, Paper } from "@mui/material"
import { KeyboardArrowDown } from "@mui/icons-material"

export default function RestaurantDetailsForm({ 
  restaurant, 
  readOnly = false,
  onFieldChange 
}) {
  const handleFieldChange = (field, value) => {
    if (onFieldChange && !readOnly) {
      onFieldChange(field, value)
    }
  }

  const textFieldProps = {
    variant: "outlined",
    size: "small",
    InputProps: { readOnly },
    sx: {
      "& .MuiOutlinedInput-root": {
        bgcolor: readOnly ? "#f8f8f8" : "#ffffff",
        borderRadius: "6px",
        fontSize: "14px",
        fontWeight: 400,
        color: "#333333",
        "& fieldset": {
          borderColor: "#e0e0e0",
          borderWidth: "1px",
        },
      },
      "& .MuiInputBase-input": {
        padding: "10px 12px",
        fontSize: "14px",
        fontWeight: 400,
        color: "#333333",
      },
    }
  }

  return (
    <Paper sx={{ p: 4, mb: 3, borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
      <Typography variant="h6" sx={{ fontWeight: 600, color: "#ff2d55", mb: 3 }}>
        Restaurant Details
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* First Row - Name and Cuisines */}
        <Box sx={{ display: "flex", gap: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: "#000000" }}>
              Restaurant Name
            </Typography>
            <TextField
              fullWidth
              value={restaurant.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              {...textFieldProps}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: "#000000" }}>
              Cuisines:
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                alignItems: "center",
                p: "10px 12px",
                border: "1px solid #e0e0e0",
                borderRadius: "6px",
                bgcolor: readOnly ? "#f8f8f8" : "#ffffff",
                minHeight: "40px",
              }}
            >
              {restaurant.cuisines.map((cuisine, index) => (
                <Chip
                  key={index}
                  label={cuisine}
                  sx={{
                    bgcolor: "#efeff4",
                    color: "#333333",
                    borderRadius: "4px",
                    height: "24px",
                    fontSize: "12px",
                    fontWeight: 400,
                  }}
                  onDelete={!readOnly ? () => {
                    const newCuisines = restaurant.cuisines.filter((_, i) => i !== index)
                    handleFieldChange('cuisines', newCuisines)
                  } : undefined}
                />
              ))}
              {!readOnly && (
                <IconButton size="small" sx={{ color: "#8a8a8f", ml: "auto" }}>
                  <KeyboardArrowDown />
                </IconButton>
              )}
            </Box>
          </Box>
        </Box>

        {/* Second Row - Address, City, Phone */}
        <Box sx={{ display: "flex", gap: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: "#000000" }}>
              Full Address
            </Typography>
            <TextField
              fullWidth
              value={restaurant.address}
              onChange={(e) => handleFieldChange('address', e.target.value)}
              {...textFieldProps}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: "#000000" }}>
              City/Location
            </Typography>
            <TextField
              fullWidth
              value={restaurant.city}
              onChange={(e) => handleFieldChange('city', e.target.value)}
              {...textFieldProps}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: "#000000" }}>
              Telephone Number
            </Typography>
            <TextField
              fullWidth
              value={restaurant.phone}
              onChange={(e) => handleFieldChange('phone', e.target.value)}
              {...textFieldProps}
            />
          </Box>
        </Box>

        {/* Third Row - Email */}
        <Box>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: "#000000" }}>
            Email Address
          </Typography>
          <TextField
            fullWidth
            value={restaurant.email}
            onChange={(e) => handleFieldChange('email', e.target.value)}
            {...textFieldProps}
          />
        </Box>
      </Box>
    </Paper>
  )
}