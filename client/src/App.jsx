import { Routes, Route } from "react-router-dom";
import './App.css';
import SignUp from "./Pages/SignUp/SignUp"
// import Dashboard from "./Components/Dashboard/Dashboard";
import DashboardPage from "./Pages/Dashboard/DashboardPage";
import { Toaster } from "react-hot-toast";

export const server = "http://localhost:4000";

function App() {
  return (
    <>
      <Toaster position="top-center" toastOptions={{ duration: 2000 }} />
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/Dashboard" element={<DashboardPage />} />
      </Routes>
    </>
  );
}

export default App;
