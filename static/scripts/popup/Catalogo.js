
/////// Catalogo
function showcatalogo() {
    fetch("/get_catalogo")
        .then((response) => response.json())
        .then((data) => {
            const catalogo = data.catalogo;
            if(catalogo){

            let catalogoTableBodyHTML = '';
            catalogo.forEach((catalogo) => {
                catalogoTableBodyHTML += `<tr data-idcatalogo="${catalogo.IdCatalogo}" onclick="selectCatalogo('${catalogo.IdCatalogo}')" style="cursor:pointer;">
                                            <td>${catalogo.IdCatalogo}</td>
                                            <td>${catalogo.Descripcion}</td>
                                            
                                         </tr>`;
            });

            const tableBody = document.getElementById("catalogoTableBody");
            tableBody.innerHTML = catalogoTableBodyHTML;
        }else{
            console.log("No se encontraron datos de prestacion en la respuesta.");
        }

            const popup = document.getElementById("catalogoPopup");
            popup.style.display = "block";
        });
}

function selectCatalogo(IdCatalogo) {
    document.getElementById("ConfigIdCatalogo").value = IdCatalogo;
    document.getElementById("editIdCatalogo").value = IdCatalogo;
    const popup = document.getElementById("catalogoPopup");
    popup.style.display = "none";
}

function hideCatalogo() {
    const popup = document.getElementById("catalogoPopup");
    popup.style.display = "none";
}

document.addEventListener("click", function (event) {
    const catalogoPopup = document.getElementById("catalogoPopup");

    if (
        event.target !== catalogoPopup &&
        !catalogoPopup.contains(event.target)
    ) {
        hideCatalogo();
    }
});