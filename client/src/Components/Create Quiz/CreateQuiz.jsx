import React, { useState } from "react";
import style from "./Style.module.css";

const CreateQuiz = ({ onClose, onSave }) => {
  const [quizName, setQuizName] = useState("");
  const [quizType, setQuizType] = useState("");

  const handleSave = () => {
    onSave({ quizName, quizType });
    onClose();
  };

  return (
    <div className={style.overlay}>
      <div className={style.popup}>
        <div>
          <input
            type="text"
            value={quizName}
            placeholder="Quiz name"
            onChange={(e) => setQuizName(e.target.value)}
            className={style.quizName}
          />
        </div>

        <div>
          <label>Quiz Type</label>
            <button className={style.button}>Q & A</button>
            <button className={style.button}>Poll Type</button>
        </div>

        <div className={style.popupButtons}>
          <button className={style.button} onClick={onClose}>Cancel</button>
          <button className={style.button} onClick={handleSave}>Continue</button>
        </div>
      </div>
    </div>
  );
};

export default CreateQuiz;
