import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import type { Idea } from "@/types/types";

import { createIdea } from "@/api/ideas";

export const Route = createFileRoute("/ideas/new/")({
  component: NewIdeasPage,
});

function NewIdeasPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createIdea,
    onSuccess: () => {
      navigate({ to: "/ideas" });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !title.trim() ||
      !summary.trim() ||
      !description.trim() ||
      tags.length === 0
    ) {
      alert("Please fill in all fields and add at least one tag.");
      return;
    }

    if (isPending) return;

    const newIdea: Idea = {
      _id: Date.now().toString(), // Temporary ID generation
      title,
      summary,
      description,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== ""),
      user: "currentUser", // Placeholder for current user
      createdAt: new Date().toISOString(),
    };

    try {
      await mutateAsync(newIdea);
    } catch (error) {
      console.error("Error creating idea:", error);
      alert("Failed to create idea. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-6">Create New Idea</h1>
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
            value={tags}
            onChange={(e) => setTags(e.target.value)}
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
          {isPending ? "..." : "Create Idea"}
        </button>
      </form>
    </div>
  );
}
