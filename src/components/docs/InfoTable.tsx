import type { ReactNode } from "react";

type Column = {
  header: string;
  key: string;
};

type Props = {
  columns: Column[];
  rows: Record<string, string | ReactNode>[];
};

export default function InfoTable({ columns, rows }: Props) {
  return (
    <table className="info-table">
      <thead>
        <tr>
          {columns.map((col, i) => (
            <th key={i}>{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, ri) => (
          <tr key={ri}>
            {columns.map((col, ci) => {
              const val = row[col.key];
              return typeof val === "string" ? (
                <td key={ci} dangerouslySetInnerHTML={{ __html: val }} />
              ) : (
                <td key={ci}>{val}</td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
