import './Manager.css';

const DataTable = ({ columns, data, loading, onEdit, onDelete }) => {
  if (loading) {
    return <div className="loading-state">Loading...</div>;
  }

  if (!data || data.length === 0) {
    return <div className="empty-state">No data available</div>;
  }

  return (
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
        {data.map((item) => (
          <tr key={item.id}>
            {columns.map((col) => (
              <td key={col.key}>
                {col.render ? col.render(item[col.key], item) : item[col.key]}
              </td>
            ))}
            <td>
              <div className="action-btns">
                <button className="edit-btn" onClick={() => onEdit(item)}>Edit</button>
                <button className="delete-btn" onClick={() => onDelete(item.id)}>Delete</button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;
