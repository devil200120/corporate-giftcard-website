import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { verifyEmail } from '../../store/slices/authSlice';

const EmailVerificationPage = () => {
  const { token } = useParams();
  const dispatch = useDispatch();
  const { isLoading } = useSelector(state => state.auth);
  const [verificationStatus, setVerificationStatus] = useState('verifying');

  useEffect(() => {
    const verify = async () => {
      try {
        await dispatch(verifyEmail({ token })).unwrap();
        setVerificationStatus('success');
      } catch (error) {
        setVerificationStatus('error');
      }
    };
    verify();
  }, [dispatch, token]);

  if (isLoading || verificationStatus === 'verifying') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400">Verifying your email...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
        {verificationStatus === 'success' ? (
          <>
            <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Email Verified Successfully!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your email has been verified. You can now sign in to your account.
            </p>
            <Link
              to="/login"
              className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors inline-block"
            >
              Sign In to Your Account
            </Link>
          </>
        ) : (
          <>
            <XCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Verification Failed
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The verification link is invalid or has expired. Please request a new verification email.
            </p>
            <Link
              to="/register"
              className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors inline-block"
            >
              Back to Registration
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default EmailVerificationPage;
