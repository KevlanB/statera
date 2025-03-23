Statera - Gestão de Pedidos
Este é um projeto full-stack desenvolvido para gestão de pedidos, com frontend e backend integrados.

Tecnologias Utilizadas
Frontend
Next.js (React)

Framer Motion (para animações)

Axios (para requisições HTTP)

Stripe (para integração de pagamentos)

Backend
NestJS (Node.js)

JWT (para autenticação)

Bcrypt (para criptografia de senhas)

PassportJS (para autenticação e autorização)

MySQL (banco de dados)

Docker (para conteinerização)

Ferramentas
Insomnia (para testar as rotas da API)

WSL (Windows Subsystem for Linux, para desenvolvimento no Windows)

Yarn (gerenciador de pacotes do backend)

npm (gerenciador de pacotes do frontend)

Como Executar o Projeto
Pré-requisitos
Docker: Certifique-se de ter o Docker instalado e em execução.

WSL (opcional, para usuários Windows): Configure o WSL para desenvolvimento.

Passos para Executar
Clone o repositório:

bash
Copy
git clone https://github.com/seu-usuario/statera.git
cd statera
Inicie os contêineres com Docker Compose:
Na raiz do projeto, execute:

bash
Copy
docker-compose up -d
Isso irá:

Iniciar o banco de dados MySQL.

Iniciar o backend (NestJS).

Iniciar o frontend (Next.js).

Acesse o frontend:
Abra o navegador e acesse:

Copy
http://localhost:3000
Acesse o backend:
A API estará disponível em:

Copy
http://localhost:4000
Estrutura do Projeto
Frontend
Páginas: frontend/pages/

Componentes: frontend/components/

Estilos: frontend/styles/

Requisições HTTP: frontend/services/

Backend
Módulos: backend/src/modules/

Controladores: backend/src/controllers/

Serviços: backend/src/services/

Entidades: backend/src/entities/

Autenticação: backend/src/auth/

Autenticação
O sistema utiliza JWT (JSON Web Tokens) para autenticação. O fluxo é o seguinte:

Login:

O usuário envia um POST para /auth/login com email e password.

O backend verifica se o usuário existe e se a senha está correta (usando Bcrypt).

Se a autenticação for bem-sucedida, um token JWT é retornado.

Rotas Protegidas:

Para acessar rotas protegidas, o token JWT deve ser enviado no cabeçalho Authorization.

O backend valida o token usando PassportJS.

Pagamentos com Stripe
O projeto inclui integração com o Stripe para processamento de pagamentos. O fluxo é o seguinte:

Criar um pagamento:

O frontend envia uma requisição para /payments/create com os detalhes do pagamento.

O backend cria uma intenção de pagamento no Stripe e retorna um client_secret.

Confirmar o pagamento:

O frontend usa o client_secret para finalizar o pagamento no Stripe.

Testando a API
Use o Insomnia para testar as rotas da API. Um arquivo de configuração do Insomnia pode ser encontrado em:

Copy
backend/Insomnia_Config.json
Contribuição
Crie uma branch:

bash
Copy
git checkout -b feature/nova-funcionalidade
Faça commit das alterações:

bash
Copy
git add .
git commit -m "Descrição da funcionalidade"
Envie para o repositório:

bash
Copy
git push origin feature/nova-funcionalidade
Abra um Pull Request no GitHub.

Licença
Este projeto está licenciado sob a MIT License.
