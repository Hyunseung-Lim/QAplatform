import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import { Topbar } from '../Components/Topbar/topbar';
import './page.css'


export const LoginPage = (props) => {

    const[username, setUsername] = useState("");
    const[userScholarID, setUserScholarID] = useState("");
    const[password, setPassword] = useState("test01");
    const[url, setUrl] = useState("https://arxiv.org/abs/1706.03762");

    const usernameHandler = (e) => {
        e.preventDefault();
        setUsername(e.target.value);
    }

    const userIDHandler = (e) => {
        e.preventDefault();
        setUserScholarID(e.target.value);
    }

    const passwordHandler = (e) => {
        e.preventDefault();
        setPassword(e.target.value);
    }

    const urlHandler = (e) => {
        e.preventDefault();
        setUrl(e.target.value);
    }

    return(
        <>
            <div className='loginPage'>
                <Topbar/>
                <div className='title'>
                    <div className='ask'>
                        Ask
                    </div>
                    <div>
                        Arxiv
                    </div>
                </div>
                <div className='loginBox'>
                    <input value={username} onChange={usernameHandler} placeholder='Enter your name'></input>
                    <input value={userScholarID} onChange={userIDHandler} placeholder='Enter the semantic scholar link'></input>
                    <input value={url} onChange={urlHandler} placeholder='Enter the arxiv link of your paper'></input>
                    <input value={password} onChange={passwordHandler} placeholder='Enter password'></input>
                    <Link 
                        to = {password === 'test01' ? '/main' : '/'}
                        state = {{ url: url, username: username, userScholarID: userScholarID }} 
                        className='submitbutton'
                    >
                        <div>Submit</div>
                    </Link>
                </div>
            </div>
        </>
    )
}