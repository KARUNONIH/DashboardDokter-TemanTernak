import { useAtom } from "jotai";
import MainLogin from "../components/Login/MainLogin";
import SideLogin from "../components/Login/SideLogin";
import { activeFormRegistrationAtom, errorApiAtom, loginAtom, preSignupAtom, sessionSignAtom, signupStatusAtom, signupAtom, statusRegistationAtom, newDataSignupAtom } from "../atoms/Atom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Post from "../fetchAPI/Post";
import GetAuthorization from "../fetchAPI/GetAuthorization";
import PostAuthorization from "../fetchAPI/PostAuthorization";

const Login = ({ sign }) => {
  const [dataPreSignup, setDataPreSignup] = useAtom(preSignupAtom);
  const [dataLogin, setDataLogin] = useAtom(loginAtom);
  const [dataSignup, setDataSignup] = useAtom(signupAtom);
  const [registration, registrationProggres] = useAtom(activeFormRegistrationAtom);
  const [statusRegistration, setStatusRegistration] = useAtom(statusRegistationAtom);
  const [dataRegistration, setDataRegistration] = useAtom(newDataSignupAtom);

  const navigate = useNavigate();

  const endpoint = {
    preSignup: "https://api.temanternak.h14.my.id/users",
    signup: "https://api.temanternak.h14.my.id/registrations/veterinarians",
    signin: "https://api.temanternak.h14.my.id/authentications",
    statusUser: "https://api.temanternak.h14.my.id/users/my",
    dataUser: "https://api.temanternak.h14.my.id/users/my/registrations",
  };

  const { data: preSignupData, loading: preSignupLoading, error: preSignupError, fetchData: fetchPreSignup } = Post(endpoint.preSignup, dataPreSignup);
  const { data: signupData, loading: signupLoading, error: signupError, fetchData: fetchSignup } = PostAuthorization(endpoint.signup, dataSignup, JSON.parse(localStorage.getItem("token")));
  const { data: signinData, loading: signinLoading, error: signinError, fetchData: fetchSignin } = Post(endpoint.signin, dataLogin);
  const { data: statusUserData, loading: statusUserLoading, error: statusUserError, fetchData: fetchStatusUser } = GetAuthorization(endpoint.statusUser, JSON.parse(localStorage.getItem("token")));
  const { data: dataUserData, loading: dataUserLoading, error: dataUserError, fetchData: fetchDataUser } = GetAuthorization(endpoint.dataUser, JSON.parse(localStorage.getItem("token")));

  const preSignup = async () => {
    const result = await fetchPreSignup();
    if (result) {
      console.log(result);
      navigate("/signin");
    }
  };

  const signup = async () => {
    console.log(dataSignup);

    const result = await fetchSignup();
    if (result) {
      console.log(result);
      registrationProggres("proggress5");
    } else {
      console.error(signupError);
    }
  };

  useEffect(() => {
    const statusUser = async () => {
      const responseStatus = await fetchStatusUser();
      const responseData = await fetchDataUser();

      if (responseStatus.data.role === "invited-user" && responseData.data.length === 0) {
        registrationProggres("proggress1");
        navigate("/signup");
      } else if (responseStatus.data.role === "veterinarian") {
        navigate("/dashboard");
      } else if (responseStatus.data.role === "invited-user" && responseData.data.length !== 0) {
        setStatusRegistration(true);
        registrationProggres("proggress5");
        setDataRegistration({
          generalIdentity: {
            frontTitle: responseData.data.frontTitle,
            backTitle: responseData.data.backTitle,
            dateOfBirth: responseData.data.dateOfBirth,
            whatsappNumber: responseData.data.whatsappNumber,
            formalPictureId: responseData.data.formalPictureId,
            nik: responseData.data.nik,
            ktpFileId: responseData.data.ktpFileId,
            biodata: responseData.data.biodata,
          },
          license: responseData.data.license,
          specializations: responseData.data.specializations,
          educations: responseData.data.educations,
          workingExperiences: responseData.data.workingExperiences,
          organizationExperiences: responseData.data.organizationExperiences,
          bankAndTax: responseData.data.bankAndTax,
          invitationId: responseData.data.invitation.id,
        });
        navigate("/signup");
      }
    };

    statusUser();
  }, [localStorage.getItem("token")]);

  const signin = async () => {
    const result = await fetchSignin();
    if (result) {
      localStorage.setItem("token", JSON.stringify(result.token));
    }
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
