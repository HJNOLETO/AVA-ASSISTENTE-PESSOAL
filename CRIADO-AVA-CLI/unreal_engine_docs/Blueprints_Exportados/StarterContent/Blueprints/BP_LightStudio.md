# 🎮 Blueprint: BP_LightStudio

**[Classe Pai / Parent Class: `Actor`]**

## ⚙️ 1. Variáveis Declaradas (Variables)
| Nome da Variável | Tipo de Dado |
| :--- | :--- |
| `GlobalBrightness` | `real (double)` |
| `Use_HDRI` | `bool` |
| `UseSunLight` | `bool` |
| `SunBrightness` | `real (double)` |
| `SunTint` | `struct (LinearColor)` |
| `StationaryLightForSun` | `bool` |
| `SunDirectionalLight` | `object (DirectionalLightComponent)` |
| `UseAtmosphere` | `bool` |
| `AtmosphereBrightness` | `real (double)` |
| `AtmosphereTint` | `struct (LinearColor)` |
| `PrevisArrowMaterial` | `object (MaterialInstanceDynamic)` |
| `LightColor` | `struct (LinearColor)` |
| `SunColorCurve` | `object (CurveLinearColor)` |
| `OverrideSunColor` | `bool` |
| `AtmosphereDensityMultiplier` | `real (double)` |
| `AtmosphereAltitude` | `real (double)` |
| `DisableSunDisk` | `bool` |
| `UseFog` | `bool` |
| `FogBrightness` | `real (double)` |
| `FogTint` | `struct (LinearColor)` |
| `FogAltitude` | `real (double)` |
| `FogMaxOpacity` | `real (double)` |
| `FogHeightFalloff` | `real (double)` |
| `FogDensity` | `real (double)` |
| `FogBrightnessCurve` | `object (CurveFloat)` |
| `FogStartDistance` | `real (double)` |
| `DisableGroundScattering` | `bool` |
| `AtmosphereDistanceScale` | `real (double)` |
| `SkyboxMaterial` | `object (MaterialInstanceDynamic)` |
| `HDRI_Brightness` | `real (double)` |
| `HDRI_Contrast` | `real (double)` |
| `HDRI_Tint` | `struct (LinearColor)` |
| `HDRI_Cubemap` | `object (Texture)` |
| `HDRI_Rotation` | `real (double)` |
| `AtmosphereOpacityHorizon` | `real (double)` |
| `AtmosphereOpacityZenith` | `real (double)` |
| `HighDensityAtmosphere` | `bool` |
| `AtmosphericFog` | `object (AtmosphericFogComponent)` |
| `UseSkylight` | `bool` |
| `Shadowdistance` | `real (double)` |
| `LightShaftBloom` | `bool` |
| `LightShaftOcclusion` | `bool` |
| `OcclusionMaskDarkness` | `real (double)` |
| `BloomScale` | `real (double)` |
| `BloomThreshold` | `real (double)` |
| `BloomTint` | `struct (Color)` |
| `AtmosphereFogMultiplier` | `real (double)` |
| `AtmosphereDensityHeight` | `real (double)` |
| `AtmosphereMaxScatteringOrder` | `int` |
| `AtmosphereAltitudeSampleNumber` | `int` |
| `LightFunctionMaterial` | `object (MaterialInterface)` |
| `MIC_Black` | `object (MaterialInstance)` |
| `MIC_HDRI` | `object (MaterialInstance)` |

## ⚙️ 2. Grafos de Eventos e Lógica (Graphs)
### 📌 Grafo: `EventGraph`

### 📌 Grafo: `UserConstructionScript`

