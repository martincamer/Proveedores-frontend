import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useProveedoresContext } from "../../context/ProveedoresContext";
import { FormInput } from "../formularios/FormInput";
import { Button } from "../formularios/Button";
import client from "../../api/axios";
import io from "socket.io-client";
import { toast } from "react-toastify";

export const ModalNuevoProveedor = () => {
  const { register, handleSubmit, reset } = useForm();
  const { setProveedores } = useProveedoresContext();

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_URL, {
      withCredentials: true,
    });

    setSocket(newSocket);

    newSocket.on("nuevo-proveedor", (crearProveedor) => {
      setProveedores(crearProveedor);
    });

    return () => newSocket.close();
  }, []);

  const onSubmit = async (formData) => {
    try {
      // Creamos el objeto del producto con todos los datos y la URL de la imagen
      const proveedorData = {
        ...formData,
      };

      const res = await client.post("/proveedores", proveedorData);

      //   setProveedores(res?.data?.todosLosProveedores);
      if (socket) {
        socket.emit("nuevo-proveedor", res?.data?.todosLosProveedores);
      }

      toast.success("¡Proveedor creador correctamente!", {
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

      document.getElementById("my_modal_nuevo_proveedor").close();

      reset();
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  return (
    <dialog id="my_modal_nuevo_proveedor" className="modal">
      <div className="modal-box max-w-2xl rounded-none py-10">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-xl text-blue-500">
          Crea un nuevo proveedor
        </h3>
        <p className="py-2">En esta sección podras crear nuevos proveedores.</p>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <FormInput
            labelText={"Proveedor"}
            placeholder={
              "Escribe el nombre de la empresa/proveeodr del proveedor"
            }
            props={{ ...register("proveedor", { required: true }) }}
            type={"text"}
          />
          <FormInput
            labelText={"Localidad"}
            placeholder={"Escribe la localidad"}
            props={{ ...register("localidad_proveedor", { required: true }) }}
            type={"text"}
          />
          <FormInput
            labelText={"Provincia"}
            placeholder={"Escribe la provincia"}
            props={{ ...register("provincia_proveedor", { required: true }) }}
            type={"text"}
          />{" "}
          <div className="flex mt-3">
            <Button type={"submit"} titulo={"Guardar el proveedor"} />
          </div>
        </form>
      </div>
    </dialog>
  );
};
