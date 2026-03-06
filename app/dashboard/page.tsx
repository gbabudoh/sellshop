"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Wait for session to load
    if (status === "loading") {
      return;
    }

    // If no session, redirect to signin
    if (!session || !session.user) {
      router.push("/signin");
      return;
    }

    // Get user role from session
    const userRole = session.user?.role;
    
    console.log("=== Dashboard Routing Debug ===");
    console.log("Session:", session);
    console.log("User:", session.user);
    console.log("User Role:", userRole);
    
    // Unified redirection for all users
    console.log("✓ Routing to unified dashboard");
    router.replace("/dashboard/sell");
    
    // Use a small delay or just don't set state if we are redirecting
    // setIsRedirecting(false); 
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return null;
}
