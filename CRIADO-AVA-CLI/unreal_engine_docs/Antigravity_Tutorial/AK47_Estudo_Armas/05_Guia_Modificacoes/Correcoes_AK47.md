# 🛠️ 05. Guia de Modificações e Correção de Bugs na AK-47

**[Foco: Diagnóstico de Pendências da AK-47, Sockets Faltantes e Resolução de Problemas Genéricos]**

A **AK-47** (que usa o Blueprint mestre `BP_WeaponBase`) é a arma mais avançada do projeto em termos de funcionalidades embutidas. No entanto, ela possui algumas falhas que você pode resolver usando o conhecimento adquirido nos módulos anteriores.

---

## 📂 1. Onde Localizar no Unreal Editor?

1. No **Content Browser**, abra o Blueprint **`BP_WeaponBase`** (que atua como a AK-47 quando instanciada).
2. Verifique o painel de variáveis padrão clicando em **Class Defaults** e a aba **Components** (canto superior esquerdo) onde a malha 3D está configurada.

---

## 🔍 2. O que falta na AK-47? (Checklist de Melhorias)

Aqui estão as pendências comuns de comportamento que você pode inspecionar e corrigir diretamente no Unreal Editor para a AK-47:

### A) Verificação do Soquete "Muzzle" (Clarão do Tiro e Balas)
* **Sintoma:** O flash de disparo não aparece ou as balas físicas são instanciadas em uma posição incorreta (por exemplo, na base do personagem).
* **Solução:** Abra a Skeletal Mesh da AK-47. Vá na aba de Sockets e verifique se o socket `"Muzzle"` existe na ponta do cano. Se não existir, adicione-o, posicione-o corretamente e salve a malha.

### B) Verificação do Soquete "Magazine" (Pente de Munição)
* **Sintoma:** Ao recarregar, a AK-47 não descarta o pente físico ou o pente físico cai a partir de um ponto distante da arma.
* **Solução:** Abra a Skeletal Mesh da AK-47. Verifique se existe o socket de pente físico (geralmente chamado `"Magazine"` ou `"Mag"`). Certifique-se de que o nome desse socket no modelo 3D seja o mesmo configurado nas variáveis padrões do Blueprint da arma.

### C) Ajuste do Tempo de Recarga (Reload Duration)
* **Sintoma:** O número de munições no HUD é atualizado antes que o personagem termine o movimento visual de recarregar a AK-47.
* **Como Corrigir:** 
  1. Cronometre a duração (em segundos) da animação de recarga da AK-47.
  2. Abra a DataTable `/Game/Blueprints/Weapons/Data/WeaponList`.
  3. Vá até a linha `"AK47"` e modifique o valor da coluna **`Reload Duration`** para que fique idêntico ao tempo da animação.

### D) Adicionar Som de Recarga (Reload Sound)
* **Sintoma:** Ao realizar a recarga da AK-47, o som mecânico de recarregamento não toca (recarrega em silêncio).
* **Solução:** Abra a DataTable `/Game/Blueprints/Weapons/Data/WeaponList`, vá até a linha `"AK47"` e configure o campo **`Reload Sound`** com um asset de áudio apropriado (como `akreload_Cue` ou som genérico de rifle).

### F) Bug da Arma Grudada na Mão e Munição Inativa (WeaponID Incorreto ou None)
* **Sintoma:** 
  1. Ao pegar a AK-47 ou outra arma no chão, ela fica grudada na mão física do personagem, mas não aparece na HUD nem no inventário. A tecla de descarte/drop (`G` ou outra tecla configurada) não funciona para jogá-la fora.
  2. As caixas de munição no cenário são ignoradas e não adicionam balas à arma ativa.
  3. O console do Unreal exibe erros como: `GetSocketInfoByName(b_gun_mag): No SkeletalMesh for Component(WeaponMesh)`.
* **Solução:**
  1. No Unreal Editor, selecione o ator da arma que está posicionado no cenário (por exemplo, `BP_WeaponBase_C_6`).
  2. No painel **Details** (Detalhes), localize a variável **`WeaponStored`** e expanda-a.
  3. No campo **`WeaponID`**, mude de `None` para a ID exata correspondente na DataTable `WeaponList` (ex: **`AK47`**, **`M4A1`** ou **`Beretta`**).
  4. Salve o mapa de testes.

---



## 💡 3. Como Aplicar Esse Aprendizado em Outras Armas com Problemas?

Ao entender o ciclo completo da AK-47 (Pai ➡️ Tabela de Dados ➡️ Filho), você pode consertar qualquer outra arma (como uma pistola ou escopeta que não recarrega) seguindo esse roteiro:

1. **Confirme a Herança:** Verifique se o Blueprint da arma com problema tem `BP_WeaponBase` como classe pai (Parent Class no topo direito do Blueprint).
2. **Confirme o ID da Arma:** Verifique se a variável padrão `WeaponStored -> WeaponID` da arma com problema está preenchida com o nome exato da linha correspondente na DataTable `WeaponList`.
3. **Compare as Configurações na DataTable:** Abra a `WeaponList` e compare a linha da arma com problema com a linha da `"AK47"`. Geralmente o problema de som ausente, falha de recarga ou erro de disparo é apenas um campo em branco ou valor zerado (`0.0`) na linha daquela arma na tabela!
