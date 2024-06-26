import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

export const Home = () => {
  // const { salidas } = useSalidasContext();
  // const { remuneracionesMensuales, remuneraciones } = useRemuneracionContext();

  // const { rendiciones } = useRendicionesContext();

  // const { legales, legalesReal } = useLegalesContext();

  // //fltros
  // const [selectedUser, setSelectedUser] = useState("");

  // // Obtener lista de usuarios únicos
  // const uniqueUsers = Array.from(
  //   new Set(
  //     remuneraciones.map((remuneracion) => remuneracion.usuario.toLowerCase())
  //   )
  // );

  // const handleUserChange = (e) => {
  //   setSelectedUser(e.target.value);
  // };

  // const handleFechaInicioChange = (e) => {
  //   setFechaInicio(e.target.value);
  // };

  // const handleFechaFinChange = (e) => {
  //   setFechaFin(e.target.value);
  // };

  // // Obtener el primer día del mes actual
  // const today = new Date();
  // const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  // const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  // // Convertir las fechas en formato YYYY-MM-DD para los inputs tipo date
  // const fechaInicioPorDefecto = firstDayOfMonth.toISOString().split("T")[0];
  // const fechaFinPorDefecto = lastDayOfMonth.toISOString().split("T")[0];

  // // Estado inicial de las fechas con el rango del mes actual
  // const [fechaInicio, setFechaInicio] = useState(fechaInicioPorDefecto);
  // const [fechaFin, setFechaFin] = useState(fechaFinPorDefecto);

  // // Filtro por rango de fechas (si están definidas)
  // const fechaInicioObj = new Date(fechaInicio);
  // const fechaFinObj = new Date(fechaFin);
  // // Filtro por término de búsqueda y usuario seleccionado
  // let filteredDataRemuneraciones = remuneraciones.filter((item) => {
  //   const matchesUser =
  //     selectedUser === "" ||
  //     item.usuario.toLowerCase() === selectedUser.toLowerCase();

  //   return matchesUser;
  // });

  // filteredDataRemuneraciones = filteredDataRemuneraciones.filter((item) => {
  //   const fechaOrden = new Date(item.created_at);
  //   return fechaOrden >= fechaInicioObj && fechaOrden <= fechaFinObj;
  // });

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
      {/* <div className="flex gap-2 items-center w-2/3 max-md:w-auto max-md:flex-col my-5 mx-5">
        <div className="bg-white py-2 px-3 text-sm font-bold w-full border border-blue-500 cursor-pointer">
          <select
            value={selectedUser}
            onChange={handleUserChange}
            className="outline-none text-slate-600 bg-white w-full uppercase"
          >
            <option className="uppercase font-bold text-orange-400" value="">
              Seleccionar usuario...
            </option>
            {uniqueUsers.map((user) => (
              <option
                className="uppercase font-semibold"
                key={user}
                value={user}
              >
                {user}
              </option>
            ))}
          </select>
        </div>
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
      </div> */}
    </section>
  );
};
