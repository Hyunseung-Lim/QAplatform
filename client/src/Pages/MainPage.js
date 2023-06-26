import React, { useState } from 'react'

import { Topbar } from '../Components/Topbar/topbar';
import { Questionbox } from '../Components/Questionbox/questionbox';
import './page.css'


export const MainPage = (props) => {
    return(
        <>
            <div className='mainPage'>
                <Topbar/>
                <div className='container'>
                    <div className='title'>
                        Title of Research Paper
                    </div>
                    <div className='authors'>
                        Author Name, Author Name, Author Name, Author Name, Author Name, Author Name, Author Name, Author Name, Author Name
                    </div>
                    <div className='previewContainer'>
                        <button>
                            preview
                        </button>
                    </div>
                    <div className='subtitle'>
                        Add Question
                    </div>
                    <div className='inputContainer'>
                        <input placeholder='Type Your Own Question'></input>
                        <button>Add +</button>
                    </div>
                    <div className='subtitle'>
                        Question Recommendation
                    </div>
                    <div className='recommendContainer'>

                    </div>
                    <div className='subtitle'>
                        QnA
                    </div>
                    <div className='questionContainer'>
                        <Questionbox/>
                    </div>
                </div>
            </div>
        </>
    )
}