// QuizLink.js
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import style from './Style.module.css';

const QuizLink = ({ onClose, quizLink }) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(quizLink);
    setCopySuccess(true);
    toast.success('Quiz link copied to clipboard!');
  };

  return (
    <div className={style.overlay}>
      <div className={style.popup}>
        <div>
          <label className={style.label}>Quiz Link</label>
          <div className={style.quizLinkContainer}>
            <input type="text" value={quizLink} readOnly />
            <button onClick={handleCopyLink}>{copySuccess ? 'Copied!' : 'Copy Link'}</button>
          </div>
        </div>

        <div className={style.popupButtons}>
          <button className={style.button} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizLink;
