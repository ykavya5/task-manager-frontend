import axios from "axios";
import { handleApiResponse } from "../helper";
export const register = async (data)=>{
    const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/user/register`, data, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        
    });

    return handleApiResponse(res);
}

export const login = async (data)=>{
    const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/user/login`, data, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
});
  return handleApiResponse(res);
}