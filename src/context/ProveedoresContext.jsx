//imports
import { createContext, useContext, useEffect, useState } from "react";
import client from "../api/axios";

//context
export const ProveedoresContext = createContext();

//use context
export const useProveedoresContext = () => {
  const context = useContext(ProveedoresContext);
  if (!context) {
    throw new Error("Use ProveedoresProvider");
  }
  return context;
};

// ProveedoresProvider component
export const ProveedoresProvider = ({ children }) => {
  const [proveedores, setProveedores] = useState([]);
  const [proveedor, setProveedor] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const respuesta = await client.get("/proveedores");
        setProveedores(respuesta.data);
      } catch (error) {
        console.error("Error fetching proveedores data:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <ProveedoresContext.Provider
      value={{ proveedores, setProveedores, setProveedor, proveedor }}
    >
      {children}
    </ProveedoresContext.Provider>
  );
};
