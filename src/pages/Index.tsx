import ProfileSidebar from "@/components/ProfileSidebar";
import MainContent from "@/components/MainContent";
import SEOHead from "@/components/SEOHead";

const Index = () => {
  return (
    <div className="bg-background px-4 py-4 md:px-8 lg:h-full lg:flex-1 lg:min-h-0 lg:overflow-hidden">
      <SEOHead
        title="NUR AL AMIN - Full-Stack Web & App Developer"
        description="NUR AL AMIN is a Full-Stack Web & App Developer specializing in custom websites, mobile apps, and digital solutions. Hire a professional developer for your next project."
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: "NUR AL AMIN",
          jobTitle: "Full-Stack Web & App Developer",
          url: "https://nuralamin.lovable.app",
        }}
      />
      <div className="mx-auto grid max-w-5xl gap-8 lg:h-full lg:min-h-0 lg:grid-cols-[320px_1fr]">
        <div className="lg:h-full lg:overflow-hidden">
          <ProfileSidebar />
        </div>
        <div className="lg:h-full lg:overflow-hidden">
          <MainContent />
        </div>
      </div>
    </div>
  );
};

export default Index;
