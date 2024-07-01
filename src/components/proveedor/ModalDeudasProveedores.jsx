import React from "react";
import { PDFViewer } from "@react-pdf/renderer";
import { ResumenProveedores } from "../pdf/ResumenProveedores";

export const ModalDeudasProveedores = ({
  totalDeudaProveedores,
  proveedores,
}) => {
  return (
    <dialog id="my_modal_deudas" className="modal">
      <div className="modal-box max-w-6xl">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">
          Descargar resumen de los proveedores
        </h3>
        <p className="py-2 text-blue-500 font-medium">
          En esta sección podras descargar el resumen de los proveedores.
        </p>

        <PDFViewer className="w-full h-screen mt-10">
          <ResumenProveedores
            totalDeudaProveedores={totalDeudaProveedores}
            proveedores={proveedores}
          />
        </PDFViewer>
      </div>
    </dialog>
  );
};
