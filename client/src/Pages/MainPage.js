import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useLocation } from 'react-router-dom';

import { Topbar } from '../Components/Topbar/topbar';
import { Questionbox } from '../Components/Questionbox/questionbox';
import { Recommendquestion } from '../Components/Recommendquestion/recommendquestion';
import './page.css'


export const MainPage = (props) => {

    const location = useLocation();
    const { url } = location.state;
    const[title, setTitle] = useState("Title of Research Paper");
    const[authors, setAuthors] = useState("Author Name");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const getTitleApi = 'https://qna-restapi-dxpyj.run.goorm.site/getQuestion/' + String(url).split('/').pop();
                const result = await axios(getTitleApi);
                setTitle(result.data);
            } catch (error) {
                console.error('Error:', error);
            }
        };
        fetchData();
    }, []);

    return(
        <>
            <div className='mainPage'>
                <Topbar/>
                <div className='container'>
                    <div className='title'>
                        {title}
                    </div>
                    <div className='authors'>
                        Author Name, {url}, Author Name, Author Name, Author Name, Author Name, Author Name, Author Name, Author Name
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
                        <button>Recommend Question</button>
                        <Recommendquestion/>
                        <Recommendquestion/>
                    </div>
                    <div className='subtitle'>
                        QnA
                    </div>
                    <div className='questionContainer'>
                        <Questionbox/>
                        <Questionbox/>
                    </div>
                </div>
                <div className='footer'>
                    
                </div>
            </div>
        </>
    )
}