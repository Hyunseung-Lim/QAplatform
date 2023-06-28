import React from 'react'
import './recommendquestion.css'


export const Recommendquestion = (props) => {
    return(
        <>
            <div className='recommendquestionbox'>
                <div className='recommendquestion'>
                    {props.question}
                </div>
                <button className='addBtn' onClick={props.addRecommendQuestion}>
                    Add +
                </button>
            </div>
        </>
    )
}