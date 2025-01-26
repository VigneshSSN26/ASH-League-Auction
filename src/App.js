import React, { useState } from "react";
import "./App.css";

const App = () => {
  const teams = [
    { name: "CT Night Riders", logo: "logos/CT Night Riders Poster.png" },
    { name: "Fountain Sharks", logo: "/logos/Fountain Sharks Poster.png" },
    { name: "GRH'unters", logo: "logos/GRH'unters Poster.png" },
    { name: "MCChargers", logo: "/logos/MCChargers.png" },
    { name: "OATitans", logo: "/logos/OATitans Poster.png" },
  ];

  const [availableTeams, setAvailableTeams] = useState(teams);
  const [biddingTeams, setBiddingTeams] = useState([]);
  const [biddingLog, setBiddingLog] = useState([]);
  const [currentTeam, setCurrentTeam] = useState(null);
  const [biddingAmount, setBiddingAmount] = useState(3000);
  const [history, setHistory] = useState({});
  const [newTeamName, setNewTeamName] = useState("");
  const [winner, setWinner] = useState(null);
  const [isFirstBid, setIsFirstBid] = useState(true); // Track if it's the first bid
  const [currentBiddingTeam, setCurrentBiddingTeam] = useState(null); // Track the current bidding team

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
    setBiddingAmount(3000); // Set base price at the start of the auction
    setBiddingLog([]);
    setWinner(null);
    setIsFirstBid(true); // Reset for new auction
    setCurrentBiddingTeam(null); // Clear the previous bidding team
  };

  const placeBid = (teamName) => {
    if (currentBiddingTeam === teamName) {
      alert("This team is already holding the bid.");
      return; // Prevent the same team from bidding again
    }

    let increment = 200; // Default increment for the first bid

    // After the first bid, set increment to 500 or 200 depending on amount
    if (!isFirstBid) {
      increment = biddingAmount >= 6000 ? 500 : 200;
    }else{
    increment=0; // Set the initial base price
    setIsFirstBid(false);
  }


    setBiddingAmount((prev) => prev + increment);
    setIsFirstBid(false); // Mark that the first bid is placed
    setCurrentBiddingTeam(teamName); // Set the current bidding team
    setBiddingLog((prev) => [...prev, { teamName, amount: biddingAmount }]);
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
  };

  return (
    <div className="auction-container">
      <img src="/logos/SPORTIUM-MAIN.jpg" alt="Sportium Logo" className="sportium-logo" />
      <h1 className="auction-heading">ASH League Auction</h1>

      {/* Add Bidding Teams */}
      <div className="add-teams-section">
        <h2>Add Bidding Teams</h2>
        <div className="add-teams-form">
          <input
            type="text"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            placeholder="Enter team name"
          />
          <button onClick={addBiddingTeam}>Add Team</button>
        </div>
        <div className="bidding-teams-list">
          <h3>Bidding Teams:</h3>
          <ul>
            {biddingTeams.map((team, index) => (
              <li key={index}>{team.name}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Available Teams Sliding Display */}
      {!currentTeam && (
        <div className="available-teams">
          <h2>Available Teams for Auction:</h2>
          <div className="teams-slider">
            {availableTeams.map((team) => (
              <div key={team.name} className="team-card">
                <img src={team.logo} alt={team.name} />
                {team.soldTo ? (
                  <button disabled>
                    Sold Out to {team.soldTo}
                  </button>
                ) : (
                  <button onClick={() => startAuction(team)}>
                    Start Auction for {team.name}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Auction In Progress */}
      {currentTeam && (
        <div className="auction-section">
          <h2>Bidding for: {currentTeam?.name}</h2>
          <div className="auction-content">
            <div className="team-logo-container">
              <img
                src={currentTeam.logo}
                alt={currentTeam.name}
                className="team-logo"
              />
            </div>
            <p>Current Bid: ₹{biddingAmount}</p>

            {/* Display current bidding team */}
            {currentBiddingTeam && (
              <div className="current-bidding-team">
                <p>Current Bidding Team: {currentBiddingTeam}</p>
              </div>
            )}

            <div className="bid-buttons">
              {biddingTeams.map((team, index) => (
                <button
                  key={index}
                  onClick={() => placeBid(team.name)}
                  disabled={team.name === currentBiddingTeam} // Disable if team is holding the bid
                >
                  {team.name} Bid
                </button>
              ))}
            </div>
            <button onClick={endAuction} className="end-auction-button">
              End Auction
            </button>
          </div>
        </div>
      )}

      {/* Auction Winner */}
      {winner && (
        <div className="winner-section">
          <h2>Auction Winner:</h2>
          <p>
            <strong>{winner.teamName}</strong> won the auction for{" "}
            <strong>{currentTeam?.name}</strong> with a bid of ₹{winner.amount}.
          </p>
        </div>
      )}

      {/* Bidding History */}
      {Object.keys(history).length > 0 && (
        <div className="history-section">
          <h2>Bidding History:</h2>
          <ul>
            {Object.entries(history).map(([teamName, records]) => (
              <li key={teamName}>
                <strong>{teamName}</strong> won:
                <ul>
                  {records.map((record, index) => (
                    <li key={index}>
                      {record.team} for ₹{record.amount}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;
