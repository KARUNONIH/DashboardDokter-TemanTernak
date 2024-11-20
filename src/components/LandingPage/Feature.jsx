import Button from "./Button";
import { IoMdDownload } from "react-icons/io";
import TypeOfFeature from "./TypeOfFeature";
import Modal from "./Modal";
import { useSetAtom } from "jotai";
import { isModalOpenAtom, activeFeatureAtom } from "../../atoms/Atom";
import { IoMdVideocam } from "react-icons/io";
import { IoMdCash } from "react-icons/io";   
import { IoMdTime } from "react-icons/io";    
import { IoMdPaper } from "react-icons/io";   
import { IoMdChatbubbles } from "react-icons/io"; 
import { IoMdApps } from "react-icons/io"; 
import { FaMagnifyingGlass } from "react-icons/fa6";

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
          <p className="mb-4 text-sm text-gray-500">Nikmati konsultasi dengan dokter hewan secara online melalui video call atau chat. Proses mudah, fleksibel, dan efisien untuk kenyamanan Anda dan hewan peliharaan Anda.</p>
          <Button color={"green"} label={"Learn More"} icon={<FaMagnifyingGlass />} className={"gap-2"} onClick={openModal} />
        </section>
      </div>
      <div className="mt-8 grid grid-cols-3 gap-6">
        <TypeOfFeature icon={<IoMdVideocam />} header={"Konsultasi Video Call & Chat"} paragraf={"Berkomunikasi langsung dengan dokter hewan melalui video call atau chat untuk mendapatkan saran dan bantuan terbaik."} featureIndex={0} />
        <TypeOfFeature icon={<IoMdCash />} header={"Pembayaran Mudah"} paragraf={"Berbagai metode pembayaran tersedia untuk mempermudah proses transaksi Anda."} featureIndex={1} />
        <TypeOfFeature icon={<IoMdTime />} header={"Reschedule"} paragraf={"Kemudahan untuk menjadwalkan ulang konsultasi sesuai dengan waktu yang Anda inginkan."} featureIndex={2} />
        <TypeOfFeature icon={<IoMdPaper />} header={"Resep Dokter"} paragraf={"Dapatkan resep dokter secara langsung berdasarkan hasil konsultasi Anda."} featureIndex={3} />
        <TypeOfFeature icon={<IoMdChatbubbles />} header={"Komentar dan Feedback"} paragraf={"Berikan komentar atau masukan mengenai keluhan hewan peliharaan Anda selama konsultasi."} featureIndex={4} />
        <TypeOfFeature icon={<IoMdApps />} header={"Variasi Layanan"} paragraf={"Beragam layanan tersedia sesuai dengan kebutuhan Anda, mulai dari konsultasi hingga perawatan khusus."} featureIndex={5} />
      </div>
    </div>
  );
};

export default Feature;
