// https://github.com/kumaransg/LLD/blob/main/Event_calendar_flipkart/Event%20Calendar.pdf


// User class to represent a user and their working hours
class User {
  constructor(name, workingHours) {
    this.name = name;
    this.workingHours = workingHours;
    this.events = [];
  }

  // Method to check if the user is available during a given time
  isAvailable(startTime, endTime) {
    if (startTime < this.workingHours.start || endTime > this.workingHours.end) {
      return false;
    }
    for (let event of this.events) {
      if ((startTime >= event.start && startTime < event.end) || 
          (endTime > event.start && endTime <= event.end) || 
          (startTime <= event.start && endTime >= event.end)) {
        return false;
      }
    }
    return true;
  }

  // Method to add an event to the user's schedule
  addEvent(event) {
    this.events.push(event);
  }
}

// Team class to represent a team and its members
class Team {
  constructor(name, members) {
    this.name = name;
    this.members = members;
  }

  // Method to check if the team has the required number of available members
  hasAvailableMembers(startTime, endTime, requiredMembers) {
    let availableMembers = this.members.filter(member => member.isAvailable(startTime, endTime));
    return availableMembers.length >= requiredMembers;
  }

  // Method to block the required number of members for an event
  blockMembersForEvent(event, requiredMembers) {
    let availableMembers = this.members.filter(member => member.isAvailable(event.start, event.end));
    for (let i = 0; i < requiredMembers; i++) {
      availableMembers[i].addEvent(event);
    }
  }
}

// Event class to represent an event with participants and timing
class Event {
  constructor(name, participants, start, end, requiredRepresentatives) {
    this.name = name;
    this.participants = participants;
    this.start = start;
    this.end = end;
    this.requiredRepresentatives = requiredRepresentatives;
  }
}

// Scheduler class to manage users, teams, and events
class Scheduler {
  constructor() {
    this.users = [];
    this.teams = [];
    this.events = [];
  }

  // Method to onboard a user with their working hours
  onboardUser(name, workingHours) {
    let user = new User(name, workingHours);
    this.users.push(user);
    return user;
  }

  // Method to create a team of users
  createTeam(name, members) {
    let team = new Team(name, members);
    this.teams.push(team);
    return team;
  }

  // Method to create an event with participants and timing
  createEvent(name, participants, start, end, requiredRepresentatives) {
    for (let participant of participants) {
      if (participant instanceof User) {
        if (!participant.isAvailable(start, end)) {
          console.log(`Cannot create event ${name}: User ${participant.name} is not available`);
          return;
        }
      } else if (participant instanceof Team) {
        if (!participant.hasAvailableMembers(start, end, requiredRepresentatives)) {
          console.log(`Cannot create event ${name}: Team ${participant.name} does not have enough available members`);
          return;
        }
      }
    }
    let event = new Event(name, participants, start, end, requiredRepresentatives);
    this.events.push(event);
    for (let participant of participants) {
      if (participant instanceof User) {
        participant.addEvent(event);
      } else if (participant instanceof Team) {
        participant.blockMembersForEvent(event, requiredRepresentatives);
      }
    }
    console.log(`Event ${name} created successfully`);
  }

  // Method to get events for a user in a given time range
  getEventsForUser(user, startTime, endTime) {
    return user.events.filter(event => 
      (event.start >= startTime && event.start < endTime) || 
      (event.end > startTime && event.end <= endTime) || 
      (event.start <= startTime && event.end >= endTime)
    );
  }

  // Method to suggest available time slots for a list of users/teams for a given day
  suggestAvailableSlots(participants, dayStart, dayEnd, requiredRepresentatives) {
    let availableSlots = [];
    for (let hour = dayStart; hour < dayEnd; hour++) {
      let slotStart = new Date(hour);
      let slotEnd = new Date(hour + 1);
      let allAvailable = true;
      for (let participant of participants) {
        if (participant instanceof User) {
          if (!participant.isAvailable(slotStart, slotEnd)) {
            allAvailable = false;
            break;
          }
        } else if (participant instanceof Team) {
          if (!participant.hasAvailableMembers(slotStart, slotEnd, requiredRepresentatives)) {
            allAvailable = false;
            break;
          }
        }
      }
      if (allAvailable) {
        availableSlots.push(`${slotStart.toLocaleTimeString()} to ${slotEnd.toLocaleTimeString()}`);
      }
    }
    return availableSlots;
  }
}

// Testing the implementation with sample test cases

// Onboarding users
let scheduler = new Scheduler();
let userA = scheduler.onboardUser('A', {start: new Date('2024-07-03T10:00:00'), end: new Date('2024-07-03T19:00:00')});
let userB = scheduler.onboardUser('B', {start: new Date('2024-07-03T09:30:00'), end: new Date('2024-07-03T17:30:00')});
let userC = scheduler.onboardUser('C', {start: new Date('2024-07-03T11:30:00'), end: new Date('2024-07-03T18:30:00')});
let userD = scheduler.onboardUser('D', {start: new Date('2024-07-03T10:00:00'), end: new Date('2024-07-03T18:00:00')});
let userE = scheduler.onboardUser('E', {start: new Date('2024-07-03T11:00:00'), end: new Date('2024-07-03T19:30:00')});
let userF = scheduler.onboardUser('F', {start: new Date('2024-07-03T11:00:00'), end: new Date('2024-07-03T18:30:00')});

// Creating teams
let teamT1 = scheduler.createTeam('T1', [userC, userE]);
let teamT2 = scheduler.createTeam('T2', [userB, userD, userF]);

// Creating events
scheduler.createEvent('Event1', [userA, teamT1], new Date('2024-07-04T14:00:00'), new Date('2024-07-04T15:00:00'), 2);
scheduler.createEvent('Event2', [userC], new Date('2024-07-04T14:00:00'), new Date('2024-07-04T15:00:00'), 1); // should fail
scheduler.createEvent('Event3', [teamT1, teamT2], new Date('2024-07-03T15:00:00'), new Date('2024-07-03T16:00:00'), 2);
scheduler.createEvent('Event4', [userA, teamT2], new Date('2024-07-03T15:00:00'), new Date('2024-07-03T16:00:00'), 1);
scheduler.createEvent('Event5', [userA, userF], new Date('2024-07-03T10:00:00'), new Date('2024-07-03T11:00:00'), 1); // should fail

// Getting events for a user in a given time range
console.log('Events for user A from current day 10AM to next day 5PM:');
console.log(scheduler.getEventsForUser(userA, new Date('2024-07-03T10:00:00'), new Date('2024-07-04T17:00:00')));

console.log('Events for user B from current day 10AM to next day 5PM:');
console.log(scheduler.getEventsForUser(userB, new Date('2024-07-03T10:00:00'), new Date('2024-07-04T17:00:00')));

// Suggesting available time slots
console.log('Available time slots for user A and team T1 with 1 representation for current day:');
console.log(scheduler.suggestAvailableSlots([userA, teamT1], new Date('2024-07-03T10:00:00'), new Date('2024-07-03T19:00:00'), 1));
