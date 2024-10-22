
////////////////////////////////////////////////////////////////// Catalogo
function showcatalogo() {
    fetch("/get_catalogo")
        .then((response) => response.json())
        .then((data) => {
            const catalogo = data.catalogo;

            let catalogoTableBodyHTML = '';
            catalogo.forEach((catalogo) => {
                catalogoTableBodyHTML += `<tr data-idcatalogo="${catalogo.IdCatalogo}" onclick="selectCatalogo('${catalogo.IdCatalogo}')" style="cursor:pointer;">
                                            <td>${catalogo.IdCatalogo}</td>
                                            <td>${catalogo.Descripcion}</td>
                                            
                                         </tr>`;
            });

            const tableBody = document.getElementById("catalogoTableBody");
            tableBody.innerHTML = catalogoTableBodyHTML;

            const popup = document.getElementById("catalogoPopup");
            popup.style.display = "block";
        });
}

function selectCatalogo(IdCatalogo) {
    document.getElementById("ConfigIdCatalogo").value = IdCatalogo;
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

////////////////////////////////////////////////////////////////// Prestacion
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

////////////////////////////////////////////////////////////////// Servicio
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
    document.getElementById("configServicio").value = IdServicio;
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

////////////////////////////////////////////////////////////////// Subfamilia
function showSubFamilias() {
    const idFamilia = document.getElementById("configIdFamilia").value;

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

////////////////////////////////////////////////////////////////// Familia
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

////////////////////////////////////////////////////////////////// Cod_tipo
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

////////////////////////////////////////////////////////////////// Garantes
function showGarante() {
    fetch("/get_garante")
        .then((response) => response.json())
        .then((data) => {
            console.log(data); // Verificar a estrutura de dados recebida

            const garante = data.garante;

            if (garante && garante.length > 0) {
                let garanteTableBodyHTML = '';
                garante.forEach((garante) => {
                    garanteTableBodyHTML += `<tr data-idgarante="${garante.IdGarante}" onclick="selectGarante('${garante.IdGarante}')" style="cursor:pointer;">
                        <td>${garante.IdGarante}</td>
                        <td>${garante.Descripcion}</td>
                        </tr>`;
                });

                const tableBody = document.getElementById("garanteTableBody");
                tableBody.innerHTML = garanteTableBodyHTML;
            } else {
                console.log("No se encontraron datos en la respuesta.");
            }

            const popup = document.getElementById("garantePopup");
            popup.style.display = "block";
        })
        .catch((error) => {
            console.error("Error al obtener los datos:", error);
        });
}

function selectgarante(IdGarante) {
    document.getElementById("configIdGarante").value = IdGarante;
    const popup = document.getElementById("garantePopup");
    popup.style.display = "none";
}

function hidegarante() {
    const popup = document.getElementById("garantePopup");
    popup.style.display = "none";
}

document.addEventListener("click", function (event) {
    const garantePopup = document.getElementById("garantePopup");

    if (
        event.target !== garantePopup &&
        !garantePopup.contains(event.target)
    ) {
        hidegarante();
    }
});







