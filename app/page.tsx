/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { TableColumn } from "./types";
import TableContainer from "./components/TableContainer";

export default function Home() {
const columns: TableColumn[] = [
  {
    title: 'رقم الشركة',
    key: 'id',
    sortable: true,
  },
  {
    title: 'تاريخ الاشتراك',
    key: 'subscriptionDate',
    sortable: true,
    render: (row: any) => (
      <span className="text-lg font-normal">
        {new Date(row.subscriptionDate).toLocaleDateString()}
      </span>
    ),
  },
  {
    title: 'تاريخ الانتهاء',
    key: 'expirationDate',
    sortable: true,
    render: (row: any) => (
      <span className="text-lg font-normal">
        {new Date(row.expirationDate).toLocaleDateString()}
      </span>
    ),
  },
  {
    title: 'اسم صاحب الشركة',
    key: 'ownerName',
    sortable: true,
  },
  {
    title: 'رقم صاحب الشركة',
    key: 'ownerContact',
    filterType: 'text',
    sortable: true,
  },
  {
    title: 'اسم الشركة',
    key: 'companyName',
    sortable: true,
  },
  {
    title: 'عدد المستخدمين',
    key: 'userCount',
    sortable: true,
  },
  {
    title: 'الحالة',
    key: 'status',
    isFilterable: true,
    filterType: 'select',
    filterOptions: [
      { label: 'نشط', value: 'ACTIVE' },
      { label: 'مقيدة', value: 'EXPIRED' },
    ],
    render: (row: any) => (
      <span
        className={`text-lg font-normal py-1 rounded-full px-8 ${row.status !== 'EXPIRED' ? 'text-success-500 bg-success-100' : 'text-danger-500 text-danger-100'}`}
      >
        {row.status !== 'EXPIRED' ? 'نشطة' : 'مقيدة'}
      </span>
    ),
  },
  {
    title: 'تاريخ الاشتراك',
    key: 'subscriptionDateFrom',
    filterType: 'date',
    isFilterable: true,
    isVisible: false,
  },
  {
    title: 'تاريخ الانتهاء',
    key: 'expirationDateFrom',
    filterType: 'date',
    isFilterable: true,
  },

];

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      
      <TableContainer
        columns={columns}
        apiUrl="/companies"
      />
    </div>
  );
}
