import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useLocation } from 'react-router-dom';

import { Topbar } from '../Components/Topbar/topbar';
import { Questionbox } from '../Components/Questionbox/questionbox';
import { Recommendquestion } from '../Components/Recommendquestion/recommendquestion';
import './page.css'


export const MainPage = (props) => {

    const location = useLocation();
    const { url } = location.state;
    const[title, setTitle] = useState("Title of Research Paper");
    const[authors, setAuthors] = useState([]);
    const[currentQuestion, setCurrentQuestion] = useState("");
    const[recommendQs, setRecommendQs] = useState([]);
    const[QnAs, setQnAs] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const getApi = 'https://qna-restapi-dxpyj.run.goorm.site/getMeta/' + String(url).split('/').pop();
                const result = await axios(getApi);
                setTitle(String(result.data.meta[0]));
                setAuthors(result.data.meta[2]);
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
        try {
            const getApi = 'https://qna-restapi-dxpyj.run.goorm.site/getQuestion/' + String(url).split('/').pop();
            const result = await axios(getApi);
            setRecommendQs(result.data.questions);
        } catch (error) {
            console.error('Error:', error);
        }        
    }

    function addQuestion (question) {
        const answer = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
        setQnAs(prevData => [...prevData, {question: String(question), answer: String(answer), isPublic: false}]);
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

    return(
        <>
            <div className='mainPage'>
                <Topbar/>
                <div className='container'>
                    <div className='title'>
                        {title}
                    </div>
                    <div className='authors'>
                        {authors.map((author, index, arr) => (<span key={index}>{author}{index < arr.length - 1 ? ', ' : ''}</span>))}
                    </div>
                    <div className='previewContainer'>
                        <button>
                            preview
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
                        <button onClick={generateQuestion}>Recommend Question</button>
                        {recommendQs.map((rQ, index) => (<Recommendquestion question={rQ} addRecommendQuestion={() => addRecommendQuestion(rQ, index)}/>))}
                    </div>
                    <div className='subtitle'>
                        QnA
                    </div>
                    <div className='questionContainer'>
                        { QnAs.length === 0 ? <div className='noQuestion'>No Question</div> : QnAs.map((QnA, index) => (
                            <Questionbox key={index} question={QnA.question} answer={QnA.answer} isPublic={QnA.isPublic} updateAnswer={(newAnswer)=>updateAnswer(index, newAnswer)} deleteQuestion={() => deleteQuestion(index)}/>
                        ))}
                    </div>
                </div>
                <div className='footer'>
                </div>
            </div>
        </>
    )
}