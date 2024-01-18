import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "./Style.module.css";
import { toast } from "react-hot-toast";
import { server } from "../../App";

const SignUpForm = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "", // New state for confirm password
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Check if passwords match
    if (data.password !== data.confirmPassword) {
      toast.error("Password and Confirm Password do not match.");
      return;
    }

    if (!data.name || !data.email || !data.password || !data.confirmPassword) {
      toast.error("Please fill in all fields.");
      return;
    }

    // Send the POST Request
    try {
      const response = await fetch(`${server}/api/user/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.error);
        return;
      }

      const responseData = await response.json();
      window.localStorage.setItem("user", responseData.user.email);
      window.localStorage.setItem("name", responseData.user.name);
      window.localStorage.setItem("token", responseData.token);

      console.log(localStorage);
      console.log(localStorage.getItem("token"));
      
      toast.success("Registration successful!");
      navigate("/Dashboard")
    } catch (error) {
      toast.error("There was a problem with the request, please try again");
    }
  };

  return (
    <div className={style.container}>
      <div className={style.name}>
        <label className={style.label}>Name</label>
        <input
          className={style.input}
          name="name"
          value={data.name}
          onChange={handleChange}
          type={"text"}
        />
      </div>

      <div>
        <label className={style.label}>Email</label>
        <input
          className={style.input}
          name="email"
          value={data.email}
          onChange={handleChange}
          type={"email"}
        />
      </div>

      <div>
        <label className={style.label}>Password</label>
        <input
          className={style.input}
          name="password"
          value={data.password}
          onChange={handleChange}
          type={"password"}
        />
      </div>

      <div>
        <label className={style.label}>Confirm Password</label>
        <input
          className={style.input}
          name="confirmPassword"
          value={data.confirmPassword}
          onChange={handleChange}
          type={"password"}
        />
      </div>

      <button onClick={handleSubmit} className={style.button}>
        Sign-Up
      </button>
    </div>
  );
};

export default SignUpForm;


// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import style from "./Style.module.css";
// import { toast } from "react-hot-toast";
// import { server } from "../../App";

// const SignUpForm = () => {
//   const navigate = useNavigate();
//   const [data, setData] = useState({
//     name: "",
//     mobile: "",
//     email: "",
//     password: "",
//   });
//   const handleChange = (e) => {
//     setData({ ...data, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     if (!data.name || !data.mobile || !data.email || !data.password) {
//       toast.error("Please fill in all fields.");
//       return;
//     }

//     // Send the POST Request
//     try {
//       const response = await fetch(`${server}/api/auth/register`, {
//         method: "POST",
//         headers: {
//           "content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         toast.error(errorData.error);
//         return;
//       }

//       const responseData = await response.json();
//       // console.log(responseData);
//       window.localStorage.setItem("user", responseData.user.email);
//       window.localStorage.setItem("name", responseData.user.name);
//       window.localStorage.setItem("token", responseData.token);
//       toast.success("Registration successful!");
//       navigate("/");
//     } catch (error) {
//       // alert("There was a problem with the request, please try again");
//       toast.error("There was a problem with the request, please try again");
//     }
//   };

//   return (
//     <div className={style.container}>
//       <div className={style.name}>
//         <label className={style.label}>Name</label>
//         <input
//           className={style.input}
//           name="name"
//           value={data.name}
//           onChange={handleChange}
//           type={"text"}
//           placeholder="Name"
//         ></input>
//       </div>

//       <div>
//         <label className={style.label}>Email</label>
//         <input
//           className={style.input}
//           name="email"
//           value={data.email}
//           onChange={handleChange}
//           type={"email"}
//           placeholder="Email"
//         ></input>
//       </div>

//       <div>
//         <label className={style.label}>Password</label>
//         <input
//           className={style.input}
//           name="mobile"
//           value={data.mobile}
//           onChange={handleChange}
//           type={"tel"}
//           placeholder="Mobile"
//         ></input>
//       </div>

//       <div>
//         <label className={style.label}>Confirm Password</label>
//         <input
//           className={style.input}
//           name="password"
//           value={data.password}
//           onChange={handleChange}
//           type={"password"}
//           placeholder="Password"
//         ></input>
//       </div>

//       <button onClick={handleSubmit} className={style.button}>
//         Sign-Up
//       </button>
//     </div>
//   );
// };

// export default SignUpForm;
