w_main

Begin Object Class=/Script/UMG.CanvasPanel Name="HUD"
   Begin Object Class=/Script/UMG.CanvasPanelSlot Name="CanvasPanelSlot_0"
   End Object
   Begin Object Class=/Script/UMG.CanvasPanelSlot Name="CanvasPanelSlot_2"
   End Object
   Begin Object Class=/Script/UMG.CanvasPanelSlot Name="CanvasPanelSlot_1"
   End Object
   Begin Object Class=/Script/UMG.CanvasPanelSlot Name="CanvasPanelSlot_3"
   End Object
   Begin Object Class=/Script/UMG.CanvasPanelSlot Name="CanvasPanelSlot_4"
   End Object
   Begin Object Class=/Script/UMG.CanvasPanelSlot Name="CanvasPanelSlot_5"
   End Object
   Begin Object Class=/Script/UMG.CanvasPanelSlot Name="CanvasPanelSlot_6"
   End Object
   Begin Object Class=/Script/UMG.CanvasPanelSlot Name="CanvasPanelSlot_7"
   End Object
   Begin Object Name="CanvasPanelSlot_0"
      LayoutData=(Offsets=(Right=773.024902,Bottom=191.532440),Anchors=(Minimum=(X=0.500000,Y=0.500000),Maximum=(X=0.500000,Y=0.500000)),Alignment=(X=0.500000,Y=0.500000))
      Parent=/Script/UMG.CanvasPanel'"HUD"'
      Content=/Script/UMG.CanvasPanel'"DeathScreen"'
   End Object
   Begin Object Name="CanvasPanelSlot_2"
      LayoutData=(Offsets=(Left=-220.000000,Top=-121.999985,Right=427.940704,Bottom=251.066650),Anchors=(Minimum=(X=0.889583,Y=0.131481),Maximum=(X=0.889583,Y=0.131481)))
      Parent=/Script/UMG.CanvasPanel'"HUD"'
      Content=/Script/UMG.CanvasPanel'"Player_Info"'
   End Object
   Begin Object Name="CanvasPanelSlot_1"
      LayoutData=(Offsets=(Right=5.000000,Bottom=5.000000),Anchors=(Minimum=(X=0.500000,Y=0.500000),Maximum=(X=0.500000,Y=0.500000)),Alignment=(X=0.500000,Y=0.500000))
      Parent=/Script/UMG.CanvasPanel'"HUD"'
      Content=/Script/UMG.Image'"Image_0"'
   End Object
   Begin Object Name="CanvasPanelSlot_3"
      LayoutData=(Offsets=(Right=0.000000,Bottom=0.000000),Anchors=(Maximum=(X=1.000000,Y=1.000000)))
      Parent=/Script/UMG.CanvasPanel'"HUD"'
      Content=/Game/Blueprints/UMG/WBCrosshair.WBCrosshair_C'"WBCrosshair"'
   End Object
   Begin Object Name="CanvasPanelSlot_4"
      LayoutData=(Offsets=(Right=50.000000,Bottom=50.000000),Anchors=(Minimum=(X=0.500000,Y=0.500000),Maximum=(X=0.500000,Y=0.500000)),Alignment=(X=0.500000,Y=0.500000))
      Parent=/Script/UMG.CanvasPanel'"HUD"'
      Content=/Script/UMG.Image'"Damage"'
   End Object
   Begin Object Name="CanvasPanelSlot_5"
      LayoutData=(Offsets=(Right=300.000000,Bottom=80.000000))
      Parent=/Script/UMG.CanvasPanel'"HUD"'
      Content=/Game/Blueprints/UMG/W_PickupItem.W_PickupItem_C'"W_PickupItem"'
   End Object
   Begin Object Name="CanvasPanelSlot_6"
      LayoutData=(Offsets=(Left=-280.000000,Top=-120.000000,Right=250.000000,Bottom=80.000000),Anchors=(Minimum=(X=1.000000,Y=1.000000),Maximum=(X=1.000000,Y=1.000000)))
      Parent=/Script/UMG.CanvasPanel'"HUD"'
      Content=/Script/UMG.WidgetSwitcher'"WeaponSwitcher"'
   End Object
   Begin Object Name="CanvasPanelSlot_7"
      LayoutData=(Offsets=(Left=30.000000,Top=-30.000000,Right=280.000000,Bottom=280.000000),Anchors=(Minimum=(X=0.000000,Y=1.000000),Maximum=(X=0.000000,Y=1.000000)),Alignment=(X=0.000000,Y=1.000000))
      Parent=/Script/UMG.CanvasPanel'"HUD"'
      Content=/Script/UMG.Overlay'"Minimapa"'
   End Object
   Slots(0)=/Script/UMG.CanvasPanelSlot'"CanvasPanelSlot_2"'
   Slots(1)=/Script/UMG.CanvasPanelSlot'"CanvasPanelSlot_0"'
   Slots(2)=/Script/UMG.CanvasPanelSlot'"CanvasPanelSlot_1"'
   Slots(3)=/Script/UMG.CanvasPanelSlot'"CanvasPanelSlot_3"'
   Slots(4)=/Script/UMG.CanvasPanelSlot'"CanvasPanelSlot_4"'
   Slots(5)=/Script/UMG.CanvasPanelSlot'"CanvasPanelSlot_5"'
   Slots(6)=/Script/UMG.CanvasPanelSlot'"CanvasPanelSlot_6"'
   Slots(7)=/Script/UMG.CanvasPanelSlot'"CanvasPanelSlot_7"'
   bIsVariable=True
   bExpandedInDesigner=True
   DisplayLabel="HUD"
