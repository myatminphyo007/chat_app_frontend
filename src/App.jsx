import ProtectedRoute from "./components/ProtectedRoute";
import AfterSignup from "./pages/AfterSignup";
import Homepage from "./pages/Homepage";
import { Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/afterlogin" element={<ProtectedRoute><AfterSignup /></ProtectedRoute>}/>
      </Routes>
    </div>
  );
};

export default App;