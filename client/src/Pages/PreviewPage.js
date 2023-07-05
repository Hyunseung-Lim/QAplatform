import React from 'react'
import { useLocation, Link } from 'react-router-dom';

import { Topbar } from '../Components/Topbar/topbar';
import { Previewquestionbox } from '../Components/Previewquestionbox/previewquestionbox';
import './page.css'


export const PreviewPage = (props) => {

    const location = useLocation();
    const { url, username, QnAs, title, authors, abstract } = location.state;

    return(
        <>
            <div className='mainPage'>
                <Topbar/>
                <div className='container'>
                    <div className='title'>
                        {title}
                    </div>
                    <div className='authors'>
                        {authors}
                    </div>
                    <div className='abstract'>
                        {abstract}
                    </div>
                    <div className='linkBtnContainer'>
                        <Link to = {url} className='linkBtn' >Link to paper</Link >
                    </div>
                    <div className='questionContainer'>
                        {QnAs.map((QnA, index) => (QnA.isPublic ?
                            <Previewquestionbox key={index} question={QnA.question} answer={QnA.answer}/>
                            :
                            null
                        )
                        )}
                    </div>
                </div>
                <div className='footer'>
                </div>
            </div>
        </>
    )
}