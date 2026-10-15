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

## Biblioteca de vídeos — etapa 2

A interface original em React + Vite foi preservada. Agora é possível cadastrar, editar, favoritar, pesquisar e excluir vídeos do YouTube, associá-los a cursos e assisti-los no player incorporado oficial. A exclusão exige confirmação. Marque um vídeo como concluído no player para atualizar o progresso do curso; não há rastreamento automático de tempo assistido.

O formulário aceita links `youtube.com/watch?v=...`, `youtu.be/...`, `youtube.com/shorts/...` e `youtube.com/embed/...`, com ou sem `https://`. Exige título, curso e categoria e detecta duplicatas pelo ID, mesmo em formatos diferentes. A descrição é opcional. Miniaturas públicas são carregadas de `i.ytimg.com`; o player vem de `www.youtube.com`. Não são necessários API key ou downloads de vídeos. A disponibilidade da reprodução depende do YouTube e das permissões do autor.

### Dados locais

Cursos criados, vídeos, categorias, favoritos e conclusão são mantidos no `localStorage`, na chave `cursos-linkplay.library.v1`. A estrutura versionada separa `courses`, `videos`, `categories` e `demoOverrides`. Os seis cursos fictícios ficam no código, claramente identificados como demonstração; somente suas preferências são armazenadas separadamente. Vídeos reais nunca são semeados nem substituídos por exemplos.

Os dados persistem no mesmo navegador e origem. Não há sincronização entre dispositivos; limpar os dados do site os remove. Modo privado e armazenamento bloqueado ou cheio podem impedir persistência; nesse caso a interface mostra um aviso. Dados locais inválidos são preservados sem sobrescrita e um aviso é apresentado. Nenhum banco de dados ou login foi introduzido.

### Organização

- `src/App.jsx`: navegação e integração da biblioteca.
- `src/components/`: cards, formulário de vídeo e modal acessível.
- `src/lib/youtube.js`: extração de IDs e validação do cadastro.
- `src/lib/library.js`: persistência versionada, consultas e cálculo de progresso.
- `src/data/courses.js`: exemplos visuais, separados dos dados reais.
- `src/styles.css`: identidade visual e layouts responsivos.
- `src/*.test.jsx` e `src/lib/*.test.js`: regressão, validação, persistência e gerenciamento de vídeos.

## Publicação no GitHub Pages

Em **Settings > Pages > Build and deployment > Source**, selecione **GitHub Actions**.

O workflow `.github/workflows/deploy-pages.yml` instala as dependências com `npm ci`, executa os testes, compila e publica `dist/` a cada push para `main`. Também pode ser iniciado manualmente em **Actions > Deploy to GitHub Pages > Run workflow**; use essa opção se o primeiro workflow tiver falhado antes de ativar Pages.

O Vite usa `base: '/cursos-linkplay/'`. Após a conclusão bem-sucedida do deploy, o endereço esperado é https://cassioluiz84-maker.github.io/cursos-linkplay/.

No desenvolvimento local, abra o endereço exibido pelo Vite com o caminho `/cursos-linkplay/` (normalmente http://localhost:5173/cursos-linkplay/). A prévia do build usa normalmente http://localhost:4173/cursos-linkplay/.
