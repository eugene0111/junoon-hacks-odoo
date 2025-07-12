import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import UserProfile from "./pages/UserProfile";
import HomeScreen from "./pages/HomeScreen";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/home-screen" element={<HomeScreen />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App
