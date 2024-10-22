///////////// Garante
function showGarante(){
    fetch("/get_garante")
        .then((response) => response.json())
        .then((data) => {
            const garante = data.garante;
            if(garante){
                let garanteTableBodyHTML = '';
                garante.array.forEach(garante => {
                    garanteTableBodyHTML += `<tr data-idgarante="${garante.IdGarante}" onclick="selectGarante('${garante.IdGarante}')" style="cursor:pointer;">
                        <td>${garante.IdGarante}</td>
                        <td>${garante.Descripcion}</td>
                        </tr>`;
                });
                const tableBody = document.getElementById("garanteTableBody");
                tableBody.innerHTML = garanteTableBodyHTML;
            }else{
                console.log("No se encontraron datos de garante en la respuesta.")
            }
            
            const popup = document.getElementById("garantePopup")
            popup.style.display = "block";
        });
}
function selectGarante(IdGarante){
    document.getElementById("configIdGarante").value = IdGarante;
    document.getElementById("editIdGarante").value = IdGarante;
    const popup = document.getElementById("garantePopup");
    popup.style.display = "none";
}

function hideGarante() {
    const popup = document.getElementById("garantePopup");
    popup.style.display = "none";
}

document.addEventListener("click", function (event) {
    const garantePopup = document.getElementById("garantePopup");

    if (
        event.target !== garantePopup &&
        !garantePopup.contains(event.target)
    ) {
        hideGarante();
    }
});