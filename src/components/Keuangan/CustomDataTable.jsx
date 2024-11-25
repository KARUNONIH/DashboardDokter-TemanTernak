import React from "react";
import DataTable from "react-data-table-component";

const CustomDataTable = ({ title, columns, data }) => {
  return (
    <div className="rounded bg-white p-4 shadow shadow-gray-300">
      <h3 className="mb-4 text-lg font-semibold">{title}</h3>
      <DataTable
        columns={columns}
        data={data}
        pagination
        highlightOnHover
        responsive
        striped
        noDataComponent={<p className="text-gray-500">Tidak ada data yang tersedia.</p>}
      />
    </div>
  );
};

export default CustomDataTable;
