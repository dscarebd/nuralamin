import ProfileSidebar from "@/components/ProfileSidebar";
import MainContent from "@/components/MainContent";

const Index = () => {
  return (
    <div className="bg-background px-4 py-4 md:px-8 lg:h-full lg:overflow-hidden">
      <div className="mx-auto grid max-w-5xl gap-8 lg:h-full lg:grid-cols-[320px_1fr]">
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
