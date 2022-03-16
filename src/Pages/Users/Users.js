import React, { useEffect, useState } from 'react';
import { onSnapshot, doc } from 'firebase/firestore';
import picture from "../../img/about.jpg"
import firebaseConfig from '../Register/firebaseConfig';
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';


initializeApp(firebaseConfig)

const Users = ({ user1, user, selectedUser, chat }) => {

    const db = getFirestore(initializeApp(firebaseConfig))
    const user2 = user?.uid
    const [data, setData] = useState("")

    useEffect(() => {
        const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`
        let unsub = onSnapshot(doc(db, "lastMsg", id), doc => {
            setData(doc.data())
        })
        return () => unsub()
    }, [])

    return (
        <div className={`left-side d-flex justify-content-between ${chat.name === user.name && "slected-user"}`} onClick={() => selectedUser(user)}>
            <div className="user-details d-flex">
                <img src={user.avatar || picture} alt="avatar" className='avatar' />
                <div className="userinfo-sms">
                    <h5>{user.name}</h5>
                    {
                        data?.form !== user1 && data?.unRead && (
                            <small className='unread'>New</small>
                        )
                    }
                    {
                        data && (
                            <p className='truncate'>
                                <strong>{data.form === user1 ? "You : " : null}</strong>
                                {data.text}
                            </p>
                        )
                    }
                </div>
            </div>
            <div className={`user-status ${user.isOnline ? "online" : "offline"}`}></div>
        </div>
    );
};

export default Users;