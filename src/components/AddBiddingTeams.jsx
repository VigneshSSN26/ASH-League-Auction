import React from "react";

const AddBiddingTeams = ({ newTeamName, setNewTeamName, addBiddingTeam, biddingTeams }) => {
  return (
    <section className="bg-slate-800/50 backdrop-blur rounded-2xl shadow-md ring-1 ring-slate-700 p-5 md:p-6">
      <h2 className="text-xl md:text-2xl font-semibold">Add Bidding Teams</h2>
      <div className="mt-4 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={newTeamName}
          onChange={(e) => setNewTeamName(e.target.value)}
          placeholder="Enter team name"
          className="flex-1 rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-2 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
        />
        <button
          onClick={addBiddingTeam}
          className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-2 font-medium text-white shadow hover:from-amber-400 hover:to-orange-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 active:scale-[0.98]"
        >
          Add Team
        </button>
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-medium">Bidding Teams:</h3>
        <ul className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {biddingTeams.map((team, index) => (
            <li
              key={index}
              className="rounded-md bg-slate-900/60 px-3 py-2 text-sm font-medium text-slate-200 ring-1 ring-slate-700"
            >
              {team.name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default AddBiddingTeams;


