import { Box, Typography, Button, TextField, Paper, Grid } from "@mui/material"
import { Add } from "@mui/icons-material"

export default function SocialMediaCard({ 
  socialMedia = {}, 
  readOnly = false,
  onFieldChange,
  onAddSocialMedia 
}) {
  const handleFieldChange = (field, value) => {
    if (onFieldChange && !readOnly) {
      onFieldChange(field, value)
    }
  }

  const handleAddSocialMedia = () => {
    if (onAddSocialMedia && !readOnly) {
      onAddSocialMedia()
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
        "&::placeholder": {
          color: "#8a8a8f",
          opacity: 1,
        },
      },
    }
  }

  const socialMediaFields = [
    { key: 'website', label: 'Enter Website Url (Optional)', placeholder: 'https://example.com' },
    { key: 'facebook', label: 'Enter Facebook Url (Optional)', placeholder: 'https://facebook.com/page' },
    { key: 'instagram', label: 'Enter Instagram Url (Optional)', placeholder: 'https://instagram.com/page' },
    { key: 'tiktok', label: 'Enter TikTok Url (Optional)', placeholder: 'https://tiktok.com/@page' },
  ]

  return (
    <Paper sx={{ p: 4, borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: "#ff2d55" }}>
          Social Media
        </Typography>
        {!readOnly && (
          <Button
            variant="contained"
            size="small"
            startIcon={<Add sx={{ fontSize: 16 }} />}
            onClick={handleAddSocialMedia}
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

      <Grid container spacing={2}>
        {socialMediaFields.map((field) => (
          <Grid item xs={12} md={6} key={field.key}>
            <TextField
              fullWidth
              placeholder={field.placeholder}
              value={socialMedia[field.key] || ''}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              {...textFieldProps}
            />
          </Grid>
        ))}
      </Grid>
    </Paper>
  )
}