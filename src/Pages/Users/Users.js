import React from 'react';
import picture from "../../img/about.jpg"
import "./Users.css"

const Users = ({ user,selectedUser }) => {
    return (
            <div className="left-side d-flex justify-content-between" onClick={()=>selectedUser(user)}>
                <div className="user-details d-flex">
                    <img src={user.avatar || picture} alt="avatar" className='avatar' />
                    <h4>{user.name}</h4>
                </div>
                <div className={`user-status ${user.isOnline ? "online" : "offline"}`}>
                </div>
            </div>
    );
};

export default Users;