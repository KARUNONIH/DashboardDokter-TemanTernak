import { useAtom } from "jotai";
import MainLogin from "../components/Login/MainLogin";
import SideLogin from "../components/Login/SideLogin";
import { activeFormRegistrationAtom, errorSignupAtom, preSignupAtom, sessionSignAtom, signupStatusAtom } from "../atoms/Atom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Post from "../fetchAPI/Post";

const Login = ({ sign }) => {
  const [sessionSign, setSessionSign] = useAtom(sessionSignAtom);
  const [activeFormRegistration, setActiveFormRegistration] = useAtom(activeFormRegistrationAtom);
  const [signupStatus, setSignupStatus] = useAtom(signupStatusAtom);
  const [errorSignup, setErrorSignup] = useAtom(errorSignupAtom);
  const [dataPreSignup, setDataPreSignup] = useAtom(preSignupAtom);

  const navigate = useNavigate();

  const signin = () => {
    const token = "hasan-login-teman-teman-123";
    localStorage.setItem("token", token);
    setSessionSign(true);
    navigate("/dashboard");
  };

  const signup = () => {
    console.log("signup");
    // collect all data
    // post data
    // get response
    // if successful set token
    // change state to proggress5
    // return response

    const isSuccess = true;

    if (isSuccess) {
      const token = "hasan-daftar-teman-teman-123";
      localStorage.setItem("token", token);
      setSessionSign(true);
      setSignupStatus(true);
      setActiveFormRegistration("proggress5");
    } else {
      setSessionSign(false);
      setSignupStatus(false);
      setErrorSignup("Lu dokter gadungan");
      setActiveFormRegistration("proggress5");
    }
  };

  const preSignup = () => {
    // const response = Post("http://api.temanternak.h14.my.id/users", dataPreSignup);
    
    // if (response.status === 'success') { }
    setActiveFormRegistration("proggress1");
  };

  return (
    <div className="flex h-[100dvh] w-[100dvw] items-center justify-center bg-slate-50">
      <div className="flex max-h-full w-max items-center rounded bg-white p-4 shadow">
        <SideLogin sign={sign} />
        <MainLogin sign={sign} signin={signin} signup={signup} preSignup={preSignup} />
      </div>
    </div>
  );
};

export default Login;
