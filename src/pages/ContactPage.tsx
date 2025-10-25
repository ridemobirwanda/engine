// Header and Footer removed - now handled globally in App.tsx
import { ContactPage as ContactContent } from "@/components/ContactPage";
import { ImageCardsSection } from "@/components/ImageCardsSection";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header and Footer removed - now handled globally in App.tsx */}
      <main>
        <ContactContent />
        <ImageCardsSection />
      </main>
    </div>
  );
};

export default ContactPage;