# Controle de estoque de solados

CRUD desenvolvido para uso em fábrica de calçados local, utilizado para controle de estoque de solados, feito utilizando SQLite e Tauri, framework que utiliza de React, Rust.

## 🚀 Começando

Essas instruções permitirão que você obtenha uma cópia do projeto em operação na sua máquina local para fins de desenvolvimento e teste.


### 📋 Pré-requisitos

Para iniciar o projeto é necessário ter o [Node.js](https://nodejs.org/en) instalado em sua maquina! Recomendado a versão LTS 

E também precisamos do [RUST](https://www.rust-lang.org/pt-BR/learn/get-started) 

### 🔧 Instalação

Após clonar esse repositório para rodar o projeto como desenvolvimento vá até a pasta do projeto e rode o seguinte comando no terminal para baixar as dependencias do projeto:

```
npm install
```

Agora devemos criar o banco de dados, então vamos entrar na pasta src-tauri pelo terminal:

```
cd src-tauri/
```

e vamos criar o banco de dados, para isso rodamos o seguinte comando:

```
sqlx database create
```

após a criação do banco de dados, precisamos rodar as migrations para montar a estrutura inicial do banco

```
sqlx migrate run
```

E agora para iniciar o projeto basta rodar o comando abaixo:

```
npm run tauri dev
```

Para instalar o projeto basta rodar o comando abaixo e será gerado um executavel

```
npm run tauri build
```

Após o build o executavel estara na pasta do seu projeto 

```
  ...\src-tauri\target\release\bundle/msi/
```

O projeto tem essa aparencia :D

![image](https://github.com/atiliosilfer/crud_solados_app/assets/42559266/03474400-6d8c-4dea-897f-579e3d0677af)

## 🛠️ Construído com

Mencione as ferramentas que você usou para criar seu projeto

* [Tauri](https://tauri.app/) - O framework utilizado para criar o aplicativo desktop
* [ReactJS](https://react.dev/) - Framework utilizado para criar o frontend do aplicativo
* [Typescript](https://www.typescriptlang.org/) - Linguagem utilizada para construção do frontend
* [MUI](https://mui.com/) e [styled components](https://styled-components.com/) - utilizados na estilização do aplicativo
* [Rust](https://www.rust-lang.org/pt-BR) - Linguagem utilizada para construção do backend da aplicação
* [SQLite](https://www.sqlite.org/index.html) - Banco de dados utilizado

## ✒️ Autores

* **Atílio Ferreira** - *Desenvolvedor* - [github](https://github.com/atiliosilfer)
* **Luiz Junio** - *Amigo do Desenvolvedor que deu suporte com duvidas de rust* - [github](https://github.com/SeraphyBR)

## 🎁 Expressões de gratidão

* Obrigado as pessoas que requisitaram esse projeto para utilizar no seu dia a dia, e confiar em mim no desenvolvimento mesmo eu falando que usaria esse projeto para pratica de estudos!
