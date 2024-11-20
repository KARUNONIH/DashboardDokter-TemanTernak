import ProggressSideLogin from "./ProggressSideLogin";
import { FiUser } from "react-icons/fi";
import { FaArrowLeftLong } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useAtom } from "jotai";
import { activeFormRegistrationAtom } from "../../atoms/Atom";

const SideLogin = ({ sign, invitationId }) => {
  const [proggressSignUp] = useAtom(activeFormRegistrationAtom);
  const proggress = ["proggress1", "proggress2", "proggress3", "proggress4", "proggress5"];
  const [registration, registrationProggres] = useAtom(activeFormRegistrationAtom);

  const getCondition = (stage) => {
    const currentStageIndex = proggress.indexOf(proggressSignUp);
    const targetStageIndex = proggress.indexOf(stage);

    if (targetStageIndex < currentStageIndex) return "done";
    if (targetStageIndex === currentStageIndex) return "current";
    return "notYet";
  };

  const progressBar = (stage) => { 
    if (stage === "proggress1") return "h-[20%]";
    if (stage === "proggress2") return "h-[40%]";
    if (stage === "proggress3") return "h-[60%]";
    if (stage === "proggress4") return "h-[80%]";
    if (stage === "proggress5") return "h-full";
  }
  return (
    <div className={`flex h-[600px] ${sign === "signup" && proggressSignUp !== "proggress0" ? "w-[400px] pb-4 pl-10 pr-10 pt-6" : "w-0"} flex-col justify-between overflow-hidden rounded bg-gray-300/15 transition-all duration-300 ease-in-out`}>
      <div className="">
        <section className="flex items-center gap-2">
          <img src="/asset/stars.png" alt="" className="aspect-square w-14" />
          <span className="text-nowrap text-2xl font-bold">Teman Ternak</span>
        </section>
        <section className="mt-16 flex h-max gap-6">
          <div className="w-1 bg-gray-300">
            <section className={`${progressBar(proggressSignUp)} w-full bg-green-600 transition-all duration-300 ease-in-out`}></section>
          </div>
          <div className="flex flex-col gap-8">
            <ProggressSideLogin icon={<FiUser />} proggress={"Identitas Umum"} detail={"Provide an email and Password"} condition={getCondition("proggress1")} />
            <ProggressSideLogin icon={<FiUser />} proggress={"Perizinan"} detail={"Enter your verification code"} condition={getCondition("proggress2")} />
            <ProggressSideLogin icon={<FiUser />} proggress={"Pengalaman Profesi"} detail={"Provide a doctor certificate"} condition={getCondition("proggress3")} />
            <ProggressSideLogin icon={<FiUser />} proggress={"Keuangan dan Perpajakan"} detail={"Get ready to work 24/7"} condition={getCondition("proggress4")} />
            <ProggressSideLogin icon={<FiUser />} proggress={"Pendaftaran Selesai"} detail={"Get ready to work 24/7"} condition={getCondition("proggress5")} />
          </div>
        </section>
      </div>
      <div className="">
        <section className="flex items-center justify-between">
          <section className="flex items-center gap-2">
            <span>
              <FaArrowLeftLong />
            </span>
        
        <Link to={"/"} className="text-nowrap font-bold text-gray-600" onClick={() => registrationProggres("proggress1")}>
              Back to Home
            </Link>
          </section>
          <Link to={`/signin?invitationId=${invitationId}`} className="text-nowrap font-bold text-gray-600 hover:underline">
            Sign in
          </Link>
        </section>
      </div>
    </div>
  );
};

export default SideLogin;
