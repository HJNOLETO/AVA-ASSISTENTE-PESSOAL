# DeepSeek V4 Pro — Etapa 3: sistemas de jogo e conteúdo para uma IA criar jogos

Pré-requisito: Etapas 1 e 2 aprovadas. Não acrescente comandos genéricos sem uma necessidade de fluxo de jogo clara.

## Objetivo

Oferecer primitivas semânticas para uma IA construir um protótipo de terror: mundo, interação, arma/lanterna, IA inimiga, objetivos, UI, áudio e materiais. Cada comando deve usar as proteções e diagnósticos da Etapa 2.

## Escopo priorizado

### 1. Projeto e assets

- Consultar configurações relevantes (input, mapas, renderização, plugins), sem alterar por padrão.
- Listar/consultar assets por classe, caminho, tag e referência.
- Importar asset somente com caminho explícito e `dry_run`; informar conflitos e dependências.
- Criar/editar Material Instance com parâmetros tipados e validação de material pai.
- Fab/Quixel: fornecer apenas descoberta de assets já disponíveis no projeto/Bridge/Fab cache, referência e importação explícita. Não automatizar login, compra, download ou aceite de licença.

### 2. Mundo e nível

- Criar/inspecionar nível e atores.
- Spawnar/atualizar ator por transform, classe e propriedades seguras.
- Criar luz, trigger/volume, ponto de spawn e objetivo simples.
- Validar referências de malha nula e overrides de material incompatíveis antes de salvar.

### 3. Gameplay reutilizável

- Criar componentes e interfaces de gameplay (`Interactable`, `Health`, `Inventory`, `Weapon`, `Objective`) com contratos claros.
- Ações semânticas para: interação por trace, pegar item, abrir porta, coletar chave, ativar lanterna, causar dano e concluir objetivo.
- Para cada ação, criar/validar os eventos, entradas e dependências; jamais pressupor que um personagem tenha uma arma válida.

### 4. IA, UI e audiovisual

- Criar uma base de inimigo com percepção, comportamento/estado simples e spawn controlado; declarar as integrações de navmesh/Behavior Tree necessárias.
- Widgets HUD (vida, objetivo, prompt de interação) com bindings/atualização explícitos.
- Associar sons, VFX e luzes com validação de asset e estratégia de fallback se ausente.

## Não fazer nesta etapa

- Não criar dezenas de comandos específicos de um único jogo.
- Não modificar conteúdo de produção como teste.
- Não esconder ações de alto impacto: remover asset, sobrescrever material, migrar conteúdo ou editar configurações deve exigir `confirm:true` e devolver plano de alterações.

## Demonstração de aceite

Em conteúdo de teste isolado (`/Game/MCPTests/...`), uma IA deve conseguir criar uma microcena: personagem, arma com lanterna opcional, porta interagível, chave, objetivo na HUD e inimigo simples. Deve listar dependências ausentes em vez de inventar referências. Todos os Blueprints criados devem compilar e passar o diagnóstico.

## Entrega exigida

Documentar o catálogo de comandos por domínio, schemas de parâmetros, efeitos colaterais, exemplos de uso e quais ações exigem confirmação.
