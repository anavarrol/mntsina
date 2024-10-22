
/////////Subfamilia
function showSubFamilias() {
    const idFamilia = document.getElementById("configIdFamilia").value;
    // IdFamilia es la PK de la tabla Familia y la FK de Subfamilia, no puedes seleccionar una subfamilia sin establecer una familia primero
    fetch(`/get_subfamilias/${idFamilia}`)

        .then((response) => response.json())
    
        .then((data) => {
            const subfamilias = data.subfamilias;

            let subfamiliaTableBodyHTML = '';
            subfamilias.forEach((subfamilia) => {
                subfamiliaTableBodyHTML += `<tr data-idsubfamilia="${subfamilia.IdSubFamilia}" onclick="selectSubFamilia('${subfamilia.IdSubFamilia}')" style="cursor:pointer;">
                            <td>${subfamilia.IdSubFamilia}</td>
                            <td>${subfamilia.Descripcion}</td>
                            <td>${subfamilia.IdFamilia}</td>
                            <td>${subfamilia.CodTipo}</td>
                         </tr>`;


            });

            const tableBody = document.getElementById("subfamiliasTableBody");
            tableBody.innerHTML = subfamiliaTableBodyHTML;

            const popup = document.getElementById("SubfamiliaPopup");
            popup.style.display = "block";
        });
}

function selectSubFamilia(IdSubFamilia) {
    document.getElementById("configIdSubFamilia").value = IdSubFamilia;
    document.getElementById("editIdSubFamilia").value = IdSubFamilia;
    const popup = document.getElementById("SubfamiliaPopup");
    popup.style.display = "none";
}



function hideSubFamilias() {
    const popup = document.getElementById("SubfamiliaPopup");
    popup.style.display = "none";
}

document.addEventListener("click", function (event) {
    const SubfamiliaPopup = document.getElementById("SubfamiliaPopup");

    if (
        event.target !== SubfamiliaPopup &&
        !SubfamiliaPopup.contains(event.target)
    ) {
        hideSubFamilias();
    }
});

