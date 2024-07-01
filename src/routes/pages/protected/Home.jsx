import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useProveedoresContext } from "../../../context/ProveedoresContext";
import { formatearDinero } from "../../../helpers/formatearDinero";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ResumenPdf } from "../../../components/pdf/ResumenPdf";
import ApexChart from "../../../components/charts/ApexChart";
import ApexChartComprobantes from "../../../components/charts/ApexChartComprobantes";
import ApexChartColumnProveedores from "../../../components/charts/ApexChartColumnProveedores";

export const Home = () => {
  const { proveedores, ordenes } = useProveedoresContext();

  const handleFechaInicioChange = (e) => {
    setFechaInicio(e.target.value);
  };

  const handleFechaFinChange = (e) => {
    setFechaFin(e.target.value);
  };

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

  // Filtro por rango de fechas (si están definidas)
  const fechaInicioObj = new Date(fechaInicio);
  const fechaFinObj = new Date(fechaFin);
  // Filtro por término de búsqueda y usuario seleccionado

  let filtrarDataOrdenes = ordenes.filter((item) => {
    const fechaOrden = new Date(item.created_at);
    return fechaOrden >= fechaInicioObj && fechaOrden <= fechaFinObj;
  });

  // Filtrar 'comprobantes' basado en las fechas
  let filterDataComprobantes = proveedores.reduce((accum, proveedor) => {
    const comprobantes = JSON.parse(proveedor.comprobantes);
    const filteredComprobantes = comprobantes.filter((comprobante) => {
      const fechaOrden = new Date(comprobante.fecha);
      return fechaOrden >= fechaInicioObj && fechaOrden <= fechaFinObj;
    });
    return accum.concat(filteredComprobantes);
  }, []);

  // Estado para almacenar la fecha actual
  const [fechaActual, setFechaActual] = useState("");

  // Función para obtener y formatear la fecha actual
  const obtenerFechaActual = () => {
    const fecha = new Date();
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    const fechaFormateada = fecha.toLocaleDateString("es-AR", options);
    setFechaActual(fechaFormateada);
  };

  // Efecto para obtener la fecha actual al montar el componente
  useEffect(() => {
    obtenerFechaActual();
  }, []); // Se ejecuta solo una vez al montar el componente

  console.log(filtrarDataOrdenes);

  const totalEnOrdenes = filtrarDataOrdenes.reduce(
    (total, orden) => total + parseFloat(orden.total),
    0
  );

  const totalDeudaProveedores = proveedores.reduce(
    (total, orden) => total + parseFloat(orden.haber),
    0
  );

  // Calcular el total reducido de 'total' en 'comprobantes'
  const totalCargadoEnComprobantes = filterDataComprobantes.reduce(
    (total, comprobante) => {
      return total + parseFloat(comprobante.total);
    },
    0
  );

  console.log(proveedores);

  console.log(filterDataComprobantes);

  return (
    <section className="w-full h-full min-h-screen max-h-full max-w-full">
      <div className="bg-white mb-4 h-10 flex">
        <Link
          to={"/"}
          className="bg-blue-500 flex h-full px-4 justify-center items-center font-bold text-white max-md:text-sm"
        >
          Inicio/estadisticas
        </Link>{" "}
      </div>
      <div className="mx-5 my-10 bg-white py-6 px-6 max-md:py-3 max-md:px-4 flex justify-between items-center">
        <p className="font-bold text-blue-500 text-xl max-md:text-base">
          Observa las estadisticas, filtra por mes, anualmente resultados, etc.
        </p>
        <p className="font-bold">Fecha actual {fechaActual}</p>
      </div>
      <div className="flex gap-2 items-center w-1/2 gap-5 max-md:w-auto max-md:flex-col my-5 mx-5">
        <div>
          <p className="font-bold text-blue-500 border-b-2 border-blue-500">
            Filtrar por fecha
          </p>
        </div>
        <div className="flex gap-2">
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

      <div className="mx-5 my-5 bg-white py-5 px-5 grid grid-cols-5 gap-5">
        <div className="border border-blue-500 py-5 px-5">
          <p className="text-blue-500 font-semibold">
            Deuda filtrada en ordenes
          </p>
          <p className="font-bold text-red-500 text-xl">
            - {formatearDinero(totalEnOrdenes)}
          </p>
        </div>
        <div className="border border-blue-500 py-5 px-5">
          <p className="text-orange-500 font-semibold">
            Total en comprobantes filtrados
          </p>
          <p className="font-bold text-blue-500 text-xl">
            + {formatearDinero(totalCargadoEnComprobantes)}
          </p>
        </div>
        <div className="border border-blue-500 py-5 px-5">
          <p className="text-blue-500 font-semibold">
            Deuda con los proveedores
          </p>
          <p className="font-bold text-red-500 text-xl">
            - {formatearDinero(totalDeudaProveedores)}
          </p>
        </div>
        <div>
          <PDFDownloadLink
            fileName="Resumen"
            className="font-semibold text-sm bg-green-500 py-1.5 px-2 text-white rounded"
            document={
              <ResumenPdf
                fechaInicio={fechaInicio}
                fechaFin={fechaFin}
                totalDeudas={totalDeudaProveedores}
                totalComprobantes={totalCargadoEnComprobantes}
                totalOrdenes={totalEnOrdenes}
              />
            }
          >
            Descargar resumen
          </PDFDownloadLink>
        </div>
      </div>

      <div className="bg-white px-5 py-5 mx-5 my-10 grid grid-cols-2 gap-5">
        <ApexChart total={totalEnOrdenes} ordenes={filtrarDataOrdenes} />
        <ApexChartComprobantes
          total={totalCargadoEnComprobantes}
          comprobantes={filterDataComprobantes}
        />
      </div>
      <div className="bg-white px-5 py-5 mx-5 my-10 gap-5">
        <ApexChartColumnProveedores proveedores={proveedores} />
      </div>
    </section>
  );
};
