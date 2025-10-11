import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar, Clock, CheckCircle, X, Plus } from "lucide-react";

interface Reminder {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high';
  category: 'maintenance' | 'safety' | 'efficiency' | 'seasonal';
  completed: boolean;
  recurring?: 'monthly' | 'quarterly' | 'annually';
}

interface ReminderWidgetProps {
  onComplete: (id: string) => void;
  onDismiss: (id: string) => void;
  onAddReminder?: () => void;
}

export default function ReminderWidget({ onComplete, onDismiss, onAddReminder }: ReminderWidgetProps) {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Load reminders from localStorage
    const savedReminders = localStorage.getItem('hvac-reminders');
    if (savedReminders) {
      const parsed = JSON.parse(savedReminders).map((r: any) => ({
        ...r,
        dueDate: new Date(r.dueDate)
      }));
      setReminders(parsed);
    } else {
      // Initialize with default HVAC maintenance reminders
      initializeDefaultReminders();
    }
  }, []);

  const initializeDefaultReminders = () => {
    const now = new Date();
    const defaultReminders: Reminder[] = [
      {
        id: 'filter-check',
        title: 'Check Air Filter',
        description: 'Replace if dirty or every 3 months',
        dueDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days
        priority: 'high',
        category: 'maintenance',
        completed: false,
        recurring: 'monthly'
      },
      {
        id: 'annual-maintenance',
        title: 'Annual HVAC Maintenance',
        description: 'Professional tune-up and inspection',
        dueDate: new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000), // 1 year
        priority: 'medium',
        category: 'maintenance',
        completed: false,
        recurring: 'annually'
      },
      {
        id: 'thermostat-batteries',
        title: 'Replace Thermostat Batteries',
        description: 'Change batteries in programmable thermostat',
        dueDate: new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000), // 6 months
        priority: 'medium',
        category: 'maintenance',
        completed: false,
        recurring: 'annually'
      },
      {
        id: 'duct-cleaning',
        title: 'Duct Cleaning',
        description: 'Professional duct cleaning service',
        dueDate: new Date(now.getTime() + 730 * 24 * 60 * 60 * 1000), // 2 years
        priority: 'low',
        category: 'efficiency',
        completed: false
      }
    ];
    
    setReminders(defaultReminders);
    localStorage.setItem('hvac-reminders', JSON.stringify(defaultReminders));
  };

  const saveReminders = (updatedReminders: Reminder[]) => {
    setReminders(updatedReminders);
    localStorage.setItem('hvac-reminders', JSON.stringify(updatedReminders));
  };

  const handleComplete = (id: string) => {
    const updatedReminders = reminders.map(reminder => {
      if (reminder.id === id) {
        const completed = { ...reminder, completed: true };
        
        // Handle recurring reminders
        if (reminder.recurring) {
          const nextDue = new Date(reminder.dueDate);
          switch (reminder.recurring) {
            case 'monthly':
              nextDue.setMonth(nextDue.getMonth() + 1);
              break;
            case 'quarterly':
              nextDue.setMonth(nextDue.getMonth() + 3);
              break;
            case 'annually':
              nextDue.setFullYear(nextDue.getFullYear() + 1);
              break;
          }
          
          // Create new reminder for next occurrence
          const newReminder: Reminder = {
            ...reminder,
            id: `${reminder.id}-${Date.now()}`,
            dueDate: nextDue,
            completed: false
          };
          
          setTimeout(() => {
            setReminders(prev => [...prev, newReminder]);
          }, 1000);
        }
        
        return completed;
      }
      return reminder;
    });
    
    saveReminders(updatedReminders);
    onComplete(id);
  };

  const handleDismiss = (id: string) => {
    const updatedReminders = reminders.filter(reminder => reminder.id !== id);
    saveReminders(updatedReminders);
    onDismiss(id);
  };

  const getDaysUntilDue = (dueDate: Date) => {
    const now = new Date();
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'maintenance': return '🔧';
      case 'safety': return '🚨';
      case 'efficiency': return '⚡';
      case 'seasonal': return '🌡️';
      default: return '📝';
    }
  };

  const activeReminders = reminders.filter(r => !r.completed);
  const urgentReminders = activeReminders.filter(r => {
    const daysUntil = getDaysUntilDue(r.dueDate);
    return daysUntil <= 7 || r.priority === 'high';
  });

  if (urgentReminders.length === 0 && !isExpanded) {
    return (
      <Button
        onClick={() => setIsExpanded(true)}
        variant="outline"
        size="sm"
        className="fixed bottom-20 right-4 z-30 shadow-lg"
      >
        <Bell className="h-4 w-4 mr-2" />
        Reminders ({activeReminders.length})
      </Button>
    );
  }

  return (
    <div className="fixed bottom-20 right-4 z-30 max-w-sm">
      <Card className="shadow-xl border-2 border-blue-200">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Bell className="h-4 w-4" />
              HVAC Reminders
            </CardTitle>
            <div className="flex gap-1">
              {onAddReminder && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onAddReminder}
                  className="h-6 w-6 p-0"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {(isExpanded ? activeReminders : urgentReminders).slice(0, 5).map((reminder) => {
            const daysUntil = getDaysUntilDue(reminder.dueDate);
            const isOverdue = daysUntil < 0;
            const isUrgent = daysUntil <= 3;

            return (
              <div
                key={reminder.id}
                className={`p-3 rounded-lg border ${
                  isOverdue 
                    ? 'bg-red-50 border-red-200' 
                    : isUrgent 
                    ? 'bg-yellow-50 border-yellow-200' 
                    : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getCategoryIcon(reminder.category)}</span>
                    <div>
                      <h4 className="font-medium text-sm">{reminder.title}</h4>
                      <p className="text-xs text-gray-600">{reminder.description}</p>
                    </div>
                  </div>
                  <Badge className={getPriorityColor(reminder.priority)} variant="outline">
                    {reminder.priority}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    {isOverdue 
                      ? `Overdue by ${Math.abs(daysUntil)} days`
                      : daysUntil === 0 
                      ? 'Due today'
                      : `Due in ${daysUntil} days`
                    }
                  </div>
                  
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      onClick={() => handleComplete(reminder.id)}
                      className="h-6 text-xs bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Done
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDismiss(reminder.id)}
                      className="h-6 text-xs"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}

          {activeReminders.length === 0 && (
            <div className="text-center py-4">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">All caught up!</p>
            </div>
          )}

          {isExpanded && activeReminders.length > 5 && (
            <div className="text-center">
              <p className="text-xs text-gray-500">
                +{activeReminders.length - 5} more reminders
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}