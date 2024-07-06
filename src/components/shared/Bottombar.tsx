import { Link, useLocation } from "react-router-dom";
import { bottombarLinks } from "@/constants";

const Bottombar = () => {
  const { pathname } = useLocation();

  const hideBottomBar = pathname.startsWith("/update-profile") || window.innerWidth >= 768; 
  const hideBottomBar1 = pathname.startsWith("/create-post") || window.innerWidth >= 768; 

  if (hideBottomBar || hideBottomBar1) {
    return null; 
  }

  return (
    <section className="bottom-bar !fixed bottom-0">
      {bottombarLinks.map((link) => {
        const isActive = pathname === link.route;
        return (
          <Link
            key={`bottombar-${link.label}`}
            to={link.route}
            className={`${
              isActive && "rounded-[10px] bg-primary-500 "
            } flex-center flex-col gap-1 p-2 transition`}
          >
            <img
              src={link.imgURL}
              alt={link.label}
              width={16}
              height={16}
              className={`${isActive && "invert-white"}`}
            />
            <p className="tiny-medium text-light-2">{link.label}</p>
          </Link>
        );
      })}
    </section>
  );
};

export default Bottombar;
