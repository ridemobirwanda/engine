import { MapPin, Phone, Clock, Globe, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface GoogleMapsStoreFallbackProps {
  showBusinessInfo?: boolean;
  height?: string;
}

export const GoogleMapsStoreFallback = ({ 
  showBusinessInfo = true, 
  height = '400px'
}: GoogleMapsStoreFallbackProps) => {
  // Business information
  const businessInfo = {
    name: 'EngineCore',
    address: 'Auto City, Cyprus',
    phone: '+357 96115404',
    email: 'verifiedengines@gmail.com',
    website: 'https://enginemarkets.com',
    hours: 'Mon-Fri: 8AM-6PM, Sat: 9AM-4PM, Sun: Closed',
    // Approximate coordinates for Cyprus
    lat: 35.1264,
    lng: 33.4299
  };

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(businessInfo.name + ' ' + businessInfo.address)}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${businessInfo.lat},${businessInfo.lng}`;

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
          {/* Beautiful fallback map */}
          <div 
            className="flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-lg relative overflow-hidden"
            style={{ height }}
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234F46E5' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '60px 60px'
              }} />
            </div>

            <div className="text-center p-8 max-w-lg relative z-10">
              {/* Icon */}
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center shadow-lg">
                <MapPin className="h-12 w-12 text-white" />
              </div>
              
              {/* Business Info */}
              <h3 className="text-3xl font-bold text-gray-800 mb-2">
                {businessInfo.name}
              </h3>
              <p className="text-gray-600 mb-2 text-lg font-medium">{businessInfo.address}</p>
              <p className="text-gray-500 mb-8 text-sm">
                Premium automotive engines and parts supplier
              </p>
              
              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-6 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 justify-center"
                  >
                    <MapPin className="h-5 w-5" />
                    View on Google Maps
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    asChild
                    variant="outline"
                    className="border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300"
                  >
                    <a
                      href={`tel:${businessInfo.phone}`}
                      className="inline-flex items-center gap-2 justify-center"
                    >
                      <Phone className="h-4 w-4" />
                      Call Now
                    </a>
                  </Button>
                  
                  <Button
                    asChild
                    variant="outline"
                    className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300"
                  >
                    <a
                      href={directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 justify-center"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Directions
                    </a>
                  </Button>
                </div>
              </div>
              
              {/* Business Hours Card */}
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 mt-6 border border-white/20 shadow-sm">
                <div className="flex items-center gap-2 mb-3 justify-center">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="font-medium text-gray-700">Business Hours</span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Mon-Fri:</span>
                    <span className="font-medium">8:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday:</span>
                    <span className="font-medium">9:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday:</span>
                    <span className="font-medium text-red-600">Closed</span>
                  </div>
                </div>
              </div>

              {/* API Setup Note */}
              <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-700">
                  💡 <strong>For developers:</strong> Interactive map will appear when Google Maps API is configured
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleMapsStoreFallback;
