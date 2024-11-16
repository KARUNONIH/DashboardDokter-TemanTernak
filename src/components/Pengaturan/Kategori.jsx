import BankAndTax from "./BankAndTax";
import Education from "./Education";
import GeneralIdentity from "./GeneralIdentity";
import License from "./License";
import OrganizationExperience from "./OrganizationExperience";
import Specialization from "./Specialization";
import WorkingExperience from "./WorkingExperience";

const Kategori = ({}) => {
  return (
    <div className="flex flex-col gap-8">
      <GeneralIdentity />
      <License />
      <Specialization />
      <Education />
      <WorkingExperience />
      <OrganizationExperience />
      <BankAndTax/>
    </div>
  );
};

export default Kategori;
