import { ReactNode, createContext, useState, useEffect, useContext } from "react";
import { checkAuthStatus, loginUser, logoutUser } from "../helpers/api-communicator.js";
import React from "react";

type User = {
    name: string;
    email: string;
}

type UserAuth = {
    isLoggedIn: boolean;
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<UserAuth|null>(null);
export const AuthProvider = ({children}: {children:ReactNode}) => {
    const [user,setUser] = useState<User | null>(null)
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(()=>{
        async function checkStatus() {
            const data = await checkAuthStatus();
            console.log(data)
            if(data){
                setUser({email: data?.user?.email, name: data?.user?.name});
                setIsLoggedIn(true);
            }
        }
        checkStatus();
    },[])

    const login = async (email: string, password: string) => {
        const data = await loginUser(email, password);
        
        if(data){
            setUser({email: data.email, name: data.name});
            setIsLoggedIn(true);
        }
    }
    const signup = async (name: string, email: string, password: string) => {
        // API call to signup and set user state
    }
    const logout = async () => {
        await logoutUser();
        setIsLoggedIn(false);
        setUser(null);
        window.location.reload();
    }
    const value ={
        isLoggedIn,
        user,
        login,
        signup,
        logout,
    }
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)