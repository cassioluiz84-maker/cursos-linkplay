# Cursos Linkplay

Aplicativo web responsivo para organizar cursos, vídeos e playlists do YouTube.

## Executar no seu computador

Instale o **Node.js 24 LTS**, que inclui o npm. Também são compatíveis Node.js 22.12+ e 20.19+. Você precisa do Git para clonar o repositório.

Depois que esta versão estiver enviada ao GitHub, execute no terminal:

```sh
git clone https://github.com/cassioluiz84-maker/cursos-linkplay.git
cd cursos-linkplay
npm install
npm run dev
```

Se já tiver os arquivos do projeto no computador, abra o terminal na pasta que contém `package.json` e execute apenas `npm install` e `npm run dev`.

Não é necessário configurar `.env`, credenciais, banco de dados ou serviços externos. A primeira instalação precisa de acesso à internet para baixar as dependências. Para encerrar o servidor, pressione **Ctrl+C** no terminal.

Para uma instalação reproduzível usando exatamente o `package-lock.json`, você também pode usar `npm ci` em vez de `npm install`.

Abra o endereço mostrado pelo Vite (normalmente http://localhost:5173/cursos-linkplay/). Em uma máquina remota, use o encaminhamento da porta 5173 oferecido pelo seu ambiente.

## Verificações e compilação

```sh
npm test
npm run build
npm run preview
```

`npm run build` gera a pasta `dist/`; `npm run preview` serve essa compilação localmente, normalmente na porta 4173. As pastas `node_modules/` e `dist/` são geradas automaticamente e não devem ser enviadas ao GitHub. O `package-lock.json` deve ser versionado.

## Primeira versão

React + Vite, com pesquisa, filtro de favoritos, navegação por categorias, criação demonstrativa de cursos, inclusão demonstrativa de vídeos e simulação de progresso. As capas são ilustrações em CSS, sem serviços externos.

Os dados ficam somente em memória: recarregar a página restaura os cursos fictícios. Não há banco de dados, login, API externa ou reprodução de vídeos nesta etapa.

- `src/App.jsx`: navegação e estado da aplicação.
- `src/components/`: cards, capas e janela modal acessível.
- `src/data/courses.js`: cursos demonstrativos e filtragem.
- `src/styles.css`: aparência e layouts responsivos.
- `src/App.test.jsx`: testes das interações principais.

Os dados e componentes estão separados para facilitar a futura conexão com persistência e serviços reais.

## Publicação no GitHub Pages

Em **Settings > Pages > Build and deployment > Source**, selecione **GitHub Actions**.

O workflow `.github/workflows/deploy-pages.yml` instala as dependências com `npm ci`, executa os testes, compila e publica `dist/` a cada push para `main`. Também pode ser iniciado manualmente em **Actions > Deploy to GitHub Pages > Run workflow**; use essa opção se o primeiro workflow tiver falhado antes de ativar Pages.

O Vite usa `base: '/cursos-linkplay/'`. Após a conclusão bem-sucedida do deploy, o endereço esperado é https://cassioluiz84-maker.github.io/cursos-linkplay/.

No desenvolvimento local, abra o endereço exibido pelo Vite com o caminho `/cursos-linkplay/` (normalmente http://localhost:5173/cursos-linkplay/). A prévia do build usa normalmente http://localhost:4173/cursos-linkplay/.
