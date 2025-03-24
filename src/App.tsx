import "./App.css";
import Home from "./pages/home";
import Porfile from "./pages/profile";

import { BrowserRouter as Router, Routes , Route } from "react-router-dom";

import { Toaster } from "./components/ui/sonner.tsx";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/"element={<Home />} />
          <Route path="/profile" element={<Porfile />} />
        </Routes>
      </Router>
      <Toaster position="top-right" richColors  />
    </>
  );
}

export default App;
