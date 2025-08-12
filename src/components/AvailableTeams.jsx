import React from "react";

const AvailableTeams = ({ availableTeams, startAuction, resetTeam }) => {
  return (
    <section>
      <h2 className="text-xl md:text-2xl font-semibold">Available Teams for Auction:</h2>
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {availableTeams.map((team) => (
          <div
            key={team.name}
            className="group relative overflow-hidden rounded-xl bg-slate-800/60 shadow ring-1 ring-slate-700 hover:shadow-lg transition-shadow"
          >
            <img src={team.logo} alt={team.name} className="w-full aspect-[4/5] object-cover" />
            <div className="p-3 space-y-2">
              {team.soldTo ? (
                <>
                  <div className="w-full rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-slate-300 text-center">
                    Sold Out to {team.soldTo}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => startAuction(team)}
                      className="rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-2 text-sm font-semibold text-white shadow hover:from-emerald-400 hover:to-teal-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    >
                      Re-Auction
                    </button>
                    <button
                      onClick={() => resetTeam(team.name)}
                      className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-200 shadow hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500/50"
                    >
                      Reset
                    </button>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => startAuction(team)}
                  className="w-full rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 text-sm font-semibold text-white shadow hover:from-emerald-400 hover:to-teal-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                >
                  Start Auction for {team.name}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AvailableTeams;


