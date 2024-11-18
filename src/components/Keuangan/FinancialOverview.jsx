import React, { useState, useEffect } from "react";
import Select from "react-select"; // Mengimpor react-select

const FinancialOverview = () => {
  const [balance, setBalance] = useState(0); // Total dana yang dimiliki dokter
  const [withdrawAmount, setWithdrawAmount] = useState(0); // Jumlah uang yang ingin ditarik
  const [transactionHistory, setTransactionHistory] = useState([]); // Riwayat transaksi
  const [loading, setLoading] = useState(false);
  const [banks, setBanks] = useState([]); // Daftar bank yang tersedia
  const [selectedBank, setSelectedBank] = useState(null); // Bank yang dipilih untuk penarikan

  // Fungsi untuk mengambil data keuangan
  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://api.temanternak.h14.my.id/users/my/wallet", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Gagal memuat data keuangan");
      }

      const data = await response.json();
      setBalance(data.data.balance || 0); // Menetapkan saldo, jika gagal, set saldo ke 0
      setTransactionHistory(data.data.transactions || []); // Menetapkan riwayat transaksi, jika gagal, set ke array kosong
      setLoading(false);
    } catch (error) {
      setBalance(0); // Jika error, set saldo ke 0
      setTransactionHistory([]); // Jika error, set riwayat transaksi ke array kosong
      setLoading(false);
    }
  };

  // Fungsi untuk mengambil daftar bank
  const fetchBankList = async () => {
    try {
      const response = await fetch("https://api.temanternak.h14.my.id/payouts/banks", {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
      });

      if (!response.ok) {
        throw new Error("Gagal memuat daftar bank");
      }

      const data = await response.json();
      setBanks(data.data || []); // Menyimpan daftar bank, jika gagal, set ke array kosong
    } catch (error) {
      setBanks([]); // Jika error, set daftar bank ke array kosong
    }
  };

  // Fungsi untuk menarik dana
  const handleWithdraw = async () => {
    if (withdrawAmount <= 0 || withdrawAmount > balance) {
      alert("Jumlah penarikan tidak valid");
      return;
    }

    if (!selectedBank) {
      alert("Pilih bank terlebih dahulu");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("https://api.temanternak.h14.my.id/withdraw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
        body: JSON.stringify({ amount: withdrawAmount, bank: selectedBank.id }), // Mengirimkan id bank
      });

      if (!response.ok) {
        throw new Error("Penarikan dana gagal");
      }

      const data = await response.json();
      if (data.success) {
        alert("Penarikan berhasil!");
        setBalance(balance - withdrawAmount); // Update saldo setelah penarikan
        setTransactionHistory((prev) => [
          ...prev,
          {
            type: "withdrawal",
            amount: withdrawAmount,
            date: new Date().toLocaleString(),
          },
        ]);
      } else {
        throw new Error("Penarikan dana gagal, coba lagi.");
      }

      setLoading(false);
    } catch (error) {
      alert("Terjadi kesalahan saat melakukan penarikan");
      setLoading(false);
    }
  };

  // Mengambil data keuangan dan daftar bank ketika komponen dimuat
  useEffect(() => {
    fetchFinancialData();
    fetchBankList();
  }, []);

  // Memformat daftar bank untuk react-select
  const bankOptions = banks.map((bank) => ({
    value: bank.id,
    label: bank.name,
  }));

  return (
    <div className="financial-overview p-6 max-w-lg mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center">Keuangan Anda</h2>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
          {/* Saldo */}
          <div className="balance-info mb-6 text-center">
            <h3 className="text-lg font-medium">Saldo saat ini:</h3>
            <p className="text-2xl font-bold text-green-600">Rp {balance.toLocaleString()}</p>
          </div>

          {/* Form Penarikan Dana */}
          <div className="withdraw-form mb-6">
            <h3 className="text-lg font-medium mb-2">Penarikan Dana</h3>
            <div className="flex items-center space-x-4 mb-4">
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="Jumlah penarikan"
                className="border p-2 rounded-md w-full"
              />
              <button
                onClick={handleWithdraw}
                className="bg-red-500 text-white px-6 py-2 rounded-md"
              >
                Tarik Dana
              </button>
            </div>

            {/* Pilihan Bank */}
            <div className="bank-selection mb-4">
              <h4 className="text-sm font-medium">Pilih Bank</h4>
              <Select
                value={selectedBank}
                onChange={setSelectedBank}
                options={bankOptions}
                placeholder="Pilih Bank"
                getOptionLabel={(e) => e.label}
                getOptionValue={(e) => e.value}
                isSearchable // Menambahkan kemampuan pencarian
              />
            </div>
          </div>

          {/* Riwayat Transaksi */}
          <div className="transaction-history">
            <h3 className="text-lg font-semibold mb-4">Riwayat Transaksi</h3>
            <ul className="space-y-4">
              {transactionHistory.length === 0 ? (
                <li className="text-gray-500">Tidak ada transaksi.</li>
              ) : (
                transactionHistory.map((transaction, index) => (
                  <li key={index} className="border-b py-2">
                    <div className="flex justify-between">
                      <span className="font-semibold">
                        {transaction.type === "withdrawal" ? "Penarikan" : "Deposit"}:
                      </span>
                      <span className="font-medium text-green-600">
                        Rp {transaction.acceptedAmount}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{transaction.consultation.serviceName}</p>
                    <p className="text-xs text-gray-400">{transaction.timestamp}</p>
                  </li>
                ))
              )}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default FinancialOverview;
