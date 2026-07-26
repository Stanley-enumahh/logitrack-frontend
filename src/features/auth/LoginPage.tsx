import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { FiTruck, FiLock, FiUser } from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";
import type { LoginPayload } from "../../api/auth";

const schema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
});

type FormValues = yup.InferType<typeof schema>;

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: yupResolver(schema) });

  const loginMutation = useMutation({
    mutationFn: (values: LoginPayload) => login(values),
    onSuccess: () => {
      navigate("/dashboard");
    },
  });

  const serverError = (() => {
    if (!loginMutation.isError) return null;
    const axiosError = loginMutation.error as {
      response?: { status?: number; data?: { detail?: string[] | string } };
    };
    if (axiosError.response?.status === 429) {
      return "Too many login attempts. Please wait a minute and try again.";
    }
    const detail = axiosError.response?.data?.detail;
    const message = Array.isArray(detail) ? detail[0] : detail;
    return message ?? "Invalid username or password.";
  })();

  const onSubmit = (values: FormValues) => {
    loginMutation.mutate(values);
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
          <h1 className="text-slate-900 text-lg font-semibold mb-1">Sign in</h1>
          <p className="text-slate-500 text-sm mb-6">
            Dispatcher and driver access
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
                  type="text"
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="johndriver"
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
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  {...register("password")}
                  type="password"
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="••••••••"
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
              disabled={loginMutation.isPending}
              className="w-full bg-slate-900 text-white text-sm cursor-pointer font-medium py-2.5 rounded-md hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              {loginMutation.isPending ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
