import { NextResponse } from "next/server";
import { getUserApps } from "@/actions/user-apps";

export async function GET() {
  try {
    const userApps = await getUserApps();
    return NextResponse.json(userApps);
  } catch (error) {
    console.error("Error fetching user apps:", error);
    return NextResponse.json({ error: "Failed to fetch user apps" }, { status: 500 });
  }
}