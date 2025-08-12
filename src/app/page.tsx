import { unstable_ViewTransition as ViewTransition } from "react";
import { UserAppsServerWrapper } from "@/components/user-apps-server-wrapper";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import HomePageClientContent from "@/components/home-page-client-content";

const queryClient = new QueryClient();

export default function Home() {
  return (
    <ViewTransition>
      <QueryClientProvider client={queryClient}>
        <HomePageClientContent />
        <div className="border-t py-8 -mx-4">
          <UserAppsServerWrapper />
        </div>
      </QueryClientProvider>
    </ViewTransition>
  );
}