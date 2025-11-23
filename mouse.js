


	
	function PartConnectionFree(part_no)
	{
		let partFree=true;
		LevelJson.Parts.forEach(part => {
			if(part.TimType==8)//belt
			{
				if(part.connected_part_1==part_no)
				{
					partFree=false;
					console.log("PartConnectionto  "+part.no);
				}
				if(part.connected_part_2==part_no)
				{
					console.log("PartConnectionto  "+part.no);
					partFree=false;
				}
			}
		});
		//console.log("PartConnectionFree "+partFree,part_no);
		return partFree;
	}
	
	
	function PartConnectionFreeRope(part_no)
	{
		let partFree=true;
		LevelJson.Parts.forEach(part => {
			if(part.TimType==10)//rope
			{
				if(part.connected_part_1==part_no)
				{
					partFree=false;
					console.log("PartConnectionto rope "+part.no);
				}
				if(part.connected_part_2==part_no)
				{
					console.log("PartConnectionto rope "+part.no);
					partFree=false;
				}
			}
		});
		//console.log("PartConnectionFree "+partFree,part_no);
		return partFree;
	}
	
	
	function PartBeltExtremity(part_no)
	{
		let OtherPart=-1;
		LevelJson.Parts.forEach(part => {
			if(part.TimType==8)
			{
				if(part.connected_part_1==part_no)
					OtherPart=part.connected_part_2;
				if(part.connected_part_2==part_no)
					OtherPart=part.connected_part_1;
			}
		});
		return OtherPart;
	}
	
	
	function PartRopetExtremity(part_no)
	{
		let OtherPart=-1;
		LevelJson.Parts.forEach(part => {
			if(part.TimType==10)
			{
				if(part.connected_part_1==part_no)
					OtherPart=part.connected_part_2;
				if(part.connected_part_2==part_no)
					OtherPart=part.connected_part_1;
			}
		});
		return OtherPart;
	}
	
	function PartConnectionBelt(part_no)
	{
		let BeltNo=-1;
		LevelJson.Parts.forEach(part => {
			if(part.TimType==8)
			{
				if(part.connected_part_1==part_no)
					BeltNo=part.no;
				if(part.connected_part_2==part_no)
					BeltNo=part.no;
			}
		});
		return BeltNo;
	}
	
	
	function PartConnectionRope(part_no)
	{
		let BeltNo=-1;
		LevelJson.Parts.forEach(part => {
			if(part.TimType==10)
			{
				if(part.connected_part_1==part_no)
					BeltNo=part.no;
				if(part.connected_part_2==part_no)
					BeltNo=part.no;
			}
		});
		return BeltNo;
	}
	function checkConnection(pos_x,pos_y)
	{
		let no=-1;
		LevelJson.Parts.forEach(part => {
			if(doPartsOverlapMouseForBelt(part,pos_x,pos_y))
			{
				if(PartConnectionFree(part.no))
					no= part.no;
			}
		});
		return no;
	}
	function checkConnectionRope(pos_x,pos_y)
	{
		//console.log("checkConnectionRope "+pos_x+","+pos_y);
		let no=-1;
		LevelJson.Parts.forEach(part => {
			if(doPartsOverlapMouseForRope(part,pos_x,pos_y))
			{
				//console.log("isConnectionRope free "+pos_x+","+pos_y);
				if(PartConnectionFreeRope(part.no))
					no= part.no;
			}
		});
		return no;
	}

	function doPartsOverlapsPoint(part1, x,y)
	{
		let offset=0;
		
		let max1x=part1.pos_x+part1.width-offset;
		let min1x=part1.pos_x+offset;
		
		let max2x=x;
		let min2x=x;
		
		let max1y=part1.pos_y+part1.height-offset;
		let min1y=part1.pos_y+offset;
		
		let max2y=y;
		let min2y=y;
		
		let aLeftOfB = max1x <= min2x;
		let aRightOfB = min1x >= max2x;
		let aAboveB = min1y >= max2y;
		let aBelowB = max1y <= min2y;
		
		//console.log("test overlap1:"+aLeftOfB+"/"+aRightOfB+"/"+aAboveB+"/"+aBelowB,part2);
		return !( aLeftOfB || aRightOfB || aAboveB || aBelowB );
	  //}
	}

	function doPartsOverlaps(part1, part2)
	{
		let offset=0;
		if((PartDef[part1.TimType].specialTest!=undefined)||(PartDef[part2.TimType].specialTest!=undefined))
		{
			//console.log("test overlap special test");
			if(part2.is_moving!=0)
				return false;
			offset=5;
		}
		
		if(part1.no==part2.no)
			return false;
		//if(part2.no==1)
		//{
	
		let max1x=part1.pos_x+part1.width-offset;
		let min1x=part1.pos_x+offset;
		
		let max2x=part2.pos_x+part2.width;
		let min2x=part2.pos_x;
		
		let max1y=part1.pos_y+part1.height-offset;
		let min1y=part1.pos_y+offset;
		
		let max2y=part2.pos_y+part2.height;
		let min2y=part2.pos_y;
		
		let aLeftOfB = max1x <= min2x;
		let aRightOfB = min1x >= max2x;
		let aAboveB = min1y >= max2y;
		let aBelowB = max1y <= min2y;
		
		//console.log("test overlap1:"+aLeftOfB+"/"+aRightOfB+"/"+aAboveB+"/"+aBelowB,part2);
		return !( aLeftOfB || aRightOfB || aAboveB || aBelowB );
	  //}
	}
	
	function doPartsOverlapMouseForBelt(part1, x,y)
	{
			if(PartDef[part1.TimType].node_x==undefined)
				return false;
		const  [xn,yn]=GetNodePos(part1)
	/*
		let max1x=part1.pos_x+((PartDef[part1.TimType].node_x+PartDef[part1.TimType].node_d)*+part1.width)/100;
		let min1x=part1.pos_x+((PartDef[part1.TimType].node_x-PartDef[part1.TimType].node_d)*+part1.width)/100;
				
		let max1y=part1.pos_y+((PartDef[part1.TimType].node_y+PartDef[part1.TimType].node_d)*+part1.height)/100;
		let min1y=part1.pos_y+((PartDef[part1.TimType].node_y-PartDef[part1.TimType].node_d)*+part1.height)/100;
		*/
		
		let max1x=xn+(PartDef[part1.TimType].node_d*part1.width)/100;
		let min1x=xn-(PartDef[part1.TimType].node_d*part1.width)/100;
				
		let max1y=yn+(PartDef[part1.TimType].node_d*+part1.height)/100;
		let min1y=yn-(PartDef[part1.TimType].node_d*+part1.height)/100;
		
		let aLeftOfB = max1x < x;
		let aRightOfB = min1x > x;
		let aAboveB = min1y > y;
		let aBelowB = max1y < y;
		
		//console.log("test overlap1:"+aLeftOfB+"/"+aRightOfB+"/"+aAboveB+"/"+aBelowB);
		return !( aLeftOfB || aRightOfB || aAboveB || aBelowB );
	  
	}
	function doPartsOverlapMouseForRope(part1, x,y)
	{
		
		if(PartDef[part1.TimType].rx==undefined)
			return false;
		
		const  [xn,yn]=GetNodeRopePos(part1)
		
		//console.log("doPartsOverlapMouseForRope: rx exist:"+xn+","+yn);
	/*
		let max1x=part1.pos_x+((PartDef[part1.TimType].node_x+PartDef[part1.TimType].node_d)*+part1.width)/100;
		let min1x=part1.pos_x+((PartDef[part1.TimType].node_x-PartDef[part1.TimType].node_d)*+part1.width)/100;
				
		let max1y=part1.pos_y+((PartDef[part1.TimType].node_y+PartDef[part1.TimType].node_d)*+part1.height)/100;
		let min1y=part1.pos_y+((PartDef[part1.TimType].node_y-PartDef[part1.TimType].node_d)*+part1.height)/100;
		*/
		let diam=20;
		let max1x=xn+diam;
		let min1x=xn-diam;
				
		let max1y=yn+diam;
		let min1y=yn-diam;
		
		let aLeftOfB = max1x < x;
		let aRightOfB = min1x > x;
		let aAboveB = min1y > y;
		let aBelowB = max1y < y;
		
		//console.log("test overlap1:"+aLeftOfB+"/"+aRightOfB+"/"+aAboveB+"/"+aBelowB);
		return !( aLeftOfB || aRightOfB || aAboveB || aBelowB );
	  
	}
	
	


	function selectPart(part_no)
	{
		SelectedPart=part_no;
		LevelJson.Parts.forEach(part => {
			if(part.canBeDragged==1)
			{
				if(part.no==part_no)
				{
					//console.log("over "+part_no);
					if(part.selected!=1)
					{
						part.selected=1;
					}
				}
				else
					part.selected=0;
			}
		});
	}
	
	function MouseClickUp(e)
	{
		
		if((loadingLevel==true)&&(Test==false))
		{
			loadingLevel=false;
			myTimer = setInterval(myTimerBonus1, 1000);
			refresh(true);
			return;
		}
		if(CurrentLevelWinned==true)
		{
			if(CurrentLevel<MaxLevel)
				LoadLevel(CurrentLevel+1);
			return;
		}
		if(CurrentLevelRunning==true)
		{	
			stop();
			myTimer = setInterval(myTimerBonus1, 1000);
			refresh(true);
			return;
		}
		let Xclick=e.pageX-canvas.offsetLeft-playgroundOffsetX;
		let Yclick=e.pageY-canvas.offsetTop-playgroundOffsetY;
		Mouse_pos_x=e.pageX-playgroundOffsetX-canvas.offsetLeft;
		Mouse_pos_y=e.pageY-playgroundOffsetY-canvas.offsetTop;
		ExpandUnit=0;
		
		if((Mouse_pos_x>playgroundWidth+5)&&(Mouse_pos_x<playgroundWidth+65)&&(Mouse_pos_y>5)&&(Mouse_pos_y<70))
		{
			run();
		}
		//console.log("MouseClickUp:1",DraggingObject);
		if(DraggingObject!=undefined)//dragging
		{
			//console.log("MouseClickUp:2",DraggingObject);
			if(DraggingObject.TimType==8)//belt
			{
				document.getElementById("myCanvas").style.cursor =  "url('./images/MOUSE-BMP/MOUSE-8.cur'), auto";//belt cursor
				BeltMode=1;
				Dragging=false;
				BeltNoConnecting=DraggingObject.no;
			}
			else if(DraggingObject.TimType==10)//rope
			{
				document.getElementById("myCanvas").style.cursor =  "url('./images/MOUSE-BMP/MOUSE-9.cur'), auto";//rope cursor
				RopeMode=1;
				Dragging=false;
				RopeNoConnecting=DraggingObject.no;
				//console.log("RopeMode",RopeMode);
			}
			else
			{
				document.getElementById("myCanvas").style.cursor =  "url('./images/MOUSE-BMP/MOUSE-0.cur'), auto";//standatd cursor
				BeltMode=0;
				RopeMode=0;
				if(LevelJson.Parts[DraggingObject.no].pos_x+LevelJson.Parts[DraggingObject.no].width>playgroundWidth)//on the bin
				{
					LevelJson.Parts[DraggingObject.no].pos_x=-1;
					LevelJson.Parts[DraggingObject.no].pos_y=-1;
					LevelJson.Parts[DraggingObject.no].in_partsbin=1;
					refresh(true);
				}
				if(LevelJson.Parts[DraggingObject.no].overlap==true)
				{
					//console.log("overlap");
					LevelJson.Parts[DraggingObject.no].overlap=false;
					if(LevelJson.Parts[DraggingObject.no].origin_pos_x>playgroundWidth)//was on the bin
					{
						LevelJson.Parts[DraggingObject.no].in_partsbin=1;
						LevelJson.Parts[DraggingObject.no].pos_x=-1;
						LevelJson.Parts[DraggingObject.no].pos_y=-1;
					}
					else
					{
						//console.log("moveback to bin "+LevelJson.Parts[DraggingObject.no].origin_pos_x+" / " +(playgroundWidth));
						LevelJson.Parts[DraggingObject.no].pos_x=LevelJson.Parts[DraggingObject.no].origin_pos_x;
						LevelJson.Parts[DraggingObject.no].pos_y=LevelJson.Parts[DraggingObject.no].origin_pos_y;
					}
					
					refresh(true);
				}
				//here release
			}
		}
		else
		{
			if(Xclick</*playgroundOffsetX+*/playgroundWidth)//not on the bin
			{
				//console.log("MouseClickUp:2 "+BeltMode );
				let endConnection=false;
				
				if(RopeMode==0)
				{
				}
				else if(RopeMode==1)
				{
					let retNo=checkConnectionRope(Mouse_pos_x,Mouse_pos_y);
					if(retNo==-1)
					{
						endConnection=true;
						RopeMode=0;
						RopeIntermdiatePulley=[];
						LevelJson.Parts[RopeNoConnecting].connected_part_1=undefined;
						LevelJson.Parts[RopeNoConnecting].connected_part_2=undefined;
						LevelJson.Parts[RopeNoConnecting].pos_x=-1;
						LevelJson.Parts[RopeNoConnecting].pos_y=-1;
						LevelJson.Parts[RopeNoConnecting].in_partsbin=1;
						//console.log("disco ",LevelJson.Parts[RopeNoConnecting]);
						refresh(true);
					}
					else
					{
						RopeMode=2;
						//console.log("Start con rope:"+retNo);
						RopeStart=retNo
					}
						
				}	
				else if(RopeMode==2)
				{
					let retNo=checkConnectionRope(Mouse_pos_x,Mouse_pos_y);
					if(retNo==-1)
					{
						endConnection=true;
						RopeMode=0;
						RopeIntermdiatePulley=[];
						LevelJson.Parts[RopeNoConnecting].connected_part_1=undefined;
						LevelJson.Parts[RopeNoConnecting].connected_part_2=undefined;
						LevelJson.Parts[RopeNoConnecting].pos_x=-1;
						LevelJson.Parts[RopeNoConnecting].pos_y=-1;
						LevelJson.Parts[RopeNoConnecting].in_partsbin=1;
						//console.log("disco ",LevelJson.Parts[RopeNoConnecting]);
						refresh(true);
					}
					else
					{
						
						
						if(LevelJson.Parts[retNo].TimType!=7)
						{
							//console.log("end connection rope ",LevelJson.Parts[RopeNoConnecting]);
							RopeMode=0;
							endConnection=true;
							LevelJson.Parts[RopeNoConnecting].connected_part_1=RopeStart;
							LevelJson.Parts[RopeNoConnecting].connected_part_2=retNo;
							LevelJson.Parts[RopeNoConnecting].in_partsbin=0;
							LevelJson.Parts[RopeNoConnecting].TimPulleys=RopeIntermdiatePulley;

							//console.log("End con:"+retNo+" on belt"+BeltNoConnecting,LevelJson.Parts[BeltNoConnecting]);
							RopeMode=0;
							RopeIntermdiatePulley=[];
							RopeNoConnecting=-1;
							refresh(true);
						}
						else
						{
							//console.log("connection to pulley",retNo);
							RopeIntermdiatePulley.push(retNo);
							refresh(true);
						}
					}
				}
				
				if(BeltMode==0)
				{
					
				}
				else if(BeltMode==1)
				{
					let retNo=checkConnection(Mouse_pos_x,Mouse_pos_y);
					if(retNo==-1)
					{
						endConnection=true;
						BeltMode=0;
						LevelJson.Parts[BeltNoConnecting].connected_part_1=undefined;
						LevelJson.Parts[BeltNoConnecting].connected_part_2=undefined;
						LevelJson.Parts[BeltNoConnecting].pos_x=-1;
						LevelJson.Parts[BeltNoConnecting].pos_y=-1;
						LevelJson.Parts[BeltNoConnecting].in_partsbin=1;
						//console.log("disco ",LevelJson.Parts[BeltNoConnecting]);
						refresh(true);
					}
					else
					{
						BeltMode=2;
						//console.log("Start con:"+retNo);
						beltStart=retNo;
					}
				}
				else if(BeltMode==2)
				{
					
					let retNo=checkConnection(Mouse_pos_x,Mouse_pos_y);
					if(retNo==-1)
					{
						endConnection=true;
						BeltMode=0;
						LevelJson.Parts[BeltNoConnecting].connected_part_1=undefined;
						LevelJson.Parts[BeltNoConnecting].connected_part_2=undefined;
						LevelJson.Parts[BeltNoConnecting].pos_x=-1;
						LevelJson.Parts[BeltNoConnecting].pos_y=-1;
						LevelJson.Parts[BeltNoConnecting].in_partsbin=1;
						//console.log("disco ",LevelJson.Parts[BeltNoConnecting]);
						refresh(true);
					}
					else
					{
						BeltMode=0;
						endConnection=true;
						LevelJson.Parts[BeltNoConnecting].connected_part_1=beltStart;
						LevelJson.Parts[BeltNoConnecting].connected_part_2=retNo;
						LevelJson.Parts[BeltNoConnecting].in_partsbin=0;
						//console.log("End con:"+retNo+" on belt"+BeltNoConnecting,LevelJson.Parts[BeltNoConnecting]);
						BeltMode=0;
						BeltNoConnecting=-1;
						refresh(true);
					}
				}
				if(endConnection==true)
				{
					document.getElementById("myCanvas").style.cursor =  "url('./images/MOUSE-BMP/MOUSE-0.cur'), auto";//standatd cursor
					BeltMode=0;
				}
			}
		}
		Dragging=false;
		DraggingObject=undefined;
	}
	
	function isFiring(part)
	{
		if((part.TimType==18)||(part.TimType==19)||(part.TimType==36))//canon, dynamit,rocket
			return true;
		else 
			return false;
	}
	
	function needPower(part)
	{
		if((part.TimType==24)||(part.TimType==50))//Electric fan or engine
			return true;
		else 
			return false;
	}
	function isGenerator(part)
	{
		if((part.TimType==21)||(part.TimType==26)||(part.TimType==38))//Electric switch & outlet (21) or generator or Solar panels
			return true;
		else 
			return false;
	}
	function isLight(part)
	{
		if((part.TimType==29)||(part.TimType==25))//Light bulb (29) or Flashlight (25)
			return true;
		else 
			return false;
	}
	
	function connectPlugs()
	{
		LevelJson.Parts.forEach(part1 => {
			if(needPower(part1)==true)//Electric fan or engine
			{
				LevelJson.Parts.forEach(part => {
					
					if(isGenerator(part)==true)//Electric switch & outlet (21) or generator
					{
						let dx=part1.pos_x-part.pos_x;
						let dy=part1.pos_y-part.pos_y;
						let dst=Math.sqrt((dx*dx)+(dy*dy));
						//console.log("fan moving",dst);
						if(dst<100)
							connected=part.no;
					}
				});
				//connect
				if(connected!=undefined)
				{
					if(LevelJson.Parts[connected].connected_part_1==undefined)
					{
						if(LevelJson.Parts[connected].connected_part_2!=part1.no)
							LevelJson.Parts[connected].connected_part_1=part1.no;
					}
					else if(LevelJson.Parts[connected].connected_part_2==undefined)
					{
						if(LevelJson.Parts[connected].connected_part_1!=part1.no)
							LevelJson.Parts[connected].connected_part_2=part1.no;
					}
				}
			}
		});
	}
	function MouseClickDown(e)
	{
		if((loadingLevel==true)&&(Test==false))
			return;
		if(CurrentLevelWinned==true)
			return;
		if(CurrentLevelRunning==true)
			return;
		
		let Xclick=e.pageX-canvas.offsetLeft-playgroundOffsetX;
		let Yclick=e.pageY-canvas.offsetTop-playgroundOffsetY;
		if((BeltMode==0)&&(RopeMode==0))
		{
			if((SelectedPart!=undefined)&&(SelectedPart!=-1))
			{
				//console.log("SelectedPart",SelectedPart);
				Mouse_pos_x=e.pageX-playgroundOffsetX-canvas.offsetLeft;
				Mouse_pos_y=e.pageY-playgroundOffsetY-canvas.offsetTop;
				//left side
				if((Mouse_pos_x>LevelJson.Parts[SelectedPart].pos_x-14) && (Mouse_pos_x<LevelJson.Parts[SelectedPart].pos_x))
				{
					//delete
					if((Mouse_pos_y>LevelJson.Parts[SelectedPart].pos_y-14) && (Mouse_pos_y<LevelJson.Parts[SelectedPart].pos_y))
					{
						//console.log("delete");
						LevelJson.Parts[SelectedPart].in_partsbin=1;
						LevelJson.Parts[SelectedPart].pos_x=-1;
						LevelJson.Parts[SelectedPart].pos_y=-1;
						refresh(true);
					}
					//flip H
					if((Mouse_pos_y>LevelJson.Parts[SelectedPart].pos_y+LevelJson.Parts[SelectedPart].height) && (Mouse_pos_y<LevelJson.Parts[SelectedPart].pos_y+LevelJson.Parts[SelectedPart].height+14))
					{
					
							//console.log("flipH="+flipH);
							if(LevelJson.Parts[SelectedPart].flipH==0)
								LevelJson.Parts[SelectedPart].flipH=1;
							else
								LevelJson.Parts[SelectedPart].flipH=0;
							//LevelJson.Parts[SelectedPart].orientation="("+part.flipH+")";//not needed anymore
							refresh(true);
						
					}
					//expand left
					if((Mouse_pos_y>LevelJson.Parts[SelectedPart].pos_y+LevelJson.Parts[SelectedPart].height/2-8) && (Mouse_pos_y<LevelJson.Parts[SelectedPart].pos_y+LevelJson.Parts[SelectedPart].height/2+8))
					{
						//console.log("expand left");
						ExpandUnit=-1;
					}
				}
				
				//right side
				if((Mouse_pos_x>LevelJson.Parts[SelectedPart].pos_x+LevelJson.Parts[SelectedPart].width) && (Mouse_pos_x<LevelJson.Parts[SelectedPart].pos_x+LevelJson.Parts[SelectedPart].width+14))
				{
					
					//expand right
					if((Mouse_pos_y>LevelJson.Parts[SelectedPart].pos_y+LevelJson.Parts[SelectedPart].height/2-8) && (Mouse_pos_y<LevelJson.Parts[SelectedPart].pos_y+LevelJson.Parts[SelectedPart].height/2+8))
					{
						//console.log("expand right");
						ExpandUnit=1;
					}
					//flip V
					if((Mouse_pos_y>LevelJson.Parts[SelectedPart].pos_y+LevelJson.Parts[SelectedPart].height) && (Mouse_pos_y<LevelJson.Parts[SelectedPart].pos_y+LevelJson.Parts[SelectedPart].height+14))
					{
					
							//console.log("flipV="+flipV);
							if(LevelJson.Parts[SelectedPart].flipV==0)
								LevelJson.Parts[SelectedPart].flipV=1;
							else
								LevelJson.Parts[SelectedPart].flipV=0;
							//LevelJson.Parts[SelectedPart].direction_r_to_l="("+flipV+")";//not needed anymore
							refresh(true);
					
					}
				}
				
			}
			
			
			//-----------------------------
			LevelJson.Parts.forEach(part => {
				if(doPartsOverlapMouseForBelt(part,Xclick,Yclick))
				{

					if(!PartConnectionFree(part.no))
					{
						
						let beltNo=PartConnectionBelt(part.no);
						
						if(LevelJson.Parts[beltNo].connected_part_1==part.no)
						{
							//console.log("on fixed with connection "+part.no+" on belt " + beltNo+ " 1");
							LevelJson.Parts[beltNo].connected_part_1=undefined;
							beltStart=LevelJson.Parts[beltNo].connected_part_2;
							BeltNoConnecting=beltNo;
							BeltMode=2;
						}
						if(LevelJson.Parts[beltNo].connected_part_2==part.no)
						{
							console.log("on fixed with connection "+part.no+" on belt " + beltNo+ " 2");
							LevelJson.Parts[beltNo].connected_part_2=undefined;
							beltStart=LevelJson.Parts[beltNo].connected_part_1;
							BeltNoConnecting=beltNo;
							BeltMode=2;
						}
					}
					
				}
				//console.log("connect rope",part);
				if(doPartsOverlapMouseForRope(part,Xclick,Yclick))
				{
					//console.log("does mouse overlap rope to",part);
					if(!PartConnectionFreeRope(part.no))
					{
						console.log("connect rope to",part);
						let RopeNo=PartConnectionRope(part.no);
						
						if(LevelJson.Parts[RopeNo].connected_part_1==part.no)
						{
							console.log("on fixed with connection "+part.no+" on rope " + RopeNo+ " 1");
							LevelJson.Parts[RopeNo].connected_part_1=undefined;
							RopeStart=LevelJson.Parts[RopeNo].connected_part_2;
							RopeNoConnecting=RopeNo;
							RopeMode=2;
						}
						if(LevelJson.Parts[RopeNo].connected_part_2==part.no)
						{
							console.log("on fixed with connection "+part.no+" on belt " + RopeNo+ " 2");
							LevelJson.Parts[RopeNo].connected_part_2=undefined;
							RopeStart=LevelJson.Parts[RopeNo].connected_part_1;
							RopeNoConnecting=RopeNo;
							RopeMode=2;
						}
					}
				}
			});
		
			if(BeltMode==2)
				return;
			if(RopeMode==2)
				return;
			// le click est dans l'objet
			LevelJson.Parts.forEach(part => {
			
				if(part.canBeDragged==1)
				{
					let dx=part.width;
					let dy=part.height;
					if(Xclick>/*playgroundOffsetX+*/playgroundWidth)//on the bin
					{
						//console.log("in bin part"+part.no+" h="+Icons[part.TimType].height+" + y" +part.pos_y+" / yclick"+Yclick);
						dx=Icons[part.TimType].width;
						dy=Icons[part.TimType].height;
					}
					if((Xclick>part.pos_x)&&(Xclick<part.pos_x+dx)&&(Yclick>part.pos_y)&&(Yclick<part.pos_y+dy))
					{
						document.getElementById("myCanvas").style.cursor =  "url('./images/MOUSE-BMP/MOUSE-0.cur'), auto";//standatd cursor
						
						Dragging=true;
						//console.log("Drag "+part.no);
						DraggingObject=part;
						part.origin_pos_x=part.pos_x;
						part.origin_pos_y=part.pos_y;
						if(part.in_partsbin==1)
						{
							part.in_partsbin=0;
							//console.log("drag=",part);
						}
					}
				}
				else
				{
				
				}
			});	
		}
	}
	function MouseMove(e)
	{
		if((loadingLevel==true)&&(Test==false))
			return;
		if(CurrentLevelWinned==true)
			return;
		if(CurrentLevelRunning==true)
			return;
		
		let Xclick=e.pageX-canvas.offsetLeft-playgroundOffsetX;
		let Yclick=e.pageY-canvas.offsetTop-playgroundOffsetY;
		if(ExpandUnit!=0)
		{
			//let newPos_x=Math.round((e.pageX-playgroundOffsetX-canvas.offsetLeft)/16)*16+8;
			let newPos_x=e.pageX-playgroundOffsetX-canvas.offsetLeft;
			//console.log("expand part "+SelectedPart + " direction "+ExpandUnit);
			if(ExpandUnit==-1) //expand left
			{
				if(newPos_x<LevelJson.Parts[SelectedPart].pos_x+LevelJson.Parts[SelectedPart].width)
				{
					let div=LevelJson.Parts[SelectedPart].pos_x - newPos_x;
					//console.log("expand left: "+div+" "+newPos_x+" / "  +LevelJson.Parts[SelectedPart].pos_x);
					if(div>16)
					{
						//console.log("expand");
						if(LevelJson.Parts[SelectedPart].size<3)
						{
							LevelJson.Parts[SelectedPart].size++;
							LevelJson.Parts[SelectedPart].width+=16;
							LevelJson.Parts[SelectedPart].pos_x-=16;
							refresh(true);
						}
					}
					if(div<-16)
					{
						//console.log("stretch");
						if(LevelJson.Parts[SelectedPart].size>0)
						{
							LevelJson.Parts[SelectedPart].size--;
							LevelJson.Parts[SelectedPart].width-=16;
							LevelJson.Parts[SelectedPart].pos_x+=16;
							refresh(true);
						}
					}
				}
				
			}
			if(ExpandUnit==1) //expand right
			{
				if(newPos_x>LevelJson.Parts[SelectedPart].pos_x)
				{
					let div=newPos_x- (LevelJson.Parts[SelectedPart].pos_x+LevelJson.Parts[SelectedPart].width);
					//console.log("expand right: "+div+" "+newPos_x+" / " +(LevelJson.Parts[SelectedPart].pos_x+LevelJson.Parts[SelectedPart].width));
					if(div>16)
					{
						if(LevelJson.Parts[SelectedPart].size<3)
						{
							LevelJson.Parts[SelectedPart].size++;
							LevelJson.Parts[SelectedPart].width+=16;
							refresh(true);
						}
					}
					if(div<-16)
					{
						if(LevelJson.Parts[SelectedPart].size>0)
						{
							LevelJson.Parts[SelectedPart].size--;
							LevelJson.Parts[SelectedPart].width-=16;
							refresh(true);
						}
					}
				}
				
			}
		}
		
		if(Dragging==true)
		{
			//	  console.log(DraggingObject);
			//DraggingObject.pos_x=e.pageX-playgroundOffsetX-canvas.offsetLeft-DraggingObject.width/2;
			//DraggingObject.pos_y=e.pageY-playgroundOffsetY-canvas.offsetTop-DraggingObject.height/2;
			
			if(PartDef[DraggingObject.TimType].stick==1)
			{
				DraggingObject.pos_x=Math.round((e.pageX-playgroundOffsetX-canvas.offsetLeft-DraggingObject.width/2)/16)*16+8;
				DraggingObject.pos_y=Math.round((e.pageY-playgroundOffsetY-canvas.offsetTop-DraggingObject.height/2)/16)*16+8;
			}
			else
			{
				DraggingObject.pos_x=Math.round(e.pageX-playgroundOffsetX-canvas.offsetLeft-DraggingObject.width/2);
				DraggingObject.pos_y=Math.round(e.pageY-playgroundOffsetY-canvas.offsetTop-DraggingObject.height/2);
			}
			selectPart(DraggingObject.no);
			let overlap=false;
			LevelJson.Parts.forEach(part => {
					
					if(doPartsOverlaps(DraggingObject,part))
					{
						overlap=true;
					}
					
				});
			if(overlap==true)
			{
				//console.log("overlap");
				DraggingObject.overlap=true;
			}
			else
				DraggingObject.overlap=false;
			
			if(needPower(DraggingObject))//Electric fan or engine
			{
				//console.log("electric moving");
				let connected=undefined;
				LevelJson.Parts.forEach(part => {
					
					if(isGenerator(part)==true)//Electric switch & outlet (21) or generator
					{
						let dx=DraggingObject.pos_x-part.pos_x;
						let dy=DraggingObject.pos_y-part.pos_y;
						let dst=Math.sqrt((dx*dx)+(dy*dy));
						//console.log("electric moving to a generator",dst);
						if(dst<100)
							connected=part.no;
					}
				});
				//connect
				if(connected!=undefined)
				{
					if(LevelJson.Parts[connected].connected_part_1==undefined)
					{
						if(LevelJson.Parts[connected].connected_part_2!=DraggingObject.no)
							LevelJson.Parts[connected].connected_part_1=DraggingObject.no;
					}
					else if(LevelJson.Parts[connected].connected_part_2==undefined)
					{
						if(LevelJson.Parts[connected].connected_part_1!=DraggingObject.no)
							LevelJson.Parts[connected].connected_part_2=DraggingObject.no;
					}
					//console.log("electric moving to a generator",LevelJson.Parts[connected]);
				}
				else
				{
					//disconnect
					LevelJson.Parts.forEach(part => {
						
						if(isGenerator(part)==true)//Electric switch & outlet (21) or generator
						{
							if(part.connected_part_1==DraggingObject.no)
								part.connected_part_1=undefined;
							if(part.connected_part_2==DraggingObject.no)
								part.connected_part_2=undefined;	
						}
						
					});
				}
			}
			
			refresh(true);
		}
		else//over
		{
			let onPartNo=-1;
			Xclick=e.pageX-canvas.offsetLeft-playgroundOffsetX;
			Yclick=e.pageY-canvas.offsetTop-playgroundOffsetY;
			if(LevelJson!=undefined)
			{
				let onFixed=false;
				let onDraggable=false;
				LevelJson.Parts.forEach(part => {
					if(part.canBeDragged==1)
					{
						let dx=part.width;
						let dy=part.height;
						if(Xclick>/*playgroundOffsetX+*/playgroundWidth)//on the bin
						{
							//console.log("in bin");
							dx=Icons[part.TimType].width;
							dy=Icons[part.TimType].height;
						}
						if((Xclick>part.pos_x)&&(Xclick<part.pos_x+dx)&&(Yclick>part.pos_y)&&(Yclick<part.pos_y+dy))
						{
							if(BeltMode==1)
								document.getElementById("myCanvas").style.cursor =  "url('./images/MOUSE-BMP/MOUSE-8.cur'), auto";//belt cursor
							else if(RopeMode==1)
								document.getElementById("myCanvas").style.cursor =  "url('./images/MOUSE-BMP/MOUSE-9.cur'), auto";//rope cursor
							else
								document.getElementById("myCanvas").style.cursor =  "url('./images/MOUSE-BMP/MOUSE-2.cur'), auto";//drag cursor
							onPartNo=part.no;
							selectPart(part.no);
							refresh(true);
							onDraggable=true;
						}
					}
					else
					{
						let dx=part.width;
						let dy=part.height;
						if((Xclick>part.pos_x)&&(Xclick<part.pos_x+dx)&&(Yclick>part.pos_y)&&(Yclick<part.pos_y+dy))
						{
							onFixed=true;
							onPartNo=part.no;
							//console.log("onFixed");
						}
					}
					
				});
				if(onDraggable==false)
				{
					
					//selectPart(-1);
					//console.log("not over");
					if((BeltMode==0)&&(RopeMode==0))
						document.getElementById("myCanvas").style.cursor =  "url('./images/MOUSE-BMP/MOUSE-0.cur'), auto";//standatd cursor
					if(BeltMode!=0)
						document.getElementById("myCanvas").style.cursor =  "url('./images/MOUSE-BMP/MOUSE-8.cur'), auto";//belt cursor
					if(RopeMode!=0)
						document.getElementById("myCanvas").style.cursor =  "url('./images/MOUSE-BMP/MOUSE-9.cur'), auto";//rope cursor
				}
			}
			MouseOnPart=onPartNo;
			if((BeltMode==2)||(RopeMode==2))
			{
				Mouse_pos_x=e.pageX-playgroundOffsetX-canvas.offsetLeft;
				Mouse_pos_y=e.pageY-playgroundOffsetY-canvas.offsetTop;
				refresh(true);
			}
			
		}
	}