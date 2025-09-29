"use client"

import { useState, useEffect } from "react"
import { Box, Typography, Button, CircularProgress, Alert, TextField, InputAdornment } from "@mui/material"
import { Add, Search } from "@mui/icons-material"

// Firebase imports
import { db } from "../../firebaseConfig"
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore"

// Import your existing components
import AppLayout from "../components/AppLayout"

// Import the new components we'll create
import CuisinesTable from "./components/CuisinesTable"
import AddCuisineModal from "./components/AddCuisineModal"
import EditCuisineModal from "./components/EditCuisineModal"
import DeleteConfirmationModal from "./components/DeleteConfirmationModal"


export default function CuisinesPage() {
  const [cuisines, setCuisines] = useState([])
  const [filteredCuisines, setFilteredCuisines] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedCuisine, setSelectedCuisine] = useState(null)

  useEffect(() => {
    const loadCuisines = async () => {
      setLoading(true)
      setError(null)
      try {
        const adminDoc = await getDoc(doc(db, "admin", "admin"))
        if (adminDoc.exists()) {
          const data = adminDoc.data()
          const cuisinesData = data.cuisines || {}
          
          // Convert cuisines object to array format
          const cuisinesArray = Object.entries(cuisinesData).map(([name, data]) => ({
            name,
            numberOfRestUsing: data.numberOfRestUsing || 0,
            isActive: data.isActive !== false, // Default to true if not specified
          }))
          
          // Sort by name
          cuisinesArray.sort((a, b) => a.name.localeCompare(b.name))
          setCuisines(cuisinesArray)
          setFilteredCuisines(cuisinesArray)
        } else {
          setCuisines([])
          setFilteredCuisines([])
        }
      } catch (e) {
        console.error("Failed to load cuisines", e)
        setError("Failed to load cuisines data")
        setCuisines([])
        setFilteredCuisines([])
      } finally {
        setLoading(false)
      }
    }
    loadCuisines()
  }, [])

  // Search functionality
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCuisines(cuisines)
    } else {
      const filtered = cuisines.filter(cuisine =>
        cuisine.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredCuisines(filtered)
    }
  }, [searchTerm, cuisines])

  const handleAddCuisine = async (cuisineName) => {
    try {
      const adminDocRef = doc(db, "admin", "admin")
      const adminDoc = await getDoc(adminDocRef)
      
      if (adminDoc.exists()) {
        const data = adminDoc.data()
        const cuisines = data.cuisines || {}
        
        // Add new cuisine
        cuisines[cuisineName] = {
          numberOfRestUsing: 0,
        }
        
        await updateDoc(adminDocRef, {
          cuisines: cuisines,
        })
        
        // Update local state
        const newCuisine = {
          name: cuisineName,
          numberOfRestUsing: 0,
          isActive: true,
        }
        setCuisines(prev => [...prev, newCuisine].sort((a, b) => a.name.localeCompare(b.name)))
        setFilteredCuisines(prev => [...prev, newCuisine].sort((a, b) => a.name.localeCompare(b.name)))
        
        return true
      } else {
        // Create admin document if it doesn't exist
        await setDoc(adminDocRef, {
          cuisines: {
            [cuisineName]: {
              numberOfRestUsing: 0,
            }
          }
        })
        
        // Update local state
        const newCuisine = { name: cuisineName, numberOfRestUsing: 0, isActive: true }
        setCuisines([newCuisine])
        setFilteredCuisines([newCuisine])
        
        return true
      }
    } catch (e) {
      console.error("Failed to add cuisine", e)
      return false
    }
  }

  const handleEditCuisine = async (oldName, newName, isActive = true) => {
    try {
      const adminDocRef = doc(db, "admin", "admin")
      const adminDoc = await getDoc(adminDocRef)
      
      if (adminDoc.exists()) {
        const data = adminDoc.data()
        const cuisines = data.cuisines || {}
        
        // Remove old cuisine and add new one
        if (cuisines[oldName]) {
          const cuisineData = cuisines[oldName]
          delete cuisines[oldName]
          cuisines[newName] = {
            ...cuisineData,
            isActive: isActive,
          }
          
          await updateDoc(adminDocRef, {
            cuisines: cuisines,
          })
          
          // Update local state
          const updatedCuisines = cuisines.map(c => 
            c.name === oldName 
              ? { ...c, name: newName, isActive: isActive }
              : c
          ).sort((a, b) => a.name.localeCompare(b.name))
          
          setCuisines(updatedCuisines)
          setFilteredCuisines(updatedCuisines)
          
          return true
        }
      }
      return false
    } catch (e) {
      console.error("Failed to edit cuisine", e)
      return false
    }
  }

  const handleDeleteCuisine = async (cuisineName) => {
    try {
      const adminDocRef = doc(db, "admin", "admin")
      const adminDoc = await getDoc(adminDocRef)
      
      if (adminDoc.exists()) {
        const data = adminDoc.data()
        const cuisines = data.cuisines || {}
        
        // Remove cuisine
        if (cuisines[cuisineName]) {
          delete cuisines[cuisineName]
          
          await updateDoc(adminDocRef, {
            cuisines: cuisines,
          })
          
          // Update local state
          setCuisines(prev => prev.filter(c => c.name !== cuisineName))
          setFilteredCuisines(prev => prev.filter(c => c.name !== cuisineName))
          
          return true
        }
      }
      return false
    } catch (e) {
      console.error("Failed to delete cuisine", e)
      return false
    }
  }

  const handleEditClick = (cuisine) => {
    console.log("Edit clicked for cuisine:", cuisine)
    setSelectedCuisine(cuisine)
    setEditModalOpen(true)
  }

  const handleDeleteClick = (cuisine) => {
    console.log("Delete clicked for cuisine:", cuisine)
    setSelectedCuisine(cuisine)
    setDeleteModalOpen(true)
  }

  if (loading) {
    return (
      <AppLayout>
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            width: "100%",
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <CircularProgress sx={{ color: "#da1818", mb: 2 }} />
            <Typography variant="h6" sx={{ color: "#8a8a8f" }}>
              Loading cuisines data...
            </Typography>
          </Box>
        </Box>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 1.5, sm: 2, md: 3 },
          pt: { xs: 2.5, sm: 3, md: 3 },
          pb: { xs: "80px", sm: "100px", md: "120px" },
          overflow: "auto",
          width: "100%",
          minHeight: "100%",
        }}
      >
        <Box sx={{ mb: 3, width: "100%", maxWidth: "100%" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "center" },
                mb: { xs: 2.5, sm: 3 },
                flexWrap: "wrap",
                gap: { xs: 1.5, sm: 2 },
                width: "100%",
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 600,
                    color: "#da1818",
                    fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
                    lineHeight: 1.2,
                    mb: { xs: 0.5, sm: 0 },
                  }}
                >
                  Cuisines Management
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#666",
                    fontSize: { xs: "12px", sm: "13px", md: "14px" },
                    mt: 0.5,
                  }}
                >
                  Total: {cuisines.length} cuisines available
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setAddModalOpen(true)}
                sx={{
                  bgcolor: "#da1818",
                  "&:hover": {
                    bgcolor: "#b71c1c",
                  },
                  px: { xs: 2, sm: 3 },
                  py: { xs: 1.5, sm: 1 },
                  borderRadius: { xs: "6px", sm: "8px" },
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: { xs: "0.875rem", sm: "0.95rem" },
                  width: { xs: "100%", sm: "auto" },
                  ml: { xs: 0, sm: "auto" },
                }}
              >
                Add Cuisine
              </Button>
            </Box>

            {/* Search Bar */}
            <Box sx={{ mb: { xs: 2.5, sm: 3 }, width: "100%" }}>
              <TextField
                fullWidth
                placeholder="Search cuisines..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: "#8a8a8f" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: { xs: "6px", sm: "8px" },
                    backgroundColor: "#f8f9fa",
                    "& fieldset": {
                      borderColor: "#e0e0e0",
                    },
                    "&:hover fieldset": {
                      borderColor: "#da1818",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#da1818",
                    },
                  },
                }}
              />
            </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Cuisines Table */}
          <CuisinesTable
            cuisines={filteredCuisines}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        </Box>
      </Box>

      {/* Add Cuisine Modal */}
      <AddCuisineModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={handleAddCuisine}
      />

      {/* Edit Cuisine Modal */}
      <EditCuisineModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false)
          setSelectedCuisine(null)
        }}
        onEdit={handleEditCuisine}
        cuisine={selectedCuisine}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false)
          setSelectedCuisine(null)
        }}
        onDelete={handleDeleteCuisine}
        cuisine={selectedCuisine}
      />
    </AppLayout>
  )
}
