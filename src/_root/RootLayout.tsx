import { Outlet } from "react-router-dom";

import Topbar from "@/components/shared/Topbar";
import Bottombar from "@/components/shared/Bottombar";
import LeftSidebar from "@/components/shared/LeftSidebar";

const RootLayout = () => {
  return (
    <>
      <>
      <img 
          className="w-1/12 fixed flex m-auto "
            src="/assets/icons/beta.png" 
            alt="logo-text"
            width={150}
            height={40}
            />
      </>
    <div className="w-full md:flex">
      <Topbar />
      <LeftSidebar />

      <section className="flex flex-1 h-full">
        <Outlet />
      </section>

      <Bottombar />
    </div>
    </>
  );
};

export default RootLayout;
