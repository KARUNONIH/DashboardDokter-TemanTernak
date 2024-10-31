import MainLogin from "../components/Login/MainLogin";
import SideLogin from "../components/Login/SideLogin";

const Login = ({ sign }) => {
  return (
    <div className="flex h-[100dvh] w-[100dvw] items-center justify-center bg-slate-50">
      <div className="flex max-h-full w-max items-center rounded p-4 shadow bg-white">
        <SideLogin sign={sign} />
        <MainLogin sign={sign} />
      </div>
    </div>
  );
};

export default Login;
