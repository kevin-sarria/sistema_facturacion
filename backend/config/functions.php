<?php

function pagina_actual( $path ): bool {
    return str_contains( $_SERVER['PATH_INFO'] ?? '/', $path ) ? true : false;
}

function debbuguear( $variable ): void {
    echo "<pre>";
    var_dump($variable);
    echo "</pre>";
}

function is_auth(): bool {
    if(!isset($_SESSION)) session_start();
    return isset($_SESSION['nombre']) && !empty($_SESSION);
}

?>