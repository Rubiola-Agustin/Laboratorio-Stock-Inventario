const ui = {
    showSection: (id) => {
      document.querySelectorAll('main section').forEach(section => {
        section.style.display = section.id === id ? 'block' : 'none';
      });
    },

    updateDashboardSummary: async () => {
      const productos = await getProductos();
      const total = productos.length;
      const bajos = productos.filter(p => p.cantidad < 5).length;
  
      document.getElementById('total-insumos').textContent = total;
      document.getElementById('insumos-bajos').textContent = bajos;
  
      const alertas = document.getElementById('alertas-dashboard');
      alertas.innerHTML = '';
      if (bajos > 0) {
        productos.filter(p => p.cantidad < 5).forEach(p => {
          const li = document.createElement('li');
          li.textContent = `⚠️ Stock bajo: ${p.nombre} (${p.cantidad} unidades)`;
          alertas.appendChild(li);
        });
      } else {
        const li = document.createElement('li');
        li.textContent = 'No hay alertas de stock bajo.';
        alertas.appendChild(li);
      }
    },
  
    renderInsumos: async (filtro = '') => {
      const lista = document.querySelector('#insumos-list tbody');
      lista.innerHTML = '';
  
      let productos = await getProductos();
      if (filtro) {
        filtro = filtro.toLowerCase();
        productos = productos.filter(p =>
          p.nombre.toLowerCase().includes(filtro) ||
          p.categoria.toLowerCase().includes(filtro)
        );
      }
  
      productos.forEach(p => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
          <td>${p.nombre}</td>
          <td>${p.categoria}</td>
          <td>${p.cantidad}</td>
          <td>${p.unidad || ''}</td>
          <td>${p.ubicacion || ''}</td>
          <td>${p.proveedor || 'N/A'}</td>
          <td>
            <button onclick="app.editInsumo(${p.id})">✏️</button>
            <button onclick="app.deleteInsumo(${p.id})">🗑️</button>
          </td>
        `;
        lista.appendChild(fila);
      });
    },
  
    populateCategoriaSelect: async (idSelect, seleccion = '') => {
      const select = document.getElementById(idSelect);
      select.innerHTML = `
        <option value="">Seleccione categoría</option>
        <option value="Reactivo químico">Reactivo químico</option>
        <option value="Instrumento">Instrumento</option>
        <option value="Vidrio de laboratorio">Vidrio de laboratorio</option>
      `;
      if (seleccion) select.value = seleccion;
    },
  
    populateProveedorSelect: async (idSelect, seleccion = '') => {
      const select = document.getElementById(idSelect);
      const proveedores = await getProveedores();
      select.innerHTML = '<option value="">Seleccione proveedor</option>';
      proveedores.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.id;
        opt.textContent = p.nombre;
        if (seleccion && p.id === seleccion) opt.selected = true;
        select.appendChild(opt);
      });
    },
  
    populateInsumoForm: (p) => {
      document.getElementById('insumo-id').value = p.id || '';
      document.getElementById('nombre-insumo').value = p.nombre || '';
      document.getElementById('categoria-insumo').value = p.categoria || '';
      document.getElementById('cantidad-insumo').value = p.cantidad || 0;
      document.getElementById('unidad-insumo').value = p.unidad || '';
      document.getElementById('ubicacion-insumo').value = p.ubicacion || '';
      document.getElementById('proveedor-insumo').value = p.proveedorId || '';
    },
  
    showInsumoForm: () => document.getElementById('insumo-form-container').style.display = 'block',
    hideInsumoForm: () => document.getElementById('insumo-form-container').style.display = 'none',
  
    renderMovimientos: async () => {
      const lista = document.querySelector('#movimientos-list tbody');
      lista.innerHTML = '';
      const movimientos = await getMovimientos();
      movimientos.forEach(m => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
          <td>${m.nombre_producto || ''}</td>
          <td>${m.tipo}</td>
          <td>${m.cantidad}</td>
          <td>${m.motivo}</td>
          <td>${new Date(m.fecha).toLocaleString()}</td>
        `;
        lista.appendChild(fila);
      });
    },
  
    populateMovimientoInsumoSelect: async (idSelect) => {
      const select = document.getElementById(idSelect);
      const productos = await getProductos();
      select.innerHTML = '<option value="">Seleccione insumo</option>';
      productos.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.id;
        opt.textContent = p.nombre;
        select.appendChild(opt);
      });
    },
  
    showMovimientoForm: () => document.getElementById('movimiento-form-container').style.display = 'block',
    hideMovimientoForm: () => document.getElementById('movimiento-form-container').style.display = 'none',
  
    renderProveedores: async () => {
        const lista = document.querySelector('#proveedores-list tbody');
        lista.innerHTML = '';
        const proveedores = await getProveedores();
        proveedores.forEach(p => {
          const fila = document.createElement('tr');
          fila.innerHTML = `
            <td>${p.nombre}</td>
            <td>${p.contacto || ''}</td>
            <td>${p.telefono || ''}</td>
            <td>${p.email || ''}</td>
            <td>
              <button onclick="ui.populateProveedorForm(${JSON.stringify(p)})">✏️</button>
            </td>
          `;
          lista.appendChild(fila);
        });
      },

      populateProveedorForm: (p) => {
        document.getElementById('proveedor-id').value = p.id || '';
        document.getElementById('nombre-proveedor').value = p.nombre || '';
        document.getElementById('contacto-proveedor').value = p.contacto || '';
        document.getElementById('telefono-proveedor').value = p.telefono || '';
        document.getElementById('email-proveedor').value = p.email || '';
        ui.showProveedorForm();
      },
      
      showProveedorForm: () => {
        document.getElementById('proveedor-form-container').style.display = 'block';
      },
      
      hideProveedorForm: () => {
        document.getElementById('proveedor-form-container').style.display = 'none';
      },
      
  
    renderUsuarios: async () => {
      const lista = document.querySelector('#usuarios-list tbody');
      lista.innerHTML = '';
      const usuarios = await getUsuarios();
      usuarios.forEach(u => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
          <td>${u.nombre}</td>
          <td>${u.usuario}</td>
          <td>${u.rol}</td>
        `;
        lista.appendChild(fila);
      });
    },
  
    populateUsuarioForm: (u) => {
      document.getElementById('usuario-id').value = u.id || '';
      document.getElementById('nombre-usuario').value = u.nombre || '';
      document.getElementById('usuario-usuario').value = u.usuario || '';
      document.getElementById('rol-usuario').value = u.rol || 'empleado';
      ui.showUsuarioForm();
    },
  
    hideUsuarioForm: () => document.getElementById('usuario-form-container').style.display = 'none',
    showUsuarioForm: () => document.getElementById('usuario-form-container').style.display = 'block'
  };

async function mostrarReporteStockCritico() {
  const data = await getReporteStockCritico();
  const contenedor = document.getElementById('reporte-contenido');
  contenedor.innerHTML = `
    <h3>📉 Reporte de Stock Crítico</h3>
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Categoría</th>
          <th>Cantidad</th>
          <th>Unidad</th>
          <th>Ubicación</th>
        </tr>
      </thead>
      <tbody>
        ${data.length > 0
          ? data.map(p => `
            <tr>
              <td>${p.nombre}</td>
              <td>${p.categoria}</td>
              <td>${p.cantidad}</td>
              <td>${p.unidad}</td>
              <td>${p.ubicacion}</td>
            </tr>`).join('')
          : '<tr><td colspan="5">✅ No hay insumos críticos</td></tr>'}
      </tbody>
    </table>
  `;
}

async function mostrarReporteConsumo() {
  const data = await getReporteConsumo();
  const contenedor = document.getElementById('reporte-contenido');
  contenedor.innerHTML = `
    <h3>📊 Reporte de Consumo</h3>
    <table>
      <thead>
        <tr>
          <th>Insumo</th>
          <th>Total Consumido</th>
        </tr>
      </thead>
      <tbody>
        ${data.length > 0
          ? data.map(i => `
            <tr>
              <td>${i.insumo}</td>
              <td>${i.total_consumido}</td>
            </tr>`).join('')
          : '<tr><td colspan="2">No hay datos disponibles</td></tr>'}
      </tbody>
    </table>
  `;
}

async function verificarStockCritico() {
  const data = await getReporteStockCritico();
  const alerta = document.getElementById('alertas-dashboard');
  if (data.length > 0) {
    alerta.innerHTML = `<p style="color:red;">⚠️ Hay ${data.length} insumos con stock crítico</p>`;
  } else {
    alerta.innerHTML = `<p style="color:green;">✅ Todo el stock está en niveles normales</p>`;
  }
}

window.mostrarReporteStockCritico = mostrarReporteStockCritico;
window.mostrarReporteConsumo = mostrarReporteConsumo;
window.verificarStockCritico = verificarStockCritico;

