import ProfileSidebar from "@/components/ProfileSidebar";
import MainContent from "@/components/MainContent";

const Index = () => {
  return (
    <div className="min-h-screen bg-background px-4 py-6 md:px-8 lg:h-screen lg:overflow-hidden">
      <div className="mx-auto grid h-full max-w-5xl gap-6 lg:grid-cols-[320px_1fr]">
        <div className="lg:sticky lg:top-8 lg:self-start">
          <ProfileSidebar />
        </div>
        <div className="lg:overflow-hidden">
          <MainContent />
        </div>
      </div>
    </div>
  );
};

export default Index;
