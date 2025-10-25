/**
 * Admin Media Page - Local File System Version
 * Simplified for local image management
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileImage, FolderOpen, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminMedia() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Media Library</h1>
          <p className="text-muted-foreground mt-2">
            Manage your product images and media files
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5" />
              Product Images
            </CardTitle>
            <CardDescription>
              Location: <code className="text-xs">/public/images/products/</code>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Upload product images directly to the folder above. Supported formats: JPG, PNG, WEBP
            </p>
            <Button variant="outline" className="w-full" onClick={() => {
              // Open file explorer
              window.open('file:///F:/xampp/htdocs/enginecore/public/images/products', '_blank');
            }}>
              <FolderOpen className="h-4 w-4 mr-2" />
              Open Folder
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileImage className="h-5 w-5" />
              Image Management
            </CardTitle>
            <CardDescription>
              Assign images to products
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Go to Products page to assign images to each product.
            </p>
            <Button variant="outline" className="w-full" onClick={() => {
              window.location.href = '/admin/products';
            }}>
              <FileImage className="h-4 w-4 mr-2" />
              Manage Products
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Guide
            </CardTitle>
            <CardDescription>
              How to add images
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
              <li>Copy images to <code>/public/images/products/</code></li>
              <li>Go to Products and edit a product</li>
              <li>Set image path: <code>/images/products/filename.jpg</code></li>
              <li>Save changes</li>
            </ol>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Setup</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Local File Storage</h3>
              <p className="text-sm text-muted-foreground">
                Your project now uses local file storage instead of Supabase Storage.
                All images are stored in the <code>/public/images/</code> directory.
              </p>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-2 text-sm">Directory Structure:</h4>
              <pre className="text-xs">
{`/public
  /images
    /products      ← Product images (32 files)
    /banners       ← Banner images
    /icons         ← Icon files`}
              </pre>
            </div>

            <div>
              <h4 className="font-semibold mb-2 text-sm">Benefits:</h4>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>No bandwidth limits</li>
                <li>No quota restrictions</li>
                <li>Faster loading times</li>
                <li>Full control over files</li>
                <li>No external dependencies</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
