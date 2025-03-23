# Usando a imagem oficial do Node.js v22.13.1 como base
FROM node:22.13.1

# Definindo o diretório de trabalho dentro do container
WORKDIR /app

# Copiando o arquivo package.json e yarn.lock para o container
COPY package.json yarn.lock ./

# Instalando as dependências do backend
RUN yarn install --frozen-lockfile

# Copiando o código-fonte do backend para o container
COPY . .

# Expondo a porta onde o NestJS irá rodar (3000)
EXPOSE 3000

# Definindo o comando para iniciar o servidor em modo de desenvolvimento
CMD ["yarn", "start:dev"]