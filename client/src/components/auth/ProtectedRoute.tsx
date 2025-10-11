import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route, RouteProps } from "wouter";

type ProtectedRouteProps = RouteProps & {
  component: React.ComponentType;
  adminOnly?: boolean;
  proOnly?: boolean;
  customerOnly?: boolean;
};

export function ProtectedRoute({
  path,
  component: Component,
  adminOnly = false,
  proOnly = false,
  customerOnly = false,
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  // Show loading indicator while authentication state is being determined
  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Route>
    );
  }

  // If user is not authenticated, redirect to login
  if (!user) {
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  // Admin only routes - check isAdmin flag (set by backend based on email/username)
  if (adminOnly && !user.isAdmin) {
    return (
      <Route path={path}>
        <Redirect to="/" />
      </Route>
    );
  }

  // Pro only routes - users with Pro access but not customer portal access
  if (proOnly && (!user.hasProAccess && !user.hasPro)) {
    return (
      <Route path={path}>
        <Redirect to="/membership" />
      </Route>
    );
  }

  // Customer only routes - regular customers, no Pro or Admin access
  if (customerOnly && (user.hasProAccess || user.hasPro || user.role === "admin")) {
    return (
      <Route path={path}>
        <Redirect to="/" />
      </Route>
    );
  }

  // User is authenticated and has proper permissions
  return <Route path={path} component={Component} />;
}