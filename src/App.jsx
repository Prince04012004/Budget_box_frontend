import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import  ProtectedRoute from "./pages/Protectedroute";
import Dashboard from "./pages/Dashboard";
import Addtransaction from "./pages/Addtransaction";
import Viewanddelete from "./pages/Viewanddelete";
import Updatetransaction from "./pages/Updatetransaction";
import CheckGraph from "./pages/Chart";
import { Toaster } from "react-hot-toast";

import "./index.css";
import Landing from "./pages/Landing";

function App() {
  return (
    
  <>

  <Toaster position="top-center" reverseOrder={false} />

  <Routes>
    <Route path="/signup" element={<Signup />} />
    <Route path="/login" element={<Login />} />

    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
    />
      <Route path="/" element={<Landing />} />
    <Route path="/addtransaction" element={<Addtransaction />} />
    <Route path="/viewanddelete" element={<Viewanddelete />} />
    <Route path="/updatetransaction/:id" element={<Updatetransaction />} />
        <Route path="/checkgraph" element={<CheckGraph />} />


  </Routes>
</>


    
  
  );
}

export default App;