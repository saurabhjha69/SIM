import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import API from "../../../api/axios";
import { useState } from "react";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
}

export default function Register() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>();

  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const onSubmit = async (data: RegisterForm) => {
    try {
      setServerError(null);

      const res = await API.post("/auth/register", data);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Register error", err);

      const responseErrors = err?.response?.data?.errors;

      if (Array.isArray(responseErrors)) {
        responseErrors.forEach((e: any) => {
          if (e.path) {
            setError(e.path as keyof RegisterForm, {
              message: e.msg,
            });
          }
        });
      } else if (err?.response?.data?.message) {
        setServerError(err.response.data.message);
      } else {
        setServerError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradientApp px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-night mb-2 text-center">
          Create Account
        </h1>
        <p className="text-sm text-gray-500 mb-6 text-center">
          Join and start managing your tasks in style.
        </p>

        {serverError && (
          <p className="mb-4 text-sm text-red-600 bg-red-100/80 px-3 py-2 rounded-lg">
            {serverError}
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <div>
            <label className="block text-sm font-semibold text-night mb-1">
              Name
            </label>
            <input
              className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-coral ${
                errors.name ? "border-red-500" : "border-gray-200"
              }`}
              placeholder="Your name"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-night mb-1">
              Email
            </label>
            <input
              type="email"
              className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-coral ${
                errors.email ? "border-red-500" : "border-gray-200"
              }`}
              placeholder="you@example.com"
              {...register("email", {
                required: "Email is required",
              })}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-night mb-1">
              Password
            </label>
            <input
              type="password"
              className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-coral ${
                errors.password ? "border-red-500" : "border-gray-200"
              }`}
              placeholder="Minimum 6 characters"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Minimum 6 characters" },
              })}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-night text-white py-3 rounded-lg hover:bg-damaranth transition font-semibold disabled:opacity-70"
          >
            {isSubmitting ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link className="text-coral font-bold" to="/login">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
