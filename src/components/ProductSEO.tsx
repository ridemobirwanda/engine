import { SimpleSEOHead } from './SimpleSEOHead';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  brand: string;
  model: string;
  engine_type: string;
  condition: string;
  images: string[];
}

interface ProductSEOProps {
  product: Product;
  category?: string;
}

export const ProductSEO = ({ product, category = "Automotive Engine" }: ProductSEOProps) => {
  const baseUrl = "https://enginemarkets.com";
  const productUrl = `${baseUrl}/products/${product.id}`;
  const productImage = product.images?.[0] || "/engine-logo.png";
  const fullImageUrl = productImage.startsWith('http') ? productImage : `${baseUrl}${productImage}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.images?.map(img => 
      img.startsWith('http') ? img : `${baseUrl}${img}`
    ) || [fullImageUrl],
    "brand": {
      "@type": "Brand",
      "name": product.brand
    },
    "model": product.model,
    "category": category,
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "EngineCore"
      }
    },
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "Engine Type",
        "value": product.engine_type
      },
      {
        "@type": "PropertyValue",
        "name": "Condition",
        "value": product.condition
      }
    ]
  };

  const seoProps = {
    title: `${product.name} - ${product.brand} ${product.model} Engine`,
    description: `${product.description.substring(0, 150)}... Buy ${product.brand} ${product.model} ${product.engine_type} engine for $${product.price}. Quality ${product.condition} engine with warranty.`,
    keywords: `${product.name}, ${product.brand} engine, ${product.model} engine, ${product.engine_type}, ${product.condition} engine, automotive engine, engine for sale, ${product.brand} ${product.model}`,
    image: fullImageUrl,
    url: productUrl,
    type: "product" as const,
    structuredData
  };

  return <SimpleSEOHead {...seoProps} />;
};
