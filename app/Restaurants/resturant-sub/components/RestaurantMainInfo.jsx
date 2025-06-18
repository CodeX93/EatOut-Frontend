import { Box, Typography, TextField, FormControl, Select, MenuItem, Paper } from "@mui/material"

export default function RestaurantMainInfo({ 
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

  const selectProps = {
    size: "small",
    disabled: readOnly,
    sx: {
      bgcolor: readOnly ? "#f8f8f8" : "#ffffff",
      borderRadius: "6px",
      fontSize: "14px",
      fontWeight: 400,
      color: "#333333",
      "& fieldset": {
        borderColor: "#e0e0e0",
        borderWidth: "1px",
      },
      "& .MuiSelect-select": {
        padding: "10px 12px",
        fontSize: "14px",
        fontWeight: 400,
        color: "#333333",
      },
    }
  }

  return (
    <Paper sx={{ p: 4, borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", height: "fit-content" }}>
      <Typography variant="h6" sx={{ fontWeight: 600, color: "#ff2d55", mb: 3 }}>
        Main Info
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Opening Days */}
        <Box>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: "#000000" }}>
            Opening Days
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <FormControl size="small" sx={{ flex: 1 }}>
              <Select
                value={restaurant.openingDays.start}
                onChange={(e) => handleFieldChange('openingDays', { ...restaurant.openingDays, start: e.target.value })}
                {...selectProps}
              >
                <MenuItem value="20-03-2025">20-03-2025</MenuItem>
                <MenuItem value="21-03-2025">21-03-2025</MenuItem>
                <MenuItem value="22-03-2025">22-03-2025</MenuItem>
              </Select>
            </FormControl>
            <Typography sx={{ color: "#8a8a8f", mx: 1, fontSize: "14px" }}>—</Typography>
            <FormControl size="small" sx={{ flex: 1 }}>
              <Select
                value={restaurant.openingDays.end}
                onChange={(e) => handleFieldChange('openingDays', { ...restaurant.openingDays, end: e.target.value })}
                {...selectProps}
              >
                <MenuItem value="25-03-2025">25-03-2025</MenuItem>
                <MenuItem value="26-03-2025">26-03-2025</MenuItem>
                <MenuItem value="27-03-2025">27-03-2025</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Opening Hours */}
        <Box>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: "#000000" }}>
            Opening Hours
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <FormControl size="small" sx={{ flex: 1 }}>
              <Select
                value={restaurant.openingHours.start}
                onChange={(e) => handleFieldChange('openingHours', { ...restaurant.openingHours, start: e.target.value })}
                {...selectProps}
              >
                <MenuItem value="09:00 AM">09:00 AM</MenuItem>
                <MenuItem value="10:00 AM">10:00 AM</MenuItem>
                <MenuItem value="11:00 AM">11:00 AM</MenuItem>
              </Select>
            </FormControl>
            <Typography sx={{ color: "#8a8a8f", mx: 1, fontSize: "14px" }}>—</Typography>
            <FormControl size="small" sx={{ flex: 1 }}>
              <Select
                value={restaurant.openingHours.end}
                onChange={(e) => handleFieldChange('openingHours', { ...restaurant.openingHours, end: e.target.value })}
                {...selectProps}
              >
                <MenuItem value="09:20 AM">09:20 AM</MenuItem>
                <MenuItem value="10:20 AM">10:20 AM</MenuItem>
                <MenuItem value="11:20 AM">11:20 AM</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Closing Hours */}
        <Box>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: "#000000" }}>
            Closing Hours
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <FormControl size="small" sx={{ flex: 1 }}>
              <Select
                value={restaurant.closingHours.start}
                onChange={(e) => handleFieldChange('closingHours', { ...restaurant.closingHours, start: e.target.value })}
                {...selectProps}
              >
                <MenuItem value="09:00 PM">09:00 PM</MenuItem>
                <MenuItem value="10:00 PM">10:00 PM</MenuItem>
                <MenuItem value="11:00 PM">11:00 PM</MenuItem>
              </Select>
            </FormControl>
            <Typography sx={{ color: "#8a8a8f", mx: 1, fontSize: "14px" }}>—</Typography>
            <FormControl size="small" sx={{ flex: 1 }}>
              <Select
                value={restaurant.closingHours.end}
                onChange={(e) => handleFieldChange('closingHours', { ...restaurant.closingHours, end: e.target.value })}
                {...selectProps}
              >
                <MenuItem value="10:00 PM">10:00 PM</MenuItem>
                <MenuItem value="11:00 PM">11:00 PM</MenuItem>
                <MenuItem value="12:00 AM">12:00 AM</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Price Range and Specialty */}
        <Box sx={{ display: "flex", gap: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: "#000000" }}>
              Price Range
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={restaurant.priceRange}
                onChange={(e) => handleFieldChange('priceRange', e.target.value)}
                {...selectProps}
              >
                <MenuItem value="$500">$500</MenuItem>
                <MenuItem value="$1000">$1000</MenuItem>
                <MenuItem value="$1500">$1500</MenuItem>
                <MenuItem value="$2000">$2000</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: "#000000" }}>
              Specialty
            </Typography>
            <TextField
              fullWidth
              value={restaurant.specialty}
              onChange={(e) => handleFieldChange('specialty', e.target.value)}
              {...textFieldProps}
            />
          </Box>
        </Box>

        {/* Description */}
        <Box>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: "#000000" }}>
            Description
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={restaurant.description}
            onChange={(e) => handleFieldChange('description', e.target.value)}
            variant="outlined"
            InputProps={{ readOnly }}
            sx={{
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
                padding: "12px",
                fontSize: "14px",
                fontWeight: 400,
                color: "#333333",
              },
            }}
          />
        </Box>
      </Box>
    </Paper>
  )
}