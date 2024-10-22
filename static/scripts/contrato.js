function filter(page = 1) {
    var IdContrato = document.getElementById('IdContrato').value;
    var Descripcion = document.getElementById('Descripcion').value;
    var tbody = document.getElementById('tableBody');
    var paginationDiv = document.getElementById('paginationDiv');
    var oldPagination = document.getElementById('pagination');
    if (oldPagination) {
        paginationDiv.removeChild(oldPagination);
    }
    // Barra de carga
    var loading = document.getElementById('loading');
    loading.style.display = 'flex';

    fetch(`/search_contrato?page=${page}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          IdContrato: IdContrato,
            Descripcion: Descripcion
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
            <td>${row.IdContrato}</td>
            <td>${row.Descripcion}</td>
            <td>${row.IdGarante}</td>
            <td>${row.IdCatalogo}</td>
            <td>${row.Observaciones}</td>
            <td>${row.TipoContrato}</td>
            <td>${row.Cent_LPA}</td>
            <td>${row.Cent_TFE}</td>
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
  var IdContrato = document.getElementById("configIdContrato").value;
  var Descripcion = document.getElementById("configDescripcion").value;
  var IdGarante = document.getElementById("configIdGarante").value;
  var IdCatalogo = document.getElementById("configIdCatalogo").value;
  var Observaciones = document.getElementById("configObservaciones").value;
  var TipoContrato = document.getElementById("configTipoContrato").value;
  var Centro_LPA = document.getElementById("configLPA").value;
  var Centro_TNF = document.getElementById("configTNF").value;

  // LLama endpoint del servidor Python para Guardar y procesar el insert
  fetch("/insert_contrato", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({
        IdContrato: IdContrato,
        Descripcion: Descripcion,
        IdGarante: IdGarante,
        IdCatalogo: IdCatalogo,
        Observaciones: Observaciones,
        TipoContrato: TipoContrato,
        Centro_LPA: Centro_LPA,
        Centro_TNF: Centro_TNF
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
        var IdContrato = row.querySelector('td:nth-child(1)').innerText;
        var Descripcion = row.querySelector('td:nth-child(2)').innerText;
        var IdGarante = row.querySelector('td:nth-child(3)').innerText;
        var IdCatalogo = row.querySelector('td:nth-child(4)').innerText;
        var Observaciones = row.querySelector('td:nth-child(5)').innerText;
        var TipoContrato = row.querySelector('td:nth-child(6)').innerText;
        var Centro_LPA = row.querySelector('td:nth-child(7)').innerText;
        var Centro_TNF = row.querySelector('td:nth-child(8)').innerText;
        
        // Completa los campos con los valores del Popup
        document.getElementById("editIdContrato").value = IdContrato;
        document.getElementById("editDescripcion").value = Descripcion;
        document.getElementById("editIdGarante").value = IdGarante;
        document.getElementById("editIdCatalogo").value = IdCatalogo;
        document.getElementById("editObservaciones").value = Observaciones;
        document.getElementById("editTipoContrato").value = TipoContrato;
        document.getElementById("editCENT_LPA").value = Centro_LPA;
        document.getElementById("editCENT_TNF").value = Centro_TNF;


        // Almacena atributos de data-old-value
        document.getElementById("editIdContrato").setAttribute("data-old-value", IdContrato);
        document.getElementById("editDescripcion").setAttribute("data-old-value", Descripcion);
        document.getElementById("editIdGarante").setAttribute("data-old-value", IdGarante);
        document.getElementById("editIdCatalogo").setAttribute("data-old-value", IdCatalogo);
        document.getElementById("editObservaciones").setAttribute("data-old-value", Observaciones);
        document.getElementById("editTipoContrato").setAttribute("data-old-value", TipoContrato);
        document.getElementById("editCENT_LPA").setAttribute("data-old-value", Centro_LPA);
        document.getElementById("editCENT_TNF").setAttribute("data-old-value", Centro_TNF);

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
    var oldIdContrato = document.getElementById("editIdContrato").getAttribute("data-old-value");
    var oldDescripcion = document.getElementById("editDescripcion").getAttribute("data-old-value");
    var oldIdGarante = document.getElementById("editIdGarante").getAttribute("data-old-value");
    var oldIdCatalogo = document.getElementById("editIdCatalogo").getAttribute("data-old-value");
    var oldObservaciones = document.getElementById("editObservaciones").getAttribute("data-old-value");
    var oldTipoContrato = document.getElementById("editTipoContrato").getAttribute("data-old-value");
    var oldCentro_LPA = document.getElementById("editCENT_LPA").getAttribute("data-old-value");
    var oldCentro_TNF = document.getElementById("editCENT_TNF").getAttribute("data-old-value");

    var newIdContrato = document.getElementById("editIdContrato").value;
    var newDescripcion = document.getElementById("editDescripcion").value;
    var newIdGarante = document.getElementById("editIdGarante").value;
    var newIdCatalogo = document.getElementById("editIdCatalogo").value;
    var newObservaciones = document.getElementById("editObservaciones").value;
    var newTipoContrato = document.getElementById("editTipoContrato").value;
    var newCentro_LPA = document.getElementById("editCENT_LPA").value;
    var newCentro_TNF = document.getElementById("editCENT_TNF").value;

    // Llama al endpoint del servidor Python para actualizar y procesar los datos actualizados
    fetch("/update_contrato", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
           
        body: JSON.stringify({
            oldIdContrato: oldIdContrato,
            oldDescripcion: oldDescripcion,
            oldIdGarante: oldIdGarante,
            oldIdCatalogo: oldIdCatalogo,
            oldObservaciones: oldObservaciones,
            oldTipoContrato: oldTipoContrato,
            oldCentro_LPA: oldCentro_LPA,
            oldCentro_TNF: oldCentro_TNF,

            newIdContrato: newIdContrato,
            newDescripcion: newDescripcion,
            newIdGarante: newIdGarante,
            newIdCatalogo: newIdCatalogo,
            newObservaciones: newObservaciones,
            newTipoContrato: newTipoContrato,
            newCentro_LPA: newCentro_LPA,
            newCentro_TNF: newCentro_TNF
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
    var delIdContrato = row.querySelector('td:nth-child(1)').innerText;
    var delDescripcion = row.querySelector('td:nth-child(2)').innerText;
    var delIdGarante = row.querySelector('td:nth-child(3)').innerText;
    var delIdCatalogo = row.querySelector('td:nth-child(4)').innerText;
    var delObservaciones = row.querySelector('td:nth-child(5)').innerText;
    var delTipoContrato = row.querySelector('td:nth-child(6)').innerText;
    var delCentro_LPA = row.querySelector('td:nth-child(7)').innerText;
    var delCentro_TNF = row.querySelector('td:nth-child(8)').innerText;

    // Alert de confirmación
    if (confirm("¿Estás seguro de que deseas eliminar esta fila?")) {
        // Llama al endpoint del servidor Python para actualizar y procesar los datos actualizados
        fetch("/delete_contrato", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                delIdContrato: delIdContrato,
                delDescripcion: delDescripcion,
                delIdGarante: delIdGarante,
                delIdCatalogo: delIdCatalogo,
                delObservaciones: delObservaciones,
                delTipoContrato: delTipoContrato,
                delCentro_LPA: delCentro_LPA,
                delCentro_TNF:delCentro_TNF
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
