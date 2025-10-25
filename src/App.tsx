// src/App.tsx
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Footer } from "@/components/Footer";
import { GuestAuthProvider } from "@/components/GuestAuthProvider";
import { Header } from "@/components/Header";
import { AdvancedSEOHead, StructuredDataTemplates } from "@/components/AdvancedSEOHead";
import { getSEOConfig, detectUserRegion } from "@/config/internationalSEO";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/hooks/useCart";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense, useEffect, useState, memo, startTransition } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AdminHeader } from "./components/AdminHeader";
import { AdminRouteGuardClean } from "./components/AdminRouteGuardClean";
import { AdminErrorBoundary } from "./components/AdminErrorBoundary";
import { AdminPerformanceMonitor } from "./components/AdminPerformanceMonitor";
import { PerformanceMonitor } from "./components/PerformanceMonitor";
import { PerformanceOptimizer } from "./components/PerformanceOptimizer";
import { ResourcePreloader } from "./components/ResourcePreloader";
import { GlobalLoadingProvider } from "./components/GlobalLoadingManager";
import { initializePerformanceOptimizations } from "./utils/loadingOptimizer";

// Lazy load heavy third-party integrations for better performance
const TawkChat = lazy(() => import("./components/TawkChat"));
const WhatsAppChat = lazy(() => import("./components/WhatsAppChat"));
const GoogleAdsUnified = lazy(() => import("./components/GoogleAdsUnified"));
const GoogleAdsInitializer = lazy(() => import("./components/GoogleAdsInitializer"));
const LocalBusinessSchema = lazy(() => import("./components/LocalBusinessSchema"));
const AdManager = lazy(() => import("./components/AdManager"));
const SEOHead = lazy(() => import("./components/SEOHead"));
const DynamicSEO = lazy(() => import("./components/DynamicSEO"));


// ✅ Eager-loaded core pages
import CartPage from "./pages/CartPage";
import HomePage from "./pages/HomePage";
import Products from "./pages/Products";

// ✅ Lazy-loaded pages
const AboutPage = lazy(() => import("./pages/AboutPage"));
const HelpCenter = lazy(() => import("./pages/HelpCenter"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const PaymentCancelled = lazy(() => import("./pages/PaymentCancelled"));
const Login = lazy(() => import("./pages/Login"));
const RebuiltEngines = lazy(() => import("./pages/RebuiltEngines"));
const UsedEngines = lazy(() => import("./pages/UsedEngines"));
const CylinderEngines = lazy(() => import("./pages/CylinderEngines"));
const Heads = lazy(() => import("./pages/Heads"));
const TimingComponents = lazy(() => import("./pages/TimingComponents"));
const Parts = lazy(() => import("./pages/Parts"));
const TechnicalSupport = lazy(() => import("./pages/TechnicalSupport"));
const FAQs = lazy(() => import("./pages/FAQs"));
const LiveChat = lazy(() => import("./pages/LiveChat"));
const ReturnsRefunds = lazy(() => import("./pages/ReturnsRefunds"));
const ShippingInfo = lazy(() => import("./pages/ShippingInfo"));
const WarrantyInfo = lazy(() => import("./pages/WarrantyInfo"));
const PaymentMethods = lazy(() => import("./pages/PaymentMethods"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Engines = lazy(() => import("./pages/Engines"));
const Support = lazy(() => import("./pages/Support"));

// ✅ Admin routes grouped
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminLoginIsolated = lazy(() => import("./pages/AdminLoginIsolated"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminProducts = lazy(() => import("./pages/AdminProducts"));
const AdminCategories = lazy(() => import("./pages/AdminCategories"));
const AdminOrders = lazy(() => import("./pages/AdminOrders"));
const AdminCustomers = lazy(() => import("./pages/AdminCustomers"));
const AdminSettings = lazy(() => import("./pages/AdminSettings"));
const AdminContent = lazy(() => import("./pages/AdminContent"));
const AdminPayments = lazy(() => import("./pages/AdminPayments"));
const AdminMedia = lazy(() => import("./pages/AdminMedia"));
const AdminContactMessages = lazy(() => import("./pages/AdminContactMessages"));
const AdminContactMessagesFixed = lazy(() => import("./pages/AdminContactMessagesFixed"));
const AdminDebug = lazy(() => import("./pages/AdminDebug"));
// AdminSetup, AdminQuickSetup, AdminBypass removed - using MySQL auth
const AdminRoleManagement = lazy(() => import("./pages/AdminRoleManagement"));
const AdminDirectAccess = lazy(async () => ({ default: (await import("./pages/AdminDirectAccess")).default }));

/* ===============================
   1. Page Loader
   =============================== */
const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

/* ===============================
   2. Delayed Loader for smoother UX
   =============================== */
const DelayedLoader = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 300); // Delay 300ms
    return () => clearTimeout(timer);
  }, []);

  return show ? <PageLoader /> : null;
};

/* ===============================
   3. React Query Client - Optimized
   =============================== */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 60 * 1000, // 30 min cache (increased)
      gcTime: 60 * 60 * 1000, // Garbage collect after 60 min (increased)
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: 1,
      retryDelay: 1000,
      // Performance optimizations
      networkMode: 'online',
      refetchInterval: false,
      refetchIntervalInBackground: false,
    },
    mutations: {
      retry: 1,
      networkMode: 'online',
    },
  },
});

