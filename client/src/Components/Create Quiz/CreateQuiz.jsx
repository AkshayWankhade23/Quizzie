import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import style from "./Style.module.css";
import QuizLink from './QuizLink';

const CreateQuiz = ({ onClose, onSave }) => {
  const [quizLink, setQuizLink] = useState("");
  const [formData, setFormData] = useState({
    quizName: "",
    quizType: "Q&A",
    questions: [
      {
        questionText: "",
        optionsType: "Text",
        options: ["", ""],
        timer: "OFF",
      },
    ],
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedEllipseIndex, setSelectedEllipseIndex] = useState(0);

  const handleAddEllipse = () => {
    if (formData.questions.length < 5) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        questions: [
          ...prevFormData.questions,
          {
            questionText: "",
            optionsType: "Text",
            options: ["", ""],
            timer: "OFF",
          },
        ],
      }));
      setSelectedEllipseIndex(formData.questions.length);
    }
  };

  const handleDeleteEllipse = (index) => {
    if (formData.questions.length > 1) {
      setFormData((prevFormData) => {
        const updatedQuestions = [...prevFormData.questions];
        updatedQuestions.splice(index, 1);
        return { ...prevFormData, questions: updatedQuestions };
      });
      setSelectedEllipseIndex((prevIndex) =>
        Math.min(index, formData.questions.length - 2)
      );
    }
  };

  const handleChange = (e, ellipseIndex, fieldName) => {
    const { name, value } = e.target;

    if (name.startsWith("questions")) {
      const [_, index, subField] = name.split(".");
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

  const handleDeleteOption = (ellipseIndex, optionIndex) => {
    setFormData((prevFormData) => {
      const updatedQuestions = [...prevFormData.questions];
      const updatedOptions = [...updatedQuestions[ellipseIndex].options];

      if (updatedOptions.length > 2) {
        updatedOptions.splice(optionIndex, 1);
        updatedQuestions[ellipseIndex] = {
          ...updatedQuestions[ellipseIndex],
          options: updatedOptions,
        };
      }

      return { ...prevFormData, questions: updatedQuestions };
    });
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
    if (ellipseIndex < formData.questions.length) {
      setFormData((prevFormData) => {
        const updatedQuestions = [...prevFormData.questions];
        const updatedOptions = [...updatedQuestions[ellipseIndex].options];

        if (updatedOptions.length < 4) {
          updatedQuestions[ellipseIndex] = {
            ...updatedQuestions[ellipseIndex],
            options: [...updatedOptions, ""],
          };
        }

        return { ...prevFormData, questions: updatedQuestions };
      });
    }
  };

  const handleContinue = () => {
    if (currentStep === 1 && (!formData.quizName || !formData.quizType)) {
      toast.error("Quiz name and type are required");
      return;
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
        toast.error("Quiz name, type, and at least one question are required");
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
          toast.error("All fields are required for each question");
          return;
        }
      }

      const response = await axios.post(
        "http://localhost:4000/api/quiz/quizzes",
        {
          name: formData.quizName,
          type: formData.quizType,
          questionsData: formData.questions.map(
            ({ questionText, optionsType, options, timer }) => ({
              text: questionText,
              type: optionsType,
              options: options.map((value) => ({ type: "text", value })),
              timer,
            })
          ),
        }
      );
      console.log('API Response:', response);

      if (response.status >= 200 && response.status < 300) {
        const quizId = response.data._id;;
        const generatedLink = `http://localhost:4000/quiz-link/${quizId}`;
        setQuizLink(generatedLink);
        setCurrentStep((prevStep) => prevStep + 1);

        toast.success("Quiz Created Successfully!");
        onSave();
      } else {
        throw new Error("Failed to save quiz");
      }
    } catch (error) {
      console.error("Error saving quiz:", error);
      toast.error("Failed to save quiz");
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
                  formData.quizType === "Q&A" && style.selected
                }`}
                onClick={() =>
                  handleChange(
                    { target: { name: "quizType", value: "Q&A" } },
                    0
                  )
                }
              >
                Q&A
              </button>

              <button
                className={`${style.button} ${
                  formData.quizType === "Poll" && style.selected
                }`}
                onClick={() =>
                  handleChange(
                    { target: { name: "quizType", value: "Poll" } },
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
              {formData.questions.length < 5 && (
                <div>
                  <button onClick={handleAddEllipse}>+</button>
                </div>
              )}
            </div>

            {selectedEllipseIndex !== null && (
              <div key={selectedEllipseIndex}>
                <div>
                  <input
                    type="text"
                    value={
                      formData.questions[selectedEllipseIndex].questionText
                    }
                    placeholder={`Question ${selectedEllipseIndex + 1}`}
                    onChange={(e) =>
                      handleChange(e, selectedEllipseIndex, "questionText")
                    }
                    name={`questions.${selectedEllipseIndex}.questionText`}
                  />
                </div>
                <div>
                  <label className={style.label}>Option Type </label>
                  <input
                    type="radio"
                    name={`optionsType_${selectedEllipseIndex}`}
                    value="Text"
                    onChange={(e) =>
                      handleChange(e, selectedEllipseIndex, "optionsType")
                    }
                  />
                  <label>Text</label>
                  <input
                    type="radio"
                    name={`optionsType_${selectedEllipseIndex}`}
                    value="Image URL"
                    onChange={(e) =>
                      handleChange(e, selectedEllipseIndex, "optionsType")
                    }
                  />
                  <label>Image URL</label>
                  <input
                    type="radio"
                    name={`optionsType_${selectedEllipseIndex}`}
                    value="Text & Image URL"
                    onChange={(e) =>
                      handleChange(e, selectedEllipseIndex, "optionsType")
                    }
                  />
                  <label>Text & Image URL</label>
                </div>
                {formData.questions[selectedEllipseIndex].options.map(
                  (option, optionIndex) => (
                    <div key={optionIndex}>
                      <input
                        type="text"
                        value={option}
                        placeholder={`Option ${optionIndex + 1}`}
                        onChange={(e) =>
                          handleChangeOption(
                            e,
                            selectedEllipseIndex,
                            optionIndex
                          )
                        }
                        name={`questions.${selectedEllipseIndex}.options.${optionIndex}`}
                      />
                      {optionIndex >= 2 && (
                        <button
                          onClick={() =>
                            handleDeleteOption(
                              selectedEllipseIndex,
                              optionIndex
                            )
                          }
                        >
                          Delete Option
                        </button>
                      )}
                    </div>
                  )
                )}
                {formData.questions[selectedEllipseIndex].options.length <
                  4 && (
                  <div>
                    <button
                      onClick={() => handleAddOption(selectedEllipseIndex)}
                    >
                      Add Option
                    </button>
                  </div>
                )}
                <div className={style.timer_container}>
                  <label className={style.label}>Timer</label>
                  <input
                    type="radio"
                    name={`timer_${selectedEllipseIndex}`}
                    value="OFF"
                    onChange={(e) =>
                      handleChange(e, selectedEllipseIndex, "timer")
                    }
                  />
                  <label>OFF</label>
                  <input
                    type="radio"
                    name={`timer_${selectedEllipseIndex}`}
                    value="5sec"
                    onChange={(e) =>
                      handleChange(e, selectedEllipseIndex, "timer")
                    }
                  />
                  <label>5 sec</label>
                  <input
                    type="radio"
                    name={`timer_${selectedEllipseIndex}`}
                    value="10sec"
                    onChange={(e) =>
                      handleChange(e, selectedEllipseIndex, "timer")
                    }
                  />
                  <label>10 sec</label>
                </div>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={style.overlay}>
    <div className={style.popup}>
      {currentStep === 3 ? (
        <QuizLink onClose={onClose} quizLink={quizLink} />
      ) : (
        <>
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
        </>
      )}
    </div>
  </div>
  );
};

export default CreateQuiz;
