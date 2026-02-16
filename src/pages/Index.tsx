import ProfileSidebar from "@/components/ProfileSidebar";
import MainContent from "@/components/MainContent";

const Index = () => {
  return (
    <div className="h-full bg-background px-4 py-4 md:px-8 overflow-hidden">
      <div className="mx-auto grid h-full max-w-5xl gap-8 lg:grid-cols-[320px_1fr]">
        <div className="h-full overflow-hidden">
          <ProfileSidebar />
        </div>
        <div className="h-full overflow-hidden">
          <MainContent />
        </div>
      </div>
    </div>
  );
};

export default Index;
