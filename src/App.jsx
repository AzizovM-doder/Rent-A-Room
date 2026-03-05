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
import Post from "./pages/post/post";
import { getUserToken } from "./utils/url";
import AdminListings from "./pages/admin/adminListing";
import Error from "./pages/error/error";
import { Navigate } from "react-router-dom";
const ProtectedRoute = ({ children }) => {
  const user = (() => {
    try {
      const u = getUserToken();
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  })();
  
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const GuestRoute = ({ children }) => {
  const user = (() => {
    try {
      const u = getUserToken();
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  })();
  
  if (user) return <Navigate to="/" replace />;
  return children;
};

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      errorElement : <Error/>,
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
          element: <GuestRoute><Login /></GuestRoute>,
        },
        {
          path: "signUp",
          element: <GuestRoute><SignUp /></GuestRoute>,
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
          path : "massage/:id",
          element : <Massage/>
        },
        {
          path : "post",
          element : <ProtectedRoute><Post/></ProtectedRoute>
        },
        {
          path : "admin",
          element :<AdminListings/>
        },
        {
          path: "explore/:id",
          element: <Info />,
        },
      ],
    },
  ]);
  return (
    <div>
      <Toaster position="bottom-left" reverseOrder={false} />
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
