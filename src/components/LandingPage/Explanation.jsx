import DataExplanation from "./DataExplanation";

const Explanation = () => {
  return (
    <div className="h-max w-full bg-black py-10 text-white">
      <div className="m-auto flex w-4/5 items-center">
        <section className="flex-1">
          <h1 className="text-3xl leading-snug pr-10">Lorem ipsum dolor repudiandae? amet consectetur adipisicing elit. Cumque earum doloribus</h1>
        </section>
        <section className="flex-1">
          <p className="text-gray-300 text-sm">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ex nihil necessitatibus earum quaerat dicta quisquam eos tempore atque tempora sint porro impedit tenetur recusandae alias, quae ipsa fuga dolor possimus laudantium, dignissimos similique corporis!</p>
          <section className="flex items-center gap-3 mt-4">
            <DataExplanation data={12} label={"User"} />
            <DataExplanation data={5} label={"Dokter"} />
            <DataExplanation data={20} label={"Total Konsultasi"} />
          </section>
        </section>
      </div>
    </div>
  );
};

export default Explanation;
