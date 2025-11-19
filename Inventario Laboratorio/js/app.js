const app = {
init: async () => {
    try {
      app.bindEvents();

      await ui.setupCategoriaControls();
      await app.loadInitialData();
      ui.showSection('dashboard');
      await ui.updateDashboardSummary();

      const btnExcel = document.getElementById('exportar-insumos-excel');
      if (btnExcel && typeof exportarInsumosExcel === 'function') {
        btnExcel.addEventListener('click', exportarInsumosExcel);
      }

    } catch (err) {
      console.error("Error en app.init:", err);
    }
},



    bindEvents: () => {
      document.querySelectorAll('nav ul li a').forEach(link => {
        link.addEventListener('click', async (e) => {
          e.preventDefault();
          const sectionId = e.target.getAttribute('href').substring(1);
          ui.showSection(sectionId);
          await app.loadSectionData(sectionId);
        });
      });
  
      document.getElementById('add-insumo-btn').addEventListener('click', async () => {
        ui.populateInsumoForm({});
        await ui.populateCategoriaSelect('categoria-insumo');
        await ui.populateProveedorSelect('proveedor-insumo');
        ui.showInsumoForm();
      });
  
      document.getElementById('cancel-insumo-form').addEventListener('click', ui.hideInsumoForm);
  
      document.getElementById('insumo-form').addEventListener('submit', app.handleInsumoSubmit);
  
      document.getElementById('search-insumo').addEventListener('keyup', (e) => {
        ui.renderInsumos(e.target.value);
      });
  
      document.getElementById('add-movimiento-btn').addEventListener('click', async () => {
            await ui.renderMovimientoAutocomplete();
        ui.showMovimientoForm();
      });
  
      document.getElementById('cancel-movimiento-form').addEventListener('click', ui.hideMovimientoForm);
  
      document.getElementById('movimiento-form').addEventListener('submit', app.handleMovimientoSubmit);
  
      document.getElementById('add-proveedor-btn').addEventListener('click', () => ui.populateProveedorForm({}));
      document.getElementById('cancel-proveedor-form').addEventListener('click', ui.hideProveedorForm);
      document.getElementById('proveedor-form').addEventListener('submit', app.handleProveedorSubmit);
  
      document.getElementById('add-usuario-btn').addEventListener('click', () => ui.populateUsuarioForm({}));
      document.getElementById('cancel-usuario-form').addEventListener('click', ui.hideUsuarioForm);
      document.getElementById('usuario-form').addEventListener('submit', app.handleUsuarioSubmit);

        document.getElementById('generar-reporte-stock')
        .addEventListener('click', mostrarReporteStockCritico);

        document.getElementById('generar-reporte-consumo')
        .addEventListener('click', mostrarReporteConsumo);

    },

    loadInitialData: async () => {
      await ui.updateDashboardSummary();
      await ui.renderInsumos();
      await ui.renderMovimientos();
      await ui.renderProveedores();
      await ui.renderUsuarios();
      await ui.populateCategoriaSelect('categoria-insumo');
      await verificarStockCritico();

    },

    loadSectionData: async (sectionId) => {
      switch (sectionId) {
        case 'dashboard':
          await ui.updateDashboardSummary();
          break;
        case 'insumos':
          await ui.renderInsumos();
          await ui.populateProveedorSelect('proveedor-insumo');
          await ui.populateCategoriaSelect('categoria-insumo');
          break;
        case 'movimientos':
          await ui.renderMovimientos();
          await ui.renderMovimientoAutocomplete();
          break;
        case 'proveedores':
          await ui.renderProveedores();
          break;
        case 'usuarios':
          await ui.renderUsuarios();
          break;
        case 'reportes':
          document.getElementById('reporte-contenido').innerHTML =
            '<p>Seleccione un tipo de reporte para generar.</p>';
          break;
        default:
          break;
      }
    },

handleInsumoSubmit: async (e) => {
  e.preventDefault();
  try {
    const id = document.getElementById('insumo-id').value;
    const producto = {
      nombre: document.getElementById('nombre-insumo').value,
      categoria: document.getElementById('categoria-insumo').value || document.getElementById('tipo-general').value,
      cantidad: parseInt(document.getElementById('cantidad-insumo').value) || 0,
      unidad: document.getElementById('unidad-insumo').value,
      ubicacion: document.getElementById('ubicacion-insumo').value,
      proveedorId: document.getElementById('proveedor-insumo').value || null,
      observaciones: document.getElementById('observaciones-insumo').value || ''
    };

    if (id) {
      await updateProducto(id, producto);
    } else {
      await addProducto(producto);
    }

    ui.hideInsumoForm();
    await ui.renderInsumos();
    await ui.updateDashboardSummary();
  } catch (err) {
    console.error('Error guardando insumo:', err);
    alert('Error al guardar el insumo. Revisa la consola.');
  }
},

    editInsumo: async (id) => {
      const insumo = await getProductoById(id);
      ui.populateInsumoForm(insumo);
      await ui.populateCategoriaSelect('categoria-insumo', insumo.categoria);
      await ui.populateProveedorSelect('proveedor-insumo', insumo.proveedorId);
      ui.showInsumoForm();
    },
  
deleteInsumo: (id) => {
  ui.mostrarModalConfirmacion(
    '¿Estás seguro que deseas eliminar este insumo?',
    async () => {
      try {
        await deleteProducto(id);
        await ui.renderInsumos();
        await ui.updateDashboardSummary();
        ui.ocultarModalConfirmacion();
      } catch (err) {
        ui.ocultarModalConfirmacion();

        if (err.error === "NO_ELIMINABLE") {
          ui.mostrarModalInfo("No se puede eliminar este insumo porque tiene movimientos registrados.");
        } else {
          ui.mostrarModalInfo("Error al eliminar el insumo.");
        }
      }
    }
  );
},



   handleMovimientoSubmit: async (e) => {
  e.preventDefault();
  try {


    const insumoInput = document.getElementById('autocomplete-insumo');
    const insumoId = insumoInput.dataset.insumoId;

    if (!insumoId) {
      alert("Por favor seleccione un insumo válido.");
      return;
    }

    const movimiento = {
      insumoId: insumoId,
      tipo: document.getElementById('tipo-movimiento').value,
      cantidad: parseInt(document.getElementById('cantidad-movimiento').value),
      motivo: document.getElementById('motivo-movimiento').value
    };

    const producto = await getProductoById(movimiento.insumoId);
    if (movimiento.tipo === 'salida' && movimiento.cantidad > producto.cantidad) {
      alert('No hay suficiente stock disponible.');
      return;
    }

    await addMovimiento(movimiento);
    ui.hideMovimientoForm();
    await ui.renderMovimientos();
    await ui.renderInsumos();
    await ui.updateDashboardSummary();

  } catch (err) {
    console.error('Error al registrar movimiento:', err);
  }
},

    handleProveedorSubmit: async (e) => {
      e.preventDefault();
      try {
        const id = document.getElementById('proveedor-id').value;
        const proveedor = {
          nombre: document.getElementById('nombre-proveedor').value,
          contacto: document.getElementById('contacto-proveedor').value,
          telefono: document.getElementById('telefono-proveedor').value,
          email: document.getElementById('email-proveedor').value
        };
  
        if (id) await updateProveedor(id, proveedor);
        else await addProveedor(proveedor);
  
        ui.hideProveedorForm();
        await ui.renderProveedores();
        await ui.populateProveedorSelect('proveedor-insumo');
      } catch (err) {
        console.error('Error guardando proveedor:', err);
        alert('Error al guardar el proveedor.');
      }
    },

openNuevoProveedor: () => {
  ui.populateProveedorForm({});
  ui.showProveedorForm();
},

editProveedor: async (id) => {
  const proveedor = await getProveedor(id);
  ui.populateProveedorForm(proveedor);
  ui.showProveedorForm();
},

deleteProveedor: async (id) => {
  ui.mostrarModalConfirmacion(
    '¿Eliminar este proveedor?',
    async () => {
      await deleteProveedor(id);
      await ui.renderProveedores();
      await ui.populateProveedorSelect('proveedor-insumo');
    }
  );
},

    
    handleUsuarioSubmit: async (e) => {
      e.preventDefault();
      try {
        const id = document.getElementById('usuario-id').value;
        const usuario = {
          nombre: document.getElementById('nombre-usuario').value,
          usuario: document.getElementById('usuario-usuario').value,
          contraseña: document.getElementById('contraseña-usuario').value,
          rol: document.getElementById('rol-usuario').value
        };
  
        if (id) await updateUsuario(id, usuario);
        else await addUsuario(usuario);
  
        ui.hideUsuarioForm();
        await ui.renderUsuarios();
      } catch (err) {
        console.error('Error guardando usuario:', err);
      }
    }
  };
  
  document.addEventListener('DOMContentLoaded', () => {
    app.init();
  });
  