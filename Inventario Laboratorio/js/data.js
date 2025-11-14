const API_URL = 'http://localhost:3000';

async function getProductos() {
    const res = await fetch(`${API_URL}/productos`);
    return await res.json();
}

async function getProductoById(id) {
    const res = await fetch(`${API_URL}/productos/${id}`);
    return await res.json();
}

async function addProducto(producto) {
    const res = await fetch(`${API_URL}/productos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(producto)
    });
    return await res.json();
}

async function updateProducto(id, producto) {
    const res = await fetch(`${API_URL}/productos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(producto)
    });
    return await res.json();
}

async function deleteProducto(id) {
    const res = await fetch(`${API_URL}/productos/${id}`, { method: 'DELETE' });
    return await res.json();
}

async function getProveedores() {
    const res = await fetch(`${API_URL}/proveedores`);
    return await res.json();
}

async function getProveedor(id) {
  const res = await fetch(`${API_URL}/proveedores/${id}`);
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Error al obtener proveedor: ${res.status} ${txt}`);
  }
  return await res.json();
}


async function addProveedor(proveedor) {
    const res = await fetch(`${API_URL}/proveedores`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(proveedor)
    });
    return await res.json();
}

async function updateProveedor(id, proveedor) {
    const res = await fetch(`${API_URL}/proveedores/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(proveedor)
    });
    return await res.json();
}

async function deleteProveedor(id) {
    const res = await fetch(`${API_URL}/proveedores/${id}`, { method: 'DELETE' });
    return await res.json();
}


async function getMovimientos() {
    const res = await fetch(`${API_URL}/movimientos`);
    return await res.json();
}

async function addMovimiento(movimiento) {
    const res = await fetch(`${API_URL}/movimientos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movimiento)
    });
    return await res.json();
}

async function getUsuarios() {
    const res = await fetch(`${API_URL}/usuarios`);
    return await res.json();
}

async function getUsuarioById(id) {
    const res = await fetch(`${API_URL}/usuarios/${id}`);
    return await res.json();
}

async function addUsuario(usuario) {
    const res = await fetch(`${API_URL}/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario)
    });
    return await res.json();
}

async function updateUsuario(id, usuario) {
    const res = await fetch(`${API_URL}/usuarios/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario)
    });
    return await res.json();
}

async function deleteUsuario(id) {
    const res = await fetch(`${API_URL}/usuarios/${id}`, { method: 'DELETE' });
    return await res.json();
}

async function getReporteStockCritico() {
  const res = await fetch(`${API_URL}/reportes/stock-critico`);
  return await res.json();
}

async function getReporteConsumo() {
  const res = await fetch(`${API_URL}/reportes/consumo`);
  return await res.json();
}

async function exportarInsumosExcel() {
  const url = `${API_URL}/reportes/exportar-insumos`;

  const a = document.createElement('a');
  a.href = url;
  a.download = 'insumos.xlsx';
  document.body.appendChild(a);
  a.click();
  a.remove();
}

