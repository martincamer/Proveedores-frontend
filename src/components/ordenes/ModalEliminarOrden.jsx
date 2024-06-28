import React, { useEffect, useState } from "react";
import { IoIosAlert } from "react-icons/io";
import { useProveedoresContext } from "../../context/ProveedoresContext";
import { toast } from "react-toastify";
import client from "../../api/axios";
import io from "socket.io-client";

export const ModalEliminarOrden = ({ message, idObtenida }) => {
  const [socket, setSocket] = useState(null);
  const { setProveedores, setOrdenes } = useProveedoresContext();

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_URL, {
      withCredentials: true,
    });

    setSocket(newSocket);

    newSocket.on("eliminar-orden", (eliminarOrden) => {
      setOrdenes(eliminarOrden);
    });

    return () => newSocket.close();
  }, []);

  console.log(idObtenida);

  const handleEliminarProveedor = async (id) => {
    try {
      const res = await client.delete(`/ordenes/${id}`);

      if (socket) {
        socket.emit("eliminar-orden", res.data.todasLasOrdenes);
      }

      setProveedores(res.data.proveedoresActualizados);

      toast.error("¡Orden eliminado!", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        style: {
          padding: "12px",
        },
      });

      document.getElementById("my_modal_eliminar_orden").close();
    } catch (error) {
      console.error("Error al eliminar la salida:", error);
    }
  };
  return (
    <dialog id="my_modal_eliminar_orden" className="modal">
      <div className="modal-box rounded-none">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <div className="flex justify-center flex-col gap-2 items-center">
          <IoIosAlert className="text-yellow-400 text-9xl py-1" />

          <p className="text-3xl text-yellow-500">¡Espera! ✋</p>

          <p className="font-light text-sm mt-2">{message}</p>

          <div className="mt-3 flex items-center justify-between gap-5">
            <button
              className="text-sm font-bold text-gray-400 hover:bg-gray-300 py-2 px-4 rounded-full hover:text-gray-600"
              type="button"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                handleEliminarProveedor(idObtenida);
              }}
              className="text-base font-bold text-white bg-orange-500 hover:bg-orange-600 py-2 px-6 rounded-full hover:text-white"
              type="button"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
};
