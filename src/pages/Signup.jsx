import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiLock, FiDollarSign, FiArrowRight } from "react-icons/fi"; 
import API from "../services/api";
import toast from "react-hot-toast"; // Added for better alerts

const Signup = () => {
  const navigate = useNavigate();
  const [showMoney, setShowMoney] = useState(false);

  // Logic intact: saree fields wahi hain
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    monthlyincome: "",
    selectedtune: "alert1",
    role: "user",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowMoney(true);

    setTimeout(() => {
      setShowMoney(false);
    }, 1500);

    try {
      const res = await API.post("/signup", formData);
      localStorage.setItem("token", res.data.token);
      toast.success("Account Created! 💸");

      setTimeout(() => {
        navigate("/addtransaction");
      }, 1200);

    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0a0a14] bg-gradient-to-br from-[#0a0a14] via-[#1a1a3a] to-[#0a0a14] overflow-hidden font-sans p-4">
      
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-indigo-600/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[100px] pointer-events-none" />

      {/* 💰 Money Rain Logic same rkha h */}
      {showMoney &&
        Array.from({ length: 25 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 800, opacity: 1 }}
            transition={{ duration: 1.5, delay: i * 0.05 }}
            className="absolute text-2xl z-50"
            style={{ left: `${Math.random() * 100}%` }}
          >
            💰
          </motion.div>
        ))}

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-[440px]"
      >
        {/* Header Section */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/30 mb-4">
            <FiUser className="text-white text-2xl" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Join BudgetBox</h2>
          <p className="text-slate-400 mt-1 text-xs uppercase tracking-widest font-bold">Start your journey to freedom</p>
        </div>

        {/* Signup Card - Glassmorphism */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-[2.5rem] p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="relative">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-3.5 bg-white/5 text-white border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600 text-sm"
              />
            </div>

            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-3.5 bg-white/5 text-white border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600 text-sm"
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
                className="w-full pl-12 pr-4 py-3.5 bg-white/5 text-white border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600 text-sm"
              />
            </div>

            <div className="relative">
              <FiDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="number"
                name="monthlyincome"
                placeholder="Monthly Income (₹)"
                value={formData.monthlyincome}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-3.5 bg-white/5 text-white border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600 text-sm"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2 group transition-all mt-4"
            >
              CREATE ACCOUNT
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-slate-400 text-xs font-medium">
              Already have an account?{" "}
              <Link to="/login" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">
                Login
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-8 text-center text-[9px] font-bold text-slate-600 tracking-[0.4em] uppercase">
          BudgetBox • Premium Finance System
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;