import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

type CylinderType = "4" | "6" | "8" | "12";

const cylinderMeta: Record<CylinderType, { title: string; blurb: string; hero: string; }> = {
  "4": {
    title: "4 Cylinder Engines",
    blurb: "Efficient and reliable options ideal for daily driving and economy builds.",
    hero: "/placeholder.svg",
  },
  "6": {
    title: "6 Cylinder Engines",
    blurb: "Smooth power delivery with a great balance of performance and refinement.",
    hero: "/placeholder.svg",
  },
  "8": {
    title: "V8 Engines",
    blurb: "Classic performance and torque for muscle and utility applications.",
    hero: "/placeholder.svg",
  },
  "12": {
    title: "V12 Engines",
    blurb: "Exotic performance for high-end builds and unique swaps.",
    hero: "/placeholder.svg",
  },
};

export default function CylinderEngines() {
  const { cyl } = useParams();
  const [searchQuery, setSearchQuery] = useState("");

  const key = (cyl as CylinderType) ?? "4";
  const meta = cylinderMeta[key] ?? cylinderMeta["4"];

  // Placeholder curated items - can be enriched with marketplace data later
  const items = useMemo(() => {
    const common = [
      {
        id: `${key}-toyota` ,
        title: `${meta.title} - Toyota`,
        brand: "Toyota",
        img: "/placeholder.svg",
        price: 2499,
      },
      {
        id: `${key}-honda` ,
        title: `${meta.title} - Honda`,
        brand: "Honda",
        img: "/placeholder.svg",
        price: 2299,
      },
      {
        id: `${key}-ford` ,
        title: `${meta.title} - Ford`,
        brand: "Ford",
        img: "/placeholder.svg",
        price: 2799,
      },
      {
        id: `${key}-bmw` ,
        title: `${meta.title} - BMW`,
        brand: "BMW",
        img: "/placeholder.svg",
        price: 3199,
      },
    ];
    return common;
  }, [key, meta.title]);

  const filtered = items.filter(i =>
    i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-3 font-['Orbitron'] text-gradient">{meta.title}</h1>
            <p className="text-muted-foreground text-lg">{meta.blurb}</p>
          </div>

          <div className="rounded-xl overflow-hidden mb-8">
            <img src={meta.hero} alt={meta.title} className="w-full h-56 md:h-72 object-cover" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(item => (
              <Card key={item.id} className="glass-card border-white/10">
                <CardContent className="p-4">
                  <div className="aspect-[16/10] rounded-lg overflow-hidden mb-3">
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <Badge variant="secondary">{item.brand}</Badge>
                    <span className="text-primary font-semibold">${item.price.toLocaleString()}</span>
                  </div>
                  <h3 className="font-semibold line-clamp-2">{item.title}</h3>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex gap-2">
                  <Button asChild variant="default">
                    <Link to="/products">View Options</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <a href={`https://www.google.com/search?q=${encodeURIComponent(item.title)}`} target="_blank" rel="noreferrer">
                      Research
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="text-center mt-10 text-sm text-muted-foreground">
            Looking for more? Check our general <Link to="/products" className="text-primary underline">catalog</Link>.
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}



