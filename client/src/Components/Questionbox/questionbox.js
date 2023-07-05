import React, { useState, useRef, useEffect} from 'react'
import './questionbox.css'
import TextareaAutosize from 'react-autosize-textarea';
import ToggleButton from 'react-toggle-button';


export const Questionbox = (props) => {
    const [isEdit, setIsEdit] = useState(false);
    const [isPublic, setIsPublic] = useState(false);
    // const [isWaitAnswer, setIsWaitAnswer] = useState(false);
    const [isFoucs, setIsFocus] = useState(false);
    const [followUpQusetions, setfollowUpQuestions] = useState(["follow up questions?", "hi", "nice to meet you"]);
    const [followClicked, setFollowClicked] = useState(false);
    const [followQuestion, setFollowQuestion] = useState("");
    const [prevAnswer, setPrevAnswer] = useState("");
    const [currentAnswer, setCurrentAnser] = useState("");
    const textAreaRef = useRef(null);

    useEffect(() => {
        setPrevAnswer(props.answer);
        setCurrentAnser(props.answer);
        setIsPublic(props.isPublic);
        // setIsWaitAnswer(props.isWaitAnswer);
        // if(props.isWaitAnswer === false) {
        //     cancelAnswer();
        // }
    }, [])

    useEffect(() => {
        if(textAreaRef.current) {
            textAreaRef.current.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }, [currentAnswer]);

    // useEffect(()=> {
    //     setIsWaitAnswer(props.isWaitAnswer);
    //     if(props.isWaitAnswer === false) {
    //         cancelAnswer();
    //     }
    // }, [props.isWaitAnswer]);

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

    function changePublic(isPublic) {
        props.updatePublic(!isPublic);
        setIsPublic(!isPublic);
    }

    const handleFocus = () => {
        setIsFocus(true);
    };
    
    const handleBlur = () => {
        setIsFocus(false);
    };

    const requestFollowUpQuestion = (question) => {
        setFollowQuestion(question);
        setFollowClicked(true);
    }

    return(
        <div key={props.keyvalue} tabIndex="0" onFocus={handleFocus} onBlur={handleBlur}>
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
                            <ToggleButton
                                className='toggleBtn'
                                inactiveLabel={''}
                                activeLabel={''}
                                colors={{
                                    activeThumb: {
                                        base: 'rgb(164,44,37)'
                                    },
                                    inactiveThumb: {
                                        base: 'rgb(190,154,152)'
                                    },
                                    active: {
                                        base: 'rgb(234,209,207)',
                                        hover: 'rgb(242,217,215)'
                                    },
                                    inactive: {
                                        base: 'rgb(234,209,207)',
                                        hover: 'rgb(242,217,215)'
                                    }
                                }}
                                containerStyle={{width:'42px'}}
                                trackStyle={{width:'42px'}}
                                thumbAnimateRange={[0, 24]}
                                value={ isPublic }
                                onToggle={(value) => {
                                    changePublic(value);
                                }} 
                                />
                            <img src="images/trash.png" className='deleteBtn' onClick={props.deleteQuestion}/>
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
                <img key={props.id} tabIndex="0" className='handle' src="images/handle.svg" alt="handle" {...props.handle} onMouseDown={handleBlur} onMouseUp={handleFocus}/>
            </div>
                {/* <div className='followUpQuestionContainer'>
                    {followClicked ? 
                        <div className='tempoQuestionbox'>
                            <div className='questionbar'>{followQuestion}</div>
                            <div className='answerbox'>Answer is being generated...</div>
                        </div>
                    :
                        (isFoucs ? 
                            (followUpQusetions.map((question, index) => (<div key={index} className='followUpQuestion' onClick={() => requestFollowUpQuestion(question)}>{question}</div>)))
                        :null)
                    }
                </div>  */}
        </div>
    )
}