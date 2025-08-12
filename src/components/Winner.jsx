import React from "react";

const Winner = ({ winner, currentTeam }) => {
  if (!winner) return null;
  return (
    <section className="rounded-2xl bg-slate-800/60 p-6 shadow ring-1 ring-slate-700">
      <h2 className="text-2xl font-semibold">Auction Winner:</h2>
      <p className="mt-2 text-lg">
        <strong>{winner.teamName}</strong> won the auction for {" "}
        <strong>{currentTeam?.name}</strong> with a bid of ₹{winner.amount}.
      </p>
    </section>
  );
};

export default Winner;


