import React, { useState } from 'react'

import { Topbar } from '../Components/Topbar/topbar';
import './page.css'


export const LoginPage = (props) => {
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
                    <input placeholder='Enter your name'></input>
                    <input placeholder='Enter the arxiv link of your paper'></input>
                    <button>Submit</button>
                </div>
            </div>
        </>
    )
}