import axios  from "axios";

const api=axios.create({
    baseURL:"https://budget-box-backend-7zhw.onrender.com/api"
})
//Add token to header

api.interceptors.request.use((req)=>{
    const token=localStorage.getItem("token");

    if(token){
        req.headers.Authorization=`Bearer ${token}`;
    }
    return req;
})
export default api;