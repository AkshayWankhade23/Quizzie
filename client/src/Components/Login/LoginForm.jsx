import { useState } from "react";
import style from "./Style.module.css";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { server } from "../../App";

const LoginForm = () => {
    
  const navigate = useNavigate();
  const [data, setData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!data.email || !data.password) {
      toast.error("Please fill in both fields.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(`${server}/api/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.error || "Login failed. Please check your credentials.");
        return;
      }

      const responseData = await response.json();
      window.localStorage.setItem("user", responseData.user);
      window.localStorage.setItem("name", responseData.name);
      window.localStorage.setItem("token", responseData.token);

      console.log(localStorage.getItem("token"));
      
      toast.success("Login successful!");
      navigate("/Dashboard");
    } catch (error) {
      console.error(error);
      toast.error("There was a problem with the request, please try again");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={style.container}>

      <div className={style.email}>
      <label className={style.label}>Email</label>
      <input
        className={style.input}
        name="email"
        value={data.email}
        onChange={handleChange}
        type="email"
      />
      </div>
      
      <div className={style.password}>
      <label className={style.label}>Password</label>
      <input
        className={style.input}
        name="password"
        value={data.password}
        onChange={handleChange}
        type="password"
      />
      </div>

      <button onClick={handleSubmit} className={style.button} disabled={isLoading}>
        {isLoading ? "Logging in..." : "Log In"}
      </button>
      
      
    </div>
  );
}

export default LoginForm;