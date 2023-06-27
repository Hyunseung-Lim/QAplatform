import React, { useState, useRef, useEffect} from 'react'
import './questionbox.css'
import TextareaAutosize from 'react-autosize-textarea';



export const Questionbox = (props) => {

    const [isEdit, setIsEdit] = useState(false);
    const [prevAnswer, setPrevAnswer] = useState("");
    const [currentAnswer, setCurrentAnser] = useState("");
    const textAreaRef = useRef(null);

    useEffect(() => {
        setPrevAnswer(props.answer);
        setCurrentAnser(props.answer);
    }, [])

    useEffect(() => {
        if(textAreaRef.current) {
            textAreaRef.current.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }, [currentAnswer]);

    const currentAnswerHandler = (e) => {
        e.preventDefault();
        setCurrentAnser(e.target.value);
    }

    function changeIsEdit() {
        setCurrentAnser(props.answer);
        setIsEdit(true);
        if(textAreaRef.current) {
            textAreaRef.current.focus();
        }
    }

    function cancelAnswer() {
        setCurrentAnser(prevAnswer);
        setIsEdit(false);
    }

    function changeAnswer() {
        props.updateAnswer(currentAnswer);
        setPrevAnswer(currentAnswer);
        setIsEdit(false);
    }

    return(
        <>
            <div className='questionbox'>
                <div className='contatiner'>
                    <div className='questionbar'>
                        <div className='question'>
                            {props.question}
                        </div>
                        <div className='buttons'>
                            <div className='makepublic'>
                                make public
                            </div>
                            <div>
                                toggle
                            </div>
                            <button onClick={props.deleteQuestion}>delete</button>
                        </div>
                    </div>
                    <div className='answerbox'>
                        <div className='answer'>
                            {isEdit ? <TextareaAutosize className='editAnswer' ref={textAreaRef} value={currentAnswer} onChange={currentAnswerHandler} onResize={(e) => {}}/> : <div>{props.answer}</div>}
                        </div>
                        <div className='buttonContainer'>
                            {isEdit ? <div className='editBtns'><button className='cancelBtn' onClick={cancelAnswer}>cancel</button> <button className='completeBtn' onClick={changeAnswer}>complete</button></div> : <button onClick={changeIsEdit}>Edit the Answer</button>}
                        </div>
                    </div>
                </div>
                <img className='handle' src="images/handle.png" alt="handle" />
            </div>
        </>
    )
}