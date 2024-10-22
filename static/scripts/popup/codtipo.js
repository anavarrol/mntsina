
function showcodtipo() {
    fetch("/get_codtipo")
        .then((response) => response.json())
        .then((data) => {
            console.log(data); // Verificar a estrutura de dados recebida

            const codtipos = data.TipoPrestacion;

            if (codtipos && codtipos.length > 0) {
                let codtipoTableBodyHTML = '';
                codtipos.forEach((codtipo) => {
                    codtipoTableBodyHTML += `<tr data-Codigo="${codtipo.Codigo}" onclick="selectcodtipo('${codtipo.Codigo}')" style="cursor:pointer;">
                                                <td>${codtipo.Codigo}</td>
                                                <td>${codtipo.Descripcion}</td>
                                            </tr>`;
                });

                const tableBody = document.getElementById("codtipoTableBody");
                tableBody.innerHTML = codtipoTableBodyHTML;
            } else {
                console.log("No se encontraron datos en la respuesta.");
            }

            const popup = document.getElementById("codtipoPopup");
            popup.style.display = "block";
        })
        .catch((error) => {
            console.error("Error al obtener los datos:", error);
        });
}


function selectcodtipo(Codigo) {
    document.getElementById("configCodTipo").value = Codigo;
    document.getElementById("editCodTipo").value = Codigo;
    const popup = document.getElementById("codtipoPopup");
    popup.style.display = "none";
}

function hidecodtipo() {
    const popup = document.getElementById("codtipoPopup");
    popup.style.display = "none";
}

document.addEventListener("click", function (event) {
    const codtipoPopup = document.getElementById("codtipoPopup");

    if (
        event.target !== codtipoPopup &&
        !codtipoPopup.contains(event.target)
    ) {
        hidecodtipo();
    }
});
