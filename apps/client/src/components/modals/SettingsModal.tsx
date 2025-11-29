'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useTheme } from 'next-themes';
import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Theme Settings Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold mb-3">Theme</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Choose your preferred color scheme
              </p>

              {/* Theme Options */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setTheme('light')}
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                    theme === 'light'
                      ? 'border-primary bg-primary/5'
                      : 'border-muted hover:border-muted-foreground/50'
                  }`}
                >
                  <Sun className="h-5 w-5" />
                  <span className="text-xs font-medium">Light</span>
                </button>

                <button
                  onClick={() => setTheme('dark')}
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                    theme === 'dark'
                      ? 'border-primary bg-primary/5'
                      : 'border-muted hover:border-muted-foreground/50'
                  }`}
                >
                  <Moon className="h-5 w-5" />
                  <span className="text-xs font-medium">Dark</span>
                </button>

                <button
                  onClick={() => setTheme('system')}
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                    theme === 'system'
                      ? 'border-primary bg-primary/5'
                      : 'border-muted hover:border-muted-foreground/50'
                  }`}
                >
                  <Monitor className="h-5 w-5" />
                  <span className="text-xs font-medium">System</span>
                </button>
              </div>
            </div>
          </div>

          {/* Privacy & Notifications Section */}
          <div className="space-y-3 border-t pt-6">
            <h3 className="text-sm font-semibold">Preferences</h3>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">
                  Email Notifications
                </Label>
                <p className="text-xs text-muted-foreground">
                  Receive notifications via email
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Analytics</Label>
                <p className="text-xs text-muted-foreground">
                  Help us improve with usage data
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>

          {/* Dangerous Zone */}
          <div className="space-y-3 border-t pt-6">
            <h3 className="text-sm font-semibold text-destructive">
              Danger Zone
            </h3>
            <Button
              variant="outline"
              className="w-full text-destructive hover:text-destructive bg-transparent"
            >
              Clear All Data
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
