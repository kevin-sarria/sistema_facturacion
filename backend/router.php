<?php

namespace MVC;

class Router {

    public array $getRoutes = [];
    public array $postRoutes = [];

    // Esta funcion toma la url y la funcion a ejecutar cuando se llame a dicha url, poniendo la url en un array el cual tendra a todas las rutas con sus respectivas funciones para procesar los datos
    public function get( $url, $fn ) {
        $this->getRoutes[$url] = $fn;
    }

    // Esta funcion toma la url y la funcion a ejecutar cuando se llame a dicha url, poniendo la url en un array el cual tendra a todas las rutas con sus respectivas funciones para procesar los datos
    public function post( $url, $fn ) {
        $this->postRoutes[$url] = $fn;
    }

    public function comprobarRutas() {

        $url_actual = $_SERVER['PATH_INFO'] ?? '/';
        $method = $_SERVER['REQUEST_METHOD'];

        if( $method === 'GET' ) {
            $fn = $this->getRoutes[$url_actual] ?? null;
        } else {
            $fn = $this->postRoutes[$url_actual] ?? null;
        }

        if( $fn ) {
            call_user_func($fn, $this);
        } else {
            return json_encode([]);
        }

    }

}

?>