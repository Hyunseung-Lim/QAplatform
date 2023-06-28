import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import { Topbar } from '../Components/Topbar/topbar';
import './page.css'


export const LoginPage = (props) => {

    const[username, setUsername] = useState("");
    const[url, setUrl] = useState("https://arxiv.org/abs/2305.11583");

    const usernameHandler = (e) => {
        e.preventDefault();
        setUsername(e.target.value);
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
                    <input value={url} onChange={urlHandler} placeholder='Enter the arxiv link of your paper'></input>
                    <Link 
                        to = '/main'
                        state = {{ url: url }} 
                        className='submitbutton'
                    >
                        <div>Submit</div>
                    </Link>
                </div>
            </div>
        </>
    )
}