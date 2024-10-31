import { Link } from "react-router-dom";
import { useAtom } from "jotai";
import { activeFormRegistrationAtom } from "../../atoms/Atom";
import FormRegistration from "./FormRegistration";

const MainLogin = ({ sign }) => {
  return (
    <div className="w-[500px] flex justify-center items-center">
      <div className="">
        <section className="flex flex-col justify-center items-center gap-1 mb-6">
          <img src="/asset/stars.png" alt="" className="aspect-square w-14 " />
          <h1 className="text-xl font-semibold">Create a Doctor Account</h1>
          <p className="text-sm text-gray-500">Provide your email and choose a password</p>
        </section>
        <FormRegistration type={sign}/>
        <p className={`text-center mt-6 text-sm capitalize ${sign === "signup" ? 'hidden' : 'block'}`}>
          doesn't have an account ? <Link to={"/signup"} className="underline text-blue-600">sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default MainLogin;
