import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiUser, FiMail, FiLock, FiDollarSign, FiArrowRight, FiShield } from "react-icons/fi"; 
import API from "../services/api";
import toast from "react-hot-toast";

const Signup = () => {
  const navigate = useNavigate();
  const [showMoney, setShowMoney] = useState(false);
  const [step, setStep] = useState(1); 
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    monthlyincome: "",
    otp: "",
    selectedtune: "alert1",
    role: "user",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/sendotp", { email: formData.email });
      toast.success(res.data.message || "OTP Sent to Email! 📧");
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setShowMoney(true);
    setTimeout(() => setShowMoney(false), 1500);

    try {
      const res = await API.post("/signup", formData);
      localStorage.setItem("token", res.data.token);
      toast.success("Account Created! 💸");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1200);
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0a0a14] bg-gradient-to-br from-[#0a0a14] via-[#1a1a3a] to-[#0a0a14] overflow-hidden font-sans p-4">
      
      <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-indigo-600/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[100px] pointer-events-none" />

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
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/30 mb-4">
            <FiUser className="text-white text-2xl" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            {step === 1 ? "Join BudgetBox" : "Verify Email"}
          </h2>
          <p className="text-slate-400 mt-1 text-xs uppercase tracking-widest font-bold text-center">
            {step === 1 ? "Start your journey to freedom" : `Enter code sent to ${formData.email}`}
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-[2.5rem] p-8 md:p-10">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.form 
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleSendOtp} 
                className="space-y-4"
              >
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
                  disabled={loading}
                  type="submit"
                  className={`w-full py-4 rounded-2xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 group transition-all mt-4 ${
                    loading ? "bg-slate-700 cursor-not-allowed" : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                  }`}
                >
                  {loading ? "SENDING..." : "SEND OTP"}
                  {!loading && <FiArrowRight className="group-hover:translate-x-1 transition-transform" />}
                </motion.button>
              </motion.form>
            ) : (
              <motion.form 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleFinalSignup} 
                className="space-y-4"
              >
                <div className="relative">
                  <FiShield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    name="otp"
                    placeholder="6-Digit OTP"
                    value={formData.otp}
                    onChange={handleChange}
                    required
                    maxLength={6}
                    className="w-full pl-12 pr-4 py-3.5 bg-white/5 text-white border border-white/10 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none transition-all placeholder:text-slate-600 text-center text-xl tracking-[0.5em] font-bold"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                  type="submit"
                  className={`w-full py-4 rounded-2xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 group transition-all mt-4 ${
                    loading ? "bg-slate-700 cursor-not-allowed" : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                  }`}
                >
                  {loading ? "VERIFYING..." : "VERIFY & CREATE"}
                  {!loading && <FiArrowRight className="group-hover:translate-x-1 transition-transform" />}
                </motion.button>

                <button 
                  type="button" 
                  onClick={() => setStep(1)}
                  className="w-full text-slate-500 text-[10px] font-bold uppercase tracking-wider hover:text-slate-300 transition-colors mt-2"
                >
                  ← Edit Details
                </button>
              </motion.form>
            )}
          </AnimatePresence>

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