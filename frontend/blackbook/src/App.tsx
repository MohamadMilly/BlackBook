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
    <div className="grid grid-cols-[150px_1fr] grid-rows-[50px_1fr] h-full">
      <SideBar />
      <Header />
      <Outlet />
    </div>
  );
}

export default App;
