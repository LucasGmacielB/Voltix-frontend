# ⚡ Voltix Frontend

Sistema web desenvolvido em **React + Next.js** para gerenciamento e comercialização de equipamentos tecnológicos, integrando autenticação, gerenciamento de usuários, endereços, produtos e demais funcionalidades através de uma API REST conectada a banco de dados.

---

# 👨‍💻 Integrantes

* Moisés Carlos
* Lucas Gabriel
* Zarto Wagner
* Marconi Andrade
* Paulo César
* Carlos Henrique

---

# 📚 Sobre o Projeto

O Voltix foi desenvolvido como projeto acadêmico com o objetivo de aplicar conceitos modernos de desenvolvimento web utilizando:

* React
* Next.js
* TypeScript
* Tailwind CSS
* TanStack Query
* Zustand
* API REST
* Banco de Dados
* Autenticação de usuários

A aplicação possui interface responsiva, gerenciamento global de estado, comunicação com back-end e implementação completa de operações CRUD.

---

# 🎯 Objetivos Atendidos

O projeto atende aos requisitos solicitados pelo professor:

✅ React + Next.js

✅ CSS utilizando Tailwind CSS

✅ Integração com Back-end

✅ Banco de Dados

✅ Login

✅ Logout

✅ Cadastro de Usuário (Sign Up)

✅ Recuperação de Senha

✅ CRUD Completo de Entidades

✅ Exibição de Outras Entidades

✅ TanStack Query

✅ Next Router

✅ Gerenciamento Global de Estado (Zustand)

✅ Interface Responsiva

✅ Projeto hospedado em produção

---

# 🛠 Tecnologias Utilizadas

### Front-end

* React
* Next.js
* TypeScript
* Tailwind CSS
* React Icons

### Gerenciamento de Estado

* Zustand

### Requisições e Cache

* TanStack Query

### Back-end

* Spring Boot
* Java
* API REST

### Banco de Dados

* PostgreSQL

### Deploy

* Vercel (Front-end)
* Render (Back-end)

---

# 🏗 Arquitetura do Projeto

O projeto foi dividido em:

### Camada de Interface

Responsável pelas telas e experiência do usuário.

### Camada de Serviços

Responsável pelas chamadas à API.

### Camada de Estado Global

Responsável por armazenar informações do usuário autenticado.

### Camada de Roteamento

Responsável pela navegação entre páginas utilizando Next Router.

---

# 🔐 Autenticação

O sistema possui:

* Login
* Cadastro de Usuário
* Logout
* Recuperação de Senha
* Controle de Sessão
* Proteção de Rotas

As credenciais são enviadas para o back-end através de autenticação integrada à API.

---

# 🌎 Gerenciamento Global de Estado

Foi utilizado **Zustand** para armazenar:

* Usuário autenticado
* Dados do perfil
* Token/credenciais de autenticação
* Controle de sessão

Isso permite que as informações estejam disponíveis em qualquer tela da aplicação sem necessidade de prop drilling.

---

# ⚡ TanStack Query

O projeto utiliza TanStack Query para:

* Buscar dados da API
* Cache automático
* Atualização de dados
* Controle de loading
* Tratamento de erros
* Refetch automático

Exemplo de utilização:

* Listagem de produtos
* Listagem de endereços
* Consultas ao perfil do usuário

---

# 🧾 CRUD Implementados

## 👤 Usuários

* Criar usuário
* Visualizar usuário
* Atualizar perfil
* Alterar senha

## 📍 Endereços

* Criar endereço
* Listar endereços
* Editar endereço
* Excluir endereço

---

# 🖥 Principais Telas

### Login

Autenticação do usuário.

### Cadastro

Criação de novas contas.

### Recuperação de Senha

Solicitação de redefinição de senha.

### Dashboard

Tela principal do sistema.

### Produtos

Exibição dos equipamentos cadastrados.

### Perfil

Visualização e edição dos dados do usuário.

### Endereços

Gerenciamento completo dos endereços cadastrados.

---

# 🎨 Interface

A interface foi desenvolvida utilizando Tailwind CSS com foco em:

* Design moderno
* Responsividade
* Usabilidade
* Experiência do usuário
* Consistência visual

Foi adotada uma identidade visual baseada em tons escuros com destaque em verde para representar tecnologia, inovação e energia.

---

# 🚀 Deploy

### Front-end (Vercel)

https://voltix-frontend-five.vercel.app/login

### Back-end (Render)

https://voltix-backend-7rx1.onrender.com/

---

# 🔗 Repositórios

### Back-end

https://github.com/LucasGmacielB/Voltix-backend

---

# ▶ Como Executar o Projeto

## 1. Clonar o repositório

```bash
git clone https://github.com/LucasGmacielB/Voltix-frontend.git
```

## 2. Entrar na pasta

```bash
cd Voltix-frontend
```

## 3. Instalar dependências

```bash
npm install
```

## 4. Executar em ambiente de desenvolvimento

```bash
npm run dev
```

## 5. Acessar no navegador

```bash
http://localhost:3000
```

---

# 📖 Considerações Finais

O Voltix foi desenvolvido aplicando conceitos modernos de desenvolvimento Front-end, integração com APIs, gerenciamento global de estado, autenticação de usuários e consumo eficiente de dados através do TanStack Query.
