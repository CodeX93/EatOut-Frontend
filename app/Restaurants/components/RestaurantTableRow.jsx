import { Box, Typography, TableRow, TableCell, Button } from "@mui/material"

export default function RestaurantTableRow({ 
  restaurant, 
  index, 
  onView,
  onEdit, 
  onDelete,
  onBroadcast,
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

  const handleBroadcast = () => {
    if (onBroadcast) {
      onBroadcast(restaurant, index)
    }
  }

  return (
    <TableRow>
      <TableCell sx={{ minWidth: { xs: 160, sm: 200 } }}>
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
        </Box>
      </TableCell>
      <TableCell
            sx={{ 
          fontSize: { xs: "0.625rem", sm: "12px" },
          minWidth: { xs: 160, sm: 200 },
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
        }}
      >
        {restaurant.email || "-"}
      </TableCell>
      <TableCell
        sx={{
          fontSize: { xs: "0.625rem", sm: "12px" },
          minWidth: { xs: 140, sm: 160 },
            }}
          >
        {Array.isArray(restaurant.cuisines) && restaurant.cuisines.length > 0
          ? restaurant.cuisines.join(", ")
          : "-"}
      </TableCell>
      <TableCell
        sx={{
        fontSize: { xs: "0.625rem", sm: "12px" },
          minWidth: { xs: 120, sm: 140 },
        }}
      >
        {restaurant.location}
      </TableCell>
      <TableCell
        sx={{
        fontSize: { xs: "0.625rem", sm: "12px" }, 
          minWidth: { xs: 130, sm: 150 },
        color: "#da1818",
        }}
      >
        {restaurant.phone}
      </TableCell>
      <TableCell
        sx={{
        fontSize: { xs: "0.625rem", sm: "12px" },
          minWidth: { xs: 120, sm: 140 },
        }}
      >
        {restaurant.vouchers}
      </TableCell>
      <TableCell sx={{ minWidth: { xs: 140, sm: 180 } }}>
        <Box
          sx={{
          display: "flex", 
            gap: { xs: 0.5, sm: 1 },
          alignItems: "center",
          flexWrap: "wrap",
          }}
        >
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
          <Typography
            sx={{
              color: "#8a8a8f",
              fontSize: { xs: "0.5rem", sm: "10px" },
            }}
          >
            /
          </Typography>
          <Button
            size="small"
            onClick={handleBroadcast}
            sx={{
              fontSize: { xs: "0.5rem", sm: "10px" },
              color: "#da1818",
              textTransform: "none",
              minWidth: "auto",
              p: 0,
            }}
          >
            Broadcast
          </Button>
        </Box>
      </TableCell>
    </TableRow>
  )
}
