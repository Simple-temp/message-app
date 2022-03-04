import React, { useEffect, useState } from 'react';
import picture from "../../img/about.jpg"
import "./Profile.css"
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage, ref, getDownloadURL, uploadBytes, deleteObject } from "firebase/storage";
import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore"
import firebaseConfig from '../Register/firebaseConfig';
import { useNavigate } from 'react-router-dom';

initializeApp(firebaseConfig)

const Profile = () => {

    const navigate = useNavigate()
    const storage = getStorage(initializeApp(firebaseConfig))
    const [img, setImg] = useState("")
    const [user, setUser] = useState()
    const db = getFirestore(initializeApp(firebaseConfig))
    const auth = getAuth()

    useEffect(() => {

        getDoc(doc(db, "users", auth.currentUser.uid)).then((docSnap) => {
            if (docSnap.exists) {
                setUser(docSnap.data())
            }
        })

        if (img) {
            const uploadImg = async () => {
                const imgRef = ref(storage, `avatar/${new Date().getTime()} - ${img.name}`)
                try {
                    if (user.avatarPath) {
                        await deleteObject(ref(storage, user.avatarPath))
                    }
                    const snap = await uploadBytes(imgRef, img)
                    const url = await getDownloadURL(ref(storage, snap.ref.fullPath))

                    await updateDoc(doc(db, "users", auth.currentUser.uid), {
                        avatar: url,
                        avatarPath: snap.ref.fullPath
                    })
                    setImg("")
                } catch (err) {
                    console.log(err.message)
                }
            }
            uploadImg()
        }
    }, [img])

    const deleteImage = async () => {
        try {
            const confirm = window.confirm("Are you sure?")
            if (confirm) {
                await deleteObject(ref(storage, user.avatarPath));
                await updateDoc(doc(db, "users", auth.currentUser.uid), {
                    avatar: "",
                    avatarPath: "",
                })
                navigate("/", { replace: true });
            }

        } catch (err) {
            console.log(err.message)
        }
    }

    return (
        user ? <section>
            <div className="container">
                <div className="row">
                    <div className="col-lg-6">
                        <div className="profile d-flex mt-5">
                            <div className="img-box">
                                <img src={user.avatar || picture} alt="avatar" />
                                <div className="overlay">
                                    <div className='overlay-inner'>
                                        <label htmlFor="photo">
                                            <i class="fa-solid fa-camera"></i>
                                        </label>
                                        {
                                            user.avatar ? <i class="fa-solid fa-trash-can" onClick={deleteImage} ></i> : null
                                        }
                                        <input type="file" accept='image/*' id="photo" onChange={(e) => setImg(e.target.files[0])} />
                                    </div>
                                </div>
                            </div>
                            <div className="info-box">
                                <h4>{user.name}</h4>
                                <p>{user.email}</p>
                                <small>Join on : {user.createAt.toDate().toDateString()}</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section> : null
    );
};

export default Profile;