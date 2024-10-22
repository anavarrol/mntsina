
////Familia
function showFamilias() {
    fetch("/get_familias")
        .then((response) => response.json())
        .then((data) => {
            const familias = data.familias;

            let familiaTableBodyHTML = '';
            familias.forEach((familia) => {
                familiaTableBodyHTML += `<tr data-idfamilia="${familia.IdFamilia}" onclick="selectFamilia('${familia.IdFamilia}')" style="cursor:pointer;">
                                            <td>${familia.IdFamilia}</td>
                                            <td>${familia.Descripcion}</td>
                                            <td>${familia.CodTipo}</td>
                                         </tr>`;
            });

            const tableBody = document.getElementById("familiasTableBody");
            tableBody.innerHTML = familiaTableBodyHTML;

            const popup = document.getElementById("familiaPopup");
            popup.style.display = "block";
        });
}

function selectFamilia(IdFamilia) {
    document.getElementById("configIdFamilia").value = IdFamilia;
    document.getElementById("editIdFamilia").value = IdFamilia;
    const popup = document.getElementById("familiaPopup");
    popup.style.display = "none";
}



function hideFamilias() {
    const popup = document.getElementById("familiaPopup");
    popup.style.display = "none";
}
document.addEventListener("click", function (event) {
    const familiaPopup = document.getElementById("familiaPopup");

    if (
        event.target !== familiaPopup &&
        !familiaPopup.contains(event.target)
    ) {
        hideFamilias();
    }
});
