import { useAtom } from "jotai";
import MainLogin from "../components/Login/MainLogin";
import SideLogin from "../components/Login/SideLogin";
import { activeFormRegistrationAtom, errorApiAtom, loginAtom, preSignupAtom, sessionSignAtom, signupStatusAtom, signupAtom, statusRegistationAtom, newDataSignupAtom, errorLoginAtom } from "../atoms/Atom";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Post from "../fetchAPI/Post";
import GetAuthorization from "../fetchAPI/GetAuthorization";
import PostAuthorization from "../fetchAPI/PostAuthorization";
import PutAuthorization from "../fetchAPI/PutAuthorization";

const Login = ({ sign }) => {
  const [dataPreSignup, setDataPreSignup] = useAtom(preSignupAtom);
  const [dataLogin, setDataLogin] = useAtom(loginAtom);
  const [dataSignup, setDataSignup] = useAtom(signupAtom);
  const [registration, registrationProggres] = useAtom(activeFormRegistrationAtom);
  const [statusRegistration, setStatusRegistration] = useAtom(statusRegistationAtom);
  const [dataRegistration, setDataRegistration] = useAtom(newDataSignupAtom);
  const [searchParams] = useSearchParams();
  const [isLoggin, setIsLoggin] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [isPreSignup, setIsPreSignup] = useState(false);
  const [errorLogin, setErrorLogin] = useAtom(errorLoginAtom);
  const [isDataRegis, setIsDataRegis] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams.get("invitationId") && sign == "signup") {
      localStorage.setItem("invitationId", JSON.stringify(searchParams.get("invitationId")));
    } else if (!searchParams.get("invitationId") && sign === "signup") {
      navigate("/");
    }
  }, []);

  const invitationIdValue = JSON.parse(localStorage.getItem("invitationId"));


  const endpoint = {
    preSignup: "https://api.temanternak.h14.my.id/users",
    signup: "https://api.temanternak.h14.my.id/registrations/veterinarians",
    signin: "https://api.temanternak.h14.my.id/authentications",
    statusUser: "https://api.temanternak.h14.my.id/users/my",
    dataUser: "https://api.temanternak.h14.my.id/users/my/registrations",
  };

  const { data: preSignupData, loading: preSignupLoading, error: preSignupError, fetchData: fetchPreSignup } = Post(endpoint.preSignup, dataPreSignup);
  const { data: signupData, loading: signupLoading, error: signupError, fetchData: fetchSignup } = PostAuthorization(endpoint.signup, dataRegistration, JSON.parse(localStorage.getItem("token")));
  const { data: editSignupData, loading: editSignupLoading, error: editSignupError, fetchData: fetchEditSignup } = PutAuthorization(endpoint.signup, dataRegistration, JSON.parse(localStorage.getItem("token")));
  const { data: signinData, loading: signinLoading, error: signinError, fetchData: fetchSignin } = Post(endpoint.signin, dataLogin);
  const { data: statusUserData, loading: statusUserLoading, error: statusUserError, fetchData: fetchStatusUser } = GetAuthorization(endpoint.statusUser, JSON.parse(localStorage.getItem("token")));
  const { data: dataUserData, loading: dataUserLoading, error: dataUserError, fetchData: fetchDataUser } = GetAuthorization(endpoint.dataUser, JSON.parse(localStorage.getItem("token")));

  const preSignup = async () => {
    setDataPreSignup((prev) => ({
      ...prev,
      invitationId: invitationIdValue,
    }));
    setIsPreSignup(true);
  };

  useEffect(() => {
    const fetch = async () => {
      const result = await fetchPreSignup();
      if (result) {
        console.log(result);
        navigate(`/signin?invitationId=${invitationIdValue}`);
      }
    };

    if (isPreSignup) {
      fetch();
    }
  }, [dataPreSignup.invitationId]);

  const signup = async () => {
    setDataRegistration((prev) => ({
      ...prev,
      invitationId: invitationIdValue,
    }));
    setIsSignup(true);
  };

  useEffect(() => {
    const fetch = async () => {
      console.log(dataRegistration);
      console.log("status Registration:", statusRegistration);
      let result = "";

      if (statusRegistration) {
        result = await fetchEditSignup();
      } else {
        result = await fetchSignup();
      }

      if (result) {
        console.log("result", statusRegistration ,result);
        localStorage.removeItem("data");
        const response = await fetchDataUser();
        const dataRegis = {
          generalIdentity: {
            frontTitle: response.data[0].frontTitle,
            backTitle: response.data[0].backTitle,
            dateOfBirth: response.data[0].dateOfBirth,
            whatsappNumber: response.data[0].whatsappNumber,
            formalPictureId: response.data[0].formalPictureFileId,
            nik: response.data[0].nik,
            ktpFileId: response.data[0].ktpFileId,
            biodata: response.data[0].biodata,
          },
          license: response.data[0].license,
          specializations: response.data[0].specializations,
          educations: response.data[0].educations,
          workingExperiences: response.data[0].workingExperiences,
          organizationExperiences: response.data[0].organizationExperiences,
          bankAndTax: response.data[0].bankAndTax,
          invitationId: response.data[0].invitation.id,
        };
        localStorage.setItem("data", JSON.stringify(dataRegis));
        registrationProggres("proggress5");
      } else {
        console.error(signupError);
      }
    };

    if (isSignup) {
      fetch()
      setIsSignup(false);
    }
  }, [isSignup]);

  useEffect(() => {
    console.log("data Regis", dataRegistration);
  }, [dataRegistration]);

  useEffect(() => {
    const statusUser = async () => {
      const responseStatus = await fetchStatusUser();
      const responseData = await fetchDataUser();


      if (responseStatus.data.role === "invited-user" && responseData.data.length === 0) {
      localStorage.removeItem("data");
        registrationProggres("proggress1");
        navigate(`/signup?invitationId=${invitationIdValue}`);
      } else if (responseStatus.data.role === "veterinarian") {
      localStorage.removeItem("data");
        navigate("/dashboard");
      } else if (responseStatus.data.role === "invited-user" && responseData.data.length !== 0) {
        navigate(`/signup?invitationId=${invitationIdValue}`);
        setStatusRegistration(true);
        registrationProggres("proggress5");
        const dataRegis = {
          generalIdentity: {
            frontTitle: responseData.data[0].frontTitle,
            backTitle: responseData.data[0].backTitle,
            dateOfBirth: responseData.data[0].dateOfBirth,
            whatsappNumber: responseData.data[0].whatsappNumber,
            formalPictureId: responseData.data[0].formalPictureFileId,
            nik: responseData.data[0].nik,
            ktpFileId: responseData.data[0].ktpFileId,
            biodata: responseData.data[0].biodata,
          },
          license: responseData.data[0].license,
          specializations: responseData.data[0].specializations,
          educations: responseData.data[0].educations,
          workingExperiences: responseData.data[0].workingExperiences,
          organizationExperiences: responseData.data[0].organizationExperiences,
          bankAndTax: responseData.data[0].bankAndTax,
          invitationId: responseData.data[0].invitation.id,
          // revisingId: responseData.data[0].id
        };
        console.log(dataRegis);
        setDataRegistration(dataRegis);
        localStorage.setItem("data", JSON.stringify(dataRegis));
        navigate("/signup");
      }
    };

    if (isLoggin) {
      statusUser();
    }
  }, [localStorage.getItem("token")]);

  

  const signin = async () => {
    const result = await fetchSignin();
    if (result) {
      localStorage.setItem("token", JSON.stringify(result.token));
      setIsLoggin(true);
      setErrorLogin({})
    } else {
      console.log(errorLogin);
      setErrorLogin({message: "Email atau Password Salah"});
    }
  };

  return (
    <div className="flex h-[100dvh] w-[100dvw] items-center justify-center bg-slate-50">
      <div className="flex max-h-full w-max items-center rounded bg-white p-4 shadow">
        <SideLogin sign={sign} invitationId={invitationIdValue}/>
        <MainLogin sign={sign} signin={signin} signup={signup} preSignup={preSignup} invitationId={invitationIdValue}/>
      </div>
    </div>
  );
};

export default Login;
