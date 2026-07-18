# 🎓 Antigravity: Pasta Pedagógica e Guia de Engenharia Reversa (GTA / Pirata Perdido)

**[Criador: Antigravity (AI Coding Assistant)]**  
**[Escopo: Engenharia Reversa de Blueprints, Práticas Recomendadas de Arquitetura Unreal Engine 5]**

---

## 🎯 1. Intenção desta Pasta

A intenção principal desta pasta é **atuar como uma ponte didática entre o conhecimento teórico de desenvolvimento de jogos 3D e a aplicação prática em um projeto real (Projeto GTA/Pirata Perdido)**. 

Em vez de apenas modificar códigos sem critério estrutural, esta pasta foi concebida para:
1. **Catalogar a Arquitetura Atual:** Registrar como os sistemas visuais (Widgets) e de combate (Weapons) se comunicam em um projeto real baseado em herança e componentes.
2. **Servir de Manual de Estudo Autônomo:** Ensinar conceitos essenciais como cálculos trigonométricos (`Atan2`), gerenciamento desacoplado de dados em arrays/structs, herança de Blueprints (Mestre-Filho) e colisões físicas.
3. **Instruir na Correção de Desvios (Diretriz G):** Identificar proativamente problemas estruturais (como caminhos absolutos locais e inversão de hierarquia de pastas) e falhas lógicas de gameplay (como o bug do recarregamento de arma e o overlap de pickup em coldres), ensinando o desenvolvedor a corrigi-los manualmente para sedimentar o conhecimento.

---

## 💻 2. Ações Realizadas pela Assistente (O que foi feito e como)

Para construir este ecossistema pedagógico, executamos os seguintes passos analíticos e práticos:

1. **Varredura e Análise Headless (T3D):**
   * Analisamos as representações em formato ASCII `.t3d` geradas pelos scripts de engenharia reversa do projeto, correlacionando pinos de execução e nós lógicos do `BP_Character`, `ALS_Player`, `BP_WeaponBase`, `AC_WeaponSystem` e `BP_AmmoBase`.
2. **Diagnóstico Técnico de Bugs de Combate:**
   * **Problema da Recarga:** Identificamos que a função lógica de recarga (`Reload`) e sua respectiva trava existiam nas Blueprints de armas e componentes de controle, mas o sinal físico (tecla `R` ou evento de InputAction `IA_Reload`) não estava mapeado no grafo de inputs ativo ou na classe-mãe em C++ (`APPPirateCharacter`), gerando a falha de input.
   * **Problema da Coleta (Overlap):** Diagnosticamos que a colisão de pickups (`BP_AmmoBase`) só entregava munição para a arma ativa nas mãos (`CurrentWeapon`). Se o jogador estivesse desarmado/com arma no coldre, a munição era incorretamente rejeitada.
3. **Estruturação de Guias Passo a Passo:**
   * Criamos documentos focados em português (Brasil) para explicar estes conceitos de forma clara, utilizando diagramas e tabelas informativas.

---

## 📂 3. Estrutura de Conteúdo e Links Cruzados

Os tutoriais estão divididos de forma modular em subpastas com seus respectivos tópicos de especialização:

* **[Pendencias_Usuario.md](file:///c:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Antigravity_Tutorial/Pendencias_Usuario.md):** 
  - A lista central de tarefas manuais pendentes que o usuário deve realizar no Unreal Editor para aplicar as correções sugeridas.
* **Pasta `/Menu_Radial/`:**
  - **[Decentralization_Guide.md](file:///c:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Antigravity_Tutorial/Menu_Radial/Decentralization_Guide.md):** Cálculo trigonométrico de seleção circular, desacoplamento UI/Dados e alertas arquiteturais (Diretriz G).
* **Pasta `/Inventario/`:**
  - **[Structure_Guide.md](file:///c:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Antigravity_Tutorial/Inventario/Structure_Guide.md):** Arrays, structs (`S_InventorySlot`), ciclos de vida, prevenção de referências circulares e otimização por referências preguiçosas.
* **Pasta `/Weapons/`:**
  - **[Weapon_System_Architecture.md](file:///c:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Antigravity_Tutorial/Weapons/Weapon_System_Architecture.md):** Polimorfismo, herança mestre-filho de armas, coordenação central de disparos e o roteiro do fix de recarga (tecla `R`).
* **Pasta `/AmmoBox/`:**
  - **[Ammo_Box_Tutorial.md](file:///c:/Users/hijon/Downloads/ava-assistant-30-03-26/ava-assistant-v3-main/CRIADO-AVA-CLI/unreal_engine_docs/Antigravity_Tutorial/AmmoBox/Ammo_Box_Tutorial.md):** Colisões físicas (Block vs Overlap), reaproveitamento de assets tridimensionais em `FPS_Weapon_Bundle` e correção do bug de overlap com arma guardada.
