import React, { useState, useEffect } from "react";
import Select from "react-select";
import Swal from "sweetalert2";

const FinancialOverview = () => {
  const [balance, setBalance] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [accountNumber, setAccountNumber] = useState("");
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingWithdrawals, setLoadingWithdrawals] = useState(false);
  const [loadingDeposits, setLoadingDeposits] = useState(false);
  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);
  const [fee, setFee] = useState(0);
  const [idempotencyKey, setIdempotencyKey] = useState("");
  const [validationError, setValidationError] = useState("");
  const [isWithdraw, setIsWithdraw] = useState(true);

  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      setLoadingWithdrawals(true);
      setLoadingDeposits(true);
      const response = await fetch("http://api-temanternak.test.h14.my.id/users/my/wallet", {
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

  const fetchBankList = async () => {
    try {
      const response = await fetch("http://api-temanternak.test.h14.my.id/payouts/banks", {
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
        fee: bank.fee,
      }));
      setBanks(formattedBanks);
    } catch (error) {
      setBanks([]);
    }
  };

  const fetchIdempotencyKey = async () => {
    try {
      const response = await fetch("http://api-temanternak.test.h14.my.id/payouts/idempotencyKey", {
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

  const handleWithdraw = async () => {
    console.log(withdrawAmount, fee);
    if (withdrawAmount <= 0 || withdrawAmount > balance - fee) {
      setValidationError("Jumlah tidak valid atau melebihi saldo yang tersedia.");
      return;
    }
    if (!selectedBank || !accountNumber) {
      setValidationError("Pastikan semua data terisi.");
      return;
    }
    if (Number(withdrawAmount) + fee < 10000) {
      setValidationError(`Jumlah minimal penarikan Rp 10.000,00 + Biaya Admin (${(10000 + fee).toLocaleString("id-ID", { style: "currency", currency: "IDR" })})`);
      return;
    }

    setValidationError("");

    try {
      setLoading(true);
      const response = await fetch("http://api-temanternak.test.h14.my.id/payouts/disbursement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
        body: JSON.stringify({
          accountNumber,
          bankCode: selectedBank.value,
          amount: Number(withdrawAmount) + fee,
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
        setWithdrawAmount(0);
        setAccountNumber("");
        fetchFinancialData();
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

  return (
    <div className="mx-auto flex w-[90%] justify-center gap-4">
      <div className="financial-overview h-max w-full max-w-[400px] rounded bg-white p-6 shadow shadow-gray-300">
        {/* {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <> */}
        <h3 className="mb-2 text-lg font-bold">Penarikan Dana</h3>
        <div className="balance-info mb-6 flex items-center gap-2 text-center">
          <h3 className="text-base">Saldo : </h3>
          <p className={`text-base font-semibold ${loading ? "h-4 w-24 animate-pulse rounded bg-slate-200" : "text-green-600"}`}>{loading ? "" : balance.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}</p>
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
            <section className="mt-2 flex justify-center gap-4">
              <p className="text-xs text-gray-600">Jumlah Penarikan : {parseInt(withdrawAmount || 0).toLocaleString("id-ID", { style: "currency", currency: "IDR" })}</p>
              <p className="text-xs text-gray-600">Biaya Bank: {fee.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}</p>
            </section>
          </div>

          <button onClick={handleWithdraw} className="w-full rounded-md bg-blue-500 px-6 py-2 text-white">
            Tarik {withdrawAmount && fee !== 0 ? (parseInt(withdrawAmount) || 0).toLocaleString("id-ID", { style: "currency", currency: "IDR" }) : "Dana"}
            {withdrawAmount && fee !== 0 ? <span className="text-xs"> + {fee.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}</span> : ""}
          </button>
          {validationError && <p className="mt-4 text-center text-xs font-semibold text-red-600">{validationError}</p>}
        </div>
        {/* </>
        )} */}
      </div>
      <div className="flex flex-1 flex-col gap-8">
        <div className="transaction-history w-full rounded bg-white p-6 shadow">
          <h3 className="mb-4 text-lg font-semibold">Riwayat Transaksi</h3>
          {loading ? (
            <ul className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <li key={index} className="h-6 animate-pulse rounded border-b bg-slate-200 py-2" />
              ))}
            </ul>
          ) : transactionHistory.length === 0 ? (
            <p className="text-gray-500">Tidak ada transaksi.</p>
          ) : (
            <ul className="max-h-[500px] space-y-4 overflow-y-auto pr-4">
              {transactionHistory.map((transaction, index) => {
                const { from, to, acceptedAmount, timestamp, transferDetail, platformFee, price } = transaction;
                let category = "";
                if (to > from && acceptedAmount > 0) category = "Penerimaan Dana";
                else if (to > from && acceptedAmount < 0) category = "Pengembalian Dana";
                else if (to < from) category = "Penarikan Dana";

                return (
                  <li key={index} className="border-b pb-3">
                    <div className="flex justify-between">
                      <section>
                        <p className="text-sm font-medium">{category}</p>
                        <p className="text-xs text-gray-600">
                          Saldo: {parseInt(from).toLocaleString("id-ID", { style: "currency", currency: "IDR" })} > {parseInt(to).toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
                        </p>
                      </section>
                      <section>
                        <section className="flex items-center gap-2">
                          <span className={`text-sm font-medium ${category == "Penerimaan Dana" ? "text-green-600" : category == "Penarikan Dana" ? "text-red-600" : "text-black"} `}>
                            {" "}
                            {category == "Penerimaan Dana" ? "+" : category == "Penarikan Dana" ? "-" : ""} {Math.abs(category !== "Penerimaan Dana" ? price : acceptedAmount).toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
                          </span>
                          {category === "Penarikan Dana" && (
                            <p className="text-xs text-gray-600">
                              {" "}
                              ({acceptedAmount.toLocaleString("id-ID", { style: "currency", currency: "IDR" })} + {platformFee.toLocaleString("id-ID", { style: "currency", currency: "IDR" })})
                            </p>
                          )}
                          {category === "Penerimaan Dana" && (
                            <p className="text-xs text-gray-600">
                              ({price.toLocaleString("id-ID", { style: "currency", currency: "IDR" })} - {platformFee.toLocaleString("id-ID", { style: "currency", currency: "IDR" })})
                            </p>
                          )}
                        </section>
                        <span className="text-xs text-gray-400">
                          {new Date(timestamp).toLocaleString("id-ID", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </section>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialOverview;
