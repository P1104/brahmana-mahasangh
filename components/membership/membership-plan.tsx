'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  Header,
  Description,
  Plan,
  PlanName,
  Badge,
  Price,
  MainPrice,
  Period,
  Body,
  List,
  ListItem,
  Separator,
} from '@/components/pricing-card';
import { Check, Sparkles, Crown, Zap } from 'lucide-react';

interface MembershipPlan {
  id: string;
  type: 'standard' | 'premium' | 'lifetime';
  name: string;
  price: number;
  billingPeriod: string;
  description: string;
  benefits: string[];
  premiumBenefits?: string[];
  highlighted?: boolean;
  icon?: React.ReactNode;
  badge?: string;
}

const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: 'standard',
    type: 'standard',
    name: 'Standard',
    price: 10,
    billingPeriod: '/year',
    description: 'Perfect for individuals starting their community journey',
    benefits: [
      'Access to community events',
      'Member newsletter',
      'Online community directory',
      'Discounts on community events',
      'Certificate of membership',
    ],
    highlighted: false,
    icon: <Zap className="size-4" />,
  },
  {
    id: 'premium',
    type: 'premium',
    name: 'Premium',
    price: 360,
    billingPeriod: '/year',
    description: 'Enhanced engagement for serious networkers',
    benefits: [
      'Access to community events',
      'Member newsletter',
      'Online community directory',
      'Discounts on community events',
      'Certificate of membership',
    ],
    premiumBenefits: [
      'Priority event access',
      'One-on-one networking sessions',
      'Business directory listing',
      'Exclusive conferences',
      'Priority customer support',
    ],
    highlighted: true,
    icon: <Sparkles className="size-4" />,
    badge: 'Most Popular',
  },
  {
    id: 'lifetime',
    type: 'lifetime',
    name: 'Lifetime',
    price: 2500,
    billingPeriod: 'one-time',
    description: 'Ultimate membership with permanent privileges',
    benefits: [
      'Access to community events',
      'Member newsletter',
      'Online community directory',
      'Discounts on community events',
      'Certificate of membership',
      'Priority event access',
      'One-on-one networking sessions',
      'Business directory listing',
      'Exclusive conferences',
      'Priority customer support',
    ],
    premiumBenefits: [
      'Lifetime membership guarantee',
      'Lifetime discounts on all events',
      'Honorary member badge',
      'Exclusive lifetime member events',
      'Legacy member privileges',
    ],
    highlighted: false,
    icon: <Crown className="size-4" />,
    badge: 'Best Value',
  },
];

export function MembershipSelection() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string | null>('premium');

  const handleSelect = (plan: MembershipPlan) => {
    setSelectedPlan(plan.id);
    console.log('Selected plan:', plan.type, plan.name, plan.price);
  };

  const handleContinue = () => {
    const plan = MEMBERSHIP_PLANS.find((p) => p.id === selectedPlan);
    if (plan) {
      // Store the selected plan data in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'selectedMembership',
          JSON.stringify({
            membershipType: plan.type,
            membershipPlan: plan.name,
            membershipPrice: plan.price,
          })
        );
      }

      // Navigate to payment page
      router.push('/payment');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Choose Your Membership
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Select the plan that best suits your needs. Upgrade anytime to unlock more
            benefits.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 items-start max-w-6xl mx-auto">
          {MEMBERSHIP_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative transition-all duration-300 ${
                selectedPlan === plan.id ? 'scale-105' : 'hover:scale-102'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <span className="bg-gradient-to-r from-primary to-primary/80 px-4 py-1.5 text-xs font-semibold text-primary-foreground rounded-full shadow-lg">
                    {plan.badge}
                  </span>
                </div>
              )}

              <Card
                className={`cursor-pointer transition-all duration-300 ${
                  plan.highlighted
                    ? 'ring-2 ring-primary shadow-2xl shadow-primary/20'
                    : selectedPlan === plan.id
                    ? 'ring-2 ring-primary/50'
                    : 'hover:ring-2 hover:ring-primary/30'
                }`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                <Header glassEffect={true}>
                  <Plan>
                    <PlanName>
                      {plan.icon}
                      {plan.name}
                    </PlanName>
                    {!plan.highlighted && plan.badge && <Badge>{plan.badge}</Badge>}
                  </Plan>

                  <Description className="mb-4">{plan.description}</Description>

                  <Price>
                    <MainPrice>₹{plan.price.toLocaleString('en-IN')}</MainPrice>
                    <Period>{plan.billingPeriod}</Period>
                  </Price>
                </Header>

                <Body>
                  <List>
                    {plan.benefits.map((benefit, index) => (
                      <ListItem key={index}>
                        <Check className="size-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-foreground">{benefit}</span>
                      </ListItem>
                    ))}
                  </List>

                  {plan.premiumBenefits && plan.premiumBenefits.length > 0 && (
                    <>
                      <Separator>Plus exclusive benefits</Separator>
                      <List>
                        {plan.premiumBenefits.map((benefit, index) => (
                          <ListItem key={index}>
                            <Sparkles className="size-5 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-foreground font-medium">{benefit}</span>
                          </ListItem>
                        ))}
                      </List>
                    </>
                  )}

                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(plan);
                    }}
                    className={`w-full mt-6 transition-all duration-300 ${
                      selectedPlan === plan.id
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                        : plan.highlighted
                        ? 'bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/30'
                        : 'bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground'
                    }`}
                    size="lg"
                  >
                    {selectedPlan === plan.id ? (
                      <span className="flex items-center gap-2">
                        <Check className="size-4" />
                        Selected
                      </span>
                    ) : (
                      'Select Plan'
                    )}
                  </Button>
                </Body>
              </Card>
            </div>
          ))}
        </div>

        {selectedPlan && (
          <div className="flex flex-col items-center gap-4 pt-8">
            <Button
              onClick={handleContinue}
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl shadow-primary/30 px-12 text-lg"
            >
              Continue with {MEMBERSHIP_PLANS.find((p) => p.id === selectedPlan)?.name}
            </Button>
            <p className="text-sm text-muted-foreground">
              30-day money-back guarantee • Secure payment • Instant access
            </p>
          </div>
        )}
      </div>
    </div>
  );
}