// app/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ef4444', // Red color for primary elements
      dark: '#dc2626',
      light: '#f87171',
    },
    secondary: {
      main: '#6b7280', // Gray color for secondary elements
      dark: '#4b5563',
      light: '#9ca3af',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
    text: {
      primary: '#000000',
      secondary: '#6b7280',
      disabled: '#9ca3af',
    },
    error: {
      main: '#ef4444',
      dark: '#dc2626',
    },
    grey: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '3rem',
      fontWeight: 'bold',
      color: '#000000',
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '3rem',
      fontWeight: 'bold', 
      color: '#000000',
      lineHeight: 1.2,
    },
    h5: {
      fontWeight: 600,
      color: '#374151',
      letterSpacing: '0.025em',
    },
    body1: {
      fontSize: '16px',
      color: '#6b7280',
    },
    body2: {
      fontSize: '14px',
      fontWeight: 500,
      color: '#6b7280',
    }
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    // Custom TextField styling
    MuiTextField: {
      styleOverrides: {
        root: ({ theme, ownerState }) => ({
          '& .MuiOutlinedInput-root': {
            backgroundColor: ownerState.error ? 'white' : '#f5f5f5',
            '& fieldset': {
              borderColor: ownerState.error ? '#ef4444' : '#d1d5db',
              borderWidth: ownerState.error ? '2px' : '1px',
            },
            '&:hover fieldset': {
              borderColor: ownerState.error ? '#dc2626' : '#9ca3af',
            },
            '&.Mui-focused fieldset': {
              borderColor: ownerState.error ? '#dc2626' : '#6b7280',
              borderWidth: ownerState.error ? '2px' : '1px',
            },
          },
          '& .MuiInputBase-input': {
            padding: '16px 14px',
            fontSize: '16px'
          }
        }),
      },
    },
    // Custom Button styling
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '16px',
          padding: '16px',
          borderRadius: '8px',
        },
        contained: {
          backgroundColor: '#ef4444',
          color: 'white',
          '&:hover': {
            backgroundColor: '#dc2626',
          },
          '&:focus': {
            boxShadow: '0 0 0 2px rgba(239, 68, 68, 0.5)',
          }
        }
      },
    },
    // Custom Checkbox styling
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: '#6b7280',
          '&.Mui-checked': {
            color: '#6b7280',
          },
          '& .MuiSvgIcon-root': {
            fontSize: 20,
          }
        }
      },
    },
    // Custom IconButton styling
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#9ca3af',
          '&:hover': {
            color: '#6b7280',
          }
        }
      },
    },
    // Custom FormControlLabel styling
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          fontSize: '16px',
          color: '#374151',
        }
      },
    }
  },
  // Custom breakpoints
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  // Custom spacing
  spacing: 8, // Default spacing unit
});

// Custom styled components themes
export const loginTheme = {
  colors: {
    primary: '#ef4444',
    primaryDark: '#dc2626',
    secondary: '#6b7280',
    background: '#fafafa',
    white: '#ffffff',
    black: '#000000',
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
    }
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
  },
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '24px',
  },
  shadows: {
    focus: '0 0 0 2px rgba(239, 68, 68, 0.5)',
  }
};

export default theme;