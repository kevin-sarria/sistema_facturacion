<?php


namespace Controllers;

use Model\Inventario;
use Classes\Tokens;
use Model\Usuario;

class DashboardController {

    public static function index() {
        
        $token = new Tokens;

        $tokenValid = $token->validarToken();


        if( !$tokenValid ) {
            echo json_encode(["type" => "error", "msg" => "Ha ocurrido un error, por favor verifica toda la información"]);
            return;
        }

        $infoToken = $token->returnInfoToken();

        $existeUsuario = Usuario::where('correo', $infoToken->email_user);

        if( $existeUsuario ) {
            $inventario = new Inventario;
            $inventario = $inventario::all();
            echo json_encode($inventario);
        }

    }

}


?>