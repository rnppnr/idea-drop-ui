import { QueryClient } from "@tanstack/react-query";

export type Idea = {
  _id: string;
  title: string;
  summary: string;
  description: string;
  tags: string[];
  createdAt: string;
  user: string;
};

export type RouterContext = {
  queryClient: QueryClient;
};
