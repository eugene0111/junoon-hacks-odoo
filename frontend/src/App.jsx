import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import UserProfile from "./pages/UserProfile";
import AuthFrontend from "./pages/Auth";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/auth" element={<AuthFrontend />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App
