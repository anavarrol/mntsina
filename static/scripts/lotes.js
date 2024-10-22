function filter(page = 1) {
    var Centro = document.getElementById('Centro').value;
    var Cod_lote = document.getElementById('Cod_lote').value;
    var tbody = document.getElementById('tableBody');
    var paginationDiv = document.getElementById('paginationDiv');
    var oldPagination = document.getElementById('pagination');
    if (oldPagination) {
        paginationDiv.removeChild(oldPagination);
    }
    // Barra de carga
    var loading = document.getElementById('loading');
    loading.style.display = 'flex';

    fetch(`/search_lotes?page=${page}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          Centro: Centro,
            Cod_lote: Cod_lote
        })
    })
        .then(response => response.json())
        .then(data => {
            // clear de la tabla
            while (tbody.firstChild) {
                tbody.removeChild(tbody.firstChild);
            }
           
            // rellena las rows con los datos de la tabla
            data.results.forEach((row, index) => {
            var tr = document.createElement('tr');

            tr.innerHTML = `
            <td>${row.Centro}</td>
            <td>${row.Cod_lote}</td>
            <td>${row.Fecha_inicio}</td>
            <td>${row.Fecha_fin}</td>
            <td>${row.Descripcion}</td>
            <td>${row.ServicioCanario}</td>
            <td>${row.ServicioCompañia}</td>
            <td>${row.Id_lote}</td>
            <td>
            <a href="#" title="Editar" onclick="editRow(${index})"><i class="fas fa-pencil-alt"></i></a>
            <a href="#" title="Borrar Linea" onclick="deleterow(${index})"><i class="fas fa-trash-alt"></i></a>
            </td>`;
            tr.setAttribute("data-index", index);
            tbody.appendChild(tr);
            //console.log(row); 
});
            // Agrega el menu desplegable
            var paginationDiv = document.getElementById('paginationDiv');
            if (paginationDiv.firstChild) {
                paginationDiv.removeChild(paginationDiv.firstChild);
            }

            if (data.num_pages > 1) {
                var pagination = document.createElement('select');
                pagination.id = 'pagination';
                for (var i = 1; i <= data.num_pages; i++) {
                    var option = document.createElement('option');
                    option.value = i;
                    option.text = `Pagina ${i}`;
                    if (i == data.page) {
                        option.selected = true;
                    }
                    pagination.appendChild(option);
                }
                pagination.addEventListener('change', event => {
                    filter(event.target.value);
                });
                paginationDiv.appendChild(pagination);
            }
            // Oculta la barra de carga
            loading.style.display = 'none';
        })
        .catch(error => {
            console.error(error);
        });
        
}

filter();

// Popup de configuracion
function showConfig() {
    var popup = document.getElementById("configPopup");
    popup.style.display = "block";
}

// Oculta Popup de configuracion
function hideConfig() {
    var popup = document.getElementById("configPopup");
    popup.style.display = "none";
}

// Popup de edición
function showEdit() {
    var popup = document.getElementById("editPopup");
    popup.style.display = "block";
}

// Oculta Popup de edición
function hideEdit() {
    var popup = document.getElementById("editPopup");
    popup.style.display = "none";
}

// Guarda los datos proporcionados
function GuardarConfig() {
    // Obtiene los valores de los campos
  var Centro = document.getElementById("configCentro").value;
  var Cod_lote = document.getElementById("configCod_lote").value;
  var Fecha_inicio = document.getElementById("configFechaInicio").value;
  var Fecha_fin = document.getElementById("configFechaFin").value;
  var Descripcion = document.getElementById("configDescripcion").value;
  var ServicioCanario = document.getElementById("configServicioCanario").value;
  var ServicioCompañia = document.getElementById("configServicioCompañia").value;
  var Id_lote = document.getElementById("configId_lote").value;

  // LLama endpoint del servidor Python para Guardar y procesar el insert
  fetch("/insert_lote", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Centro: Centro,
        Cod_lote: Cod_lote,
        Fecha_inicio: Fecha_inicio,
        Fecha_fin: Fecha_fin,
        Descripcion: Descripcion,
        ServicioCanario: ServicioCanario,
        ServicioCompañia: ServicioCompañia,
        Id_lote: Id_lote
        }),
  })
      .then((response) => {
          if (response.status === 200) {
              alert("Inforación guardada");
              // Esconder popup de configuracion
              hideConfig();  
              filter();              
              
          } else {
              alert("Error: Datos no guardados");
          }
      })
      .catch((error) => {
          console.error(error);
          alert("Excepción: Guardar datos");
          hideConfig();
      });
}

function editRow(index) {
    // Busca el id "tableBody"
    var row = document.querySelector(`#tableBody tr[data-index='${index}']`);

    // Comprueba la línea
    if (row) {
        // Recoge los campos de la tabla
        var Centro = row.querySelector('td:nth-child(1)').innerText;
        var Cod_lote = row.querySelector('td:nth-child(2)').innerText;
        var Fecha_inicio = row.querySelector('td:nth-child(3)').innerText;
        var Fecha_fin = row.querySelector('td:nth-child(4)').innerText;
        var Descripcion = row.querySelector('td:nth-child(5)').innerText;
        var ServicioCanario = row.querySelector('td:nth-child(6)').innerText;
        var ServicioCompañia = row.querySelector('td:nth-child(7)').innerText;
        var Id_lote = row.querySelector('td:nth-child(8)').innerText;
        
        // Completa los campos con los valores del Popup
        document.getElementById("editCentro").value = Centro;
        document.getElementById("editCod_lote").value = Cod_lote;
        document.getElementById("editFechaInicio").value = Fecha_inicio;
        document.getElementById("editFechaFin").value = Fecha_fin;
        document.getElementById("editDescripcion").value = Descripcion;
        document.getElementById("editServicioCanario").value = ServicioCanario;
        document.getElementById("editServicioCompañia").value = ServicioCompañia;
        document.getElementById("editId_lote").value = Id_lote;


        // Almacena atributos de data-old-value
        document.getElementById("editCentro").setAttribute("data-old-value", Centro);
        document.getElementById("editCod_lote").setAttribute("data-old-value", Cod_lote);
        document.getElementById("editFechaInicio").setAttribute("data-old-value", Fecha_inicio);
        document.getElementById("editFechaFin").setAttribute("data-old-value", Fecha_fin);
        document.getElementById("editDescripcion").setAttribute("data-old-value", Descripcion);
        document.getElementById("editServicioCanario").setAttribute("data-old-value", ServicioCanario);
        document.getElementById("editServicioCompañia").setAttribute("data-old-value", ServicioCompañia);
        document.getElementById("editId_lote").setAttribute("data-old-value", Id_lote);

        showEdit();
    } else {
        alert(`Línea con ID: ${index} no encontrada.`);
        //console.error(`Linha com ID ${index} não encontrada.`);
        return;
    }
}

// Actualiza el registro
function updateRow() {
    // Obteniene los valores de los campos
    var oldCentro = document.getElementById("editCentro").getAttribute("data-old-value");
    var oldCod_lote = document.getElementById("editCod_lote").getAttribute("data-old-value");
    var oldFecha_inicio = document.getElementById("editFechaInicio").getAttribute("data-old-value");
    var oldFecha_fin = document.getElementById("editFechaFin").getAttribute("data-old-value");
    var oldDescripcion = document.getElementById("editDescripcion").getAttribute("data-old-value");
    var oldServicioCanario = document.getElementById("editServicioCanario").getAttribute("data-old-value");
    var oldServicioCompañia = document.getElementById("editServicioCompañia").getAttribute("data-old-value");
    var oldId_lote = document.getElementById("editId_lote").getAttribute("data-old-value");

    var newCentro = document.getElementById("editCentro").value;
    var newCod_lote = document.getElementById("editCod_lote").value;
    var newFecha_inicio = document.getElementById("editFechaInicio").value;
    var newFecha_fin = document.getElementById("editFechaFin").value;
    var newDescripcion = document.getElementById("editDescripcion").value;
    var newServicioCanario = document.getElementById("editServicioCanario").value;
    var newServicioCompañia = document.getElementById("editServicioCompañia").value;
    var newId_lote = document.getElementById("editId_lote").value;

    // Llama al endpoint del servidor Python para actualizar y procesar los datos actualizados
    fetch("/update_lote", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
           
        body: JSON.stringify({
            oldCentro: oldCentro,
            oldCod_lote: oldCod_lote,
            oldFecha_inicio: oldFecha_inicio,
            oldFecha_fin: oldFecha_fin,
            oldDescripcion: oldDescripcion,
            oldServicioCanario: oldServicioCanario,
            oldServicioCompañia: oldServicioCompañia,
            oldId_lote: oldId_lote,

            newCentro: newCentro,
            newCod_lote: newCod_lote,
            newFecha_inicio: newFecha_inicio,
            newFecha_fin: newFecha_fin,
            newDescripcion: newDescripcion,
            newServicioCanario: newServicioCanario,
            newServicioCompañia: newServicioCompañia,
            newId_lote: newId_lote
        }),

    })
        .then((response) => {
            if (response.status === 200) {
                alert("Inforación actualizada");
            } else {
                alert("Error: Datos no actualizaados");
            }
            hideEdit();
            filter();
        })
        .catch((error) => {
            console.error(error);
            alert("Excepción: Actualizar datos");
            hideEdit();

        });
}

