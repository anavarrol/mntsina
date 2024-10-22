function filter(page = 1) {
    var idPrestacion = document.getElementById('idPrestacion').value;
    var CodCentro = document.getElementById('CodCentro').value;
    var tbody = document.getElementById('tableBody');
    var paginationDiv = document.getElementById('paginationDiv');
    var oldPagination = document.getElementById('pagination');
    if (oldPagination) {
        paginationDiv.removeChild(oldPagination);
    }
    // Exibe a barra de loading
    var loading = document.getElementById('loading');
    loading.style.display = 'flex';

    fetch(`/search_prestacionservicio?page=${page}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            idPrestacion: idPrestacion,
            CodCentro: CodCentro
        })
    })
        .then(response => response.json())
        .then(data => {
            // Limpa a tabela atual
            while (tbody.firstChild) {
                tbody.removeChild(tbody.firstChild);
            }


            // Adiciona as linhas com os dados do select na tabela
            data.results.forEach((row, index) => {
                var tr = document.createElement('tr');
                tr.setAttribute("data-index", index);
                //tr.setAttribute('data-id', row.idPrestacion);
                tr.innerHTML = `
              
                <td>${row.idCatalogo}</td>
                <td>${row.idPrestacion}</td>
                <td>${row.idServicio}</td>
                <td>${row.Agendable}</td>
                <td>${row.Duracion}</td>
                <td>${row.CodCentro}</td>
                <td>${row.Departamental}</td>
                <td>${row.Incremento}</td>
                <td>${row.Decremento}</td>
            
            <td><a href="#" title="Editar" onclick="editRow(${index})"><i class="fas fa-pencil-alt"></i></a>
                <a href="#" title="Excluir linha" onclick="deleterow(${index})"><i class="fas fa-trash-alt"></i></a></td>
           
        `;
                tbody.appendChild(tr);
                console.log(row); // Exibir informações de linha no console

            });

            // Adiciona o dropdown de paginação
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
            // Oculta a barra de loading
            loading.style.display = 'none';
        })
        .catch(error => {
            console.error(error);
        });
}

// Chame a função filter quando a página for carregada
filter();

// Exibir popup de configuração
function showConfig() {
    var popup = document.getElementById("configPopup");
    popup.style.display = "block";
}

// Esconder popup de configuração
function hideConfig() {
    var popup = document.getElementById("configPopup");
    popup.style.display = "none";
}

// Guardar
function GuardarConfig() {
    // Obter valores dos campos
    var Catalogo = document.getElementById("ConfigIdCatalogo").value;
    var Prestacion = document.getElementById("ConfigIdPrestacion").value;
    var IdServicio = document.getElementById("configIdServicio").value;
    var Duracion = document.getElementById("ConfigDuracion").value;
    var CodCentro = document.getElementById("ConfigCodCentro").value;
    var Departamental = document.getElementById("ConfigDepartamental").value;
    var Incremento = document.getElementById("ConfigIncremento").value;
    var Decremento = document.getElementById("ConfigDecremento").value;
    
   

    // Chamar endpoint do servidor Python para Guardar e processar o insert
    fetch("/insert_prestacionservicio", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            Catalogo: Catalogo,
            Prestacion: Prestacion,
            IdServicio: IdServicio,
            Duracion: Duracion,
            CodCentro: CodCentro,
            Departamental:Departamental,
            Incremento: Incremento,
            Decremento: Decremento,
            
           
        }),
    })
        .then((response) => {
            if (response.status === 200) {
                alert("Dados inseridos com sucesso!");
            } else {
                throw new Error("Erro ao inserir os dados. " );
            }
            // Esconder popup de configuração
            hideConfig();
            filter();
        })
        .catch((error) => {
            console.error(error);
            alert("Erro ao inserir os dados." + error.message);
          //  console.log({ "IdSubFamilia": IdSubFamilia, "Descripcion": Descripcion, "IdFamilia": IdFamilia, "Servicio": Servicio});
            // Esconder popup de configuração
            hideConfig();
            filter();
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
        var Catalogo = row.querySelector('td:nth-child(1)').innerText;
        var Prestacion = row.querySelector('td:nth-child(2)').innerText;
        var Servicio = row.querySelector('td:nth-child(3)').innerText;
        var Agendable = row.querySelector('td:nth-child(4)').innerText;
        var Duracion = row.querySelector('td:nth-child(5)').innerText;
        var Centro = row.querySelector('td:nth-child(6)').innerText;
        var Departamental = row.querySelector('td:nth-child(7)').innerText;
        var Incremento = row.querySelector('td:nth-child(8)').innerText;
        var Decremento = row.querySelector('td:nth-child(9)').innerText;
        
        
        

        // Preencher os campos do popup de edição com os valores da linha
        document.getElementById("editIdCatalogo").value = Catalogo;
        document.getElementById("editIdPrestacion").value = Prestacion;
        document.getElementById("editIdServicio").value = Servicio;
        document.getElementById("editAgendable").value = Agendable;
        document.getElementById("editDuracion").value = Duracion;
        document.getElementById("editCentro").value = Centro;
        document.getElementById("editDepartamental").value = Departamental;
        document.getElementById("editIncremento").value = Incremento;
        document.getElementById("editDecremento").value = Decremento;
        
      

        // Definir atributos data-old-value para armazenar valores antigos
        document.getElementById("editIdCatalogo").setAttribute("data-old-value", Catalogo);
        document.getElementById("editIdPrestacion").setAttribute("data-old-value", Prestacion);
        document.getElementById("editIdServicio").setAttribute("data-old-value", Servicio);
        document.getElementById("editAgendable").setAttribute("data-old-value", Agendable);
        document.getElementById("editDuracion").setAttribute("data-old-value", Duracion);
        document.getElementById("editCentro").setAttribute("data-old-value", Centro);
        document.getElementById("editDepartamental").setAttribute("data-old-value", Departamental);
        document.getElementById("editIncremento").setAttribute("data-old-value", Incremento);
        document.getElementById("editDecremento").setAttribute("data-old-value", Decremento);
        
       
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
    var oldIdCatalogo = document.getElementById("editIdCatalogo").getAttribute("data-old-value");
    var oldIdPrestacion = document.getElementById("editIdPrestacion").getAttribute("data-old-value");
    var oldIdServicio = document.getElementById("editIdServicio").getAttribute("data-old-value");
    var oldAgendable = document.getElementById("editAgendable").getAttribute("data-old-value");
    oldAgendable = oldAgendable.toLowerCase(); // converter para minúsculas
    oldAgendable = oldAgendable === "true" ? 1 : 0;
            
    var oldDuracion = document.getElementById("editDuracion").getAttribute("data-old-value");
    var oldCodCentro = document.getElementById("editCentro").getAttribute("data-old-value");
    var oldDepartamental = document.getElementById("editDepartamental").getAttribute("data-old-value");
    var oldIncremento = document.getElementById("editIncremento").getAttribute("data-old-value");
    var oldDecremento = document.getElementById("editDecremento").getAttribute("data-old-value");
 


    var newIdCatalogo = document.getElementById("editIdCatalogo").value
    var newIdPrestacion = document.getElementById("editIdPrestacion").value;
    var newIdServicio = document.getElementById("editIdServicio").value;
    var newAgendable = document.getElementById("editAgendable").value === "1" ? 1 : 0;
    
    var newDuracion = document.getElementById("editDuracion").value;
    var newCentro = document.getElementById("editCentro").value;
    var newDepartamental = document.getElementById("editDepartamental").value;
    var newIncremento = document.getElementById("editIncremento").value;
    var newDecremento = document.getElementById("editDecremento").value;
    
       

    // Chamar endpoint do servidor Python para atualizar e processar os dados atualizados
    fetch("/update_prestacionservicio", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            oldIdCatalogo: oldIdCatalogo,
            oldIdPrestacion: oldIdPrestacion,
            oldIdServicio: oldIdServicio,
            oldAgendable: oldAgendable,
            oldDuracion: oldDuracion,
            oldCodCentro: oldCodCentro,
            oldDepartamental: oldDepartamental,
            oldIncremento: oldIncremento,
            oldDecremento: oldDecremento,
            
            
            newIdCatalogo:newIdCatalogo,
            newIdPrestacion: newIdPrestacion,
            newIdServicio: newIdServicio,
            newAgendable: newAgendable,
            newDuracion: newDuracion,
            newCentro: newCentro,
            newDepartamental:newDepartamental,
            newIncremento: newIncremento,
            newDecremento: newDecremento,
            
     
        }),
    })
    .then((response) => {
        if (response.status === 200) {
            alert("Dados atualizados com sucesso!");
            hideEdit();
            filter();
        } else {
            alert("Erro ao atualizar os dados.");
        }
       })
    .catch((error) => {
        console.error(error);
    });    
}
function deleterow(index) {
    var row = document.querySelector(`#tableBody tr[data-index='${index}']`);
    // Obter os valores dos campos da linha
        var delCatalogo = row.querySelector('td:nth-child(1)').innerText;
        var delPrestacion = row.querySelector('td:nth-child(2)').innerText;
        var delServicio = row.querySelector('td:nth-child(3)').innerText;
        var delAgendable = row.querySelector('td:nth-child(4)').innerText;
        var delDuracion = row.querySelector('td:nth-child(5)').innerText;
        var delCentro = row.querySelector('td:nth-child(6)').innerText;
        var delDepartamental = row.querySelector('td:nth-child(7)').innerText
        var delIncremento = row.querySelector('td:nth-child(8)').innerText;
        var delDecremento = row.querySelector('td:nth-child(9)').innerText;
    
   

    // Adicionar um alerta de confirmação para o usuário
    if (confirm("¿Estás seguro de que deseas eliminar esta fila?")) {
        // Chamar endpoint do servidor Python para atualizar e processar os dados
        fetch("/delete_prestacionservicio", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                delCatalogo: delCatalogo,
                delPrestacion: delPrestacion,
                delServicio: delServicio,
                delAgendable: delAgendable,
                delDuracion: delDuracion,
                delCentro: delCentro,
                delDepartamental:delDepartamental,
                delIncremento: delIncremento,
                delDecremento: delDecremento,
                
                
            }),
        })
        .then((response) => {
            if (response.status === 200) {
                alert("Dados atualizados com sucesso!");
                hideEdit();
                filter();
            } else {
                alert("Erro ao atualizar os dados.");
            }
           })
        .catch((error) => {
            console.error(error);
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
    $("form#configForm").on("submit", function(e) {
      e.preventDefault();
  
      var formData = new FormData(this);
  
      $.ajax({
        url: "/carga_prestacionservicio",
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
  


