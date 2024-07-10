// https://leetcode.com/discuss/interview-question/object-oriented-design/1177601/flipkart-machine-coding-design-online-coding-platform-coding-blox-leetcode-lld


const readline = require('readline');

// User class to represent a user
class User {
    constructor(name) {
        this.name = name;
        this.score = 1500;
        this.contestsAttended = [];
    }
}

// Question class to represent a question
class Question {
    constructor(id, difficulty, score) {
        this.id = id;
        this.difficulty = difficulty;
        this.score = score;
    }
}

// Contest class to represent a contest
class Contest {
    constructor(id, name, level, creator) {
        this.id = id;
        this.name = name;
        this.level = level;
        this.creator = creator;
        this.participants = [creator];
        this.isRunning = false;
    }

    // Add participant to the contest
    addParticipant(userName) {
        if (!this.participants.includes(userName)) {
            this.participants.push(userName);
        }
    }

    // Remove participant from the contest
    removeParticipant(userName) {
        if (this.participants.includes(userName) && this.creator !== userName) {
            this.participants = this.participants.filter(participant => participant !== userName);
        }
    }
}

// Main Coding Blox platform class
class CodingBlox {
    constructor() {
        this.users = {};
        this.questions = {};
        this.contests = {};
        this.nextQuestionId = 1;
        this.nextContestId = 1;
    }

    // Register a new user
    createUser(userName) {
        if (this.users[userName]) {
            console.log(`User ${userName} already exists.`);
        } else {
            this.users[userName] = new User(userName);
            console.log(`User ${userName} created successfully.`);
        }
    }

    // Register a new question
    createQuestion(difficulty, score) {
        const id = this.nextQuestionId++;
        this.questions[id] = new Question(id, difficulty, score);
        console.log(`Question ${id} with difficulty ${difficulty} and score ${score} created successfully.`);
    }

    // List questions
    listQuestions(difficulty = null) {
        let questions = Object.values(this.questions);
        if (difficulty) {
            questions = questions.filter(question => question.difficulty === difficulty);
        }
        console.table(questions);
    }

    // Create a new contest
    createContest(name, level, creator) {
        if (!this.users[creator]) {
            console.log(`User ${creator} does not exist.`);
            return;
        }
        const id = this.nextContestId++;
        this.contests[id] = new Contest(id, name, level, creator);
        this.users[creator].contestsAttended.push(id);
        console.log(`Contest ${name} with level ${level} created by ${creator} successfully.`);
    }

    // List contests
    listContests(level = null) {
        let contests = Object.values(this.contests);
        if (level) {
            contests = contests.filter(contest => contest.level === level);
        }
        console.table(contests);
    }

    // Attend a contest
    attendContest(contestId, userName) {
        const contest = this.contests[contestId];
        if (!contest) {
            console.log(`Contest ${contestId} does not exist.`);
            return;
        }
        if (!this.users[userName]) {
            console.log(`User ${userName} does not exist.`);
            return;
        }
        contest.addParticipant(userName);
        this.users[userName].contestsAttended.push(contestId);
        console.log(`User ${userName} attended contest ${contestId} successfully.`);
    }

    // Run a contest
    runContest(contestId, creator) {
        const contest = this.contests[contestId];
        if (!contest) {
            console.log(`Contest ${contestId} does not exist.`);
            return;
        }
        if (contest.creator !== creator) {
            console.log(`Only the creator ${creator} can run the contest ${contestId}.`);
            return;
        }
        contest.isRunning = true;

        const difficulty = contest.level;
        const questions = Object.values(this.questions).filter(q => q.difficulty === difficulty);
        const maxQuestions = Math.min(3, questions.length); // Assume each contest gets 3 questions max

        contest.participants.forEach(userName => {
            const user = this.users[userName];
            const userQuestions = [];

            for (let i = 0; i < maxQuestions; i++) {
                const question = questions[i];
                userQuestions.push(question.id);
            }

            // Calculate score
            const currentContestPoints = userQuestions.reduce((sum, qId) => sum + this.questions[qId].score, 0);
            let newScore = user.score;

            switch (difficulty) {
                case 'LOW':
                    newScore += currentContestPoints - 50;
                    break;
                case 'MEDIUM':
                    newScore += currentContestPoints - 30;
                    break;
                case 'HIGH':
                    newScore += currentContestPoints;
                    break;
            }

            user.score = newScore;
            console.log(`${userName} solved questions ${userQuestions.join(', ')} and scored ${newScore}.`);
        });

        console.log(`Contest ${contestId} run successfully.`);
    }

    // Display leaderboard
    leaderboard(order = 'desc') {
        const sortedUsers = Object.values(this.users).sort((a, b) => order === 'desc' ? b.score - a.score : a.score - b.score);
        console.table(sortedUsers, ['name', 'score']);
    }

    // Display contest history
    contestHistory(contestId) {
        const contest = this.contests[contestId];
        if (!contest) {
            console.log(`Contest ${contestId} does not exist.`);
            return;
        }

        const history = contest.participants.map(userName => {
            const user = this.users[userName];
            const questions = Object.values(this.questions).filter(q => q.difficulty === contest.level);
            const maxQuestions = Math.min(3, questions.length);
            const userQuestions = questions.slice(0, maxQuestions).map(q => q.id);
            const points = userQuestions.reduce((sum, qId) => sum + this.questions[qId].score, 0);

            return {
                userName,
                points,
                questions: userQuestions
            };
        });

        console.table(history);
    }

    // Withdraw from contest
    withdrawContest(contestId, userName) {
        const contest = this.contests[contestId];
        if (!contest) {
            console.log(`Contest ${contestId} does not exist.`);
            return;
        }
        if (!this.users[userName]) {
            console.log(`User ${userName} does not exist.`);
            return;
        }
        contest.removeParticipant(userName);
        console.log(`User ${userName} withdrew from contest ${contestId} successfully.`);
    }
}

// CLI setup
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const codingBlox = new CodingBlox();

const commands = {
    'CreateUser': (args) => codingBlox.createUser(args[0]),
    'CreateQuestion': (args) => codingBlox.createQuestion(args[0], parseInt(args[1])),
    'ListQuestion': (args) => codingBlox.listQuestions(args[0]),
    'CreateContest': (args) => codingBlox.createContest(args[0], args[1], args[2]),
    'ListContest': (args) => codingBlox.listContests(args[0]),
    'AttendContest': (args) => codingBlox.attendContest(parseInt(args[0]), args[1]),
    'RunContest': (args) => codingBlox.runContest(parseInt(args[0]), args[1]),
    'LeaderBoard': (args) => codingBlox.leaderboard(args[0]),
    'ContestHistory': (args) => codingBlox.contestHistory(parseInt(args[0])),
    'WithdrawContest': (args) => codingBlox.withdrawContest(parseInt(args[0]), args[1]),
};

console.log('Enter commands:');

rl.on('line', (input) => {
    const [command, ...args] = input.split(' ').map(arg => arg.trim().replace(/"/g, ''));
    try {
        if (commands[command]) {
            commands[command](args);
        } else {
            console.log('Invalid command');
        }
    } catch (error) {
        console.log(error.message);
    }
});
