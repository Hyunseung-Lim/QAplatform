import React from 'react'
import './recommendquestion.css'


export const Recommendquestion = (props) => {
    return(
        <>
            <div className='recommendquestionbox'>
                <div className='recommendquestion'>
                    {props.question}
                </div>
                <button onClick={props.addRecommendQuestion}>
                    add
                </button>
            </div>
        </>
    )
}