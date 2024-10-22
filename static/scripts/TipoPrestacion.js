function filter(page = 1) {
    var Codigo = document.getElementById('Codigo').value;
    var Descripcion = document.getElementById('Descripcion').value;
    var tbody = document.getElementById('tableBody');
    var paginationDiv = document.getElementById('paginationDiv');
    var oldPagination = document.getElementById('pagination');
    if (oldPagination) {
        paginationDiv.removeChild(oldPagination);
    }
    // Exibe a barra de loading
    var loading = document.getElementById('loading');
    loading.style.display = 'flex';

    fetch(`/search_tipoprestacion?page=${page}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            Codigo: Codigo,
            Descripcion: Descripcion
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
                tr.setAttribute('data-id', row.IdFamilia);
                tr.innerHTML = `
              
            <td>${row.Codigo}</td>
            <td>${row.Descripcion}</td>

           
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
function GudarConfig() {
    // Obter valores dos campos
    var Codigo = document.getElementById("configCodigo").value;
    var Descripcion = document.getElementById("configDescripcion").value;

   

    // Chamar endpoint do servidor Python para Guardar e processar o insert
    fetch("/insert_tipoprestacion", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            Codigo: Codigo,
            Descripcion: Descripcion,

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
        })
        .catch((error) => {
            console.error(error);
            alert("Erro ao inserir os dados.");
            console.log({ "Codigo": Codigo, "Descripcion": Descripcion });
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
        var Codigo = row.querySelector('td:nth-child(1)').innerText;
        var Descripcion = row.querySelector('td:nth-child(2)').innerText;

        

        // Preencher os campos do popup de edição com os valores da linha
        document.getElementById("editCodigo").value = Codigo;
        document.getElementById("editDescripcion").value = Descripcion;

        

        // Definir atributos data-old-value para armazenar valores antigos
        document.getElementById("editCodigo").setAttribute("data-old-value", Codigo);
        document.getElementById("editDescripcion").setAttribute("data-old-value", Descripcion);

       

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
    var oldCodigo = document.getElementById("editCodigo").getAttribute("data-old-value");
    var oldDescripcion = document.getElementById("editDescripcion").getAttribute("data-old-value");

   

    var newCodigo = document.getElementById("editCodigo").value;
    var newDescripcion = document.getElementById("editDescripcion").value;

  

    // Chamar endpoint do servidor Python para atualizar e processar os dados atualizados
    fetch("/update_tipoprestacion", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            oldCodigo: oldCodigo,
            oldDescripcion: oldDescripcion,
            newCodigo: newCodigo,
            newDescripcion: newDescripcion,

           
        }),
    })
        .then((response) => {
            if (response.status === 200) {
                alert("Dados atualizados com sucesso!");
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
var delCodigo = row.querySelector('td:nth-child(1)').innerText;
var delDescripcion = row.querySelector('td:nth-child(2)').innerText;



// Adicionar um alerta de confirmação para o usuário
if (confirm("¿Estás seguro de que deseas eliminar esta fila?")) {
    // Chamar endpoint do servidor Python para atualizar e processar os dados
    fetch("/delete_tipoprestacion", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            delCodigo: delCodigo,
            delDescripcion: delDescripcion,
           
        }),
    })
        .then((response) => {
            if (response.status === 200) {
                alert("Fila borrada con éxito!");
            } else {
                alert("Erro al borrar la fila.");
            }
            // Esconder popup
            hideEdit();
        });
}
}
