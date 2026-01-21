import { useState, useMemo } from 'react';
import './Manager.css';

const DataTable = ({ columns, data, loading, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!data || !searchTerm.trim()) return data || [];
    const term = searchTerm.toLowerCase();
    return data.filter(item => 
      columns.some(col => {
        const value = item[col.key];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(term);
      })
    );
  }, [data, searchTerm, columns]);

  // Paginate filtered data
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  // Reset to page 1 when search changes
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  if (loading) {
    return <div className="loading-state">Loading...</div>;
  }

  return (
    <div className="datatable-container">
      {/* Search and Page Size Controls */}
      <div className="datatable-controls">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
        <div className="page-size-wrapper">
          <span>Show</span>
          <select value={pageSize} onChange={handlePageSizeChange} className="page-size-select">
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span>entries</span>
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        {(!filteredData || filteredData.length === 0) ? (
          <div className="empty-state">
            {searchTerm ? 'No matching records found' : 'No data available'}
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.key}>{col.label}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item) => (
                <tr key={item.id}>
                  {columns.map((col) => (
                    <td key={col.key} data-label={col.label}>
                      {col.render ? col.render(item[col.key], item) : item[col.key]}
                    </td>
                  ))}
                  <td data-label="Actions">
                    <div className="action-btns">
                      <button className="edit-btn" onClick={() => onEdit(item)}>Edit</button>
                      <button className="delete-btn" onClick={() => onDelete(item.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Controls */}
      {filteredData.length > 0 && (
        <div className="pagination-controls">
          <div className="pagination-info">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length} entries
            {searchTerm && data && ` (filtered from ${data.length} total entries)`}
          </div>
          <div className="pagination-buttons">
            <button 
              className="pagination-btn" 
              onClick={() => setCurrentPage(1)} 
              disabled={currentPage === 1}
            >
              «
            </button>
            <button 
              className="pagination-btn" 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
              disabled={currentPage === 1}
            >
              ‹
            </button>
            <span className="pagination-current">
              Page {currentPage} of {totalPages || 1}
            </span>
            <button 
              className="pagination-btn" 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
              disabled={currentPage >= totalPages}
            >
              ›
            </button>
            <button 
              className="pagination-btn" 
              onClick={() => setCurrentPage(totalPages)} 
              disabled={currentPage >= totalPages}
            >
              »
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
