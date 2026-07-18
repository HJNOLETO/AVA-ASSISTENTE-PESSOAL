Begin Object Class=/Script/UMG.CanvasPanel Name="CanvasPanel_0"
   Begin Object Class=/Script/UMG.CanvasPanelSlot Name="CanvasPanelSlot_0"
   End Object
   Begin Object Class=/Script/UMG.CanvasPanelSlot Name="CanvasPanelSlot_1"
   End Object
   Begin Object Class=/Script/UMG.CanvasPanelSlot Name="CanvasPanelSlot_2"
   End Object
   Begin Object Name="CanvasPanelSlot_0"
      LayoutData=(Offsets=(Right=0.000000,Bottom=0.000000),Anchors=(Maximum=(X=1.000000,Y=1.000000)))
      Parent=/Script/UMG.CanvasPanel'"CanvasPanel_0"'
      Content=/Script/UMG.BackgroundBlur'"BackgroundBlur_207"'
   End Object
   Begin Object Name="CanvasPanelSlot_1"
      LayoutData=(Offsets=(Right=0.000000,Bottom=0.000000),Anchors=(Maximum=(X=1.000000,Y=1.000000)))
      Parent=/Script/UMG.CanvasPanel'"CanvasPanel_0"'
      Content=/Script/UMG.Image'"Cor"'
   End Object
   Begin Object Name="CanvasPanelSlot_2"
      LayoutData=(Offsets=(Right=800.000000,Bottom=800.000000),Anchors=(Minimum=(X=0.500000,Y=0.500000),Maximum=(X=0.500000,Y=0.500000)),Alignment=(X=0.500000,Y=0.500000))
      Parent=/Script/UMG.CanvasPanel'"CanvasPanel_0"'
      Content=/Script/UMG.Overlay'"Overlay_86"'
   End Object
   Slots(0)=/Script/UMG.CanvasPanelSlot'"CanvasPanelSlot_0"'
   Slots(1)=/Script/UMG.CanvasPanelSlot'"CanvasPanelSlot_1"'
   Slots(2)=/Script/UMG.CanvasPanelSlot'"CanvasPanelSlot_2"'
   bExpandedInDesigner=True
End Object
Begin Object Class=/Script/UMGEditor.WidgetSlotPair Name="WidgetSlotPair_7"
   WidgetName="CanvasPanel_0"
End Object
Begin Object Class=/Script/UMG.BackgroundBlur Name="BackgroundBlur_207"
   BlurStrength=4.000000
End Object
Begin Object Class=/Script/UMG.Image Name="Cor"
   Brush=(TintColor=(SpecifiedColor=(R=0.000000,G=1.000000,B=0.000000,A=0.200000)))
   ColorAndOpacity=(R=0.000000,G=1.000000,B=0.000000,A=0.150000)
   DisplayLabel="Cor"
End Object
Begin Object Class=/Script/UMG.Overlay Name="Overlay_86"
   Begin Object Class=/Script/UMG.OverlaySlot Name="OverlaySlot_0"
   End Object
   Begin Object Class=/Script/UMG.OverlaySlot Name="OverlaySlot_1"
   End Object
   Begin Object Name="OverlaySlot_0"
      HorizontalAlignment=HAlign_Fill
      VerticalAlignment=VAlign_Fill
      Parent=/Script/UMG.Overlay'"Overlay_86"'
      Content=/Game/Blueprints/UMG/RadialMenu/UMG_RadialMenu.UMG_RadialMenu_C'"UMG_RadialMenu"'
   End Object
   Begin Object Name="OverlaySlot_1"
      Padding=(Bottom=80.000000)
      HorizontalAlignment=HAlign_Center
      VerticalAlignment=VAlign_Center
      Parent=/Script/UMG.Overlay'"Overlay_86"'
      Content=/Script/UMG.TextBlock'"WeaponName"'
   End Object
   Slots(0)=/Script/UMG.OverlaySlot'"OverlaySlot_0"'
   Slots(1)=/Script/UMG.OverlaySlot'"OverlaySlot_1"'
   bExpandedInDesigner=True
End Object
Begin Object Class=/Game/Blueprints/UMG/RadialMenu/UMG_RadialMenu.UMG_RadialMenu_C Name="UMG_RadialMenu"
End Object
Begin Object Class=/Script/UMG.TextBlock Name="WeaponName"
   Text=NSLOCTEXT("UMG", "TextBlockDefaultValue", "Text Block")
   Font=(OutlineSettings=(OutlineSize=1),Size=20)
   bIsVariable=True
   DisplayLabel="WeaponName"
End Object