End Object
Begin Object Class=/Script/UMGEditor.WidgetSlotPair Name="WidgetSlotPair_1"
   WidgetName="HUD"
End Object
Begin Object Class=/Script/UMG.CanvasPanel Name="Player_Info"
   Begin Object Class=/Script/UMG.CanvasPanelSlot Name="CanvasPanelSlot_20"
   End Object
   Begin Object Class=/Script/UMG.CanvasPanelSlot Name="CanvasPanelSlot_21"
   End Object
   Begin Object Class=/Script/UMG.CanvasPanelSlot Name="CanvasPanelSlot_37"
   End Object
   Begin Object Class=/Script/UMG.CanvasPanelSlot Name="CanvasPanelSlot_38"
   End Object
   Begin Object Class=/Script/UMG.CanvasPanelSlot Name="CanvasPanelSlot_5"
   End Object
   Begin Object Name="CanvasPanelSlot_20"
      LayoutData=(Offsets=(Left=-121.965332,Top=-25.103729,Right=257.333344,Bottom=20.888889),Anchors=(Minimum=(X=0.677583,Y=0.546085),Maximum=(X=0.677583,Y=0.546085)))
      Parent=/Script/UMG.CanvasPanel'"Player_Info"'
      Content=/Script/UMG.Border'"BordaColete"'
   End Object
   Begin Object Name="CanvasPanelSlot_21"
      LayoutData=(Offsets=(Left=-122.632080,Top=-44.000000,Right=257.333344,Bottom=20.888889),Anchors=(Minimum=(X=0.679141,Y=0.724770),Maximum=(X=0.679141,Y=0.724770)))
      Parent=/Script/UMG.CanvasPanel'"Player_Info"'
      Content=/Script/UMG.Border'"BordaVida"'
   End Object
   Begin Object Name="CanvasPanelSlot_37"
      LayoutData=(Offsets=(Left=-89.240265,Top=-43.398022,Right=495.000000,Bottom=275.333313),Anchors=(Minimum=(X=0.685506,Y=0.270113),Maximum=(X=0.685506,Y=0.270113)))
      bAutoSize=True
      Parent=/Script/UMG.CanvasPanel'"Player_Info"'
      Content=/Script/UMG.TextBlock'"Hora"'
   End Object
   Begin Object Name="CanvasPanelSlot_38"
      LayoutData=(Offsets=(Left=32.000000,Top=188.000000,Right=391.200012,Bottom=51.428574))
      Parent=/Script/UMG.CanvasPanel'"Player_Info"'
      Content=/Script/UMG.TextBlock'"TextBlock_200"'
   End Object
   Begin Object Name="CanvasPanelSlot_5"
      LayoutData=(Offsets=(Left=-45.970352,Top=-87.066650,Right=254.888885,Bottom=13.000000),Anchors=(Minimum=(X=0.500000,Y=1.000000),Maximum=(X=0.500000,Y=1.000000)))
      Parent=/Script/UMG.CanvasPanel'"Player_Info"'
      Content=/Script/UMG.ProgressBar'"Stamina"'
   End Object
   Slots(0)=/Script/UMG.CanvasPanelSlot'"CanvasPanelSlot_37"'
   Slots(1)=/Script/UMG.CanvasPanelSlot'"CanvasPanelSlot_21"'
   Slots(2)=/Script/UMG.CanvasPanelSlot'"CanvasPanelSlot_20"'
   Slots(3)=/Script/UMG.CanvasPanelSlot'"CanvasPanelSlot_38"'
   Slots(4)=/Script/UMG.CanvasPanelSlot'"CanvasPanelSlot_5"'
   bIsVariable=True
   DisplayLabel="Player_Info"
