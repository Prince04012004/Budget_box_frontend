import { useState } from "react";
import { motion } from "framer-motion";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { FiPlusCircle, FiTag, FiDollarSign, FiCalendar, FiArrowLeft } from "react-icons/fi"; 
import toast from "react-hot-toast";

const Addtransaction = () => {
  const navigate = useNavigate();

  // Aaj ki date nikalne ke liye logic
  const today = new Date().toISOString().split("T")[0];

  const [formdata, setformdata] = useState({
    title: "",
    amount: "",
    category: "",
    Date: today // ✅ Automatic aaj ki date set ho gayi
  });

  const handlechange = (e) => {
    setformdata({
      ...formdata,
      [e.target.name]: e.target.value
    });
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/addexpense", formdata);

      setformdata({
        title: "",
        amount: "",
        category: "",
        Date: today // ✅ Reset hone par bhi aaj ki date hi rahegi
      });

      toast.success("Transaction added 💰");
      navigate("/dashboard");
    }
    catch (err) {
      toast.error(err.response?.data?.message || "Error adding transaction");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0a0a14] bg-gradient-to-br from-[#0a0a14] via-[#1a1a3a] to-[#0a0a14] overflow-hidden font-sans p-6">
      
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <button 
          onClick={() => navigate("/dashboard")} 
          className="flex items-center gap-2 text-slate-500 hover:text-white mb-6 transition-all text-xs font-bold tracking-widest uppercase"
        >
          <FiArrowLeft /> Dashboard
        </button>

        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-[2.5rem] p-10">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/30 mb-4 text-white text-2xl">
              <FiPlusCircle />
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">New Spend</h2>
            <p className="text-slate-500 text-[10px] mt-1 uppercase tracking-[0.2em] font-black">Record your transaction</p>
          </div>

          <form onSubmit={handlesubmit} className="space-y-4">
            
            <div className="relative">
              <FiTag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                name="title"
                placeholder="What did you buy?"
                value={formdata.title}
                onChange={handlechange}
                required
                className="w-full pl-12 pr-4 py-4 bg-white/5 text-white border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600 text-sm"
              />
            </div>

            <div className="relative">
              <FiDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="number"
                name="amount"
                placeholder="Amount (₹)"
                value={formdata.amount}
                onChange={handlechange}
                required
                className="w-full pl-12 pr-4 py-4 bg-white/5 text-white border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600 text-sm"
              />
            </div>

            <div className="relative">
              <FiTag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 opacity-40" />
              <input
                type="text"
                name="category"
                placeholder="Category (Food, Travel...)"
                value={formdata.category}
                onChange={handlechange}
                required
                className="w-full pl-12 pr-4 py-4 bg-white/5 text-white border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600 text-sm"
              />
            </div>

            <div className="relative group">
              <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              <input
                type="date"
                name="Date"
                value={formdata.Date}
                onChange={handlechange}
                required
                className="w-full pl-12 pr-4 py-4 bg-white/5 text-white border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm [color-scheme:dark] cursor-pointer"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(79, 70, 229, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-2xl font-bold text-sm tracking-widest shadow-xl transition-all mt-4"
            >
              ADD TRANSACTION
            </motion.button>
          </form>
        </div>
        
        <footer className="mt-8 text-center">
          <p className="text-[9px] font-bold text-slate-600 tracking-[0.4em] uppercase">
            BudgetBox • Cloud Sync Active
          </p>
        </footer>
      </motion.div>
    </div>
  );
};

export default Addtransaction;