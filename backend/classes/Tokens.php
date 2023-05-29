<?php

namespace Classes;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Model\Usuario;
use PhpOption\Tests\SomeArrayObject;

class Tokens
{

    public $id_user;
    public $name_user;
    public $email_user;
    public $isAdmin_user;

    public function __construct($args = [])
    {
        $this->id_user = $args['id_user'] ?? '';
        $this->name_user = $args['name_user'] ?? '';
        $this->email_user = $args['email_user'] ?? '';
        $this->isAdmin_user = $args['isAdmin_user'] ?? 0;
    }

    public function crearToken()
    {
        $key = $_ENV['SECRET_PASS'];
        $now = strtotime('now');

        if (!$this->id_user || !$this->email_user ) {
            echo json_encode(["Error" => "Ha ocurrido un error inesperado, ponte en contacto con el soporte tecnico."]);
            return false;
        }

        $payload = [
            'iat' => $now,
            'exp' => $now + 3600,
            'id_user' => $this->id_user,
            'name_user' => $this->name_user,
            'email_user' => $this->email_user,
            'isAdmin_user' => $this->isAdmin_user
        ];

        $jwt = JWT::encode($payload, $key, 'HS256');

        return $jwt;

    }

    public function validarToken()
    {

        $jwt = self::returnJWT();
        $key = $_ENV['SECRET_PASS'];

        try {
            JWT::decode($jwt, new Key($key, 'HS256'));
            return true;
        } catch (\Throwable $th) {
            return false;
        }


    }

    public static function reValidarToken()
    {

        $jwt = self::returnJWT();
        $key = $_ENV['SECRET_PASS'];

        $jwtDecode = JWT::decode($jwt, new Key($key, 'HS256'));
        $jwtDecode = (array) $jwtDecode;

        $id_user = $jwtDecode['id_user'] ?? '';
        $name_user = $jwtDecode['name_user'] ?? '';
        $email_user = $jwtDecode['email_user'] ?? '';
        $isAdmin_user = $jwtDecode['isAdmin_user'] ?? '';
        

        if ( $id_user === '' || $name_user === '' || $email_user === '' || $isAdmin_user === '' ) {
            echo json_encode(["Error" => "Datos no validos, por favor contacta con el soporte."]);
            return;
        }

        if (!$jwt) {
            echo json_encode(["Error" => "Token no Válido"], JSON_UNESCAPED_UNICODE);
            return;
        };

        $usuario = new Usuario;
        $existeUsuario = $usuario->where('correo', $email_user);

        if( $existeUsuario->correo === $email_user ) {
            JWT::decode($jwt, new Key($key, 'HS256'));
                $newToken = new Tokens($id_user, $name_user, $email_user, $isAdmin_user);
                $token = $newToken->crearToken();
                echo json_encode(["newToken" => $token]);
                return;
        } else {
            echo json_encode(["Error" => "Usuario no válido"], JSON_UNESCAPED_UNICODE);
            return;
        }

    }

    public static function returnJWT(): string {

        $jwt = apache_request_headers();
        $jwt = explode('Bearer ', $jwt['Authorization'] ?? '') ?? '';
        $jwt = $jwt[1] ?? null;

        if (!$jwt) {
            return json_encode([ "type" => "error", "msg" => "Token no Válido"], JSON_UNESCAPED_UNICODE);
        };

        return $jwt;

    }

    public function returnInfoToken(): ?Object {

        $key = $_ENV['SECRET_PASS'];

        $jwt = self::returnJWT() ?? null;

        if(!$jwt) {
            echo json_encode([ "type" => "error", "msg" => "Token No Valido" ]);
            return null;
        }

        $info = JWT::decode($jwt, new Key($key, 'HS256'));

        return $info;

    }

}

?>