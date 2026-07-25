import { Navigate, Outlet } from "react-router";
import { SideBar } from "./components/app/layout/SideBar";
import { Header } from "./components/app/layout/Header";
import { useAuth } from "./contexts/authContext";

function App() {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to={"/"} replace />;
  }
  return (
    <div className="grid grid-cols-1 grid-rows-[50px_1fr_60px] md:grid-cols-[150px_1fr] md:grid-rows-[50px_1fr] h-full">
      <SideBar />
      <Header />
      <Outlet />
    </div>
  );
}

export default App;
