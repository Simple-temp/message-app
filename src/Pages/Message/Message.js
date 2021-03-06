import React, { useRef, useEffect } from 'react';
import Moment from 'react-moment';

const Message = ({ msg, user1 }) => {

    const scrollRef = useRef()

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [msg])

    return (
        <div className={`msg-box ${msg.form === user1 ? "own" : "their"}`}>

            {msg.media ? <img src={msg.media} alt={msg.text} style={{ width: "200px", height: "auto" }} className="text-img" /> : null}

            <div className='sms-text'>
                <p className={`${msg.form === user1 ? "me" : "friend"}`}>{ !msg.text ? "" : msg.text }</p>
            </div>

            <small>
                <Moment fromNow className='moment'>{msg.createdAt.toDate()}</Moment>
            </small>

        </div>
    );
};

export default Message;