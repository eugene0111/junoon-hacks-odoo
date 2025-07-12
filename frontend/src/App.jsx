import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import UserProfile from "./pages/UserProfile";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/user-profile" element={<UserProfile />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App
