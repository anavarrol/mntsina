
/////Servicio
function showservicio() {
    fetch("/get_servicio")
        .then((response) => response.json())
        .then((data) => {
            console.log(data); // Verificar la estructura de los datos recibidos
            const servicio = data.Servicio;

            if (servicio) {
                let ServicioTableBodyHTML = '';
                servicio.forEach((servicio) => {
                    ServicioTableBodyHTML += `<tr data-IdServicio="${servicio.IdServicio}" onclick="selectServicio('${servicio.IdServicio}')" style="cursor:pointer;">
                                                <td>${servicio.IdServicio}</td>
                                                <td>${servicio.Descripcion}</td>
                                                </tr>`;
                });

                const tableBody = document.getElementById("servicioTableBody");
                tableBody.innerHTML = ServicioTableBodyHTML;
            } else {
                console.log("No se encontraron datos de prestacion en la respuesta.");
            }

            const popup = document.getElementById("servicioPopup");
            popup.style.display = "block";
        })
        .catch((error) => {
            console.error("Error al obtener los datos:", error);
        });
}



function selectServicio(IdServicio) {
    document.getElementById("configIdServicio").value = IdServicio;
    document.getElementById("editIdServicio").value = IdServicio;
    const popup = document.getElementById("servicioPopup");
    popup.style.display = "none";
}



function hideservicio() {
    const popup = document.getElementById("servicioPopup");
    popup.style.display = "none";
}

document.addEventListener("click", function (event) {
    const servicioPopup = document.getElementById("servicioPopup");

    if (
        event.target !== servicioPopup &&
        !servicioPopup.contains(event.target)
    ) {
        hideservicio();
    }
});
