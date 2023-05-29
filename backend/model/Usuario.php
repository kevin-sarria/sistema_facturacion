<?php

namespace  Model;

class Usuario extends ActiveRecord {

    protected static $tabla = 'usuarios';
    protected static $columnasDB = ['id', 'nombre', 'correo', 'password', 'admin', 'banned', 'user', 'token'];

    public function __construct($args = []) {
        $this->id = $args['id'] ?? null;
        $this->nombre = $args['nombre'] ?? '';
        $this->correo = $args['correo'] ?? '';
        $this->password = $args['password'] ?? '';
        $this->admin = $args['admin'] ?? 3;
        $this->banned = $args['banned'] ?? 0;
        $this->user = $args['user'] ?? 0;
        $this->token = $args['token'] ?? '';
    }

    public function validarLogin() {
        if( !$this->correo ) {
            self::$alertas['error'][] = "El correo es obligatorio";
        }
        if(!filter_var($this->correo, FILTER_VALIDATE_EMAIL)) {
            self::$alertas['error'][] = 'Email no válido';
        }
        if(!$this->password) {
            self::$alertas['error'][] = 'El Password no puede ir vacio';
        }
        return self::$alertas;
    }

    public function validarCreateSuperAdmin() {
        if( !$this->nombres ) {
            self::$alertas['error'][] = 'Los nombres son Obligatorios';
        }
        if( !$this->email ) {
            self::$alertas['error'][] = 'El email es Obligatorio';
        }
        if( !$this->password ) {
            self::$alertas['error'][] = 'El password es Obligatorio';
        }
        return self::$alertas;
    }

    // Comprobar el password
    public function comprobar_password( String $password_actual ) : bool {
        return password_verify($password_actual, $this->password );
    }

    public function hash_password(): void {
        $this->password = password_hash( $this->password, PASSWORD_BCRYPT );
    }

    public function crearToken(): void {
        $this->token = uniqid();
    }

}

?>