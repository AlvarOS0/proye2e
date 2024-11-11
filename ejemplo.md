[ ADMIN ]
Creacion de Productos
```
POST /productos 
{
    "nombre": "nombre producto",
    "precio": 15,
    "idCategoria": 1
}
```

[ ADMIN ]
Subir imagen de un producto
POST /productos/:id/imagen
{
    "imagen": "<base64>",
    "nombre": "imagen.jpg"
}

[ ADMIN, USUARIO ]
Listar Productos (solo tomar en cuenta ACTIVO)
```
GET /productos 
{
    datos:[
        {
            "id": 1,
            "nombre": "producto 1",
            "precio": "15",
            "categoria": "Categoria"
        }
    ],
    total: 15
}
```

[ADMIN, USUARIO]
Listar Productos por Categoria
```
GET /categorias/:id/producto
{
    datos:[
        {
            "id": 1,
            "nombre": "producto 1",
            "precio": "15",
        }
    ],
    total: 15
}
```

[USUARIO]
Realizar pedido de productos
```
POST /pedidos
{
    productos:[
        {
            "idProducto": 1,
            "cantidad": 10
        },
        {
            "idProducto": 2,
            "cantidad": 5
        },
    ]
}
```

[ADMIN]
Atender un pedido (ACEPTADO, RECHAZADO)
```
PATCH /pedidos/:id
{
    estado: "ACEPTADO"
}
```




