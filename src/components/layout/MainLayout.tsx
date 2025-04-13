
import { ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { User } from "@/types";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} user={user as User} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
