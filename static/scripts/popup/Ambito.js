
/////// Ambito
function showambito() {
    fetch("/get_ambito")
        .then((response) => response.json())
        .then((data) => {
            const ambito = data.Ambito;

            let ambitoTableBodyHTML = '';
            ambito.forEach((ambito) => {
                ambitoTableBodyHTML += `<tr data-Idambito="${ambito.IdAmbito}" onclick="selectambito('${ambito.IdAmbito}')" style="cursor:pointer;">
                                            <td>${ambito.IdAmbito}</td>
                                            <td>${ambito.Descripcion}</td>
                                            
                                         </tr>`;
            });

            const tableBody = document.getElementById("ambitoTableBody");
            tableBody.innerHTML = ambitoTableBodyHTML;

            const popup = document.getElementById("ambitoPopup");
            popup.style.display = "block";
        });
}

function selectambito(IdAmbito) {
    document.getElementById("configIdAmbito").value = IdAmbito;
    document.getElementById("editIdAmbito").value = IdAmbito;
    const popup = document.getElementById("ambitoPopup");
    popup.style.display = "none";
}

function hideambito() {
    const popup = document.getElementById("ambitoPopup");
    popup.style.display = "none";
}

document.addEventListener("click", function (event) {
    const ambitoPopup = document.getElementById("ambitoPopup");

    if (
        event.target !== ambitoPopup &&
        !ambitoPopup.contains(event.target)
    ) {
        hideambito();
    }
});