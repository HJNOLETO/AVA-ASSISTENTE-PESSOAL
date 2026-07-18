✅ Vamos limpar esses alertas passo a passo.
Atualmente você tem 2 Erros e 13 Warnings. O mais importante é resolver os Erros primeiro.

1. Erro Principal: CS8604 (BuildGraph.Automation)
Descrição:
Possible null reference argument for parameter 'other' in 'void HashSet<string>.UnionWith...'
Local: BgScriptReader.cs → linha 1640
Solução Rápida:
Abra o arquivo BgScriptReader.cs e vá até a linha 1640.
Provavelmente tem algo parecido com isso:
C#someHashSet.UnionWith(anotherCollection);
Substitua por:
C#if (anotherCollection != null)
{
    someHashSet.UnionWith(anotherCollection);
}
Ou, se preferir uma solução mais curta (usando null-conditional):
C#anotherCollection?.UnionWith(someHashSet); // dependendo da ordem
Se você puder colar as linhas 1635~1645 aqui, eu te dou o código exato corrigido.

2. Warning de Vulnerabilidade (NU1903)
Ainda aparece o pacote Microsoft.Extensions.Caching.Memory 6.0.1.
Solução:

Atualize o pacote para uma versão segura:

XML<PackageReference Include="Microsoft.Extensions.Caching.Memory" Version="8.0.1" />
Faça isso nos projetos EpicGames.Oodle e EpicGames.Horde.

3. Demais Warnings (CA1416, CA1050, etc.)
Como são muitos e a maioria é relacionada ao Windows + Unreal, recomendo suprimir temporariamente enquanto você foca no que realmente importa.
Crie ou edite o arquivo Directory.Build.props na raiz da sua solução com o seguinte conteúdo:
XML<Project>
  <PropertyGroup>
    <!-- Suprime warnings comuns do Unreal -->
    <NoWarn>$(NoWarn);NETSDK1138;CA1416;CA1050;CA2017;CA1849;CS8604</NoWarn>
    
    <!-- Target Framework (caso ainda esteja aparecendo) -->
    <TargetFramework>net8.0-windows</TargetFramework>
  </PropertyGroup>
</Project>
Depois faça Clean Solution → Rebuild Solution.

✅ Resumo bem feito.
Minha recomendação:
Não edite diretamente o arquivo da Engine (BgScriptReader.cs) se não for necessário.
Como é código fonte do Unreal Engine 5.3, qualquer alteração será perdida quando você atualizar o engine. Além disso, modificar arquivos internos pode causar problemas em futuras versões.

Melhor Solução (Mais Segura)
Vamos suprimir apenas este erro usando o arquivo Directory.Build.props.
Faça o seguinte:

Na pasta raiz da sua solução (ou dentro da pasta AutomationTool), crie um arquivo chamado Directory.Build.props (se já não existir).
Cole o seguinte conteúdo:

XML<Project>
  <PropertyGroup>
    <!-- Suprime o erro CS8604 específico -->
    <NoWarn>$(NoWarn);CS8604</NoWarn>
    
    <!-- Outros warnings comuns que você já tinha -->
    <NoWarn>$(NoWarn);NETSDK1138;CA1416;CA1050;CA2017;CA1849;NU1903</NoWarn>
  </PropertyGroup>
</Project>

Salve o arquivo.
No Visual Studio:
Clean Solution
Rebuild Solution