<?php

namespace Classes;

//Import PHPMailer classes into the global namespace
//These must be at the top of your script, not inside a function
use PHPMailer\PHPMailer\PHPMailer;

class Email
{

    public $email;
    public $nombre;
    public $token;

    public function __construct($email, $nombre, $token)
    {
        $this->email = $email;
        $this->nombre = $nombre;
        $this->token = $token;
    }

    public function registrarUsuario()
    {

        //Create an instance; passing `true` enables exceptions
        $mail = new PHPMailer(true);

        //Server settings
        $mail->isSMTP(); //Send using SMTP
        $mail->Host = $_ENV['EMAIL_HOST']; //Set the SMTP server to send through
        $mail->SMTPAuth = true; //Enable SMTP authentication
        $mail->Username = $_ENV['EMAIL_USER']; //SMTP username
        $mail->Password = $_ENV['EMAIL_PASS']; //SMTP password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; //Enable implicit TLS encryption
        $mail->Port = $_ENV['EMAIL_PORT']; //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`

        //Recipients
        $mail->setFrom($_ENV['EMAIL_USER']);
        $mail->addAddress($this->email, $this->nombre); //Add a recipient

        //Content
        $mail->isHTML(true); //Set email format to HTML
        $mail->Subject = 'Confirma tu email';

        $contenido = '<html>';
         $contenido .= "<p><strong>Hola " . $this->nombre .  "</strong> Has Registrado Correctamente tu cuenta en SarriaDev; pero es necesario confirmarla</p>";
         $contenido .= "<p>Presiona aquí: <a href='" . $_ENV['URL_FRONTEND'] . "/confirmar-cuenta?token=" . $this->token . "'>Confirmar Cuenta</a>";       
         $contenido .= "<p>Si tu no creaste esta cuenta; puedes ignorar el mensaje</p>";
         $contenido .= '</html>';

        $mail->Body = $contenido;

        $mail->send();
        return 'Hemos enviado las instrucciones para activar tu cuenta a tu correo electronico';

    }

}


?>