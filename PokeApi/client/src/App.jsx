import { useEffect } from "react";
import Home from "./Home";
import NavBar from "./NavBar";
import Pokedex from "./PokeDex";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./LoginPage";
import Register from "./Register";
import useAuthStore from "./store/authStore";
import ProtectedRoute from "./components/ProtectedRoute";
import PokemonDetail from "./PokemonDetail";
import Profile from "./Profile";
import Explore from "./Explore";
import Battle from "./components/Battle";
import Shop from "./Shop";

// inside Routes:

const App = () => {
  const { setUser } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:8000/me", {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        }
      } catch (e) {}
    };
    checkAuth();
  }, []);

  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/shop"
          element={
            <ProtectedRoute>
              <Shop />
            </ProtectedRoute>
          }
        />
        <Route
          path="/explore"
          element={
            <ProtectedRoute>
              <Explore />
            </ProtectedRoute>
          }
        />
        <Route
          path="/battle"
          element={
            <ProtectedRoute>
              <Battle />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Home />} />
        <Route path="/pokedex" element={<Pokedex />} />
        <Route path="/pokedex/:id" element={<PokemonDetail />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
