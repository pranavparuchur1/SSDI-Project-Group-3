export interface Task {
  title: string;
  dir: string;
  description: string;
  date: string;
  priority: 'level1' | 'level2' | 'level3';
  completed: boolean;
  important: boolean;
  id: string;
}
