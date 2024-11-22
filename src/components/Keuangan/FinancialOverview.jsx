import React, { useState, useEffect } from "react";
import Select from "react-select";
import Swal from "sweetalert2";

const FinancialOverview = () => {
  const [balance, setBalance] = useState(0); // Total saldo
  const [withdrawAmount, setWithdrawAmount] = useState(0); // Jumlah uang yang ingin ditarik
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
    if (withdrawAmount < 10000) {
      setValidationError("Jumlah penarikan harus lebih dari Rp 10.000");
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
    <div className="mt-8 flex w-[90%] justify-center gap-4 bg-slate-50">
      <div className="financial-overview max-w-lg rounded-lg bg-white p-6 shadow shadow-gray-300">
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <>
            <h3 className="mb-2 text-lg font-bold">Penarikan Dana</h3>
            <div className="balance-info mb-6 flex items-center gap-2 text-center">
              <h3 className="text-base">Saldo : </h3>
              <p className="text-base font-semibold text-green-600">{balance.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}</p>
            </div>

            <div className="withdraw-form mb-6">
              <label htmlFor="" className="text-sm font-semibold">
                Nomor Rekening
              </label>
              <input type="number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="Nomor Rekening" className="mb-4 w-full rounded-md border p-2 text-sm" />
              <label htmlFor="" className="text-sm font-semibold">
                Bank
              </label>
              <Select value={selectedBank} onChange={setSelectedBank} options={banks} placeholder="Pilih Bank" isSearchable className="mb-4 text-sm" />
              <label htmlFor="" className="text-sm font-semibold">
                Jumlah Penarikan
              </label>
              <input type="number" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} placeholder="Jumlah Penarikan" className="w-full rounded-md border p-2 text-sm" />
              <div className="mb-4 flex flex-col items-center space-x-4">
                <section className="justify-center flex gap-4 mt-2">
                  <p className="text-xs text-gray-600">Jumlah Penarikan : {parseInt(withdrawAmount || 0).toLocaleString("id-ID", { style: "currency", currency: "IDR" })}</p>
                  <p className="text-xs text-gray-600">Biaya Bank: {fee.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}</p>
                </section>
              </div>
              {validationError && <p className="mb-4 text-sm text-red-600 text-center">{validationError}</p>}

              <button onClick={handleWithdraw} className="w-full rounded-md bg-blue-500 px-6 py-2 text-white">
              Tarik {withdrawAmount && fee !== 0 ? ((parseInt(withdrawAmount) || 0) + fee).toLocaleString("id-ID", { style: "currency", currency: "IDR" }) : "Dana"}
              </button>
            </div>
          </>
        )}
      </div>
      <div className="flex flex-col gap-8">
        <div className="transaction-history h-max w-[600px] rounded bg-white p-6 shadow shadow-gray-300">
          <h3 className="mb-4 text-lg font-semibold">Riwayat Transaksi</h3>
          <div className="withdrawals mb-6">
            <h4 className="mb-2 text-base font-medium">Penarikan Dana</h4>
            {withdrawals.length === 0 ? (
              <p className="text-gray-500">Tidak ada penarikan.</p>
            ) : (
              <ul className="space-y-4">
                {withdrawals.map((transaction, index) => (
                  <li key={index} className="border-b py-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-800">{(transaction.from - transaction.to).toLocaleString("id-ID", { style: "currency", currency: "IDR" })}</span>
                      <span className="text-xs text-gray-400">{new Date(transaction.timestamp).toLocaleString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="deposits h-max w-[600px] rounded bg-white p-6 shadow shadow-gray-300">
          <h4 className="text-md mb-2 font-medium">Penerimaan Dana</h4>
          {deposits.length === 0 ? (
            <p className="text-gray-500">Tidak ada penerimaan dana.</p>
          ) : (
            <ul className="space-y-4">
              {deposits.map((transaction, index) => (
                <li key={index} className="border-b py-2">
                  <div className="flex justify-between">
                    <section className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-gray-800">{transaction.acceptedAmount.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}</span>
                      <span className="text-xs text-gray-400">{new Date(transaction.timestamp).toLocaleString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
                    </section>
                    <section className="flex flex-col gap-1">
                      <p className="text-right text-sm">{transaction.consultation.serviceName}</p>
                      <p className="text-right text-xs text-gray-500">
                        Biaya ({transaction.price.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}) - Admin ({transaction.platformFee.toLocaleString("id-ID", { style: "currency", currency: "IDR" })})
                      </p>
                    </section>
                    {/* <span>
                          didapat dari biaya {transaction.consultation.serviceName} sebesar  dikurang biaya layanan sebesar {transaction.platformFee}
                        </span> */}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialOverview;