End Object
Begin Object Class=/Script/UMG.TextBlock Name="Hora"
   Text=NSLOCTEXT("[994A7F2B47B70DC0ED107FA76A4E6213]", "A5E15EB54A75B6A144EE11847FBE2F3D", "00:00")
   Font=(OutlineSettings=(OutlineSize=3),Size=50,LetterSpacing=50)
   ShadowOffset=(X=7.008069,Y=4.283049)
   ShadowColorAndOpacity=(R=0.000000,G=0.000000,B=0.000000,A=0.800000)
   Justification=Center
   DisplayLabel="Hora"
End Object
Begin Object Class=/Script/UMG.Border Name="BordaVida"
   Begin Object Class=/Script/UMG.BorderSlot Name="BorderSlot_0"
   End Object
   Begin Object Name="BorderSlot_0"
      Padding=(Left=3.000000,Right=3.000000)
      Parent=/Script/UMG.Border'"BordaVida"'
      Content=/Script/UMG.ProgressBar'"Vida"'
   End Object
   Padding=(Left=3.000000,Right=3.000000)
   BrushColor=(R=0.000000,G=0.000000,B=0.000000,A=1.000000)
   Slots(0)=/Script/UMG.BorderSlot'"BorderSlot_0"'
   DisplayLabel="BordaVida"
End Object
Begin Object Class=/Script/UMG.ProgressBar Name="Vida"
   WidgetStyle=(BackgroundImage=(Margin=(Left=0.416667,Top=0.416667,Right=0.416667,Bottom=0.416667),TintColor=(SpecifiedColor=(R=0.270833,G=0.000000,B=0.000000,A=0.800000))))
   Percent=0.571429
   FillColorAndOpacity=(R=1.000000,G=0.000000,B=0.000000,A=1.000000)
   DisplayLabel="Vida"
End Object
Begin Object Class=/Script/UMG.Border Name="BordaColete"
   Begin Object Class=/Script/UMG.BorderSlot Name="BorderSlot_0"
   End Object
   Begin Object Name="BorderSlot_0"
      Padding=(Left=3.000000,Right=3.000000)
      Parent=/Script/UMG.Border'"BordaColete"'
      Content=/Script/UMG.ProgressBar'"Colete"'
   End Object
   Padding=(Left=3.000000,Right=3.000000)
   BrushColor=(R=0.000000,G=0.000000,B=0.000000,A=1.000000)
   Slots(0)=/Script/UMG.BorderSlot'"BorderSlot_0"'
   DisplayLabel="BordaColete"
