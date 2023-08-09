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
                <button onClick={close}>close</button>
                <div>Additional Prompt</div>
                <textarea value={currentPrompt} onChange={currentPromptHandler}/>
                <button onClick={savePrompt}>save</button>
            </div>
        </>
    )
}