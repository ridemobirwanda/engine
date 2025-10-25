// Environment configuration with fallbacks
export const environment = {
  // Supabase Configuration
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || "https://dfmbicodohmkyasuofov.supabase.co",
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmbWJpY29kb2hta3lhc3VvZm92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMjQwMDMsImV4cCI6MjA2OTgwMDAwM30.ZXHovVGDHiDcjaPOGZFN4oU2_HAi_ueN2CjZZjp5kbE"
  },
  
  // Google services removed to prevent loading issues
  
  // Stripe Configuration
  stripe: {
    publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_disabled",
    enabled: import.meta.env.VITE_STRIPE_ENABLED === "true" || false
  },
  
  // App Configuration
  app: {
    name: import.meta.env.VITE_APP_NAME || "EngineCore",
    url: import.meta.env.VITE_APP_URL || "https://enginemarkets.com",
    description: import.meta.env.VITE_APP_DESCRIPTION || "Premium Automotive Engines & Parts",
    version: import.meta.env.VITE_APP_VERSION || "1.0.0"
  },
  
  // Development
  development: {
    isDev: import.meta.env.DEV || false,
    isProd: import.meta.env.PROD || false,
    mode: import.meta.env.MODE || "development"
  }
};

// Validate required environment variables
export const validateEnvironment = () => {
  const errors: string[] = [];
  
  if (!environment.supabase.url) {
    errors.push("VITE_SUPABASE_URL is required");
  }
  
  if (!environment.supabase.anonKey) {
    errors.push("VITE_SUPABASE_ANON_KEY is required");
  }
  
  if (errors.length > 0) {
    console.warn("Environment validation errors:", errors);
  }
  
  return errors.length === 0;
};

// Initialize environment validation
validateEnvironment();

