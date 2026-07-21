import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiTruck, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { verifyEmail } from '../../api/auth';

export default function VerifyEmailPage() {
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) return;
    verifyEmail(token)
      .then((data) => {
        setStatus('success');
        setMessage(data.message);
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.response?.data?.detail ?? 'Verification failed.');
      });
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <FiTruck className="text-amber-500 w-7 h-7" />
          <span className="text-white text-xl font-semibold tracking-tight">LogiTrack</span>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {status === 'loading' && <p className="text-slate-500 text-sm">Verifying your email...</p>}

          {status === 'success' && (
            <>
              <FiCheckCircle className="w-10 h-10 text-emerald-600 mx-auto mb-4" />
              <h1 className="text-lg font-semibold text-slate-900 mb-1">Email verified</h1>
              <p className="text-slate-500 text-sm mb-4">{message}</p>
              <Link
                to="/login"
                className="block w-full bg-slate-900 text-white text-sm font-medium py-2.5 rounded-md hover:bg-slate-800"
              >
                Sign in
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <FiXCircle className="w-10 h-10 text-red-600 mx-auto mb-4" />
              <h1 className="text-lg font-semibold text-slate-900 mb-1">Verification failed</h1>
              <p className="text-slate-500 text-sm">{message}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}