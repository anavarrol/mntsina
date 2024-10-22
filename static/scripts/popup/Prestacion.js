
function showprestacion() {
    fetch("/get_prestacion")
        .then((response) => response.json())
        .then((data) => {
            console.log(data); // Verificar la estructura de los datos recibidos
            const prestacion = data.Prestacion;

            if (prestacion) {
                let PrestacionTableBodyHTML = '';
                prestacion.forEach((prestacion) => {
                    PrestacionTableBodyHTML += `<tr data-idPrestacion="${prestacion.IdPrestacion}" onclick="selectPrestacion('${prestacion.IdPrestacion}')" style="cursor:pointer;">
                                                <td>${prestacion.IdPrestacion}</td>
                                                <td>${prestacion.Descripcion}</td>
                                                </tr>`;
                });

                const tableBody = document.getElementById("prestacionTableBody");
                tableBody.innerHTML = PrestacionTableBodyHTML;
            } else {
                console.log("No se encontraron datos de prestacion en la respuesta.");
            }

            const popup = document.getElementById("prestacionPopup");
            popup.style.display = "block";
        })
        .catch((error) => {
            console.error("Error al obtener los datos de prestacion:", error);
        });
}



function selectPrestacion(IdPrestacion) {
    document.getElementById("ConfigIdPrestacion").value = IdPrestacion;
    document.getElementById("editIdPrestacion").value = IdPrestacion;
    const popup = document.getElementById("prestacionPopup");
    popup.style.display = "none";
}



function hidePrestacion() {
    const popup = document.getElementById("prestacionPopup");
    popup.style.display = "none";
}

document.addEventListener("click", function (event) {
    const prestacionPopup = document.getElementById("prestacionPopup");

    if (
        event.target !== prestacionPopup &&
        !prestacionPopup.contains(event.target)
    ) {
        hidePrestacion();
    }
});

