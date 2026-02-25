import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AppHome from "./pages/AppHome";
import AnimeDetail from "./pages/AnimeDetail";
import MyList from "./pages/MyList";
import Settings from "./pages/Settings";
import { isAuthed } from "./services/auth";

function PrivateRoute({ children }) {
  return isAuthed() ? children : <Navigate to="/app/login" replace />;
}

export const router = createBrowserRouter([
  {
    path: "/app",
    element: <App />,
    children: [
      { index: true, element: <AppHome /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      {
        path: "anime/:id",
        element: (
          <PrivateRoute>
            <AnimeDetail />
          </PrivateRoute>
        ),
      },
      {
        path: "list",
        element: (
          <PrivateRoute>
            <MyList />
          </PrivateRoute>
        ),
      },
      {
        path: "settings",
        element: (
          <PrivateRoute>
            <Settings />
          </PrivateRoute>
        ),
      },
    ],
  },
  // opcional: redirigir raíz del frontend a /app
  { path: "*", element: <Navigate to="/app" replace /> },
]);