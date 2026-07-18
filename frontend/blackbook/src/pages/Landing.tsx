import { LandingFooter } from "../components/Landing/Footer";
import { LandingHeader } from "../components/Landing/Header";
import { LandingSections } from "../components/Landing/Sections";
import { NavBar } from "../components/shared/NavBar";

export function LandingPage() {
  return (
    <>
      <NavBar />
      <LandingHeader />
      <LandingSections />
      <LandingFooter />
    </>
  );
}
