<?php

class Auth{

    public function __construct($fromGame = false){
        $this->mysqli = new mysqli("127.0.0.1", "remote", "9999", "timon");

        if($fromGame){
            return;
        }

        if($this->checkCookie()){
            echo "Успешная авторизация!";
            echo '<a href="../"><h3>Играть<h/3></a>';
            exit;
        }

        if(empty($_POST)){
            if(empty($_GET) || (isset($_GET["action"]) && $_GET["action"] === "register")){
                $this->showRegisterForm();
            }elseif(isset($_GET["action"]) && $_GET["action"] === "login"){
                $this->showLoginForm();
            }
        }elseif(isset($_POST["login"], $_POST["password"])){
            if($this->mysqli->errno){
                exit("Произошла ошибка");
            }

            if(isset($_POST["password2"])){
                $this->register($_POST["login"], $_POST["password"], $_POST["password2"]);
            }else{
                $this->login($_POST["login"], $_POST["password"]);
            }
        }
    }

    public function showRegisterForm(): void{
        echo file_get_contents("registerform.html");
    }

    public function showLoginForm(): void{
        echo file_get_contents("loginform.html");
    }

    public function login(string $name, string $password): void{
        if(mb_strlen($name) > 15){
            exit("Слишком длинное имя!");
        }

        # Защита от XSS атак
        $name = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
        $password = htmlspecialchars($password, ENT_QUOTES, 'UTF-8');
    
        # Защита от SQL-инъекций
        $name = $this->mysqli->real_escape_string($name);

        if(empty($user = $this->getUserPassword($name))){
            exit("Пользователь не существует!");
        }

        if(password_verify($password, $user[0][1])){
            $this->setToken($name);
            echo "Успешная авторизация!";
            echo '<a href="../"><h3>Играть<h/3></a>';
        }else{
            echo "Неверный пароль!";
        }
    }

    public function register(string $name, string $password, string $password2): bool{
        if(mb_strlen($name) > 15){
            exit("Слишком длинное имя!");
        }

        if($password !== $password2){
            exit("Пароли не совпадают!");
        }
    
        # Защита от XSS атак
        $name = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
        $password = htmlspecialchars($password, ENT_QUOTES, 'UTF-8');
    
        # Защита от SQL-инъекций
        $name = $this->mysqli->real_escape_string($name);

        if(!empty($this->getUserPassword($name))){
            exit("Пользователь с таким логином уже существует!");
        }

        #Хеширование пароля
        $password = password_hash($password, PASSWORD_DEFAULT);
    
        $query = "INSERT INTO `users` (`login`, `password`) VALUES('$name', '$password')";
        $this->mysqli->query($query);

        $this->setToken($name);
        echo "Успешная регистрация!";
        echo '<a href="../"><h3>Играть<h/3></a>';
    }

    public function getUserPassword(string $name): ?array{
        $query = "SELECT * FROM `users` WHERE `login`='$name'";

        $result = $this->mysqli->query($query);

        return $result->fetch_all();
    }

    public function setToken(string $name): void{
        # Генерация криптографически безопасного токена
        $token = bin2hex(random_bytes(16));
        
        $query = "INSERT INTO `tokens` (`login`, `token`) VALUES('$name', '$token')";
        $this->mysqli->query($query);

        setcookie("token", $token, time() + 3600, "/");
    }

    public function getUserByToken(string $token): ?string{
        $query = "SELECT * FROM `tokens` WHERE `token`='$token'";

        $result = $this->mysqli->query($query);
        $array = $result->fetch_all();

        return isset($array[0], $array[0][0]) ?? $array[0][0];
    }

    public function checkCookie(): bool{
        if(isset($_COOKIE["token"])){
            if($name = $this->getUserByToken($_COOKIE["token"]) !== null){
                $this->setToken($name);
                return true;
            }else{
                return false;
            }
        }else{
            return false;
        }
    }

}