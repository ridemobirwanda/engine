import { useEffect, useRef } from 'react';
import { MapPin, Phone, Clock, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface GoogleMapsStoreProps {
  showBusinessInfo?: boolean;
  height?: string;
  zoom?: number;
}

export const GoogleMapsStore = ({ 
  showBusinessInfo = true, 
  height = '400px',
  zoom = 15 
}: GoogleMapsStoreProps) => {
  const mapRef = useRef<HTMLDivElement>(null);

  // Business information
  const businessInfo = {
    name: 'EngineCore',
    address: 'Auto City, Cyprus',
    phone: '+357 96115404',
    email: 'verifiedengines@gmail.com',
    website: 'https://enginemarkets.com',
    hours: 'Mon-Fri: 8AM-6PM, Sat: 9AM-4PM, Sun: Closed',
    // Approximate coordinates for Cyprus (you'll need to update with exact location)
    lat: 35.1264,
    lng: 33.4299
  };

  useEffect(() => {
    // Check if we have a valid API key (you'll need to set this)
    const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '';
    
    // If no API key, show fallback immediately
    if (!GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY === 'YOUR_GOOGLE_MAPS_API_KEY') {
      showFallback();
      return;
    }

    // Load Google Maps script
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        initializeMap();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      script.onerror = () => {
        console.error('Failed to load Google Maps API');
        showFallback();
      };
      document.head.appendChild(script);
    };

    const initializeMap = () => {
      if (!mapRef.current || !window.google) {
        showFallback();
        return;
      }

      try {
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: businessInfo.lat, lng: businessInfo.lng },
          zoom: zoom,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        });

        // Add marker for business location
        const marker = new window.google.maps.Marker({
          position: { lat: businessInfo.lat, lng: businessInfo.lng },
          map: map,
          title: businessInfo.name,
          icon: {
            url: '/favicon.ico',
            scaledSize: new window.google.maps.Size(32, 32)
          }
        });

        // Info window content
        const infoWindowContent = `
          <div style="padding: 10px; max-width: 300px;">
            <h3 style="margin: 0 0 10px 0; color: #1a1a1a; font-size: 18px; font-weight: bold;">
              ${businessInfo.name}
            </h3>
            <div style="margin-bottom: 8px; display: flex; align-items: center;">
              <span style="margin-right: 8px;">📍</span>
              <span style="color: #666;">${businessInfo.address}</span>
            </div>
            <div style="margin-bottom: 8px; display: flex; align-items: center;">
              <span style="margin-right: 8px;">📞</span>
              <a href="tel:${businessInfo.phone}" style="color: #2563eb; text-decoration: none;">
                ${businessInfo.phone}
              </a>
            </div>
            <div style="margin-bottom: 8px; display: flex; align-items: center;">
              <span style="margin-right: 8px;">🌐</span>
              <a href="${businessInfo.website}" target="_blank" style="color: #2563eb; text-decoration: none;">
                Visit Website
              </a>
            </div>
            <div style="margin-bottom: 8px; display: flex; align-items: center;">
              <span style="margin-right: 8px;">🕒</span>
              <span style="color: #666; font-size: 12px;">${businessInfo.hours}</span>
            </div>
            <div style="margin-top: 10px;">
              <a href="https://www.google.com/maps/dir/?api=1&destination=${businessInfo.lat},${businessInfo.lng}" 
                 target="_blank" 
                 style="background: #2563eb; color: white; padding: 6px 12px; text-decoration: none; border-radius: 4px; font-size: 12px;">
                Get Directions
              </a>
            </div>
          </div>
        `;

        const infoWindow = new window.google.maps.InfoWindow({
          content: infoWindowContent
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });

        // Show info window by default
        infoWindow.open(map, marker);
      } catch (error) {
        console.error('Error initializing Google Maps:', error);
        showFallback();
      }
    };

    const showFallback = () => {
      if (mapRef.current) {
        mapRef.current.style.display = 'none';
      }
      const fallback = document.getElementById('map-fallback');
      if (fallback) {
        fallback.style.display = 'block';
      }
    };

    loadGoogleMaps();
  }, [zoom]);

  return (
    <div className="w-full">
      {showBusinessInfo && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Visit Our Store
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{businessInfo.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${businessInfo.phone}`} className="text-sm text-primary hover:underline">
                    {businessInfo.phone}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a href={businessInfo.website} className="text-sm text-primary hover:underline">
                    {businessInfo.website}
                  </a>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="text-sm">
                    <div>Mon-Fri: 8:00 AM - 6:00 PM</div>
                    <div>Saturday: 9:00 AM - 4:00 PM</div>
                    <div>Sunday: Closed</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          <div 
            ref={mapRef} 
            style={{ height, width: '100%' }}
            className="rounded-lg"
          />
          
          {/* Fallback for when Google Maps doesn't load */}
          <div className="hidden" id="map-fallback">
            <div 
              className="flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg border-2 border-dashed border-blue-200"
              style={{ height }}
            >
              <div className="text-center p-8 max-w-md">
                <div className="bg-blue-500 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <MapPin className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {businessInfo.name}
                </h3>
                <p className="text-gray-600 mb-2 text-lg">{businessInfo.address}</p>
                <p className="text-gray-500 mb-6 text-sm">
                  Interactive map will load when Google Maps API is configured
                </p>
                
                <div className="space-y-3">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(businessInfo.name + ' ' + businessInfo.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium w-full justify-center"
                  >
                    <MapPin className="h-5 w-5" />
                    View on Google Maps
                  </a>
                  
                  <a
                    href={`tel:${businessInfo.phone}`}
                    className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium w-full justify-center"
                  >
                    <Phone className="h-5 w-5" />
                    Call {businessInfo.phone}
                  </a>
                  
                  <div className="bg-white rounded-lg p-4 text-left">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="font-medium text-gray-700">Business Hours</span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Mon-Fri: 8:00 AM - 6:00 PM</div>
                      <div>Saturday: 9:00 AM - 4:00 PM</div>
                      <div>Sunday: Closed</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleMapsStore;
