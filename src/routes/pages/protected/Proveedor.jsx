import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useProveedoresContext } from "../../../context/ProveedoresContext";
import { FaClipboard } from "react-icons/fa";
import { formatearDinero } from "../../../helpers/formatearDinero";
import { ModalNuevoComprobante } from "../../../components/proveedor/ModalNuevoComprobante";
import { formatearFecha } from "../../../helpers/formatearFecha";
import client from "../../../api/axios";

export const Proveedor = () => {
  const { proveedor, setProveedor, setProveedores } = useProveedoresContext();
  const params = useParams();

  // Obtener el primer día del mes actual
  const today = new Date();

  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  // Convertir las fechas en formato YYYY-MM-DD para los inputs tipo date
  const fechaInicioPorDefecto = firstDayOfMonth.toISOString().split("T")[0];
  const fechaFinPorDefecto = lastDayOfMonth.toISOString().split("T")[0];

  // Estado inicial de las fechas con el rango del mes actual
  const [fechaInicio, setFechaInicio] = useState(fechaInicioPorDefecto);
  const [fechaFin, setFechaFin] = useState(fechaFinPorDefecto);

  const handleFechaInicioChange = (e) => {
    setFechaInicio(e.target.value);
  };

  const handleFechaFinChange = (e) => {
    setFechaFin(e.target.value);
  };

  useEffect(() => {
    const obtenerProveedor = async () => {
      const res = await client.get(`/proveedores/${params.id}`);
      setProveedor(res.data);
    };

    obtenerProveedor();
  }, [params.id]);

  console.log(proveedor);

  let comprobantes = proveedor.comprobantes
    ? JSON.parse(proveedor.comprobantes)
    : [];

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

  const handleEliminar = async (idComprobante) => {
    const res = await client.delete(
      `/proveedores/${params.id}/comprobantes/${idComprobante}`
    );

    setProveedores(res.data.todosLosProveedores);
    setProveedor(res.data.proveedorActualizado);

    toast.error("¡Comprobante eliminado correctamente!", {
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
  };

  const totalSumado = comprobantes.reduce((accumulator, current) => {
    // Convertir el total de string a número y sumarlo al acumulador
    return accumulator + parseFloat(current.total);
  }, 0); // El segundo argumento de reduce es el valor inicial del acumulador, en este caso 0

  // Filtrar por rango de fechas
  if (fechaInicio && fechaFin) {
    const fechaInicioObj = new Date(fechaInicio);
    const fechaFinObj = new Date(fechaFin);
    comprobantes = comprobantes.filter((item) => {
      const fechaOrden = new Date(item.fecha);
      return fechaOrden >= fechaInicioObj && fechaOrden <= fechaFinObj;
    });
  }

  // Ordenar por fecha de mayor a menor
  const filtrarData = comprobantes.sort((a, b) => {
    const fechaA = new Date(a.fecha);
    const fechaB = new Date(b.fecha);
    return fechaB - fechaA; // Ordena de mayor a menor (fecha más reciente primero)
  });

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
        <Link className="bg-blue-500 flex h-full px-4 justify-center items-center font-bold text-white">
          Proveedor {params.id}
        </Link>
      </div>
      <div className="mx-5 my-10 bg-white py-6 px-6">
        <p className="font-bold text-blue-500 text-xl">
          Observa el proveedor{" "}
          <span className="text-orange-500 underline">
            {proveedor.proveedor}
          </span>
          , carga comprobantes, saldos a favor, etc.
        </p>
      </div>

      <div className="bg-white py-5 px-5 my-5 mx-5 flex gap-3">
        <div className="bg-blue-50 py-5 px-8">
          <p className="text-blue-500 font-extrabold text-xl">
            Saldo a favor/proveedor
          </p>
          <p className="text-orange-500 text-xl font-bold">
            {formatearDinero(Number(proveedor.deber))}
          </p>
        </div>
        <div className="bg-blue-50 py-5 px-8">
          <p className="text-blue-500 font-extrabold text-xl">Debemos</p>
          <p className="text-red-500 text-xl font-bold">
            {formatearDinero(Number(proveedor.haber))}
          </p>
        </div>
        <div className="bg-blue-50 py-5 px-8">
          <p className="text-blue-500 font-extrabold text-xl">
            Cargado en comprobantes
          </p>
          <p className="text-green-500 text-xl font-bold text-center">
            {formatearDinero(totalSumado)}
          </p>
        </div>
      </div>

      <div className="bg-white py-5 px-5 mx-5 flex gap-2">
        <button
          onClick={() =>
            document.getElementById("my_modal_nuevo_comprobante").showModal()
          }
          type="button"
          className="bg-blue-500 py-2 px-4 text-white font-semibold text-sm rounded hover:bg-orange-500 transition-all"
        >
          Cargar nuevo comprobante/etc.
        </button>{" "}
        <button
          onClick={() =>
            document.getElementById("my_modal_nuevo_saldo").showModal()
          }
          type="button"
          className="bg-rose-500 py-2 px-4 text-white font-semibold text-sm rounded hover:bg-blue-500 transition-all"
        >
          Cargar nuevo saldo a favor del proveedor
        </button>
      </div>

      <div>
        <div className="bg-white mx-5 mt-5 px-5 py-3 flex gap-8">
          <p className="font-bold text-blue-500 flex gap-2 items-center">
            Comprobantes cargados al proveedor{" "}
            <FaClipboard className="text-2xl" />
          </p>
          <div className="flex gap-2 items-center font-bold text-blue-500">
            <div className="bg-white py-2 px-3 text-sm font-bold w-full border border-blue-500 cursor-pointer flex items-center">
              <input
                value={fechaInicio}
                onChange={handleFechaInicioChange}
                type="date"
                className="outline-none text-slate-600 w-full max-md:text-sm uppercase bg-white"
                placeholder="Fecha de inicio"
              />
            </div>

            <div className="bg-white py-2 px-3 text-sm font-bold w-full border border-blue-500 cursor-pointer flex items-center">
              <input
                value={fechaFin}
                onChange={handleFechaFinChange}
                type="date"
                className="outline-none text-slate-600 w-full max-md:text-sm uppercase bg-white"
                placeholder="Fecha fin"
              />
            </div>
          </div>
        </div>

        <div className="bg-white mx-5 my-2 mb-20">
          <table className="table text-xs">
            <thead>
              <tr>
                <th className="px-4 py-4  text-slate-800 font-bold uppercase">
                  Referencia
                </th>{" "}
                <th className="px-4 py-4  text-slate-800 font-bold uppercase">
                  Fecha de carga
                </th>{" "}
                <th className="px-4 py-4  text-slate-800 font-bold uppercase">
                  Proveedor
                </th>{" "}
                <th className="px-4 py-4  text-slate-800 font-bold uppercase">
                  Total
                </th>{" "}
                <th className="px-1 py-4  text-slate-800 font-bold uppercase">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 uppercase">
              {filtrarData.map((s) => (
                <tr key={s.id}>
                  <td className="px-4 py-3 font-medium text-gray-900 uppercase">
                    {s.id}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900 uppercase">
                    {formatearFecha(s.fecha)}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900 uppercase">
                    {s.proveedor}
                  </td>
                  <td className="px-4 py-3 text-blue-600 font-bold uppercase">
                    {formatearDinero(Number(s.total))}
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
                      <ul className="font-bold text-xs dropdown-content z-[1] menu p-2 shadow-md border-[1px] border-slate-200 bg-base-100 rounded-none w-72 gap-1">
                        <button
                          type="button"
                          onClick={() => handleViewImage(s.comprobante)} // Abre el modal con la imagen
                          className="bg-blue-500 py-2 px-4 text-white font-semibold rounded hover:bg-orange-500 transition-all"
                        >
                          Ver comprobante
                        </button>{" "}
                        <button
                          // onClick={() => {
                          //   handleObtenerId(s.id);
                          //   document
                          //     .getElementById("my_modal_eliminar_proveedor")
                          //     .showModal();
                          // }}
                          type="button"
                          onClick={() => handleEliminar(s.id)}
                          className="bg-red-500 py-2 px-4 text-white font-semibold rounded hover:bg-red-700 transition-all"
                        >
                          Eliminar el comprobante
                        </button>
                      </ul>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ModalNuevoComprobante
        setProveedor={setProveedor}
        proveedor={proveedor}
        id={params.id}
      />
      <ImageModal
        isVisible={isModalVisible}
        onClose={handleCloseModal} // Cierra el modal
        imageUrl={selectedImage} // URL de la imagen seleccionada
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
