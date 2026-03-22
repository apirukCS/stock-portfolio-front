import { Outlet } from "react-router-dom";
import bgStock from "../assets/images/bg-stock.png";

export default function AuthLayout() {
  return (
    <div
      className="full-screen relative flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bgStock})` }}
    >
      <div className="absolute inset-0 backdrop-blur-sm bg-black/50"></div>

      <div className="relative z-10">
        <Outlet />
      </div>
    </div>
  );
}
