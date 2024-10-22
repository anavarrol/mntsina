function filter(page = 1) {
    var IdGarante = document.getElementById('IdGarante').value;
    var Descripcion = document.getElementById('Descripcion').value;
    var tbody = document.getElementById('tableBody');
    var paginationDiv = document.getElementById('paginationDiv');
    var oldPagination = document.getElementById('pagination');
    if (oldPagination) {
        paginationDiv.removeChild(oldPagination);
    }
    var loading = document.getElementById('loading');
    loading.style.display = 'flex';
    fetch(`/search_garante?page=${page}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            IdGarante: IdGarante,
            Descripcion: Descripcion
        })
    })
        .then(response => response.json())
        .then(data => {
            // Limpa a tabela atual
            while (tbody.firstChild) {
                tbody.removeChild(tbody.firstChild);
            }

            // Añade las filas con los datos en la tabla
            data.results.forEach((row, index) => {
                var tr = document.createElement('tr');
                tr.setAttribute("data-index", index);
                tr.innerHTML = `
                    <td>${row.IdGarante}</td>
                    <td>${row.Descripcion}</td>
                    <td>${row.NIFCIF}</td>
                   
                    <td>
                        <a href="#" title="Editar" onclick="editRow(${index})"><i class="fas fa-pencil-alt"></i></a>
                        <a href="#" title="Excluir linha" onclick="deleterow(${index})"><i class="fas fa-trash-alt"></i></a>
                    </td>
                `;
                tbody.appendChild(tr);
            });

            // Añade o dropdown de paginación
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
                    option.text = `Página ${i}`;
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
            // Oculta a barra de loading
            loading.style.display = 'none';
        })
        .catch(error => {
            console.error(error);
        });
}

// llama la función filter para cargar la pagina
filter();


// Muestra popup de configuración
function showConfig() {
    var popup = document.getElementById("configPopup");
    popup.style.display = "block";
}

// Baja popup de configuración
function hideConfig() {
    var popup = document.getElementById("configPopup");
    popup.style.display = "none";
}

// Guardar
function GuardarConfig() {
    // Obter valores dos campos
    var IdGarante = document.getElementById("configIdGarante").value;
    var Descripcion = document.getElementById("configDescripcion").value;
    var Nifcif = document.getElementById("confignifcif").value;
    Nifcif = Nifcif === '' ? '' : Nifcif;
  


    // Chamar endpoint do servidor Python para Guardar e processar o insert
    fetch("/insert_garante", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            IdGarante: IdGarante,
            Descripcion: Descripcion,
            Nifcif: Nifcif,
            
           

        }),
    })
        .then((response) => {
            if (response.status === 200) {
                alert("Dados inseridos com sucesso!");
            } else {
                alert("Erro ao inserir os dados.");
            }
            // Esconder popup de configuração
            hideConfig();
            filter();
        })
        .catch((error) => {
            console.error(error);
            alert("Erro ao inserir os dados.");
           
            // Esconder popup de configuração
            hideConfig();
        });
}

function showEdit() {
    var popup = document.getElementById("editPopup");
    popup.style.display = "block";
}

function editRow(index) {
    // Encontrar a linha na tabela com o ID correspondente
    var row = document.querySelector(`#tableBody tr[data-index='${index}']`);

    // Verificar se a linha foi encontrada
    if (row) {
        // Obter os valores dos campos na linha
     
        var IdFamilia = row.querySelector('td:nth-child(1)').innerText;
        var Descripcion = row.querySelector('td:nth-child(2)').innerText;
        var NIFCIF = row.querySelector('td:nth-child(3)').innerText;
       

        // Preencher os campos do popup de edição com os valores da linha
        document.getElementById("editIdGarante").value = IdFamilia;
        document.getElementById("editDescripcion").value = Descripcion;
        document.getElementById("editnifcif").value = NIFCIF;
       // document.getElementById("editCodTipo").value = CodTipo;


        // Definir atributos data-old-value para armazenar valores antigos
        document.getElementById("editIdGarante").setAttribute("data-old-value", IdFamilia);
        document.getElementById("editDescripcion").setAttribute("data-old-value", Descripcion);
        document.getElementById("editnifcif").setAttribute("data-old-value", NIFCIF);
       // document.getElementById("editCodTipo").setAttribute("data-old-value", CodTipo);


        // Mostrar o popup de edição
        showEdit();
    } else {
        alert(`Linha com ID ${index} não encontrada.`);
        console.error(`Linha com ID ${index} não encontrada.`);
        return;
    }
}


// Esconder popup de edição
function hideEdit() {
    var popup = document.getElementById("editPopup");
    popup.style.display = "none";
}


function updateRow() {
    // Obter valores dos campos
    var oldIdGarante = document.getElementById("editIdGarante").getAttribute("data-old-value");
    var oldDescripcion = document.getElementById("editDescripcion").getAttribute("data-old-value");
    var oldNIFCIF = document.getElementById("editnifcif").getAttribute("data-old-value");
    var newIdGarante = document.getElementById("editIdGarante").value;
    var newDescripcion = document.getElementById("editDescripcion").value;
    var newNIFCIF = document.getElementById("editnifcif").value;

    oldNIFCIF = oldNIFCIF === '' ? ' ' : oldNIFCIF;
    newNIFCIF = newNIFCIF === '' ? ' ' : newNIFCIF;


    // Chamar endpoint do servidor Python para atualizar e processar os dados atualizados
    fetch("/update_garante", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            oldIdGarante: oldIdGarante,
            oldDescripcion: oldDescripcion,
            oldNIFCIF: oldNIFCIF,
            newIdGarante: newIdGarante,
            newDescripcion: newDescripcion,
            newNIFCIF: newNIFCIF,

        }),
    })
        .then((response) => {
            if (response.status === 200) {
                alert("Dados atualizados com sucesso!");
                filter();
            } else {
                alert("Erro ao atualizar os dados.");
            }
            // Esconder popup de edição
            hideEdit();
        });
}
function deleterow(index) {
    var row = document.querySelector(`#tableBody tr[data-index='${index}']`);
    // Obter os valores dos campos da linha
    var delIdGarante = row.querySelector('td:nth-child(1)').innerText;
    var delDescripcion = row.querySelector('td:nth-child(2)').innerText;
    var delNifCif = row.querySelector('td:nth-child(3)').innerText;
    delNifCif = delNifCif === '' ? ' ' : delNifCif;


    // Adicionar um alerta de confirmação para o usuário
    if (confirm("¿Estás seguro de que deseas eliminar esta fila?")) {
        // Chamar endpoint do servidor Python para atualizar e processar os dados
        fetch("/delete_garante", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                delIdGarante: delIdGarante,
                delDescripcion: delDescripcion,
                delNifCif: delNifCif,
              
            }),
        })
         console.log (delIdGarante,delDescripcion,delNifCif)
            .then((response) => {
                if (response.status === 200) {
                    alert("Fila borrada con éxito!");
                } else {
                    alert("Erro al borrar la fila.");
                    console.log (delIdGarante,delDescripcion,delNifCif)
                }
                // Esconder popup
                hideEdit();
                filter();
            })
            .catch((error) => {
                console.error(error);
                alert("Excepcion: Borrar Datos");
                hideEdit();
            });
    }
}

function showImportPopup() {
    document.getElementById("importPopup").style.display = "block";
  }
  
  function hideImport() {
    document.getElementById("importPopup").style.display = "none";
  }
  
  $(document).ready(function() {
    // Função para lidar com a importação de dados
    $("form#importForm").on("submit", function(e) {
      e.preventDefault();
  
      var formData = new FormData(this);
  
      $.ajax({
        url: "/carga_prestacion",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        beforeSend: function() {
          $("#loading").show();
        },
        success: function(response) {
          // Sucesso na importação dos dados
          console.log(response);
          alert('Dados importados con exito!');
          hideImport();
          // Atualizar a tabela ou realizar outras ações necessárias
        },
        error: function(xhr, status, error) {
          // Erro na importação dos dados
          console.log("Error en carga los dados: " + error);
          alert('Error al importar los datos.Consulte el log.');
          // Exibir mensagem de erro ou realizar outras ações necessárias
        },
        complete: function() {
          $("#loading").hide();
        }
      });
    });
  });
  

