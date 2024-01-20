import React, { useState } from 'react';

const QuizLink = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const openPopup = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = () => {
    // Add your logic here for handling the input value
    // For example, you can save it to state, perform an action, etc.
    console.log('Input submitted:', inputValue);

    // Close the popup
    closePopup();
  };

  return (
    <div>
      <button onClick={openPopup}>Open Quiz Link Popup</button>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <span className="close" onClick={closePopup}>
              &times;
            </span>
            <h2>Enter Quiz Link</h2>
            <input
              type="text"
              placeholder="Enter quiz link"
              value={inputValue}
              onChange={handleInputChange}
            />
            <button onClick={handleSubmit}>Submit</button>
          </div>
        </div>
      )}

      <div>Quiz Link Component</div>
    </div>
  );
};

export default QuizLink;
