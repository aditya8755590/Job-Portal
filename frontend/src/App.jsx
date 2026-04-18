import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Navbar from "./components/shared/Navbar";
import Home from "./components/Home";
import Jobs from "./components/Jobs";
import Browse from "./components/Browse";
import Profile from "./components/Profile";
import JobDescpription from "./components/JobDescpription";

const appRouter = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/jobs", element: <Jobs /> },
  { path: "/description/:id", element: <JobDescpription /> },
  { path: "/browse", element: <Browse /> },

  { path: "/profile", element: <Profile /> },
]);

function App() {
  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  );
}

export default App;
