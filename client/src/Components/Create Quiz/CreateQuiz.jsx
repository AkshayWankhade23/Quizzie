
// React Component Code
import React, { useState } from "react";
import style from "./Style.module.css";
import { toast } from "react-hot-toast";

const CreateQuiz = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    quizName: "",
    quizType: "",
    question: "",
    optionsType: "",
    options: [],
    timer: "",
  });
  const [currentStep, setCurrentStep] = useState(1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleQuizTypeClick = (selectedQuizType) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      quizType: selectedQuizType,
    }));
  };

  const handleChangeOption = (e, index) => {
    const { value } = e.target;
    setFormData((prevFormData) => {
      const updatedOptions = [...prevFormData.options];
      updatedOptions[index] = value;
      return { ...prevFormData, options: updatedOptions };
    });
  };

  const handleAddOption = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      options: [...prevFormData.options, ""],
    }));
  };

  const handleContinue = () => {
    // Validate form data for the current step
    if (currentStep === 1 && (!formData.quizName || !formData.quizType)) {
      toast.error("Quiz name and type are required");
      return;
    } else if (currentStep === 2 && (!formData.question || !formData.optionsType || !formData.timer)) {
      toast.error("Question, option type, and timer are required");
      return;
    }

    // Move to the next step
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handleCreateQuiz = async () => {
    try {
      // Validate form data for the final step
      if (!formData.quizName || !formData.quizType || !formData.question || !formData.optionsType || !formData.timer) {
        toast.error("All fields are required");
        return;
      }

      // Implement your API call to save quiz data here

      // For demonstration purposes, consider the following:
      const response = await fetch("http://localhost:4000/api/quiz/quizzes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to save quiz");
      }

      // Handle successful save
      const data = await response.json();
      console.log(data.message);
      toast.success("Quiz Created Successfully!");

      // Close the modal or perform any other necessary action
      onSave();

    } catch (error) {
      console.error("Error saving quiz:", error.message);
      // Handle error, show an error message, etc.
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
              onChange={(e) => handleChange(e)}
              className={style.quizName}
              name="quizName"
            />
            <label className={style.label}>Quiz Type</label>
            <div className={style.quizTypeButtons}>
              <button
                className={`${style.button} ${
                  formData.quizType === "Q&A" && style.selected
                }`}
                onClick={() => handleQuizTypeClick("Q&A")}
              >
                Q&A
              </button>
              <button
                className={`${style.button} ${
                  formData.quizType === "Poll" && style.selected
                }`}
                onClick={() => handleQuizTypeClick("Poll")}
              >
                Poll
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <div>
              <input
                type="text"
                value={formData.question}
                placeholder="Q&A Question"
                onChange={(e) => handleChange(e)}
                name="question"
              />
            </div>
            <div>
              <label>Option Type </label>
              <input
                type="radio"
                name="optionsType"
                value="Text"
                onChange={(e) => handleChange(e)}
              />
              <label>Text</label>
              <input
                type="radio"
                name="optionsType"
                value="Image URL"
                onChange={(e) => handleChange(e)}
              />
              <label>Image URL</label>
              <input
                type="radio"
                name="optionsType"
                value="Text & Image URL"
                onChange={(e) => handleChange(e)}
              />
              <label>Text & Image URL</label>
            </div>
            <div>
              {/* Logic to add options */}
              {formData.options.map((option, index) => (
                <input
                  key={index}
                  type="text"
                  value={option}
                  placeholder={`Option ${index + 1}`}
                  onChange={(e) => handleChangeOption(e, index)}
                  name={`options[${index}]`}
                />
              ))}
              {/* Add more options as needed */}
              <button onClick={handleAddOption}>Add Option</button>
            </div>
            <div>
              <label>Timer</label>
              <input
                type="radio"
                name="timer"
                value="OFF"
                onChange={(e) => handleChange(e)}
              />
              <label>OFF</label>
              <input
                type="radio"
                name="timer"
                value="5sec"
                onChange={(e) => handleChange(e)}
              />
              <label>5 sec</label>
              <input
                type="radio"
                name="timer"
                value="10sec"
                onChange={(e) => handleChange(e)}
              />
              <label>10 sec</label>
            </div>
          </div>
        );
      // Add more cases for additional steps as needed
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