End Object
Begin Object Class=/Script/UMG.ProgressBar Name="Colete"
   WidgetStyle=(BackgroundImage=(Margin=(Left=0.416667,Top=0.416667,Right=0.416667,Bottom=0.416667),TintColor=(SpecifiedColor=(R=0.421875,G=0.421875,B=0.421875,A=0.800000))))
   Percent=0.409524
   DisplayLabel="Colete"
End Object
Begin Object Class=/Script/UMG.TextBlock Name="TextBlock_200"
   Text=NSLOCTEXT("[994A7F2B47B70DC0ED107FA76A4E6213]", "0B4121F84AEF7B5ACF154A90B5491145", "Text")
   ColorAndOpacity=(SpecifiedColor=(R=0.019473,G=0.322917,B=0.026551,A=1.000000))
   Font=(FontObject=/Script/Engine.Font'"/Game/Blueprints/UMG/F_BebasNeueBold.F_BebasNeueBold"',OutlineSettings=(OutlineSize=3),TypefaceFontName="Font",Size=45,LetterSpacing=100)
   ShadowOffset=(X=7.853225,Y=4.740190)
   ShadowColorAndOpacity=(R=0.000000,G=0.000000,B=0.000000,A=0.800000)
   Justification=Right
End Object
Begin Object Class=/Script/UMG.ProgressBar Name="Stamina"
   WidgetStyle=(BackgroundImage=(TintColor=(SpecifiedColor=(R=0.510417,G=0.510417,B=0.510417,A=1.000000))))
   Percent=0.609524
   DisplayLabel="Stamina"
End Object
Begin Object Class=/Script/UMG.CanvasPanel Name="DeathScreen"
   Begin Object Class=/Script/UMG.CanvasPanelSlot Name="CanvasPanelSlot_0"
   End Object
   Begin Object Name="CanvasPanelSlot_0"
      LayoutData=(Offsets=(Top=-0.000004,Right=438.333374,Bottom=45.333336),Anchors=(Minimum=(X=0.500000,Y=0.500000),Maximum=(X=0.500000,Y=0.500000)),Alignment=(X=0.500000,Y=0.500000))
      bAutoSize=True
      Parent=/Script/UMG.CanvasPanel'"DeathScreen"'
      Content=/Script/UMG.TextBlock'"TextBlock_108"'
   End Object
   Slots(0)=/Script/UMG.CanvasPanelSlot'"CanvasPanelSlot_0"'
   bIsVariable=True
   bHiddenInDesigner=True
   Visibility=Hidden
   DisplayLabel="DeathScreen"
End Object
Begin Object Class=/Script/UMG.TextBlock Name="TextBlock_108"
   Text=NSLOCTEXT("[994A7F2B47B70DC0ED107FA76A4E6213]", "6A00E6034F88498C90052CB66290807F", "ESCAFEDEU-SE")
   ColorAndOpacity=(SpecifiedColor=(R=1.000000,G=0.000000,B=0.000000,A=1.000000))
   Font=(OutlineSettings=(OutlineSize=3),LetterSpacing=500)
   ShadowOffset=(X=4.000000,Y=2.000000)
   ShadowColorAndOpacity=(R=0.000000,G=0.000000,B=0.000000,A=1.000000)
End Object
Begin Object Class=/Script/UMG.Image Name="Image_0"
   bHiddenInDesigner=True
End Object
Begin Object Class=/Game/Blueprints/UMG/WBCrosshair.WBCrosshair_C Name="WBCrosshair"
   Visibility=Hidden
End Object
Begin Object Class=/Script/UMG.Image Name="Damage"
   Brush=(ImageSize=(X=128.000000,Y=128.000000),TintColor=(SpecifiedColor=(R=1.000000,G=0.000000,B=0.000000,A=1.000000)),ResourceObject=/Script/Engine.Texture2D'"/Game/Blueprints/UMG/T_Damage.T_Damage"')
   Visibility=Hidden
   DisplayLabel="Damage"
