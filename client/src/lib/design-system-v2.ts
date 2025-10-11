// AfterHours HVAC - Industrial Neo-Brutalist Design System V2
// Dark-mode-forward industrial aesthetic

export const designTokens = {
  // Color Palette - Dark Industrial
  colors: {
    // Base Dark Tones
    void: '#0A0A0A',           // Deep black background
    charcoal: '#1A1A1A',       // Primary dark background
    gunmetal: '#2A2A2A',       // Secondary dark background
    steel: '#3A3A3A',          // Elevated surfaces
    iron: '#4A4A4A',           // Borders and dividers
    
    // Accent Colors
    cyberCyan: '#00F0FF',      // Primary electric cyan
    hazardAmber: '#FFB800',    // Warning/attention amber
    techGreen: '#00FF88',      // Success/active green
    alertRed: '#FF3366',       // Error/emergency red
    
    // Text
    textPrimary: '#FFFFFF',    // Primary text
    textSecondary: '#B0B0B0',  // Secondary text
    textMuted: '#707070',      // Muted text
    
    // Overlays
    glowCyan: 'rgba(0, 240, 255, 0.2)',
    glowAmber: 'rgba(255, 184, 0, 0.2)',
  },
  
  // Typography - Bold and Technical
  typography: {
    fonts: {
      heading: "'Space Grotesk', sans-serif",  // Bold, condensed headings
      body: "'Inter', sans-serif",              // Clean, readable body
      mono: "'JetBrains Mono', monospace",     // Technical details
    },
    
    sizes: {
      hero: '4.5rem',      // 72px
      h1: '3rem',          // 48px
      h2: '2.25rem',       // 36px
      h3: '1.75rem',       // 28px
      h4: '1.25rem',       // 20px
      body: '1rem',        // 16px
      small: '0.875rem',   // 14px
      tiny: '0.75rem',     // 12px
    },
    
    weights: {
      black: 900,
      bold: 700,
      semibold: 600,
      medium: 500,
      regular: 400,
    },
  },
  
  // Spacing - Tight and Precise
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
    '4xl': '6rem',   // 96px
  },
  
  // Border Radius - Sharp with selective rounding
  radius: {
    none: '0',
    sm: '2px',
    md: '4px',
    lg: '8px',
    full: '9999px',
  },
  
  // Shadows and Glows
  effects: {
    glowCyan: '0 0 20px rgba(0, 240, 255, 0.3), 0 0 40px rgba(0, 240, 255, 0.1)',
    glowAmber: '0 0 20px rgba(255, 184, 0, 0.3), 0 0 40px rgba(255, 184, 0, 0.1)',
    shadowElevated: '0 8px 32px rgba(0, 0, 0, 0.4)',
    shadowCard: '0 4px 16px rgba(0, 0, 0, 0.3)',
  },
  
  // Transitions - Snappy micro-animations
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '350ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

// Component Patterns
export const componentPatterns = {
  // Diagonal Grid Accent
  diagonalGrid: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0, 240, 255, 0.03) 10px, rgba(0, 240, 255, 0.03) 20px)',
  
  // Scan Line Effect
  scanLines: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 240, 255, 0.03) 2px, rgba(0, 240, 255, 0.03) 4px)',
  
  // Border Glow
  borderGlowCyan: `1px solid rgba(0, 240, 255, 0.3)`,
  borderGlowAmber: `1px solid rgba(255, 184, 0, 0.3)`,
};

// Layout Constants
export const layoutConstants = {
  navRailWidth: '80px',
  sidebarWidth: '280px',
  maxContentWidth: '1400px',
  headerHeight: '70px',
};
