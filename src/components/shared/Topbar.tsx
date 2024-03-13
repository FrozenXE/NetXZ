import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "../ui/button";
import { useUserContext } from "@/context/AuthContext";
import { useSignOutAccount } from "@/lib/react-query/queries";

const Topbar = () => {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const { mutate: signOut, isSuccess } = useSignOutAccount();

  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [isSuccess]);

  return (
    <section className="topbar">
       <img 
          className="w-1/12 fixed flex m-auto max-md:w-1/5 max-sm:w-1/4"
            src="/assets/icons/beta.png" 
            alt="logo-text"
            width={150}
            height={40}
            />
      <div className="flex items-center justify-between py-4 px-5">
        <div className="w-1/3">

        </div>
          <Link to="/" className="flex gap-3 justify-center items-center w-1/3">
            <img 
              src="/assets/icons/Logo-text.svg" 
              alt="logo-text"
              width={95}
              height={40}
              />
          </Link>
        <div className="flex gap-0 w-1/3 justify-end">
          <Button
            variant="ghost"
            className="shad-button_ghost"
            onClick={() => signOut()}>
            <img src="/assets/icons/logout.svg" alt="logout" />
          </Button>
          <Link to={`/profile/${user.id}`} className="flex-center gap-3">
            <img
              src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
              alt="profile"
              className="h-8 w-8 rounded-full"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Topbar;
