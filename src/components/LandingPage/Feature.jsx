import Button from "./Button";
import { IoMdDownload } from "react-icons/io";
import TypeOfFeature from "./TypeOfFeature";
import Modal from "./Modal";
import { useSetAtom } from "jotai";
import { isModalOpenAtom, activeFeatureAtom } from "../../atoms/Atom";

const Feature = () => {
  const setModalOpen = useSetAtom(isModalOpenAtom);
  const setActiveFeature = useSetAtom(activeFeatureAtom);

  const openModal = () => {
    console.log("first");
      setActiveFeature(0);
      setModalOpen(true);
      console.log("Last");
  };

  return (
    <div className="mx-auto w-4/5">
      <Modal />
      <div className="flex">
        <section className="flex-1 pr-8">
          <h1 className="text-3xl font-medium leading-snug">Konsultasi Tanpa Harus Bertemu Dokter Hewan Secara Langsung</h1>
        </section>
        <section className="flex-1">
          <p className="mb-4 text-sm text-gray-500">Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus voluptatum iusto corporis minima repudiandae, eos exercitationem ea iste consequuntur temporibus consectetur ad quos molestias dolorem assumenda, id doloremque?</p>
          <Button color={"green"} label={"Learn More"} icon={<IoMdDownload />} className={"gap-2"} onClick={openModal} />
        </section>
      </div>
      <div className="mt-8 grid grid-cols-3 gap-6">
        <TypeOfFeature icon={<IoMdDownload />} header={"Konsultasi Online"} paragraf={"Konsultasi Dilakukan Secara Online Melalui Aplikasi Sesuai dengan preferensi pengguna"} featureIndex={0} />
        <TypeOfFeature icon={<IoMdDownload />} header={"Konsultasi Online"} paragraf={"Konsultasi Dilakukan Secara Online Melalui Aplikasi Sesuai dengan preferensi pengguna"} featureIndex={1} />
        <TypeOfFeature icon={<IoMdDownload />} header={"Konsultasi Online"} paragraf={"Konsultasi Dilakukan Secara Online Melalui Aplikasi Sesuai dengan preferensi pengguna"} featureIndex={2} />
        <TypeOfFeature icon={<IoMdDownload />} header={"Konsultasi Online"} paragraf={"Konsultasi Dilakukan Secara Online Melalui Aplikasi Sesuai dengan preferensi pengguna"} featureIndex={3} />
        <TypeOfFeature icon={<IoMdDownload />} header={"Konsultasi Online"} paragraf={"Konsultasi Dilakukan Secara Online Melalui Aplikasi Sesuai dengan preferensi pengguna"} featureIndex={4} />
        <TypeOfFeature icon={<IoMdDownload />} header={"Konsultasi Online"} paragraf={"Konsultasi Dilakukan Secara Online Melalui Aplikasi Sesuai dengan preferensi pengguna"} featureIndex={5} />
      </div>
    </div>
  );
};

export default Feature;
