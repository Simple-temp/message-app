import React, { useState } from 'react';
import { setDoc, doc, getFirestore, Timestamp } from "firebase/firestore"
import { initializeApp } from "firebase/app";
import firebaseConfig from './firebaseConfig';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { Navigate, useNavigate } from 'react-router-dom';


initializeApp(firebaseConfig)

const Register = () => {

    const [info, setInfo] = useState({
        name: "",
        email: "",
        password: "",
        error: null,
        loading: false
    })

    const { name, email, password, error, loading } = info

    const navigate = useNavigate()

    // const [newperson, setNewperson] = useState(true)

    const handoleChange = (e) => {
        // const newFile = { ...info }
        // newFile[e.target.name] = e.target.value
        // setInfo(newFile)
        setInfo({ ...info, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        
        e.preventDefault()
        const auth = getAuth()
        const db = getFirestore(initializeApp(firebaseConfig))

        setInfo({ ...info, error: null, loading: true })
        if (!name || !email || !password) {
            setInfo({ ...info, error: "All field are required" })
        }
        try {
            const result = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            )
            await setDoc(doc(db, "users", result.user.uid), {
                uid: result.user.uid,
                name,
                email,
                createAt: Timestamp.fromDate(new Date()),
                isOnline: true
            })
            setInfo({
                name: "",
                email: "",
                password: "",
                error: null,
                loading: false
            })
            navigate("/", { replace: true });
        } catch (err) {
            setInfo({ ...info, error: err.message, loading: false })
        }

        // if (newperson && info.name && info.password) {

        //     const db = getFirestore(initializeApp(firebaseConfig))
        //     const auth = getAuth();

        //     createUserWithEmailAndPassword(auth, info.email, info.password)
        //         .then(() => {
        //             const createUserInfo = {...info}
        //             setInfo(createUserInfo)
        //             nameUpdate(info.name)
        //             alert("Successfully create an account now go to login page")
        //             setDoc(doc(db,"users",info.uid),{
        //                 uid : info.uid,
        //                 name : info.name,
        //                 email : info.email,
        //                 password : info.password,
        //                 createAt : Timestamp.fromDate(new Date()),
        //                 isOnline : true
        //             })
        //             setInfo({
        //                 name: "",
        //                 email: "",
        //                 password: "",
        //                 error: null,
        //             })
        //         })
        //         .catch((error) => {
        //             const createUserInfo = {...info}
        //             createUserInfo.error = error.message;
        //             setInfo(createUserInfo)
        //         });
        // }
        console.log(info)
    }

    // const nameUpdate = (name) => {

    //     const auth = getAuth();
    //     updateProfile(auth.currentUser, {
    //         displayName: name
    //     }).then(() => {
    //         // Profile updated!
    //         // ...
    //     }).catch((error) => {
    //         // An error occurred
    //         // ...
    //     });
    // }


    return (
        <section>
            <div className="container">
                <h3>Create an account</h3>
                <div className="col-lg-8">
                    <form action="" onSubmit={handleSubmit}>
                        <div class="mb-3">
                            <input name="name" value={name} onChange={handoleChange} type="text" class="form-control" placeholder='Name' />
                        </div>
                        <div class="mb-3">
                            <input name="email" value={email} onChange={handoleChange} type="email" class="form-control" placeholder='Email' />
                        </div>
                        <div class="mb-3">
                            <input name="password" value={password} onChange={handoleChange} type="password" class="form-control" placeholder='Password' />
                        </div>
                        {
                            error ? <p className='error text-danger'>{error}</p> : null
                        }
                        <button type="submit" class="btn btn-primary" disabled={loading} >
                            {
                                loading ? "Createting..." : "Create" 
                            }
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Register;