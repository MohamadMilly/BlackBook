import { Navigate } from "react-router";
import { LandingFooter } from "../components/Landing/Footer";
import { LandingHeader } from "../components/Landing/Header";
import { LandingSections } from "../components/Landing/Sections";
import { NavBar } from "../components/Landing/NavBar";
import { useAuth } from "../contexts/authContext";

export function LandingPage() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to={"/me/feed"} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[12vw_1fr_12vw]">
      <div className="h-full md:col-start-2 md:col-end-3">
        <NavBar />
        <LandingHeader />
        <LandingSections />
        <LandingFooter />
      </div>
    </div>
  );
}
