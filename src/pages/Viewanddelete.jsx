import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiTrash2, FiEdit2, FiArrowLeft, FiFilter } from "react-icons/fi"; 
import API from "../services/api.js";
import toast from "react-hot-toast";

const Viewanddelete = () => {
  const [transactions, settransactions] = useState([]);
  const navigate = useNavigate();

  const fetchtransaction = async () => {
    try {
      const response = await API.get("/getexpenses");
      settransactions(response.data.transactions);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load transactions");
    }
  };

  useEffect(() => {
    fetchtransaction();
  }, []);

  const handledelete = async (id) => {
    try {
      await API.delete(`/deleteexpense/${id}`);
      toast.success("Transaction deleted 💸");
      fetchtransaction();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error deleting");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a14] bg-gradient-to-br from-[#0a0a14] via-[#1a1a3a] to-[#0a0a14] text-white font-sans p-4 sm:p-6 md:p-10 relative overflow-x-hidden">
      
      {/* Background Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-indigo-600/10 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] bg-purple-600/10 rounded-full blur-[80px] sm:blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Header Section - Mobile Friendly */}
        <header className="flex justify-between items-center mb-8 sm:mb-10">
          <motion.button 
            whileHover={{ x: -5 }}
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors p-2"
          >
            <FiArrowLeft /> <span className="text-[10px] sm:text-sm font-bold tracking-widest uppercase">Back</span>
          </motion.button>
          
          <h2 className="text-lg sm:text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-500">
            TRANSACTIONS
          </h2>

          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 cursor-pointer">
            <FiFilter className="text-slate-500 text-xs sm:text-sm" />
          </div>
        </header>

        {/* Transactions List */}
        <div className="space-y-4 sm:space-y-6">
          {transactions.length === 0 ? (
            <div className="py-20 bg-white/5 border border-dashed border-white/10 rounded-[2rem] sm:rounded-[2.5rem] flex flex-col items-center justify-center text-slate-500 mx-2">
              <p className="text-[9px] sm:text-[10px] font-bold tracking-[0.3em] uppercase opacity-40 text-center px-4">No transactions found</p>
            </div>
          ) : (
            transactions.map((transaction, index) => (
              <motion.div
                key={transaction._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group bg-white/5 backdrop-blur-xl border border-white/10 p-5 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-white/[0.08] hover:border-indigo-500/30 transition-all shadow-xl mx-1"
              >
                {/* Left Side: Info */}
                <div className="flex flex-col gap-0.5 sm:gap-1 w-full sm:w-auto">
                  <span className="text-[8px] sm:text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                    {transaction.category}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight truncate max-w-[250px]">
                    {transaction.title}
                  </h3>
                  <p className="text-xl sm:text-2xl font-black text-white italic tabular-nums mt-1">
                    ₹{transaction.amount.toLocaleString()}
                  </p>
                </div>

                {/* Right Side: Buttons - Fixed width on mobile for better touch experience */}
                <div className="flex gap-3 sm:gap-2 w-full sm:w-auto justify-end border-t border-white/5 sm:border-none pt-4 sm:pt-0">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => navigate(`/updatetransaction/${transaction._id}`)}
                    className="flex-1 sm:flex-none h-11 sm:w-12 sm:h-12 bg-indigo-600/10 sm:bg-white/5 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 sm:border-white/10 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all"
                  >
                    <FiEdit2 size={18} />
                    <span className="sm:hidden ml-2 text-xs font-bold">Edit</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handledelete(transaction._id)}
                    className="flex-1 sm:flex-none h-11 sm:w-12 sm:h-12 bg-rose-600/10 sm:bg-white/5 hover:bg-rose-600/20 text-rose-500 border border-rose-500/20 sm:border-white/10 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all"
                  >
                    <FiTrash2 size={18} />
                    <span className="sm:hidden ml-2 text-xs font-bold">Delete</span>
                  </motion.button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Footer info */}
        <footer className="mt-12 sm:mt-16 text-center pb-10">
          <p className="text-[8px] sm:text-[9px] font-bold text-slate-600 tracking-[0.3em] sm:tracking-[0.5em] uppercase px-4">
            End of History • {transactions.length} Records
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Viewanddelete;