import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  FiPlus, FiClock, FiLogOut, FiTrendingUp, FiPieChart, 
  FiBarChart2, FiHome, FiEdit2, FiCheck, FiX, FiCreditCard, FiZap
} from "react-icons/fi";
import API from "../services/api.js";
import toast from "react-hot-toast";
import walletSound from "../audios/walletmoneysound.mp3";

const Dashboard = () => {
  const [data, setdata] = useState({ remainingbudget: {}, todayexpenses: 0, totalexpenses: 0, monthlyincome: 0, wallet: 0, savingsToday: 0, lastAnimTime: "" });
  const [isEditingIncome, setIsEditingIncome] = useState(false);
  const [newIncome, setNewIncome] = useState("");
  const [updating, setUpdating] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [isCollecting, setIsCollecting] = useState(false);
  
  const walletRef = useRef(null);
  const navigate = useNavigate();
  const [targetPos, setTargetPos] = useState({ x: 0, y: 0 });

  // Function to get data from Backend
  const fetchdata = async () => {
    try {
      const res = await API.get("/dashboard");
      const { savingsToday, lastAnimTime, monthlyincome } = res.data;
      
      const previousAnimTime = localStorage.getItem("lastProcessedAnim");

      if (!previousAnimTime) {
        localStorage.setItem("lastProcessedAnim", lastAnimTime || "initial_sync");
        setShowAnimation(false);
      } 
      else if (savingsToday > 0 && lastAnimTime && lastAnimTime !== previousAnimTime) {
        setShowAnimation(true);
      }

      setdata(res.data);
      setNewIncome(monthlyincome);
    } catch (err) { console.log("Error fetching data:", err); }
  };

  useEffect(() => {
    fetchdata();
    const interval = setInterval(fetchdata, 60000);
    return () => clearInterval(interval);
  }, []);

  // When user clicks "Collect Now"
  const handleCollect = () => {
    if (walletRef.current) {
      const rect = walletRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2 - window.innerWidth / 2;
      const centerY = rect.top + rect.height / 2 - window.innerHeight / 2;
      setTargetPos({ x: centerX, y: centerY });
    }

    const sound = new Audio(walletSound);
    sound.volume = 0.4;
    sound.play().catch(() => {});
    setIsCollecting(true);
    
    setTimeout(() => {
      setShowAnimation(false);
      setIsCollecting(false);
      
      // 1. Mark this animation as seen in local storage
      localStorage.setItem("lastProcessedAnim", data.lastAnimTime);
      
      // 2. 🔥 REFRESH DATA FROM BACKEND: This ensures the refill shows up on screen
      fetchdata(); 
      
      toast.success("Added to Wallet! 💰");
    }, 1500);
  };

  const handleUpdateIncome = async () => {
    if (!newIncome || newIncome <= 0) return toast.error("Enter valid income");
    setUpdating(true);
    try {
      await API.put("/updatemonthlyincome", { monthlyincome: newIncome });
      toast.success("Income Updated!");
      setIsEditingIncome(false);
      fetchdata();
    } catch (err) {
      toast.error("Update failed");
    } finally { setUpdating(false); }
  };

  const totalRemaining = Object.values(data.remainingbudget || {}).reduce((a, b) => a + b, 0);
  const dailyLimit = data.monthlyincome / 30;
  const isOverBudget = data.todayexpenses > dailyLimit;

  return (
    <div className="min-h-screen bg-[#0a0a14] text-white font-sans overflow-x-hidden pb-20">
      
      <AnimatePresence>
        {showAnimation && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center">
            <div className="relative w-40 h-40 flex items-center justify-center mb-8">
              <motion.div animate={isCollecting ? { scale: [1, 0.9, 1.1, 1] } : {}} className="w-28 h-28 bg-indigo-600 rounded-[2rem] z-10 border-b-4 border-indigo-900 shadow-2xl" />
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isCollecting ? { 
                    x: [0, (Math.random() - 0.5) * (window.innerWidth < 640 ? 150 : 300), targetPos.x], 
                    y: [0, -250, targetPos.y], 
                    scale: [0, 1.2, 0.2], opacity: [1, 1, 0]
                  } : { opacity: 1, scale: 1, y: [0, -10, 0] }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: i * 0.05 }}
                  className="absolute w-8 h-8 bg-yellow-500 rounded-full border-2 border-yellow-700 flex items-center justify-center text-yellow-900 font-bold z-50 shadow-lg"
                >₹</motion.div>
              ))}
            </div>
            <h2 className="text-3xl md:text-5xl font-black mb-1 uppercase tracking-tighter text-yellow-500 italic">Savings Blast!</h2>
            <p className="text-indigo-200 text-xl md:text-3xl font-bold mb-8">₹{data.savingsToday.toLocaleString()}</p>
            <button onClick={handleCollect} className="w-full max-w-xs py-4 bg-emerald-500 text-white font-black rounded-2xl shadow-xl uppercase tracking-widest active:scale-95 transition-all">Collect Now 💰</button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-10">
        <header className="flex justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg"><FiTrendingUp className="text-white text-xl" /></div>
            <h1 className="text-xl font-black tracking-tighter uppercase italic hidden sm:block">BUDGETBOX</h1>
          </div>
          <div className="flex items-center gap-2">
            <motion.div ref={walletRef} className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 md:px-5 md:py-2.5 rounded-xl">
               <FiCreditCard className="text-emerald-400 text-sm md:text-base" />
               <span className="text-sm md:text-base font-black text-emerald-400">₹{data.wallet?.toLocaleString()}</span>
            </motion.div>
            <button onClick={() => { localStorage.removeItem("token"); navigate("/login"); }} className="p-2 md:p-3 text-slate-400 bg-white/5 border border-white/10 rounded-xl hover:text-rose-400 transition-colors"><FiLogOut /></button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-[#1a1a3a] to-[#11112b] border border-white/10 rounded-[2.5rem] p-6 md:p-10 shadow-2xl relative overflow-hidden">
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Available Funds</p>
            <h2 className={`text-5xl md:text-7xl font-black tracking-tighter mb-10 ${totalRemaining < 0 ? 'text-rose-500' : 'text-white'}`}>₹{totalRemaining.toLocaleString()}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button onClick={() => navigate("/addtransaction")} className="bg-white text-indigo-900 py-4 rounded-2xl font-black text-xs uppercase italic flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg"><FiPlus strokeWidth={4} /> New Spend</button>
              <button onClick={() => navigate("/checkgraph")} className="bg-indigo-600 text-white py-4 rounded-2xl font-black text-xs uppercase italic flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg"><FiBarChart2 /> Analytics</button>
              <button onClick={() => navigate("/viewanddelete")} className="sm:col-span-2 bg-white/5 text-slate-400 border border-white/10 py-4 rounded-2xl font-black text-xs uppercase italic flex items-center justify-center gap-2 hover:bg-white/10 transition-all"><FiClock /> Transaction History</button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={`rounded-[2.5rem] p-6 md:p-8 flex flex-col justify-between border ${isOverBudget ? 'bg-rose-900/20 border-rose-500/30' : 'bg-[#1a1a3a] border-white/10'}`}>
            <div className="flex justify-between items-center mb-6">
              <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">Today's Usage</p>
              {isOverBudget && <span className="text-[8px] bg-rose-500 text-white px-2 py-1 rounded font-black tracking-tighter">BUDGET EXCEEDED</span>}
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <h3 className="text-4xl font-black text-white italic">₹{data.todayexpenses.toLocaleString()}</h3>
                <span className="text-[10px] text-white/30 font-bold uppercase tracking-tighter">/ ₹{Math.round(dailyLimit).toLocaleString()}</span>
              </div>
              <div className="mt-4 h-2.5 w-full bg-black/40 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min((data.todayexpenses / (dailyLimit || 1)) * 100, 100)}%` }} className={`h-full ${isOverBudget ? 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]' : 'bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]'}`} />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-4 bg-[#1a1a3a]/50 border border-white/5 p-4 rounded-2xl flex items-center justify-between">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><FiPieChart /> Monthly Goal</span>
          <div className="flex items-center gap-3">
            {isEditingIncome ? (
              <input type="number" value={newIncome} onChange={(e) => setNewIncome(e.target.value)} className="bg-transparent border-b border-indigo-500 text-right font-black w-20 outline-none text-indigo-400" autoFocus />
            ) : (
              <span className="font-black text-indigo-300">₹{data.monthlyincome?.toLocaleString()}</span>
            )}
            <button onClick={isEditingIncome ? handleUpdateIncome : () => setIsEditingIncome(true)} className="p-1.5 bg-indigo-500 text-white rounded-lg active:scale-90 transition-transform">
              {updating ? "..." : isEditingIncome ? <FiCheck /> : <FiEdit2 size={12} />}
            </button>
          </div>
        </div>

        <div className="mt-10">
          <div className="flex items-center gap-3 mb-6">
            <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] italic shrink-0">Daily Breakdown</h3>
            <div className="h-px w-full bg-white/5" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
             {Object.entries(data.remainingbudget || {}).map(([key, value]) => (
               <div key={key} className="bg-[#1a1a3a] border border-white/5 rounded-2xl p-5 hover:border-indigo-500/30 transition-all">
                  <p className="text-[9px] font-black text-indigo-400 uppercase mb-2 flex items-center gap-1"><FiZap size={8}/> {key}</p>
                  <h4 className={`text-xl font-black tracking-tight ${value < 0 ? 'text-rose-500' : 'text-white'}`}>₹{value.toLocaleString()}</h4>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;