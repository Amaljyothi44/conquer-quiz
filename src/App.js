import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';
import AddLinkModal from'./AddLinkModal.js'
import BaseURL from './config.js';

const App = () => {
  const [question, setQuestion] = useState(null);
  const [dbcount, setDbcount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const selectedOptionRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [questionLink, setQuestionLink] = useState('');

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveLink = (link) => {
    setQuestionLink(link);
    console.log(questionLink);
  
    const quizId = question.id;
    const postData = {
      'link': link
  }
    axios.patch(`${BaseURL}/api/quiz/${quizId}/`, postData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => {
          console.log(response.data);
        })
        .catch(error => {
          console.log('Error updating repetition:', error);
        });
  };


  useEffect(() => {
    const questionUrl = `${BaseURL}/api/get-next-question/`;
    const countUrl = `${BaseURL}/api/count-mark/`;
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
    const questionUrl = `${BaseURL}/api/get-next-question/`;
    const countUrl = `${BaseURL}/api/count-mark/`;

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
      const updateRepetitionUrl = `${BaseURL}/api/update-repetition/${quizId}/`;
      const countMarkUrl = `${BaseURL}/api/count-mark/`;
  
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
  }
  
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
            <div className='mark'><p>{dbcount.mark}</p></div>
              <div className='count'><p>{dbcount.count}</p></div>
              <div className='count' style={{backgroundColor : '#FF6666'}}><p>{question.eli_len}</p></div>
              <p className='number'>Qs: {question.questionNumber} | {question.subject}</p>
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
              {question.link ? (
                <div className='link' style={{ backgroundColor : '#85E6C5' }}>
                  <a href={question.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#4F6F52'  }}>
                    <div className='op-text' style={{ Color : '#4F6F52' }}>Read Notes</div>
                  </a>
                </div>
              ):(
                <div className='link' onClick={handleOpenModal}>
                    <div className='op-text'>Add Link</div>
                </div>
              )}
              <AddLinkModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveLink} />
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


