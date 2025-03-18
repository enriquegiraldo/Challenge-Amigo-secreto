// Array para almacenar los nombres de los amigos
let amigos = [];

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Cargar amigos guardados en localStorage
    cargarAmigos();
    
    // Configurar eventos
    document.getElementById("btnAgregar").addEventListener("click", agregarAmigo);
    document.getElementById("amigo").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            agregarAmigo();
        }
    });
    document.getElementById("btnSorteoSimple").addEventListener("click", sortearAmigo);
    document.getElementById("btnSorteoCompleto").addEventListener("click", sortearAmigoCompleto);
    document.getElementById("btnLimpiar").addEventListener("click", limpiarLista);
});

/**
 * Agrega un nuevo amigo al array de amigos.
 * Valida que el nombre no esté vacío y no exista ya en la lista.
 */
function agregarAmigo() {
    let nombreAmigo = document.getElementById("amigo").value.trim();

    if (nombreAmigo === "") {
        mostrarNotificacion("Por favor, inserte un nombre", "error");
    } else if (amigos.includes(nombreAmigo)) {
        mostrarNotificacion("Este nombre ya está en la lista", "error");
    } else {
        amigos.push(nombreAmigo);
        document.getElementById("amigo").value = "";
        mostrarListaAmigo();
        guardarAmigos();
        mostrarNotificacion(`${nombreAmigo} añadido a la lista`, "success");
    }
}

/**
 * Actualiza la visualización de la lista de amigos en el DOM.
 */
function mostrarListaAmigo() {
    let listaAmigos = document.getElementById("listaAmigos");
    listaAmigos.innerHTML = "";

    for (let index = 0; index < amigos.length; index++) {
        const element = amigos[index];

        let listaHTML = document.createElement("li");
        listaHTML.textContent = element;
        
        // Agregar botón eliminar
        let btnEliminar = document.createElement("button");
        btnEliminar.textContent = "X";
        btnEliminar.classList.add("btn-eliminar");
        btnEliminar.onclick = function() {
            eliminarAmigo(index);
        };
        
        listaHTML.appendChild(btnEliminar);
        listaAmigos.appendChild(listaHTML);
    }

    // Actualizar visibilidad de la lista
    if (amigos.length === 0) {
        listaAmigos.style.display = "none";
    } else {
        listaAmigos.style.display = "block";
    }
}

/**
 * Elimina un amigo de la lista según su índice.
 * @param {number} index - Índice del amigo a eliminar.
 */
function eliminarAmigo(index) {
    const nombreEliminado = amigos[index];
    amigos.splice(index, 1);
    mostrarListaAmigo();
    guardarAmigos();
    mostrarNotificacion(`${nombreEliminado} ha sido eliminado`, "success");
}

/**
 * Sortea y muestra un amigo de la lista de manera aleatoria.
 */
function sortearAmigo() {
    let cantidadAmigos = amigos.length;
    if (cantidadAmigos === 0) {
        mostrarNotificacion("Por favor, inserte al menos un nombre antes de sortear", "error");
    } else {
        let indiceAmigo = Math.floor(Math.random() * cantidadAmigos);
        let resultadoHTML = document.getElementById("resultado");
        resultadoHTML.innerHTML = "";
        
        let listItem = document.createElement("li");
        listItem.textContent = `¡${amigos[indiceAmigo]} ha sido sorteado!`;
        resultadoHTML.appendChild(listItem);
        
        // Efecto de desplazamiento suave
        resultadoHTML.scrollIntoView({ behavior: 'smooth' });
    }
}

/**
 * Realiza un sorteo completo de amigo secreto, asignando a cada persona otra persona.
 */
function sortearAmigoCompleto() {
    if (amigos.length < 2) {
        mostrarNotificacion("Se necesitan al menos 2 personas para el sorteo completo", "error");
        return;
    }
    
    let resultadoHTML = document.getElementById("resultado");
    resultadoHTML.innerHTML = "";
    
    // Crear copia del array para barajar
    let amigosBarajados = [...amigos];
    
    // Algoritmo Fisher-Yates para barajar
    for (let i = amigosBarajados.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [amigosBarajados[i], amigosBarajados[j]] = [amigosBarajados[j], amigosBarajados[i]];
    }
    
    // Asegurarse de que nadie se regale a sí mismo
    let valido = true;
    for (let i = 0; i < amigos.length; i++) {
        if (amigos[i] === amigosBarajados[i]) {
            valido = false;
            break;
        }
    }
    
    // Si no es válido, volver a intentar
    if (!valido) {
        sortearAmigoCompleto();
        return;
    }
    
    // Asignar amigos secretos con delay para animación
    for (let i = 0; i < amigos.length; i++) {
        setTimeout(() => {
            let listItem = document.createElement("li");
            listItem.textContent = `${amigos[i]} le regala a ${amigosBarajados[i]}`;
            resultadoHTML.appendChild(listItem);
            
            // Scroll automático
            listItem.scrollIntoView({ behavior: 'smooth' });
        }, i * 500);
    }
    
    // Título del resultado
    let titulo = document.createElement("li");
    titulo.textContent = "Resultado del sorteo:";
    titulo.style.fontWeight = "bold";
    titulo.style.backgroundColor = "#4B69FD";
    resultadoHTML.appendChild(titulo);
}

/**
 * Limpia la lista de amigos.
 */
function limpiarLista() {
    if (amigos.length === 0) {
        mostrarNotificacion("La lista ya está vacía", "info");
        return;
    }
    
    if (confirm("¿Estás seguro de que quieres eliminar todos los nombres?")) {
        amigos = [];
        mostrarListaAmigo();
        document.getElementById("resultado").innerHTML = "";
        guardarAmigos();
        mostrarNotificacion("Lista eliminada correctamente", "success");
    }
}

/**
 * Guarda la lista de amigos en localStorage.
 */
function guardarAmigos() {
    localStorage.setItem('amigosSecretos', JSON.stringify(amigos));
}

/**
 * Carga la lista de amigos desde localStorage.
 */
function cargarAmigos() {
    const amigosGuardados = localStorage.getItem('amigosSecretos');
    if (amigosGuardados) {
        amigos = JSON.parse(amigosGuardados);
        mostrarListaAmigo();
    }
}

/**
 * Muestra una notificación temporal.
 * @param {string} mensaje - Mensaje a mostrar.
 * @param {string} tipo - Tipo de notificación (success, error, info).
 */
function mostrarNotificacion(mensaje, tipo) {
    // Crear elemento de notificación
    const notificacion = document.createElement("div");
    notificacion.className = "notification";
    notificacion.textContent = mensaje;
    
    // Establecer color según el tipo
    switch (tipo) {
        case "error":
            notificacion.style.backgroundColor = "var(--color-red)";
            break;
        case "success":
            notificacion.style.backgroundColor = "var(--color-green)";
            break;
        case "info":
            notificacion.style.backgroundColor = "var(--color-primary)";
            break;
    }
    
    // Añadir al DOM
    document.body.appendChild(notificacion);
    
    // Eliminar después de 3 segundos
    setTimeout(() => {
        notificacion.remove();
    }, 3000);
}