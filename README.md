# Churras da Trinca - BackEnd

Olá, caro ~~trincker, trincar, trinquer~~!

**Aqui você pode encontrar:**
 - Como inicializar o projeto;
	 - Yarn;
	 - Docker;
	 - Migrations;
	 - Variáveis ambiente;
 - Como executar o projeto;
 - Arquivo de rotas do Insomnia

**Node:** v14.17.1
**Yarn:** v1.22.10

## Inicializar o projeto

### Yarn
Vamos instalar nossas dependências, dentro da pasta do projeto, execute o comando:

    yarn

### Docker
Este projeto foi totalmente baseado em Docker para comunicações externas. Com o docker-compose.yaml a inicialização é simples. Basta ter o Docker CLI instalado e executar o comando abaixo dentro da pasta do projeto.


    docker compose up

### Migrations
Este projeto possui TypeORM, então há migrations que devem ser feitas para criar as colunas no banco de dados. Para isso, execute o comando abaixo dentro da pasta do projeto.

    yarn typeorm migration:run

### Variáveis ambiente
De acordo com os arquivos .example, preencha corretamente **.env** e **.ormconfig.json**

## Executar o projeto
Agora, é mais fácil do que comer o churras. Dentro da pasta do projeto, execute:

    yarn dev:server

## Arquivo de rotas do Insomnia
Utilizei o Insomnia para consultar as rotas a medida que fui criando-as, sendo assim, há o arquivo insomnia.json para caso deseje importar no software e ter acesso direto a todas as rotas.
