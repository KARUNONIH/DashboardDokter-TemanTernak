import DataExplanation from "./DataExplanation";

const Explanation = () => {
  return (
    <div className="h-max w-full bg-black py-10 text-white">
      <div className="m-auto flex w-4/5 items-center">
        <section className="flex-1">
          <h1 className="pr-10 text-3xl leading-snug">Bersama Kami, Jaga Kesehatan Hewan Ruminansia Anda</h1>
        </section>
        <section className="flex-1">
          <p className="text-sm text-gray-300">Teman Ternak hadir untuk memberikan solusi kesehatan terbaik bagi hewan ruminansia Anda. Dengan dukungan dokter hewan berpengalaman, kami memastikan pelayanan profesional dan efisien untuk kebutuhan ternak Anda.</p>
          <section className="mt-4 flex items-center gap-3">
            <DataExplanation data={12} label={"Pengguna"} />
            <DataExplanation data={5} label={"Dokter"} />
            <DataExplanation data={20} label={"Total Konsultasi"} />
          </section>
        </section>
      </div>
    </div>
  );
};

export default Explanation;
