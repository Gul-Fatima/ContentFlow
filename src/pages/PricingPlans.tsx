import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription } from
'../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { motion } from 'framer-motion';
import {
  Check,
  Crown,
  Zap,
  Building2,
  Sparkles,
  ArrowRight,
  CreditCard,
  Calendar,
  Receipt,
  ChevronRight } from
'lucide-react';
interface PlanFeature {
  text: string;
  included: boolean;
}
interface Plan {
  id: string;
  name: string;
  description: string;
  price: string;
  period: string;
  icon: React.ElementType;
  features: PlanFeature[];
  popular?: boolean;
  current?: boolean;
  cta: string;
  accent: string;
  iconBg: string;
}
const plans: Plan[] = [
{
  id: 'starter',
  name: 'Starter',
  description: 'For freelancers getting started with AI-powered social.',
  price: '$29',
  period: '/month',
  icon: Zap,
  accent: 'slate',
  iconBg: 'bg-slate-100 text-slate-600',
  cta: 'Downgrade',
  features: [
  {
    text: '1 workspace',
    included: true
  },
  {
    text: '50 AI-generated posts/mo',
    included: true
  },
  {
    text: '2 social platforms',
    included: true
  },
  {
    text: '1,000 AI credits',
    included: true
  },
  {
    text: 'Basic analytics',
    included: true
  },
  {
    text: 'Email support',
    included: true
  },
  {
    text: 'Brand memory',
    included: false
  },
  {
    text: 'Team collaboration',
    included: false
  },
  {
    text: 'Custom AI training',
    included: false
  },
  {
    text: 'API access',
    included: false
  }]

},
{
  id: 'pro',
  name: 'Pro',
  description: 'For growing teams that need serious automation.',
  price: '$79',
  period: '/month',
  icon: Crown,
  accent: 'indigo',
  iconBg: 'bg-gradient-to-br from-amber-500 to-orange-600 text-white',
  popular: true,
  current: true,
  cta: 'Current Plan',
  features: [
  {
    text: '5 workspaces',
    included: true
  },
  {
    text: '200 AI-generated posts/mo',
    included: true
  },
  {
    text: 'All social platforms',
    included: true
  },
  {
    text: '10,000 AI credits',
    included: true
  },
  {
    text: 'Advanced analytics',
    included: true
  },
  {
    text: 'Priority support',
    included: true
  },
  {
    text: 'Brand memory & tone',
    included: true
  },
  {
    text: 'Team collaboration (3 seats)',
    included: true
  },
  {
    text: 'Custom AI training',
    included: false
  },
  {
    text: 'API access',
    included: false
  }]

},
{
  id: 'enterprise',
  name: 'Enterprise',
  description: 'For agencies and brands at scale. Unlimited everything.',
  price: '$199',
  period: '/month',
  icon: Building2,
  accent: 'violet',
  iconBg: 'bg-gradient-to-br from-brand-600 to-purple-700 text-white',
  cta: 'Upgrade Now',
  features: [
  {
    text: 'Unlimited workspaces',
    included: true
  },
  {
    text: 'Unlimited AI posts',
    included: true
  },
  {
    text: 'All social platforms',
    included: true
  },
  {
    text: 'Unlimited AI credits',
    included: true
  },
  {
    text: 'Custom analytics & reports',
    included: true
  },
  {
    text: 'Dedicated account manager',
    included: true
  },
  {
    text: 'Brand memory & tone',
    included: true
  },
  {
    text: 'Unlimited team seats',
    included: true
  },
  {
    text: 'Custom AI model training',
    included: true
  },
  {
    text: 'Full API access & webhooks',
    included: true
  }]

}];

const billingHistory = [
{
  date: 'Jan 1, 2026',
  amount: '$79.00',
  status: 'Paid',
  invoice: '#INV-2026-001'
},
{
  date: 'Dec 1, 2025',
  amount: '$79.00',
  status: 'Paid',
  invoice: '#INV-2025-012'
},
{
  date: 'Nov 1, 2025',
  amount: '$79.00',
  status: 'Paid',
  invoice: '#INV-2025-011'
},
{
  date: 'Oct 1, 2025',
  amount: '$29.00',
  status: 'Paid',
  invoice: '#INV-2025-010'
}];

