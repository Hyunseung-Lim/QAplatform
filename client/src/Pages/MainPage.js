import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useLocation } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { Topbar } from '../Components/Topbar/topbar';
import { Questionbox } from '../Components/Questionbox/questionbox';
import { Recommendquestion } from '../Components/Recommendquestion/recommendquestion';
import './page.css'


// a little function to help us with reordering the result
const reorder = (array, fromIndex, toIndex) => {
    const elementToMove = array.splice(fromIndex, 1)[0];
    array.splice(toIndex, 0, elementToMove);
    return array;
};

const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

const generateRandomKey = (length) => {
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

export const MainPage = (props) => {

    const location = useLocation();
    const { url } = location.state;
    const[title, setTitle] = useState("Title of Research Paper");
    const[authors, setAuthors] = useState("");
    const[currentQuestion, setCurrentQuestion] = useState("");
    const[recommendQs, setRecommendQs] = useState([]);
    const[loadRQs, setLoadRQs] = useState(false);
    const[QnAs, setQnAs] = useState([]);
    const[waitQList, setWaitQList] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const getApi = 'https://qna-restapi-dxpyj.run.goorm.site/getMeta/' + String(url).split('/').pop();
                const result = await axios(getApi);
                setTitle(String(result.data.meta[0]));
                setAuthors(result.data.meta[2].join(", "));
            } catch (error) {
                console.error('Error:', error);
            }
        };
        fetchData();
    }, []);

    const currentQuestionHandler = (e) => {
        e.preventDefault();
        setCurrentQuestion(e.target.value);
    }

    const generateQuestion = async () => {
        setLoadRQs(true);
        try {
            const getApi = 'https://qna-restapi-dxpyj.run.goorm.site/getQuestion/' + String(url).split('/').pop();
            const result = await axios(getApi);
            setRecommendQs(result.data.questions);
        } catch (error) {
            console.error('Error:', error);
        }
        setLoadRQs(false);
    }

    async function addQuestion (question) {
        var id = generateRandomKey(5);
        setWaitQList(prevData => [...prevData, {id: id, question: question}]);

        await axios({
            method: "POST",
            url:"https://port-0-authorplatfomserver-7xwyjq992lljff6sw0.sel4.cloudtype.app/get_lucy_answer",
            data: { question: question, title: title}
        })
        .then((response) => {
            const res =response.data;
            setQnAs(prevData => [...prevData, {question: String(question), answer: String(res.lucy_answer), isPublic: false}]);
            setWaitQList(prevData => prevData.filter((item, i) => item.id !== id));
        })
    }

    function deleteQuestion (index) {
        setQnAs(prevData => prevData.filter((item, i) => i !== index));
    }

    function addRecommendQuestion (question, index) {
        addQuestion(question);
        setRecommendQs(prevData => {
            let newArray = [...prevData];
            newArray.splice(index, 1);
            return newArray;
        })
    }

    function addCurrentQuestion () {
        if(currentQuestion !== "") {
            addQuestion(currentQuestion);
            setCurrentQuestion("");
        }
    }

    function updateAnswer (updateIndex, newAnswer) {
        setQnAs(prevData => (
            prevData.map((QnA, index) => updateIndex === index ? {...QnA, answer: newAnswer } : QnA)
        ));
    }

    function updatePublic (updateIndex, isPublic) {
        setQnAs(prevData => (
            prevData.map((QnA, index) => updateIndex === index ? {...QnA, isPublic: isPublic } : QnA)
        ));
    }

    function onDragEnd(result) {
        // dropped outside the list
        if (!result.destination) {
            return;
        }
        console.log("onDargEnd:", QnAs);
        const newQnAs = reorder(
            QnAs,
            result.source.index,
            result.destination.index
        );
        console.log(newQnAs);
        setQnAs(newQnAs);
    }

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
                    <div className='previewContainer'>
                        <button className='previewBtn'>
                            Preview
                        </button>
                    </div>
                    <div className='subtitle'>
                        Add Question
                    </div>
                    <div className='inputContainer'>
                        <input value={currentQuestion} onChange={currentQuestionHandler} placeholder='Type Your Own Question'></input>
                        <button onClick={addCurrentQuestion}>Add +</button>
                    </div>
                    <div className='subtitle'>
                        Question Recommendation
                    </div>
                    <div className='recommendContainer'>
                        <button className='recommendBtn' disabled={loadRQs} onClick={generateQuestion}>Recommend Question</button>
                        {loadRQs ? <img className='loading' src="images/loading.gif" alt="loading" /> : recommendQs.map((rQ, index) => (<Recommendquestion key={index} question={rQ} addRecommendQuestion={() => addRecommendQuestion(rQ, index)}/>))}
                    </div>
                    <div className='subtitle'>
                        QnA
                    </div>
                    <DragDropContext className='questionContainer' onDragEnd={onDragEnd}>
                        { (QnAs.length === 0 && waitQList.length === 0) ? <div className='noQuestion'>No Question</div> 
                            :
                            <Droppable droppableId="droppable">
                                {(provided, snapshot) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        // style={getListStyle(snapshot.isDraggingOver)}
                                    >
                                    {QnAs.map((QnA, index) => (
                                        <Draggable key={String(QnA.question + index)} draggableId={String(QnA.question + index)} index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                >
                                                    <Questionbox key={index} id={String(QnA.question + index)} question={QnA.question} answer={QnA.answer} isPublic={QnA.isPublic} updateAnswer={(newAnswer)=>updateAnswer(index, newAnswer)} updatePublic={(isPublic)=>updatePublic(index, isPublic)} deleteQuestion={() => deleteQuestion(index)} handle={provided.dragHandleProps}/>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        }
                        {waitQList.map((Q, index) => (
                            <div className='tempoQuestionbox' key={index}>
                                <div className='questionbar'>{Q.question}</div>
                                <div className='answerbox'>Answer is being generated...</div>
                            </div>
                        ))}
                    </DragDropContext>
                </div>
                <div className='footer'>
                </div>
            </div>
        </>
    )
}