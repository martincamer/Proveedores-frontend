import { Link } from "react-router-dom";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import { useProveedoresContext } from "../../../context/ProveedoresContext";
import { FaSearch } from "react-icons/fa";
import { ModalNuevoProveedor } from "../../../components/proveedor/ModalNuevoProveedor";
import { ModalEliminarProveedor } from "../../../components/proveedor/ModalEliminarProveedor";
import { useObtenerId } from "../../../helpers/useObtenerId";
import { ModalActualizarProveedor } from "../../../components/proveedor/ModalActualizarProveedor";
import { formatearDinero } from "../../../helpers/formatearDinero";
import { ModalDeudasProveedores } from "../../../components/proveedor/ModalDeudasProveedores";

export const Proveedores = () => {
  const { proveedores } = useProveedoresContext();

  const [searchTermCliente, setSearchTermCliente] = useState("");

  const handleSearchClienteChange = (e) => {
    setSearchTermCliente(e.target.value);
  };

  // UseObtenerId
  const { handleObtenerId, idObtenida } = useObtenerId();

  // Filtrar por término de búsqueda y usuario seleccionado
  let filteredData = proveedores.filter((proveedor) => {
    const matchesSearchTerm = proveedor.proveedor
      .toLowerCase()
      .includes(searchTermCliente.toLowerCase());

    return matchesSearchTerm;
  });

  const totalDeudaProveedores = proveedores.reduce(
    (total, orden) => total + parseFloat(orden.haber),
    0
  );

  console.log(proveedores);

  return (
    <section className="min-h-screen max-h-full w-full h-full max-w-full">
      <ToastContainer />

      <div className="bg-white mb-4 h-10 flex">
        <Link
          to={"/"}
          className="bg-blue-100 flex h-full px-4 justify-center items-center font-bold text-blue-600"
        >
          Inicio
        </Link>{" "}
        <Link
          to={"/proveedores"}
          className="bg-blue-500 flex h-full px-4 justify-center items-center font-bold text-white"
        >
          Proveedores
        </Link>
      </div>
      <div className="mx-5 my-10 bg-white py-6 px-6">
        <p className="font-bold text-blue-500 text-xl">
          Crea tus proveedores en esta sección y lleva el control de sus
          cuentas.
        </p>
      </div>

      <div className="bg-white py-5 px-5 mx-5">
        <button
          onClick={() =>
            document.getElementById("my_modal_nuevo_proveedor").showModal()
          }
          type="button"
          className="bg-blue-500 py-2 px-4 text-white font-semibold rounded hover:bg-orange-500 transition-all"
        >
          Crear nuevo proveedor
        </button>
      </div>

      <div className="flex gap-2 items-center w-1/4 max-md:w-full max-md:flex-col my-5 mx-5">
        <div className="bg-white py-2 px-3 text-sm font-bold w-full border border-blue-500 cursor-pointer flex items-center">
          <input
            value={searchTermCliente}
            onChange={handleSearchClienteChange}
            type="text"
            className="outline-none text-slate-600 w-full max-md:text-sm uppercase bg-white"
            placeholder="Buscar por nombre del proveedor"
          />
          <FaSearch className="text-blue-500" />
        </div>
      </div>

      <div className="mx-5">
        {" "}
        <button
          onClick={() => document.getElementById("my_modal_deudas").showModal()}
          className="bg-blue-500 py-1.5 px-5 text-white text-sm font-bold rounded hover:bg-rose-500"
        >
          Descargar resumen de los proveedores
        </button>
      </div>

      {/* tabla de datos  */}
      <div className="bg-white mx-5 my-5 mb-20">
        <table className="table text-xs">
          <thead>
            <tr>
              <th className="px-4 py-4  text-slate-800 font-bold uppercase">
                Referencia
              </th>{" "}
              <th className="px-4 py-4  text-slate-800 font-bold uppercase">
                Proveedor
              </th>{" "}
              <th className="px-4 py-4  text-slate-800 font-bold uppercase">
                Localidad-Provincia
              </th>{" "}
              <th className="px-4 py-4  text-slate-800 font-bold uppercase">
                Deuda
              </th>{" "}
              <th className="px-4 py-4  text-slate-800 font-bold uppercase">
                A favor
              </th>
              <th className="px-1 py-4  text-slate-800 font-bold uppercase">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 uppercase">
            {filteredData.map((s) => (
              <tr key={s.id}>
                <td className="px-4 py-3 font-medium text-gray-900 uppercase">
                  {s.id}
                </td>
                <td className="px-4 py-3 font-bold text-gray-900 uppercase">
                  {s.proveedor}
                </td>{" "}
                <td className="px-4 py-3 font-medium text-gray-900 uppercase">
                  {s.localidad_proveedor}, {s.provincia_proveedor}
                </td>
                <td className="px-4 py-3 font-bold text-gray-900 uppercase">
                  <div className="flex">
                    <p
                      className={`${
                        Number(s.haber) <= 0
                          ? "text-green-700 bg-green-50"
                          : "text-red-700 bg-red-50"
                      } py-2 px-3 rounded`}
                    >
                      {formatearDinero(Number(s.haber))}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-3 font-bold text-gray-900 uppercase">
                  {formatearDinero(Number(s.deber))}
                </td>
                <td className="px-1 py-3 font-medium text-gray-900 uppercase cursor-pointer">
                  <div className="dropdown dropdown-left">
                    <div
                      tabIndex={0}
                      role="button"
                      className="bg-blue-500 py-2 px-2 rounded-full text-white m-1"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
                        />
                      </svg>
                    </div>
                    <ul
                      tabIndex={0}
                      className="font-bold text-xs dropdown-content z-[1] menu p-2 shadow-md border-[1px] border-slate-200 bg-base-100 rounded-none w-72 gap-1"
                    >
                      <button
                        onClick={() => {
                          handleObtenerId(s.id),
                            document
                              .getElementById("my_modal_editar_proveedor")
                              .showModal();
                        }}
                        type="button"
                        className="bg-blue-500 py-2 px-4 text-white font-semibold rounded hover:bg-orange-500 transition-all"
                      >
                        Editar el proveedor
                      </button>
                      <Link
                        to={`/proveedor/${s.id}`}
                        className="bg-blue-500 py-2 px-4 text-white font-semibold rounded hover:bg-orange-500 transition-all capitalize text-center"
                      >
                        Cargar comprobantes,pagos,etc.
                      </Link>
                      <button
                        onClick={() => {
                          handleObtenerId(s.id),
                            document
                              .getElementById("my_modal_eliminar_proveedor")
                              .showModal();
                        }}
                        type="button"
                        className="bg-red-500 py-2 px-4 text-white font-semibold rounded hover:bg-red-700 transition-all"
                      >
                        Eliminar el proveedor
                      </button>
                    </ul>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ModalNuevoProveedor />
      <ModalEliminarProveedor
        idObtenida={idObtenida}
        message={"¿Estás seguro de eliminar el proveedor?"}
      />
      <ModalDeudasProveedores
        totalDeudaProveedores={totalDeudaProveedores}
        proveedores={proveedores}
      />
      <ModalActualizarProveedor idObtenida={idObtenida} />
    </section>
  );
};
