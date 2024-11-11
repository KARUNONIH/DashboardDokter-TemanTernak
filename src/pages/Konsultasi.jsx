import AppointmentsCalendar from "../components/konsultasi/AppointmentsCalendar";
import Modal from "../components/konsultasi/Modal";

const Konsultasi = () => {
  return (
    <div className="bg-slate-50 px-8 py-4">
      <Modal/>
      <AppointmentsCalendar/>
    </div>
  );
};

export default Konsultasi;