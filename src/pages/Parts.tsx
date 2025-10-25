import { DynamicProductPage } from "@/components/DynamicProductPage";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Parts() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Parts</h1>
        <p className="text-muted-foreground mt-2">Browse Cylinder Heads and Timing Components.</p>
      </div>

      <div className="space-y-12">
        <section>
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Cylinder Heads</CardTitle>
              <CardDescription>Heads and top-end components.</CardDescription>
            </CardHeader>
          </Card>
          <DynamicProductPage
            categorySlug="heads"
            title="Cylinder Heads"
            description="Heads and components"
            compact
          />
        </section>

        <section>
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Timing Components</CardTitle>
              <CardDescription>Chains, belts, guides, tensioners.</CardDescription>
            </CardHeader>
          </Card>
          <DynamicProductPage
            categorySlug="timing-components"
            title="Timing Components"
            description="Timing kits and parts"
            compact
          />
        </section>
      </div>
    </div>
  );
}