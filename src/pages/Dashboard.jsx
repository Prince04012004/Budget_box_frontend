import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiClock, FiLogOut, FiTrendingUp, FiPieChart, FiBarChart2, FiHome } from "react-icons/fi";
import API from "../services/api.js";

const Dashboard = () => {
  const [data, setdata] = useState({ remainingbudget: {}, todayexpenses: 0, totalexpenses: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const res = await API.get("/dashboard");
        setdata(res.data);
      } catch (err) {
        console.log("Error fetching data:", err);
      }
    };
    fetchdata();
  }, []);

  const totalRemaining = data?.remainingbudget
    ? Object.values(data.remainingbudget).reduce((acc, val) => acc + val, 0)
    : 0;

  return (
    <div className="min-h-screen bg-[#0a0a14] bg-gradient-to-br from-[#0a0a14] via-[#1a1a3a] to-[#0a0a14] text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      
      {/* Dynamic Background Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-indigo-600/10 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-purple-600/10 rounded-full blur-[70px] md:blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto p-4 md:p-10 relative z-10">
        
        {/* RESPONSIVE HEADER */}
        <header className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-8 md:mb-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 cursor-pointer group"
            onClick={() => navigate("/")}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-40 group-hover:opacity-70 transition-opacity" />
              <div className="relative w-10 h-10 md:w-12 md:h-12 bg-gradient-to-tr from-indigo-600 via-purple-600 to-blue-500 rounded-xl md:rounded-2xl flex items-center justify-center shadow-2xl border border-white/20 transform group-hover:rotate-12 transition-transform duration-300">
                <FiTrendingUp className="text-white text-xl md:text-2xl" />
              </div>
            </div>
            
            <div className="flex flex-col">
              <h1 className="text-xl md:text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-slate-500">
                BUDGETBOX
              </h1>
              <span className="text-[7px] md:text-[8px] font-black tracking-[0.3em] text-indigo-500 uppercase">Pro Analytics</span>
            </div>
          </motion.div>
          
          <div className="flex items-center gap-2 md:gap-3 w-full sm:w-auto justify-center">
            <button 
              onClick={() => navigate("/")}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-[10px] font-bold text-slate-400 hover:text-white bg-white/5 border border-white/10 rounded-xl transition-all"
            >
              <FiHome /> HOME
            </button>

            <button 
              onClick={() => { localStorage.removeItem("token"); navigate("/login"); }} 
              className="flex-1 sm:flex-none group flex items-center justify-center gap-2 px-4 py-2 text-[10px] font-bold text-slate-400 hover:text-white bg-white/5 border border-white/10 rounded-xl transition-all hover:bg-rose-500/10"
            >
              <FiLogOut className="group-hover:text-rose-500 transition-colors" /> SIGN OUT
            </button>
          </div>
        </header>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          
          {/* BALANCE CARD (RESPONSIVE TEXT) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-1 md:col-span-2 relative overflow-hidden bg-gradient-to-br from-[#1a1a3a] to-[#252550] border border-white/10 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-2xl shadow-black/40 group"
          >
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2 text-indigo-300">
                <FiPieChart className="text-xs" />
                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]">Remaining Balance</p>
              </div>
              <h2 className={`text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tighter mb-8 md:mb-10 tabular-nums break-words ${totalRemaining < 0 ? 'text-rose-500' : 'text-white'}`}>
                {totalRemaining < 0 ? `-₹${Math.abs(totalRemaining).toLocaleString()}` : `₹${totalRemaining.toLocaleString()}`}
              </h2>
              
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 md:gap-3">
                <button 
                  onClick={() => navigate("/addtransaction")} 
                  className="flex items-center justify-center gap-2 bg-white text-indigo-900 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-[10px] md:text-xs hover:scale-105 transition-all shadow-xl"
                >
                  <FiPlus strokeWidth={3} /> NEW
                </button>

                <button 
                  onClick={() => navigate("/checkgraph")}
                  className="flex items-center justify-center gap-2 bg-indigo-500 text-white px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-[10px] md:text-xs hover:scale-105 transition-all"
                >
                  <FiBarChart2 /> GRAPHS
                </button>

                <button 
                  onClick={() => navigate("/viewanddelete")}
                  className="col-span-2 sm:col-auto flex items-center justify-center gap-2 bg-indigo-900/40 backdrop-blur-md text-white border border-white/10 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-[10px] md:text-xs hover:bg-indigo-900/60 transition-all"
                >
                  <FiClock /> HISTORY
                </button>
              </div>
            </div>
          </motion.div>

          {/* TODAY'S SPEND CARD */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 flex flex-col justify-between shadow-xl"
          >
            <div>
              <p className="text-[9px] md:text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] mb-2">Today's Spend</p>
              <h3 className="text-3xl md:text-4xl font-bold text-white tabular-nums">₹{data.todayexpenses.toLocaleString()}</h3>
            </div>
            
            <div className="mt-6 md:mt-0">
              <div className="flex justify-between text-[8px] font-bold text-slate-500 mb-2 uppercase tracking-widest">
                <span>Usage</span>
                <span>Limit</span>
              </div>
              <div className="h-1.5 md:h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                <motion.div 
                   initial={{ width: 0 }} animate={{ width: "65%" }}
                   className="h-full bg-gradient-to-r from-rose-500 to-purple-500 rounded-full" 
                />
              </div>
            </div>
          </motion.div>

          {/* CATEGORY BREAKDOWN HEADER */}
          <div className="col-span-1 md:col-span-3 mt-6 md:mt-10 mb-2 px-2">
            <h3 className="text-[10px] md:text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">Category Breakdown</h3>
          </div>

          {/* RESPONSIVE CATEGORY CARDS */}
          {Object.entries(data.remainingbudget).length > 0 ? (
            Object.entries(data.remainingbudget).map(([key, value], index) => (
              <motion.div 
                key={key}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className={`bg-[#16162a]/60 backdrop-blur-sm border rounded-2xl md:rounded-3xl p-5 md:p-6 transition-all ${value < 0 ? 'border-rose-500/30' : 'border-white/5'}`}
              >
                <div className="flex justify-between items-center mb-3 md:mb-4">
                  <span className="text-[9px] md:text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{key}</span>
                  <div className={`h-1.5 w-1.5 rounded-full ${value < 0 ? 'bg-rose-500 animate-pulse' : 'bg-emerald-400'}`} />
                </div>
                <h4 className={`text-xl md:text-2xl font-bold tabular-nums ${value < 0 ? 'text-rose-500' : 'text-white'}`}>
                  {value < 0 ? `-₹${Math.abs(value).toLocaleString()}` : `₹${value.toLocaleString()}`}
                </h4>
              </motion.div>
            ))
          ) : (
            <div className="col-span-1 md:col-span-3 py-12 md:py-16 bg-white/5 border border-dashed border-white/10 rounded-[2rem] flex flex-col items-center justify-center text-slate-500 text-center">
              <FiPieChart className="text-2xl md:text-3xl mb-3 opacity-20" />
              <p className="text-[9px] font-bold tracking-[0.2em] uppercase opacity-40">No Transactions Found</p>
            </div>
          )}

        </div>

        <footer className="mt-16 md:mt-24 pb-8 text-center px-4">
          <p className="text-[8px] md:text-[9px] font-bold text-slate-600 tracking-[0.4em] md:tracking-[0.5em] uppercase">
            © 2026 BudgetBox Premium v2.5 • Responsive UI
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;