Begin Object Class=/Script/UMG.SizeBox Name="SizeBox_127"
   Begin Object Class=/Script/UMG.SizeBoxSlot Name="SizeBoxSlot_0"
   End Object
   Begin Object Name="SizeBoxSlot_0"
      Parent=/Script/UMG.SizeBox'"SizeBox_127"'
      Content=/Script/UMG.Overlay'"Overlay_196"'
   End Object
   WidthOverride=250.000000
   HeightOverride=80.000000
   bOverride_WidthOverride=True
   bOverride_HeightOverride=True
   Slots(0)=/Script/UMG.SizeBoxSlot'"SizeBoxSlot_0"'
   bIsVariable=True
   bExpandedInDesigner=True
End Object
Begin Object Class=/Script/UMGEditor.WidgetSlotPair Name="WidgetSlotPair_9"
   WidgetName="SizeBox_127"
End Object
Begin Object Class=/Script/UMG.Overlay Name="Overlay_196"
   Begin Object Class=/Script/UMG.OverlaySlot Name="OverlaySlot_1"
   End Object
   Begin Object Class=/Script/UMG.OverlaySlot Name="OverlaySlot_2"
   End Object
   Begin Object Name="OverlaySlot_1"
      Padding=(Left=20.000000,Top=50.000000)
      HorizontalAlignment=HAlign_Center
      VerticalAlignment=VAlign_Center
      Parent=/Script/UMG.Overlay'"Overlay_196"'
      Content=/Script/UMG.HorizontalBox'"AmmoBox"'
   End Object
   Begin Object Name="OverlaySlot_2"
      Parent=/Script/UMG.Overlay'"Overlay_196"'
      Content=/Script/UMG.Image'"WeaponIcon"'
   End Object
   Slots(0)=/Script/UMG.OverlaySlot'"OverlaySlot_2"'
   Slots(1)=/Script/UMG.OverlaySlot'"OverlaySlot_1"'
   bExpandedInDesigner=True
End Object
Begin Object Class=/Script/UMG.Image Name="WeaponIcon"
   Brush=(ImageSize=(X=1000.000000,Y=250.000000),ResourceObject=/Script/Engine.Texture2D'"/Game/Blueprints/UMG/Icons/T_AK47.T_AK47"')
   DisplayLabel="WeaponIcon"
End Object
Begin Object Class=/Script/UMG.HorizontalBox Name="AmmoBox"
   Begin Object Class=/Script/UMG.HorizontalBoxSlot Name="HorizontalBoxSlot_4"
   End Object
   Begin Object Class=/Script/UMG.HorizontalBoxSlot Name="HorizontalBoxSlot_5"
   End Object
   Begin Object Class=/Script/UMG.HorizontalBoxSlot Name="HorizontalBoxSlot_6"
   End Object
   Begin Object Name="HorizontalBoxSlot_4"
      Parent=/Script/UMG.HorizontalBox'"AmmoBox"'
      Content=/Script/UMG.TextBlock'"AmmoMagazine"'
   End Object
   Begin Object Name="HorizontalBoxSlot_5"
      Parent=/Script/UMG.HorizontalBox'"AmmoBox"'
      Content=/Script/UMG.TextBlock'"Text"'
   End Object
   Begin Object Name="HorizontalBoxSlot_6"
      Parent=/Script/UMG.HorizontalBox'"AmmoBox"'
      Content=/Script/UMG.TextBlock'"AmmoStored"'
   End Object
   Slots(0)=/Script/UMG.HorizontalBoxSlot'"HorizontalBoxSlot_4"'
   Slots(1)=/Script/UMG.HorizontalBoxSlot'"HorizontalBoxSlot_5"'
   Slots(2)=/Script/UMG.HorizontalBoxSlot'"HorizontalBoxSlot_6"'
   bIsVariable=True
   bExpandedInDesigner=True
   DisplayLabel="AmmoBox"
End Object
Begin Object Class=/Script/UMG.TextBlock Name="AmmoMagazine"
   Text=NSLOCTEXT("[DBCEEDF9486BB0FDAA18A0873871EFBE]", "1C55E2334E726E329F9265ADB2215CFC", "00")
   Font=(OutlineSettings=(OutlineSize=1),Size=10,LetterSpacing=400)
   bIsVariable=True
   DisplayLabel="AmmoMagazine"
End Object
Begin Object Class=/Script/UMG.TextBlock Name="Text"
   Text=NSLOCTEXT("[DBCEEDF9486BB0FDAA18A0873871EFBE]", "FFA16BF54898502283FE0E8812DC60C5", "-")
   Font=(OutlineSettings=(OutlineSize=1),Size=10,LetterSpacing=400)
   DisplayLabel="Text"
End Object
Begin Object Class=/Script/UMG.TextBlock Name="AmmoStored"
   Text=NSLOCTEXT("[DBCEEDF9486BB0FDAA18A0873871EFBE]", "CBAF5C924C8FAA93B973D98ADF137DCD", "00")
   ColorAndOpacity=(SpecifiedColor=(R=0.560784,G=0.560784,B=0.560784,A=1.000000))
   Font=(OutlineSettings=(OutlineSize=1),Size=10,LetterSpacing=400)
   bIsVariable=True
   DisplayLabel="AmmoStored"
End Object
