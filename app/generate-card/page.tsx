/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MembershipCard from "@/components/membership/MembershipCard";

export default function GenerateCardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    // Check if membership data exists in localStorage
    const storedData = localStorage.getItem("membershipComplete");
    
    if (storedData) {
      // Set state together to avoid cascading renders
      setHasData(true);
      setIsLoading(false);
    } else {
      // Redirect if no data found
      router.push("/");
    }
  }, [router]);

  // Show loading state during hydration and data check
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  // Only render MembershipCard if data exists
  if (!hasData) {
    return null; // Will redirect via useEffect
  }

  return <MembershipCard />;
}