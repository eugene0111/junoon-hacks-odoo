import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import UserProfile from "./pages/UserProfile";
import AuthFrontend from "./pages/Auth";
import PublicProfileView from "./pages/PublicProfileView";
import LandingPage from "./pages/LandingPage";
import HomeScreen from "./pages/HomeScreen";
import AdminDashboardPage from "./pages/AdminDashboardPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthFrontend />} />
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/public-profile" element={<PublicProfileView />} />
          <Route path="/home-screen" element={<HomeScreen />} />
          <Route path="/admin-dashboard" element={<AdminDashboardPage />} />

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App