**Comentários e Títulos de Seção Encontrados:**
- *"Skybox"*
- *"Directional Light Properties"*
- *"Atmosphere Properties"*
- *"PrevisComponents"*
- *"Set up Light"*
- *"CalculateFogBrightness"*
- *"Fog Colors"*
- *"Fog Parameters"*
- *"HDRI Parameters"*
- *"Add mesh rotation to custom HDRI rotation"*
- *"LightShaft"*
- *"Recapture Skylight"*
- *"Choose skybox Material"*
- *"Atmosphere"*
- 🔀 Contém `2` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `SetDefaultBrightness()`
- 🛠️ `SetIntensity()`
- 🛠️ `SetLightColor()`
- 🛠️ `K2_SetWorldRotation()`
- 🛠️ `DisableSunDisk()`
- 🛠️ `SetSunMultiplier()`
- 🛠️ `SetVectorParameterValue()`
- 🛠️ `SetMaterial()`
- 🛠️ `SunMobility()`
- 🛠️ `CalculateSunColor()`
- 🛠️ `SetVisibility()`
- 🛠️ `SetDefaultLightColor()`
- 🛠️ `SetFogInscatteringColor()`
- 🛠️ `Multiply_LinearColorLinearColor()`
- 🛠️ `SetFogMaxOpacity()`
- 🛠️ `SetFogHeightFalloff()`
- 🛠️ `SetFogDensity()`
- 🛠️ `GetFloatValue()`
- 🛠️ `NormalizedSunAngle()`
- 🛠️ `Conv_FloatToLinearColor()`
- 🛠️ `SetStartDistance()`
- 🛠️ `K2_SetWorldLocation()`
- 🛠️ `SetDistanceScale()`
- 🛠️ `SetScalarParameterValue()`
- 🛠️ `SetTextureParameterValue()`
- 🛠️ `MakeVector()`
- 🛠️ `DisableGroundScattering()`
- 🛠️ `AtmosphereDensity()`
- 🛠️ `RecaptureSky()`
- 🛠️ `K2_DestroyComponent()`
- 🛠️ `SetDynamicShadowDistanceMovableLight()`
- 🛠️ `SetEnableLightShaftBloom()`
- 🛠️ `SetEnableLightShaftOcclusion()`
- 🛠️ `SetOcclusionMaskDarkness()`
- 🛠️ `SetBloomScale()`
- 🛠️ `SetBloomThreshold()`
- 🛠️ `SetBloomTint()`
- 🛠️ `SetDensityMultiplier()`
- 🛠️ `SetFogMultiplier()`
- 🛠️ `SetDynamicShadowDistanceStationaryLight()`
- 🛠️ `BreakRotator()`
- 🛠️ `K2_GetComponentRotation()`
- 🛠️ `SetLightFunctionMaterial()`
- 🛠️ `LinearColorLerp()`
- 🛠️ `Divide_DoubleDouble()`

**Variáveis Manipuladas:**
- `Get AtmosphereAltitude`
- `Get AtmosphereBrightness`
- `Get AtmosphereDensityMultiplier`
- `Get AtmosphereDistanceScale`
- `Get AtmosphereFogMultiplier`
- `Get AtmosphereOpacityHorizon`
- `Get AtmosphereOpacityZenith`
- `Get AtmosphereTint`
- `Get AtmosphericFog`
- `Get BloomScale`
- `Get BloomThreshold`
- `Get BloomTint`
- `Get DisableGroundScattering`
- `Get DisableSunDisk`
- `Get ExponentialHeightFog1`
- `Get FogAltitude`
- `Get FogBrightness`
- `Get FogBrightnessCurve`
- `Get FogDensity`
- `Get FogHeightFalloff`
- `Get FogMaxOpacity`
- `Get FogStartDistance`
- `Get FogTint`
- `Get GlobalBrightness`
- `Get HDRI_Brightness`
- `Get HDRI_Contrast`
- `Get HDRI_Cubemap`
- `Get HDRI_Rotation`
- `Get HDRI_Tint`
- `Get LightColor`
- `Get LightFunctionMaterial`
- `Get LightShaftBloom`
- `Get LightShaftOcclusion`
- `Get MIC_Black`
- `Get MIC_HDRI`
- `Get OcclusionMaskDarkness`
- `Get PrevisArrow`
- `Get PrevisArrowMaterial`
- `Get Shadowdistance`
- `Get SkyLight1`
- `Get Skybox`
- `Get SkyboxMaterial`
- `Get SunBrightness`
- `Get SunDirectionalLight`
- `Get UseAtmosphere`
- `Get UseFog`
- `Get UseSkylight`
- `Get UseSunLight`
- `Get Use_HDRI`
- `Set PrevisArrowMaterial`
- `Set SkyboxMaterial`

### 📌 Grafo: `CalculateSunColor`

**Comentários e Títulos de Seção Encontrados:**
- *"Use a curve to match sun color to atmosphere"*

