// src/utils/migrarCarrito.js
export const migrarCarritoLocalAlServidor = async (userId, setVerProductosCarrito) => {
  try {
    const carritoLocal = JSON.parse(localStorage.getItem('carritoFalso') || '[]');

    if (carritoLocal.length === 0) {
      await cargarCarritoDelServidor(userId, setVerProductosCarrito);
      return;
    }

    const productosParaAPI = carritoLocal.map(item => ({
      productId: item.id || item.producto_id || item.productId,
      quantity: item.cantidad || 1
    }));

    const payload = {
      userId: parseInt(userId),
      date: new Date().toISOString(),
      products: productosParaAPI
    };

    const res = await fetch('https://fakestoreapi.com/carts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      console.log('Carrito migrado al servidor');
      localStorage.removeItem('carritoFalso');
      await cargarCarritoDelServidor(userId, setVerProductosCarrito);
    }
  } catch (err) {
    console.error('Error migrando carrito:', err);
  }
};

export const cargarCarritoDelServidor = async (userId, setVerProductosCarrito) => {
  try {
    const res = await fetch(`https://fakestoreapi.com/carts/user/${userId}`);
    const carritos = await res.json();

    if (carritos.length > 0) {
      const ultimoCarrito = carritos[0];
      const productos = await Promise.all(
        ultimoCarrito.products.map(async (p) => {
          const prodRes = await fetch(`https://fakestoreapi.com/products/${p.productId}`);
          const prod = await prodRes.json();
          return {
            ...prod,
            carrito_id: Date.now() + Math.random(),
            cantidad: p.quantity,
            nombre_talla: "M" // Fake Store no tiene tallas
          };
        })
      );
      setVerProductosCarrito(productos);
    } else {
      setVerProductosCarrito([]);
    }
  } catch (err) {
    console.error('Error cargando carrito del servidor:', err);
    setVerProductosCarrito([]);
  }
};