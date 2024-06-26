import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useProveedoresContext } from "../../context/ProveedoresContext";
import { FormInput } from "../formularios/FormInput";
import { Button } from "../formularios/Button";
import client from "../../api/axios";
import io from "socket.io-client";
import FileDrop from "../FileDrop"; // Componente para cargar archivos
import { toast } from "react-toastify";
import axios from "axios";
import { formatearDinero } from "../../helpers/formatearDinero";

export const ModalNuevoComprobante = ({ id, proveedor, setProveedor }) => {
  const { register, handleSubmit, reset, watch } = useForm();
  const { setProveedores } = useProveedoresContext();

  const [socket, setSocket] = useState(null);

  const total = watch("total");

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_URL, {
      withCredentials: true,
    });

    setSocket(newSocket);

    newSocket.on("nuevo-comprobante", (nuevoComprobante) => {
      setProveedores(nuevoComprobante);
    });

    return () => newSocket.close();
  }, []);

  const [uploadedFile, setUploadedFile] = useState(null);
  const [dragging, setDragging] = useState(false);

  const uploadFile = async (file) => {
    if (!file) {
      return null;
    }

    const data = new FormData();
    data.append("file", file);

    // Set the upload preset based on the file type
    const uploadPreset = file.type.startsWith("image/")
      ? "imagenes"
      : "documentos";
    data.append("upload_preset", uploadPreset);

    try {
      const api = `https://api.cloudinary.com/v1_1/doguyttkd/${
        file.type.startsWith("image/") ? "image" : "raw"
      }/upload`;
      const res = await axios.post(api, data);
      const { secure_url } = res.data;
      return secure_url;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      return null;
    }
  };

  const onSubmit = async (formData) => {
    try {
      const archivo_imagen = await uploadFile(uploadedFile);

      // Creamos el objeto del producto con todos los datos y la URL de la imagen
      const proveedorData = {
        comprobante: {
          total: total,
          proveedor: proveedor.proveedor,
          localidad: proveedor.localidad_proveedor,
          provincia: proveedor.localidad_provincia,
          comprobante: archivo_imagen,
        },
        ...formData,
      };

      const res = await client.post(
        `/proveedores/${id}/comprobantes`,
        proveedorData
      );

      setProveedor(res.data.proveedorActualizado);

      console.log("ress", res.data);

      //   setProveedores(res?.data?.todosLosProveedores);
      if (socket) {
        socket.emit("nuevo-comprobante", res?.data?.todosLosProveedores);
      }

      toast.success("¡Comprobante creado correctamente!", {
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

      document.getElementById("my_modal_nuevo_comprobante").close();

      setUploadedFile(null);
      reset();
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setUploadedFile(file);
      setDragging(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
  };

  const [isEditable, setIsEditable] = useState(false);

  const handleInputClick = () => {
    setIsEditable(true);
  };

  return (
    <dialog id="my_modal_nuevo_comprobante" className="modal">
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
          <div onClick={handleInputClick}>
            {isEditable ? (
              <FormInput
                labelText={"Total del comprobante"}
                placeholder={"Escribe el total del comprobante ej: $130.0000"}
                props={{
                  ...register("total", { required: true }),
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
                  {formatearDinero(Number(total) || 0)}
                </p>
              </div>
            )}
          </div>

          <FileDrop
            dragging={dragging}
            handleDragLeave={handleDragLeave}
            handleDragOver={handleDragOver}
            handleDrop={handleDrop}
            handleFileChange={handleFileChange}
            handleRemoveFile={handleRemoveFile}
            setDragging={setDragging}
            setUploadedFile={setUploadedFile}
            uploadedFile={uploadedFile}
          />

          <div className="flex mt-3">
            <Button type={"submit"} titulo={"Guardar el comprobante"} />
          </div>
        </form>
      </div>
    </dialog>
  );
};
