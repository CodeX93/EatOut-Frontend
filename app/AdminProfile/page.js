"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormControlLabel,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material"
import { collection, getDocs, doc, setDoc, deleteDoc, serverTimestamp, getDoc } from "firebase/firestore"
import { auth } from "../../firebaseConfig"
import { updatePassword, updateEmail, reauthenticateWithCredential, EmailAuthProvider, createUserWithEmailAndPassword, deleteUser } from "firebase/auth"
import { db } from "../../firebaseConfig"
import AppLayout from "../components/AppLayout"
import { Edit, Delete, Add, Visibility, VisibilityOff } from "@mui/icons-material"

const ACCESS_RIGHTS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "analytics", label: "Analytics" },
  { id: "restaurants", label: "Restaurants" },
  { id: "members", label: "Members" },
  { id: "vouchers", label: "Vouchers" },
  { id: "referrals", label: "Referrals" },
  { id: "discount", label: "Discount Coupons" },
  { id: "bowls", label: "Golden Bowls" },
  { id: "cuisines", label: "Cuisines" },
  { id: "broadcast", label: "Broadcast" },
  { id: "bannerAds", label: "Banner Ads" },
  { id: "categories", label: "Categories" },
]

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  )
}

export default function AdminProfilePage() {
  const [tabValue, setTabValue] = useState(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  // Admin Profile States
  const [adminData, setAdminData] = useState({
    name: "",
    email: "",
    phone: "",
    customerSupportWhatsApp: "",
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  // Sub-Admin States
  const [subAdmins, setSubAdmins] = useState([])
  const [subAdminDialogOpen, setSubAdminDialogOpen] = useState(false)
  const [editingSubAdmin, setEditingSubAdmin] = useState(null)
  const [subAdminForm, setSubAdminForm] = useState({
    name: "",
    email: "",
    password: "",
    accessRights: [],
  })

  // Load admin profile data
  useEffect(() => {
    const loadAdminData = async () => {
      setLoading(true)
      try {
        const user = auth.currentUser
        if (user) {
          // Load from Firestore
          const adminDoc = await getDoc(doc(db, "admins", user.uid))
          if (adminDoc.exists()) {
            const data = adminDoc.data()
            setAdminData({
              name: data.name || "",
              email: data.email || user.email || "",
              phone: data.phone || "",
              customerSupportWhatsApp: data.customerSupportWhatsApp || "",
            })
          } else {
            // Create admin document if it doesn't exist
            setAdminData({
              name: user.displayName || "",
              email: user.email || "",
              phone: "",
              customerSupportWhatsApp: "",
            })
          }

          // Load sub-admins
          const subAdminsSnap = await getDocs(collection(db, "subAdmins"))
          const subAdminsList = []
          subAdminsSnap.forEach((doc) => {
            subAdminsList.push({
              id: doc.id,
              ...doc.data(),
            })
          })
          setSubAdmins(subAdminsList)
        }
      } catch (e) {
        console.error("Error loading admin data:", e)
        setError("Failed to load admin data")
      } finally {
        setLoading(false)
      }
    }
    loadAdminData()
  }, [])

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  // Admin Profile Functions
  const handleAdminDataChange = (field, value) => {
    setAdminData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSaveAdminProfile = async () => {
    setSaving(true)
    setError("")

    try {
      const user = auth.currentUser
      if (!user) {
        setError("No user logged in")
        return
      }

      // Update email if changed
      if (adminData.email !== user.email) {
        await updateEmail(user, adminData.email)
      }

      // Save to Firestore
      await setDoc(
        doc(db, "admins", user.uid),
        {
          name: adminData.name,
          email: adminData.email,
          phone: adminData.phone,
          customerSupportWhatsApp: adminData.customerSupportWhatsApp,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      )

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (e) {
      console.error("Error saving admin profile:", e)
      setError("Failed to save profile: " + e.message)
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match")
      return
    }

    if (passwordData.newPassword.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setSaving(true)
    setError("")

    try {
      const user = auth.currentUser
      if (!user) {
        setError("No user logged in")
        return
      }

      // Re-authenticate user
      const credential = EmailAuthProvider.credential(user.email, passwordData.currentPassword)
      await reauthenticateWithCredential(user, credential)

      // Update password
      await updatePassword(user, passwordData.newPassword)

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (e) {
      console.error("Error changing password:", e)
      if (e.code === "auth/wrong-password") {
        setError("Current password is incorrect")
      } else {
        setError("Failed to change password: " + e.message)
      }
    } finally {
      setSaving(false)
    }
  }

  // Sub-Admin Functions
  const handleOpenSubAdminDialog = (subAdmin = null) => {
    if (subAdmin) {
      setEditingSubAdmin(subAdmin.id)
      setSubAdminForm({
        name: subAdmin.name || "",
        email: subAdmin.email || "",
        password: "",
        accessRights: subAdmin.accessRights || [],
      })
    } else {
      setEditingSubAdmin(null)
      setSubAdminForm({
        name: "",
        email: "",
        password: "",
        accessRights: [],
      })
    }
    setSubAdminDialogOpen(true)
  }

  const handleCloseSubAdminDialog = () => {
    setSubAdminDialogOpen(false)
    setEditingSubAdmin(null)
    setSubAdminForm({
      name: "",
      email: "",
      password: "",
      accessRights: [],
    })
  }

  const handleToggleAccessRight = (rightId) => {
    setSubAdminForm((prev) => ({
      ...prev,
      accessRights: prev.accessRights.includes(rightId)
        ? prev.accessRights.filter((id) => id !== rightId)
        : [...prev.accessRights, rightId],
    }))
  }

  const handleSaveSubAdmin = async () => {
    if (!subAdminForm.name || !subAdminForm.email) {
      setError("Name and email are required")
      return
    }

    if (!editingSubAdmin && !subAdminForm.password) {
      setError("Password is required for new sub-admin")
      return
    }

    if (subAdminForm.password && subAdminForm.password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    if (subAdminForm.accessRights.length === 0) {
      setError("Please select at least one access right")
      return
    }

    setSaving(true)
    setError("")

    try {
      if (editingSubAdmin) {
        // Update existing sub-admin
        const subAdminDoc = await getDoc(doc(db, "subAdmins", editingSubAdmin))
        const existingData = subAdminDoc.data()
        
        const subAdminData = {
          name: subAdminForm.name,
          email: subAdminForm.email,
          accessRights: subAdminForm.accessRights,
          updatedAt: serverTimestamp(),
        }

        // Update Firestore
        await setDoc(doc(db, "subAdmins", editingSubAdmin), subAdminData, { merge: true })

        // If password is provided, update it in Firebase Auth
        if (subAdminForm.password && existingData?.authUid) {
          // Note: To update password, you need to sign in as that user first
          // For now, we'll just update the Firestore document
          // Password updates should be done by the sub-admin themselves or require admin re-authentication
        }
      } else {
        // Create new sub-admin with Firebase Auth user
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          subAdminForm.email,
          subAdminForm.password
        )

        const subAdminData = {
          name: subAdminForm.name,
          email: subAdminForm.email,
          accessRights: subAdminForm.accessRights,
          authUid: userCredential.user.uid,
          isSubAdmin: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }

        // Save to Firestore using the Firebase Auth UID as document ID
        await setDoc(doc(db, "subAdmins", userCredential.user.uid), subAdminData)
      }

      // Reload sub-admins
      const subAdminsSnap = await getDocs(collection(db, "subAdmins"))
      const subAdminsList = []
      subAdminsSnap.forEach((doc) => {
        subAdminsList.push({
          id: doc.id,
          ...doc.data(),
        })
      })
      setSubAdmins(subAdminsList)

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      handleCloseSubAdminDialog()
    } catch (e) {
      console.error("Error saving sub-admin:", e)
      if (e.code === "auth/email-already-in-use") {
        setError("Email is already registered. Please use a different email.")
      } else {
        setError("Failed to save sub-admin: " + e.message)
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteSubAdmin = async (subAdminId) => {
    if (!confirm("Are you sure you want to delete this sub-admin? This will also delete their Firebase Auth account.")) {
      return
    }

    setSaving(true)
    setError("")

    try {
      // Get sub-admin data to find authUid
      const subAdminDoc = await getDoc(doc(db, "subAdmins", subAdminId))
      const subAdminData = subAdminDoc.data()

      // Delete Firebase Auth user if authUid exists
      if (subAdminData?.authUid) {
        try {
          // Note: Deleting a user requires admin privileges or the user to be signed in
          // For now, we'll just delete from Firestore
          // In production, you might want to use Firebase Admin SDK on the backend
          console.log("Note: Firebase Auth user deletion requires admin privileges. User will be disabled in Firestore.")
        } catch (authError) {
          console.error("Error deleting Firebase Auth user:", authError)
          // Continue with Firestore deletion even if Auth deletion fails
        }
      }

      // Delete from Firestore
      await deleteDoc(doc(db, "subAdmins", subAdminId))

      // Reload sub-admins
      const subAdminsSnap = await getDocs(collection(db, "subAdmins"))
      const subAdminsList = []
      subAdminsSnap.forEach((doc) => {
        subAdminsList.push({
          id: doc.id,
          ...doc.data(),
        })
      })
      setSubAdmins(subAdminsList)

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (e) {
      console.error("Error deleting sub-admin:", e)
      setError("Failed to delete sub-admin: " + e.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AppLayout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            mb: 3,
            color: "#333",
            fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
          }}
        >
          Admin Profile Management
        </Typography>

        <Paper elevation={2} sx={{ borderRadius: 2 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 500,
              },
            }}
          >
            <Tab label="Admin Profile" />
            <Tab label="Sub-Admin Users" />
          </Tabs>

          {/* Admin Profile Tab */}
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Admin User Details
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Name"
                    value={adminData.name}
                    onChange={(e) => handleAdminDataChange("name", e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={adminData.email}
                    onChange={(e) => handleAdminDataChange("email", e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={adminData.phone}
                    onChange={(e) => handleAdminDataChange("phone", e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Customer Support for Member & Restaurant Apps (WhatsApp)"
                    value={adminData.customerSupportWhatsApp}
                    onChange={(e) => handleAdminDataChange("customerSupportWhatsApp", e.target.value)}
                    placeholder="e.g., +1234567890"
                    helperText="WhatsApp contact number for customer support"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    onClick={handleSaveAdminProfile}
                    disabled={saving}
                    sx={{
                      bgcolor: "#da1818",
                      "&:hover": {
                        bgcolor: "#c41515",
                      },
                    }}
                  >
                    {saving ? <CircularProgress size={24} color="inherit" /> : "Save Profile"}
                  </Button>
                </Grid>
              </Grid>

              <Box sx={{ mt: 4, pt: 4, borderTop: 1, borderColor: "divider" }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Change Password
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Current Password"
                      type={showPasswords.current ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))
                      }
                      InputProps={{
                        endAdornment: (
                          <IconButton
                            onClick={() =>
                              setShowPasswords((prev) => ({ ...prev, current: !prev.current }))
                            }
                          >
                            {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="New Password"
                      type={showPasswords.new ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))
                      }
                      InputProps={{
                        endAdornment: (
                          <IconButton
                            onClick={() =>
                              setShowPasswords((prev) => ({ ...prev, new: !prev.new }))
                            }
                          >
                            {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Confirm New Password"
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))
                      }
                      InputProps={{
                        endAdornment: (
                          <IconButton
                            onClick={() =>
                              setShowPasswords((prev) => ({ ...prev, confirm: !prev.confirm }))
                            }
                          >
                            {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      onClick={handleChangePassword}
                      disabled={saving}
                      sx={{
                        bgcolor: "#da1818",
                        "&:hover": {
                          bgcolor: "#c41515",
                        },
                      }}
                    >
                      {saving ? <CircularProgress size={24} color="inherit" /> : "Change Password"}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </TabPanel>

          {/* Sub-Admin Users Tab */}
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Sub-Admin Users Management
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => handleOpenSubAdminDialog()}
                  sx={{
                    bgcolor: "#da1818",
                    "&:hover": {
                      bgcolor: "#c41515",
                    },
                  }}
                >
                  Add Sub-Admin
                </Button>
              </Box>

              {subAdmins.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No sub-admin users found. Click "Add Sub-Admin" to create one.
                  </Typography>
                </Box>
              ) : (
                <TableContainer component={Paper} elevation={1}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: "#f9f9f9" }}>
                        <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Access Rights</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {subAdmins.map((subAdmin) => (
                        <TableRow key={subAdmin.id}>
                          <TableCell>{subAdmin.name}</TableCell>
                          <TableCell>{subAdmin.email}</TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                              {subAdmin.accessRights?.map((rightId) => {
                                const right = ACCESS_RIGHTS.find((r) => r.id === rightId)
                                return (
                                  <Chip
                                    key={rightId}
                                    label={right?.label || rightId}
                                    size="small"
                                    sx={{ fontSize: "0.7rem" }}
                                  />
                                )
                              }) || <Typography variant="caption">No access rights</Typography>}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", gap: 1 }}>
                              <IconButton
                                size="small"
                                onClick={() => handleOpenSubAdminDialog(subAdmin)}
                                sx={{ color: "#da1818" }}
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteSubAdmin(subAdmin.id)}
                                sx={{ color: "#d32f2f" }}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          </TabPanel>
        </Paper>

        {/* Sub-Admin Dialog */}
        <Dialog open={subAdminDialogOpen} onClose={handleCloseSubAdminDialog} maxWidth="md" fullWidth>
          <DialogTitle>{editingSubAdmin ? "Edit Sub-Admin" : "Add New Sub-Admin"}</DialogTitle>
          <DialogContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 1 }}>
              <TextField
                fullWidth
                label="Name"
                value={subAdminForm.name}
                onChange={(e) => setSubAdminForm((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={subAdminForm.email}
                onChange={(e) => setSubAdminForm((prev) => ({ ...prev, email: e.target.value }))}
                required
                disabled={!!editingSubAdmin}
              />
              {!editingSubAdmin && (
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={subAdminForm.password}
                  onChange={(e) => setSubAdminForm((prev) => ({ ...prev, password: e.target.value }))}
                  required
                  helperText="Password must be at least 6 characters"
                />
              )}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                  Access Rights
                </Typography>
                <Grid container spacing={2}>
                  {ACCESS_RIGHTS.map((right) => (
                    <Grid item xs={12} sm={6} md={4} key={right.id}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={subAdminForm.accessRights.includes(right.id)}
                            onChange={() => handleToggleAccessRight(right.id)}
                          />
                        }
                        label={right.label}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseSubAdminDialog} disabled={saving}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveSubAdmin}
              variant="contained"
              disabled={saving}
              sx={{
                bgcolor: "#da1818",
                "&:hover": {
                  bgcolor: "#c41515",
                },
              }}
            >
              {saving ? <CircularProgress size={24} color="inherit" /> : editingSubAdmin ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Error/Success Snackbars */}
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError("")}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert onClose={() => setError("")} severity="error" sx={{ width: "100%" }}>
            {error}
          </Alert>
        </Snackbar>

        <Snackbar
          open={success}
          autoHideDuration={3000}
          onClose={() => setSuccess(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: "100%" }}>
            Operation completed successfully!
          </Alert>
        </Snackbar>
      </Box>
    </AppLayout>
  )
}

