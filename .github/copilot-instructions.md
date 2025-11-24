## Guia Rápido para Agentes de Codificação (FilmeFlix-Mobile)

Este repositório é um app Expo/React Native chamado `FilmeFlix` com código dentro da pasta `FilmeFlix/`.
As instruções abaixo focam em conhecimento prático que torna um agente imediatamente produtivo aqui.

**Arquitetura (big picture):**
- **Frontend mobile Expo**: código principal em `FilmeFlix/app` (file-based routing, `tsx`).
- **Componentes e Views**: `FilmeFlix/components`, `FilmeFlix/destaques`, `FilmeFlix/scr` (mistura de TSX e JS).
- **Bibliotecas utilitárias esperadas**: imports referenciam `../lib/*` (ex.: `tmdb`, `favoritos`, `parse`) — pode faltar no repositório; trate como integração externa ou módulo a implementar.

**Fluxos de dados e integrações importantes:**
- A maioria das imagens e metadados vem da API TheMovieDB (TMDB). Exemplos de uso do URL base:
  - `https://image.tmdb.org/t/p/w500${poster_path}` (ver `FilmeFlix/app/index.tsx` e `FilmeFlix/scr/MoviePage.js`).
- Chamadas a TMDB aparecem diretamente (ex.: chave de API hard-coded em `FilmeFlix/app/index.tsx`). Considere recomendar mover a chave para variáveis de ambiente.
- Integração de favoritos usa módulos `favoritos` e potencialmente `Parse` para autenticação (ver `FilmeFlix/components/SaveButton.tsx` e `FilmeFlix/scr/FavoritesPage.js`).

**Padrões e convenções do projeto:**
- Mistura deliberada de TypeScript (`.tsx`) e JavaScript (`.js`) — mantenha o tipo de arquivo ao editar.
- File-based routing do Expo Router — coloque telas/rotas em `app/` quando for novo código de navegação.
- Uso consistente de estilos inline com `StyleSheet.create` (padrão React Native).

**Comandos comuns de desenvolvimento:**
- Instalar dependências (na raiz ou dentro de `FilmeFlix/`):
  - `npm install`
- Iniciar app Expo (diretório `FilmeFlix`):
  - `npx expo start` (abre Metro/Expo Dev Tools)
- Script helper existente: `npm run reset-project` (documentado em `FilmeFlix/README.md`).

**O que procurar antes de modificar/commitar código:**
- Verificar se um helper em `FilmeFlix/lib/*` está presente. Se estiver faltando e o código importa `../lib/*`, anote como dependência ou implemente um stub testável.
- Se alterar chamadas a TMDB, mantenha o formato de URL de imagem usado no projeto para evitar regressão visual.
- Ao editar telas em `app/`, respeite o roteamento baseado em arquivos do Expo Router (não remova exportações padrão das páginas).

**Exemplos práticos para agentes**
- Corrigir resultado nulo: em `FilmeFlix/scr/MoviePage.js` lidar com `movie.poster_path` já é feito; siga o padrão de mostrar placeholder quando ausente.
- Adicionar logging/diagnóstico: preferir `Alert.alert` para erros de rede onde a UI depende disso (padrão atual em `MoviePage.js` e `FavoritesPage.js`).
- Refatoração de favoritos: `SaveButton.tsx` chama `getFavorites()` e `saveFavorite()` — preserve a assinatura (array de favoritos com campo `id`).

**Restrições e notas de segurança**
- Chave TMDB está hard-coded em `FilmeFlix/app/index.tsx`. Não commitar chaves públicas em código; sugira mover para `app.config`/`.env` ao propor mudanças.

**Onde buscar contexto adicional**
- `FilmeFlix/README.md` — passos de setup e comandos Expo.
- `FilmeFlix/app.json` — configurações do Expo (plugins, saída web, experimentos como `typedRoutes`).
- Componentes exemplo: `FilmeFlix/destaques/Filme_principal.tsx`, `FilmeFlix/components/SaveButton.tsx`.

Se alguma informação estiver incompleta (por exemplo, a pasta `FilmeFlix/lib` ausente ou variáveis de ambiente não documentadas), peça ao mantenedor onde os módulos/segredos deveriam viver antes de implementar integrações automáticas.

--
Peça feedback se quiser que eu: 1) remova a chave TMDB, 2) implemente stubs em `FilmeFlix/lib/`, ou 3) gere exemplos de PRs/refactor.
