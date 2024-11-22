import { useAtom } from "jotai";
import { modalRiwayatAtom, dataIdModalRiwayat } from "../../atoms/Atom";
import { useEffect, useState } from "react";
import { IoIosClose } from "react-icons/io";
import { Editor } from "@tinymce/tinymce-react"; 
import Swal from "sweetalert2"; 

const Modal = () => {
  const [isModalOpen, setModalOpen] = useAtom(modalRiwayatAtom);
  const [idRiwayat] = useAtom(dataIdModalRiwayat);
  const [editorContent, setEditorContent] = useState("");

  const apiKey = "rabze7jmjzkemmjg46ascadg7u4eiu648iaws73n4qzfb5ug";

  const handleEditorChange = (content, editor) => {
      setEditorContent(content);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const postData = {
      result: editorContent, 
    };

    try {
      const response = await fetch(`https://api.temanternak.h14.my.id/bookings/${idRiwayat}/consultations/result`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error("Gagal mengirim data");
      }

      const result = await response.json();
      console.log(result);

      Swal.fire({
        icon: 'success',
        title: 'Sukses!',
        text: 'Data berhasil dikirim.',
      });
    } catch (error) {
      console.error("Terjadi kesalahan:", error);

      Swal.fire({
        icon: 'error',
        title: 'Terjadi kesalahan!',
        text: 'Gagal mengirim data, coba lagi.',
      });
    }
  };

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("hasilKonsultasi")) || [];
    const currentData = savedData.find((item) => item.idBooking === idRiwayat);
    if (currentData) {
      setEditorContent(currentData.content);
    }
  }, [idRiwayat]);

  if (!isModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-5"
      onClick={() => setModalOpen(false)}
    >
      <form
        className="relative w-full max-w-xl rounded-lg bg-white p-4 shadow-lg"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit} 
      >
        <div
          className="absolute -right-4 -top-4 flex aspect-square h-10 cursor-pointer items-center justify-center rounded-full border-2 border-black bg-white text-4xl text-black"
          onClick={() => setModalOpen(false)}
        >
          <IoIosClose />
        </div>
        <h1 className="text-center text-xl font-semibold">Membuat Hasil Konsultasi</h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          Hasil Konsultasi yang ditampilkan melanjutkan dari yang dibuat ketika konsultasi sedang berlangsung
        </p>
        <div className="mt-10 w-full">
          <Editor
            apiKey={apiKey} // Menyertakan API key di sini
            init={{
              selector: "#editor-container",
              plugins: [
                "advlist autolink lists link image charmap print preview anchor",
                "searchreplace visualblocks code fullscreen",
                "insertdatetime media table paste code help wordcount",
              ],
              toolbar:
                "undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
              menubar: true,
              height: 400,
            }}
            value={editorContent}
            onEditorChange={handleEditorChange} // Menangani perubahan konten
          />
        </div>
        <div className="mt-4 flex flex-row-reverse">
          <button type="submit" className="w-1/2 rounded bg-green-600 py-1 text-white">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Modal;
