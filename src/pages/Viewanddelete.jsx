import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiTrash2, FiEdit2, FiArrowLeft, FiFilter } from "react-icons/fi"; // Premium Icons
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
    <div className="min-h-screen bg-[#0a0a14] bg-gradient-to-br from-[#0a0a14] via-[#1a1a3a] to-[#0a0a14] text-white font-sans p-6 md:p-10 relative overflow-x-hidden">
      
      {/* Background Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Header Section */}
        <header className="flex justify-between items-center mb-10">
          <motion.button 
            whileHover={{ x: -5 }}
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <FiArrowLeft /> <span className="text-sm font-bold tracking-widest uppercase">Back</span>
          </motion.button>
          
          <h2 className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-500">
            TRANSACTIONS
          </h2>

          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
            <FiFilter className="text-slate-500 text-xs" />
          </div>
        </header>

        {/* Transactions List */}
        <div className="space-y-4">
          {transactions.length === 0 ? (
            <div className="py-20 bg-white/5 border border-dashed border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-500">
              <p className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-40">No transactions found</p>
            </div>
          ) : (
            transactions.map((transaction, index) => (
              <motion.div
                key={transaction._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] flex justify-between items-center hover:bg-white/[0.08] hover:border-indigo-500/30 transition-all shadow-xl"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                    {transaction.category}
                  </span>
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    {transaction.title}
                  </h3>
                  <p className="text-2xl font-black text-white italic tabular-nums">
                    ₹{transaction.amount.toLocaleString()}
                  </p>
                </div>

                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => navigate(`/updatetransaction/${transaction._id}`)}
                    className="w-12 h-12 bg-white/5 hover:bg-indigo-600/20 text-indigo-400 border border-white/10 rounded-2xl flex items-center justify-center transition-all"
                    title="Update"
                  >
                    <FiEdit2 size={18} />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handledelete(transaction._id)}
                    className="w-12 h-12 bg-white/5 hover:bg-rose-600/20 text-rose-500 border border-white/10 rounded-2xl flex items-center justify-center transition-all"
                    title="Delete"
                  >
                    <FiTrash2 size={18} />
                  </motion.button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Footer info */}
        <footer className="mt-16 text-center">
          <p className="text-[9px] font-bold text-slate-600 tracking-[0.5em] uppercase">
            End of History • {transactions.length} Records
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Viewanddelete;