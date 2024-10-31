// components/Carousel.js
import React from "react";
import { useAtom } from "jotai";
import { activeFeatureAtom } from "../../atoms/Atom";

const features = [
  { id: 0, name: "Feature 1", description1: `Fitur Konsultasi Online melalui video call di aplikasi ini dirancang untuk memudahkan peternak yang memiliki hewan sakit dalam mendapatkan akses langsung ke dokter hewan. Untuk menggunakan fitur ini, peternak cukup membuka aplikasi, memilih opsi "Konsultasi Online", dan memilih layanan video call. Setelah memilih dokter hewan yang tersedia, peternak dapat memulai video call secara langsung dari aplikasi, di mana dokter hewan akan melakukan konsultasi seputar kondisi hewan secara real-time. Semua ini dapat dilakukan dari ponsel pintar, tanpa perlu aplikasi tambahan.`, description2: `Peternak juga dapat menjadwalkan konsultasi jika dokter hewan tidak tersedia pada saat itu, dan notifikasi akan diberikan untuk mengingatkan waktu konsultasi yang telah dijadwalkan. Aplikasi ini menyediakan fitur perekaman konsultasi, sehingga peternak dapat meninjau kembali arahan dari dokter hewan. Ini memudahkan mereka untuk mengikuti saran atau perawatan lebih lanjut yang telah disarankan.` },
  { id: 1, name: "Feature 2", description1: `Fitur Konsultasi Online melalui video call di aplikasi ini dirancang untuk memudahkan peternak yang memiliki hewan sakit dalam mendapatkan akses langsung ke dokter hewan. Untuk menggunakan fitur ini, peternak cukup membuka aplikasi, memilih opsi "Konsultasi Online", dan memilih layanan video call. Setelah memilih dokter hewan yang tersedia, peternak dapat memulai video call secara langsung dari aplikasi, di mana dokter hewan akan melakukan konsultasi seputar kondisi hewan secara real-time. Semua ini dapat dilakukan dari ponsel pintar, tanpa perlu aplikasi tambahan.`, description2: `Peternak juga dapat menjadwalkan konsultasi jika dokter hewan tidak tersedia pada saat itu, dan notifikasi akan diberikan untuk mengingatkan waktu konsultasi yang telah dijadwalkan. Aplikasi ini menyediakan fitur perekaman konsultasi, sehingga peternak dapat meninjau kembali arahan dari dokter hewan. Ini memudahkan mereka untuk mengikuti saran atau perawatan lebih lanjut yang telah disarankan.` },
  { id: 2, name: "Feature 3", description1: `Fitur Konsultasi Online melalui video call di aplikasi ini dirancang untuk memudahkan peternak yang memiliki hewan sakit dalam mendapatkan akses langsung ke dokter hewan. Untuk menggunakan fitur ini, peternak cukup membuka aplikasi, memilih opsi "Konsultasi Online", dan memilih layanan video call. Setelah memilih dokter hewan yang tersedia, peternak dapat memulai video call secara langsung dari aplikasi, di mana dokter hewan akan melakukan konsultasi seputar kondisi hewan secara real-time. Semua ini dapat dilakukan dari ponsel pintar, tanpa perlu aplikasi tambahan.`, description2: `Peternak juga dapat menjadwalkan konsultasi jika dokter hewan tidak tersedia pada saat itu, dan notifikasi akan diberikan untuk mengingatkan waktu konsultasi yang telah dijadwalkan. Aplikasi ini menyediakan fitur perekaman konsultasi, sehingga peternak dapat meninjau kembali arahan dari dokter hewan. Ini memudahkan mereka untuk mengikuti saran atau perawatan lebih lanjut yang telah disarankan.` },
  { id: 3, name: "Feature 4", description1: `Fitur Konsultasi Online melalui video call di aplikasi ini dirancang untuk memudahkan peternak yang memiliki hewan sakit dalam mendapatkan akses langsung ke dokter hewan. Untuk menggunakan fitur ini, peternak cukup membuka aplikasi, memilih opsi "Konsultasi Online", dan memilih layanan video call. Setelah memilih dokter hewan yang tersedia, peternak dapat memulai video call secara langsung dari aplikasi, di mana dokter hewan akan melakukan konsultasi seputar kondisi hewan secara real-time. Semua ini dapat dilakukan dari ponsel pintar, tanpa perlu aplikasi tambahan.`, description2: `Peternak juga dapat menjadwalkan konsultasi jika dokter hewan tidak tersedia pada saat itu, dan notifikasi akan diberikan untuk mengingatkan waktu konsultasi yang telah dijadwalkan. Aplikasi ini menyediakan fitur perekaman konsultasi, sehingga peternak dapat meninjau kembali arahan dari dokter hewan. Ini memudahkan mereka untuk mengikuti saran atau perawatan lebih lanjut yang telah disarankan.` },
  { id: 4, name: "Feature 5", description1: `Fitur Konsultasi Online melalui video call di aplikasi ini dirancang untuk memudahkan peternak yang memiliki hewan sakit dalam mendapatkan akses langsung ke dokter hewan. Untuk menggunakan fitur ini, peternak cukup membuka aplikasi, memilih opsi "Konsultasi Online", dan memilih layanan video call. Setelah memilih dokter hewan yang tersedia, peternak dapat memulai video call secara langsung dari aplikasi, di mana dokter hewan akan melakukan konsultasi seputar kondisi hewan secara real-time. Semua ini dapat dilakukan dari ponsel pintar, tanpa perlu aplikasi tambahan.`, description2: `Peternak juga dapat menjadwalkan konsultasi jika dokter hewan tidak tersedia pada saat itu, dan notifikasi akan diberikan untuk mengingatkan waktu konsultasi yang telah dijadwalkan. Aplikasi ini menyediakan fitur perekaman konsultasi, sehingga peternak dapat meninjau kembali arahan dari dokter hewan. Ini memudahkan mereka untuk mengikuti saran atau perawatan lebih lanjut yang telah disarankan.` },
  { id: 5, name: "Feature 6", description1: `Fitur Konsultasi Online melalui video call di aplikasi ini dirancang untuk memudahkan peternak yang memiliki hewan sakit dalam mendapatkan akses langsung ke dokter hewan. Untuk menggunakan fitur ini, peternak cukup membuka aplikasi, memilih opsi "Konsultasi Online", dan memilih layanan video call. Setelah memilih dokter hewan yang tersedia, peternak dapat memulai video call secara langsung dari aplikasi, di mana dokter hewan akan melakukan konsultasi seputar kondisi hewan secara real-time. Semua ini dapat dilakukan dari ponsel pintar, tanpa perlu aplikasi tambahan.`, description2: `Peternak juga dapat menjadwalkan konsultasi jika dokter hewan tidak tersedia pada saat itu, dan notifikasi akan diberikan untuk mengingatkan waktu konsultasi yang telah dijadwalkan. Aplikasi ini menyediakan fitur perekaman konsultasi, sehingga peternak dapat meninjau kembali arahan dari dokter hewan. Ini memudahkan mereka untuk mengikuti saran atau perawatan lebih lanjut yang telah disarankan.` },
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
