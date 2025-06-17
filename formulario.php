<?php
require __DIR__ . '/vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/vendor/phpmailer/phpmailer/src/PHPMailer.php';
require __DIR__ . '/vendor/phpmailer/phpmailer/src/Exception.php';
require __DIR__ . '/vendor/phpmailer/phpmailer/src/SMTP.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Recupera os dados do formulário
    $nome = isset($_POST['input--nome']) ? $_POST['input--nome'] : '';
    $email = isset($_POST['input--email']) ? $_POST['input--email'] : '';
    $telefone = isset($_POST['input--telefone']) ? $_POST['input--telefone'] : '';
    $bairro = isset($_POST['input--bairro']) ? $_POST['input--bairro'] : '';
    $mensagem = isset($_POST['mensagem']) ? $_POST['mensagem'] : '';
    $tipoServico = isset($_POST['tipo_servico']) ? $_POST['tipo_servico'] : '';
        // Agora, $tipoServico conterá o valor selecionado no campo "Tipo de serviço"
        // Você pode usar $tipoServico conforme necessário no restante do seu código PHP
        $nome = isset($_POST['input--nome']) ? $_POST['input--nome'] : '';
        $email = isset($_POST['input--email']) ? $_POST['input--email'] : '';
        $telefone = isset($_POST['input--telefone']) ? $_POST['input--telefone'] : '';
        $bairro = isset($_POST['input--bairro']) ? $_POST['input--bairro'] : '';
        $mensagemUsuario = isset($_POST['mensagem']) ? $_POST['mensagem'] : '';
        $tipoServico = isset($_POST['tipo_servico']) ? $_POST['tipo_servico'] : '';
        
        $tipoServicoDescricao = '';
        
        switch ($tipoServico) {
            case '1':
                $tipoServicoDescricao = 'RESIDENCIAL';
                break;
            case '2':
                $tipoServicoDescricao = 'EMPRESARIAL';
                break;
            case '3':
                $tipoServicoDescricao = 'ESCOLAR';
                break;
            default:
                $tipoServicoDescricao = 'Tipo de serviço não selecionado ou inválido';
        }
        
        // Agora, você pode usar $tipoServicoDescricao e $mensagemUsuario conforme necessário no restante do seu código PHP
        

    // Validações e processamentos adicionais podem ser adicionados conforme necessário

    // Monta a mensagem de e-mail
    $conteudoEmail = "Nome: " . $nome . "\n";
    $conteudoEmail .= "Email: " . $email . "\n";
    $conteudoEmail .= "Telefone: " . $telefone . "\n";
    $conteudoEmail .= "Bairro: " . $bairro . "\n";
    $conteudoEmail .= "Mensagem: " . $mensagem . "\n";
    $conteudoEmail .= "Tipo de Serviço: " . $tipoServicoDescricao . "\n";

    // Configuração do PHPMailer
    $mail = new PHPMailer(true);
    try {
        // Configurações SMTP
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';  // Substitua pelo host do seu provedor SMTP
        $mail->SMTPAuth = true;
        $mail->Username = 'eleutherio.profissional@gmail.com';  // Substitua pelo seu usuário SMTP
        $mail->Password = 'senha do email ou senha para autorização de apps';  // Substitua pela senha do seu usuário SMTP
        $mail->SMTPSecure = 'tls';  // Use 'tls' ou 'ssl' dependendo do seu provedor SMTP
        $mail->Port = 587;  // Porta do seu servidor SMTP

        // Configurações do e-mail
        $mail->setFrom($email, $nome);
        $mail->addAddress('eleutherio.profissional@gmail.com'); // Substitua pelo seu endereço de e-mail
        $mail->Subject = 'Novo formulário submetido';
        $mail->Body = $conteudoEmail;
        $mail->CharSet = 'UTF-8';  // Define a codificação para UTF-8

        // Configuração adicional para debug (remova ou defina como 0 em produção)
        $mail->SMTPDebug = 2;

        // Envie o e-mail
        $mail->send();

        // E-mail enviado com sucesso, redireciona para a página de sucesso
        header("Location: ../contents/sucess.html");
        exit();

    } catch (Exception $e) {
        error_log('Erro ao enviar o email: ' . $mail->ErrorInfo);
        // Falha no envio do e-mail, redireciona para a página de erro
        header("Location: ../contents/error.html");
        exit();
    }
} else {
    // Se alguém tentar acessar este arquivo diretamente, você pode redirecioná-lo para a página de formulário
    header('Location: ../contents/contato.html');
    exit();
}
?>
