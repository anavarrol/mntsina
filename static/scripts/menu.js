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

    function saveConfig() {
        // Obter valores dos campos
        var server = document.getElementById("server").value;
        var database = document.getElementById("database").value;
        var username = document.getElementById("username").value;
        var password = document.getElementById("password").value;
    
        // Chamar endpoint do servidor Python para salvar configurações
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/save_config", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
    
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                // Se a resposta for bem-sucedida, reinicie a aplicação
                restartApp();
                hideConfig();
            }
        };
    
        xhr.send(JSON.stringify({"server": server, "database": database, "username": username, "password": password}));
    }
    
    function restartApp() {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/restart", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
    
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 500) {
                location.reload();
            }
        };
    
        xhr.send();
    }

    // Testar conexão
    function testConnection() {
        // Obter valores dos campos
         var server = document.getElementById("server").value;
         var database = document.getElementById("database").value;
         var username = document.getElementById("username").value;
         var password = document.getElementById("password").value;

    // Enviar solicitação ao servidor Python para testar conexão
    fetch('/test_connection', {
        method: 'POST',
        headers: {
         'Content-Type': 'application/json'
        },
        body: JSON.stringify({
      server: server,
      database: database,
      username: username,
      password: password
        })
    })
    .then(response => {
     if (response.ok) {
      // Conexão bem-sucedida
       alert('Conexión realizada con éxito!');
        } else {
         // Conexão falhou
         alert('No es posible conectar al servidor.');
     }
    })
    .catch(error => {
     // Erro ao enviar a solicitação
        alert('Error al intentar conectar al servidor.');
    });
    }


    function setActiveLink(event) {
     // remover classe 'active' de todos os links
     var links = document.querySelectorAll("nav ul li a");
     for (var i = 0; i < links.length; i++) {
     links[i].classList.remove("active");
    }

     // adicionar classe 'active' ao link clicado
     event.target.classList.add("active");
    }

    var links = document.querySelectorAll("nav ul li a");
    for (var i = 0; i < links.length; i++) {
    links[i].addEventListener("click", setActiveLink);
    }

    document.getElementById("prestacaoLink").addEventListener("click", function() {
    fetch("/prestacao", {  
        method: 'GET'  
    }).then(function(response) {
        return response.text();
    }).then(function(html) {
        document.open();
        document.write(html);
        document.close();
    });
});

document.getElementById("familiaLink").addEventListener("click", function() {
    fetch("/familia", {  
        method: 'GET'  
    }).then(function(response) {
        return response.text();
    }).then(function(html) {
        document.open();
        document.write(html);
        document.close();
    });
});
document.getElementById("subfamiliaLink").addEventListener("click", function() {
    fetch("/subfamilia", {  
        method: 'GET'  
    }).then(function(response) {
        return response.text();
    }).then(function(html) {
        document.open();
        document.write(html);
        document.close();
    });
});
document.getElementById("tipoprestacionLink").addEventListener("click", function() {
    fetch("/tipoprestacion", {  
        method: 'GET'  
    }).then(function(response) {
        return response.text();
    }).then(function(html) {
        document.open();
        document.write(html);
        document.close();
    });
});
document.getElementById("origenprestacionLink").addEventListener("click", function() {
    fetch("/origenprestacion", {  
        method: 'GET'  
    }).then(function(response) {
        return response.text();
    }).then(function(html) {
        document.open();
        document.write(html);
        document.close();
    });
});


document.getElementById("prestacionservicioLink").addEventListener("click", function() {
    fetch("/prestacionservicio", {  
        method: 'GET'  
    }).then(function(response) {
        return response.text();
    }).then(function(html) {
        document.open();
        document.write(html);
        document.close();
    });
});


document.getElementById("garantesLink").addEventListener("click", function() {
    fetch("/garante", {  
        method: 'GET'  
    }).then(function(response) {
        return response.text();
    }).then(function(html) {
        document.open();
        document.write(html);
        document.close();
    });
});

document.getElementById("contratoLink").addEventListener("click", function() {
    fetch("/Contrato", {  
        method: 'GET'  
    }).then(function(response) {
        return response.text();
    }).then(function(html) {
        document.open();
        document.write(html);
        document.close();
    });
});

document.getElementById("lotesLink").addEventListener("click", function() {
    fetch("/lotes", {  
        method: 'GET'  
    }).then(function(response) {
        return response.text();
    }).then(function(html) {
        document.open();
        document.write(html);
        document.close();
    });
});