import React, { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from 'axios';

import { Topbar } from '../Components/Topbar/topbar';
import { Questionbox } from '../Components/Questionbox/questionbox';
import { Qgenerationsetting } from '../Components/Qgenerationsetting/qgenerationsetting';
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

    const[isLoading, setIsLoading] = useState(false);
    const location = useLocation();
    const { url, username, userScholarID } = location.state;
    const[title, setTitle] = useState("Title of Research Paper");
    const[abstract, setAbstract] = useState("");
    const[authors, setAuthors] = useState("");
    const[authorInfo, setAuthorInfo] = useState();
    const[currentQuestion, setCurrentQuestion] = useState("");
    const[recommendQs, setRecommendQs] = useState([]);
    const[loadRQs, setLoadRQs] = useState(false);
    const[QnAs, setQnAs] = useState([]);
    const[waitQList, setWaitQList] = useState([]);
    const[viewerprompt, setViewerprompt] = useState("");
    const[isQsetting, setIsQsetting] = useState(false);

    useEffect(() => {
        const load_data = async () => {
            try {
                const getApi = 'https://qna-restapi-dxpyj.run.goorm.site/getMeta/' + String(url).split('/').pop();
                const result = await axios(getApi);
                setTitle(String(result.data.meta[0]));
                setAbstract(String(result.data.meta[1]));
                setAuthors(result.data.meta[2].join(", "));
                await axios({
                    method: "POST",
                    url: "https://qna-restapi-dxpyj.run.goorm.site/getQestionsetData",
                    data: {title: String(result.data.meta[0])},
                    headers: {'Content-Type': 'application/json'}
                })
                .then ((response) => {
                    const res =response.data;
                    if (res != null) {
                        setQnAs(res);
                    }
                })
                .catch(error =>{
                    console.log("error");
                })
                await axios({
                    method: "POST",
                    url: "https://qna-restapi-dxpyj.run.goorm.site/saveAuthorInfo",
                    data: {authorID: String(userScholarID).split('/').pop()},
                    headers: {'Content-Type': 'application/json'}
                })
                .then ((response) => {
                    const res =response.data;
                    if (res != null) {
                        setAuthorInfo(res);
                    }
                })
                .catch(error =>{
                    console.log("error");
                })
            } catch (error) {
                console.error('Error:', error);
            }
            setIsLoading(true);
        };

        if(title === "Title of Research Paper") {
            load_data();
        }
    }, []);

    useEffect(() => {
        axios({
            method: "POST",
            url: "https://qna-restapi-dxpyj.run.goorm.site/uploadQuestionSet",
            data: {
                title: title, 
                question_set: QnAs, 
                user: username
            },
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

    // const generateQuestion = async () => {
    //     setLoadRQs(true);
    //     try {
    //         const getApi = 'https://qna-restapi-dxpyj.run.goorm.site/getQuestion/' + String(url).split('/').pop();
    //         const result = await axios(getApi);
    //         setRecommendQTurn(recommendQTurn + 1);
    //         setRecommendQs(result.data.questions);
    //     } catch (error) {
    //         console.error('Error:', error);
    //     }
    //     setLoadRQs(false);
    // }

    async function generateRecommendQuestion (endpoint) {
        setLoadRQs(true);
        await axios({
            method: "POST",
            url:"https://qna-restapi-dxpyj.run.goorm.site/" + endpoint + "/",
            data: { 
                url: String(url).split('/').pop(),
                authorID: String(userScholarID).split('/').pop(),
                authorInfo: authorInfo,
                title: title,
                abstract: abstract,
                viewer: viewerprompt
            },
            headers: {'Content-Type': 'application/json'}
        })
        .then((response) => {
            const res =response.data;
            setRecommendQs(res.questions);
        })
        .catch(error => {
            console.error('Error:', error);
        });
        setLoadRQs(false);
    }

    async function addQuestion (question) {
        var id = generateRandomKey(5);
        setWaitQList(prevData => [...prevData, {id: id, question: question}]);

        await axios({
            method: "POST",
            url:"https://qna-restapi-dxpyj.run.goorm.site/get_lucy_answer",
            data: { question: question, title: title},
            headers: {'Content-Type': 'application/json'}
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

    async function addFollowUpAnswer (question, index) {
        await axios({
            method: "POST",
            url:"https://qna-restapi-dxpyj.run.goorm.site/get_lucy_answer",
            data: { question: question, title: title},
            headers: {'Content-Type': 'application/json'}
        })
        .then((response) => {
            const res =response.data;
            setQnAs( prevData => {
                const newQnAs = [...prevData];
                newQnAs.splice(index + 1, 0, {question: String(question), answer: String(res.lucy_answer), isPublic: false});
                return newQnAs;
            });
        })
        .catch(error => {
        });
    }

    async function regenerateAnswer (question, updateIndex) {
        await axios({
            method: "POST",
            url:"https://qna-restapi-dxpyj.run.goorm.site/get_lucy_answer",
            data: { question: question, title: title},
            headers: {'Content-Type': 'application/json'}
        })
        .then((response) => {
            const res =response.data;

            setQnAs(prevData => {
                let newData = [...prevData];
                newData.map((QnA, index) => updateIndex === index ? {...QnA, answer: String(res.lucy_answer) } : QnA);
                return newData;
            })
        })
        .catch(error => {
        });
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

    function updateRecommendQuestion (updateIndex, newQuestion) {
        setRecommendQs(prevData => (
            prevData.map((question, index) => updateIndex === index ? newQuestion : question)
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

    function openSetting () {
        setIsQsetting(true);
    }
    
    function closeSetting () {
        setIsQsetting(false);
    }

    function updatePrompt (prompt) {
        setViewerprompt(prompt);
    }

    if(!isLoading) {
        return(
            <>
                <div className='mainPage'>
                    <Topbar/>
                    <div className='loadingContainer'>
                        <div>
                            Loading...
                        </div>
                    </div>
                </div>
            </>
        )
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
                    <div className='subtitleContainer'>
                        <div className='subtitle'>
                            Add Question
                        </div>    
                    </div>
                    <div className='inputContainer'>
                        <input value={currentQuestion} onChange={currentQuestionHandler} placeholder='Type Your Own Question'></input>
                        <button onClick={addCurrentQuestion}>Add +</button>
                    </div>
                    <div className='subtitleContainer'>
                        <div className='subtitle'>
                            Question Recommendation
                        </div>    
                        <div className='settingContainer'>
                            <img className='setting' src="images/setting.png" alt="setting" onClick={openSetting}/>
                            <Qgenerationsetting viewerprompt={viewerprompt} isQsetting={isQsetting} closeSetting={closeSetting} updatePrompt={(prompt) => updatePrompt(prompt)}/>
                        </div>
                    </div>
                    <div className='recommendContainer'>
                        <div className='recommendBtnContainer'>
                            <button className='recommendBtn' disabled={loadRQs} onClick={() => generateRecommendQuestion('getQuestion')}>General Question</button>
                            <button className='recommendBtn' disabled={loadRQs} onClick={() => generateRecommendQuestion('getPersonalizedQ')}>Personalized Question</button>
                        </div>
                        {loadRQs ? <img className='loading' src="images/loading.gif" alt="loading" /> : recommendQs.map((rQ, index) => (<Recommendquestion key={index} question={rQ} addRecommendQuestion={() => addRecommendQuestion(rQ, index)} updateRecommendQuestion={(updateQ) => updateRecommendQuestion(index, updateQ)}/>))}
                    </div>
                    <div className='subtitleContainer'>
                        <div className='subtitle'>
                            QnA
                        </div>    
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
                                                    <Questionbox 
                                                        key={index}
                                                        myIndex={index}
                                                        id={String(QnA.question + index)}
                                                        title ={title}
                                                        abstract = { abstract }
                                                        question={QnA.question}
                                                        answer={QnA.answer}
                                                        isPublic={QnA.isPublic}
                                                        updateAnswer={(newAnswer)=>updateAnswer(index, newAnswer)}
                                                        updatePublic={(isPublic)=>updatePublic(index, isPublic)}
                                                        deleteQuestion={() => deleteQuestion(index)}
                                                        addFollowUpAnswer = {(question, i) => addFollowUpAnswer(question, i)}
                                                        regenerateAnswer = {(question) => regenerateAnswer(question, index)}
                                                        handle={provided.dragHandleProps}
                                                    />
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