End Object
Begin Object Class=/Game/Blueprints/UMG/W_PickupItem.W_PickupItem_C Name="W_PickupItem"
End Object
Begin Object Class=/Script/UMG.WidgetSwitcher Name="WeaponSwitcher"
   Begin Object Class=/Script/UMG.WidgetSwitcherSlot Name="WidgetSwitcherSlot_0"
   End Object
   Begin Object Class=/Script/UMG.WidgetSwitcherSlot Name="WidgetSwitcherSlot_1"
   End Object
   Begin Object Name="WidgetSwitcherSlot_0"
      Parent=/Script/UMG.WidgetSwitcher'"WeaponSwitcher"'
      Content=/Script/UMG.Overlay'"0_NoWeapon"'
   End Object
   Begin Object Name="WidgetSwitcherSlot_1"
      Parent=/Script/UMG.WidgetSwitcher'"WeaponSwitcher"'
      Content=/Script/UMG.Overlay'"1_Weapons"'
   End Object
   ActiveWidgetIndex=1
   Slots(0)=/Script/UMG.WidgetSwitcherSlot'"WidgetSwitcherSlot_0"'
   Slots(1)=/Script/UMG.WidgetSwitcherSlot'"WidgetSwitcherSlot_1"'
   DisplayLabel="WeaponSwitcher"
End Object
Begin Object Class=/Script/UMG.Overlay Name="0_NoWeapon"
   Begin Object Class=/Script/UMG.OverlaySlot Name="OverlaySlot_0"
   End Object
   Begin Object Name="OverlaySlot_0"
      HorizontalAlignment=HAlign_Fill
      VerticalAlignment=VAlign_Fill
      Parent=/Script/UMG.Overlay'"0_NoWeapon"'
      Content=/Script/UMG.Image'"Icon_Hand"'
   End Object
   Slots(0)=/Script/UMG.OverlaySlot'"OverlaySlot_0"'
   bExpandedInDesigner=True
   DisplayLabel="0_NoWeapon"
End Object
Begin Object Class=/Script/UMG.Image Name="Icon_Hand"
   Brush=(ImageSize=(X=150.000000,Y=150.000000),ResourceObject=/Script/Engine.Texture2D'"/Game/Blueprints/UMG/Icons/T_SocoIcone.T_SocoIcone"')
   bLockedInDesigner=True
   DisplayLabel="Icon_Hand"
End Object
Begin Object Class=/Script/UMG.Overlay Name="1_Weapons"
   Begin Object Class=/Script/UMG.OverlaySlot Name="OverlaySlot_7"
   End Object
   Begin Object Class=/Script/UMG.OverlaySlot Name="OverlaySlot_0"
   End Object
   Begin Object Name="OverlaySlot_7"
      Padding=(Left=20.000000)
      HorizontalAlignment=HAlign_Center
      VerticalAlignment=VAlign_Bottom
      Parent=/Script/UMG.Overlay'"1_Weapons"'
      Content=/Script/UMG.HorizontalBox'"AmmoBox"'
   End Object
   Begin Object Name="OverlaySlot_0"
      HorizontalAlignment=HAlign_Fill
      VerticalAlignment=VAlign_Fill
      Parent=/Script/UMG.Overlay'"1_Weapons"'
      Content=/Script/UMG.Image'"Icon_Weapons"'
   End Object
   Slots(0)=/Script/UMG.OverlaySlot'"OverlaySlot_0"'
   Slots(1)=/Script/UMG.OverlaySlot'"OverlaySlot_7"'
   bExpandedInDesigner=True
   DisplayLabel="1_Weapons"
