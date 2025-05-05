
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { authService } from '@/services/authService';

const NotificationSettings = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [emailAddress, setEmailAddress] = useState(authService.getUserEmail() || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSaveSettings = () => {
    setIsUpdating(true);
    
    // In a real app, this would be saved to the backend
    // For now, we'll just show a toast message
    setTimeout(() => {
      localStorage.setItem('notificationSettings', JSON.stringify({
        email: emailNotifications,
        emailAddress
      }));
      
      toast.success('Notification settings saved');
      setIsUpdating(false);
    }, 1000);
  };

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="text-xl">Notification Settings</CardTitle>
        <CardDescription>Configure how you want to be notified about your stocks</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="email-notifications" className="text-base">Email Notifications</Label>
            <p className="text-sm text-muted-foreground">Receive alerts via email when stocks reach target prices</p>
          </div>
          <Switch
            id="email-notifications"
            checked={emailNotifications}
            onCheckedChange={setEmailNotifications}
          />
        </div>
        
        {emailNotifications && (
          <div className="space-y-2">
            <Label htmlFor="email-address">Email Address</Label>
            <Input
              id="email-address"
              type="email"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              placeholder="your@email.com"
            />
          </div>
        )}
        
        <Button 
          onClick={handleSaveSettings} 
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600"
          disabled={isUpdating}
        >
          {isUpdating ? 'Saving...' : 'Save Settings'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
