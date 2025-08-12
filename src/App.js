import React, { useEffect, useState } from "react";

const App = () => {
  const BASE_PRICE = 3000;
  const BID_INCREMENT = 1000;
  const STORAGE_KEY = "ash-auction-state-v1";

  const teams = [
    { name: "CT Night Riders", logo: "/logos/CT Night Riders Poster.png" },
    { name: "Fountain Sharks", logo: "/logos/Fountain Sharks Poster.png" },
    { name: "GRH'unters", logo: "/logos/GRH'unters Poster.png" },
    { name: "MCChargers", logo: "/logos/MCChargers.png" },
    { name: "OATitans", logo: "/logos/OATitans Poster.png" },
  ];

  const [availableTeams, setAvailableTeams] = useState(teams);
  const [biddingTeams, setBiddingTeams] = useState([]);
  const [biddingLog, setBiddingLog] = useState([]);
  const [currentTeam, setCurrentTeam] = useState(null);
  const [biddingAmount, setBiddingAmount] = useState(BASE_PRICE);
  const [history, setHistory] = useState({});
  const [newTeamName, setNewTeamName] = useState("");
  const [winner, setWinner] = useState(null);
  const [isFirstBid, setIsFirstBid] = useState(true);
  const [currentBiddingTeam, setCurrentBiddingTeam] = useState(null); // Track the current bidding team
  const [isHydrated, setIsHydrated] = useState(false);

  // Load saved state on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved.availableTeams) setAvailableTeams(saved.availableTeams);
        if (saved.biddingTeams) setBiddingTeams(saved.biddingTeams);
        if (saved.biddingLog) setBiddingLog(saved.biddingLog);
        if (Object.prototype.hasOwnProperty.call(saved, "currentTeam")) setCurrentTeam(saved.currentTeam);
        if (Object.prototype.hasOwnProperty.call(saved, "biddingAmount")) setBiddingAmount(saved.biddingAmount);
        if (saved.history) setHistory(saved.history);
        if (Object.prototype.hasOwnProperty.call(saved, "winner")) setWinner(saved.winner);
        if (Object.prototype.hasOwnProperty.call(saved, "isFirstBid")) setIsFirstBid(saved.isFirstBid);
        if (Object.prototype.hasOwnProperty.call(saved, "currentBiddingTeam")) setCurrentBiddingTeam(saved.currentBiddingTeam);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to load saved auction state", error);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Persist state after hydration
  useEffect(() => {
    if (!isHydrated) return;
    const snapshot = {
      availableTeams,
      biddingTeams,
      biddingLog,
      currentTeam,
      biddingAmount,
      history,
      winner,
      isFirstBid,
      currentBiddingTeam,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to save auction state", error);
    }
  }, [
    isHydrated,
    availableTeams,
    biddingTeams,
    biddingLog,
    currentTeam,
    biddingAmount,
    history,
    winner,
    isFirstBid,
    currentBiddingTeam,
  ]);

  const addBiddingTeam = () => {
    if (newTeamName.trim() === "") {
      alert("Team name cannot be empty!");
      return;
    }
    setBiddingTeams((prev) => [...prev, { name: newTeamName }]);
    setNewTeamName("");
  };

  const startAuction = (team) => {
    setCurrentTeam(team);
    setBiddingAmount(BASE_PRICE); // Reset to base price
    setBiddingLog([]);
    setWinner(null);
    setIsFirstBid(true);
    setCurrentBiddingTeam(null);
  };

  const placeBid = (teamName) => {
    if (currentBiddingTeam === teamName) {
      alert("This team is already holding the bid.");
      return; // Prevent the same team from bidding again
    }

    const nextAmount = biddingAmount + BID_INCREMENT; // Always increment by 1000
    setBiddingAmount(nextAmount);
    setIsFirstBid(false);
    setCurrentBiddingTeam(teamName);
    setBiddingLog((prev) => [...prev, { teamName, amount: nextAmount }]);
  };

  const reverseLastBid = () => {
    if (!currentTeam) return;
    if (biddingLog.length === 0) {
      // Reset to base price if no bids to undo
      setBiddingAmount(BASE_PRICE);
      setCurrentBiddingTeam(null);
      setIsFirstBid(true);
      return;
    }
    const updatedLog = biddingLog.slice(0, -1);
    const lastEntry = updatedLog[updatedLog.length - 1] || null;
    setBiddingLog(updatedLog);
    if (lastEntry) {
      setBiddingAmount(lastEntry.amount);
      setCurrentBiddingTeam(lastEntry.teamName);
      setIsFirstBid(false);
    } else {
      setBiddingAmount(BASE_PRICE);
      setCurrentBiddingTeam(null);
      setIsFirstBid(true);
    }
  };

  const endAuction = () => {
    if (biddingLog.length === 0) {
      alert("No bids placed!");
      
      // Mark auction as unsold if no bids
      setHistory((prev) => ({
        ...prev,
        [currentTeam.name]: [
          ...(prev[currentTeam.name] || []),
          { status: "Unsold" }, // Mark as unsold
        ],
      }));
      
      // Update available teams to show "Unsold"
      setAvailableTeams((prev) =>
        prev.map((team) =>
          team.name === currentTeam.name ? { ...team, soldTo: "Unsold" } : team
        )
      );
  
      // Reset the current team
      setCurrentTeam(null);
      return;
    }
  
    // If bids are placed, get the highest bid
    const highestBid = biddingLog[biddingLog.length - 1];
    setWinner(highestBid);
  
    // Update history with the winner
    setHistory((prev) => ({
      ...prev,
      [highestBid.teamName]: [
        ...(prev[highestBid.teamName] || []),
        { team: currentTeam.name, amount: highestBid.amount },
      ],
    }));
  
    // Update available teams to show "Sold Out"
    setAvailableTeams((prev) =>
      prev.map((team) =>
        team.name === currentTeam.name
          ? { ...team, soldTo: highestBid.teamName }
          : team
      )
    );
  
    // Remove bidding team from the list
    setBiddingTeams((prev) =>
      prev.filter((team) => team.name !== highestBid.teamName)
    );
  
    // Reset current team
    setCurrentTeam(null);
    setBiddingLog([]);
    setBiddingAmount(BASE_PRICE);
    setCurrentBiddingTeam(null);
    setIsFirstBid(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-slate-100">
      <header className="sticky top-0 z-20 bg-slate-900/80 backdrop-blur border-b border-slate-800">
        <div className="container mx-auto flex items-center gap-4 px-4 py-3">
          <img
            src="/logos/SPORTIUM-MAIN.jpg"
            alt="Sportium Logo"
            className="h-12 w-auto object-contain rounded-md shadow-sm"
          />
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-amber-400">
            ASH League Auction
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-8">
        {/* Add Bidding Teams */}
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

        {/* Available Teams */}
        {!currentTeam && (
          <section>
            <h2 className="text-xl md:text-2xl font-semibold">Available Teams for Auction:</h2>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {availableTeams.map((team) => (
                <div
                  key={team.name}
                  className="group relative overflow-hidden rounded-xl bg-slate-800/60 shadow ring-1 ring-slate-700 hover:shadow-lg transition-shadow"
                >
                  <img src={team.logo} alt={team.name} className="w-full aspect-[4/5] object-cover" />
                  <div className="p-3">
                    {team.soldTo ? (
                      <button
                        disabled
                        className="w-full cursor-not-allowed rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-slate-300"
                      >
                        Sold Out to {team.soldTo}
                      </button>
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
        )}

        {/* Auction In Progress */}
        {currentTeam && (
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

                {/* Display current bidding team */}
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
                      disabled={team.name === currentBiddingTeam}
                      className="rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-sm font-semibold text-white shadow hover:from-amber-400 hover:to-orange-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {team.name} Bid
                    </button>
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
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
        )}

        {/* Auction Winner */}
        {winner && (
          <section className="rounded-2xl bg-slate-800/60 p-6 shadow ring-1 ring-slate-700">
            <h2 className="text-2xl font-semibold">Auction Winner:</h2>
            <p className="mt-2 text-lg">
              <strong>{winner.teamName}</strong> won the auction for {" "}
              <strong>{currentTeam?.name}</strong> with a bid of ₹{winner.amount}.
            </p>
          </section>
        )}

        {/* Bidding History */}
        {Object.keys(history).length > 0 && (
          <section className="rounded-2xl bg-slate-800/50 p-6 shadow ring-1 ring-slate-700">
            <h2 className="text-2xl font-semibold">Bidding History:</h2>
            <ul className="mt-3 space-y-3">
              {Object.entries(history).map(([teamName, records]) => (
                <li key={teamName} className="rounded-lg bg-slate-900/60 p-4 ring-1 ring-slate-700">
                  <strong className="text-amber-300">{teamName}</strong> won:
                  <ul className="mt-2 list-disc list-inside text-slate-200">
                    {records.map((record, index) => (
                      <li key={index}>{record.team} for ₹{record.amount}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
};

export default App;
