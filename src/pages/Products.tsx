import { DynamicProductPage } from "@/components/DynamicProductPage";

export default function Products() {
  return (
    <div className="min-h-screen bg-background">
      <DynamicProductPage
        categorySlug="all-products"
        title="All Products"
        description="Complete selection of all automotive engines, parts, and accessories"
      />
    </div>
  );
}
