// ========================================================
// HISTORIAS
// ========================================================
const historias = {
    huajuapan: "Huajuapan de León es el corazón económico y cultural de la Mixteca oaxaqueña.",
    tlaxiaco: "Tlaxiaco, la Ciudad de las Nubes, destaca por su cultura y paisajes.",
    nochixtlan: "Nochixtlán es un punto estratégico con gran legado histórico."
};

// ========================================================
// HISTORIA TOGGLE
// ========================================================
window.toggleHistoria = function () {
    const contenido = document.getElementById("historia-contenido");
    const icono = document.getElementById("icono-toggle");

    if (!contenido) return;

    contenido.classList.toggle("abierto");

    if (icono) {
        icono.textContent = contenido.classList.contains("abierto") ? "-" : "+";
    }
};

// ========================================================
// GENERAR ID LIMPIO
// ========================================================
function generarId(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "-");
}

// ========================================================
// RENDER HOTELES
// ========================================================
function renderizar(lista) {
    const contenedor = document.getElementById("contenedor-hoteles");
    if (!contenedor) return;

    contenedor.innerHTML = "";

    const ciudad = new URLSearchParams(window.location.search).get("ciudad");

    lista.forEach(hotel => {

        const id = generarId(hotel.nombre);

        const card = document.createElement("div");
        card.className = "hotel-card";

        card.onclick = () => {
            window.location.href = `detalle.html?id=${id}&ciudad=${ciudad}`;
        };

        const img = hotel.img ? hotel.img : "assets/default.jpg";

        card.innerHTML = `
            <img src="${img}" alt="${hotel.nombre}">
            <div class="hotel-info">
                <h3>${hotel.nombre}</h3>
                <p>${hotel.descripcion ? hotel.descripcion.substring(0, 90) : ""}...</p>
                <div class="btn-detalles">Ver más</div>
            </div>
        `;

        contenedor.appendChild(card);
    });
}

// ========================================================
// FILTROS
// ========================================================
window.filtrarHoteles = function (servicio) {

    const ciudad = new URLSearchParams(window.location.search).get("ciudad");

    if (!listaHoteles || !listaHoteles[ciudad]) return;

    let data = listaHoteles[ciudad];

    if (servicio !== "todos") {
        data = data.filter(h => h.servicios?.includes(servicio));
    }

    renderizar(data);
};

// ========================================================
// INICIO
// ========================================================
document.addEventListener("DOMContentLoaded", () => {

    const url = new URLSearchParams(window.location.search);
    const ciudad = url.get("ciudad");

    // ================= DESTINO =================
    const contenedor = document.getElementById("contenedor-hoteles");

    if (contenedor && ciudad) {

        const titulo = document.getElementById("titulo-ciudad");

        if (titulo) {
            titulo.textContent = ciudad.toUpperCase();
        }

        const textoHistoria = document.getElementById("texto-historia");

        if (textoHistoria && historias[ciudad]) {
            textoHistoria.textContent = historias[ciudad];
        }

        if (listaHoteles?.[ciudad]) {
            renderizar(listaHoteles[ciudad]);
        }
    }

    // ================= DETALLE =================
    const detalleTitulo = document.getElementById("detalle-titulo");

    if (detalleTitulo) {

        const id = url.get("id");

        const ciudadActual = url.get("ciudad");

        if (!listaHoteles?.[ciudadActual]) return;

        const hotel = listaHoteles[ciudadActual].find(h => generarId(h.nombre) === id);

        if (!hotel) {
            detalleTitulo.textContent = "Hotel no encontrado";
            return;
        }

        // imagen
        const img = document.getElementById("detalle-img-principal");
        if (img) img.src = hotel.img || "assets/default.jpg";

        // textos
        detalleTitulo.textContent = hotel.nombre;
        document.getElementById("detalle-descripcion").textContent = hotel.descripcion || "";
        document.getElementById("detalle-info-extra").textContent = hotel.infoExtra || "";
        document.getElementById("detalle-precio").textContent = hotel.costo || "";
        document.getElementById("detalle-ubicacion-txt").textContent = hotel.direccion || "";

        // estrellas
        const estrellas = document.getElementById("detalle-estrellas");
        if (estrellas) {
            estrellas.textContent = "⭐".repeat(Math.round(hotel.estrellas || 0));
        }

        // servicios
        const servicios = document.getElementById("detalle-servicios-lista");
        if (servicios) {
            servicios.innerHTML = (hotel.servicios || [])
                .map(s => `<div class="servicio-item">${s}</div>`)
                .join("");
        }

        // whatsapp
        const btn = document.getElementById("btn-whatsapp-reserva");

        if (btn) {
            if (hotel.whatsapp) {
                btn.href = hotel.whatsapp;
            } else {
                btn.style.display = "none";
            }
        }
    }
});