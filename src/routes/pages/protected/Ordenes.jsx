import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { FaSearch } from "react-icons/fa";
import { useObtenerId } from "../../../helpers/useObtenerId";
import { formatearDinero } from "../../../helpers/formatearDinero";
import { ModalNuevaOrden } from "../../../components/ordenes/ModalNuevaOrden";
import { useProveedoresContext } from "../../../context/ProveedoresContext";
import { useState } from "react";
import { ModalEliminarOrden } from "../../../components/ordenes/ModalEliminarOrden";
import { formatearFecha } from "../../../helpers/formatearFecha";

export const Ordenes = () => {
  const { ordenes } = useProveedoresContext();

  const [searchTermCliente, setSearchTermCliente] = useState("");

  const handleSearchClienteChange = (e) => {
    setSearchTermCliente(e.target.value);
  };

  // UseObtenerId
  const { handleObtenerId, idObtenida } = useObtenerId();

  // Filtrar por término de búsqueda y usuario seleccionado
  let filteredData = ordenes.filter((orden) => {
    const matchesSearchTerm = orden.proveedor
      .toLowerCase()
      .includes(searchTermCliente.toLowerCase());

    return matchesSearchTerm;
  });

  const [isModalVisible, setModalVisible] = useState(false); // Estado para la visibilidad del modal
  const [selectedImage, setSelectedImage] = useState(null); // Estado para la imagen seleccionada

  // Abre el modal y establece la imagen seleccionada
  const handleViewImage = (imageUrl) => {
    setSelectedImage(imageUrl);
    setModalVisible(true);
  };

  // Cierra el modal
  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

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
          to={"/ordenes"}
          className="bg-blue-500 flex h-full px-4 justify-center items-center font-bold text-white"
        >
          Ordenes
        </Link>
      </div>
      <div className="mx-5 my-10 bg-white py-6 px-6">
        <p className="font-bold text-blue-500 text-xl">
          Crea tus ordenes, remitos, facturas, lleva el control, etc.
        </p>
      </div>

      <div className="bg-white py-5 px-5 mx-5">
        <button
          onClick={() =>
            document.getElementById("my_modal_nueva_orden").showModal()
          }
          type="button"
          className="bg-blue-500 py-2 px-4 text-white font-semibold rounded hover:bg-orange-500 transition-all"
        >
          Crear una nueva orden
        </button>
      </div>

      <div className="flex gap-2 items-center w-1/5 max-md:w-full max-md:flex-col my-5 mx-5">
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

      {/* tabla de datos  */}
      <div className="bg-white mx-5 my-5 mb-20">
        <table className="table text-xs">
          <thead>
            <tr>
              <th className="px-4 py-4  text-slate-800 font-bold uppercase">
                Referencia
              </th>
              <th className="px-4 py-4  text-slate-800 font-bold uppercase">
                Proveedor
              </th>{" "}
              <th className="px-4 py-4  text-slate-800 font-bold uppercase">
                Fecha de creación
              </th>{" "}
              <th className="px-4 py-4  text-slate-800 font-bold uppercase">
                Total
              </th>
              <th className="px-1 py-4  text-slate-800 font-bold uppercase">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 uppercase">
            {ordenes.map((s) => (
              <tr key={s.id}>
                <td className="px-4 py-3 font-medium text-gray-900 uppercase">
                  {s.id}
                </td>
                <td className="px-4 py-3 font-medium text-gray-900 uppercase">
                  {s.proveedor}
                </td>
                <td className="px-4 py-3 font-medium text-gray-900 uppercase">
                  {formatearFecha(s.created_at)}
                </td>
                <td className="px-4 py-3 font-medium text-gray-900 uppercase">
                  <div className="flex">
                    <p className="font-bold text-blue-500 bg-blue-50 py-1 px-3 rounded">
                      {formatearDinero(Number(s.total))}
                    </p>
                  </div>
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
                              .getElementById("my_modal_editar_orden")
                              .showModal();
                        }}
                        type="button"
                        className="bg-blue-500 py-2 px-4 text-white font-semibold rounded hover:bg-orange-500 transition-all"
                      >
                        Editar la orden
                      </button>
                      <button
                        onClick={() => handleViewImage(s.comprobante)} // Abre el modal con la imagen
                        type="button"
                        className="bg-green-500 py-2 px-4 text-white font-semibold rounded hover:bg-green-600 transition-all"
                      >
                        Ver comprobante
                      </button>
                      <button
                        onClick={() => {
                          handleObtenerId(s.id),
                            document
                              .getElementById("my_modal_eliminar_orden")
                              .showModal();
                        }}
                        type="button"
                        className="bg-red-500 py-2 px-4 text-white font-semibold rounded hover:bg-red-800 transition-all"
                      >
                        Eliminar la orden
                      </button>
                    </ul>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ImageModal
        isVisible={isModalVisible}
        onClose={handleCloseModal} // Cierra el modal
        imageUrl={selectedImage} // URL de la imagen seleccionada
      />
      <ModalNuevaOrden />
      <ModalEliminarOrden
        idObtenida={idObtenida}
        message={"¿Estas seguro de eliminar la orden?"}
      />
    </section>
  );
};

const ImageModal = ({ isVisible, onClose, imageUrl }) => {
  if (!isVisible) return null; // Si el modal no está visible, no renderizar nada

  const handleClickOutside = (event) => {
    // Cierra el modal si haces clic fuera del contenido
    onClose();
  };

  const handleContentClick = (event) => {
    // Evitar la propagación del clic para no cerrar el modal cuando haces clic en el contenido
    event.stopPropagation();
  };

  return (
    <div
      onClick={handleClickOutside} // Cierra el modal al hacer clic fuera
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div onClick={handleContentClick} className="relative p-5">
        {imageUrl && imageUrl.toLowerCase().endsWith(".pdf") ? (
          // Si la URL termina en ".pdf", mostrar el archivo PDF en un iframe
          <iframe
            src={imageUrl}
            title="Archivo PDF"
            className="w-[1220px] h-screen"
          />
        ) : (
          // Si no, mostrar la imagen
          <img src={imageUrl} alt="Comprobante" className="w-full h-auto" />
        )}
      </div>
    </div>
  );
};
