import React, { useEffect, useState } from "react";
import "./Signup.css";
import NavBar from "../../compnents/organisms/navBar/NavBar";
import { GoogleLogin, googleLogout, useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";

import axios from "axios";

function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [user, setUser] = useState("");
  const [profile, setProfile] = useState("");

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      console.log("login goood");
      setUser(codeResponse);
    },
    onError: (error) => {
      console.log("failed");
      console.log("Login Failed:", error);
    },
  });

  useEffect(() => {
    if (user) {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => setProfile(res.data))
        .catch((err) => console.log("error", err));
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (fullName && email && password && confirmPassword) {
      if (password.length >= 6 && /\d/.test(password)) {
        if (password === confirmPassword) {
          // add authentication and backend connection here
          console.log("Form submitted successfully!");
        } else {
          setMessage("Passwords do not match");
        }
      } else {
        setMessage(
          "Password must be at least 6 characters and contain at least one number."
        );
      }
    } else {
      setMessage("Please fill in all required fields.");
    }
  };
  console.log("user: ", user);
  console.log("profile: ", profile);
  return (
    <div>
      <NavBar />
      <div className="formBody">
        <div className="signupImg">
          <p>Already have an Account...!</p>
          <br />
          <button type="submit" className="logbtn">
            Login
          </button>
        </div>

        <form className="signupForm" onSubmit={handleSubmit}>
          <div className="cred">
            {" "}
            <h2 className="signupform-h2">Sign up</h2>
            <p className="signupform-p">
              Sign up for Tasktrec today and start getting things done!
            </p>
          </div>

          <div className="fullname cred">
            <label className="formlabel" htmlFor="fullName">
              Full Name{" "}
            </label>
            <input
              type="text"
              name="fullName"
              id="fullName"
              className="forminput"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="email cred">
            <label className="formlabel" htmlFor="email">
              Email{" "}
            </label>
            <input
              type="email"
              id="email"
              className="forminput"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="password cred">
            <label className="formlabel" htmlFor="password">
              Password{" "}
            </label>
            <input
              className="forminput"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="confirm-password cred">
            <label className="formlabel" htmlFor="confirmPassword">
              Confirm Password{" "}
            </label>
            <input
              className="forminput"
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <p className="message">{message}</p>
            <br />
          </div>

          <button type="submit" className="signupbtn cred">
            Sign Up
          </button>
          <div className="cred" id="signInDiv">
           
          </div>
        </form>
        <div className="cred" id="signInDiv">
        
          <button onClick={login} className = "signupButton">
            <FcGoogle className="mr-4" /> Sign in with your Google Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default Signup;
