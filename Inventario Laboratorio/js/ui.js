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
  if (!Array.isArray(productos)) productos = [];

  if (filtro) {
    const q = filtro.toLowerCase();
    productos = productos.filter(p =>
      (p.nombre || '').toLowerCase().includes(q) ||
      (p.categoria || '').toLowerCase().includes(q) ||
      (p.proveedor || '').toLowerCase().includes(q)
    );
  }

  productos.forEach(p => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${p.nombre}</td>
      <td>${p.categoria || ''}</td>
      <td>${p.cantidad}</td>
      <td>${p.unidad || ''}</td>
      <td>${p.proveedor || 'N/A'}</td>
      <td>${p.ubicacion || ''}</td>
      <td>${p.observaciones ? (p.observaciones.length > 40 ? p.observaciones.slice(0,40)+'...' : p.observaciones) : ''}</td>
      <td>
        <button class="edit-btn" onclick='app.editInsumo(${p.id})'>✏️</button>
        <button class="delete-btn" onclick='app.deleteInsumo(${p.id})'>🗑️</button>
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
  
populateInsumoForm: (i) => {
  document.getElementById('insumo-id').value = i.id || '';
  document.getElementById('nombre-insumo').value = i.nombre || '';
  document.getElementById('categoria-insumo').value = i.categoria || ''; 
  const tipoGeneral = document.getElementById('tipo-general');
  const tipoReactivo = document.getElementById('tipo-reactivo');
  const estadoReactivo = document.getElementById('estado-reactivo');
  const reactivosExtra = document.getElementById('reactivos-extra');

  if (i.categoria && i.categoria.toLowerCase().includes('reactivo')) {
    tipoGeneral.value = 'Reactivos';
    reactivosExtra.style.display = 'block';
    const lower = i.categoria.toLowerCase();
    tipoReactivo.value = lower.includes('organ') ? 'orgánicos' : (lower.includes('inorg') ? 'inorgánicos' : '');
    estadoReactivo.value = lower.includes('sól') || lower.includes('sol') ? 'sólidos' : (lower.includes('liq') ? 'líquidos' : '');
  } else {
    tipoGeneral.value = i.categoria || '';
    reactivosExtra.style.display = 'none';
    tipoReactivo.value = '';
    estadoReactivo.value = '';
  }

  document.getElementById('cantidad-insumo').value = i.cantidad || 0;
  document.getElementById('unidad-insumo').value = i.unidad || '';
  document.getElementById('ubicacion-insumo').value = i.ubicacion || '';
  document.getElementById('proveedor-insumo').value = i.proveedorId || '';
  document.getElementById('observaciones-insumo').value = i.observaciones || '';

  if (tipoGeneral.value !== 'Reactivos') {
    document.getElementById('categoria-insumo').value = tipoGeneral.value || '';
  } else {
    if (tipoReactivo.value && estadoReactivo.value) {
      document.getElementById('categoria-insumo').value = `Reactivos ${tipoReactivo.value} ${estadoReactivo.value}`;
    } else {
      document.getElementById('categoria-insumo').value = i.categoria || '';
    }
  }

  ui.showInsumoForm();
},

showInsumoForm: () => document.getElementById('insumo-form-container').style.display = 'block',
hideInsumoForm: () => document.getElementById('insumo-form-container').style.display = 'none',

mostrarModalConfirmacion: (mensaje, callbackConfirmar) => {
  const modal = document.getElementById('modal-confirmacion');
  const modalMensaje = document.getElementById('modal-mensaje');
  const btnConfirmar = document.getElementById('modal-confirmar');
  const btnCancelar = document.getElementById('modal-cancelar');

  modalMensaje.textContent = mensaje;
  modal.style.display = 'flex';

  const nuevoBtnConfirmar = btnConfirmar.cloneNode(true);
  btnConfirmar.parentNode.replaceChild(nuevoBtnConfirmar, btnConfirmar);

  nuevoBtnConfirmar.addEventListener('click', () => {
    modal.style.display = 'none';
    callbackConfirmar();
  });

  btnCancelar.onclick = () => {
    modal.style.display = 'none';
  };
},

setupCategoriaControls: () => {
  const tipoGeneral = document.getElementById('tipo-general');
  const tipoReactivo = document.getElementById('tipo-reactivo');
  const estadoReactivo = document.getElementById('estado-reactivo');
  const reactivosExtra = document.getElementById('reactivos-extra');
  const categoriaHidden = document.getElementById('categoria-insumo');

  if (!tipoGeneral) return;

  tipoGeneral.addEventListener('change', () => {
    if (tipoGeneral.value === 'Reactivos') {
      reactivosExtra.style.display = 'block';
      categoriaHidden.value = '';
    } else {
      reactivosExtra.style.display = 'none';
      tipoReactivo.value = '';
      estadoReactivo.value = '';
      categoriaHidden.value = tipoGeneral.value;
    }
  });

  [tipoReactivo, estadoReactivo].forEach(sel => {
    sel.addEventListener('change', () => {
      if (tipoReactivo.value && estadoReactivo.value) {
        categoriaHidden.value = `Reactivos ${tipoReactivo.value} ${estadoReactivo.value}`;
      }
    });
  });
},


  
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

  const proveedores = await getProveedores(); // de data.js
  proveedores.forEach(p => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${p.nombre}</td>
      <td>${p.contacto || ''}</td>
      <td>${p.telefono || ''}</td>
      <td>${p.email || ''}</td>
      <td>
        <button class="edit-btn" onclick="app.editProveedor(${p.id})">✏️</button>
        <button class="delete-btn" onclick="app.deleteProveedor(${p.id})">🗑️</button>
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

