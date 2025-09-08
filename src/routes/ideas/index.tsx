import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

import type { Idea } from "@/types/types";
import { ideasShowAll } from "@/api/ideas";
import IdeaCard from "@/components/IdeaCard";

export const Route = createFileRoute("/ideas/")({
  head: () => ({
    meta: [
      {
        title: "IdeaDrop - Browse Ideas",
      },
    ],
  }),
  component: IdeasPage,
  loader: async ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(ideasShowAll());
  },
});

function IdeasPage() {
  const { data: ideas } = useSuspenseQuery(ideasShowAll());

  return (
    <>
      <div className="p-4">
        <h1 className="text-2xl text-center font-bold mb-4">Ideas</h1>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ideas.map((idea: Idea) => (
            <IdeaCard key={idea._id} idea={idea} button={true} />
          ))}
        </ul>
      </div>
    </>
  );
}
