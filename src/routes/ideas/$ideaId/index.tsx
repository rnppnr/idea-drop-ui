import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

import { deleteIdea, ideaQueryOptions } from "@/api/ideas";
import { useSuspenseQuery, useMutation } from "@tanstack/react-query";

import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/ideas/$ideaId/")({
  component: IdeaDetailsPage,
  loader: async ({ params, context: { queryClient } }) => {
    return queryClient.ensureQueryData(ideaQueryOptions(params.ideaId));
  },
});

function IdeaDetailsPage() {
  const { ideaId } = Route.useParams();
  const { data: idea } = useSuspenseQuery(ideaQueryOptions(ideaId));

  const navigate = useNavigate();

  const { user } = useAuth();

  const { mutateAsync: deleteMutate, isPending } = useMutation({
    mutationFn: async () => deleteIdea(ideaId),
    onSuccess: () => {
      navigate({ to: "/ideas" });
    },
  });

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this idea?")) {
      await deleteMutate();
    }
  };

  return (
    <div className="p-4">
      <Link to="/ideas" className="text-blue-500 hover:underline block mb-4">
        Back to Ideas
      </Link>
      <h1 className="text-2xl font-bold mb-2">{idea.title}</h1>
      <p className="text-gray-600 mt-2">{idea.description}</p>

      {user && user.id === idea.user && (
        <>
          <Link to="/ideas/$ideaId/edit" params={{ ideaId }}>
            <button className="inline-block cursor-pointer text-sm mt-4 mr-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition">
              Edit
            </button>
          </Link>

          <button
            onClick={handleDelete}
            className="inline-block cursor-pointer text-sm bg-red-600 text-white mt-4 ml-2 px-4 py-2 rounded transition disabled:opacity-50"
          >
            {isPending ? "Deleting..." : "Delete"}
          </button>
        </>
      )}
    </div>
  );
}