End Object
Begin Object Class=/Script/UMG.Image Name="Icon_Weapons"
   Brush=(ImageSize=(X=1000.000000,Y=250.000000),ResourceObject=/Script/Engine.Texture2D'"/Game/Blueprints/UMG/Icons/T_AK47.T_AK47"')
   bLockedInDesigner=True
   DisplayLabel="Icon_Weapons"
End Object
Begin Object Class=/Script/UMG.HorizontalBox Name="AmmoBox"
   Begin Object Class=/Script/UMG.HorizontalBoxSlot Name="HorizontalBoxSlot_0"
   End Object
   Begin Object Class=/Script/UMG.HorizontalBoxSlot Name="HorizontalBoxSlot_1"
   End Object
   Begin Object Class=/Script/UMG.HorizontalBoxSlot Name="HorizontalBoxSlot_2"
   End Object
   Begin Object Name="HorizontalBoxSlot_0"
      Parent=/Script/UMG.HorizontalBox'"AmmoBox"'
      Content=/Script/UMG.TextBlock'"AmmoMagazine"'
   End Object
   Begin Object Name="HorizontalBoxSlot_1"
      Parent=/Script/UMG.HorizontalBox'"AmmoBox"'
      Content=/Script/UMG.TextBlock'"TextBlock_1665"'
   End Object
   Begin Object Name="HorizontalBoxSlot_2"
      Parent=/Script/UMG.HorizontalBox'"AmmoBox"'
      Content=/Script/UMG.TextBlock'"AmmoStored"'
   End Object
   Slots(0)=/Script/UMG.HorizontalBoxSlot'"HorizontalBoxSlot_0"'
   Slots(1)=/Script/UMG.HorizontalBoxSlot'"HorizontalBoxSlot_1"'
   Slots(2)=/Script/UMG.HorizontalBoxSlot'"HorizontalBoxSlot_2"'
   bExpandedInDesigner=True
   DisplayLabel="AmmoBox"
End Object
Begin Object Class=/Script/UMG.TextBlock Name="AmmoMagazine"
   Text=NSLOCTEXT("[994A7F2B47B70DC0ED107FA76A4E6213]", "47E55376420FFB64D8AB9CB90AE097AA", "00")
   Font=(OutlineSettings=(OutlineSize=1),Size=15,LetterSpacing=400)
   bIsVariable=True
   DisplayLabel="AmmoMagazine"
End Object
Begin Object Class=/Script/UMG.TextBlock Name="TextBlock_1665"
   Text=NSLOCTEXT("[994A7F2B47B70DC0ED107FA76A4E6213]", "B5CB289E4B66A82947E34784CEB1CF2C", "-")
   Font=(OutlineSettings=(OutlineSize=1),Size=15,LetterSpacing=400)
End Object
Begin Object Class=/Script/UMG.TextBlock Name="AmmoStored"
   Text=NSLOCTEXT("[994A7F2B47B70DC0ED107FA76A4E6213]", "382CBB94483A651C469E62922D263303", "00")
   Font=(OutlineSettings=(OutlineSize=1),Size=15,LetterSpacing=400)
   bIsVariable=True
   DisplayLabel="AmmoStored"
End Object
Begin Object Class=/Script/UMG.Overlay Name="Minimapa"
   Begin Object Class=/Script/UMG.OverlaySlot Name="OverlaySlot_0"
   End Object
   Begin Object Name="OverlaySlot_0"
      Parent=/Script/UMG.Overlay'"Minimapa"'
      Content=/Script/UMG.Image'"MinimapBorder"'
   End Object
   Slots(0)=/Script/UMG.OverlaySlot'"OverlaySlot_0"'
   bExpandedInDesigner=True
   DisplayLabel="Minimapa"
End Object
Begin Object Class=/Script/UMG.Image Name="MinimapBorder"
   Brush=(ImageSize=(X=415.000000,Y=418.000000),ResourceObject=/Script/Engine.Texture2D'"/Game/Blueprints/UMG/Map/T_North_Icon.T_North_Icon"')
   DisplayLabel="MinimapBorder"
End Object
