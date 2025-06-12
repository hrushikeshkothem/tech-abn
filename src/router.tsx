import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  redirect,
} from "react-router-dom";
import Home from "./app/page";
import About from "./app/about/page";
import Sources from "./app/sources/page";
import Saved from "./app/saved/page";
import Terms from "./app/terms/page";
import RootLayout from "./app/layout";
import { storage } from "./storage/main";
import Preferences from "./app/preferences/page";
import WorkerRegister from "./workers/register";
import SingleSource from "./app/sources/[id]/page";

const checkSources = async () => {
  const sources = await storage.getAllSources();
  if (sources.length === 0) {
    return redirect("/about");
  }
  return null;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        loader: checkSources,
        element: <Home />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "sources",
        children: [
          {
            index: true,
            element: <Sources />,
          },
          {
            path: ":id",
            element: <SingleSource />,
          },
        ],
      },
      {
        path: "saved",
        element: <Saved />,
      },
      {
        path: "terms",
        element: <Terms />,
      },
      {
        path: "preferences",
        element: <Preferences />
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

export default function Router() {
  return (
    <WorkerRegister>
      <RouterProvider router={router} />;
    </WorkerRegister>
  );
}
