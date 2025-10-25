// Header and Footer removed - now handled globally in App.tsx
import { Checkout } from "@/components/Checkout";

const CheckoutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header and Footer removed - now handled globally in App.tsx */}
      <main>
        <Checkout />
      </main>
    </div>
  );
};

export default CheckoutPage;