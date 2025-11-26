import { useForm } from "react-hook-form";
import { useContext, useState } from "react";
import { AuthContext } from "../../../context/AuthContext/AuthContext";
import { Link, useNavigate } from "react-router";

type LoginFormValues = {
  email: string;
  password: string;
};

export default function Login() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>();

  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [serverError,setServerError] = useState<string>("")

  const onSubmit = async (data: LoginFormValues) => {
    console.log("Data ", data);
    console.log("Auth Login", auth);

    if (!auth) {
      setError("email", {
        type: "manual",
        message: "Something went wrong. Please refresh and try again.",
      });
      return;
    }

    try {
      await auth.login(data);
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      const responseErrors = err?.response?.data?.errors
      if(Array.isArray(responseErrors)){
        responseErrors.forEach((error: any) => {
          if(error.path) {

            setError(error.path as keyof LoginFormValues,{
              message: error.message
            })
          }
        })
      }
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Login failed. Please check your email and password.";
      setServerError(message)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradientApp">
      <div className="bg-white rounded-2xl shadow-xl p-10 w-[400px]">
        <h1 className="text-3xl font-bold text-night mb-6 text-center">
          Welcome Back 👋
        </h1>
        {serverError && (
          <p className="mb-4 text-sm text-red-600 bg-red-100/80 px-3 py-2 rounded-lg">
            {serverError}
          </p>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <input
              className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-coral"
              placeholder="Email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-coral"
              placeholder="Password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-night text-white py-3 rounded-lg hover:bg-damaranth transition font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          New here?{" "}
          <Link className="text-coral font-bold" to="/register">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
