import React, { useState, useRef, useEffect} from 'react';
import TextareaAutosize from 'react-autosize-textarea';

import './recommendquestion.css'


export const Recommendquestion = (props) => {

    const [isEdit, setIsEdit] = useState(false);
    const [prevQuestion, setPrevQuestion] = useState("");
    const [currentQuestion, setCurrentQuestion] = useState("");
    const textAreaRef = useRef(null);

    useEffect(()=> {
        setPrevQuestion(props.question);
        setCurrentQuestion(props.question);
    }, []);

    useEffect(() => {
        if(textAreaRef.current) {
            textAreaRef.current.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }, [currentQuestion]);
    
    const currentQuestionHandler = (e) => {
        e.preventDefault();
        setCurrentQuestion(e.target.value);
    }

    function changeIsEdit () {
        setIsEdit(!isEdit);
    }

    function cancelQuestion() {
        setCurrentQuestion(prevQuestion);
        setIsEdit(false);
    }

    function changeQuestion() {
        props.updateRecommendQuestion(currentQuestion);
        setPrevQuestion(currentQuestion);
        setIsEdit(false);
    }

    return(
        <>
            <div className='recommendquestionbox'>
                {isEdit ?
                    <div className='recommendquestion decreaseWidth'>
                        <TextareaAutosize className='editQuestion' ref={textAreaRef} value={currentQuestion} onChange={currentQuestionHandler} onResize={(e) => {}}/>
                    </div> 
                    : 
                    <div className='recommendquestion'>
                        {currentQuestion}
                        <img className='edit' onClick={changeIsEdit} src="images/edit.svg" alt="handle"/>
                    </div>     
                }
                {isEdit ? 
                    <div className='editBtns'><button className='cancelBtn' onClick={cancelQuestion}>cancel</button> <button className='completeBtn' onClick={changeQuestion}>complete</button></div>
                    :
                    <button className='addBtn' onClick={props.addRecommendQuestion}>
                        Add +
                    </button>
                }
            </div>
        </>
    )
}