export const PricingPlans = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>(
    'monthly'
  );
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <Badge variant="default" className="mb-4 px-3 py-1">
          <Sparkles size={12} className="mr-1" /> Pricing
        </Badge>
        <h2 className="text-3xl font-bold text-brown mb-3">
          Choose the right plan for your team
        </h2>
        <p className="text-slate-500 text-lg">
          Scale your social media presence with AI. All plans include a 14-day
          free trial.
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <span
            className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-brown' : 'text-slate-400'}`}>
            
            Monthly
          </span>
          <button
            onClick={() =>
            setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')
            }
            className="relative h-7 w-12 rounded-full bg-brand-600 transition-colors">
            
            <div
              className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-1'}`} />
            
          </button>
          <span
            className={`text-sm font-medium ${billingCycle === 'annual' ? 'text-brown' : 'text-slate-400'}`}>
            
            Annual
            <span className="ml-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Save 20%
            </span>
          </span>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan, i) => {
          const multiplier = billingCycle === 'annual' ? 0.8 : 1;
          const price = Math.round(
            parseInt(plan.price.replace('$', '')) * multiplier
          );
          return (
            <motion.div
              key={plan.id}
              initial={{
                opacity: 0,
                y: 20
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                delay: i * 0.1,
                duration: 0.3
              }}>
              
              <Card
                className={`relative overflow-hidden h-full flex flex-col ${plan.current ? 'border-brand-300 ring-2 ring-brand-100' : 'border-slate-200'}`}>
                
                {plan.popular &&
                <div className="absolute top-0 right-0">
                    <div className="bg-brand-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-lg">
                      Current Plan
                    </div>
                  </div>
                }

                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`h-10 w-10 rounded-xl flex items-center justify-center ${plan.iconBg}`}>
                      
                      <plan.icon size={20} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{plan.name}</CardTitle>
                    </div>
                  </div>
                  <CardDescription className="text-sm">
                    {plan.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col">
                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-brown">
                        ${price}
                      </span>
                      <span className="text-slate-500 text-sm">
                        {plan.period}
                      </span>
                    </div>
                    {billingCycle === 'annual' &&
                    <p className="text-xs text-emerald-600 mt-1">
                        ${price * 12}/year — saving $
                        {Math.round(
                        parseInt(plan.price.replace('$', '')) * 12 * 0.2
                      )}
                        /year
                      </p>
                    }
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 flex-1 mb-6">
                    {plan.features.map((feature, j) =>
                    <li key={j} className="flex items-start gap-2.5">
                        <div
                        className={`mt-0.5 h-4 w-4 rounded-full flex items-center justify-center shrink-0 ${feature.included ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-300'}`}>
                        
                          <Check size={10} strokeWidth={3} />
                        </div>
                        <span
                        className={`text-sm ${feature.included ? 'text-slate-700' : 'text-slate-400'}`}>
                        
                          {feature.text}
                        </span>
                      </li>
                    )}
                  </ul>

                  {/* CTA */}
                  <Button
                    variant={
                    plan.current ?
                    'secondary' :
                    plan.id === 'enterprise' ?
                    'primary' :
                    'outline'
                    }
                    className={`w-full ${plan.id === 'enterprise' ? 'bg-gradient-to-r from-brand-500 to-brand-700 hover:from-brand-600 hover:to-brand-800 border-none' : ''}`}
                    disabled={plan.current}
                    leftIcon={
                    plan.id === 'enterprise' ?
                    <Sparkles size={16} /> :
                    undefined
                    }>
                    
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>);

        })}
      </div>

      {/* Billing Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Payment Method */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CreditCard size={18} className="text-slate-400" />
              Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 p-3 bg-cream rounded-lg border border-slate-100">
              <div className="h-10 w-14 bg-gradient-to-br from-brand-800 to-brand-900 rounded-md flex items-center justify-center">
                <span className="text-white text-[10px] font-bold tracking-wider">
                  VISA
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-brown">
                  •••• •••• •••• 4242
                </p>
                <p className="text-xs text-slate-500">Expires 08/2027</p>
              </div>
              <Button variant="ghost" size="sm">
                Edit
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Next Billing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar size={18} className="text-slate-400" />
              Next Billing Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-3 bg-cream rounded-lg border border-slate-100">
              <p className="text-2xl font-bold text-brown">Feb 27, 2026</p>
              <p className="text-sm text-slate-500 mt-1">Pro Plan — $79.00</p>
              <div className="flex items-center gap-2 mt-3">
                <div className="h-1.5 flex-1 rounded-full bg-slate-200 overflow-hidden">
                  <div className="h-full w-[60%] rounded-full bg-brand-500" />
                </div>
                <span className="text-xs text-slate-400">18 days left</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Zap size={18} className="text-slate-400" />
              Usage This Period
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Posts Generated</span>
                <span className="text-sm font-bold text-brown">
                  142 / 200
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full w-[71%] rounded-full bg-brand-500" />
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-sm text-slate-600">AI Credits</span>
                <span className="text-sm font-bold text-brown">
                  8,420 / 10,000
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full w-[84%] rounded-full bg-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Receipt size={18} className="text-slate-400" />
              Billing History
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              rightIcon={<ArrowRight size={14} />}>
              
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {billingHistory.map((item, i) =>
            <motion.div
              key={i}
              initial={{
                opacity: 0
              }}
              animate={{
                opacity: 1
              }}
              transition={{
                delay: i * 0.05
              }}
              className="flex items-center justify-between px-6 py-4 hover:bg-cream transition-colors cursor-pointer group">
              
                <div className="flex items-center gap-4">
                  <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                    <Receipt size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-brown">
                      {item.invoice}
                    </p>
                    <p className="text-xs text-slate-500">{item.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="success">{item.status}</Badge>
                  <span className="text-sm font-semibold text-brown">
                    {item.amount}
                  </span>
                  <ChevronRight
                  size={16}
                  className="text-slate-300 group-hover:text-slate-500 transition-colors" />
                
                </div>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>);

};