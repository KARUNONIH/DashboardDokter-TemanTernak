import Button from "./Button";
import { IoMdDownload } from "react-icons/io";
import StepFLow from "./StepFlow";

const Flow = () => {
  return (
    <div className="mx-auto w-4/5">
      <div className="flex">
        <section className="flex-1 pr-8">
          <h1 className="text-3xl font-medium leading-snug">Konsultasi Tanpa Harus Bertemu Dokter Hewan Secara Langsung</h1>
        </section>
        <section className="flex-1">
          <p className="mb-4 text-sm text-gray-500">Konsultasi langsung dengan dokter hewan tanpa harus bertemu secara fisik kini lebih mudah. Melalui aplikasi kami, Anda dapat berbicara dengan dokter hewan profesional dari kenyamanan rumah Anda. Untuk bergabung dan memulai konsultasi, cukup unduh aplikasi kami sekarang.</p>
          <Button color={"green"} label={"Download App"} icon={<IoMdDownload />} className={"gap-2"} />
        </section>
      </div>
      <div className="mt-8 grid grid-cols-3 gap-6">
        <StepFLow image={"registerTemanTernak.png"} step={1} title={"Register Akun"} paragraf={"Daftar untuk membuat akun baru. Isi data diri dan informasi yang diperlukan untuk melanjutkan ke tahap berikutnya."} />
        <StepFLow image={"loginTemanTernak.png"} step={2} title={"Login ke Akun"} paragraf={"Masuk menggunakan akun yang telah didaftarkan untuk mengakses layanan konsultasi."} />
        <StepFLow image={"aksesDashboardTemanTernak.png"} step={3} title={"Akses Dashboard"} paragraf={"Setelah login, Anda akan diarahkan ke dashboard utama di mana Anda dapat melihat berbagai layanan yang tersedia."} />
        <StepFLow image={"memilihDokterTemanTernak.png"} step={4} title={"Pilih Dokter"} paragraf={"Pilih dokter hewan sesuai dengan kebutuhan Anda untuk melakukan konsultasi."} />
        <StepFLow image={"MemilihLayananTemanTernak.png"} step={5} title={"Pilih Layanan"} paragraf={"Pilih layanan yang sesuai, seperti konsultasi langsung, diagnosis, atau layanan lainnya."} />
        <StepFLow image={"bookingTemanTernak.png"} step={6} title={"Booking Konsultasi"} paragraf={"Setelah memilih layanan, lakukan pemesanan dengan memilih waktu yang tepat untuk konsultasi."} />
      </div>
    </div>
  );
};

export default Flow;
