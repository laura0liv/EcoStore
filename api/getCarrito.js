// src/api/getCarrito.js
export const getCarrito = (setVerProductosCarrito) => {
  try {
    const datos = localStorage.getItem("carritoFalso");
    const carrito = datos ? JSON.parse(datos) : [];
    setVerProductosCarrito(carrito);
  } catch (error) {
    console.error("Error al cargar el carrito:", error);
    setVerProductosCarrito([]);
  }
};

export const guardarCarrito = (carrito) => {
  localStorage.setItem("carritoFalso", JSON.stringify(carrito));
};