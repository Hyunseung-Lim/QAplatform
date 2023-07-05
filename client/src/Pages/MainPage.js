import React, { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from 'axios';

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
    const { url, username } = location.state;
    const[title, setTitle] = useState("Title of Research Paper");
    const[abstract, setAbstract] = useState("");
    const[authors, setAuthors] = useState("");
    const[currentQuestion, setCurrentQuestion] = useState("");
    const[recommendQs, setRecommendQs] = useState([]);
    const[loadRQs, setLoadRQs] = useState(false);
    const[QnAs, setQnAs] = useState([]);
    const[waitQList, setWaitQList] = useState([]);

    useEffect(() => {
        const load_data = async () => {
            try {
                const getApi = 'https://qna-restapi-dxpyj.run.goorm.site/getMeta/' + String(url).split('/').pop();
                const result = await axios(getApi);
                setTitle(String(result.data.meta[0]));
                setAbstract(String(result.data.meta[1]));
                setAuthors(result.data.meta[2].join(", "));
                axios({
                    method: "POST",
                    url: "https://qna-restapi-dxpyj.run.goorm.site/getQestionsetData",
                    data: {title: String(result.data.meta[0])},
                    headers: {'Content-Type': 'application/json'}
                })
                .then ((response) => {
                    const res =response.data;
                    setQnAs(res);
                })
                .catch(error =>{
                    console.log("error");
                })
            } catch (error) {
                console.error('Error:', error);
            }
        };

        if(title === "Title of Research Paper") {
            load_data();
        }
    }, []);

    useEffect(() => {
        axios({
            method: "POST",
            url: "https://qna-restapi-dxpyj.run.goorm.site/uploadQuestionSet",
            data: {title: title, question_set: QnAs, user: username},
            headers: {'Content-Type': 'application/json'}
        })
        .then ((response) => {
        })
        .catch(error =>{
            console.log("error");
        })
    }, [QnAs]);

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
        .catch(error => {
            setWaitQList(prevData => prevData.filter((item, i) => item.id !== id));
        });
    }

    // async function addFollowUpQuestion (prevQuestion, prevAnswer, question) {
    //     axios({
    //         method: "POST",
    //         url: "https://qna-restapi-dxpyj.run.goorm.site/getFUQuestion",
    //         data: {title: String(result.data.meta[0])},
    //         headers: {'Content-Type': 'application/json'}
    //     })
    //     .then ((response) => {
    //         const res =response.data;
    //         setQnAs(res);
    //     })
    //     .catch(error =>{
    //         console.log("error");
    //     })
    // }

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
        const newQnAs = reorder(
            QnAs,
            result.source.index,
            result.destination.index
        );
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
                        <Link 
                            to = {'/preview'}
                            state = {{ 
                                url: url,
                                title: title,
                                abstract: abstract,
                                authors: authors,
                                QnAs: QnAs,
                                username: username
                                }} 
                            className='previewBtn'
                        >
                            <div>Preview</div>
                        </Link>
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
                    <DragDropContext onDragEnd={onDragEnd}>
                        { (QnAs.length === 0 && waitQList.length === 0) ? <div className='noQuestion'>No Question</div> 
                            :
                            <Droppable droppableId="droppable">
                                {(provided, snapshot) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        // style={getListStyle(snapshot.isDraggingOver)}
                                        className='questionContainer'
                                    >
                                    {QnAs.map((QnA, index) => (
                                        <Draggable key={String(QnA.question + index)} draggableId={String(QnA.question + index)} index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                >
                                                    <Questionbox key={index} keyvalue={index} id={String(QnA.question + index)} question={QnA.question} answer={QnA.answer} isPublic={QnA.isPublic} updateAnswer={(newAnswer)=>updateAnswer(index, newAnswer)} updatePublic={(isPublic)=>updatePublic(index, isPublic)} deleteQuestion={() => deleteQuestion(index)} handle={provided.dragHandleProps}/>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        }
                        <div className='tempoQuestionboxContainer'>
                            {waitQList.map((Q, index) => (
                                <div className='tempoQuestionbox' key={index}>
                                    <div className='questionbar'>{Q.question}</div>
                                    <div className='answerbox'>Answer is being generated...</div>
                                </div>
                            ))}                            
                        </div>
                    </DragDropContext>
                </div>
                <div className='footer'>
                </div>
            </div>
        </>
    )
}