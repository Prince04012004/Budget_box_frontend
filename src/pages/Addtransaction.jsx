import { useState } from "react";
import { motion } from "framer-motion";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { FiPlusCircle, FiTag, FiDollarSign, FiCalendar, FiArrowLeft } from "react-icons/fi"; 
import toast from "react-hot-toast";

const Addtransaction = () => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  const [formdata, setformdata] = useState({
    title: "",
    amount: "",
    category: "",
    Date: today 
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
      const finalData = {
        ...formdata,
        category: formdata.category.toLowerCase().trim() 
      };

      await API.post("/addexpense", finalData);
      
      setformdata({ title: "", amount: "", category: "", Date: today });
      toast.success("Transaction added 💰");
      navigate("/dashboard");
    }
    catch (err) {
      toast.error(err.response?.data?.message || "Error adding transaction");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0a0a14] bg-gradient-to-br from-[#0a0a14] via-[#1a1a3a] to-[#0a0a14] overflow-x-hidden font-sans p-4 sm:p-6 lg:p-8 py-10">
      
      <div className="absolute top-[-5%] left-[-5%] w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-indigo-600/20 rounded-full blur-[80px] sm:blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-purple-600/20 rounded-full blur-[80px] sm:blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md mx-auto"
      >
        <button 
          onClick={() => navigate("/dashboard")} 
          className="flex items-center gap-2 text-slate-500 hover:text-white mb-4 sm:mb-6 transition-all text-[10px] sm:text-xs font-bold tracking-widest uppercase p-2"
        >
          <FiArrowLeft /> Dashboard
        </button>

        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10">
          <div className="flex flex-col items-center mb-6 sm:mb-8 text-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/30 mb-4 text-white text-xl sm:text-2xl">
              <FiPlusCircle />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">New Spend</h2>
            <p className="text-slate-500 text-[9px] sm:text-[10px] mt-1 uppercase tracking-[0.2em] font-black">Record your transaction</p>
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
                className="w-full pl-12 pr-4 py-3.5 sm:py-4 bg-white/5 text-white border border-white/10 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600 text-sm"
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
                className="w-full pl-12 pr-4 py-3.5 sm:py-4 bg-white/5 text-white border border-white/10 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600 text-sm"
              />
            </div>

            <div className="relative">
              <FiTag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                name="category"
                placeholder="Category (food, travelling, others)"
                value={formdata.category}
                onChange={handlechange}
                required
                className="w-full pl-12 pr-4 py-3.5 sm:py-4 bg-white/5 text-white border border-white/10 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600 text-sm"
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
                className="w-full pl-12 pr-4 py-3.5 sm:py-4 bg-white/5 text-white border border-white/10 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm [color-scheme:dark] cursor-pointer"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(79, 70, 229, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm tracking-widest shadow-xl transition-all mt-4"
            >
              ADD TRANSACTION
            </motion.button>
          </form>
        </div>
        
        <footer className="mt-8 text-center">
          <p className="text-[8px] sm:text-[9px] font-bold text-slate-600 tracking-[0.4em] uppercase">
            BudgetBox • Cloud Sync Active
          </p>
        </footer>
      </motion.div>
    </div>
  );
};

export default Addtransaction;