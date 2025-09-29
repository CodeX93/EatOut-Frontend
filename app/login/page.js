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
  const [email, setEmail] = useState("admin@eatout.com")
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
      display: "flex",
      bgcolor: "#f5f5f5",
      // Chrome-specific fixes
      WebkitDisplay: "flex",
      flexDirection: "row",
      alignItems: "stretch",
      width: "100vw",
      overflow: "hidden",
    }}>
      {/* Login Form Container */}
      <Box
        sx={{
          width: { xs: "100%", md: "520px" },
          minWidth: { xs: "100%", md: "520px" },
          height: "100vh",
          backgroundColor: "#ffffff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          px: { xs: 3, sm: 4, md: 6 },
          py: { xs: 4, md: 6 },
          borderRadius: { xs: 0, md: "24px 0 0 24px" },
          boxShadow: { xs: "none", md: "0 20px 60px rgba(0, 0, 0, 0.15)" },
        }}
      >
          <Box sx={{ maxWidth: 400, width: "100%", mx: "auto" }}>
            {/* Mobile Image - Hidden on desktop */}
            <Box sx={{ 
              display: { xs: 'block', md: 'none' }, 
              mb: 4, 
              textAlign: 'center' 
            }}>
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: '200px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                  mx: 'auto',
                  maxWidth: '300px',
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
            <Box sx={{ mb: { xs: 6, md: 8 }, display: 'flex', justifyContent: 'flex-start' }}>
              <Image
                src="/logo.png"
                alt="E.A.T Logo"
                width={300}
                height={100}
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
                mb: 2,
                fontSize: { xs: "2rem", md: "2.5rem" },
              }}
            >
              Sign in
            </Typography>

            {/* Subtitle */}
            <Typography
              variant="body1"
              sx={{
                color: "#969696",
                mb: 4,
                fontSize: { xs: "0.9rem", md: "1rem" },
              }}
            >
              Please login to continue to your account.
            </Typography>

            {/* General error message */}
            {generalError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {generalError}
              </Alert>
            )}

            <form onSubmit={handleSignIn}>
              {/* Email field */}
              <Typography
                variant="body2"
                sx={{
                  color: "#da1818",
                  mb: 1,
                  fontWeight: 500,
                  fontSize: { xs: "0.85rem", md: "0.9rem" },
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
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    backgroundColor: "#ffffff",
                    "& fieldset": {
                      borderColor: errors.email ? "#da1818" : "#da1818",
                      borderWidth: "2px",
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
                    fontSize: { xs: "0.9rem", md: "1rem" },
                    py: { xs: 1.5, md: 1.75 },
                  },
                  "& .MuiFormHelperText-root": {
                    color: "#da1818",
                    fontSize: { xs: "0.75rem", md: "0.8rem" },
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
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    backgroundColor: "#ffffff",
                    "& fieldset": {
                      borderColor: errors.password ? "#da1818" : "#d9d9d9",
                      borderWidth: "1px",
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
                    fontSize: { xs: "0.9rem", md: "1rem" },
                    py: { xs: 1.5, md: 1.75 },
                    "&::placeholder": {
                      color: "#969696",
                      opacity: 1,
                    },
                  },
                  "& .MuiFormHelperText-root": {
                    color: "#da1818",
                    fontSize: { xs: "0.75rem", md: "0.8rem" },
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
                sx={{ mb: 4, ml: 0 }}
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
                  py: { xs: 1.5, md: 2 },
                  fontSize: { xs: "0.9rem", md: "1rem" },
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
          flex: 1,
          display: { xs: "none", md: "block" },
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#e0e0e0",
          borderRadius: { xs: 0, md: "0 24px 24px 0" },
          boxShadow: { xs: "none", md: "0 20px 60px rgba(0, 0, 0, 0.15)" },
          height: "100vh",
          width: "100%",
          minHeight: "100vh",
          minWidth: "100%",
          // Chrome-specific fixes
          WebkitFlex: 1,
          flexGrow: 1,
          flexShrink: 0,
          flexBasis: "auto",
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
            // Chrome-specific fixes
            position: 'absolute',
            top: 0,
            left: 0,
            WebkitObjectFit: 'cover',
            MozObjectFit: 'cover',
            msObjectFit: 'cover',
          }}
          onError={(e) => {
            console.error('Image failed to load:', e);
          }}
          onLoad={() => {
            console.log('Image loaded successfully');
          }}
        />
      </Box>
    </Box>
  )
}
