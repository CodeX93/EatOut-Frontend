import { Box, Typography, TableRow, TableCell, Button } from "@mui/material"

export default function RestaurantTableRow({ 
  restaurant, 
  index, 
  onView,
  onEdit, 
  onDelete 
}) {
  const handleView = () => {
    if (onView) {
      onView(restaurant, index)
    }
  }

  const handleEdit = () => {
    if (onEdit) {
      onEdit(restaurant, index)
    }
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete(restaurant, index)
    }
  }

  return (
    <TableRow>
      <TableCell sx={{ minWidth: { xs: 120, sm: 150 } }}>
        <Box>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              color: index === 0 ? "#da1818" : "#000000",
              fontSize: { xs: "0.625rem", sm: "13px" },
              lineHeight: 1.2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: { xs: "100px", sm: "140px" },
            }}
          >
            {restaurant.name}
          </Typography>
          <Typography 
            variant="caption" 
            sx={{ 
              color: "#8a8a8f", 
              fontSize: { xs: "0.5rem", sm: "11px" },
              lineHeight: 1.2,
              display: "block",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: { xs: "100px", sm: "140px" },
            }}
          >
            {restaurant.address}
          </Typography>
        </Box>
      </TableCell>
      <TableCell sx={{ 
        fontSize: { xs: "0.625rem", sm: "12px" },
        minWidth: { xs: 80, sm: 100 },
      }}>
        {restaurant.location}
      </TableCell>
      <TableCell sx={{ 
        fontSize: { xs: "0.625rem", sm: "12px" }, 
        color: "#da1818",
        minWidth: { xs: 100, sm: 120 },
      }}>
        {restaurant.phone}
      </TableCell>
      <TableCell sx={{ 
        fontSize: { xs: "0.625rem", sm: "12px" },
        minWidth: { xs: 70, sm: 80 },
      }}>
        {restaurant.vouchers}
      </TableCell>
      <TableCell sx={{ 
        fontSize: { xs: "0.625rem", sm: "12px" },
        minWidth: { xs: 70, sm: 80 },
      }}>
        {restaurant.redeemed}
      </TableCell>
      <TableCell sx={{ minWidth: { xs: 100, sm: 120 } }}>
        <Box sx={{ 
          display: "flex", 
          gap: { xs: 0.25, sm: 0.5 }, 
          alignItems: "center",
          flexWrap: "wrap",
        }}>
          <Button
            size="small"
            onClick={handleView}
            sx={{
              fontSize: { xs: "0.5rem", sm: "10px" },
              color: "#da1818",
              textTransform: "none",
              minWidth: "auto",
              p: 0,
            }}
          >
            View
          </Button>
          <Typography sx={{ 
            color: "#8a8a8f", 
            fontSize: { xs: "0.5rem", sm: "10px" },
          }}>
            /
          </Typography>
          <Button
            size="small"
            onClick={handleEdit}
            sx={{
              fontSize: { xs: "0.5rem", sm: "10px" },
              color: "#da1818",
              textTransform: "none",
              minWidth: "auto",
              p: 0,
            }}
          >
            Edit
          </Button>
          <Typography sx={{ 
            color: "#8a8a8f", 
            fontSize: { xs: "0.5rem", sm: "10px" },
          }}>
            /
          </Typography>
          <Button
            size="small"
            onClick={handleDelete}
            sx={{
              fontSize: { xs: "0.5rem", sm: "10px" },
              color: "#da1818",
              textTransform: "none",
              minWidth: "auto",
              p: 0,
            }}
          >
            Delete
          </Button>
        </Box>
      </TableCell>
    </TableRow>
  )
}
