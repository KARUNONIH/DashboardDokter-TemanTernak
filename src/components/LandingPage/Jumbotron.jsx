import React from "react";
import Button from "./Button";
import { Link } from "react-router-dom";

const Jumbotron = ({ flowRef }) => {
  const scrollToSection = (ref, offset = 70) => {
    console.log("Scroll to position:");
    const elementPosition = ref.current?.getBoundingClientRect().top;
    const offsetPosition = window.pageYOffset + elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  };
  return (
    <div className="m-auto flex w-[80%] items-center gap-10">
      <section className="flex flex-1 flex-col gap-3">
        <h2 className="text-xl font-semibold uppercase tracking-widest text-green-600">Teman Ternak</h2>
        <h1 className="max-w-[450px] text-wrap text-5xl font-semibold leading-tight">Solusi Kesehatan Hewan Ruminansia Terdepan</h1>
        <p className="text-gray-500">Teman terpercaya Anda untuk menjaga kesehatan sapi, kambing, domba, dan kerbau. Dapatkan layanan konsultasi Berupa Video Call dan Chat Dengan Mudah</p>
        <section className="flex gap-4">
          <Button color={"green"} label={"Daftar Sebagai Pengguna"} onClick={() => scrollToSection(flowRef)} />
        </section>
      </section>
      <section className="relative flex h-max w-max items-center justify-center p-2">
        <div className="absolute right-0 top-0 z-10 aspect-square w-[90px] bg-yellow-400"></div>
        <div className="absolute left-0 top-0 z-10 aspect-square w-[30px] bg-yellow-400"></div>
        <div className="absolute bottom-0 right-0 z-10 aspect-square w-[50px] bg-yellow-400"></div>
        <div className="absolute bottom-0 left-0 z-10 aspect-square w-[90px] bg-yellow-400"></div>
        <img src="/asset/jumbotron-image.jpg" alt="Gambar ilustrasi layanan kesehatan hewan" className="relative z-20 aspect-[4/3] w-[550px]" />
      </section>
    </div>
  );
};

export default Jumbotron;
