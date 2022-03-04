import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { doc, getFirestore, updateDoc } from "firebase/firestore"
import { initializeApp } from "firebase/app";
import firebaseConfig from '../Register/firebaseConfig';
import { authContext } from '../ContextApi/ContextApi';


initializeApp(firebaseConfig)

const Navbar = () => {

    const {user} = useContext(authContext)

    const auth = getAuth()
    const db = getFirestore(initializeApp(firebaseConfig))
    const navigate = useNavigate()

    const handleSignOut = async () =>{

        await updateDoc(doc(db,"users", auth.currentUser.uid),{
            isOnline : false,
        })
        await signOut(auth)
        navigate("/login", { replace: true });
    }

    return (
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container">
                <Link class="navbar-brand" to="/">Messenger</Link>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
                    <ul class="navbar-nav mb-2 mb-lg-0">
                        {
                            user ? (
                                <>
                                    <li class="nav-item">
                                        <Link class="nav-link" to="/profile">Profile</Link>
                                    </li>
                                    <li class="nav-item">
                                        <button className='btn btn-info' onClick={handleSignOut} >Log out</button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li class="nav-item">
                                        <Link class="nav-link" to="/register">Register</Link>
                                    </li>
                                    <li class="nav-item">
                                        <Link class="nav-link" to="/login">Login</Link>
                                    </li>
                                </>
                            )
                        }
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;