**Funções e Métodos Chamados:**
- 🛠️ `GetLinearColorValue()`
- 🛠️ `Multiply_LinearColorLinearColor()`
- 🛠️ `SelectColor()`
- 🛠️ `BreakColor()`
- 🛠️ `MakeColor()`
- 🛠️ `NormalizedSunAngle()`

**Variáveis Manipuladas:**
- `Get OverrideSunColor`
- `Get SunColorCurve`
- `Get SunTint`
- `Set LightColor`

### 📌 Grafo: `SunMobility`

**Comentários e Títulos de Seção Encontrados:**
- *"Switch between stationary and moveable directional light"*
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Variáveis Manipuladas:**
- `Get StationaryLightForSun`
- `Set SunDirectionalLight`

### 📌 Grafo: `NormalizedSunAngle`

**Comentários e Títulos de Seção Encontrados:**
- *"Get Sun Angle in 0 to 1 range"*

**Funções e Métodos Chamados:**
- 🛠️ `K2_GetActorRotation()`
- 🛠️ `BreakRotator()`
- 🛠️ `Divide_DoubleDouble()`
- 🛠️ `Abs()`
- 🛠️ `Subtract_DoubleDouble()`

### 📌 Grafo: `AtmosphereDensity`

**Comentários e Títulos de Seção Encontrados:**
- *"Switch between high density atmosphere"*
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `SetPrecomputeParams()`

**Variáveis Manipuladas:**
- `Get AtmosphereAltitudeSampleNumber`
- `Get AtmosphereDensityHeight`
- `Get AtmosphereMaxScatteringOrder`
- `Get AtmosphericFog`
- `Get HighDensityAtmosphere`
- `Set AtmosphericFog`

### 📌 Grafo: `ExecuteUbergraph_BP_LightStudio`

### 📌 Grafo: `UserConstructionScript_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Skybox"*
- *"Directional Light Properties"*
- *"Atmosphere Properties"*
- *"PrevisComponents"*
- *"Set up Light"*
- *"CalculateFogBrightness"*
- *"Fog Colors"*
- *"Fog Parameters"*
- *"HDRI Parameters"*
- *"Add mesh rotation to custom HDRI rotation"*
- *"LightShaft"*
- *"Recapture Skylight"*
- *"Choose skybox Material"*
- *"Atmosphere"*
- 🔀 Contém `2` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `SetDefaultBrightness()`
- 🛠️ `SetIntensity()`
- 🛠️ `SetLightColor()`
- 🛠️ `K2_SetWorldRotation()`
- 🛠️ `DisableSunDisk()`
- 🛠️ `SetSunMultiplier()`
- 🛠️ `SetVectorParameterValue()`
- 🛠️ `SetMaterial()`
- 🛠️ `SunMobility()`
- 🛠️ `CalculateSunColor()`
- 🛠️ `SetVisibility()`
- 🛠️ `SetDefaultLightColor()`
- 🛠️ `SetFogInscatteringColor()`
- 🛠️ `Multiply_LinearColorLinearColor()`
- 🛠️ `SetFogMaxOpacity()`
- 🛠️ `SetFogHeightFalloff()`
- 🛠️ `SetFogDensity()`
- 🛠️ `GetFloatValue()`
- 🛠️ `NormalizedSunAngle()`
- 🛠️ `Conv_FloatToLinearColor()`
- 🛠️ `SetStartDistance()`
- 🛠️ `K2_SetWorldLocation()`
- 🛠️ `SetDistanceScale()`
- 🛠️ `SetScalarParameterValue()`
- 🛠️ `SetTextureParameterValue()`
- 🛠️ `MakeVector()`
- 🛠️ `DisableGroundScattering()`
- 🛠️ `AtmosphereDensity()`
- 🛠️ `RecaptureSky()`
- 🛠️ `K2_DestroyComponent()`
- 🛠️ `SetDynamicShadowDistanceMovableLight()`
- 🛠️ `SetEnableLightShaftBloom()`
- 🛠️ `SetEnableLightShaftOcclusion()`
- 🛠️ `SetOcclusionMaskDarkness()`
- 🛠️ `SetBloomScale()`
- 🛠️ `SetBloomThreshold()`
- 🛠️ `SetBloomTint()`
- 🛠️ `SetDensityMultiplier()`
- 🛠️ `SetFogMultiplier()`
- 🛠️ `SetDynamicShadowDistanceStationaryLight()`
- 🛠️ `BreakRotator()`
- 🛠️ `K2_GetComponentRotation()`
- 🛠️ `SetLightFunctionMaterial()`
- 🛠️ `LinearColorLerp()`
- 🛠️ `Divide_DoubleDouble()`

