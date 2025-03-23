# Statera - Gestão de Pedidos

Este é um projeto full-stack desenvolvido para gestão de pedidos, com frontend e backend integrados.

## Tecnologias Utilizadas

### Frontend
- **Next.js** (React)
- **Framer Motion** (para animações)
- **Axios** (para requisições HTTP)
- **Stripe** (para integração de pagamentos)
- **HeroUI** (UIkit)
- **Tailwind.css** (Design)

### Backend
- **NestJS** (Node.js)
- **JWT** (para autenticação)
- **Bcrypt** (para criptografia de senhas)
- **PassportJS** (para autenticação e autorização)
- **MySQL** (banco de dados)
- **Docker** (para conteinerização)
- **StripeAPI** (para integração de pagamentos)

### Ferramentas
- **Insomnia** (para testar as rotas da API)
- **WSL** (Windows Subsystem for Linux, para desenvolvimento no Windows)
- **Yarn** (gerenciador de pacotes do backend)
- **npm** (gerenciador de pacotes do frontend)

## Como Executar o Projeto

### Pré-requisitos

- **Docker**: Certifique-se de ter o Docker instalado e em execução.
- **WSL** (opcional, para usuários Windows): Configure o WSL para desenvolvimento.

### Passos para Executar

1. Clone o repositório:

   ```bash
   git clone https://github.com/seu-usuario/statera.git
   cd statera
   ```

2. Inicie os contêineres com Docker Compose:

   Na raiz do projeto backend, execute:

   ```bash
   docker-compose up -d
   ```

   Isso irá:
   - Iniciar o banco de dados MySQL.
   - Escrever o primeiro usuário no banco.
   - Iniciar o backend (NestJS) na porta 3000.

3. Acesse a pasta frontend:

   Rode os comandos:
   ```
   npm install
   npm run dev
   ```

   Isso irá:
   - Iniciar o frontend na porta 3001.
   
   Abra o navegador e acesse:
   ```
   http://localhost:3001
   ```

## Autenticação

O sistema utiliza **JWT (JSON Web Tokens)** para autenticação. O fluxo é o seguinte:

### Login:
1. O usuário envia um **POST** para `/auth/login` com **username** e **password**.
2. O backend verifica se o usuário existe e se a senha está correta (usando **Bcrypt**).
3. Se a autenticação for bem-sucedida, um **token JWT** é retornado.

### Rotas Protegidas:
- Para acessar rotas protegidas, o **token JWT** deve ser enviado no cabeçalho **Authorization**:**Bearer**.
- O backend valida o token usando **PassportJS**.

## Pagamentos com Stripe

O projeto inclui integração com o **Stripe** para processamento de pagamentos. O fluxo é o seguinte:

### Criar um pagamento:
1. O frontend envia uma requisição para `/payments/create` com os detalhes do pagamento.
2. O backend cria uma **intenção de pagamento** no Stripe e retorna um **client_secret**.

### Confirmar o pagamento:
1. O frontend usa o **client_secret** para finalizar o pagamento no Stripe.

## Testando a API

Use o **Insomnia** para testar as rotas da API. Um arquivo de configuração do Insomnia pode ser encontrado em:

```
backend/Insomnia_2025-03-23.yaml
```

## Licença

Este projeto está licenciado sob a **MIT License**.
