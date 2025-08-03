export type Task = {
  taskname: string;
  taskdate: string;
  tasktime: string;
  status: 'completed' | 'pending';
  category?: string;
};
