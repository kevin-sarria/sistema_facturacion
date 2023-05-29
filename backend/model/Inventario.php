<?php

namespace Model;

class Inventario extends ActiveRecord {

    protected static $tabla = 'inventario';

    protected static $columnasDB = [ 'id', 'nombre_producto', 'cantidad', 'id_valor_medida', 'precio_compra', 'porcentaje_ganancia' ];

    public function __construct( $args = [] ) {
        $this->id = $args['id'] ?? null;
        $this->nombre_producto = $args['nombre_producto'] ?? '';
        $this->cantidad = $args['cantidad'] ?? 0;
        $this->id_valor_medida = $args['id_valor_medida'] ?? 0;
        $this->precio_compra = $args['precio_compra'] ?? 0;
        $this->porcentaje_ganancia = $args['porcentaje_ganancia'] ?? 0;
    }



}

?>