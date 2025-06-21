/* eslint-disable @typescript-eslint/no-explicit-any */

export interface TableContainerProps {
  columns: TableColumn[];
  apiUrl: string;
  refresh?: boolean;
  isThereFilters?: boolean;
  headerActions?: React.ReactNode;
}


export interface TableColumn {
  title: string;
  key: string;
  sortable?: boolean;
  isFilterable?: boolean;
  isVisible?: boolean;
  filterType?: 'text' | 'select' | 'date' | 'startEndDate' | 'radio';
  filterOptions?: { value: string; label: string }[];
  render?: (row: Record<string, any>, index: number) => React.ReactNode;
}



export interface TableProps {
  columns: TableColumn[];
  data: Array<Record<string, any>>;
  onSort?: (columnKey: string) => void;
  loading?: boolean;
  error?: any;
}
