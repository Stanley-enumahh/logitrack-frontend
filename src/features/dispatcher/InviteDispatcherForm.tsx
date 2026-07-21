import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import { FiX, FiCheckCircle } from 'react-icons/fi';
import { useState } from 'react';
import { sendInvite, type SendInvitePayload } from '../../api/auth';

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
});

type FormValues = yup.InferType<typeof schema>;

interface InviteDispatcherFormProps {
  onClose: () => void;
}

export default function InviteDispatcherForm({ onClose }: InviteDispatcherFormProps) {
  const [sentTo, setSentTo] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: yupResolver(schema) });

  const mutation = useMutation({
    mutationFn: (payload: SendInvitePayload) => sendInvite(payload),
    onSuccess: (_, variables) => setSentTo(variables.email),
  });

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-base font-semibold text-slate-900">Invite dispatcher</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {sentTo ? (
          <div className="px-6 py-8 text-center">
            <FiCheckCircle className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-900 mb-1">Invite sent</p>
            <p className="text-sm text-slate-500">{sentTo} will receive a link to set up their account.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-4 space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Email address</label>
              <input
                {...register('email')}
                placeholder="colleague@company.com"
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {mutation.isError && (
              <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-md px-3 py-2">
                Couldn't send invite. That email may already be registered.
              </p>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800">
                Cancel
              </button>
              <button
                type="submit"
                disabled={mutation.isPending}
                className="px-4 py-2 bg-slate-900 cursor-pointer text-white text-sm font-medium rounded-md hover:bg-slate-800 disabled:opacity-50"
              >
                {mutation.isPending ? 'Sending...' : 'Send invite'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}