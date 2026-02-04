'use client';

import { useAuth } from '@/lib/contexts/auth-context';
import { useSaved } from '@/lib/contexts/saved-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Heart, User } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
  const { user } = useAuth();
  const { getSavedCount } = useSaved();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Please log in to access settings.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/login">
              <Button className="w-full">Go to Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center text-primary hover:text-primary/80 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Settings</CardTitle>
            <CardDescription>Manage your account settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-muted-foreground">Settings page is under development.</p>
              <p className="text-sm mt-2">More options will be available soon.</p>
            </div>

            {/* Navigation to Saved Items */}
            <div className="flex justify-center space-x-4 mt-8">
              <Link href="/profile">
                <Button variant="outline" className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </Button>
              </Link>
              <Link href="/saved">
                <Button variant="outline" className="flex items-center space-x-2">
                  <Heart className="w-4 h-4" />
                  <span>Saved Items ({getSavedCount()})</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
