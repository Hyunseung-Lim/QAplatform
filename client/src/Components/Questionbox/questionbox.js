import React, { useState } from 'react'
import './questionbox.css'


export const Questionbox = (props) => {
    return(
        <>
            <div className='questionbox'>
                <div className='contatiner'>
                    <div className='questionbar'>
                        <div className='question'>
                            questions
                        </div>
                        <div className='buttons'>
                            <div className='makepublic'>
                                make public
                            </div>
                            <div>
                                toggle
                            </div>
                            <button>delete</button>
                        </div>
                    </div>
                    <div className='answerbox'>
                        <div className='answer'>
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                        </div>
                        <div className='buttonContainer'>
                            <button>
                                Edit the Answer
                            </button>
                        </div>
                    </div>
                </div>
                <img className='handle' src="images/handle.png" alt="handle" />
            </div>
        </>
    )
}