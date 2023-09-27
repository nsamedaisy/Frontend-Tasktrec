import { createContext, useState } from "react";

export const TmsContext = createContext({});

const ContextProvider = ({ children }) => {
  // const [token, setToken] = useState("");

  const [projectData, setProjectData] = useState({});
  const [selectedProject, setSelectedProject] = useState({});
  const [projectStatus, setProjectStatus] = useState({});
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isRefreshSuccess, setIsRefreshSuccess] = useState(true);
  const [isRefreshError, setIsRefreshError] = useState(false);
  const [memberofProject, setMembersofProject] = useState([]);

  console.log("project data", projectData);

  const values = {
    errorMsg,
    setErrorMsg,
    projectData,
    setProjectData,
    email,
    setEmail,
    // taskdata,
    // setTaskdata,
    isRefreshSuccess,
    setIsRefreshSuccess,
    isRefreshError,
    setIsRefreshError,
    selectedProject,
    setSelectedProject,
    projectStatus,
    setProjectStatus,
    memberofProject,
    setMembersofProject,
  };

  return <TmsContext.Provider value={values}>{children} </TmsContext.Provider>;
};

export default ContextProvider;
