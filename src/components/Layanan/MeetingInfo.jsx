import React from "react";

const MeetingInfo = ({ consultation }) => {
  if (!consultation) return null;

  return (
    <div id="meeting-info">
      <h1>{consultation.serviceName}</h1>
      <p>Dokter: {consultation.veterinarianNameAndTitle}</p>
      <p>Pelanggan: {consultation.bookerName}</p>
      <p>
        Waktu Mulai: {new Date(consultation.startTime).toLocaleString()}
      </p>
      <p>
        Waktu Selesai: {new Date(consultation.endTime).toLocaleString()}
      </p>
    </div>
  );
};

export default MeetingInfo;