// Elimina el registro
function deleterow(index) {
    var row = document.querySelector(`#tableBody tr[data-index='${index}']`);

    // Obteniene valores de los campos
    var delCentro = row.querySelector('td:nth-child(1)').innerText;
    var delCod_lote = row.querySelector('td:nth-child(2)').innerText;
    var delFecha_inicio = row.querySelector('td:nth-child(3)').innerText;
    var delFecha_fin = row.querySelector('td:nth-child(4)').innerText;
    var delDescripcion = row.querySelector('td:nth-child(5)').innerText;
    var delServicioCanario = row.querySelector('td:nth-child(6)').innerText;
    var delServicioCompañia = row.querySelector('td:nth-child(7)').innerText;
    var delId_lote = row.querySelector('td:nth-child(8)').innerText;

    // Alert de confirmación
    if (confirm("¿Estás seguro de que deseas eliminar esta fila?")) {
        // Llama al endpoint del servidor Python para actualizar y procesar los datos actualizados
        fetch("/delete_lote", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                delCentro: delCentro,
                delCod_lote: delCod_lote,
                delFecha_inicio: delFecha_inicio,
                delFecha_fin: delFecha_fin,
                delDescripcion: delDescripcion,
                delServicioCanario: delServicioCanario,
                delServicioCompañia: delServicioCompañia,
                delId_lote:delId_lote
            }),
        })
            .then((response) => {
                if (response.status === 200) {
                    alert("Registro borrado");
                } else {
                    alert("Error: Fila no borrada");
                }
                hideEdit();
                filter();
            })
            .catch((error) => {
                console.error(error);
                alert("Excepción: Borrar datos");
                hideEdit();
            });
    }
}
