"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { auth } from '../../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Image from "next/image"
import {
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  IconButton,
  Grid,
  useTheme,
  useMediaQuery,
  Alert,
} from "@mui/material"
import { Visibility, VisibilityOff } from "@mui/icons-material"

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [keepLoggedIn, setKeepLoggedIn] = useState(false)
  const [email, setEmail] = useState("admin@eatofficial.com")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState({ email: "", password: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [generalError, setGeneralError] = useState("")

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const router = useRouter()

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const validateForm = () => {
    const newErrors = { email: "", password: "" }
    let isValid = true

    // Email validation
    if (!email) {
      newErrors.email = "Email is required"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address"
      isValid = false
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required"
      isValid = false
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSignIn = async (e) => {
    e.preventDefault()
    setGeneralError("")

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      try {
        await signInWithEmailAndPassword(auth, email, password);
        // alert("Logged in!");
        router.push("/dashboard")
      } catch (error) {
        console.error(error);
        alert("Login failed");
      }

      // Navigate to dashboard on successful sign in
      
    } catch (error) {
      setGeneralError("Sign in failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box sx={{ 
      height: "100vh", 
      width: "100vw",
      position: "relative",
      overflow: "hidden",
      bgcolor: "#f5f5f5",
    }}>
      {/* Login Form Container */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: { xs: "100%", sm: "100%", md: "520px" },
          height: "100%",
          backgroundColor: "#ffffff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          px: { xs: 2, sm: 3, md: 6 },
          py: { xs: 2, sm: 3, md: 6 },
          borderRadius: { xs: 0, sm: 0, md: "24px 0 0 24px" },
          boxShadow: { xs: "none", sm: "none", md: "0 20px 60px rgba(0, 0, 0, 0.15)" },
          overflow: "auto",
          zIndex: 2,
        }}
      >
          <Box sx={{ maxWidth: { xs: "100%", sm: 400, md: 400 }, width: "100%", mx: "auto" }}>
            {/* Mobile Image - Hidden on all screens now */}
            <Box sx={{ 
              display: 'none', 
              mb: { xs: 3, sm: 4, md: 4 }, 
              textAlign: 'center' 
            }}>
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: { xs: '150px', sm: '180px', md: '200px' },
                  borderRadius: { xs: '8px', sm: '12px', md: '12px' },
                  overflow: 'hidden',
                  boxShadow: { xs: '0 2px 8px rgba(0, 0, 0, 0.1)', sm: '0 4px 16px rgba(0, 0, 0, 0.1)', md: '0 4px 16px rgba(0, 0, 0, 0.1)' },
                  mx: 'auto',
                  maxWidth: { xs: '280px', sm: '300px', md: '300px' },
                }}
              >
                <Image
                  src="/loginscreenImage.png"
                  alt="Login Screen"
                  fill
                  sizes="(max-width: 768px) 100vw, 0vw"
                  style={{ objectFit: 'cover' }}
                  priority
                />
              </Box>
            </Box>

            {/* Logo */}
            <Box sx={{ mb: { xs: 3, sm: 4, md: 8 }, display: 'flex', justifyContent: { xs: 'center', sm: 'center', md: 'flex-start' } }}>
              <Image
                src="/logo.png"
                alt="E.A.T Logo"
                width={isMobile ? 200 : 300}
                height={isMobile ? 67 : 100}
                style={{ objectFit: 'contain' }}
                priority
              />
            </Box>

            {/* Sign in heading */}
            <Typography
              variant="h3"
              sx={{
                color: "#232323",
                fontWeight: 600,
                mb: { xs: 1.5, sm: 2, md: 2 },
                fontSize: { xs: "1.75rem", sm: "2rem", md: "2.5rem" },
                textAlign: { xs: "center", sm: "center", md: "left" },
              }}
            >
              Sign in
            </Typography>

            {/* Subtitle */}
            <Typography
              variant="body1"
              sx={{
                color: "#969696",
                mb: { xs: 3, sm: 3.5, md: 4 },
                fontSize: { xs: "0.85rem", sm: "0.9rem", md: "1rem" },
                textAlign: { xs: "center", sm: "center", md: "left" },
              }}
            >
              Please login to continue to your account.
            </Typography>

            {/* General error message */}
            {generalError && (
              <Alert severity="error" sx={{ mb: { xs: 2, sm: 2.5, md: 3 }, fontSize: { xs: "0.8rem", sm: "0.85rem", md: "0.9rem" } }}>
                {generalError}
              </Alert>
            )}

            <form onSubmit={handleSignIn}>
              {/* Email field */}
              <Typography
                variant="body2"
                sx={{
                  color: "#da1818",
                  mb: { xs: 0.75, sm: 1, md: 1 },
                  fontWeight: 500,
                  fontSize: { xs: "0.8rem", sm: "0.85rem", md: "0.9rem" },
                }}
              >
                Email
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
                sx={{
                  mb: { xs: 2.5, sm: 3, md: 3 },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: { xs: "6px", sm: "8px", md: "8px" },
                    backgroundColor: "#ffffff",
                    "& fieldset": {
                      borderColor: errors.email ? "#da1818" : "#da1818",
                      borderWidth: { xs: "1px", sm: "1.5px", md: "2px" },
                    },
                    "&:hover fieldset": {
                      borderColor: "#da1818",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#da1818",
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: "#232323",
                    fontSize: { xs: "0.85rem", sm: "0.9rem", md: "1rem" },
                    py: { xs: 1.25, sm: 1.5, md: 1.75 },
                    px: { xs: 1.25, sm: 1.5, md: 1.75 },
                  },
                  "& .MuiFormHelperText-root": {
                    color: "#da1818",
                    fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.8rem" },
                  },
                }}
              />

              {/* Password field */}
              <TextField
                fullWidth
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!errors.password}
                helperText={errors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClickShowPassword} edge="end" sx={{ color: "#969696" }}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: { xs: 2.5, sm: 3, md: 3 },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: { xs: "6px", sm: "8px", md: "8px" },
                    backgroundColor: "#ffffff",
                    "& fieldset": {
                      borderColor: errors.password ? "#da1818" : "#d9d9d9",
                      borderWidth: { xs: "1px", sm: "1px", md: "1px" },
                    },
                    "&:hover fieldset": {
                      borderColor: errors.password ? "#da1818" : "#9a9a9a",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#da1818",
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: "#232323",
                    fontSize: { xs: "0.85rem", sm: "0.9rem", md: "1rem" },
                    py: { xs: 1.25, sm: 1.5, md: 1.75 },
                    px: { xs: 1.25, sm: 1.5, md: 1.75 },
                    "&::placeholder": {
                      color: "#969696",
                      opacity: 1,
                      fontSize: { xs: "0.85rem", sm: "0.9rem", md: "1rem" },
                    },
                  },
                  "& .MuiFormHelperText-root": {
                    color: "#da1818",
                    fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.8rem" },
                  },
                }}
              />

              {/* Keep me logged in checkbox */}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={keepLoggedIn}
                    onChange={(e) => setKeepLoggedIn(e.target.checked)}
                    sx={{
                      color: "#d9d9d9",
                      "&.Mui-checked": {
                        color: "#da1818",
                      },
                      "& .MuiSvgIcon-root": {
                        fontSize: { xs: "1.2rem", md: "1.5rem" },
                      },
                    }}
                  />
                }
                label={
                  <Typography
                    sx={{
                      color: "#232323",
                      fontSize: { xs: "0.85rem", md: "0.9rem" },
                    }}
                  >
                    Keep me logged in
                  </Typography>
                }
                sx={{ mb: { xs: 3, sm: 3.5, md: 4 }, ml: 0 }}
              />

              {/* Sign in button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading}
                sx={{
                  backgroundColor: "#da1818",
                  color: "#ffffff",
                  borderRadius: "8px",
                  py: { xs: 1.25, sm: 1.5, md: 2 },
                  fontSize: { xs: "0.85rem", sm: "0.9rem", md: "1rem" },
                  fontWeight: 600,
                  textTransform: "none",
                  boxShadow: "none",
                  "&:hover": {
                    backgroundColor: "#c41515",
                    boxShadow: "none",
                  },
                  "&:active": {
                    boxShadow: "none",
                  },
                  "&:disabled": {
                    backgroundColor: "#969696",
                    color: "#ffffff",
                  },
                }}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </Box>
        </Box>

      {/* Image Container */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: { xs: 0, sm: 0, md: "520px" },
          width: { xs: "100%", sm: "100%", md: "calc(100% - 520px)" },
          height: { xs: "auto", sm: "auto", md: "100%" },
          bottom: { xs: 0, sm: 0, md: "auto" },
          top: { xs: "auto", sm: "auto", md: 0 },
          zIndex: 1,
        }}
      >
        <img
          src="/loginscreenImage.png"
          alt="Login Screen"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      </Box>
    </Box>
  )
}