**Variáveis Manipuladas:**
- `Get AtmosphereAltitude`
- `Get AtmosphereBrightness`
- `Get AtmosphereDensityMultiplier`
- `Get AtmosphereDistanceScale`
- `Get AtmosphereFogMultiplier`
- `Get AtmosphereOpacityHorizon`
- `Get AtmosphereOpacityZenith`
- `Get AtmosphereTint`
- `Get AtmosphericFog`
- `Get BloomScale`
- `Get BloomThreshold`
- `Get BloomTint`
- `Get DisableGroundScattering`
- `Get DisableSunDisk`
- `Get ExponentialHeightFog1`
- `Get FogAltitude`
- `Get FogBrightness`
- `Get FogBrightnessCurve`
- `Get FogDensity`
- `Get FogHeightFalloff`
- `Get FogMaxOpacity`
- `Get FogStartDistance`
- `Get FogTint`
- `Get GlobalBrightness`
- `Get HDRI_Brightness`
- `Get HDRI_Contrast`
- `Get HDRI_Cubemap`
- `Get HDRI_Rotation`
- `Get HDRI_Tint`
- `Get LightColor`
- `Get LightFunctionMaterial`
- `Get LightShaftBloom`
- `Get LightShaftOcclusion`
- `Get MIC_Black`
- `Get MIC_HDRI`
- `Get OcclusionMaskDarkness`
- `Get PrevisArrow`
- `Get PrevisArrowMaterial`
- `Get Shadowdistance`
- `Get SkyLight1`
- `Get Skybox`
- `Get SkyboxMaterial`
- `Get SunBrightness`
- `Get SunDirectionalLight`
- `Get UseAtmosphere`
- `Get UseFog`
- `Get UseSkylight`
- `Get UseSunLight`
- `Get Use_HDRI`
- `Set PrevisArrowMaterial`
- `Set SkyboxMaterial`

### 📌 Grafo: `CalculateSunColor_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Use a curve to match sun color to atmosphere"*

**Funções e Métodos Chamados:**
- 🛠️ `GetLinearColorValue()`
- 🛠️ `Multiply_LinearColorLinearColor()`
- 🛠️ `SelectColor()`
- 🛠️ `BreakColor()`
- 🛠️ `MakeColor()`
- 🛠️ `NormalizedSunAngle()`

**Variáveis Manipuladas:**
- `Get OverrideSunColor`
- `Get SunColorCurve`
- `Get SunTint`
- `Set LightColor`

### 📌 Grafo: `SunMobility_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Switch between stationary and moveable directional light"*
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Variáveis Manipuladas:**
- `Get StationaryLightForSun`
- `Set SunDirectionalLight`

### 📌 Grafo: `NormalizedSunAngle_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Get Sun Angle in 0 to 1 range"*

**Funções e Métodos Chamados:**
- 🛠️ `K2_GetActorRotation()`
- 🛠️ `BreakRotator()`
- 🛠️ `Divide_DoubleDouble()`
- 🛠️ `Abs()`
- 🛠️ `Subtract_DoubleDouble()`

### 📌 Grafo: `AtmosphereDensity_MERGED`

**Comentários e Títulos de Seção Encontrados:**
- *"Switch between high density atmosphere"*
- 🔀 Contém `1` nós de decisão (`Branch/If`).

**Funções e Métodos Chamados:**
- 🛠️ `SetPrecomputeParams()`

**Variáveis Manipuladas:**
- `Get AtmosphereAltitudeSampleNumber`
- `Get AtmosphereDensityHeight`
- `Get AtmosphereMaxScatteringOrder`
- `Get AtmosphericFog`
- `Get HighDensityAtmosphere`
- `Set AtmosphericFog`

## ❓ Perguntas que este documento responde
- Qual é a classe pai do Blueprint `BP_LightStudio`?
- Quais variáveis estão disponíveis no Blueprint `BP_LightStudio`?
- Quais funções e eventos são chamados no grafo do `BP_LightStudio`?