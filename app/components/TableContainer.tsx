/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

// TableContainer.tsx
import { useCallback, useEffect, useState } from 'react';
import Table from './Table';
import { CiSearch } from 'react-icons/ci';
import InputField from './Form/InputField';
import RenderFilterField from './Form/RenderFilterField';
import { TableContainerProps } from '../types';
import { IoClose } from 'react-icons/io5';
import axios from 'axios';

const TableContainer = ({
  columns,
  apiUrl,
  isThereFilters = true,
  headerActions,
  refresh,
}: TableContainerProps) => {
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sortDirection, setSortDirection] = useState<any>({
    sortBy: '',
    sortDirection: 'asc',
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [lastPage, setLastPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const toggleFilters = () => setShowFilters((prev) => !prev);

  const fetchData = useCallback(async () => {
    if (columns.length === 0) {
      setLoading(true);
    }
    setError(null);
    try {
      const params: Record<string, any> = {
        ...filters,
        page: currentPage,
        size: rowsPerPage,
      };

      if (searchTerm) params.searchTerm = searchTerm;
      if (sortDirection.sortBy) {
        params.sortBy = sortDirection.sortBy;
        params.sortDirection = sortDirection.sortDirection;
      }

      const response = await axios.get(`http://209.127.228.55:8082/api/carcontracts/v1${apiUrl}`, {
        params,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyNSIsImlhdCI6MTc0OTg5ODg0MiwiZXhwIjoxNzUyNDkwODQyfQ.kdp0feNm2oml9x0erdlhLAZh9mAqjRQrFvH3fWbRD5ZXJR3SruJ1UPzejWsyj_kZ8vUGLBvBU-tVX4Aq-r9hIg`,
        },
      });

      setData(response.data.data);
      setLastPage(response.data.pagination.lastPage);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error fetching data');
    } finally {
      setLoading(false);
    }
  }, [apiUrl, filters, searchTerm, sortDirection, rowsPerPage, currentPage, columns.length]);

  // Only reset page to 0 when search/filter/sort changes (not page itself)
  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm, filters, sortDirection, rowsPerPage, refresh]);

  useEffect(() => {
    fetchData();
  }, [fetchData, currentPage]);

  const handleFilterChange = (name: string, value: any) => {
    setFilters((prev) => {
      const updated = { ...prev };
      if (value === null || value === '') {
        delete updated[name];
      } else {
        updated[name] = value;
      }
      return updated;
    });
  };

  const onSort = (columnKey: string) => {
    setSortDirection((prev: any) => {
      const newDirection =
        prev.sortBy === columnKey && prev.sortDirection === 'asc' ? 'desc' : 'asc';
      return { sortBy: columnKey, sortDirection: newDirection };
    });
  };

  return (
    <div className="w-full pb-4">
      {/* Top Bar */}
      <div className="mt-4 flex flex-col md:flex-row md:items-center gap-4">
        <InputField
          name="searchTerm"
          type="text"
          value={searchTerm}
          placeholder="اسم صاحب الشركة"
          onChange={(e) => setSearchTerm(e.target.value)}
          className="m-0"
          leftIcon={<CiSearch size={24} />}
        />
        <select
          className="border border-neutral-300 rounded-xl px-4 py-2 text-lg text-neutral-700"
          value={rowsPerPage}
          onChange={(e) => setRowsPerPage(Number(e.target.value))}
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
        {isThereFilters && (
          <button
            className={`text-primary-500 rounded-2xl py-2 px-4 border border-primary-500 text-xl font-normal w-full md:w-auto ${showFilters ? 'bg-primary-500 text-white' : ''}`}
            onClick={toggleFilters}
          >
            + اضافة فلتر
          </button>
        )}
        {headerActions && headerActions}
      </div>

      {/* Content Area */}
      <div className="flex flex-col md:flex-row w-full gap-4 mt-4 transition-all duration-500 ease-in-out">
        {/* Filters */}
        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
            showFilters
              ? 'w-full md:w-[450px] h-auto opacity-100 translate-x-0'
              : 'w-0 h-0 opacity-0 translate-x-full'
          }`}
        >
          <div className="flex flex-col w-full border-none mb-4 bg-white rounded-2xl p-2 shadow-[1px_2px_16px_0px_#4899EA1F]">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xl font-bold">فلاتر</p>
              <button
                className="text-neutral-500 hover:text-black text-2xl font-normal"
                onClick={toggleFilters}
              >
                <IoClose size={24} />
              </button>
            </div>
            <hr className="mb-2 border-t border-neutral-500" />
            {columns
              .filter((col) => col.isFilterable)
              .map((column) => (
                <RenderFilterField
                  key={column.key}
                  column={column}
                  handleFilterChange={handleFilterChange}
                  filters={filters}
                />
              ))}
          </div>
        </div>

        {/* Table */}
        <div
          className={`flex-1 transition-all duration-500 ease-in-out ${
            showFilters ? 'w-full md:w-[calc(100%-350px)]' : 'w-full'
          }`}
        >
          <Table columns={columns} data={data} loading={loading} error={error} onSort={onSort} />

          {/* Pagination buttons */}
          <div className="flex items-center mt-6 gap-2">
            {/* Previous */}
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
              disabled={currentPage === 0}
              className="w-[35px] h-[35px] bg-primary-500 text-white rounded-full disabled:opacity-50"
            >
              {'<'}
            </button>

            {/* Page Numbers */}
            {Array.from({ length: 5 }, (_, i) => {
              const startPage = Math.max(0, Math.min(currentPage - 2, lastPage - 5));
              const page = startPage + i;

              if (page >= lastPage) return null;

              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-[35px] h-[35px] rounded-full ${
                    page === currentPage
                      ? 'bg-primary-500 text-white font-bold'
                      : 'border-1 border-neutral-400 text-neutral-500 hover:bg-gray-300'
                  }`}
                >
                  {page + 1}
                </button>
              );
            })}

            {/* Next */}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, lastPage - 1))}
              disabled={currentPage >= lastPage - 1}
              className="w-[35px] h-[35px] bg-primary-500 text-white rounded-full disabled:opacity-50"
            >
              {'>'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableContainer;
