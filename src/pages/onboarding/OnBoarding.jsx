import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./OnBoarding.css";
import axios from "axios";
import { TmsContext } from "../../context/TaskBoardContext";
import toast from "react-hot-toast";
import { server, conf } from "../../config";

function OnBoarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [projectName, setProjectName] = useState("");
  const [projectdescription, setProjectDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [projectToken, setProjectToken] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [move, setMove] = useState(true);

  const navigate = useNavigate();
  const { token, setProjectData, userData } = useContext(TmsContext);

  console.log("toket: ", token);

  const addTask = async (taskData) => {
    const response = await axios("https://tms-gdb08-0923.onrender.com/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      throw new Error("Failed to create task: " + response.statusText);
    }

    const data = await response.json();
    return data;
  };

  const handleAddTask = async () => {
    const taskName = document.getElementById("taskinput").value;
    const taskData = { name: taskName };
    try {
      const createdTask = await addTask(taskData);
      // Update state with the created task data
      setTasks([...tasks, createdTask]);
      // Clear the input field
      document.getElementById("taskinput").value = "";
    } catch (error) {
      // Handle error, e.g. display error message to user
      setError("Failed to create task");
    }
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleNext = () => {
    if (move) {
      setCurrentStep(currentStep + 1);
    }
  };

  const createProject = async () => {
    let data = {
      name: projectName,
      description: projectdescription,
      startDate,
      estimateEndDate: endDate,
    };

    if (token) {
      const response = await server.post("/projects", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      console.log(response);
      if (response && response.data) {
        toast.success("project successfully created", response.data.data);
        setProjectData(response.data.data);
        setProjectToken(response.data.data.id);
      } else {
        toast.error("Failed to create project.");
        console.log(error?.data?.message);
      }
    } else {
      console.log("no token, cannot proceed");
      setMove(false);
    }
  };

  const handleInvite = async () => {
    const emailContent = `${conf.clientbaseURL}/${projectToken}`;

    let data = {
      token: projectToken,
      emails: `${inviteEmail}`, //need to create a list of invitees email
      emailContent,
    };

    const response = await server.post("/invitation", data, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    if (response && response.data) {
      toast.success("invitation successfully sent", response.data);
    } else {
      toast.error("Failed to send an invite.");
      console.log(error?.data?.message);
      setMove(false);
    }
  };

  return (
    <div className="onBoarding">
      {currentStep === 0 && (
        <div className="welcome-card">
          <h1>welcome! {userData.username}</h1>
          <p>
            We are delighted to have you on board. We built{" "}
            <span>TaskTrec</span> to help you or you and your team stay
            organised and to automate work.
          </p>
          <h4>Let's guide you to get started</h4>
          <div className="Btn Btns">
            <button
              onClick={() => {
                navigate("/dashboard");
              }}
            >
              Skip
            </button>
            <button onClick={handleNext}>Get Started</button>
          </div>
        </div>
      )}

      {currentStep === 1 && (
        <div className="create-project">
          <h2 className="createH2">Create your first project</h2>
          <p className="createP">
            Input the name of your project and describe the purpose of that
            project.
          </p>
          <div className="projectCard">
            <label>Name</label>
            <input
              type="text"
              id="projectname"
              name="project-name"
              className="form-input"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />{" "}
            <br />
            <label>starting date : </label>
            <input
              type="date"
              id="start_date"
              name="start_date"
              className="form-input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <br />
            <label>estimate ending date : </label>
            <input
              type="date"
              id="end_date"
              name="end_date"
              className="form-input"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <br />
            <div className="projectField">
              <label>Description</label>
              <textarea
                id="projectdesc"
                className="forminput"
                name="projectdesc"
                value={projectdescription}
                onChange={(e) => setProjectDescription(e.target.value)}
              />
            </div>
          </div>
          <div className="projectBtns Btns">
            <button onClick={handlePrev}>Prev</button>
            <button
              onClick={() => {
                handleNext();
                createProject();
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="create-task">
          <h2>Create tasks</h2>
          <p>
            Divide Your Project into tasks or assign the project to a member if
            it can be handled by just one person
          </p>
          <h4>Backlogs</h4>
          <input type="text" id="taskinput" className="forminput" />
          <button className="addtaskBtn" onClick={handleAddTask}>
            Add Task
          </button>
          {error && <p className="createtaskErr">{error}</p>}
          <div className="Btn Btns">
            <button onClick={handlePrev}>Prev</button>
            <button onClick={handleNext}>Next</button>
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className="invitation">
          <h2>Invitation</h2>
          <p>Invite your team members, share task and get started</p>
          <p>Search example @name...</p>
          <div className="cardForm">
            <input
              type="name"
              id="invitemember"
              name="invitemember"
              placeholder="add email address"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
            />
            <button className="inviteBtn" onClick={handleInvite}>
              Invite Member(s)
            </button>
          </div>
          <div className="inviteBtns Btns">
            <button onClick={handlePrev}>Prev</button>
            <button onClick={handleNext}>Next</button>
          </div>
        </div>
      )}

      {currentStep === 4 && (
        <div className="congratulation">
          <h1>Congratulations! "daisy"</h1>
          <h3>You have created your first project on Tasktrec</h3>
          <p className="congratP">
            Explore more fields on your workspace like Project progress,
            sharing, and generating reports.
          </p>
          <div className="Btn Btns">
            <button onClick={handlePrev}>Prev</button>
            <button
              onClick={() => {
                navigate("/dashboard");
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default OnBoarding;
