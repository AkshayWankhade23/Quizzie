import style from "./Style.module.css";
import { useState } from "react";
import {useNavigate} from "react-router-dom";
import Dashboard from "../../Components/Dashboard/Dashboard";
import Analytics from "../../Components/Analytics/Analytics";
import CreateQuiz from "../../Components/Create Quiz/CreateQuiz";

const DashboardPage = () => {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("user")
  );
  const [activeButton, setActiveButton] = useState("dashboard");
  const [isCreateQuizPopupOpen, setCreateQuizPopupOpen] = useState(false);

  console.log(localStorage.getItem("token"));
  
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("name");
    localStorage.removeItem("token");
    setIsLoggedIn(false); 
    navigate("/");
  };

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
    if (buttonName === "createQuiz") {
      setCreateQuizPopupOpen(true);
    }
  };

  const closeCreateQuizPopup = () => {
    setCreateQuizPopupOpen(false);
  };

  const saveQuizData = (data) => {
    // Handle saving data for creating a quiz
    console.log("Saved quiz data:", data);
  };

  // Define a mapping of button names to their corresponding components
  const components = {
    dashboard: <Dashboard />,
    analytics: <Analytics />,
  };

  return (
    <div className={style.container}>
      <div className={style.right_container}>
        <h3>QUIZZIE</h3>
        <div>
          <button
            className={`${style.button} ${
              activeButton === "dashboard" && style.active
            }`}
            onClick={() => handleButtonClick("dashboard")}
          >
            Dashboard
          </button>
        </div>
        <div>
          <button
            className={`${style.button} ${
              activeButton === "analytics" && style.active
            }`}
            onClick={() => handleButtonClick("analytics")}
          >
            Analytics
          </button>
        </div>
        <div>
        <button
            className={`${style.button} ${
              activeButton === "createQuiz" && style.active
            }`}
            onClick={() => handleButtonClick("createQuiz")}
          >
            Create Quiz
          </button>
        </div>
        <div className={style.line}></div>
        <div>
          <button onClick={handleLogout} className={style.logout_btn}>Logout</button>
        </div>
      </div>

      <div></div>
      {/* Conditionally render the component based on the active button */}
      {components[activeButton]}
      {isCreateQuizPopupOpen && (
          <CreateQuiz onClose={closeCreateQuizPopup} onSave={saveQuizData} />
        )}
    </div>
  );
};

export default DashboardPage;
