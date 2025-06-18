import { Box, Typography, Button, Chip, Paper } from "@mui/material"
import { 
  Add, 
  AttachMoney, 
  AccountBalanceWallet,
  CreditCard,
  QrCode
} from "@mui/icons-material"

export default function PaymentOptionsCard({ 
  paymentOptions = [], 
  readOnly = false,
  onAddPaymentOption,
  onRemovePaymentOption 
}) {
  const getPaymentIcon = (option) => {
    const iconMap = {
      "Cash": <AttachMoney sx={{ color: "white !important", fontSize: "16px" }} />,
      "E-Wallets (Cashless Payment)": <AccountBalanceWallet sx={{ color: "white !important", fontSize: "16px" }} />,
      "Credit Card": <CreditCard sx={{ color: "white !important", fontSize: "16px" }} />,
      "QR Code": <QrCode sx={{ color: "white !important", fontSize: "16px" }} />,
    }
    
    return iconMap[option] || <AttachMoney sx={{ color: "white !important", fontSize: "16px" }} />
  }

  const handleAddPaymentOption = () => {
    if (onAddPaymentOption && !readOnly) {
      onAddPaymentOption()
    }
  }

  const handleRemovePaymentOption = (index) => {
    if (onRemovePaymentOption && !readOnly) {
      onRemovePaymentOption(index)
    }
  }

  return (
    <Paper sx={{ p: 4, borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: "#ff2d55" }}>
          Payment Options
        </Typography>
        {!readOnly && (
          <Button
            variant="contained"
            size="small"
            startIcon={<Add sx={{ fontSize: 16 }} />}
            onClick={handleAddPaymentOption}
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
        {paymentOptions.map((option, index) => (
          <Chip
            key={index}
            icon={getPaymentIcon(option)}
            label={option}
            onDelete={!readOnly ? () => handleRemovePaymentOption(index) : undefined}
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
        {paymentOptions.length === 0 && (
          <Typography variant="body2" sx={{ color: "#8a8a8f", fontStyle: "italic" }}>
            No payment options added yet
          </Typography>
        )}
      </Box>
    </Paper>
  )
}