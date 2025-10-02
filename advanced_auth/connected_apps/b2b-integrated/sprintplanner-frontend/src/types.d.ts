export type Ticket = {
  id: string;
  title: string;
  assignee: string; // member ID from the organization
  status: "backlog" | "in-progress" | "review" | "done";
  createdAt: string;
  updatedAt: string;
};
