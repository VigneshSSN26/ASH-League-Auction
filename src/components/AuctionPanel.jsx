import React from "react";

const AuctionPanel = ({
  currentTeam,
  biddingAmount,
  currentBiddingTeam,
  biddingTeams,
  placeBid,
  reverseLastBid,
  resetToBase,
  endAuction,
}) => {
  if (!currentTeam) return null;
  return (
    <section className="bg-slate-800/60 rounded-2xl p-6 shadow ring-1 ring-slate-700">
      <h2 className="text-2xl font-semibold">Bidding for: {currentTeam?.name}</h2>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div className="flex justify-center">
          <img
            src={currentTeam.logo}
            alt={currentTeam.name}
            className="h-64 w-auto rounded-xl shadow"
          />
        </div>
        <div>
          <p className="text-xl font-medium">Current Bid: ₹{biddingAmount}</p>

          {currentBiddingTeam && (
            <div className="mt-2 rounded-lg bg-slate-900/60 px-4 py-2 text-slate-200 ring-1 ring-slate-700">
              Current Bidding Team: {currentBiddingTeam}
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-3">
            {biddingTeams.map((team, index) => (
              <button
                key={index}
                onClick={() => placeBid(team.name)}
                className="rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-sm font-semibold text-white shadow hover:from-amber-400 hover:to-orange-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              >
                {team.name} Bid
              </button>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={resetToBase}
              className="inline-flex items-center justify-center rounded-lg border border-slate-600 bg-slate-800 px-5 py-2.5 font-semibold text-slate-200 shadow hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500/50"
            >
              Reset To Base
            </button>
            <button
              onClick={reverseLastBid}
              className="inline-flex items-center justify-center rounded-lg border border-slate-600 bg-slate-800 px-5 py-2.5 font-semibold text-slate-200 shadow hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500/50"
            >
              Reverse Bid
            </button>
            <button
              onClick={endAuction}
              className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-rose-500 to-red-600 px-5 py-2.5 font-semibold text-white shadow hover:from-rose-400 hover:to-red-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
            >
              End Auction
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuctionPanel;


