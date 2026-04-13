import { useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import { useNavigate, Navigate, Link } from "react-router-dom";
import useAuthStore from "./store/authStore";

const LoginPage = () => {
  const { user, setUser } = useAuthStore();
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();
  const { data, loading, error, setError, handlePost } = useFetch();

  useEffect(() => {
    if (data?.access_token) {
      setUser({ username: form.username });
      navigate("/");
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
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validation()) return;
    handlePost("http://localhost:8000/login", {
      username: form.username,
      password: form.password,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md z-10">
        {/* Header */}
        <div className="flex justify-between items-end mb-6 px-2">
          <div>
            <span className="font-label text-[10px] uppercase tracking-[0.2em] text-[#aba9b9] font-bold">
              Protocol
            </span>
            <h2 className="font-headline text-4xl font-bold tracking-tight text-white leading-none">
              LOGIN
            </h2>
          </div>
          <div className="text-right">
            <span className="font-label text-[10px] uppercase tracking-[0.2em] text-[#aba9b9] font-bold">
              Terminal
            </span>
            <p className="font-label text-xs text-red-400 font-mono tracking-tighter">
              KV-992-ARC
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#1e1e2d] rounded-xl p-8 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.6)] relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />

          <form onSubmit={handleSubmit} className="space-y-6 relative">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm font-body">
                {error}
              </div>
            )}

            {/* Username */}
            <div className="space-y-1.5 group">
              <label className="font-label text-[10px] uppercase tracking-widest text-[#aba9b9] font-bold ml-1">
                Archive ID
              </label>
              <div className="relative flex items-center bg-[#242434] rounded-lg transition-all duration-300 focus-within:bg-[#2b2a3c] focus-within:shadow-[0_0_0_2px_rgba(255,141,140,0.2)]">
                <span className="material-symbols-outlined absolute left-4 text-[#aba9b9] group-focus-within:text-red-400 transition-colors text-lg">
                  person
                </span>
                <input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="TRAINER_NAME"
                  className="w-full bg-transparent border-none py-4 pl-12 pr-4 text-white placeholder-[#474754] focus:outline-none font-body font-medium"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5 group">
              <div className="flex justify-between items-center ml-1">
                <label className="font-label text-[10px] uppercase tracking-widest text-[#aba9b9] font-bold">
                  Encrypted Key
                </label>
              </div>
              <div className="relative flex items-center bg-[#242434] rounded-lg transition-all duration-300 focus-within:bg-[#2b2a3c] focus-within:shadow-[0_0_0_2px_rgba(255,141,140,0.2)]">
                <span className="material-symbols-outlined absolute left-4 text-[#aba9b9] group-focus-within:text-red-400 transition-colors text-lg">
                  lock
                </span>
                <input
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  type="password"
                  className="w-full bg-transparent border-none py-4 pl-12 pr-4 text-white placeholder-[#474754] focus:outline-none font-body font-medium"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-br from-red-400 to-red-600 text-white py-4 rounded-lg font-headline font-bold uppercase tracking-widest text-sm shadow-[0_8px_20px_rgba(255,141,140,0.25)] hover:shadow-[0_12px_28px_rgba(255,141,140,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50"
              >
                {loading ? "Establishing..." : "Establish Link"}
              </button>
            </div>

            {/* Register link */}
            <div className="text-center pt-2">
              <p className="font-body text-sm text-[#aba9b9]">
                New to the Archive?{" "}
                <Link
                  to="/register"
                  className="text-red-400 font-bold hover:underline underline-offset-4 ml-1 transition-all"
                >
                  Register Terminal
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Kinetic bottom decoration */}
        <div className="mt-8 grid grid-cols-3 gap-4 opacity-40">
          <div className="h-[2px] bg-[#474754] relative">
            <div className="absolute left-0 top-0 h-full w-1/3 bg-red-400" />
          </div>
          <div className="h-[2px] bg-[#474754] relative">
            <div className="absolute left-0 top-0 h-full w-2/3 bg-red-400" />
          </div>
          <div className="h-[2px] bg-[#474754] relative">
            <div className="absolute right-0 top-0 h-full w-1/4 bg-red-400" />
          </div>
        </div>
        <div className="flex justify-between mt-2 font-label text-[8px] uppercase tracking-widest text-[#474754] font-bold">
          <span>Core.v4.0.1</span>
          <span>Signal Stable</span>
          <span>Encrypted 256-bit</span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
