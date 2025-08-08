import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AppCard } from "./app-card";

export function UserApps() {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["userApps"],
    queryFn: async () => {
      const response = await fetch("/api/user-apps");
      if (!response.ok) {
        throw new Error("Failed to fetch user apps");
      }
      const apps = await response.json();
      // Convert createdAt string to Date object
      return apps.map((app: any) => ({
        ...app,
        createdAt: new Date(app.createdAt),
      }));
    },
    initialData: [],
  });

  const onAppDeleted = () => {
    queryClient.invalidateQueries({ queryKey: ["userApps"] });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4 sm:px-8">
      {data.map((app) => (
        <AppCard 
          key={app.id}
          id={app.id}
          name={app.name}
          createdAt={app.createdAt}
          onDelete={onAppDeleted}
        />
      ))}
    </div>
  );
}
