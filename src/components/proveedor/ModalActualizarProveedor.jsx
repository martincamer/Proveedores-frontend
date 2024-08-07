import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useProveedoresContext } from "../../context/ProveedoresContext";
import { FormInput } from "../formularios/FormInput";
import { Button } from "../formularios/Button";
import client from "../../api/axios";
import io from "socket.io-client";
import { toast } from "react-toastify";
import { formatearDinero } from "../../helpers/formatearDinero";

export const ModalActualizarProveedor = ({ idObtenida }) => {
  const { register, handleSubmit, setValue, watch } = useForm();
  const { setProveedores } = useProveedoresContext();

  const [socket, setSocket] = useState(null);

  const haber = watch("haber");

  useEffect(() => {
    const obtenerProveedor = async () => {
      const res = await client.get(`/proveedores/${idObtenida}`);

      setValue("proveedor", res.data.proveedor);
      setValue("localidad_proveedor", res.data.localidad_proveedor);
      setValue("provincia_proveedor", res.data.provincia_proveedor);
      setValue("haber", res.data.haber);
    };

    obtenerProveedor();
  }, [idObtenida]);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_URL, {
      withCredentials: true,
    });

    setSocket(newSocket);

    newSocket.on("actualizar-proveedor", (crearProveedor) => {
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

      const res = await client.put(`/proveedores/${idObtenida}`, proveedorData);
      console.log(res.data);
      //   setProveedores(res?.data?.todosLosProveedores);
      if (socket) {
        socket.emit("actualizar-proveedor", res?.data?.allProveedores);
      }

      toast.success("¡Proveedor actualizado correctamente!", {
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

      document.getElementById("my_modal_editar_proveedor").close();
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  const [isEditable, setIsEditable] = useState(false);

  const handleInputClick = () => {
    setIsEditable(true);
  };

  return (
    <dialog id="my_modal_editar_proveedor" className="modal">
      <div className="modal-box max-w-2xl rounded-none py-10">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-xl text-blue-500">
          Actualizar proveedor
        </h3>
        <p className="py-2">En esta sección podras actualizar el proveedor.</p>
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
          />
          <div onClick={handleInputClick}>
            {isEditable ? (
              <FormInput
                labelText={"Total"}
                placeholder={"$12.355.00"}
                props={{
                  ...register("haber", { required: true }),
                  onBlur: () => setIsEditable(false),
                }}
                type={"text"}
              />
            ) : (
              <div className="flex flex-col gap-1 w-full">
                <label className="font-semibold text-gray-700">
                  Total del comprobante
                </label>
                <p className="border capitalize border-[#E2E8F0] bg-[#F7FAFC] py-[0.90rem] px-[0.75rem] focus:border-blue-500 rounded-none outline-none outline-[1px] text-sm font-semibold">
                  {formatearDinero(Number(haber) || 0)}
                </p>
              </div>
            )}
          </div>
          <div className="flex mt-3">
            <Button type={"submit"} titulo={"Actualizar el proveedor"} />
          </div>
        </form>
      </div>
    </dialog>
  );
};
