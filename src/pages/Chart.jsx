import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import API from "../services/api.js";

const CheckGraph = () => {
  const [graphData, setGraphData] = useState({});
  const [dailyLimit, setDailyLimit] = useState({});
  const [showPie, setShowPie] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGraph = async () => {
      try {
        const res = await API.get("/checkgraph");
        setGraphData(res.data.graphdata || {});
        setDailyLimit(res.data.dailylimit || {});
      } catch (err) { console.log("Error:", err); }
    };
    fetchGraph();
  }, []);

  const categories = ["food", "travelling", "others"];
  const chartData = categories.map(cat => ({
    name: cat.toUpperCase(),
    Spent: Number(graphData[cat]) || 0,
    Limit: Number(dailyLimit[cat]) || 0,
  }));

  const COLORS = ["#6366f1", "#a855f7", "#ec4899"];

  return (
    <div className="min-h-screen bg-[#0a0a14] text-white p-4 sm:p-6 md:p-10 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      <div className="max-w-6xl mx-auto">
        
        {/* Header - Mobile friendly toggle */}
        <header className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-8 sm:mb-12">
          <button onClick={() => navigate(-1)} className="self-start p-3 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition shadow-xl">
            <FiArrowLeft size={20} />
          </button>

          <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md w-full sm:w-auto">
            <button 
              onClick={() => setShowPie(false)}
              className={`flex-1 sm:flex-none px-6 md:px-8 py-2.5 rounded-xl text-[10px] sm:text-xs font-black tracking-widest transition-all ${!showPie ? 'bg-indigo-600 shadow-lg shadow-indigo-600/40 text-white' : 'text-slate-500'}`}
            >
              BARS
            </button>
            <button 
              onClick={() => setShowPie(true)}
              className={`flex-1 sm:flex-none px-6 md:px-8 py-2.5 rounded-xl text-[10px] sm:text-xs font-black tracking-widest transition-all ${showPie ? 'bg-indigo-600 shadow-lg shadow-indigo-600/40 text-white' : 'text-slate-500'}`}
            >
              PIE
            </button>
          </div>
          <div className="hidden md:block w-10"></div>
        </header>

        {/* Main Chart Container - Adjusted padding for mobile */}
        <motion.div 
          layout
          className="bg-white/5 border border-white/10 rounded-[2rem] sm:rounded-[3rem] p-4 sm:p-8 md:p-12 backdrop-blur-3xl min-h-[400px] sm:min-h-[500px] flex flex-col items-center justify-center relative shadow-2xl"
        >
          <AnimatePresence mode="wait">
            {!showPie ? (
              <motion.div key="bar" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="w-full h-[300px] sm:h-[380px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#64748b', fontSize: 10, fontWeight: 'bold'}} 
                      dy={10} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#334155', fontSize: 9}} 
                      tickFormatter={(v) => `₹${v}`} 
                    />
                    <Tooltip 
                      cursor={{fill: 'rgba(255,255,255,0.02)'}} 
                      contentStyle={{backgroundColor: '#16162d', borderRadius: '16px', border: 'none', fontSize: '12px'}} 
                    />
                    {/* barSize adjusted for mobile responsive */}
                    <Bar dataKey="Limit" fill="#1e293b" radius={[6, 6, 6, 6]} barSize={window.innerWidth < 640 ? 25 : 45} />
                    <Bar dataKey="Spent" fill="#6366f1" radius={[6, 6, 6, 6]} barSize={window.innerWidth < 640 ? 25 : 45} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            ) : (
              <motion.div key="pie" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="w-full h-[300px] sm:h-[380px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={chartData} 
                      cx="50%" 
                      cy="50%" 
                      innerRadius={window.innerWidth < 640 ? 60 : 85} 
                      outerRadius={window.innerWidth < 640 ? 90 : 125} 
                      paddingAngle={8} 
                      dataKey="Spent" 
                      stroke="none"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{backgroundColor: '#16162d', borderRadius: '16px', border: 'none', fontSize: '12px'}} />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36} 
                      iconType="circle" 
                      wrapperStyle={{ fontSize: '10px', paddingTop: '20px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Info Cards Bottom - Grid changes from 1 to 3 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-10">
          {chartData.map((item, i) => (
            <div key={i} className="bg-white/5 border border-white/10 p-5 sm:p-6 rounded-[1.5rem] sm:rounded-[2.5rem] backdrop-blur-md flex flex-col">
              <p className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{item.name}</p>
              <div className="flex justify-between items-end">
                <h4 className="text-xl sm:text-2xl font-black italic text-white">₹{item.Spent}</h4>
                <p className="text-[9px] text-slate-600 font-bold tracking-tighter uppercase">LIMIT: ₹{item.Limit}</p>
              </div>
              {/* Progress bar visual indicator */}
              <div className="w-full h-1 bg-white/5 mt-4 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500" 
                  style={{ width: `${Math.min((item.Spent / item.Limit) * 100, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default CheckGraph;