import React from "react";
import Nav from "../widgets/layouts/nav";
import { Outlet } from "react-router-dom";
import Footer from "../widgets/layouts/footer";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <div className="py-5" />
      <main className="flex-1">
        <div className="m-auto max-w-7xl px-4 py-10 lg:py-20 pb-16">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
