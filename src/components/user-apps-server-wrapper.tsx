import { getUserApps } from "@/actions/user-apps";
import { UserApps } from "./user-apps";

export async function UserAppsServerWrapper() {
  const initialData = await getUserApps();

  return <UserApps initialData={initialData} />;
}