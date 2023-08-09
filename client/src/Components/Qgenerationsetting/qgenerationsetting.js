import React, { useState, useRef, useEffect} from 'react';

import './qgenerationsetting.css'

export const Qgenerationsetting = (props) => {

    const [prevPrompt, setPrevPrompt] = useState("");
    const [currentPrompt, setCurrentPrompt] = useState("");

    useEffect(()=> {
        setPrevPrompt(props.viewerprompt);
        setCurrentPrompt(props.viewerprompt);
    }, []);


    const currentPromptHandler = (e) => {
        e.preventDefault();
        setCurrentPrompt(e.target.value);
    }

    if (props.isQsetting === false) {
        return null;
    }

    function close () {
        props.closeSetting();
        setCurrentPrompt(prevPrompt);
    }

    function savePrompt () {
        props.updatePrompt(currentPrompt);
        setPrevPrompt(currentPrompt);
    }

    return(
        <>
            <div className='qgenerationsetting'>
                <div className='titleContainer'>
                    <img className='closeBtn' src="images/x.png" alt="x" onClick={close}/>
                    <div className='title'>Additional Prompt</div>
                    <div className='placeHolder'></div>  
                </div>
                <textarea value={currentPrompt} placeholder='Write the prompt you want to ask the question generation model.' onChange={currentPromptHandler}/>
                <button className='saveBtn' onClick={savePrompt}>Save</button>
            </div>
        </>
    )
}