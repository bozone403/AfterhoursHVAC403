import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Crown, Calculator, TrendingUp, DollarSign } from "lucide-react";
import { Link } from "wouter";

interface ProAccessGuardProps {
  children: React.ReactNode;
  feature: string;
}

export function ProAccessGuard({ children, feature }: ProAccessGuardProps) {
  const { user } = useAuth();

  // Debug: log user data to console for troubleshooting
  console.log('ProAccessGuard - User data:', user);

  // Check if user has pro access (checking all possible field variations)
  const hasProAccess = user?.hasProAccess || user?.hasPro || user?.has_pro_access || user?.has_pro;

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>
              Please sign in to access professional tools
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full">
              <Link href="/auth">Sign In</Link>
            </Button>
            <p className="text-center text-sm text-gray-600">
              Don't have an account? <Link href="/auth" className="text-blue-600 hover:underline">Create one here</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!hasProAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <CardHeader className="text-center">
            <Crown className="h-16 w-16 text-orange-500 mx-auto mb-4" />
            <CardTitle className="text-2xl">Pro Membership Required</CardTitle>
            <CardDescription className="text-lg">
              Access {feature} and other professional tools with AfterHours Pro
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <Calculator className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-semibold mb-1">Advanced Calculators</h4>
                <p className="text-sm text-gray-600">Professional load calculations, detailed material costing</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-semibold mb-1">Real-Time Pricing</h4>
                <p className="text-sm text-gray-600">Live Alggin.com catalog integration and cost tracking</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <DollarSign className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <h4 className="font-semibold mb-1">Quote Generation</h4>
                <p className="text-sm text-gray-600">Professional quotes with branded templates</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-500 to-blue-600 text-white rounded-lg p-6 mb-6">
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">Choose Your Pro Plan</h3>
                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  <div className="bg-white/20 rounded-lg p-4">
                    <div className="text-2xl font-bold">$49</div>
                    <div className="text-sm opacity-90">per month</div>
                  </div>
                  <div className="bg-white/30 rounded-lg p-4 border-2 border-white">
                    <div className="text-2xl font-bold">$499</div>
                    <div className="text-sm opacity-90">per year</div>
                    <div className="text-xs mt-1">Save $89!</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4">
                    <div className="text-2xl font-bold">$1500</div>
                    <div className="text-sm opacity-90">lifetime</div>
                    <div className="text-xs mt-1">Best Value</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button asChild className="flex-1" size="lg">
                <Link href="/membership">Upgrade to Pro</Link>
              </Button>
              <Button variant="outline" asChild className="flex-1" size="lg">
                <Link href="/calculators">Free Calculators</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}