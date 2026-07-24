export const mockTasks = [
  {
    id: '1',
    title: 'Complete CSE 499 Project Proposal',
    description: 'Write and submit the project proposal document',
    dueDate: new Date(2026, 6, 10),
    priority: 'high',
    status: 'doing',
    course: 'CSE 499',  // Changed from 'category' to 'course'
  },
  {
    id: '2',
    title: 'Study for Database Exam',
    description: 'Review SQL queries and normalization',
    dueDate: new Date(2026, 6, 15),
    priority: 'high',
    status: 'pending',
    course: 'CSE 333',  // Changed from 'category' to 'course'
  },
  {
    id: '3',
    title: 'Gym Workout',
    description: 'Leg day - squats, lunges, deadlifts',
    dueDate: new Date(2026, 6, 8),
    priority: 'medium',
    status: 'completed',
    course: '',  // Empty for non-academic tasks
  },
  {
    id: '4',
    title: 'Read "Atomic Habits"',
    description: 'Chapters 5-8',
    dueDate: new Date(2026, 6, 12),
    priority: 'low',
    status: 'pending',
    course: '',
  },
  {
    id: '5',
    title: 'Team Meeting - Sprint Review',
    description: 'Review sprint progress with team',
    dueDate: new Date(2026, 6, 9),
    priority: 'medium',
    status: 'pending',
    course: 'CSE 499',
  },
];

export const mockStats = {
  total: 5,
  completed: 1,
  pending: 3,
  doing: 1,
};

export const mockCalendarEvents = [
  {
    id: 1,
    title: 'CSE 499 Class',
    start: new Date(2026, 6, 8, 9, 0),
    end: new Date(2026, 6, 8, 10, 30),
  },
  {
    id: 2,
    title: 'Study Session - Database',
    start: new Date(2026, 6, 8, 14, 0),
    end: new Date(2026, 6, 8, 16, 0),
  },
  {
    id: 3,
    title: 'Team Meeting',
    start: new Date(2026, 6, 9, 11, 0),
    end: new Date(2026, 6, 9, 12, 0),
  },
];