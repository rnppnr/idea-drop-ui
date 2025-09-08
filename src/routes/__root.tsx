import {
  HeadContent,
  Outlet,
  createRootRouteWithContext,
} from "@tanstack/react-router";

import { TanstackDevtools } from "@tanstack/react-devtools";

import type { RouterContext } from "../types/types";

import Header from "../components/Header";
import { Link } from "@tanstack/react-router";

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      {
        name: "description",
        content: "Share, explore and build on the best ideas and side hustles.",
      },
      {
        title: "IdeaDrop - Your Idea Hub",
      },
    ],
  }),
  component: RootLayout,
  notFoundComponent: NotFound,
  // component: () => (
  //   <>
  //     <HeadContent />
  //     <Outlet />
  //     <TanstackDevtools
  //       config={{
  //         position: "bottom-left",
  //       }}
  //       plugins={[
  //         {
  //           name: "Tanstack Router",
  //           render: <TanStackRouterDevtoolsPanel />,
  //         },
  //       ]}
  //     />
  //   </>
  // ),
});

function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <HeadContent />
      <Header />
      <main className="flex justify-center p-6">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-8">
          <Outlet />
        </div>
      </main>
      <TanstackDevtools />
    </div>
  );
}

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-gray-600 mb-6">
        The page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
}