// Removed PreloadProducts to avoid extra network call before UI interaction

/* ===============================
   5. Main App
   =============================== */
const AppInner = () => {
  const location = useLocation();

  // Show header/footer on non-admin routes
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Initialize performance optimizations
  useEffect(() => {
    initializePerformanceOptimizations();
  }, []);

  // Header search state
  const [headerSearch, setHeaderSearch] = useState("");

  // SEO configuration based on current route and user region
  const getSEOConfigForRoute = () => {
    const baseUrl = "https://enginemarkets.com";
    const currentPath = location.pathname;
    const userRegion = detectUserRegion();
    
    switch (currentPath) {
      case '/': {
        const homeConfig = getSEOConfig('homepage', userRegion);
        return {
          title: homeConfig.title,
          description: homeConfig.description,
          keywords: homeConfig.keywords,
          url: baseUrl,
          type: "website" as const,
          structuredData: StructuredDataTemplates.organization
        };
      }
      case '/products': {
        const productsConfig = getSEOConfig('products', userRegion);
        return {
          title: productsConfig.title,
          description: productsConfig.description,
          keywords: productsConfig.keywords,
          url: `${baseUrl}/products`,
          type: "website" as const,
          structuredData: StructuredDataTemplates.website
        };
      }
      case '/engines': {
        const enginesConfig = getSEOConfig('engines', userRegion);
        return {
          title: enginesConfig.title,
          description: enginesConfig.description,
          keywords: enginesConfig.keywords,
          url: `${baseUrl}/engines`,
          type: "website" as const,
          structuredData: StructuredDataTemplates.website
        };
      }
      case '/parts': {
        const partsConfig = getSEOConfig('products', userRegion);
        return {
          title: partsConfig.title.replace('Products', 'Engine Parts & Components'),
          description: partsConfig.description.replace('engines and parts', 'engine parts and components including cylinder heads, timing components'),
          keywords: partsConfig.keywords + ", cylinder heads, timing components, engine components, car parts, performance parts",
          url: `${baseUrl}/parts`,
          type: "website" as const,
          structuredData: StructuredDataTemplates.website
        };
      }
      case '/contact': {
        return {
          title: "Contact EngineCore - Get Expert Support | International Engine Supplier",
          description: "Get in touch with our engine experts. Professional support for all your automotive engine needs. International shipping available. Call +357 96115404 or visit our Auto City location.",
          keywords: "contact enginecore, engine support, automotive support, engine consultation, technical support, international engine supplier, engine support Asia, engine support Africa, engine support South America",
          url: `${baseUrl}/contact`,
          type: "website" as const,
          structuredData: StructuredDataTemplates.organization
        };
      }
      default: {
        const defaultConfig = getSEOConfig('homepage', userRegion);
        return {
          title: defaultConfig.title,
          description: defaultConfig.description,
          keywords: defaultConfig.keywords,
          url: `${baseUrl}${currentPath}`,
          type: "website" as const,
          structuredData: StructuredDataTemplates.website
        };
      }
    }
  };

  const seoConfig = getSEOConfigForRoute();

  return (
    <>
      {/* SEO Head */}
      <AdvancedSEOHead 
        {...seoConfig}
        alternateLanguages={{
          'en': 'https://enginemarkets.com',
          'zh': 'https://enginemarkets.com/zh',
          'hi': 'https://enginemarkets.com/hi',
          'ja': 'https://enginemarkets.com/ja',
          'ko': 'https://enginemarkets.com/ko',
          'th': 'https://enginemarkets.com/th',
          'vi': 'https://enginemarkets.com/vi',
          'id': 'https://enginemarkets.com/id',
          'ms': 'https://enginemarkets.com/ms',
          'ar': 'https://enginemarkets.com/ar',
          'fr': 'https://enginemarkets.com/fr',
          'sw': 'https://enginemarkets.com/sw',
          'pt': 'https://enginemarkets.com/pt',
          'es': 'https://enginemarkets.com/es'
        }}
      />
      
      {/* Disable heavy performance monitors in development for faster loading */}
      {!import.meta.env.DEV && <PerformanceOptimizer />}
      {/* Admin performance monitoring - only in production */}
      {isAdminRoute && !import.meta.env.DEV && <AdminPerformanceMonitor />}
      {/* Disable performance monitoring in dev mode for speed */}
      {/* Resource preloader - only on homepage and only in production */}
      {location.pathname === '/' && !import.meta.env.DEV && <ResourcePreloader />}
      
      {/* Lazy load heavy third-party components */}
      <Suspense fallback={null}>
        <TawkChat />
        <WhatsAppChat />
        <GoogleAdsInitializer />
        <GoogleAdsUnified />
        <LocalBusinessSchema />
        <SEOHead />
        <DynamicSEO />
      </Suspense>
      
      {/* Header Advertisement - Lazy loaded */}
      {!isAdminRoute && (
        <Suspense fallback={<div style={{height: '90px'}} />}>
          <div className="w-full flex justify-center py-1 bg-gray-50/50 border-b border-gray-100">
            <AdManager position="header" size="large" className="max-w-6xl" />
          </div>
        </Suspense>
      )}
      {isAdminRoute ? (
        <AdminHeader />
      ) : (
        <Header
          searchQuery={headerSearch}
          onSearchChange={setHeaderSearch}
        />
      )}
      <Suspense fallback={<DelayedLoader />}> 
        <Routes>
          {/* User-facing routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-cancelled" element={<PaymentCancelled />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/about" element={<AboutPage />} />
          {/* Contact route handled by new Contact page */}
          <Route path="/login" element={<Login />} />

            {/* Engines landing with submenu */}
            <Route path="/engines" element={<Engines />} />

            {/* Support hub */}
            <Route path="/support" element={<Support />} />

            <Route path="/rebuilt-engines" element={<RebuiltEngines />} />
            <Route path="/used-engines" element={<UsedEngines />} />
            <Route path="/cylinders/:cyl" element={<CylinderEngines />} />
            <Route path="/heads" element={<Heads />} />
            <Route path="/timing-components" element={<TimingComponents />} />
            <Route path="/parts" element={<Parts />} />

            <Route path="/technical-support" element={<TechnicalSupport />} />
            <Route path="/help-center" element={<HelpCenter />} />
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/live-chat" element={<LiveChat />} />
            <Route path="/returns-refunds" element={<ReturnsRefunds />} />
            <Route path="/shipping" element={<ShippingInfo />} />
            <Route path="/warranty" element={<WarrantyInfo />} />
            <Route path="/payment-methods" element={<PaymentMethods />} />

            {/* Contact route */}
            <Route path="/contact" element={<Contact />} />

            {/* Payment routes */}
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-cancelled" element={<PaymentCancelled />} />

            {/* Admin routes */}
            <Route path="/admin/login" element={<AdminLoginIsolated />} />
            {/* AdminSetup, AdminQuickSetup, AdminBypass removed - using MySQL auth */}
            <Route path="/admin/roles" element={<AdminRoleManagement />} />
            <Route path="/admin/direct" element={<AdminDirectAccess />} />
            
            {/* Protected Admin routes - Optimized */}
            <Route path="/admin" element={<AdminErrorBoundary><AdminRouteGuardClean><AdminDashboard /></AdminRouteGuardClean></AdminErrorBoundary>} />
            <Route path="/admin/products" element={<AdminErrorBoundary><AdminRouteGuardClean><AdminProducts /></AdminRouteGuardClean></AdminErrorBoundary>} />
            <Route path="/admin/products/new" element={<AdminErrorBoundary><AdminRouteGuardClean><AdminProducts /></AdminRouteGuardClean></AdminErrorBoundary>} />
            <Route path="/admin/categories" element={<AdminErrorBoundary><AdminRouteGuardClean><AdminCategories /></AdminRouteGuardClean></AdminErrorBoundary>} />
            <Route path="/admin/orders" element={<AdminErrorBoundary><AdminRouteGuardClean><AdminOrders /></AdminRouteGuardClean></AdminErrorBoundary>} />
            <Route path="/admin/customers" element={<AdminErrorBoundary><AdminRouteGuardClean><AdminCustomers /></AdminRouteGuardClean></AdminErrorBoundary>} />
            <Route path="/admin/settings" element={<AdminErrorBoundary><AdminRouteGuardClean><AdminSettings /></AdminRouteGuardClean></AdminErrorBoundary>} />
            <Route path="/admin/content" element={<AdminErrorBoundary><AdminRouteGuardClean><AdminContent /></AdminRouteGuardClean></AdminErrorBoundary>} />
            <Route path="/admin/payments" element={<AdminErrorBoundary><AdminRouteGuardClean><AdminPayments /></AdminRouteGuardClean></AdminErrorBoundary>} />
            <Route path="/admin/media" element={<AdminErrorBoundary><AdminRouteGuardClean><AdminMedia /></AdminRouteGuardClean></AdminErrorBoundary>} />
            <Route path="/admin/contact-messages" element={<AdminErrorBoundary><AdminRouteGuardClean><AdminContactMessagesFixed /></AdminRouteGuardClean></AdminErrorBoundary>} />
            <Route path="/admin/debug" element={<AdminDebug />} />
            <Route path="/admin/settings-direct" element={<AdminSettings />} />

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        {!isAdminRoute && (
          <>
            {/* Footer Advertisement - Lazy loaded */}
            <Suspense fallback={<div style={{height: '90px'}} />}>
              <div className="w-full flex justify-center py-2 bg-gray-50/50 border-t border-gray-100">
                <AdManager position="footer" size="large" className="max-w-6xl" />
              </div>
            </Suspense>
            <Footer />
          </>
        )}
    </>
  );
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <GlobalLoadingProvider>
        <CartProvider>
        <GuestAuthProvider>
          <ThemeProvider defaultTheme="dark" storageKey="enginecore-theme">
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <AppInner />
              </BrowserRouter>
            </TooltipProvider>
          </ThemeProvider>
        </GuestAuthProvider>
        </CartProvider>
      </GlobalLoadingProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
