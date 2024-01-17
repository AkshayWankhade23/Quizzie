import { Routes, Route } from "react-router-dom";
import './App.css';
import SignUp from "./Pages/SignUp/SignUp";
import { Toaster } from "react-hot-toast";

export const server = "https://joblisting-server.onrender.com";

function App() {
  return (
    <>
      <Toaster position="top-center" toastOptions={{ duration: 2000 }} />
      <Routes>
        <Route path="/" element={<SignUp />} />
      </Routes>
    </>
  );
}

export default App;
