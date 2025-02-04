import axios from "axios"

export const loginUser = async (email:string, password:string) => {
    const res = await axios.post("/user/login", { email, password});
    if(res.status!=200) {
        throw new Error("Unalble to login");
    }
    const data = await res.data;
    return data;
}

export const checkAuthStatus = async () => {
    const res = await axios.post("/user/auth-status");
    if(res.status!=200) {
        throw new Error("Unalble to authenticate");
    }
    const data = await res.data;
    return data;
}

export const sendChatReq = async (message:string) => {
    const res = await axios.post("/chats/new", { message });
    if(res.status!=200) {
        throw new Error("Unalble to send chat");
    }
    const data = await res.data;
    return data;
}
