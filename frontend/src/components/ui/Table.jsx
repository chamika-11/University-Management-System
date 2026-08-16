import React from 'react';

export function Table({ columns, rows, emptyMessage = 'No records found.' }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-white">
      <table className="min-w-full divide-y divide-[var(--border)] text-sm">
        <thead className="bg-[var(--surface-soft)] text-left text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="px-4 py-3 font-semibold">{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)]">
          {rows.length === 0 ? (
            <tr>
              <td className="px-4 py-10 text-center text-[var(--text-muted)]" colSpan={columns.length}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id} className="hover:bg-[var(--surface-soft)]/60">
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-3 text-[var(--text)]">
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}