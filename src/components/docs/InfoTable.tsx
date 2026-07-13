type Column = {
  header: string;
  key: string;
};

type Props = {
  columns: Column[];
  rows: Record<string, string>[];
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
            {columns.map((col, ci) => (
              <td key={ci} dangerouslySetInnerHTML={{ __html: row[col.key] }} />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
