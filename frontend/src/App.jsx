import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import UserProfile from "./pages/UserProfile";
import AuthFrontend from "./pages/Auth";
import PublicProfileView from "./pages/PublicProfileView";
import LandingPage from "./pages/LandingPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/auth" element={<AuthFrontend />} />
          <Route path="/public-profile" element={<PublicProfileView />} />
          <Route path="/land-page" element={<LandingPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App
