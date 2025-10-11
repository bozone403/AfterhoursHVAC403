import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Shield, Phone, X, Bell, Clock } from "lucide-react";

interface SafetyAlert {
  id: string;
  type: 'danger' | 'warning' | 'caution';
  title: string;
  message: string;
  actions?: {
    label: string;
    action: () => void;
    urgent?: boolean;
  }[];
  autoDisappear?: number; // seconds
  persistent?: boolean;
}

interface SafetyAlertSystemProps {
  alerts: SafetyAlert[];
  onDismiss: (id: string) => void;
}

export default function SafetyAlertSystem({ alerts, onDismiss }: SafetyAlertSystemProps) {
  const [visibleAlerts, setVisibleAlerts] = useState<SafetyAlert[]>([]);

  useEffect(() => {
    setVisibleAlerts(alerts);

    // Handle auto-disappearing alerts
    alerts.forEach(alert => {
      if (alert.autoDisappear && !alert.persistent) {
        setTimeout(() => {
          onDismiss(alert.id);
        }, alert.autoDisappear * 1000);
      }
    });
  }, [alerts, onDismiss]);

  const getAlertStyle = (type: string) => {
    switch (type) {
      case 'danger':
        return 'bg-red-100 border-red-500 text-red-900 shadow-red-200';
      case 'warning':
        return 'bg-yellow-100 border-yellow-500 text-yellow-900 shadow-yellow-200';
      case 'caution':
        return 'bg-orange-100 border-orange-500 text-orange-900 shadow-orange-200';
      default:
        return 'bg-gray-100 border-gray-500 text-gray-900 shadow-gray-200';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'danger':
        return <AlertTriangle className="h-6 w-6 text-red-600" />;
      case 'warning':
        return <Shield className="h-6 w-6 text-yellow-600" />;
      case 'caution':
        return <Bell className="h-6 w-6 text-orange-600" />;
      default:
        return <AlertTriangle className="h-6 w-6 text-gray-600" />;
    }
  };

  if (visibleAlerts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-md">
      {visibleAlerts.map((alert) => (
        <Card 
          key={alert.id}
          className={`border-l-4 shadow-lg animate-in slide-in-from-right-full duration-300 ${getAlertStyle(alert.type)}`}
        >
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {getAlertIcon(alert.type)}
                <CardTitle className="text-sm font-semibold">
                  {alert.title}
                </CardTitle>
              </div>
              {!alert.persistent && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDismiss(alert.id)}
                  className="h-6 w-6 p-0 hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm mb-3">{alert.message}</p>
            
            {alert.actions && alert.actions.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {alert.actions.map((action, index) => (
                  <Button
                    key={index}
                    size="sm"
                    onClick={action.action}
                    variant={action.urgent ? "default" : "outline"}
                    className={action.urgent ? "bg-red-600 hover:bg-red-700 text-white" : ""}
                  >
                    {action.urgent && <Phone className="h-3 w-3 mr-1" />}
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Safety Alert Triggers
export const createGasLeakAlert = (): SafetyAlert => ({
  id: 'gas-leak-emergency',
  type: 'danger',
  title: 'GAS LEAK EMERGENCY',
  message: 'Gas smell detected! Leave the house immediately. Do not turn on lights or use phones inside.',
  persistent: true,
  actions: [
    {
      label: 'Call Emergency',
      action: () => window.open('tel:911'),
      urgent: true
    },
    {
      label: 'Call AfterHours HVAC',
      action: () => window.open('tel:4036136014'),
      urgent: true
    }
  ]
});

export const createElectricalAlert = (): SafetyAlert => ({
  id: 'electrical-warning',
  type: 'warning',
  title: 'Electrical Safety Warning',
  message: 'Turn off power at the electrical panel before proceeding. If you smell burning or see sparks, call for help.',
  actions: [
    {
      label: 'Emergency Service',
      action: () => window.location.href = '/emergency-service',
      urgent: true
    }
  ]
});

export const createFilterAlert = (): SafetyAlert => ({
  id: 'filter-reminder',
  type: 'caution',
  title: 'Filter Maintenance Due',
  message: 'Your air filter should be checked monthly. A dirty filter can damage your system.',
  autoDisappear: 10,
  actions: [
    {
      label: 'Set Reminder',
      action: () => {
        // Set monthly reminder
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        localStorage.setItem('hvac-filter-reminder', nextMonth.toISOString());
      }
    }
  ]
});

export const createMaintenanceAlert = (): SafetyAlert => ({
  id: 'maintenance-reminder',
  type: 'caution',
  title: 'Annual Maintenance Due',
  message: 'Schedule your annual HVAC maintenance to prevent breakdowns and maintain efficiency.',
  actions: [
    {
      label: 'Book Maintenance',
      action: () => window.location.href = '/book-service'
    }
  ]
});