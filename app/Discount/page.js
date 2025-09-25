"use client"

import { useEffect, useState } from "react"
import { Box, Typography, Paper, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Snackbar, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, FormControl, InputLabel, Select, MenuItem } from "@mui/material"
import SideNavbar from "../components/SideNavbar"
import Header from "../components/Header"
import { db } from "../../firebaseConfig"
import { collection, getDocs, addDoc, serverTimestamp, doc, deleteDoc, setDoc } from "firebase/firestore"
import { Delete, Edit } from "@mui/icons-material"

const drawerWidth = 240

export default function DiscountPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [discounts, setDiscounts] = useState([])
  const [open, setOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [editingDiscount, setEditingDiscount] = useState(null)

  const [form, setForm] = useState({
    code: "",
    type: "amount",
    discount_amount: "",
    discount_percentage: "",
    validFor: "",
    purpose: "",
    quantity: "",
    validityDate: "",
  })

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError("")
      try {
        const snap = await getDocs(collection(db, "discount_coupons"))
        const rows = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        console.log("Fetched discounts:", rows)
        setDiscounts(rows.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)))
      } catch (e) {
        console.error("Error loading discounts:", e)
        setError("Failed to load discounts")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleCreate = async () => {
    console.log("Create button clicked, form data:", form)
    
    if (!form.code || !form.validFor || !form.purpose || !form.quantity || !form.validityDate) {
      console.log("Validation failed - missing required fields")
      setError("Please fill in all required fields")
      return
    }
    if (form.type === "amount" && !form.discount_amount) {
      console.log("Validation failed - missing discount amount")
      setError("Please enter discount amount")
      return
    }
    if (form.type === "percentage" && !form.discount_percentage) {
      console.log("Validation failed - missing discount percentage")
      setError("Please enter discount percentage")
      return
    }
    
    setSaving(true)
    setError("")
    try {
      const discountData = {
        id: form.code.trim(),
        type: form.type,
        "Valid For": form.validFor.trim(),
        "Purpose": form.purpose.trim(),
        quantity: Number(form.quantity),
        validityDate: new Date(form.validityDate),
        createdAt: serverTimestamp(),
      }
      
      if (form.type === "amount") {
        discountData.discount_amount = Number(form.discount_amount)
      } else if (form.type === "percentage") {
        discountData.discount_percentage = Number(form.discount_percentage)
      }
      
      console.log("Creating discount with data:", discountData)
      // Use the discount code as the document ID
      await setDoc(doc(db, "discount_coupons", form.code.trim()), discountData)
      console.log("Discount created successfully")
      
      setOpen(false)
      setForm({ code: "", type: "amount", discount_amount: "", discount_percentage: "", validFor: "", purpose: "", quantity: "", validityDate: "" })
      
      // reload
      const snap = await getDocs(collection(db, "discount_coupons"))
      setDiscounts(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setSuccess(true)
    } catch (e) {
      console.error("Error creating discount:", e)
      setError("Failed to create discount: " + e.message)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (discount) => {
    console.log("Edit clicked for discount:", discount)
    setEditingDiscount(discount)
    setForm({
      code: discount.id || "",
      type: discount.type || "amount",
      discount_amount: discount.discount_amount ? String(discount.discount_amount) : "",
      discount_percentage: discount.discount_percentage ? String(discount.discount_percentage) : "",
      validFor: discount["Valid For"] || "",
      purpose: discount.Purpose || "",
      quantity: discount.quantity ? String(discount.quantity) : "",
      validityDate: discount.validityDate ? 
        (discount.validityDate.toDate ? 
          discount.validityDate.toDate().toISOString().split('T')[0] : 
          new Date(discount.validityDate).toISOString().split('T')[0]
        ) : ""
    })
    setEditOpen(true)
  }

  const handleUpdate = async () => {
    try {
      setSaving(true)
      setError("")
      
      console.log("Update button clicked, form data:", form)
      
      // Validation
      if (!form.code.trim() || !form.validFor.trim() || !form.purpose.trim() || !form.quantity.trim() || !form.validityDate.trim()) {
        console.log("Validation failed - missing required fields")
        setError("Please fill in all required fields")
        return
      }
      
      if (form.type === "amount" && (!form.discount_amount || !form.discount_amount.trim() || Number(form.discount_amount) <= 0)) {
        console.log("Validation failed - missing discount amount")
        setError("Please enter a valid discount amount")
        return
      }
      
      if (form.type === "percentage" && (!form.discount_percentage || !form.discount_percentage.trim() || Number(form.discount_percentage) <= 0)) {
        console.log("Validation failed - missing discount percentage")
        setError("Please enter a valid discount percentage")
        return
      }
      
      const discountData = {
        "Valid For": form.validFor.trim(),
        "Purpose": form.purpose.trim(),
        quantity: Number(form.quantity),
        validityDate: new Date(form.validityDate),
        type: form.type,
        createdAt: editingDiscount.createdAt || serverTimestamp()
      }
      
      if (form.type === "amount") {
        discountData.discount_amount = Number(form.discount_amount)
      } else if (form.type === "percentage") {
        discountData.discount_percentage = Number(form.discount_percentage)
      }
      
      console.log("Updating discount with data:", discountData)
      // Update the existing document using the original ID
      await setDoc(doc(db, "discount_coupons", editingDiscount.id), discountData)
      console.log("Discount updated successfully")
      
      setEditOpen(false)
      setEditingDiscount(null)
      setForm({ code: "", type: "amount", discount_amount: "", discount_percentage: "", validFor: "", purpose: "", quantity: "", validityDate: "" })
      
      // Reload discounts
      const snapshot = await getDocs(collection(db, "discount_coupons"))
      const fetchedDiscounts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setDiscounts(fetchedDiscounts)
      
      setSuccess(true)
    } catch (e) {
      console.error("Error updating discount:", e)
      setError("Failed to update discount: " + e.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "discount_coupons", id))
      setDiscounts(prev => prev.filter(d => d.id !== id))
    } catch (e) {
      console.error("Error deleting discount:", e)
      setError("Failed to delete discount: " + e.message)
    }
  }

  return (
    <Box sx={{ display: "flex", bgcolor: "#f9f9f9", minHeight: "100vh" }}>
      {/* Header */}
      <Header />

      {/* Sidebar */}
      <SideNavbar />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          overflow: "hidden",
          mt: { xs: 7, sm: 8 }, // Account for fixed header
          ml: { xs: 0, sm: "240px" }, // Account for sidebar on larger screens
          width: "100%",
          maxWidth: "100%",
        }}
      >
        <Box sx={{ mb: 3, width: "100%", maxWidth: "100%" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
              flexWrap: "wrap",
              gap: 2,
              width: "100%",
            }}
          >
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 600,
                  color: "#da1818",
                  fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" },
                }}
              >
                Discount Coupons
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#666",
                  fontSize: "14px",
                  mt: 0.5,
                }}
              >
                Total: {discounts.length} discount coupons available
              </Typography>
            </Box>
            <Button
              variant="contained"
              onClick={() => setOpen(true)}
              sx={{
                bgcolor: "#da1818",
                "&:hover": {
                  bgcolor: "#b71c1c",
                },
                px: 3,
                py: 1,
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 600,
                ml: "auto",
              }}
            >
              New Discount
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 200 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Paper
              elevation={0}
              sx={{
                bgcolor: "#ffffff",
                border: "1px solid #dadada",
                borderRadius: "12px",
                overflow: "hidden",
                width: "100%",
                maxWidth: "100%",
                minWidth: "100%",
              }}
            >
              <TableContainer sx={{ maxHeight: "600px", overflow: "auto", width: "100%", maxWidth: "100%", minWidth: "100%" }}>
                <Table sx={{ width: "100%", minWidth: "100%", tableLayout: "fixed" }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#f9f9f9" }}>
                    <TableCell
                      sx={{
                        color: "#8a8a8f",
                        fontWeight: 600,
                        fontSize: { xs: "12px", sm: "14px" },
                        borderBottom: "1px solid #dadada",
                        py: 2,
                        width: "15%",
                      }}
                    >
                      Discount Code
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#8a8a8f",
                        fontWeight: 600,
                        fontSize: { xs: "12px", sm: "14px" },
                        borderBottom: "1px solid #dadada",
                        py: 2,
                        width: "12%",
                      }}
                    >
                      Discount
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#8a8a8f",
                        fontWeight: 600,
                        fontSize: { xs: "12px", sm: "14px" },
                        borderBottom: "1px solid #dadada",
                        py: 2,
                        width: "18%",
                      }}
                    >
                      Valid For
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#8a8a8f",
                        fontWeight: 600,
                        fontSize: { xs: "12px", sm: "14px" },
                        borderBottom: "1px solid #dadada",
                        py: 2,
                        width: "20%",
                      }}
                    >
                      Purpose
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#8a8a8f",
                        fontWeight: 600,
                        fontSize: { xs: "12px", sm: "14px" },
                        borderBottom: "1px solid #dadada",
                        py: 2,
                        textAlign: "center",
                        width: "10%",
                      }}
                    >
                      Quantity
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#8a8a8f",
                        fontWeight: 600,
                        fontSize: { xs: "12px", sm: "14px" },
                        borderBottom: "1px solid #dadada",
                        py: 2,
                        width: "15%",
                      }}
                    >
                      Validity Date
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#8a8a8f",
                        fontWeight: 600,
                        fontSize: { xs: "12px", sm: "14px" },
                        borderBottom: "1px solid #dadada",
                        py: 2,
                        textAlign: "center",
                        width: "10%",
                      }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {discounts.map((d) => {
                    console.log("Rendering discount:", d)
                    // Format discount display based on type
                    const discountDisplay = d.type === "amount" 
                      ? `-RM${d.discount_amount || 0}` 
                      : d.type === "percentage" 
                        ? `${d.discount_percentage || 0}% Discount`
                        : d.discount || "N/A"
                    
                    // Format validity date (supports both "Validity Date" and validityDate fields)
                    const ts = d["Validity Date"] || d.validityDate
                    console.log("Validity date object:", ts)
                    const validityDate = ts?.toDate ? 
                      ts.toDate().toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 
                      (typeof ts === 'string' ? ts : "N/A")
                    console.log("Formatted validity date:", validityDate)
                    
                    return (
                    <TableRow 
                      key={d.id} 
                      hover
                      sx={{
                        "&:hover": {
                          bgcolor: "#f8f9fa",
                        },
                        "&:last-child td": {
                          borderBottom: "none",
                        },
                      }}
                    >
                      <TableCell 
                        sx={{ 
                          fontWeight: 600, 
                          color: "#da1818", 
                          width: "15%",
                          py: 2,
                          borderBottom: "1px solid #f0f0f0",
                        }}
                      >
                        {d.id || "N/A"}
                      </TableCell>
                      <TableCell 
                        sx={{ 
                          width: "12%",
                          py: 2,
                          borderBottom: "1px solid #f0f0f0",
                        }}
                      >
                        {discountDisplay}
                      </TableCell>
                      <TableCell 
                        sx={{ 
                          width: "18%",
                          py: 2,
                          borderBottom: "1px solid #f0f0f0",
                        }}
                      >
                        {d["Valid For"] || "N/A"}
                      </TableCell>
                      <TableCell 
                        sx={{ 
                          width: "20%",
                          py: 2,
                          borderBottom: "1px solid #f0f0f0",
                        }}
                      >
                        {d.Purpose || "N/A"}
                      </TableCell>
                      <TableCell 
                        sx={{ 
                          width: "10%",
                          py: 2,
                          textAlign: "center",
                          borderBottom: "1px solid #f0f0f0",
                        }}
                      >
                        {d.quantity || "N/A"}
                      </TableCell>
                      <TableCell 
                        sx={{ 
                          width: "15%",
                          py: 2,
                          borderBottom: "1px solid #f0f0f0",
                        }}
                      >
                        {validityDate}
                      </TableCell>
                      <TableCell 
                        sx={{ 
                          width: "10%",
                          py: 2,
                          textAlign: "center",
                          borderBottom: "1px solid #f0f0f0",
                        }}
                      >
                        <IconButton 
                          size="small" 
                          color="primary" 
                          onClick={() => handleEdit(d)}
                          sx={{ "&:hover": { bgcolor: "#e3f2fd" }, mr: 1 }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error" 
                          onClick={() => handleDelete(d.id)}
                          sx={{ "&:hover": { bgcolor: "#ffebee" } }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    )
                  })}
                  {discounts.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} sx={{ textAlign: "center", py: 4, color: "#666" }}>
                        No discount coupons found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
          )}
        </Box>
      </Box>

        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Create Discount</DialogTitle>
          <DialogContent sx={{ pt: 2, maxHeight: "70vh", overflow: "auto" }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField label="Discount Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} fullWidth />
              
              <FormControl fullWidth>
                <InputLabel>Discount Type</InputLabel>
                <Select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  label="Discount Type"
                >
                  <MenuItem value="amount">Fixed Amount (e.g., -RM100)</MenuItem>
                  <MenuItem value="percentage">Percentage (e.g., 50% Discount)</MenuItem>
                </Select>
              </FormControl>
              
              {form.type === "amount" && (
                <TextField 
                  type="number" 
                  label="Discount Amount (RM)" 
                  value={form.discount_amount} 
                  onChange={(e) => setForm({ ...form, discount_amount: e.target.value })} 
                  fullWidth 
                />
              )}
              
              {form.type === "percentage" && (
                <TextField 
                  type="number" 
                  label="Discount Percentage (%)" 
                  value={form.discount_percentage} 
                  onChange={(e) => setForm({ ...form, discount_percentage: e.target.value })} 
                  fullWidth 
                />
              )}
              
              <TextField label="Valid For" value={form.validFor} onChange={(e) => setForm({ ...form, validFor: e.target.value })} fullWidth />
              <TextField label="Purpose" value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} fullWidth />
              <TextField type="number" label="Quantity" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} fullWidth />
              <TextField type="date" label="Validity Date" value={form.validityDate} onChange={(e) => setForm({ ...form, validityDate: e.target.value })} fullWidth InputLabelProps={{ shrink: true }} />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} variant="contained" disabled={saving}>
              {saving ? <CircularProgress size={18} /> : "Create"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Discount Modal */}
        <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Edit Discount</DialogTitle>
          <DialogContent sx={{ maxHeight: "70vh", overflow: "auto" }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
              <TextField 
                label="Discount Code" 
                value={form.code} 
                onChange={(e) => setForm({ ...form, code: e.target.value })} 
                fullWidth 
                disabled
                helperText="Discount code cannot be changed"
              />
              <FormControl fullWidth>
                <InputLabel>Discount Type</InputLabel>
                <Select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  label="Discount Type"
                >
                  <MenuItem value="amount">Fixed Amount</MenuItem>
                  <MenuItem value="percentage">Percentage</MenuItem>
                </Select>
              </FormControl>
              {form.type === "amount" && (
                <TextField 
                  type="number" 
                  label="Discount Amount (RM)" 
                  value={form.discount_amount} 
                  onChange={(e) => setForm({ ...form, discount_amount: e.target.value })} 
                  fullWidth 
                />
              )}
              {form.type === "percentage" && (
                <TextField 
                  type="number" 
                  label="Discount Percentage (%)" 
                  value={form.discount_percentage} 
                  onChange={(e) => setForm({ ...form, discount_percentage: e.target.value })} 
                  fullWidth 
                />
              )}
              <TextField label="Valid For" value={form.validFor} onChange={(e) => setForm({ ...form, validFor: e.target.value })} fullWidth />
              <TextField label="Purpose" value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} fullWidth />
              <TextField type="number" label="Quantity" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} fullWidth />
              <TextField type="date" label="Validity Date" value={form.validityDate} onChange={(e) => setForm({ ...form, validityDate: e.target.value })} fullWidth InputLabelProps={{ shrink: true }} />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdate} variant="contained" disabled={saving}>
              {saving ? <CircularProgress size={18} /> : "Update"}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
          <Alert severity="success" onClose={() => setSuccess(false)}>Discount updated successfully</Alert>
        </Snackbar>
    </Box>
  )
}


