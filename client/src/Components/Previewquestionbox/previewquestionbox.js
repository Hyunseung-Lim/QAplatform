import React, { useState } from 'react'
import './previewquestionbox.css'


export const Previewquestionbox = (props) => {

    const[isfold, setIsfold] = useState(true);

    function changeFold() {
        setIsfold(!isfold);
    }

    return(
        <>
            <div className='previewquestionbox'>
                <div className='contatiner'>
                    <div className='questionbar'>
                        <div className='question'>
                            {props.question}
                        </div>
                        {isfold ?
                            <img src="images/down.png" onClick={changeFold} />
                            :
                            <img src="images/up.png" onClick={changeFold} />
                        }
                    </div>
                    {isfold ? null : 
                        <div className='previewAnswerbox'>
                            <div className='answer'>
                                {props.answer}
                            </div>                         
                        </div>
                    }
                </div>
            </div>
        </>
    )
}