import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FiEdit3, FiTag, FiDollarSign, FiCalendar, FiArrowLeft } from "react-icons/fi"; // Icons
import API from "../services/api.js";
import toast from "react-hot-toast";

const Updatetransaction = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formdata, setformdata] = useState({
    title: "",
    amount: "",
    category: "",
    date: ""
  });

  useEffect(() => {
    const fetchtransaction = async () => {
      try {
        const response = await API.get(`/getexpenses/${id}`);
        setformdata({
          title: response.data.title || "",
          amount: response.data.amount || "",
          category: response.data.category || "",
          date: response.data.date ? response.data.date.split("T")[0] : ""
        });
      } catch (err) {
        console.log(err);
        toast.error("Failed to fetch transaction");
      }
    };
    fetchtransaction();
  }, [id]);

  const handlechange = (e) => {
    setformdata({
      ...formdata,
      [e.target.name]: e.target.value
    });
  };

  const handleupdate = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/updateexpense/${id}`, formdata);
      toast.success("Transaction updated ✅");
      navigate("/viewanddelete"); // History par wapas bhej dete hain
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed ❌");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0a0a14] bg-gradient-to-br from-[#0a0a14] via-[#1a1a3a] to-[#0a0a14] overflow-hidden font-sans p-6">
      
      {/* Background Decorative Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-slate-500 hover:text-white mb-6 transition-all text-xs font-bold tracking-widest uppercase"
        >
          <FiArrowLeft /> Back
        </button>

        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-[2.5rem] p-10">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/30 mb-4">
              <FiEdit3 className="text-white text-2xl" />
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Edit Detail</h2>
            <p className="text-slate-500 text-xs mt-1 uppercase tracking-widest font-bold">Update your records</p>
          </div>

          <form onSubmit={handleupdate} className="space-y-4">
            
            <div className="relative">
              <FiTag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                name="title"
                value={formdata.title}
                onChange={handlechange}
                placeholder="Title"
                required
                className="w-full pl-12 pr-4 py-4 bg-white/5 text-white border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600 text-sm"
              />
            </div>

            <div className="relative">
              <FiDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="number"
                name="amount"
                value={formdata.amount}
                onChange={handlechange}
                placeholder="Amount"
                required
                className="w-full pl-12 pr-4 py-4 bg-white/5 text-white border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600 text-sm"
              />
            </div>

            <div className="relative">
              <FiTag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 opacity-50" />
              <input
                type="text"
                name="category"
                value={formdata.category}
                onChange={handlechange}
                placeholder="Category"
                required
                className="w-full pl-12 pr-4 py-4 bg-white/5 text-white border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600 text-sm"
              />
            </div>

            <div className="relative">
              <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="date"
                name="date"
                value={formdata.date}
                onChange={handlechange}
                required
                className="w-full pl-12 pr-4 py-4 bg-white/5 text-white border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm color-scheme-dark"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-indigo-500/20 transition-all mt-4"
            >
              UPDATE TRANSACTION
            </motion.button>
          </form>
        </div>
        
        <p className="mt-8 text-center text-[10px] font-bold text-slate-600 tracking-[0.4em] uppercase">
          BudgetBox • Transaction Sync
        </p>
      </motion.div>
    </div>
  );
};

export default Updatetransaction;