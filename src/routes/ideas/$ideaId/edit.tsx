import { useState } from "react";

import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";

import { useMutation, useSuspenseQuery } from "@tanstack/react-query";

import { updateIdea, ideaQueryOptions } from "@/api/ideas";

export const Route = createFileRoute("/ideas/$ideaId/edit")({
  component: IdeaEditPage,
  loader: async ({ params, context: { queryClient } }) => {
    return queryClient.ensureQueryData(ideaQueryOptions(params.ideaId));
  },
});

function IdeaEditPage() {
  const { ideaId } = Route.useParams();
  const navigate = useNavigate();

  const { data: idea } = useSuspenseQuery(ideaQueryOptions(ideaId));

  const [title, setTitle] = useState(idea.title);
  const [summary, setSummary] = useState(idea.summary);
  const [description, setDescription] = useState(idea.description);
  const [tagsInput, setTagsInput] = useState(idea.tags.join(", "));

  const { mutateAsync, isPending } = useMutation({
    mutationFn: () =>
      updateIdea(ideaId, {
        title,
        summary,
        description,
        tags: tagsInput.split(",").map((tag) => tag.trim()),
      }),
    onSuccess: () => {
      navigate({ to: `/ideas/${ideaId}`, params: { ideaId } });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isPending) return;

    await mutateAsync();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Edit Idea</h1>
        <Link
          to="/ideas/$ideaId"
          params={{ ideaId }}
          className="text-sm text-blue-600 hover:underline"
        >
          <span>&larr;</span> Back to Idea
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter idea title"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Summary</label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter idea summary"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter idea description"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Tags</label>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter tags separated by commas"
          />
        </div>

        <button
          type="button"
          disabled={isPending}
          onClick={handleSubmit}
          className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Updating" : "Update Idea"}
        </button>
      </form>
    </div>
  );
}
