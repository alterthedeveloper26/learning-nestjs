import { title } from 'process';
import { Interface } from 'readline';

export enum TaskStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export interface Task {
  id: String;
  title: string;
  description: string;
  status: TaskStatus;
}
