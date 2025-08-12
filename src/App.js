import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import AddBiddingTeams from "./components/AddBiddingTeams";
import AvailableTeams from "./components/AvailableTeams";
import AuctionPanel from "./components/AuctionPanel";
import Winner from "./components/Winner";
import History from "./components/History";

const App = () => {
  const BASE_PRICE = 3000;
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
    // Increment rule: up to 5000 => +500, after 5000 => +1000
    const increment = biddingAmount < 5000 ? 500 : 1000;
    const nextAmount = biddingAmount + increment;
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
      <Header title="ASH League Auction" />
      <main className="container mx-auto px-4 py-6 space-y-8">
        <AddBiddingTeams
          newTeamName={newTeamName}
          setNewTeamName={setNewTeamName}
          addBiddingTeam={addBiddingTeam}
          biddingTeams={biddingTeams}
        />

        {!currentTeam && (
          <AvailableTeams
            availableTeams={availableTeams}
            startAuction={startAuction}
            resetTeam={(name) =>
              setAvailableTeams((prev) => prev.map((t) => (t.name === name ? { ...t, soldTo: undefined } : t)))
            }
          />
        )}

        <AuctionPanel
          currentTeam={currentTeam}
          biddingAmount={biddingAmount}
          currentBiddingTeam={currentBiddingTeam}
          biddingTeams={biddingTeams}
          placeBid={placeBid}
          reverseLastBid={reverseLastBid}
          resetToBase={() => {
            setBiddingAmount(BASE_PRICE);
            setBiddingLog([]);
            setCurrentBiddingTeam(null);
            setIsFirstBid(true);
          }}
          endAuction={endAuction}
        />

        <Winner winner={winner} currentTeam={currentTeam} />
        <History history={history} />
      </main>
    </div>
  );
};

export default App;
