import ProfileSidebar from "@/components/ProfileSidebar";
import MainContent from "@/components/MainContent";

const Index = () => {
  return (
    <div className="min-h-screen bg-background px-4 py-8 md:px-8">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[320px_1fr]">
        <ProfileSidebar />
        <MainContent />
      </div>
    </div>
  );
};

export default Index;
