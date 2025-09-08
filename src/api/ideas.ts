import { queryOptions } from "@tanstack/react-query";
import type { Idea } from "@/types/types";
import api from "@/lib/axios";

export const ideaQueryOptions = (ideaId: string) =>
  queryOptions({
    queryKey: ["idea", ideaId],
    queryFn: () => fetchIdea(ideaId),
  });

export const ideasQueryOptions = () =>
  queryOptions({
    queryKey: ["ideas", { limit: 3 }],
    queryFn: () => fetchIdeas(3),
  });

export const ideasShowAll = () =>
  queryOptions({
    queryKey: ["ideas", { limit: 3 }],
    queryFn: () => fetchIdeas(),
  });

export const fetchIdea = async (ideaId: string): Promise<Idea> => {
  const response = await api.get(`/ideas/${ideaId}`);
  return response.data;
};

export const fetchIdeas = async (limit?: number): Promise<Idea[]> => {
  const response = await api.get(`/ideas`, {
    params: limit ? { _limit: limit } : {},
  });
  return response.data;
};

export const createIdea = async (newIdea: {
  title: string;
  summary: string;
  description: string;
  tags: string[];
  user: string; // Assuming user is a string, adjust as necessary
  createdAt: string; // ISO date string
}): Promise<Idea> => {
  const response = await api.post(`/ideas`, {
    ...newIdea,
    createdAt: new Date().toISOString(),
  });
  return response.data;
};

export const deleteIdea = async (ideaId: string): Promise<void> => {
  await api.delete(`/ideas/${ideaId}`);
};

export const updateIdea = async (
  ideaId: string,
  updatedIdea: {
    title?: string;
    summary?: string;
    description?: string;
    tags?: string[];
  }
): Promise<Idea> => {
  const response = await api.put(`/ideas/${ideaId}`, updatedIdea);
  return response.data;
};
