import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { FiTruck, FiUser, FiLock, FiPhone } from "react-icons/fi";
import { acceptInvite, type AcceptInvitePayload } from "../../api/auth";

const schema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup
    .string()
    .min(8, "At least 8 characters")
    .required("Password is required"),
  phone_number: yup.string().default(""),
});

type FormValues = yup.InferType<typeof schema>;

export default function AcceptInvitePage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: yupResolver(schema) });

  const mutation = useMutation({
    mutationFn: (payload: AcceptInvitePayload) => acceptInvite(payload),
    onSuccess: () => navigate("/login"),
    onError: (err: unknown) => {
      const axiosError = err as {
        response?: { data?: Record<string, string[] | string> };
      };
      const data = axiosError.response?.data;
      const firstError = data ? Object.values(data)[0] : null;
      const message = Array.isArray(firstError) ? firstError[0] : firstError;
      setServerError(
        typeof message === "string" ? message : "Couldn't complete signup.",
      );
    },
  });

  const onSubmit = (values: FormValues) => {
    if (!token) return;
    setServerError(null);
    mutation.mutate({ ...values, token });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <FiTruck className="text-amber-500 w-7 h-7" />
          <span className="text-white text-xl font-semibold tracking-tight">
            LogiTrack
          </span>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-slate-900 text-lg font-semibold mb-1">
            Set up your account
          </h1>
          <p className="text-slate-500 text-sm mb-6">
            You've been invited to join as a dispatcher
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Username
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  {...register("username")}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              {errors.username && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Phone number
              </label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  {...register("phone_number")}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="password"
                  {...register("password")}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              {errors.password && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {serverError && (
              <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {serverError}
              </p>
            )}

            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-slate-900 text-white text-sm font-medium py-2.5 rounded-md hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              {mutation.isPending ? "Setting up..." : "Create account"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-4">
            Already set up?{" "}
            <Link
              to="/login"
              className="text-slate-900 font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
