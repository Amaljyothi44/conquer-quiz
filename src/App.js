import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [question, setQuestion] = useState(null);
  const [dbcount, setDbcount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const selectedOptionRef = useRef(null);
  useEffect(() => {
    const questionUrl = 'https://conquer-api.onrender.com/api/get-next-question/';
    const countUrl = 'https://conquer-api.onrender.com/api/count-mark/';
    const promises = [
      axios.get(questionUrl),
      axios.get(countUrl),
    ];
    Promise.all(promises)
      .then(([questionResponse, countResponse]) => {
     
        setQuestion(questionResponse.data);
        setDbcount(countResponse.data);
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
    const questionUrl = 'https://conquer-api.onrender.com/api/get-next-question/';
    const countUrl = 'https://conquer-api.onrender.com/api/count-mark/';

    const promises = [
      axios.get(questionUrl),
      axios.get(countUrl),
    ];
    Promise.all(promises)
      .then(([questionResponse, countResponse]) => {
        setQuestion(questionResponse.data);
        setDbcount(countResponse.data);
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
      setLoading(true);
      const correctAnswer = question.correctOption;
      const quizId = question.id;
      const isCorrect = value === correctAnswer;
      const postData = { result: isCorrect };
      const updateRepetitionUrl = `https://conquer-api.onrender.com/api/update-repetition/${quizId}/`;
      const countMarkUrl = 'https://conquer-api.onrender.com/api/count-mark/';
  
      const promises = [
        axios.post(updateRepetitionUrl, postData, {
          headers: {
            'Content-Type': 'application/json',
          },
        }),
        axios.post(countMarkUrl, postData, {
          headers: {
            'Content-Type': 'application/json',
          },
        }),
      ];
  
      Promise.all(promises)
        .then(([updateRepetitionResponse, countMarkResponse]) => {
          console.log('Update Repetition Response:', updateRepetitionResponse.data);
          console.log('Count Mark Response:', countMarkResponse.data);
        })
        .catch(error => {
          console.error('Error updating repetition:', error);
        })
        .finally(() => {
          setLoading(false);
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
              <p className='number'>Qs: {question.questionNumber} | {question.subject}</p>
              <div className='mark'><p>{dbcount.mark}</p></div>
              <div className='count'><p>{dbcount.count}</p></div>
              <div className='Question  animatedFadeInUpQuestion'>
                <p>{question.question}</p>
              </div>
              <div className='Option-container animatedFadeInUpQuestion'>
                {question.options.map((option, index) => (
                  <div className={`option ${selectedOption === index ? 'selected' : ''} ${answerSubmitted && question?.correctOption === index ? 'correct' : ''}`}
                    key={index}
                    onClick={() => { handleOptionClick(index); submitAnswer() }}
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
              <div className='link' style={{ backgroundColor: 'blue' }}
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


