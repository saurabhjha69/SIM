import { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import { motion } from "framer-motion";

interface ProfileForm {
  name: string;
  email: string;
}

export default function Profile() {
  const auth = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ProfileForm>();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [updatedUserDetails,setUpdatedUserDetails] = useState<any | null>(null)

  const loadProfile = async () => {
    setLoading(true);
    setServerError(null);

    try {
      const res = await API.get("/users/me");
      reset({
        name: res.data.name,
        email: res.data.email,
      });
      setUpdatedUserDetails(res.data)
    } catch (error: any) {
      console.error("Load profile error:", error);
      setServerError("Failed to load profile. Please try again.");
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const onSubmit = async (data: ProfileForm) => {
    setSaving(true);
    setServerError(null);

    try {
      await API.put("/users/me", data);
      await loadProfile();
    } catch (error: any) {
      console.error("Update profile error:", error);

      const responseErrors = error?.response?.data?.errors;

      if (Array.isArray(responseErrors)) {
        responseErrors.forEach((err: any) => {
          if (err.path) {
            setError(err.path as keyof ProfileForm, {
              message: err.msg,
            });
          }
        });
      } else if (error?.response?.data?.message) {
        setServerError(error.response.data.message);
      } else {
        setServerError("Something went wrong while saving. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-amaranth flex items-center justify-center">
        <div className="bg-night/70 border border-white/10 rounded-2xl p-8 w-[450px] animate-pulse">
          <div className="h-8 w-1/3 bg-white/20 rounded mb-4" />
          <div className="h-3 w-2/3 bg-white/20 rounded mb-4" />
          <div className="space-y-4">
            <div className="h-5 w-16 bg-white/10 rounded" />
            <div className="h-10 w-full bg-white/10 rounded" />
            <div className="h-5 w-16 bg-white/10 rounded" />
            <div className="h-10 w-full bg-white/10 rounded" />
            <div className="h-10 w-full bg-white/10 rounded mt-4" />
            <div className="h-2 w-1/2 bg-white/10 rounded mt-4" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amaranth flex items-center justify-center px-4">
      <motion.div
        className="bg-night/80 border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-2xl"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 20 }}
      >
        <h1 className="text-2xl font-bold text-white mb-1">Profile</h1>
        <p className="text-sm text-white/70 mb-4">
          Manage your account information.
        </p>

        {serverError && (
          <p className="mb-4 text-sm text-red-500 bg-red-100/80 px-3 py-2 rounded-lg">
            {serverError}
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <div>
            <label className="block text-sm font-semibold text-white mb-1">
              Name
            </label>
            <input
              className={`w-full px-4 py-2.5 rounded-xl bg-night/60 border text-white focus:outline-none focus:ring-2 focus:ring-coral ${
                errors.name ? "border-red-500" : "border-white/20"
              }`}
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-400">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-1">
              Email
            </label>
            <input
              type="email"
              className={`w-full px-4 py-2.5 rounded-xl bg-night/60 border text-white focus:outline-none focus:ring-2 focus:ring-coral ${
                errors.email ? "border-red-500" : "border-white/20"
              }`}
              {...register("email", {
                required: "Email is required",
              })}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-4 w-full py-2.5 rounded-xl bg-coral text-night font-semibold hover:brightness-110 disabled:opacity-70 transition"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>

        {auth?.user && (
          <p className="mt-4 text-xs text-white/50">
            last updated at:{" "}
            {new Date(updatedUserDetails ? updatedUserDetails.updatedAt : auth.user.updatedAt || "").toLocaleString()}
          </p>
        )}
      </motion.div>
    </div>
  );
}
