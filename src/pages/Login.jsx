import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi"; // Premium Icons
import API from "../services/api";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const [showMoney, setShowMoney] = useState(false);
  const [formData, setData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    setShowMoney(true);
    setTimeout(() => setShowMoney(false), 1500);

    try {
      const res = await API.post("/login", formData);
      if (res?.data?.token) {
        localStorage.setItem("token", res.data.token);
        toast.success("Welcome Back! 🎉");
        setTimeout(() => navigate("/dashboard"), 1000);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed ❌");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0a0a14] bg-gradient-to-br from-[#0a0a14] via-[#1a1a3a] to-[#0a0a14] overflow-hidden font-sans">
      
      {/* Background Decorative Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Falling Money Animation Logic same rkha h */}
      {showMoney &&
        Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 800, opacity: 1 }}
            transition={{ duration: 1.5, delay: i * 0.05 }}
            className="absolute text-3xl z-50"
            style={{ left: `${Math.random() * 100}%` }}
          >
            💰
          </motion.div>
        ))
      }

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md px-6"
      >
        {/* Logo/Icon Area like in the image */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/40 mb-4">
            <FiLock className="text-white text-3xl" />
          </div>
          <h2 className="text-4xl font-extrabold text-white tracking-tight">BudgetBox</h2>
          <p className="text-slate-400 mt-2 text-sm">Take Control of Your Money</p>
        </div>

        {/* Login Card - Glassmorphism */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-[2.5rem] p-10">
          <form onSubmit={handlesubmit} className="space-y-5">
            
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-4 bg-white/5 text-white border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
              />
            </div>

            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-4 bg-white/5 text-white border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2 group transition-all"
            >
              Log In 
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-slate-400 text-sm">
              New to BudgetBox?{" "}
              <Link to="/signup" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">
                Create Account
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-10 text-center text-[10px] font-bold text-slate-600 tracking-[0.3em] uppercase">
          SECURE ENCRYPTED ACCESS
        </p>
      </motion.div>
    </div>
  );
};

export default Login;