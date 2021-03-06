import React, { useEffect, useState } from 'react';
import { getFirestore, collection, query, where, onSnapshot, addDoc, Timestamp, orderBy, setDoc, doc, getDoc, updateDoc } from "firebase/firestore"
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import firebaseConfig from '../Register/firebaseConfig';
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";
import Users from '../Users/Users';
import MessageForm from '../MessageForm/MessageForm';
import Message from '../Message/Message';


initializeApp(firebaseConfig)

const Home = () => {

    const [users, setUsers] = useState([])
    const [chat, setChat] = useState("")
    const [text, setText] = useState("")
    const [img, setImg] = useState("")
    const [messages,setMessages] = useState([])

    const auth = getAuth()
    const user1 = auth.currentUser.uid
    const db = getFirestore(initializeApp(firebaseConfig))
    const storage = getStorage(initializeApp(firebaseConfig))

    useEffect(() => {
        const usersRef = collection(db, "users")
        const q = query(usersRef, where("uid", "not-in", [user1]));
        const unsub = onSnapshot(q, (querySnapshot) => {
            let users = []
            querySnapshot.forEach((doc) => {
                users.push(doc.data())
            })
            setUsers(users)
        })
        return () => unsub()
    }, [])
    console.log(users)

    const selectedUser = async (user) => {
        setChat(user)
        console.log(user)
        const user2 = user.uid
        const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`
        const msgRef = collection(db, "messages", id, "chat")
        const q = query(msgRef, orderBy("createdAt","asc"))
        onSnapshot(q, (querySnapshot) => {
            let msgs = []
            querySnapshot.forEach((doc) => {
                msgs.push(doc.data())
            })
            setMessages(msgs)
        })   

        const docSnap = await getDoc(doc(db,"lastMsg",id))
        if( docSnap.data()?.form !== user1)
        {
            await updateDoc(doc(db, "lastMsg", id), {unRead : false})
        }
    }
    console.log(messages)

    const handleSubmit = async e => {
        e.preventDefault()

        const user2 = chat.uid

        const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`
        let url;
        if (img) {
            const imgRef = ref(storage, `images/${new Date().getTime()} - ${img.name}`)

            const snap = await uploadBytes(imgRef, img)
            const dlurl = await getDownloadURL(ref(storage, snap.ref.fullPath))
            url=dlurl
        }

        await addDoc(collection(db, "messages", id, "chat"), {
            text,
            form: user1,
            to: user2,
            createdAt: Timestamp.fromDate(new Date()),
            media : url || ""
        })

        await setDoc(doc(db,"lastMsg", id),{
            text,
            form: user1,
            to: user2,
            createdAt: Timestamp.fromDate(new Date()),
            media : url || "",
            unRead : true 
        })

        setText("")
        setImg("")
    }

    return (
        <section>
            <div className="container mt-3">
                <div className="row">
                    <div className="col-lg-4 col-md-4 col-3">
                        {
                            users.map(user => <Users key={user.uid} user={user} selectedUser={selectedUser} user1={user1} chat={chat}></Users>)
                        }
                    </div>
                    <div className="col-lg-8 col-md-8 col-9">
                        <div className="messages-box">
                            {
                                chat ?
                                    <>
                                        <div className='messages-user'>
                                            <h3>{chat.name}</h3>
                                        </div>
                                        <div className='messages'>
                                            {messages.length 
                                                ? messages.map((msg,i) => <Message key={i} msg={msg} user1={user1}></Message> )
                                                : null
                                            }
                                        </div>
                                        <MessageForm
                                            handleSubmit={handleSubmit}
                                            text={text}
                                            setText={setText}
                                            setImg={setImg}
                                        />
                                    </>
                                    : <div>
                                        <h3 className='empty-message'>Select a user and start chat</h3>
                                    </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Home;