// https://leetcode.com/discuss/interview-question/990227/udaan-assignment-cricket-match-dashboard

// Define a Player class to keep track of individual player statistics
class Player {
  constructor(name) {
    this.name = name;
    this.score = 0;
    this.fours = 0;
    this.sixes = 0;
    this.balls = 0;
    this.isOut = false;
  }

  // Method to update player's score and statistics based on the run scored
  addRun(run) {
    if (run === 4) this.fours += 1;
    if (run === 6) this.sixes += 1;
    this.score += run;
    this.balls += 1;
  }

  // Method to mark the player as out
  out() {
    this.isOut = true;
  }
}

// Define a Team class to keep track of team statistics and player order
class Team {
  constructor(players) {
    this.players = players.map(name => new Player(name));
    this.totalScore = 0;
    this.wickets = 0;
    this.currentPlayerIndex = 0;
    this.striker = this.players[0];
    this.nonStriker = this.players[1];
  }

  // Method to handle ball by ball score updates
  addBall(run) {
    if (run === 'W') {
      this.striker.out();
      this.wickets += 1;
      this.nextPlayer();
    } else if (run === 'Wd' || run === 'Nb') {
      this.totalScore += 1;
    } else {
      this.striker.addRun(run);
      this.totalScore += run;
      if (run % 2 === 1) this.swapStrike();
    }
  }

  // Method to handle the striker and non-striker swap at the end of the over
  endOver() {
    this.swapStrike();
  }

  // Method to swap the striker and non-striker
  swapStrike() {
    [this.striker, this.nonStriker] = [this.nonStriker, this.striker];
  }

  // Method to get the next player in case of a wicket
  nextPlayer() {
    this.currentPlayerIndex += 1;
    this.striker = this.players[this.currentPlayerIndex + 1];
  }

  // Method to print the current scorecard of the team
  printScorecard() {
    console.log("Scorecard:");
    this.players.forEach(player => {
      let status = player === this.striker ? '*' : '';
      console.log(`${player.name}${status} - Runs: ${player.score}, 4s: ${player.fours}, 6s: ${player.sixes}, Balls: ${player.balls}`);
    });
    console.log(`Total: ${this.totalScore}/${this.wickets}`);
  }
}

// Function to simulate the cricket match
function simulateMatch() {
  let team1 = new Team(['P1', 'P2', 'P3', 'P4', 'P5']);
  let team2 = new Team(['P6', 'P7', 'P8', 'P9', 'P10']);

  let overs = 2;
  let ballsPerOver = 6;

  // Example input for Team 1
  let team1Balls = [1, 1, 1, 1, 1, 2, 'W', 4, 4, 'Wd', 'W', 1, 6];
  // Example input for Team 2
  let team2Balls = [4, 6, 'W', 'W', 1, 1, 6, 1, 'W', 'W'];

  // Simulate Team 1 innings
  console.log("Team 1 Innings:");
  for (let i = 0; i < overs; i++) {
    for (let j = 0; j < ballsPerOver; j++) {
      let ball = team1Balls.shift();
      if (ball !== undefined) team1.addBall(ball);
    }
    team1.endOver();
    team1.printScorecard();
  }

  // Simulate Team 2 innings
  console.log("Team 2 Innings:");
  for (let i = 0; i < overs; i++) {
    for (let j = 0; j < ballsPerOver; j++) {
      let ball = team2Balls.shift();
      if (ball !== undefined) team2.addBall(ball);
    }
    team2.endOver();
    team2.printScorecard();
  }

  // Determine the result
  if (team1.totalScore > team2.totalScore) {
    console.log("Result: Team 1 won the match by " + (team1.totalScore - team2.totalScore) + " runs");
  } else if (team2.totalScore > team1.totalScore) {
    console.log("Result: Team 2 won the match by " + (team2.players.length - team2.wickets) + " wickets");
  } else {
    console.log("Result: The match is a draw");
  }
}

// Run the simulation
simulateMatch();
