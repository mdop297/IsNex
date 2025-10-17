'use client';
import { Button } from '@/components/ui/button';
import { authApi } from '@/lib/api/auth';
import { CheckCircleIcon, XCircleIcon } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

const VerifyPage = () => {
  const { token } = useParams();
  const [state, setState] = useState<'loading' | 'success' | 'error'>(
    'loading',
  );
  const router = useRouter();

  useEffect(() => {
    if (!token) return;

    const verifyEmail = async () => {
      try {
        const result = await authApi.verify(token as string);
        if (result.status === 200) {
          setState('success');
          toast.success(result.message);
        } else {
          setState('error');
          toast.error(result.message);
        }
      } catch (error: unknown) {
        setState('error');

        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error('Verification failed');
        }
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      {state === 'loading' && (
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
          <p className="text-gray-700 text-lg font-medium">
            Verifying your email...
          </p>
        </div>
      )}

      {state === 'success' && (
        <div className="flex flex-col items-center space-y-4 bg-green-50 p-8 rounded-lg shadow-md">
          <CheckCircleIcon className="w-16 h-16 text-green-500" />
          <p className="text-green-700 text-xl font-semibold">
            Email Verified!
          </p>
          <p className="text-green-600 text-center">
            You can now proceed to login.
          </p>
          <Button onClick={() => router.push('/signin')}>Sign In</Button>
        </div>
      )}

      {state === 'error' && (
        <div className="flex flex-col items-center space-y-4 bg-red-50 p-8 rounded-lg shadow-md">
          <XCircleIcon className="w-16 h-16 text-red-500" />
          <p className="text-red-700 text-xl font-semibold">
            Verification Failed
          </p>
          <p className="text-red-600 text-center">
            The link may be expired or invalid.
          </p>
        </div>
      )}
    </div>
  );
};

export default VerifyPage;
