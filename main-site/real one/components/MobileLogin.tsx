import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Phone, Key } from "lucide-react";
import { signInWithPhoneNumber, RecaptchaVerifier, ConfirmationResult } from "firebase/auth";
import { auth } from "@/lib/firebase";

export interface MobileLoginProps {
  onLoginSuccess?: (phone: string) => void;
}

export const MobileLogin: React.FC<MobileLoginProps> = ({ onLoginSuccess }) => {
  const [step, setStep] = useState<'enter' | 'verify'>('enter');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  // Send OTP using Firebase
  const sendOtp = async () => {
    setIsLoading(true);
    setError("");
    try {
      const formattedPhone = `+91${phone}`;
      const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      });
      const result = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier);
      setConfirmationResult(result);
      setStep('verify');
    } catch (err: any) {
      console.error('Error sending OTP:', err);
      if (err.code === 'auth/invalid-phone-number') {
        setError('Invalid phone number. Please check and try again.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many requests. Please try again later.');
      } else {
        setError('Failed to send OTP. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP handler
  const resendOtp = async () => {
    setIsLoading(true);
    setError("");
    try {
      const formattedPhone = `+91${phone}`;
      const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      });
      const result = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier);
      setConfirmationResult(result);
    } catch (err: any) {
      console.error('Error resending OTP:', err);
      if (err.code === 'auth/invalid-phone-number') {
        setError('Invalid phone number. Please check and try again.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many requests. Please try again later.');
      } else {
        setError('Failed to resend OTP. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP using Firebase
  const verifyOtp = async () => {
    if (!confirmationResult) {
      setError('No OTP sent. Please request OTP first.');
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      await confirmationResult.confirm(otp);
      if (onLoginSuccess) onLoginSuccess(phone);
    } catch (err: any) {
      console.error('Error verifying OTP:', err);
      if (err.code === 'auth/invalid-verification-code') {
        setError('Invalid OTP. Please check and try again.');
      } else if (err.code === 'auth/code-expired') {
        setError('OTP has expired. Please request a new one.');
      } else {
        setError('Failed to verify OTP. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mt-6">
      <CardHeader className="text-center">
        <CardTitle>Login with Mobile Number</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div id="recaptcha-container"></div>
        {step === 'enter' ? (
          <form
            onSubmit={e => {
              e.preventDefault();
              sendOtp();
            }}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="phone">Mobile Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="Enter your mobile number"
                required
                className="glassmorphism"
                minLength={10}
                maxLength={10}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Sending OTP...' : 'Send OTP'}
            </Button>
          </form>
        ) : (
          <form
            onSubmit={e => {
              e.preventDefault();
              verifyOtp();
            }}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="otp">Enter OTP</Label>
              <Input
                id="otp"
                name="otp"
                type="text"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                placeholder="Enter the OTP received"
                required
                className="glassmorphism"
                minLength={6}
                maxLength={6}
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full mb-2" disabled={isLoading}>
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </Button>
            <Button type="button" variant="outline" className="w-full" onClick={resendOtp} disabled={isLoading}>
              Resend OTP
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};
