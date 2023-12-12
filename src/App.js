import React, { useState, useEffect,useRef } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const selectedOptionRef = useRef(null);
  useEffect(() => {
    axios.get('https://conquer-api.onrender.com/api/get-next-question/')
      .then(response => {
        setQuestion(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      })
      .finally(() => {
        setLoading(false);
        
      });
  }, []);

  const fetchNextQuestion = () => {
    setLoading(true);
    axios.get('https://conquer-api.onrender.com/api/get-next-question/')
      .then(response => {
        setQuestion(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      })
      .finally(() => {
        setLoading(false);
        setSelectedOption(null);
        setAnswerSubmitted(false);
      });
  };
  
  const submitAnswer = () => {
    // Mark the answer as submitted
    setAnswerSubmitted(true);
  };

  const handleOptionClick = (index) => {
    if (!answerSubmitted) {
      selectedOptionRef.current = index;
      setSelectedOption(index);
      submitAnswer2(selectedOptionRef.current)
    }
  };
  
  const submitAnswer2 = (value) => {
 
    if (value !== null) {
      
      const correctAnswer = question.correctOption;
      const quizId = question.id;
      console.log(value);
      console.log(correctAnswer);
      const isCorrect = value === correctAnswer;
      const postData = { result: isCorrect };
      console.log(postData);
    
      axios.post(`http://localhost:8000/api/update-repetition/${quizId}/`, postData, {
        headers: {
          'Content-Type': 'application/json',
        },})
        .then(response => {
          console.log(response.data);
        })
        .catch(error => {
          console.log('Error updating repetition:', error);
        });
    }
  };

  return (
    <div className='Container'>

      <div className='header'>
        <span className='quiz'>Conquer</span>
        <div className='bar-top-line'></div>
      </div>
      <div className='box2' />
      <div className='box3' />
      <div className='box4' />
      
      <div className={`box animated animatedFadeInUp fadeInUp ${loading ? 'loading' : ''}`}>
        <div className='box-container animatedFadeInUpQuestion '>
          {loading ? (
            <div className='loading-spinner'></div>
          ) : (
            <>
              <p>Qs: {question.questionNumber} | {question.subject}</p>
              <div className='Question  animatedFadeInUpQuestion'>
                <p>{question.question}</p>
              </div>
              <div className='Option-container animatedFadeInUpQuestion'>
                {question.options.map((option, index) => (
                  <div className={`option ${selectedOption === index  ? 'selected' : ''} ${answerSubmitted && question?.correctOption === index ? 'correct' : ''}`}
                    key={index}
                    onClick={() => {handleOptionClick(index); submitAnswer()}}
                    style={{ backgroundColor: selectedOption === index && question?.correctOption === index ? '#0d9646' : '' }}
                  >
                    <div className='op-text'>{option}</div>
                  </div>
                ))}
              </div>
              {question.link && (
                <div className='link'>
                  <a href={question.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'white' }}>
                    <div className='op-text'>Link</div>
                  </a>
                </div>
              )}
              <div className='link' style={{backgroundColor:'blue'}}
              onClick={() => { fetchNextQuestion(); }}>
                <div className='op-text'>Next Qus</div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default App


