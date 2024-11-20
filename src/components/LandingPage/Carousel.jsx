// components/Carousel.js
import React from "react";
import { useAtom } from "jotai";
import { activeFeatureAtom } from "../../atoms/Atom";

const features = [
  {
    id: 0,
    name: "Konsultasi Online (Video Call & Chat)",
    description1: `Fitur ini memberikan kemudahan bagi peternak untuk berkonsultasi dengan dokter hewan secara langsung melalui video call atau chat. Dengan fitur ini, peternak dapat berdiskusi mengenai kondisi hewan mereka tanpa harus meninggalkan lokasi peternakan.`,
    description2: `Fitur ini mendukung penjadwalan ulang apabila dokter tidak tersedia. Peternak juga dapat merekam sesi konsultasi untuk dijadikan referensi di masa mendatang. Semua ini dapat dilakukan dengan mudah melalui ponsel pintar.`,
  },
  {
    id: 1,
    name: "Pembayaran Mudah",
    description1: `Fitur pembayaran dalam aplikasi menyediakan berbagai metode pembayaran, seperti transfer bank, e-wallet, dan kartu kredit, untuk memudahkan transaksi.`,
    description2: `Keamanan data pembayaran menjadi prioritas utama dengan sistem yang telah terintegrasi secara aman. Pengguna juga akan menerima notifikasi dan bukti pembayaran secara otomatis setelah transaksi berhasil.`,
  },
  {
    id: 2,
    name: "Reschedule Konsultasi",
    description1: `Fitur reschedule memungkinkan peternak menjadwalkan ulang konsultasi jika waktu yang telah ditentukan sebelumnya tidak sesuai.`,
    description2: `Notifikasi akan diberikan untuk mengingatkan jadwal konsultasi yang telah diubah. Proses reschedule ini sederhana dan dapat dilakukan langsung melalui aplikasi tanpa memerlukan komunikasi tambahan.`,
  },
  {
    id: 3,
    name: "Resep Dokter",
    description1: `Fitur ini memungkinkan dokter hewan memberikan resep digital berdasarkan hasil konsultasi. Resep ini dapat langsung diakses dan diunduh oleh peternak dari aplikasi.`,
    description2: `Dengan format digital, resep dapat digunakan kapan saja untuk pembelian obat di apotek terdekat atau yang telah bekerja sama dengan aplikasi.`,
  },
  {
    id: 4,
    name: "Komentar dan Feedback",
    description1: `Peternak dapat memberikan komentar atau masukan tambahan mengenai kondisi hewan mereka selama sesi konsultasi berlangsung.`,
    description2: `Fitur ini juga memungkinkan pengguna untuk memberikan feedback mengenai pengalaman mereka, sehingga dokter dan penyedia layanan dapat terus meningkatkan kualitas pelayanan.`,
  },
  {
    id: 5,
    name: "Variasi Layanan",
    description1: `Aplikasi ini menyediakan berbagai pilihan layanan kesehatan hewan, mulai dari konsultasi umum, pemeriksaan khusus, hingga layanan darurat.`,
    description2: `Tersedia juga paket-paket layanan yang dapat dipilih sesuai kebutuhan, seperti paket pencegahan penyakit atau pemeriksaan berkala. Semua ini dirancang untuk memenuhi kebutuhan spesifik peternak.`,
  },
];


const Carousel = () => {
  const [activeFeature, setActiveFeature] = useAtom(activeFeatureAtom);
  const handleNext = () => {
    if (activeFeature === features.length - 1) {
      setActiveFeature(0);
    } else {
      setActiveFeature(activeFeature + 1);
    }
  };

  const handlePrev = () => {
    if (activeFeature === 0) {
      setActiveFeature(features.length - 1);
    } else {
      setActiveFeature(activeFeature - 1);
    }
  };

  return (
    <div className="">
      <h2 className="mb-4 text-sm font-bold md:text-base">{features[activeFeature].name}</h2>
      <p className="mb-4 text-justify text-xs md:text-sm">{features[activeFeature].description1}</p>
      <p className="mb-4 text-justify text-xs md:text-sm">{features[activeFeature].description2}</p>

      <div className="flex justify-center gap-2">
        <button onClick={handlePrev} className="rounded-md bg-gray-300 p-2 hover:bg-gray-400">
          Prev
        </button>
        {features.map((feature, index) => (
          <button key={feature.id} className={`h-4 w-4 rounded-full ${index === activeFeature ? "bg-blue-500" : "bg-gray-300"}`} onClick={() => setActiveFeature(index)} />
        ))}
        <button onClick={handleNext} className="rounded-md bg-gray-300 p-2 hover:bg-gray-400">
          Next
        </button>
      </div>
    </div>
  );
};

export default Carousel;
