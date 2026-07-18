Begin Object Class=/Script/UMG.CanvasPanel Name="CanvasPanel_34"
   Begin Object Class=/Script/UMG.CanvasPanelSlot Name="CanvasPanelSlot_0"
   End Object
   Begin Object Name="CanvasPanelSlot_0"
      LayoutData=(Offsets=(Right=0.000000),Anchors=(Minimum=(X=0.000000,Y=0.500000),Maximum=(X=1.000000,Y=0.500000)),Alignment=(X=0.000000,Y=0.500000))
      bAutoSize=True
      Parent=/Script/UMG.CanvasPanel'"CanvasPanel_34"'
      Content=/Script/UMG.HorizontalBox'"HorizontalBox_69"'
   End Object
   Slots(0)=/Script/UMG.CanvasPanelSlot'"CanvasPanelSlot_0"'
   bExpandedInDesigner=True
End Object
Begin Object Class=/Script/UMGEditor.WidgetSlotPair Name="WidgetSlotPair_5"
   WidgetName="CanvasPanel_34"
End Object
Begin Object Class=/Script/UMG.HorizontalBox Name="HorizontalBox_69"
   Begin Object Class=/Script/UMG.HorizontalBoxSlot Name="HorizontalBoxSlot_0"
   End Object
   Begin Object Class=/Script/UMG.HorizontalBoxSlot Name="HorizontalBoxSlot_1"
   End Object
   Begin Object Name="HorizontalBoxSlot_0"
      Size=(SizeRule=Fill)
      Padding=(Left=500.000000)
      HorizontalAlignment=HAlign_Left
      VerticalAlignment=VAlign_Center
      Parent=/Script/UMG.HorizontalBox'"HorizontalBox_69"'
      Content=/Script/UMG.Button'"LeftButton"'
   End Object
   Begin Object Name="HorizontalBoxSlot_1"
      Size=(SizeRule=Fill)
      Padding=(Right=500.000000)
      HorizontalAlignment=HAlign_Right
      Parent=/Script/UMG.HorizontalBox'"HorizontalBox_69"'
      Content=/Script/UMG.Button'"RightButton"'
   End Object
   Slots(0)=/Script/UMG.HorizontalBoxSlot'"HorizontalBoxSlot_0"'
   Slots(1)=/Script/UMG.HorizontalBoxSlot'"HorizontalBoxSlot_1"'
   bExpandedInDesigner=True
End Object
Begin Object Class=/Script/UMG.Button Name="LeftButton"
   Begin Object Class=/Script/UMG.ButtonSlot Name="ButtonSlot_0"
   End Object
   Begin Object Name="ButtonSlot_0"
      Parent=/Script/UMG.Button'"LeftButton"'
      Content=/Script/UMG.TextBlock'"TextBlock_48"'
   End Object
   BackgroundColor=(R=0.000000,G=0.384823,B=1.000000,A=1.000000)
   Slots(0)=/Script/UMG.ButtonSlot'"ButtonSlot_0"'
   bExpandedInDesigner=True
   DisplayLabel="LeftButton"
End Object
Begin Object Class=/Script/UMG.TextBlock Name="TextBlock_48"
   Text=NSLOCTEXT("[2B8F420A41DCC9C2BAD9BDB56EFA4EC0]", "C1EB435A4DCBB1E955183AA714695B5A", "<-")
End Object
Begin Object Class=/Script/UMG.Button Name="RightButton"
   Begin Object Class=/Script/UMG.ButtonSlot Name="ButtonSlot_0"
   End Object
   Begin Object Name="ButtonSlot_0"
      Parent=/Script/UMG.Button'"RightButton"'
      Content=/Script/UMG.TextBlock'"TextBlock"'
   End Object
   BackgroundColor=(R=0.000000,G=0.384823,B=1.000000,A=1.000000)
   Slots(0)=/Script/UMG.ButtonSlot'"ButtonSlot_0"'
   bExpandedInDesigner=True
   DisplayLabel="RightButton"
End Object
Begin Object Class=/Script/UMG.TextBlock Name="TextBlock"
   Text=NSLOCTEXT("[2B8F420A41DCC9C2BAD9BDB56EFA4EC0]", "DCC936E1467270DD942CF4B61A42C0D2", "->")
End Object
