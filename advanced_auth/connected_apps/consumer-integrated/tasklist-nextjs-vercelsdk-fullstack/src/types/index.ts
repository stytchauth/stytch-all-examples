export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export interface User {
  user_id: string;
  email: string;
}

export interface AuthenticatedRequest {
  user?: User;
}
