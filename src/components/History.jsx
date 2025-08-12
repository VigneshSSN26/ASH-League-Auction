import React from "react";

const History = ({ history }) => {
  if (!history || Object.keys(history).length === 0) return null;
  return (
    <section className="rounded-2xl bg-slate-800/50 p-6 shadow ring-1 ring-slate-700">
      <h2 className="text-2xl font-semibold">Bidding History:</h2>
      <ul className="mt-3 space-y-3">
        {Object.entries(history).map(([teamName, records]) => (
          <li key={teamName} className="rounded-lg bg-slate-900/60 p-4 ring-1 ring-slate-700">
            <strong className="text-amber-300">{teamName}</strong> won:
            <ul className="mt-2 list-disc list-inside text-slate-200">
              {records.map((record, index) => (
                <li key={index}>
                  {record.status ? (
                    <span>Unsold</span>
                  ) : (
                    <span>
                      {record.team} for ₹{record.amount}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default History;


