import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./layout/layout";
import Home from "./pages/home/home";
import About from "./pages/about/about";
import Contact from "./pages/contact/contact";
import Login from "./pages/auth/login/login";
import Info from "./pages/info/info";
import SignUp from "./pages/auth/signUp/signUp";
import { Toaster } from "react-hot-toast";
import Profile from "./pages/profile/profile";
import Favorites from "./pages/favorites/favorites";
import Massage from "./pages/massage/massage";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "about",
          element: <About />,
        },
        {
          path: "contact",
          element: <Contact />,
        },
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "signUp",
          element: <SignUp />,
        },
        {
          path: "profile",
          element: <Profile />,
        },
        {
          path: "favorites",
          element: <Favorites />,
        },
        {
          path : "/massage/:id",
          element : <Massage/>
        },
        {
          path: "/explore/:id",
          element: <Info />,
        },
      ],
    },
  ]);
  return (
    <div>
      <Toaster position="top-right" reverseOrder={false} />
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
