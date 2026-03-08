import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpeg";
// src/pages/Home.js
const HomePage = () => {
  const navigate = useNavigate();

  return (
    <>

      <main className="max-w-5xl mx-auto py-20 px-6 flex flex-col md:flex-row items-center gap-16">
        <div className="w-full md:w-1/2 flex justify-center">
                  <img src={logo} alt="logo" className="w-80 fade-edges" />
                </div>

        <div className="w-full md:w-1/2 space-y-6">
          <h2 className="text-4xl font-extrabold text-[#140033] dark:text-[#ccc] leading-tight">
            Welcome to
          </h2>
          <h2 className="text-4xl font-extrabold
                         bg-gradient-to-r from-[#a855f7] to-[#6366f1]
                         bg-clip-text text-transparent">
            Encrypted File Vault
          </h2>
          <p className="text-gray-500 text-lg italic">
            Your secure vault for text encryption and decryption.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <button
              onClick={() => navigate("/encrypt")}
              className="bg-gradient-to-r from-[#a855f7] to-[#6366f1] text-white p-4 rounded-xl font-bold hover:bg-blue-900 shadow-lg"
            >
              Encrypt
            </button>

            <button
              onClick={() => navigate("/decrypt")}
              className="bg-gradient-to-r from-[#a855f7] to-[#6366f1] text-white p-4 rounded-xl font-bold hover:bg-blue-900 shadow-lg"
            >
              Decrypt
            </button>

            <button
              onClick={() => navigate("/activity")}
              className="col-span-2 bg-gradient-to-r from-[#a855f7] to-[#6366f1] text-white p-3 rounded-xl font-semibold hover:bg-blue-900"
            >
              View Activity
            </button>
          </div>
        </div>
      </main>
    </>
  );
};

export default HomePage;
