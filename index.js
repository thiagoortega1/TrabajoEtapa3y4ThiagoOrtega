import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js";

const firebaseConfig = {
  databaseURL: "https://club-deportivo-thiago-ortega-default-rtdb.firebaseio.com",
  projectId: "club-deportivo-thiago-ortega"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const articulosRef = ref(db, "articulos");

const formularioArticulo = document.getElementById("formularioArticulo");
const inputNombre = document.getElementById("inputNombre");
const inputDeporte = document.getElementById("inputDeporte");
const inputCantidad = document.getElementById("inputCantidad");
const inputEstado = document.getElementById("inputEstado");
const inputUbicacion = document.getElementById("inputUbicacion");
const mensaje = document.getElementById("mensaje");

const inputBusqueda = document.getElementById("inputBusqueda");
const botonLimpiar = document.getElementById("botonLimpiar");
const contador = document.getElementById("contador");
const tablaArticulos = document.getElementById("tablaArticulos");

let listaArticulos = [];


function mostrarMensaje(texto, tipo) {
  mensaje.textContent = texto;
  mensaje.className = "mensaje " + tipo;
}

formularioArticulo.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const nuevoArticulo = {
    nombre: inputNombre.value.trim(),
    deporte: inputDeporte.value,
    cantidad: Number(inputCantidad.value),
    estado: inputEstado.value,
    ubicacion: inputUbicacion.value.trim()
  };

  push(articulosRef, nuevoArticulo)
    .then(function () {
      mostrarMensaje("Artículo guardado correctamente.", "ok");
      formularioArticulo.reset();
    })
    .catch(function (error) {
      console.error("Error al guardar:", error);
      mostrarMensaje("No se pudo guardar: " + error.message, "error");
    });
});

onValue(articulosRef, function (datos) {
  const articulosGuardados = datos.val();

  listaArticulos = [];

  if (articulosGuardados) {
    for (const clave in articulosGuardados) {
      listaArticulos.push(articulosGuardados[clave]);
    }
  }

  aplicarFiltro();
}, function (error) {
  console.error("Error al leer:", error);
  mostrarMensaje("No se pudieron leer los datos: " + error.message, "error");
});

function aplicarFiltro() {
  const textoBuscado = inputBusqueda.value.trim().toLowerCase();

  const articulosFiltrados = listaArticulos.filter(function (articulo) {
    return String(articulo.nombre || "").toLowerCase().includes(textoBuscado);
  });

  mostrarArticulos(articulosFiltrados);
}

inputBusqueda.addEventListener("input", aplicarFiltro);

botonLimpiar.addEventListener("click", function () {
  inputBusqueda.value = "";
  aplicarFiltro();
});

function crearCelda(texto) {
  const celda = document.createElement("td");
  celda.textContent = texto;
  return celda;
}

function crearCeldaEstado(estado) {
  const celda = document.createElement("td");
  const etiqueta = document.createElement("span");

  etiqueta.textContent = estado;
  etiqueta.className = "etiqueta estado-" + estado.toLowerCase().replace(" ", "-");

  celda.appendChild(etiqueta);
  return celda;
}

function mostrarArticulos(articulos) {
  tablaArticulos.innerHTML = "";

  contador.textContent = articulos.length + " de " + listaArticulos.length + " artículos";

  if (articulos.length === 0) {
    const fila = document.createElement("tr");
    const celda = document.createElement("td");
    celda.colSpan = 5;
    celda.className = "sin-resultados";
    celda.textContent = "No hay artículos para mostrar.";
    fila.appendChild(celda);
    tablaArticulos.appendChild(fila);
    return;
  }

  articulos.forEach(function (articulo) {
    const fila = document.createElement("tr");

    fila.appendChild(crearCelda(articulo.nombre || ""));
    fila.appendChild(crearCelda(articulo.deporte || ""));
    fila.appendChild(crearCelda(articulo.cantidad || ""));
    fila.appendChild(crearCeldaEstado(articulo.estado || ""));
    fila.appendChild(crearCelda(articulo.ubicacion || ""));

    tablaArticulos.appendChild(fila);
  });
}