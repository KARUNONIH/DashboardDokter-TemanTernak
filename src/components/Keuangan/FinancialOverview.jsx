import React, { useState, useEffect } from "react";
import Select from "react-select";
import Swal from "sweetalert2";

const FinancialOverview = () => {
  const [balance, setBalance] = useState(0); // Total saldo
  const [withdrawAmount, setWithdrawAmount] = useState(null); // Jumlah uang yang ingin ditarik
  const [accountNumber, setAccountNumber] = useState(""); // Nomor rekening
  const [transactionHistory, setTransactionHistory] = useState([]); // Riwayat transaksi
  const [loading, setLoading] = useState(false);
  const [banks, setBanks] = useState([]); // Daftar bank
  const [selectedBank, setSelectedBank] = useState(null); // Bank yang dipilih
  const [fee, setFee] = useState(0); // Biaya bank
  const [idempotencyKey, setIdempotencyKey] = useState(""); // Idempotency Key
  const [validationError, setValidationError] = useState(""); // Pesan validasi
  const [isWithdraw, setIsWithdraw] = useState(true);

  // Fungsi untuk mengambil data keuangan
  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://api.temanternak.h14.my.id/users/my/wallet", {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
      });

      if (!response.ok) {
        throw new Error("Gagal memuat data keuangan");
      }

      const data = await response.json();
      setBalance(data.data.balance || 0);
      setTransactionHistory(data.data.transactions || []);
      setLoading(false);
    } catch (error) {
      setBalance(0);
      setTransactionHistory([]);
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
      const formattedBanks = data.data.map((bank) => ({
        value: bank.bank_code,
        label: bank.name,
        fee: bank.fee, // Menyimpan fee bank
      }));
      setBanks(formattedBanks);
    } catch (error) {
      setBanks([]);
    }
  };

  // Fungsi untuk mendapatkan idempotencyKey
  const fetchIdempotencyKey = async () => {
    try {
      const response = await fetch("https://api.temanternak.h14.my.id/payouts/idempotencyKey", {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
      });

      if (!response.ok) {
        throw new Error("Gagal mendapatkan idempotencyKey");
      }

      const data = await response.json();
      setIdempotencyKey(data.data.idempotencyKey || "");
    } catch (error) {
      console.error("Error fetching idempotencyKey:", error);
    }
  };

  // Fungsi untuk menarik dana
  const handleWithdraw = async () => {
    if (withdrawAmount <= 0 || withdrawAmount > balance - fee) {
      setValidationError("Jumlah tidak valid atau melebihi saldo yang tersedia.");
      return;
    }
    if (!selectedBank || !accountNumber) {
      setValidationError("Pastikan semua data terisi.");
      return;
    }

    setValidationError(""); // Reset pesan validasi

    try {
      setLoading(true);
      const response = await fetch("https://api.temanternak.h14.my.id/payouts/disbursement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
        body: JSON.stringify({
          accountNumber,
          bankCode: selectedBank.value,
          amount: Number(withdrawAmount),
          idempotencyKey,
        }),
      });

      if (!response.ok) {
        throw new Error("Penarikan dana gagal");
      }

      const data = await response.json();
      if (data.status === "success") {
        Swal.fire("Sukses", "Penarikan dana berhasil.", "success");
        setIsWithdraw(true);
        // setBalance(balance - withdrawAmount - fee);
        setWithdrawAmount(0);
        setAccountNumber("");
        fetchFinancialData(); // Refresh riwayat transaksi
      } else {
        Swal.fire("Gagal", "Penarikan dana gagal. Coba lagi.", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Terjadi kesalahan. Coba lagi.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isWithdraw) {
      
      fetchFinancialData();
      fetchBankList();
      fetchIdempotencyKey();
      setIsWithdraw(false);
    }
  }, [isWithdraw]);



  useEffect(() => {
    if (selectedBank) {
      setFee(selectedBank.fee);
    }
  }, [selectedBank]);

  // Filter riwayat transaksi berdasarkan logika
  const withdrawals = transactionHistory.filter((transaction) => parseFloat(transaction.from) > parseFloat(transaction.to));
  const deposits = transactionHistory.filter((transaction) => parseFloat(transaction.from) < parseFloat(transaction.to));

  return (
    <div className="financial-overview mx-auto max-w-lg rounded-lg bg-white p-6 shadow-lg">
      <h2 className="mb-6 text-center text-2xl font-semibold">Keuangan Anda</h2>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
          <div className="balance-info mb-6 text-center">
            <h3 className="text-lg font-medium">Saldo saat ini:</h3>
            <p className="text-2xl font-bold text-green-600">Rp {balance.toLocaleString()}</p>
          </div>

          <div className="withdraw-form mb-6">
            <h3 className="mb-2 text-lg font-medium">Penarikan Dana</h3>
            <input type="text" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="Nomor Rekening" className="mb-4 w-full rounded-md border p-2" />
              <Select value={selectedBank} onChange={setSelectedBank} options={banks} placeholder="Pilih Bank" isSearchable />
              <input type="number" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} placeholder="Jumlah Penarikan" className="w-full rounded-md border p-2" />
              <div className="mb-4 flex  flex-col items-center space-x-4">
              <div className="bank-selection mb-4">
              <h4 className="text-sm font-medium">Pilih Bank</h4>
            </div>
              <span className="text-sm text-gray-600">Biaya Bank: Rp {fee.toLocaleString()}</span>
            </div>
            {validationError && <p className="mb-4 text-sm text-red-500">{validationError}</p>}

            
            <button onClick={handleWithdraw} className="w-full rounded-md bg-blue-500 px-6 py-2 text-white">
              Tarik Dana
            </button>
          </div>

          <div className="transaction-history">
            <h3 className="mb-4 text-lg font-semibold">Riwayat Transaksi</h3>
            <div className="withdrawals mb-6">
              <h4 className="text-md mb-2 font-medium">Penarikan Dana</h4>
              {withdrawals.length === 0 ? (
                <p className="text-gray-500">Tidak ada penarikan.</p>
              ) : (
                <ul className="space-y-4">
                  {withdrawals.map((transaction, index) => (
                    <li key={index} className="border-b py-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Rp {transaction.to}</span>
                        <span className="text-xs text-gray-400">{transaction.timestamp}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="deposits">
              <h4 className="text-md mb-2 font-medium">Penerimaan Dana</h4>
              {deposits.length === 0 ? (
                <p className="text-gray-500">Tidak ada penerimaan dana.</p>
              ) : (
                <ul className="space-y-4">
                  {deposits.map((transaction, index) => (
                    <li key={index} className="border-b py-2">
                      <div className="flex justify-between">
                        <span className="font-medium">diterima Rp {transaction.acceptedAmount}</span>
                        <span>
                          didapat dari biaya {transaction.consultation.serviceName} sebesar {transaction.price} dikurang biaya layanan sebesar {transaction.platformFee}
                        </span>
                        <span className="text-xs text-gray-400">{transaction.timestamp}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FinancialOverview;
