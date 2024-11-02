import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { addTokenToHeader } from "../helper";
export  function getUser() {
    const token = localStorage.getItem("token");
    
    const decoded = jwtDecode(token);  
    const id = decoded.id;
    const headers = addTokenToHeader({ headers: {} });
    
    // console.log(id)
    const res = axios.get(`${import.meta.env.VITE_BASE_URL}/api/user/byid/${id}`, {
        headers
    });
    if (res.status === 401) {
        localStorage.removeItem("token");
        alert("You're logged out");
        window.location.href = "/login";
    } 
    return res;
}

export async function fetchBoardByUser() {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("User is not authenticated");

    const headers = {
        'Authorization': `${token}`,
    };


    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/board`, { headers });

   
    const board = response.data.board;
    console.log(board);
    return board 
}


export async function createTask(board, taskData){
    const fullBoard = await fetchBoardByUser();
    const boardById = fullBoard._id;
        console.log(boardById);
        if (!boardById) throw new Error("Board not found");
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    const id = decoded.id;
    const headers = addTokenToHeader({ headers: {} });


    const res = axios.post(`${import.meta.env.VITE_BASE_URL}/api/task/create/${boardById}`, taskData, {
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `${token}`,
        }
    });
    return res;
}

export const fetchAvailableUsers =  async () => {
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    const id = decoded.id;
    const headers = addTokenToHeader({ headers: {} });      
    const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/user`, {headers});
    console.log(res.data);
    return res.data;
    
}

export async function moveTask(taskId, newStatus){
    const token = localStorage.getItem("token");
    if (!token) throw new Error("User is not authenticated");

    const headers = addTokenToHeader({ headers: {} });
    const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/task/move/${taskId}`,
        { newStatus },
        { headers }
    );
    console.log(response);

    if (response.status === 200) {
        console.log("Task moved successfully:", response.data);
        return response.data.task;
    } else {
        throw new Error("Failed to move task");

}
}

export async function updateTask(taskId, taskData){
    const token = localStorage.getItem("token");
    if (!token) throw new Error("User is not authenticated");

    const headers = addTokenToHeader({ headers: {} });
    const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/task/update/${taskId}`,
        taskData,
        { headers }
    );
    console.log(response);

    if (response.status === 200) {
        console.log("Task updated successfully:", response.data);
        return response.data;
    } else {
        throw new Error("Failed to update task");
    }
}


export async function deleteTaskById(taskId){
    const token = localStorage.getItem("token");
    if (!token) throw new Error("User is not authenticated");

    const headers = addTokenToHeader({ headers: {} });
    const response = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/task/delete/${taskId}`,
        { headers }
    );
    console.log(response);

    if (response.status === 200) {
        console.log("Task deleted successfully:", response.data);
        return response.data;
    } else {
        throw new Error("Failed to delete task");
    }
}

export async function deleteAllTasksByStatus(status){
    const token = localStorage.getItem("token");
    if (!token) throw new Error("User is not authenticated");
    const board = await fetchBoardByUser();
    const boardId = board._id;

    const headers = addTokenToHeader({ headers: {} });
    const res = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/task/deleteall/${boardId}`,
        { headers,
            data: {status}
         }

    );
    return res;
}

export async function addMembersToBoard(userId){
    
    
    const headers = addTokenToHeader({ headers: {} });
    const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/board/addMembers/${userId}`, {},
        { headers }
    );
    return res;
    
}

export async function fetchAnalyticsData() 
{
    const board = await fetchBoardByUser();
    const boardId = board._id;
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/analytics/${boardId}`);
        return response.data;
       
   
};

export async function settings(id, data) {
    const res = await axios.put(`${import.meta.env.VITE_BASE_URL}/api/user/update/${id}`, data, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    console.log(`settings: ${res}`);
    return res;
}