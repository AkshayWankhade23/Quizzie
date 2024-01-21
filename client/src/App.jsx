import { Routes, Route } from "react-router-dom";
import './App.css';
import SignUp from "./Pages/SignUp/SignUp"
import DashboardPage from "./Pages/Dashboard/DashboardPage";
import { Toaster } from "react-hot-toast";
import CreateQuiz from "./Components/Create Quiz/CreateQuiz";
import QuizInterface from "./Components/QuizInterface/QuizInterface";

export const server = "http://localhost:4000";

function App() {
  return (
    <>
      <Toaster position="top-center" toastOptions={{ duration: 2000 }} />
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/Dashboard" element={<DashboardPage />} />
        <Route path="/create-quiz" element={<CreateQuiz />} />
        <Route path="/quiz/:quizId" element={<QuizInterface />} />
      </Routes>
    </>
  );
}

export default App;
