/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useEffect, useState } from 'react';
import PaymentScreen from '@/components/membership/PaymentScreen';
import { useRouter } from 'next/navigation';

export default function PaymentPage() {
  const router = useRouter();
  const [membershipData, setMembershipData] = useState<{
    membershipType: string;
    membershipPlan: string;
    membershipPrice: number;
  } | null>(null);

  useEffect(() => {
    const storedData = localStorage.getItem('selectedMembership');
    if (storedData) {
      setMembershipData(JSON.parse(storedData));
    } else {
      // Redirect back if no data
      router.push('/');
    }
  }, [router]);

  if (!membershipData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">Loading payment details...</p>
        </div>
      </div>
    );
  }

  return <PaymentScreen membershipData={membershipData} />;
}