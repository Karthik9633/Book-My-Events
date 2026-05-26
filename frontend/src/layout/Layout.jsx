import { useLocation } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Layout = ({ children }) => {

  const location = useLocation();

  const hideLayout =
    location.pathname === "/login" ||
    location.pathname === "/signup";

  return (
    <>
      {!hideLayout && <Navbar />}

      <main
        className={
          !hideLayout
            ? "pt-24 min-h-screen"
            : "min-h-screen"
        }
      >
        {children}
      </main>

      {!hideLayout && <Footer />}
    </>
  );
};

export default Layout;