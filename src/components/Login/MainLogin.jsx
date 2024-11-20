import { Link } from "react-router-dom";
import { useAtom } from "jotai";
import FormRegistration from "./FormRegistration";
import { activeFormRegistrationAtom } from "../../atoms/Atom";

const MainLogin = ({ sign, signin, signup, preSignup, invitationId }) => {
  const [registration, registrationProggres] = useAtom(activeFormRegistrationAtom);

  return (
    <div className="w-[500px] flex justify-center items-center">
      <div className="">
        <section className="flex flex-col justify-center items-center gap-1 mb-6">
          <img src="/asset/stars.png" alt="" className="aspect-square w-14 " />
          <h1 className="text-xl font-semibold">Create a Doctor Account</h1>
          <p className="text-sm text-gray-500">Provide your email and choose a password</p>
        </section>
        <FormRegistration type={sign} signin={signin} signup={signup} preSignup={preSignup} />
        {sign === "signin" && (
        <p className={`text-center mt-6 text-sm capitalize`}>
          doesn't have an account ? <Link to={`/signup?invitationId=${invitationId}`} className="underline text-blue-600">sign up</Link>
        </p>
        )}

        {sign === "signup" && registration === "proggress5" && (
          <button type="button" className={`text-center mt-6 text-sm capitalize`} onClick={() => registrationProggres("proggress1")}>
            Lihat berkas pendaftaran anda
        </button>
        )}
      </div>
    </div>
  );
};

export default MainLogin;
