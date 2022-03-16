import React from 'react';
import { createContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from "firebase/app";
import firebaseConfig from '../Register/firebaseConfig';
import loadings from "../../img/loading.gif"


initializeApp(firebaseConfig)

export const authContext = createContext()

const ContextApi = ({children}) => {

    const [user,setUser] = useState(null)
    const [loading,setLoading] = useState(true)

    const auth = getAuth()

    useEffect(()=>{
        onAuthStateChanged(auth, (user) =>{
            setUser(user)
            setLoading(false)
        })
    },[])
    if(loading){
        return <div className='spinner'>
            <img src={loadings} alt="" className='loading-img' />
        </div>
    }

    return (
        <authContext.Provider value={{user}}>{children}</authContext.Provider>
    );
};

export default ContextApi;