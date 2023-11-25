# Raccoon API

## It is a application for testing API's. Include HTTP requests and Websocket

### Development (to do)

- [] Criar sistema de tabs de api request.
- [] Guardar configurações da tela de api request no localStorage.
- [] Guardar configurações da tree de pastas no localStorage.
- [] Não deixar criar item anexo, pasta ou http request, em item do tipo http request.
- [] Não deixar criar um novo item com nome vazio (folder e http request).
- [] Não está sendo possível criar pasta ou http request quando a pasta está recolhida.
- [] Mostrar o params e headers em campos de input (key e value).
- [] Montar o layout para a resposta da API (body, statusCode, time, length of request).
- [] Criar tabs no layout da resposta da API, para ser possível ver o headers da request feita.
- [] Tornar o body, headers e params editáveis na tela de layout de request.
- [] Quando é clicado para criar uma nova pasta ou request, a tela de API buga (some) e não é possível mais abrir nenhuma nova tela de API.
- [] Criar sistema de expandir todas as pastas e recolher todas as pastas (https://primevue.org/tree/).
- [] Criar sistema de tags.

### Improvement

- [] Torna possível visualizar o body da request em campos de input (key e value) para que assim possa remover campos mais fácil ou modificar.
- [] Usar o pinia para controlar o estado dos options API, para que assim, possa mudar o method da API de um item http request, quando estiver na aba dela, ou quando alterar o body, headers ou url.

### Features

- [] Tornar as pastas e request arrastáveis.
- [] Sistema de gerenciamento de usuários (criação, edição e deleção de usuários).
- [] Sistema de autenticação.
- [] Dashboard simples para admin gerenciar usuários da organização (adicionar ou deletar usuários e ver commits).
- [] Criar a aplicação para ser plugin-play via docker para poder rodar em um servidor próprio.
