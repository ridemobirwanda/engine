import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DynamicProductPage } from "@/components/DynamicProductPage";

export default function Engines() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Engines</h1>
        <p className="text-muted-foreground mt-2">Shop Rebuilt and Used engines below.</p>
      </div>

      <div className="space-y-12">
        <section>
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Rebuilt Engines</CardTitle>
              <CardDescription>Professionally rebuilt engines, ready to install.</CardDescription>
            </CardHeader>
          </Card>
          <DynamicProductPage
            categorySlug="rebuilt-engines"
            title="Rebuilt Engines"
            description="High-quality rebuilt engines"
            compact
          />
        </section>

        <section>
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Used Engines</CardTitle>
              <CardDescription>Pre-owned engines inspected for performance.</CardDescription>
            </CardHeader>
          </Card>
          <DynamicProductPage
            categorySlug="used-engines"
            title="Used Engines"
            description="Budget-friendly used engines"
            compact
          />
        </section>
      </div>
    </div>
  );
}


