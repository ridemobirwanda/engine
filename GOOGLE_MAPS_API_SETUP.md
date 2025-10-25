# 🗺️ Google Maps API Setup Guide

## 🔑 Get Your Google Maps API Key

### Step 1: Create Google Cloud Project

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create New Project**
   - Click "Select a project" → "New Project"
   - Project name: `EngineCore Maps`
   - Click "Create"

### Step 2: Enable Google Maps API

1. **Navigate to APIs & Services**
   - In the left sidebar: APIs & Services → Library

2. **Enable Required APIs**
   - Search and enable these APIs:
     - ✅ **Maps JavaScript API** (for interactive maps)
     - ✅ **Places API** (for business listings)
     - ✅ **Geocoding API** (for address conversion)

### Step 3: Create API Key

1. **Go to Credentials**
   - APIs & Services → Credentials
   - Click "Create Credentials" → "API Key"

2. **Restrict Your API Key** (Important for security)
   - Click on your new API key
   - Under "Application restrictions":
     - Select "HTTP referrers (web sites)"
     - Add these referrers:
       ```
       https://enginemarkets.com/*
       https://*.enginemarkets.com/*
       http://localhost:*
       ```

3. **Restrict API Access**
   - Under "API restrictions":
     - Select "Restrict key"
     - Choose: Maps JavaScript API, Places API, Geocoding API

### Step 4: Update Your Website

1. **Add API Key to GoogleMapsStore Component**
   
   In `src/components/GoogleMapsStore.tsx`, replace:
   ```javascript
   script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places`;
   ```
   
   With:
   ```javascript
   script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_ACTUAL_API_KEY&libraries=places`;
   ```

2. **Update Business Coordinates**
   
   In the same file, update the coordinates to your exact location:
   ```javascript
   const businessInfo = {
     // ... other info
     lat: YOUR_EXACT_LATITUDE,  // Replace with your coordinates
     lng: YOUR_EXACT_LONGITUDE  // Replace with your coordinates
   };
   ```

### Step 5: Find Your Exact Coordinates

1. **Using Google Maps**
   - Go to https://maps.google.com/
   - Search for your business address
   - Right-click on your location
   - Click the coordinates that appear
   - Copy the latitude and longitude

2. **Alternative Method**
   - Use: https://www.latlong.net/
   - Enter your address
   - Get precise coordinates

## 💰 Pricing Information

### Google Maps Pricing (as of 2024)
- **Free Tier**: $200 credit per month
- **Maps JavaScript API**: $7 per 1,000 requests
- **Places API**: $32 per 1,000 requests
- **Geocoding API**: $5 per 1,000 requests

### Typical Usage for Your Site
- **Small business**: Usually stays within free tier
- **Monthly estimate**: 1,000-5,000 map loads = $0-35/month

## 🔒 Security Best Practices

1. **Always Restrict Your API Key**
   - Never use unrestricted keys
   - Limit to specific domains
   - Restrict to needed APIs only

2. **Monitor Usage**
   - Set up billing alerts
   - Monitor in Google Cloud Console
   - Set daily quotas if needed

3. **Environment Variables** (Recommended)
   - Store API key in environment variables
   - Don't commit keys to version control

## 🧪 Testing Your Setup

### Test Checklist:
- ✅ Map loads on contact page
- ✅ Business marker appears
- ✅ Info window shows business details
- ✅ "Get Directions" link works
- ✅ No console errors

### Common Issues:
1. **Map doesn't load**: Check API key and restrictions
2. **Marker missing**: Verify coordinates
3. **Console errors**: Check enabled APIs
4. **Billing errors**: Ensure billing is set up

## 🚀 Next Steps After Setup

1. **Test thoroughly** on your live site
2. **Monitor usage** in first month
3. **Optimize** if needed (lazy loading, etc.)
4. **Add more features**:
   - Store locator
   - Multiple locations
   - Custom markers
   - Street View integration

Your Google Maps integration will be ready once you complete these steps!
