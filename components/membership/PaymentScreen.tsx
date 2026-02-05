"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CreditCard,
  Smartphone,
  Building2,
  Lock,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

interface MembershipData {
  membershipType: string;
  membershipPlan: string;
  membershipPrice: number;
}

interface PaymentScreenProps {
  membershipData: MembershipData;
}

export default function PaymentScreen({ membershipData }: PaymentScreenProps) {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [cardData, setCardData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });
  const [upiId, setUpiId] = useState("");
  const [bankSelected, setBankSelected] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const validateCardData = () => {
    const newErrors: Record<string, string> = {};

    if (!cardData.cardNumber) {
      newErrors.cardNumber = "Card number is required";
    } else if (!/^\d{16}$/.test(cardData.cardNumber.replace(/\s/g, ""))) {
      newErrors.cardNumber = "Please enter a valid 16-digit card number";
    }

    if (!cardData.expiryDate) {
      newErrors.expiryDate = "Expiry date is required";
    } else if (!/^\d{2}\/\d{2}$/.test(cardData.expiryDate)) {
      newErrors.expiryDate = "Please enter in MM/YY format";
    }

    if (!cardData.cvv) {
      newErrors.cvv = "CVV is required";
    } else if (!/^\d{3,4}$/.test(cardData.cvv)) {
      newErrors.cvv = "Please enter a valid CVV";
    }

    if (!cardData.cardholderName) {
      newErrors.cardholderName = "Cardholder name is required";
    }

    return newErrors;
  };

  const validateUPI = () => {
    const newErrors: Record<string, string> = {};

    if (!upiId) {
      newErrors.upiId = "UPI ID is required";
    } else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/.test(upiId)) {
      newErrors.upiId = "Please enter a valid UPI ID";
    }

    return newErrors;
  };

  const validateForm = () => {
    let newErrors: Record<string, string> = {};

    if (!paymentMethod) {
      newErrors.paymentMethod = "Please select a payment method";
    } else if (paymentMethod === "card") {
      newErrors = { ...newErrors, ...validateCardData() };
    } else if (paymentMethod === "upi") {
      newErrors = { ...newErrors, ...validateUPI() };
    } else if (paymentMethod === "bank") {
      if (!bankSelected) {
        newErrors.bankSelected = "Please select a bank";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCardNumberChange = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 16);
    const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
    setCardData((prev) => ({
      ...prev,
      cardNumber: formatted,
    }));
  };

  const handleExpiryChange = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 4);
    const formatted =
      cleaned.length >= 2
        ? `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`
        : cleaned;
    setCardData((prev) => ({
      ...prev,
      expiryDate: formatted,
    }));
  };

  const handleCVVChange = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 4);
    setCardData((prev) => ({
      ...prev,
      cvv: cleaned,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    const loadingToast = toast.loading("Processing your payment...");

    setTimeout(() => {
      setIsProcessing(false);
      toast.dismiss(loadingToast);

      // Simulate random success/failure for demo
      const isSuccess = Math.random() > 0.2; // 80% success rate

      if (isSuccess) {
        const transactionId = `TXN${Date.now()}`;

        // Store transaction data
        if (typeof window !== "undefined") {
          const existingData = localStorage.getItem("selectedMembership");
          if (existingData) {
            const parsedData = JSON.parse(existingData);
            localStorage.setItem(
              "membershipComplete",
              JSON.stringify({
                ...parsedData,
                transactionId,
                paymentMethod,
                paymentDate: new Date().toISOString(),
              })
            );
          }
        }

        toast.success("Payment Successful!", {
          description: `Transaction ID: ${transactionId}`,
        });

        // Navigate to card generation page
        setTimeout(() => {
          router.push("/generate-card");
        }, 1500);
      } else {
        toast.error("Payment Failed", {
          description: "Please check your payment details and try again",
        });
      }
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Step 4: Complete Payment
          </h1>
          <p className="text-gray-600">
            Your membership is almost ready. Complete the payment to activate
            your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Order Summary */}
          <Card className="bg-blue-50 border-blue-100">
            <CardHeader>
              <CardTitle className="text-blue-900">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Plan:</span>
                <span className="font-semibold text-gray-900">
                  {membershipData.membershipPlan}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Amount:</span>
                <span className="font-semibold text-gray-900">
                  ₹{membershipData.membershipPrice.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="border-t border-blue-200 pt-3 flex justify-between items-center">
                <span className="font-semibold text-gray-900">
                  Total Amount:
                </span>
                <span className="text-2xl font-bold text-blue-900">
                  ₹{membershipData.membershipPrice.toLocaleString("en-IN")}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-900">
                Select Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod("card");
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.paymentMethod;
                      return newErrors;
                    });
                  }}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    paymentMethod === "card"
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <CreditCard
                    className={`mx-auto mb-2 ${
                      paymentMethod === "card"
                        ? "text-blue-600"
                        : "text-gray-400"
                    }`}
                    size={24}
                  />
                  <div className="text-sm font-medium text-gray-900">
                    Debit/Credit Card
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod("upi");
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.paymentMethod;
                      return newErrors;
                    });
                  }}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    paymentMethod === "upi"
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Smartphone
                    className={`mx-auto mb-2 ${
                      paymentMethod === "upi"
                        ? "text-blue-600"
                        : "text-gray-400"
                    }`}
                    size={24}
                  />
                  <div className="text-sm font-medium text-gray-900">UPI</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod("bank");
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.paymentMethod;
                      return newErrors;
                    });
                  }}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    paymentMethod === "bank"
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Building2
                    className={`mx-auto mb-2 ${
                      paymentMethod === "bank"
                        ? "text-blue-600"
                        : "text-gray-400"
                    }`}
                    size={24}
                  />
                  <div className="text-sm font-medium text-gray-900">
                    Net Banking
                  </div>
                </button>
              </div>

              {errors.paymentMethod && (
                <div className="flex items-center gap-2 text-red-600 text-sm mt-3">
                  <AlertCircle className="size-4" />
                  {errors.paymentMethod}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card Payment Details */}
          {paymentMethod === "card" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-900">Card Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cardholder Name *
                  </label>
                  <Input
                    placeholder="John Doe"
                    value={cardData.cardholderName}
                    onChange={(e) =>
                      setCardData((prev) => ({
                        ...prev,
                        cardholderName: e.target.value,
                      }))
                    }
                    className={
                      errors.cardholderName
                        ? "border-red-500"
                        : "border-gray-300"
                    }
                  />
                  {errors.cardholderName && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="size-3" />
                      {errors.cardholderName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number *
                  </label>
                  <Input
                    placeholder="1234 5678 9012 3456"
                    value={cardData.cardNumber}
                    onChange={(e) => handleCardNumberChange(e.target.value)}
                    maxLength={19}
                    className={
                      errors.cardNumber ? "border-red-500" : "border-gray-300"
                    }
                  />
                  {errors.cardNumber && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="size-3" />
                      {errors.cardNumber}
                    </p>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date *
                    </label>
                    <Input
                      placeholder="MM/YY"
                      value={cardData.expiryDate}
                      onChange={(e) => handleExpiryChange(e.target.value)}
                      maxLength={5}
                      className={
                        errors.expiryDate
                          ? "border-red-500"
                          : "border-gray-300"
                      }
                    />
                    {errors.expiryDate && (
                      <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="size-3" />
                        {errors.expiryDate}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV *
                    </label>
                    <Input
                      type="password"
                      placeholder="123"
                      value={cardData.cvv}
                      onChange={(e) => handleCVVChange(e.target.value)}
                      maxLength={4}
                      className={
                        errors.cvv ? "border-red-500" : "border-gray-300"
                      }
                    />
                    {errors.cvv && (
                      <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="size-3" />
                        {errors.cvv}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* UPI Payment Details */}
          {paymentMethod === "upi" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-900">UPI Payment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    UPI ID *
                  </label>
                  <Input
                    placeholder="yourname@upi"
                    value={upiId}
                    onChange={(e) => {
                      setUpiId(e.target.value);
                      if (errors.upiId) {
                        setErrors((prev) => ({ ...prev, upiId: "" }));
                      }
                    }}
                    className={
                      errors.upiId ? "border-red-500" : "border-gray-300"
                    }
                  />
                  {errors.upiId && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="size-3" />
                      {errors.upiId}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Net Banking Details */}
          {paymentMethod === "bank" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-900">Net Banking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Your Bank *
                  </label>
                  <Select value={bankSelected} onValueChange={setBankSelected}>
                    <SelectTrigger
                      className={
                        errors.bankSelected
                          ? "border-red-500"
                          : "border-gray-300"
                      }
                    >
                      <SelectValue placeholder="Choose your bank" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="icici">ICICI Bank</SelectItem>
                      <SelectItem value="hdfc">HDFC Bank</SelectItem>
                      <SelectItem value="sbi">State Bank of India</SelectItem>
                      <SelectItem value="axis">Axis Bank</SelectItem>
                      <SelectItem value="kotak">Kotak Mahindra Bank</SelectItem>
                      <SelectItem value="pnb">Punjab National Bank</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.bankSelected && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="size-3" />
                      {errors.bankSelected}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security Badge */}
          <Card className="bg-blue-50 border-blue-100">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Lock className="text-blue-900 mt-1" size={20} />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-1">
                    Secure Payment
                  </h3>
                  <p className="text-sm text-gray-700">
                    Your payment information is encrypted and secured with
                    industry-standard SSL technology.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isProcessing || !paymentMethod}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 disabled:opacity-50"
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  Processing...
                </span>
              ) : (
                `Pay ₹${membershipData.membershipPrice.toLocaleString("en-IN")}`
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}