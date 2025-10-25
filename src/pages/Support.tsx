import TechnicalSupport from "./TechnicalSupport";
import FAQs from "./FAQs";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Support() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Support</h1>
        <p className="text-muted-foreground mt-2">Technical Support and Frequently Asked Questions</p>
      </div>

      <div className="space-y-12">
        <section>
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Technical Support</CardTitle>
              <CardDescription>Guides, contact options, and troubleshooting help.</CardDescription>
            </CardHeader>
          </Card>
          <div className="rounded-lg overflow-hidden">
            <TechnicalSupport />
          </div>
        </section>

        <section>
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>FAQs</CardTitle>
              <CardDescription>Quick answers to common questions.</CardDescription>
            </CardHeader>
          </Card>
          <div className="rounded-lg overflow-hidden">
            <FAQs />
          </div>
        </section>
      </div>
    </div>
  );
}


