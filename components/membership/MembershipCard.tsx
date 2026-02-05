/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Printer, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface MembershipCompleteData {
  membershipType: string;
  membershipPlan: string;
  membershipPrice: number;
  transactionId: string;
  paymentMethod: string;
  paymentDate: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

export default function MembershipCard() {
  const router = useRouter();
  const [membershipData, setMembershipData] =
    useState<MembershipCompleteData | null>(null);
  const [membershipId, setMembershipId] = useState<string>("");
  const [showFullId, setShowFullId] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem("membershipComplete");
    if (storedData) {
      const data = JSON.parse(storedData);
      setMembershipData(data);

      // Generate unique membership ID
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 8).toUpperCase();
      const generatedId = `ABBM${timestamp}${random}`;
      setMembershipId(generatedId);
    } else {
      router.push("/");
    }
  }, [router]);

  const handleDownload = () => {
    if (!membershipData) return;

    const content = `
Akhila Bharatiya Brahmana Mahasangh
MEMBERSHIP CARD
=====================================

Member ID: ${membershipId}
Name: ${membershipData.firstName || "Member"} ${membershipData.lastName || ""}
Email: ${membershipData.email || "N/A"}
Phone: ${membershipData.phone || "N/A"}
Plan: ${membershipData.membershipPlan}
Amount: ₹${membershipData.membershipPrice.toLocaleString("en-IN")}
Transaction ID: ${membershipData.transactionId}

Date of Membership: ${new Date(membershipData.paymentDate).toLocaleDateString("en-IN")}

Status: Active

=====================================
Valid membership card for community access
© ${new Date().getFullYear()} Akhila Bharatiya Brahmana Mahasangh
    `;

    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(content)
    );
    element.setAttribute("download", `membership_${membershipId}.txt`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast.success("Card downloaded successfully!");
  };

  const handlePrint = () => {
    window.print();
    toast.success("Print dialog opened");
  };
 if (!membershipData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="text-gray-600">Loading membership details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Success Icon and Title */}
        <div className="text-center mb-8">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-orange-500 p-4 text-white">
              <CheckCircle2 className="h-12 w-12" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Registration Complete!
          </h1>
          <p className="text-lg text-gray-600">
            Your membership has been activated successfully
          </p>
        </div>

        {/* Membership Card */}
        <Card className="border-2 border-blue-600 shadow-xl mb-6">
          <CardHeader className="bg-blue-800 text-white">
            <CardTitle className="text-center text-2xl">
              Akhila Bharatiya Brahmana Mahasangh
            </CardTitle>
            <p className="mt-2 text-center text-sm font-semibold">
              MEMBER CARD
            </p>
          </CardHeader>

          <CardContent className="space-y-6 py-8">
            {/* Member Info */}
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">
                  Member Name
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {membershipData.firstName || "Member"}{" "}
                  {membershipData.lastName || ""}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">
                    Email
                  </p>
                  <p className="text-sm text-gray-900 break-all">
                    {membershipData.email || "abc@123.com"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">
                    Phone
                  </p>
                  <p className="text-sm text-gray-900">
                    {membershipData.phone || "1233456677888"}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">
                    Membership Plan
                  </p>
                  <p className="text-sm font-semibold text-blue-800">
                    {membershipData.membershipPlan}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">
                    Amount
                  </p>
                  <p className="text-sm font-semibold text-blue-800">
                    ₹{membershipData.membershipPrice.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </div>

            {/* Membership ID Section */}
            <div className="border-t-2 border-b-2 border-gray-200 py-6">
              <div className="text-center">
                <p className="mb-2 text-xs font-semibold text-gray-500 uppercase">
                  Membership ID
                </p>
                <div className="mb-4">
                  {showFullId ? (
                    <p className="font-mono text-2xl font-bold text-blue-800 tracking-wider break-all">
                      {membershipId}
                    </p>
                  ) : (
                    <p className="font-mono text-2xl font-bold text-blue-800 tracking-widest">
                      {membershipId.slice(0, 8)}...
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setShowFullId(!showFullId)}
                  className="text-xs text-blue-700 hover:underline font-medium"
                >
                  {showFullId ? "Hide" : "Show"} Full ID
                </button>
              </div>
            </div>

            {/* Additional Details */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Date of Membership:</span>
                <span className="font-semibold text-gray-900">
                  {new Date(membershipData.paymentDate).toLocaleDateString(
                    "en-IN",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction ID:</span>
                <span className="font-semibold text-gray-900">
                  {membershipData.transactionId}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status:</span>
                <span className="inline-block rounded-full bg-orange-100 px-3 py-1 text-orange-600 font-semibold text-xs">
                  Active
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 pt-4 text-center text-xs text-gray-500">
              <p>This card is valid for community access and benefits</p>
              <p>
                © {new Date().getFullYear()} Akhila Bharatiya Brahmana
                Mahasangh
              </p>
            </div>

            {/* Action Buttons Inside Card */}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center pt-4">
              <Button
                type="button"
                onClick={handleDownload}
                variant="outline"
                className="border-2 border-blue-700 text-blue-700 hover:bg-blue-50 bg-white"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Card
              </Button>
              <Button
                type="button"
                onClick={handlePrint}
                variant="outline"
                className="border-2 border-blue-700 text-blue-700 hover:bg-blue-50 bg-white"
              >
                <Printer className="mr-2 h-4 w-4" />
                Print Card
              </Button>
          
            </div>
          </CardContent>
        </Card>

        {/* Support Information */}
        <Card className="border border-gray-200">
          <CardContent className="pt-6">
            <h3 className="mb-2 font-semibold text-gray-900">Need Help?</h3>
            <p className="text-sm text-gray-600 mb-3">
              If you have any questions about your membership or encounter any
              issues, please contact us:
            </p>
            <div className="space-y-1 text-sm">
              <p className="text-gray-900">
                Email:{" "}
                <a
                  href="mailto:support@abbm.org"
                  className="text-blue-700 hover:underline font-medium"
                >
                  support@abbm.org
                </a>
              </p>
              <p className="text-gray-900">
                Phone:{" "}
                <a
                  href="tel:+91-1234-567890"
                  className="text-blue-700 hover:underline font-medium"
                >
                  +91-1234-567890
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}