import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { Crown, Lock, Star, Zap } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresPro?: boolean;
  requiresAdmin?: boolean;
  fallbackTitle?: string;
  fallbackDescription?: string;
}

const ProtectedRoute = ({ 
  children, 
  requiresPro = false, 
  requiresAdmin = false,
  fallbackTitle = "Pro Feature",
  fallbackDescription = "This feature requires a Pro membership to access."
}: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-green-400 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Check authentication
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center p-4">
        <Card className="bg-slate-800/50 border-slate-700 max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-blue-600/10 rounded-full w-fit">
              <Lock className="h-8 w-8 text-blue-400" />
            </div>
            <CardTitle className="text-white">Login Required</CardTitle>
            <CardDescription>
              Please log in to access this feature
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/auth">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Log In
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check admin access
  if (requiresAdmin && !user.isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center p-4">
        <Card className="bg-slate-800/50 border-slate-700 max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-red-600/10 rounded-full w-fit">
              <Lock className="h-8 w-8 text-red-400" />
            </div>
            <CardTitle className="text-white">Admin Access Required</CardTitle>
            <CardDescription>
              You need administrator privileges to access this page
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Check pro access
  if (requiresPro && !user.hasPro && !user.isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center p-4">
        <Card className="bg-slate-800/50 border-slate-700 max-w-lg w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-green-600/10 rounded-full w-fit">
              <Crown className="h-8 w-8 text-green-400" />
            </div>
            <Badge variant="outline" className="w-fit mx-auto mb-4 border-green-500 text-green-400">
              Pro Feature
            </Badge>
            <CardTitle className="text-white text-xl">{fallbackTitle}</CardTitle>
            <CardDescription className="text-lg">
              {fallbackDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-slate-900/50 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-3 flex items-center">
                <Star className="h-4 w-4 text-green-400 mr-2" />
                Pro Features Include:
              </h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-center">
                  <Zap className="h-3 w-3 text-green-400 mr-2" />
                  Advanced material calculator with real supplier pricing
                </li>
                <li className="flex items-center">
                  <Zap className="h-3 w-3 text-green-400 mr-2" />
                  Commercial load calculation tools
                </li>
                <li className="flex items-center">
                  <Zap className="h-3 w-3 text-green-400 mr-2" />
                  Professional PDF export and templates
                </li>
                <li className="flex items-center">
                  <Zap className="h-3 w-3 text-green-400 mr-2" />
                  Priority customer support
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <Link href="/membership">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade to Pro
                </Button>
              </Link>
              <div className="text-center">
                <p className="text-sm text-slate-400">
                  Starting at $49/month • Cancel anytime
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // User has required access, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;