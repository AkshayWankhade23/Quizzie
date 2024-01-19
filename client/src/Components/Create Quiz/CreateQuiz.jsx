
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import style from './Style.module.css';

const CreateQuiz = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    quizName: '',
    quizType: 'Q&A',
    questions: [
      {
        questionText: '',
        optionsType: 'Text',
        options: ['', ''],
        timer: 'OFF',
      },
    ],
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [ellipseCount, setEllipseCount] = useState(1);

  const handleAddEllipse = () => {
    if (ellipseCount < 5) {
      setEllipseCount((prevCount) => prevCount + 1);
      setFormData((prevFormData) => ({
        ...prevFormData,
        questions: [
          ...prevFormData.questions,
          {
            questionText: '',
            optionsType: 'Text',
            options: [''],
            timer: 'OFF',
          },
        ],
      }));
    }
  };

  const handleDeleteEllipse = (index) => {
    if (ellipseCount > 1) {
      setEllipseCount((prevCount) => prevCount - 1);
      setFormData((prevFormData) => ({
        ...prevFormData,
        questions: prevFormData.questions.filter((_, i) => i !== index),
      }));
    }
  };

  const handleChange = (e, ellipseIndex) => {
    const { name, value } = e.target;

    if (name.startsWith('questions')) {
      const [fieldName, index, subField] = name.split('.');
      setFormData((prevFormData) => {
        const updatedQuestions = [...prevFormData.questions];
        const updatedQuestion = { ...updatedQuestions[index] };
        updatedQuestion[subField] = value;
        updatedQuestions[index] = updatedQuestion;
        return { ...prevFormData, questions: updatedQuestions };
      });
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleChangeOption = (e, ellipseIndex, optionIndex) => {
    const { value } = e.target;
    setFormData((prevFormData) => {
      const updatedQuestions = [...prevFormData.questions];
      const updatedOptions = [...updatedQuestions[ellipseIndex].options];
      updatedOptions[optionIndex] = value;
      updatedQuestions[ellipseIndex] = {
        ...updatedQuestions[ellipseIndex],
        options: updatedOptions,
      };
      return { ...prevFormData, questions: updatedQuestions };
    });
  };

  const handleAddOption = (ellipseIndex) => {
    setFormData((prevFormData) => {
      const updatedQuestions = [...prevFormData.questions];
      updatedQuestions[ellipseIndex] = {
        ...updatedQuestions[ellipseIndex],
        options: [...updatedQuestions[ellipseIndex].options, ''],
      };
      return { ...prevFormData, questions: updatedQuestions };
    });
  };

  const handleContinue = () => {
    if (currentStep === 1 && (!formData.quizName || !formData.quizType)) {
      toast.error('Quiz name and type are required');
      return;
    } else if (currentStep === 2) {
      for (const question of formData.questions) {
        if (
          !question.questionText ||
          !question.optionsType ||
          !question.timer ||
          question.options.length < 2
        ) {
          toast.error('All fields are required for each question');
          return;
        }
      }
    }

    setCurrentStep((prevStep) => prevStep + 1);
  };

  
  const handleCreateQuiz = async () => {
    try {
      if (
        !formData.quizName ||
        !formData.quizType ||
        formData.questions.length === 0
      ) {
        toast.error('Quiz name, type, and at least one question are required');
        return;
      }
  
      for (const question of formData.questions) {
        if (
          !question.questionText ||
          !question.optionsType ||
          !question.timer ||
          question.options.length < 2 ||
          question.options.some((option) => !option.trim())
        ) {
          toast.error('All fields are required for each question');
          return;
        }
      }
  
      const response = await axios.post(
        'http://localhost:4000/api/quiz/quizzes',
        {
          name: formData.quizName,
          type: formData.quizType,
          questionsData: formData.questions.map(
            ({ questionText, optionsType, options, timer }) => ({
              text: questionText,
              type: optionsType,
              options: options.map((value) => ({ type: 'text', value })),
              timer,
            })
          ),
        }
      );
  
      if (response.status >= 200 && response.status < 300) {
        const data = response.data;
        toast.success('Quiz Created Successfully!');
        onSave();
      } else {
        throw new Error('Failed to save quiz');
      }
    } catch (error) {
      console.error('Error saving quiz:', error);
      toast.error('Failed to save quiz');
    }
  };
  

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <input
              type="text"
              value={formData.quizName}
              placeholder="Quiz name"
              onChange={(e) => handleChange(e, 0)}
              className={style.quizName}
              name="quizName"
            />

            <label className={style.label}>Quiz Type</label>
            <div className={style.quizTypeButtons}>
              <button
                className={`${style.button} ${
                  formData.quizType === 'Q&A' && style.selected
                }`}
                onClick={() =>
                  handleChange(
                    { target: { name: 'quizType', value: 'Q&A' } },
                    0
                  )
                }
              >
                Q&A
              </button>

              <button
                className={`${style.button} ${
                  formData.quizType === 'Poll' && style.selected
                }`}
                onClick={() =>
                  handleChange(
                    { target: { name: 'quizType', value: 'Poll' } },
                    0
                  )
                }
              >
                Poll
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <div className={style.ellipse_div}>
              {formData.questions.map((question, ellipseIndex) => (
                <div key={ellipseIndex} className={style.ellipse}>
                  {ellipseIndex + 1}
                  {ellipseIndex > 0 && (
                    <button onClick={() => handleDeleteEllipse(ellipseIndex)}>
                      x
                    </button>
                  )}
                </div>
              ))}
              {ellipseCount < 5 && (
                <div>
                  <button onClick={handleAddEllipse}>+</button>
                </div>
              )}
            </div>

            {formData.questions.map((question, ellipseIndex) => (
              <div key={ellipseIndex}>
                <div>
                  <input
                    type="text"
                    value={question.questionText}
                    placeholder={`Question ${ellipseIndex + 1}`}
                    onChange={(e) => handleChange(e, ellipseIndex)}
                    name={`questions.${ellipseIndex}.questionText`}
                  />
                </div>
                <div>
                  <label>Option Type </label>
                  <input
                    type="radio"
                    name={`optionsType_${ellipseIndex}`}
                    value="Text"
                    onChange={(e) =>
                      handleChange(e, ellipseIndex, 'optionsType')
                    }
                  />
                  <label>Text</label>
                  <input
                    type="radio"
                    name={`optionsType_${ellipseIndex}`}
                    value="Image URL"
                    onChange={(e) =>
                      handleChange(e, ellipseIndex, 'optionsType')
                    }
                  />
                  <label>Image URL</label>
                  <input
                    type="radio"
                    name={`optionsType_${ellipseIndex}`}
                    value="Text & Image URL"
                    onChange={(e) =>
                      handleChange(e, ellipseIndex, 'optionsType')
                    }
                  />
                  <label>Text & Image URL</label>
                </div>
                <div>
                  {question.options.map((option, optionIndex) => (
                    <input
                      key={optionIndex}
                      type="text"
                      value={option}
                      placeholder={`Option ${optionIndex + 1}`}
                      onChange={(e) =>
                        handleChangeOption(e, ellipseIndex, optionIndex)
                      }
                      name={`questions.${ellipseIndex}.options.${optionIndex}`}
                    />
                  ))}
                  <button onClick={() => handleAddOption(ellipseIndex)}>
                    Add Option
                  </button>
                </div>
                <div>
                  <label>Timer</label>
                  <input
                    type="radio"
                    name={`timer_${ellipseIndex}`}
                    value="OFF"
                    onChange={(e) => handleChange(e, ellipseIndex, 'timer')}
                  />
                  <label>OFF</label>
                  <input
                    type="radio"
                    name={`timer_${ellipseIndex}`}
                    value="5sec"
                    onChange={(e) => handleChange(e, ellipseIndex, 'timer')}
                  />
                  <label>5 sec</label>
                  <input
                    type="radio"
                    name={`timer_${ellipseIndex}`}
                    value="10sec"
                    onChange={(e) => handleChange(e, ellipseIndex, 'timer')}
                  />
                  <label>10 sec</label>
                </div>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={style.overlay}>
      <div className={style.popup}>
        {renderStep()}

        <div className={style.popupButtons}>
          <button className={style.button} onClick={onClose}>
            Cancel
          </button>
          {currentStep === 1 && (
            <button className={style.button} onClick={handleContinue}>
              Continue
            </button>
          )}
          {currentStep === 2 && (
            <button className={style.button} onClick={handleCreateQuiz}>
              Create Quiz
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateQuiz;