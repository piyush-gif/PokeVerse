import { useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import { useNavigate, Navigate, Link } from "react-router-dom";
import useAuthStore from "./store/authStore";

const Register = () => {
  const { user } = useAuthStore();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    checkpassword: "",
  });
  const navigate = useNavigate();
  const { data, loading, error, setError, handlePost } = useFetch();

  useEffect(() => {
    if (data?.message) {
      navigate("/login");
    }
  }, [data]);

  if (user) return <Navigate to="/" />;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validation = () => {
    if (!form.username.trim()) {
      setError("Username required");
      return false;
    }
    if (!form.email.includes("@")) {
      setError("Invalid email");
      return false;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    if (form.password !== form.checkpassword) {
      setError("Passwords don't match");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validation()) return;
    handlePost("http://localhost:8000/register", {
      username: form.username,
      email: form.email,
      password: form.password,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-red-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md z-10">
        <div className="bg-[#181826] border border-[#474754]/15 rounded-xl overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="p-8 pb-4 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#1e1e2d] border border-red-500/20 mb-6 hover:scale-110 transition-all duration-500">
              <span className="material-symbols-outlined text-red-400 text-3xl">
                person_add
              </span>
            </div>
            <h2 className="font-headline text-3xl font-bold tracking-tight text-white mb-2">
              Create Account
            </h2>
            <p className="font-body text-[#aba9b9] text-sm">
              Join the PokéVerse Kinetic Archive
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm font-body">
                {error}
              </div>
            )}

            {/* Username */}
            <div className="space-y-1.5">
              <label className="font-label text-[10px] uppercase tracking-widest text-[#aba9b9] ml-1 font-bold">
                Trainer Name
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#aba9b9] text-lg group-focus-within:text-red-400 transition-colors">
                  badge
                </span>
                <input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="e.g. Red_Kanto"
                  className="w-full bg-[#12121e] ring-1 ring-[#474754]/30 rounded-lg py-3.5 pl-12 pr-4 text-white placeholder-[#474754] focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all font-body text-sm"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="font-label text-[10px] uppercase tracking-widest text-[#aba9b9] ml-1 font-bold">
                Network ID (Email)
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#aba9b9] text-lg group-focus-within:text-red-400 transition-colors">
                  mail
                </span>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="trainer@poke-verse.io"
                  type="email"
                  className="w-full bg-[#12121e] ring-1 ring-[#474754]/30 rounded-lg py-3.5 pl-12 pr-4 text-white placeholder-[#474754] focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all font-body text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="font-label text-[10px] uppercase tracking-widest text-[#aba9b9] ml-1 font-bold">
                Access Key
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#aba9b9] text-lg group-focus-within:text-red-400 transition-colors">
                  lock
                </span>
                <input
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  type="password"
                  className="w-full bg-[#12121e] ring-1 ring-[#474754]/30 rounded-lg py-3.5 pl-12 pr-4 text-white placeholder-[#474754] focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all font-body text-sm"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="font-label text-[10px] uppercase tracking-widest text-[#aba9b9] ml-1 font-bold">
                Confirm Access Key
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#aba9b9] text-lg group-focus-within:text-red-400 transition-colors">
                  key
                </span>
                <input
                  name="checkpassword"
                  value={form.checkpassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  type="password"
                  className="w-full bg-[#12121e] ring-1 ring-[#474754]/30 rounded-lg py-3.5 pl-12 pr-4 text-white placeholder-[#474754] focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all font-body text-sm"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-br from-red-500 to-red-600 text-white font-headline font-bold py-4 rounded-lg shadow-lg hover:shadow-red-500/20 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 group mt-2 disabled:opacity-50"
            >
              {loading ? "Initializing..." : "Initialize Training Data"}
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>
          </form>

          {/* Footer */}
          <div className="p-6 bg-[#12121e] border-t border-[#474754]/10 text-center">
            <p className="text-sm font-body text-[#aba9b9]">
              Already synchronized?{" "}
              <Link
                to="/login"
                className="text-red-400 font-bold hover:text-red-300 transition-colors ml-1 uppercase font-label text-xs tracking-wider"
              >
                Access Archive
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
