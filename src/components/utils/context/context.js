import { createContext } from "react";

export const DatabaseContext = createContext({})
export const SidebarContext = createContext({});

export const testProjects = [
  {
    id: 'le6tmu59',
    name: 'Project 1',
  },
  {
    id: 'le6tmu60',
    name: 'Project 2',
  },
];

export const testTodos = [
  {
    name: 'Todo 1',
    id: 'lf25yyz4',
    notes: '',
    project: {
      id: 'le6tmu59',
      name: 'Project 1',
    },
    date: new Date(),
    priority: 'High',
    created: '2023-03-10T06:35:43.120Z',
  },
  {
    name: 'Todo 2',
    id: 'lf25zdq0',
    notes: '',
    project: {
      id: 'le6tmu59',
      name: 'Project 1',
    },
    date: '',
    priority: 'Medium',
    created: '2023-03-10T06:36:02.232Z',
  },
  {
    name: 'Todo 3',
    id: 'lf25zkat',
    notes: '',
    project: {
      id: 'le6tmu59',
      name: 'Project 1',
    },
    date: '',
    priority: 'Medium',
    created: '2023-02-10T06:36:10.757Z',
  },
];