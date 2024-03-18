import { Outlet, Navigate } from "react-router-dom";

import { useUserContext } from "@/context/AuthContext";

export default function AuthLayout() {
  const { isAuthenticated } = useUserContext();

  return (
    <>
      <>
      <img 
          className="w-1/12 fixed start-0 flex m-auto max-md:w-1/5 max-sm:w-1/4"
            src="/assets/icons/beta.png" 
            alt="logo-text"
            width={150}
            height={40}
            />
      </>
      {isAuthenticated ? (
        <Navigate to="/" />
      ) : (
        <>
          <section className="flex flex-1 justify-center items-center flex-col py-10 bg-back ">
            <Outlet />
          </section>

          <img
            src="/assets/images/bg.jpg"
            alt="logo"
            className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat"
          />
        </>
      )}
    </>
  );
}
