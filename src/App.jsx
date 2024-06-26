import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthProvider";
import { Login } from "./routes/pages/Login";
import { Register } from "./routes/pages/Register";
import { Home } from "./routes/pages/protected/Home";
import { SideBar } from "./components/sidebar/Sidebar";
import { Proveedores } from "./routes/pages/protected/Proveedores";
import { ProveedoresProvider } from "./context/ProveedoresContext";
import { useEffect, useState } from "react";
import RutaProtegida from "./layouts/RutaProtejida";
import "react-toastify/dist/ReactToastify.css";
import "react-toastify/dist/ReactToastify.min.css";
import { Proveedor } from "./routes/pages/protected/Proveedor";
// import { NotFound } from "./routes/pages/protected/NotFound";

function App() {
  const { isAuth } = useAuth();

  const [isLoading, setIsLoading] = useState(true); // Estado de carga

  // Simula un tiempo de carga de 5 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); // Desactiva la pantalla de carga después de 5 segundos
    }, 3000);

    return () => clearTimeout(timer); // Limpia el temporizador cuando se desmonta
  }, []);

  if (isLoading) {
    // Muestra la pantalla de carga mientras se está cargando
    return <LoadingScreen />;
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            element={<RutaProtegida isAllowed={!isAuth} redirectTo={"/"} />}
          >
            <Route index path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          <Route
            element={<RutaProtegida isAllowed={isAuth} redirectTo={"/login"} />}
          >
            <Route
              element={
                <ProveedoresProvider>
                  <main className="min-h-full max-h-full h-full flex">
                    <SideBar />
                    <Outlet />
                  </main>
                </ProveedoresProvider>
              }
            >
              <Route index path="/" element={<Home />} />

              <Route path="/proveedores" element={<Proveedores />} />
              <Route path="/proveedor/:id" element={<Proveedor />} />
            </Route>
          </Route>
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

const LoadingScreen = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-200">
      <div className="flex flex-col items-center">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-t-orange-500 border-b-transparent"></div>
        <p className="mt-4 text-lg font-bold text-gray-700">Cargando...</p>
      </div>
    </div>
  );
};
