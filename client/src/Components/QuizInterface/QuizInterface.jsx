import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './QuizInterface.css'; // Import the CSS file for styling

const QuizInterface = () => {
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizSubmitted, setQuizSubmitted] = useState(false); // New state variable
  const { quizId } = useParams();

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/quiz/quizzes/${quizId}`);
        if (response.status === 200) {
          setQuizData(response.data);
        } else {
          console.error('Failed to fetch quiz data');
        }
      } catch (error) {
        console.error('Error fetching quiz data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [quizId]);

  const handleOptionSelect = (optionIndex) => {
    setSelectedOptions((prevSelectedOptions) => ({
      ...prevSelectedOptions,
      [currentQuestionIndex]: optionIndex,
    }));
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const handleSubmitQuiz = () => {
    // Add logic to handle quiz submission
    console.log('Quiz submitted!', selectedOptions);

    // Set the quizSubmitted state to true upon submission
    setQuizSubmitted(true);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!quizData) {
    return <div className="error">Failed to fetch quiz data</div>;
  }

  const { name, type, questions } = quizData;
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <div className="quiz-container">
      <h1 className="quiz-title">{name}</h1>
      <p className="quiz-type">Type: {type}</p>

      {quizSubmitted ? (
        <div className="congrats-message">
          Congrats Quiz is completed
          <img  alt="trophy_logo" />
          Your Score is 03/04
        </div>
      ) : (
        <div className="question-container">
          <p className="question-text">{currentQuestion.text}</p>
          <div className="options-container">
            {currentQuestion.optionsType === 'ImageURL' ? (
              <div className="image-options">
                {currentQuestion.options.map((option, optionIndex) => (
                  <img
                    key={optionIndex}
                    src={option.value}
                    alt={`Option ${optionIndex + 1}`}
                    className={`option-image ${
                      selectedOptions[currentQuestionIndex] === optionIndex ? 'selected' : ''
                    }`}
                    onClick={() => handleOptionSelect(optionIndex)}
                  />
                ))}
              </div>
            ) : (
              <ul className="options-list">
                {currentQuestion.options.map((option, optionIndex) => (
                  <li
                    key={optionIndex}
                    onClick={() => handleOptionSelect(optionIndex)}
                    className={`option ${
                      selectedOptions[currentQuestionIndex] === optionIndex ? 'selected' : ''
                    }`}
                  >
                    {option.value}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <p className="timer">Timer: {currentQuestion.timer}</p>
        </div>
      )}

      {!quizSubmitted && (
        <div className="navigation-buttons">
          {isLastQuestion ? (
            <button onClick={handleSubmitQuiz} className="submit-button">
              Submit
            </button>
          ) : (
            <button onClick={handleNextQuestion} className="next-button">
              Next
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizInterface;
