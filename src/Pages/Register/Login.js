import React, { useState } from 'react';
import { doc, getFirestore, updateDoc } from "firebase/firestore"
import { initializeApp } from "firebase/app";
import firebaseConfig from './firebaseConfig';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';


initializeApp(firebaseConfig)

const Login = () => {

    const [info, setInfo] = useState({
        email: "",
        password: "",
        error: null,
        loading: false
    })

    const { email, password, error, loading } = info

    const navigate = useNavigate()

    const handoleChange = (e) => {
        setInfo({ ...info, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {

        e.preventDefault()
        const auth = getAuth()
        const db = getFirestore(initializeApp(firebaseConfig))

        setInfo({ ...info, error: null, loading: true })
        if (!email || !password) {
            setInfo({ ...info, error: "All field are required" })
        }
        try {
            const result = await signInWithEmailAndPassword(
                auth,
                email,
                password
            )
            await updateDoc(doc(db, "users", result.user.uid), {
                isOnline: true
            })
            setInfo({
                email: "",
                password: "",
                error: null,
                loading: false
            })
            navigate("/", { replace: true });
        } catch (err) {
            setInfo({ ...info, error: err.message, loading: false })
        }

        console.log(info)
    }



    return (
        <section>
            <div className="container login">
                <h3 className='text-center my-4'>Login</h3>
                <div className="col-lg-6 mx-auto mt-5">
                    <form action="" onSubmit={handleSubmit}>
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
                                loading ? "Logging in..." : "Login"
                            }
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Login;