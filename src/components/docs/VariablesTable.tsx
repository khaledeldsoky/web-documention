"use client";

import { useState, useEffect } from "react";
import { getStore, setVar, subscribe, loadFromStorage } from "@/lib/varStore";

type Column = {
  header: string;
  key: string;
};

type Props = {
  course: string;
  columns: Column[];
  rows: Record<string, string>[];
};

export default function VariablesTable({ course, columns, rows }: Props) {
  const [vars, setVars] = useState(() => getStore(course));

  useEffect(() => {
    loadFromStorage(course);
    setVars({ ...getStore(course) });
    return subscribe(() => setVars({ ...getStore(course) }));
  }, [course]);

  const groups: { cat: string; rows: typeof rows }[] = [];
  let currentCat = "";
  for (const row of rows) {
    if (row.cat !== currentCat) {
      groups.push({ cat: row.cat, rows: [] });
      currentCat = row.cat;
    }
    groups[groups.length - 1].rows.push(row);
  }

  const nonCatCols = columns.filter((col) => col.key !== "cat");

  return (
    <table className="info-table variables-table">
      <thead>
        <tr>
          {columns.map((col, i) => (
            <th key={i}>{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {groups.map((group, gi) =>
          group.rows.map((row, ri) => {
            const isFirst = ri === 0;
            const isLast = ri === group.rows.length - 1;
            const isSeparator = isLast && gi < groups.length - 1;
            return (
              <tr key={`${gi}-${ri}`} className={isSeparator ? "cat-group-end" : ""}>
                {isFirst && (
                  <td rowSpan={group.rows.length}>{group.cat}</td>
                )}
                {nonCatCols.map((col) => {
                  if (col.key === "val") {
                    const val = row.val;
                    const varName = row.var;
                    return (
                      <td key={col.key}>
                        <input
                          className="var-input"
                          type="text"
                          value={vars[varName] || val}
                          onChange={(e) => setVar(course, varName, e.target.value)}
                          placeholder={val}
                          style={{
                            color: vars[varName] !== ""
                              ? "var(--accent3)"
                              : "color-mix(in srgb, var(--accent3) 40%, transparent)",
                          }}
                        />
                      </td>
                    );
                  }
                  return <td key={col.key}>{row[col.key]}</td>;
                })}
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
}
