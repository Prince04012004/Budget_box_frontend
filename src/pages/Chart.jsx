import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiBarChart2, FiPieChart } from "react-icons/fi";
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
    <div className="min-h-screen bg-[#0a0a14] text-white p-6 md:p-10 font-sans selection:bg-indigo-500/30">
      <div className="max-w-6xl mx-auto">
        
        {/* Header with Toggle */}
        <header className="flex justify-between items-center mb-12">
          <button onClick={() => navigate(-1)} className="p-3 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition shadow-xl">
            <FiArrowLeft size={20} />
          </button>

          <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md">
            <button 
              onClick={() => setShowPie(false)}
              className={`px-8 py-2.5 rounded-xl text-xs font-black tracking-widest transition-all ${!showPie ? 'bg-indigo-600 shadow-lg shadow-indigo-600/40' : 'text-slate-500'}`}
            >
              BARS
            </button>
            <button 
              onClick={() => setShowPie(true)}
              className={`px-8 py-2.5 rounded-xl text-xs font-black tracking-widest transition-all ${showPie ? 'bg-indigo-600 shadow-lg shadow-indigo-600/40' : 'text-slate-500'}`}
            >
              PIE
            </button>
          </div>
          <div className="w-10 hidden md:block"></div>
        </header>

        {/* Chart Container */}
        <motion.div 
          layout
          className="bg-white/5 border border-white/10 rounded-[3rem] p-8 md:p-12 backdrop-blur-3xl min-h-[500px] flex flex-col items-center justify-center relative shadow-2xl"
        >
          <AnimatePresence mode="wait">
            {!showPie ? (
              <motion.div key="bar" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="w-full h-[380px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: 'bold'}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#334155', fontSize: 10}} tickFormatter={(v) => `₹${v}`} />
                    <Tooltip cursor={{fill: 'rgba(255,255,255,0.02)'}} contentStyle={{backgroundColor: '#16162d', borderRadius: '16px', border: 'none'}} />
                    <Bar dataKey="Limit" fill="#1e293b" radius={[8, 8, 8, 8]} barSize={45} />
                    <Bar dataKey="Spent" fill="#6366f1" radius={[8, 8, 8, 8]} barSize={45} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            ) : (
              <motion.div key="pie" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="w-full h-[380px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} cx="50%" cy="50%" innerRadius={85} outerRadius={125} paddingAngle={10} dataKey="Spent" stroke="none">
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{backgroundColor: '#16162d', borderRadius: '16px', border: 'none'}} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Info Cards Bottom */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {chartData.map((item, i) => (
            <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-[2.5rem] backdrop-blur-md flex flex-col">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{item.name}</p>
              <div className="flex justify-between items-end">
                <h4 className="text-2xl font-black italic">₹{item.Spent}</h4>
                <p className="text-[10px] text-slate-600 font-bold tracking-tighter">BUDGET: ₹{item.Limit}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default CheckGraph;