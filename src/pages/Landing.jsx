import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiTrendingUp, FiShield, FiZap, FiLayout } from "react-icons/fi";
import API from "../services/api.js";

const Landing = () => {
  const navigate = useNavigate();
  const [userCount, setUserCount] = useState(2000);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if token exists to see if user is logged in
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }

    const fetchUserCount = async () => {
      try {
        const res = await API.get("/getusercount");
        setUserCount(res.data.usercount);
      } catch (err) {
        console.log("Using default user count");
      }
    };
    fetchUserCount();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a14] bg-gradient-to-br from-[#0a0a14] via-[#1a1a3a] to-[#0a0a14] text-white overflow-x-hidden relative">
      
      {/* Background Decorative Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-indigo-600/10 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-purple-600/10 rounded-full blur-[70px] md:blur-[100px] pointer-events-none" />

      {/* Navbar Minimal */}
      <nav className="relative z-10 flex justify-between items-center p-6 md:p-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <FiTrendingUp className="text-white" />
          </div>
          <span className="font-bold tracking-tighter text-lg md:text-xl text-white">BudgetBox</span>
        </div>
        
        {/* Navbar Button: Conditional Rendering */}
        {isLoggedIn ? (
          <button 
            onClick={() => navigate("/dashboard")}
            className="text-sm font-bold text-indigo-400 hover:text-white transition-colors flex items-center gap-2"
          >
            DASHBOARD <FiArrowRight />
          </button>
        ) : (
          <button 
            onClick={() => navigate("/login")}
            className="text-sm font-bold text-slate-400 hover:text-white transition-colors"
          >
            LOG IN
          </button>
        )}
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 pt-12 md:pt-20 pb-20 flex flex-col items-center text-center">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black tracking-[0.2em] uppercase mb-6 inline-block">
            Smart Finance Management
          </span>
          
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.1] md:leading-[0.9]">
            Master Your <br className="hidden md:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400">
              Money Flow.
            </span>
          </h1>
          
          <p className="max-w-xl mx-auto text-slate-400 text-base md:text-lg mb-12 font-medium leading-relaxed">
            Take control of your expenses with BudgetBox. A premium, minimalist 
            experience designed for high-performers to track every penny.
          </p>

          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            {/* Main CTA: Conditional Rendering */}
            {isLoggedIn ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/dashboard")}
                className="w-full md:w-auto px-10 py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-indigo-500/20 flex items-center justify-center gap-3 group"
              >
                GO TO DASHBOARD
                <FiLayout className="group-hover:rotate-12 transition-transform" />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/signup")}
                className="w-full md:w-auto px-10 py-5 bg-white text-indigo-900 rounded-[2rem] font-black text-lg shadow-2xl shadow-white/10 flex items-center justify-center gap-3 group"
              >
                GET STARTED
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            )}
            
            <div className="flex flex-col items-center md:items-start gap-2">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0a0a14] bg-slate-800 flex items-center justify-center overflow-hidden">
                     <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" />
                  </div>
                ))}
              </div>
              <div className="text-xs text-slate-500 font-bold">
                +{userCount.toLocaleString()} active users
              </div>
            </div>
          </div>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 md:mt-32 w-full"
        >
          <div className="p-8 rounded-[2rem] bg-white/5 border border-white/5 text-left">
            <FiZap className="text-indigo-400 text-2xl mb-4" />
            <h3 className="font-bold text-lg mb-2">Real-time Sync</h3>
            <p className="text-slate-500 text-sm">Every transaction is synced instantly across all your devices.</p>
          </div>
          <div className="p-8 rounded-[2rem] bg-white/5 border border-white/5 text-left">
            <FiShield className="text-purple-400 text-2xl mb-4" />
            <h3 className="font-bold text-lg mb-2">Secure Vault</h3>
            <p className="text-slate-500 text-sm">Military-grade encryption for your sensitive financial data.</p>
          </div>
          <div className="p-8 rounded-[2rem] bg-white/5 border border-white/5 text-left text-indigo-300">
             <div className="text-3xl font-black mb-1 italic tabular-nums">99.9%</div>
             <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Accuracy Guaranteed</p>
          </div>
        </motion.div>
      </main>

      <div className="absolute bottom-[-20%] left-1/2 -translate-x-1/2 w-[150%] md:w-[1000px] h-[400px] md:h-[600px] bg-indigo-600/5 rounded-[100%] blur-[100px] md:blur-[120px] pointer-events-none" />
    </div>
  );
};

export default Landing;