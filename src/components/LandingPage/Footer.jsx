import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { IoMdCall } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import { GoLocation } from "react-icons/go";


const Footer = () => {
    return (
      <footer className="bg-black text-white py-8">
        <div className="w-4/5 mx-auto">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
          
          <div>
            <h2 className="text-lg font-semibold mb-4">Tentang Kami</h2>
            <p className="text-sm text-justify">
              Kami adalah penyedia solusi kesehatan hewan yang menyediakan layanan konsultasi online dengan dokter hewan berpengalaman. Komitmen kami adalah menjaga kesehatan hewan ternak Anda dengan mudah dan efisien.
            </p>
          </div>
  
          <div>
            <h2 className="text-lg font-semibold mb-4">Navigasi</h2>
            <ul>
              <li className="mb-2">
                <a href="/" className="hover:underline">Beranda</a>
              </li>
              <li className="mb-2">
                <a href="/about" className="hover:underline">Tentang Kami</a>
              </li>
              <li className="mb-2">
                <a href="/services" className="hover:underline">Layanan</a>
              </li>
              <li className="mb-2">
                <a href="/contact" className="hover:underline">Kontak</a>
              </li>
            </ul>
          </div>
  
          <div>
            <h2 className="text-lg font-semibold mb-4">Ikuti Kami</h2>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="hover:text-gray-400">
                <FaFacebook/>
              </a>
              <a href="https://twitter.com" className="hover:text-gray-400">
                <FaTwitter/>
              </a>
              <a href="https://instagram.com" className="hover:text-gray-400">
                <FaInstagram/>
              </a>
              <a href="https://linkedin.com" className="hover:text-gray-400">
                <FaLinkedin/>
              </a>
            </div>
          </div>
        </div>
  
        <div className="mt-8 border-t border-gray-700 pt-4 text-center text-sm">
          <p>&copy; 2024 Teman Ternak. All Rights Reserved.</p>
          </div>
          </div>
      </footer>
    );
  };
  
  export default Footer;
  