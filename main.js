
// FUNCION AGREGAR AL CARRITO 
// ---------------------------------------------------------------------------
function agregarAlCarrito(nombre, precio) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.push({ nombre, precio });
    localStorage.setItem('carrito', JSON.stringify(carrito));

    // Incrementa el contador
    let contador = parseInt(document.getElementById('contador').textContent) || 0;
    contador++;
    document.getElementById('contador').textContent = contador;

    Swal.fire({
        title: 'Producto Agregado',
        text: `El producto "${nombre}" se agregó al carrito`,
        icon: 'success',
        timer: 2000
    });

    mostrarCarrito();
}

// FUNCION MOSTRAR CARRITO 
// ---------------------------------------------------------------------------
function mostrarCarrito() {
    fetch("productos.json")
        .then((response) => response.json())
        .then((data) => {
            let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
            let listaCarrito = document.getElementById('lista-carrito');

            listaCarrito.innerHTML = '';
            carrito.forEach((producto, index) => {
                let li = document.createElement('li');
                li.textContent = `${producto.nombre} - $${producto.precio}`;
                
                // Botón para borrar el producto del carrito
                let botonBorrar = document.createElement('button');
                botonBorrar.textContent = 'Borrar';
                botonBorrar.addEventListener('click', () => {
                    borrarProducto(index);
                });
                li.appendChild(botonBorrar);
                
                listaCarrito.appendChild(li);
            });
        })
        .catch((error) => {
            console.error("Error al cargar productos: " + error);
        });
}

// FUNCION BORRAR PRODUCTO 
// ---------------------------------------------------------------------------
function borrarProducto(index) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    if (carrito.length > 0) {
        // Mostrar un mensaje de confirmación al usuario
        Swal.fire({
            title: '¿Estás seguro de borrar este producto?',
            text: `El producto "${carrito[index].nombre}" se eliminará del carrito`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, borrar',
            cancelButtonText: 'No, cancelar'
        }).then((result) => {
            // Si el usuario confirma, borrar el producto
            if (result.isConfirmed) {
                // Usar el método splice para eliminar el producto del arreglo carrito
                carrito.splice(index, 1);
                // Guardar el nuevo arreglo en el localStorage
                localStorage.setItem('carrito', JSON.stringify(carrito));
                // Mostrar un mensaje de éxito al usuario
                Swal.fire({
                    title: 'Producto Borrado',
                    text: 'El producto se eliminó del carrito correctamente',
                    icon: 'success',
                    timer: 2000
                });
                // Actualizar la lista del carrito
                mostrarCarrito();
            }
        });
    }
}


// FUNCION CALCULAR TOTAL
// ---------------------------------------------------------------------------

function calcularTotal(carrito) {
    return carrito.reduce((total, producto) => total + producto.precio, 0);
}


// FUNCION COMPLETAR COMPRA
// ---------------------------------------------------------------------------
function completarCompra() {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    if (carrito.length > 0) {
        let total = calcularTotal(carrito);

        let listaProductos = carrito.map(producto => `${producto.nombre} - $${producto.precio}`).join('\n');

        let mensaje = `Productos en el carrito:\n${listaProductos}\n\nTotal de la compra: $${total.toFixed(2)}`;

        Swal.fire({
            title: '¿Estás seguro de completar la compra?',
            text: mensaje,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, Completar Compra',
            cancelButtonText: 'Cancelar',
            html: `<pre>${mensaje}</pre>`
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('carrito');
                mostrarCarrito();

                Swal.fire('Compra Completada', `¡Gracias por su compra!\nTotal: $${total.toFixed(2)}`, 'success');
            }
        });
    } else {
        Swal.fire({
            title: 'Carrito Vacío',
            text: 'No hay productos en el carrito para completar la compra.',
            icon: 'info'
        });
    }
}

document.addEventListener('DOMContentLoaded', mostrarCarrito);


