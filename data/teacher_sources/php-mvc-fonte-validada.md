# Arquitetura MVC (Model-View-Controller) no PHP

## Fonte
- **Autor:** Gang of Four (Design Patterns) + Documentação oficial do Laravel
- **Validada em:** 2026-05-06
- **Tipo:** Fonte didática consolidada

## O que é MVC?

A arquitetura MVC separa uma aplicação em três camadas com responsabilidades distintas:

### Model (Modelo)
O Model é responsável pelos dados e pela lógica de negócio. Ele acessa o banco de dados, processa informações e retorna dados para o Controller. O Model nunca se comunica diretamente com a View.

Exemplo em PHP:
```php
class UserModel {
    public function getUserById(int $id): array {
        return $this->db->query("SELECT * FROM users WHERE id = ?", [$id]);
    }
}
```

### View (Visão)
A View é responsável exclusivamente pela apresentação dos dados ao usuário. Ela não deve conter lógica de negócio. Recebe dados do Controller e os exibe.

Exemplo em PHP (arquivo .phtml ou .blade.php):
```html
<h1>Bem-vindo, <?= htmlspecialchars($user['name']) ?></h1>
```

### Controller (Controlador)
O Controller recebe a requisição do usuário, coordena o Model para buscar/processar dados e decide qual View exibir. É o "maestro" da aplicação.

Exemplo em PHP:
```php
class UserController {
    public function show(int $id): void {
        $user = $this->userModel->getUserById($id);
        $this->render('user/show', ['user' => $user]);
    }
}
```

## Fluxo de uma Requisição

1. Usuário acessa `/users/42` no navegador
2. O **Roteador** identifica a rota e chama `UserController::show(42)`
3. O **Controller** pede ao **Model** os dados do usuário ID 42
4. O **Model** acessa o banco e retorna o array com os dados
5. O **Controller** passa os dados para a **View** `user/show.php`
6. A **View** renderiza o HTML e envia ao navegador

## Vantagens do MVC
- **Separação de responsabilidades:** Cada camada tem uma função única
- **Manutenibilidade:** Alterar a View não afeta o Model e vice-versa
- **Testabilidade:** Cada camada pode ser testada isoladamente
- **Reutilização:** O mesmo Model pode servir múltiplas Views (HTML, JSON, XML)

## Erros Comuns de Iniciantes
1. Colocar SQL direto na View (viola o MVC)
2. Processar dados diretamente no Controller (responsabilidade do Model)
3. Deixar o Model conhecer a View (dependência incorreta)
