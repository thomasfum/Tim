
	
	function GetNodePos(part)
	{
		
		var x=part.pos_x+(part.width*PartDef[part.TimType].node_x/100);
		let y=part.pos_y+(part.height*PartDef[part.TimType].node_y/100);
		//console.log("GetNodePos = "+x+":"+y);
		
		if(part.flipH!=0)
		{
			let nx=(part.width-(part.width*PartDef[part.TimType].node_x/100));
			x=part.pos_x+nx;
		}
		return [x, y];
	}

	function flipHorizontally(img,x,y){
		//console.log("fliiiiip horizontally");
		// move to x + img's width
		ctx.translate(x+img.width,y);

		// scaleX by -1; this "trick" flips horizontally
		ctx.scale(-1,1);
		
		// draw the img
		// no need for x,y since we've already translated
		ctx.drawImage(img,0,0);
		
		// always clean up -- reset transformations to default
		ctx.setTransform(1,0,0,1,0,0);
	}

	function flipVertically(img,x,y)
	{

		//console.log("fliiiiip vertically");
		// move to y + img's height
		ctx.translate(x,y+img.height);

		// scaleY by -1; this "trick" flips vertically
		ctx.scale(1,-1);
		
		// draw the img
		// no need for x,y since we've already translated
		ctx.drawImage(img,0,0);
		
		// always clean up -- reset transformations to default
		ctx.setTransform(1,0,0,1,0,0);
	}
	function flipBoth(img,x,y)
	{

		//console.log("fliiiiip vertically");
		// move to y + img's height
		ctx.translate(x+img.width,y+img.height);

		// scaleY by -1; this "trick" flips vertically
		ctx.scale(-1,-1);
		
		// draw the img
		// no need for x,y since we've already translated
		ctx.drawImage(img,0,0);
		
		// always clean up -- reset transformations to default
		ctx.setTransform(1,0,0,1,0,0);
	}

	function drawImage(img,x,y,flipV,flipH)
	{
		
		if(wireframe==true)
			return;
		//console.log("flipH="+flipH+" flipV="+flipV);
		x=x+playgroundOffsetX;
		y=y+playgroundOffsetY;
		if((flipV==0)&&(flipH==0))
			ctx.drawImage(img, x, y);
		else if((flipV==1)&&(flipH==0))
			flipVertically(img, x, y);
		else if((flipV==0)&&(flipH==1))
			flipHorizontally(img,x,y);
		else
			flipBoth(img,x,y);
	}
		
	function drawLine(x1,y1,x2,y2, offset = 0) 
	{
		if(wireframe==true)
			return;
		var [ox, oy] = [0, 0];  
		if (offset) {
			const [dx, dy] = [x1 - x2, y1 - y2];
			const scale = offset / (dx * dx + dy * dy) ** 0.5;
			[ox, oy] = [-dy * scale, dx * scale];
		}
		ctx.beginPath();
		ctx.strokeStyle = 'black';
		ctx.lineTo(ox + x1, oy + y1);
		ctx.lineTo(ox + x2, oy + y2);
		ctx.stroke();
	}
	
	
	function AdvanceAnimation(part)
	{
		let animSpeed=10;
		
		//if(part.megaloop==undefined)
		//	part.megaloop=0;
		if(PartDef[part.TimType].animSpeed!=undefined)
			animSpeed=PartDef[part.TimType].animSpeed;
		if(animSpeed>0)
		{
			part.animDelay++;
			if(part.animDelay>animSpeed)
			{
				part.animDelay=0;
				//{
					if(part.megaloop!=5)
						part.animStep++;
					else
						if(part.animStep2<10)
							part.animStep2++;
				//}
				if(part.animStep>=part.nb_anim)
				{
					part.animStep=0;
					if(part.megaloop!=undefined)
					{
						if(part.megaloop<=5)
							part.megaloop++;
						if(part.megaloop==5)
							console.log("megaloop");
					}
					if(part.animOnce==true)
						part.animStep=part.nb_anim-1;
				}
			}
		}
	}
	
	function RefreshPartially(allObjects, part,zIndex)
	{
		//console.log("RefreshPartially ",part.no);
		if((zIndex==0)&&((PartDef[part.TimType].nb_anim!=undefined)&&(PartDef[part.TimType].nb_anim!=0)))
			return;
		if((zIndex==1)&&((PartDef[part.TimType].nb_anim==undefined)||(PartDef[part.TimType].nb_anim==0)))
			return;
		
		if((allObjects==true)||((allObjects==false)&&(part.is_moving==0))	)
		{
			//if(part.no==0)
			//	console.log("refresh 2 -",part.no);
			if((part.TimType!=8)&&(part.TimType!=10))//not belt & not rope
			{
				if(part.appearance==undefined)
				{
					//if(part.no==1)
					//	console.log("refresh 3 -",part.no);
					if((part.width>Images[part.TimType+"-0"].width)&&(part.size==undefined))
					{
						//dupliquer en width
						for (let index = 0; index < part.width/Images[part.TimType+"-0"].width; ++index) 
						{
							if(index==0)
								drawImage(Images[part.TimType+"-0"], part.pos_x+Images[part.TimType+"-0"].width*index, part.pos_y,part.flipV,part.flipH);
							else if(index==part.width/Images[part.TimType+"-0"].width-1)
								drawImage(Images[part.TimType+"-3"], part.pos_x+Images[part.TimType+"-0"].width*index, part.pos_y,part.flipV,part.flipH);
							else
							{
								if(index%2==0)
									drawImage(Images[part.TimType+"-1"], part.pos_x+Images[part.TimType+"-0"].width*index, part.pos_y,part.flipV,part.flipH);
								else
									drawImage(Images[part.TimType+"-2"], part.pos_x+Images[part.TimType+"-0"].width*index, part.pos_y,part.flipV,part.flipH);
							}
						}
					}
					else if((part.height>Images[part.TimType+"-0"].height)&&(part.size==undefined))
					{
						
						//dupliquer en height
						if(part.TimType==39)//Trampoline (39)
						{
							
							let step=0;
							let TrampolineAnim={"0":[0,1],"1":[2,3],"2":[4,5],"3":[6,1],"4":[7,1],"5":[0,1]};
							if((part.anim==undefined)||(part.anim==false))
								step=0;
							else
								step=part.animStep;
							let currentHeight=0;
							let p=TrampolineAnim[step];
							for (let index = 0; currentHeight < part.height; ++index) 
							{
								//console.log("refresh 3 -",index);
								drawImage(Images[part.TimType+"-"+p[index]], part.pos_x, part.pos_y+currentHeight,part.flipV,part.flipH);
								currentHeight+=Images[part.TimType+"-"+p[index]].height;
							}
							part.nb_anim=PartDef[part.TimType].nb_anim;
							//AdvanceAnimation(part);

						}
						else if(part.TimType==13)//Jack-in-the-box (13)
						{
							//if(part.no==11)
							//	console.log("--->reset1 "+part.anim);
							
							if((part.anim==undefined)||(part.anim==false))
							{
								//console.log("--->reset "+part.animStep);
								part.animStep=0;
								part.animStep2=0;
								part.megaloop=0;
								part.overY=0;
								part.nb_anim=PartDef[part.TimType].nb_anim;
								
							}
							//if(part.no==11)
								//console.log("--->reset2 "+part.animStep2);
							//console.log("--->"+index,+"-"+step+"-"+part.animStep);
							drawImage(Images[part.TimType+"-"+0], part.pos_x, part.pos_y,part.flipV,part.flipH);
							if(part.animStep2==0)
								drawImage(Images[part.TimType+"-"+1], part.pos_x, part.pos_y,part.flipV,part.flipH);
							else 
							{
								drawImage(Images[part.TimType+"-"+(9+part.animStep2)], part.pos_x-5, part.pos_y-Images[part.TimType+"-"+(9+part.animStep2)].height,part.flipV,part.flipH);
								part.overY=Images[part.TimType+"-"+(9+part.animStep2)].height;
							}
							
							drawImage(Images[part.TimType+"-"+(2+part.animStep)], part.pos_x+8, part.pos_y+5,part.flipV,part.flipH);
							//AdvanceAnimation(part);
						}
						else
						{
							if(part.no==0)
								console.log("refresh 4 -"+part.no+" "+part.height+"/"+Images[part.TimType+"-0"].height);
							//console.log("h:"+part.height+" / "+Images[part.TimType+"-0"].height);
							for (let index = 0; index < part.height/Images[part.TimType+"-0"].height; ++index) 
							{
								if(index==0)
									drawImage(Images[part.TimType+"-4"], part.pos_x, part.pos_y+Images[part.TimType+"-0"].height*index,part.flipV,part.flipH);
								else if(index==part.height/Images[part.TimType+"-0"].height-1)
									drawImage(Images[part.TimType+"-7"], part.pos_x, part.pos_y+Images[part.TimType+"-0"].height*index,part.flipV,part.flipH);
								else
								{
									if(index%2==0)
										drawImage(Images[part.TimType+"-5"], part.pos_x, part.pos_y+Images[part.TimType+"-0"].height*index,part.flipV,part.flipH);
									else
										drawImage(Images[part.TimType+"-6"], part.pos_x, part.pos_y+Images[part.TimType+"-0"].height*index,part.flipV,part.flipH);
								}
							}
						}
					}
					else //no duplication
					{
						let size=0;
						if(part.size!=undefined)
							size=part.size;
						
							
						if((part.anim==undefined)||(part.anim==false))
						{
							part.fixed=0;
							if(PartDef[part.TimType].fixed!=undefined)
								part.fixed=PartDef[part.TimType].fixed;
						
							part.nb_anim=PartDef[part.TimType].nb_anim;
							drawImage(Images[part.TimType+"-"+size], part.pos_x, part.pos_y,part.flipV,part.flipH);
							if(part.fixed==1)//background
								drawImage(Images[part.TimType+"-1"],part.pos_x,part.pos_y,part.flipV,part.flipH);
						}
						else
						{
							//console.log("draw "+part.TimType+"-"+(size+part.animStep));
							//if(part.no==10)
							//	console.log("anim1 "+part.no+ " "+part.name+", "+part.animOnce+", "+part.animStep+", "+part.animCleanAtEnd,+" "+part.fixed+" "+part.nb_anim);
							if((part.animOnce==true)&&(part.animStep==PartDef[part.TimType].nb_anim-1)&&(part.animCleanAtEnd==true))
							{
								//console.log("1 no image for "+part.no+" : "+part.animStep);
							}
							else
							{
								//console.log("anim1 "+part.no+ " "+part.name);
								//let x=part.pos_x;
								let x=part.pos_x;//
								let y=part.pos_y+part.height/2-Images[part.TimType+"-"+(size+part.animStep)].height/2;
								if(PartDef[part.TimType].animRight==1)
								{
									if(part.flipH==1)
									{
										x=part.pos_x;
									}
									else
									{
										x=part.pos_x+part.width-Images[part.TimType+"-"+(size+part.animStep)].width;
									}
									y=part.pos_y-38;
								}
								if(part.fixed==1)//background
									drawImage(Images[part.TimType+"-0"],part.pos_x,part.pos_y,part.flipV,part.flipH);
									
								//if(part.no==10)
								//		console.log("anim1 "+(size+part.animStep));
								drawImage(Images[part.TimType+"-"+(size+part.animStep)],x, y,part.flipV,part.flipH);
							}
						}
					}
				}
				else //part.appearance == something
				{
					//console.log("*****refresh apparence ("+part.no+") "+part.name);
					//if(part.no==0)
					//	console.log("refresh 5 -",part.no);
					//console.log("refresh "+part.no+" "+part.anim);
					let start=part.appearance.indexOf('(');
					let end=part.appearance.indexOf(')');
					let subResult = part.appearance.substring(start+1, end);
					//console.log(part.TimType+"_"+subResult);
					if((part.anim==undefined)||(part.anim==false))
						drawImage(Images[part.TimType+"-"+subResult], part.pos_x, part.pos_y,part.flipV,part.flipH);
					else
					{
						//console.log("anim2 "+part.anim);
						let val=part.animStep+parseInt(subResult);
						//console.log(part.TimType+"_"+val);
						if((part.animOnce==true)&&(part.animStep==PartDef[part.TimType].nb_anim-1)&&(part.animCleanAtEnd==true))
						{
							console.log("2 no image for "+part.no+" : "+part.animStep);
						}
						else
							drawImage(Images[part.TimType+"-"+val], part.pos_x, part.pos_y,part.flipV,part.flipH);
						//console.log("static part=",part.MatterBody);
						
						//ici !!!!
						part.MatterBody.height=Images[part.TimType+"-"+val].height;
						
						part.nb_anim=PartDef[part.TimType].nb_anim;
						//AdvanceAnimation(part);
					}							
				}
			}
		}
	}


	function getPosXRopeBody(partNo,to)
	{
		let rx=0.5;
		//console.log("getPosXRope",partNo);
		if(PartDef[LevelJson.Parts[partNo].TimType].rx!=undefined)
			rx=PartDef[LevelJson.Parts[partNo].TimType].rx;
		let ox=LevelJson.Parts[partNo].width*rx;
		if(LevelJson.Parts[partNo].TimType==7)//pulley
		{
			if(LevelJson.Parts[partNo].appearance=="top (2)")
			{
				if(to==false)
					ox=ox+7;
				else
					ox=ox-7;
			}
			if(LevelJson.Parts[partNo].appearance=="right (3)")
			{
				ox=ox+3;
			}
		}	
		return LevelJson.Parts[partNo].MatterBody.position.x+ox-LevelJson.Parts[partNo].width/2;
	}
	function getPosYRopeBody(partNo,to)
	{
		let ry=0.5;
		if(PartDef[LevelJson.Parts[partNo].TimType].ry!=undefined)
			ry=PartDef[LevelJson.Parts[partNo].TimType].ry;
		let oy=LevelJson.Parts[partNo].height*ry;
		if(LevelJson.Parts[partNo].TimType==7)//pulley
		{
			if(LevelJson.Parts[partNo].appearance=="right (3)")
			{
				if(to==false)
					oy=oy+7;
				else
					oy=oy-7;
			}
		}
		
		return LevelJson.Parts[partNo].MatterBody.position.y+oy-LevelJson.Parts[partNo].height/2;
	}
	
	function getPosXRope(partNo,to)
	{
		let rx=0.5;
		//console.log("getPosXRope",partNo);
		if(PartDef[LevelJson.Parts[partNo].TimType].rx!=undefined)
			rx=PartDef[LevelJson.Parts[partNo].TimType].rx;
		let ox=LevelJson.Parts[partNo].width*rx;
		if(LevelJson.Parts[partNo].TimType==7)//pulley
		{
			if(LevelJson.Parts[partNo].appearance=="top (2)")
			{
				if(to==false)
					ox=ox+7;
				else
					ox=ox-7;
			}
			if(LevelJson.Parts[partNo].appearance=="right (3)")
			{
				ox=ox+3;
			}
		}	
		return playgroundOffsetX+LevelJson.Parts[partNo].pos_x+ox;
	}
	function getPosYRope(partNo,to)
	{
		let ry=0.5;
		if(PartDef[LevelJson.Parts[partNo].TimType].ry!=undefined)
			ry=PartDef[LevelJson.Parts[partNo].TimType].ry;
		let oy=LevelJson.Parts[partNo].height*ry;
		if(LevelJson.Parts[partNo].TimType==7)//pulley
		{
			if(LevelJson.Parts[partNo].appearance=="right (3)")
			{
				if(to==false)
					oy=oy+7;
				else
					oy=oy-7;
			}
		}
		
		return playgroundOffsetY+LevelJson.Parts[partNo].pos_y+oy;
	}
	
	
	
	function getPosXRopePulleySimul(partNo,to)
	{
		let rx=0.5;
		//console.log("getPosXRope",partNo);
		if(PartDef[LevelJson.Parts[partNo].TimType].rx!=undefined)
			rx=PartDef[LevelJson.Parts[partNo].TimType].rx;
		let ox=LevelJson.Parts[partNo].width*rx;
		if(LevelJson.Parts[partNo].TimType==7)//pulley
		{
			if(LevelJson.Parts[partNo].appearance=="top (2)")
			{
				if(to==false)
					ox=ox+5;
				else
					ox=ox-5;
			}
			if(LevelJson.Parts[partNo].appearance=="right (3)")
			{
				ox=ox+5;
			}
		}	
		return playgroundOffsetX+LevelJson.Parts[partNo].pos_x+ox;
	}
	function getPosYRopePulleySimul(partNo,to)
	{
		let ry=0.5;
		if(PartDef[LevelJson.Parts[partNo].TimType].ry!=undefined)
			ry=PartDef[LevelJson.Parts[partNo].TimType].ry;
		let oy=LevelJson.Parts[partNo].height*ry;
		if(LevelJson.Parts[partNo].TimType==7)//pulley
		{
			if(LevelJson.Parts[partNo].appearance=="right (3)")
			{
				if(to==false)
					oy=oy+5;
				else
					oy=oy-5;
			}
			if(LevelJson.Parts[partNo].appearance=="top (2)")
			{
					oy=oy-5;
			}
		}
		
		return playgroundOffsetY+LevelJson.Parts[partNo].pos_y+oy;
	}
	
	
	function refresh( allObjects)
	{
		//if(wireframe==true)
		//	return;
		//displayScore();
		//console.log("Refresh "+allObjects);
		if(allObjects==true)
		{
			ctx.fillStyle = "rgba(0,162,162,255)";
			ctx.fillRect(0, 0, canvas.width, canvas.height-80);
			
		}
		ctx.fillStyle = "rgba(0,243,243,255)";
		ctx.fillRect(72*8, 0,80, canvas.height-80);
		
		displayRightBoard();
		partsbin={};
		let partsbinPosY=0;
		
		
		
		//--------------------------
		//step 0 //cisor
		LevelJson.Parts.forEach(part => {
			
			if(part.in_partsbin==0)
			{
				if(part.TimType==37)//cisor
				{
					if(part.anim!=true)
					{
						//console.log("cisor 2");
						if(part.flipH==1)
							drawImage(Images[part.TimType+"-1"], part.pos_x-5, part.pos_y+part.height/2,false,part.flipH);
						else
							drawImage(Images[part.TimType+"-1"], part.pos_x+20, part.pos_y+part.height/2,false,part.flipH);
					}
				}
			
			}
		});//
		
		//----------------
		//string here
		LevelJson.Parts.forEach(part => {
			if(part.TimType==10)//rope
			{
				
				if((part.connected_part_1!=undefined)&&(part.connected_part_2!=undefined))
				{
					if(CurrentLevelRunning==false)
					{
						ctx.strokeStyle = "rgb(243, 178, 0)";//243,178,0
						//console.log("rope("+part.no+"): ",part);
						ctx.beginPath();
						ctx.moveTo(getPosXRope(part.connected_part_1,false),getPosYRope(part.connected_part_1,false));
						for(var key in part.TimPulleys)
						{
							ctx.lineTo(getPosXRope(part.TimPulleys[key],true), getPosYRope(part.TimPulleys[key],true));
							ctx.moveTo(getPosXRope(part.TimPulleys[key],false), getPosYRope(part.TimPulleys[key],false));
						}
						ctx.lineTo(getPosXRope(part.connected_part_2,true),getPosYRope(part.connected_part_2,true));
						ctx.stroke();
						//part8-0
						drawImage(Images["8-0"], getPosXRope(part.connected_part_1)-20, getPosYRope(part.connected_part_1)-12,part.false,false);
						drawImage(Images["8-0"], getPosXRope(part.connected_part_2)-20, getPosYRope(part.connected_part_2)-12,part.false,false);
					}
					else
					{
						drawImage(Images["8-0"], getPosXRopeBody(part.connected_part_1)-20, getPosYRopeBody(part.connected_part_1)-12,part.false,false);
						drawImage(Images["8-0"], getPosXRopeBody(part.connected_part_2)-20, getPosYRopeBody(part.connected_part_2)-12,part.false,false);
					}
					
					
				}
			}
		});
		
		//step 1
		//z index 0
		//console.log("-------------- 0 -------------" );
		LevelJson.Parts.forEach(part => {
			if(part.in_partsbin==0)
			{
				RefreshPartially(allObjects,part,0);
			}
		});//
		//console.log("-------------- 1 -------------" );
		//z index 1 (nb_anim>0)
		LevelJson.Parts.forEach(part => {
			if(part.in_partsbin==0)
			{
				RefreshPartially(allObjects,part,1);
			}
		});//
		
		//selection
		LevelJson.Parts.forEach(part => {
			
			if(part.in_partsbin==0)
			{
				//selection
				if((part.selected==1)&&(part.TimType!=8))
				{
					ctx.beginPath();
					ctx.strokeStyle = 'lightgreen';
					if(part.overlap==true)
					{
						//console.log("overlap");
						ctx.strokeStyle = 'red';
						ctx.moveTo(part.pos_x+playgroundOffsetX-2, part.pos_y+playgroundOffsetY-2);
						ctx.lineTo(part.pos_x+playgroundOffsetX-2+ part.width+4, part.pos_y+playgroundOffsetY-2+part.height+4);
						
						ctx.moveTo(part.pos_x+playgroundOffsetX-2, part.pos_y+playgroundOffsetY-2+part.height+4);
						ctx.lineTo(part.pos_x+playgroundOffsetX-2+ part.width+4, part.pos_y+playgroundOffsetY-2);
					}
					

					ctx.rect(part.pos_x+playgroundOffsetX-2, part.pos_y+playgroundOffsetY-2, part.width+4, part.height+4);
					ctx.stroke();
					ctx.drawImage(Boards[59], part.pos_x+playgroundOffsetX-14, part.pos_y+playgroundOffsetY-12);//delette
					if(part.size!=undefined)
					{
						ctx.drawImage(Boards[60], part.pos_x+playgroundOffsetX-14, part.pos_y+playgroundOffsetY+part.height/2-6);//expand
						ctx.drawImage(Boards[60], part.pos_x+playgroundOffsetX+part.width, part.pos_y+playgroundOffsetY+part.height/2-6);//expand
					}
					
					//if((part.orientation!=undefined)||(part.direction_r_to_l!=undefined))
					if((PartDef[part.TimType].FlipH!=undefined)&&(PartDef[part.TimType].FlipH==1))
					{
						ctx.drawImage(Boards[62], part.pos_x+playgroundOffsetX-14, part.pos_y+part.height+playgroundOffsetY);//swap
					}
					if((PartDef[part.TimType].FlipV!=undefined)&&(PartDef[part.TimType].FlipV==1))
					{
						ctx.drawImage(Boards[63], part.pos_x+playgroundOffsetX+part.width, part.pos_y+part.height+playgroundOffsetY);//swap
					}
					//console.log("overlap",part);
				}	
				
			}
		});
		//part in bin
		LevelJson.Parts.forEach(part => {
			if(part.in_partsbin!=0)
			{
				part.canBeDragged=1;
				if(partsbin[part.TimType]==undefined)
				{
					partsbin[part.TimType]={};
					partsbin[part.TimType].count=1;
					let x=playgroundOffsetX+playgroundWidth+28-Icons[part.TimType].width/2;
					let y=playgroundOffsetY+partsbinPosY+110;
					part.pos_x=x;
					part.pos_y=y;
					partsbin[part.TimType].pos_x=playgroundOffsetX+playgroundWidth+28;
					partsbin[part.TimType].pos_y=y;
					partsbin[part.TimType].height=Icons[part.TimType].height;
					drawImage(Icons[part.TimType],x, y,0,0);	
					partsbinPosY+=Icons[part.TimType].height;
					partsbinPosY+=20;
				}
				else
				{
					//let x=playgroundOffsetX+playgroundWidth+28-Icons[part.TimType].width/2;
					//let y=playgroundOffsetY+partsbinPosY+110
					part.pos_x=-1;
					part.pos_y=-1;
					partsbin[part.TimType].count++;
				}
			}
		});
		
		
	
		
		//--------------------------
		//step 2 aquarium
		LevelJson.Parts.forEach(part => {
			
			if(part.in_partsbin==0)
			{
				/*
				if(part.TimType==37)//cisor
				{
					//console.log("cisor 2");
					if(part.flipH==1)
						drawImage(Images[part.TimType+"-1"], part.pos_x-5, part.pos_y+part.height/2,false,part.flipH);
					else
						drawImage(Images[part.TimType+"-1"], part.pos_x+50, part.pos_y+part.height/2,false,part.flipH);
				}
				*/
				if(part.TimType==15)//aquarium
				{
					if(part.animOnce!=true)
					{
					//console.log("aquarium");
					if(part.flipH==1)
						drawImage(Images[part.TimType+"-12"], part.pos_x-10, part.pos_y+part.height/2+3,part.flipV,part.flipH);
					else
						drawImage(Images[part.TimType+"-12"], part.pos_x+10, part.pos_y+part.height/2+3,part.flipV,part.flipH);
					}
				}
			}
		});//
		//display number in bin
		for(var key in partsbin)
		{
			ctx.font = "10px Arial";
			ctx.fillStyle = "purple";
			if (partsbin.hasOwnProperty(key))
			{
				var value=partsbin[key];
				//console.log(key+" = ",value);
				ctx.fillText(value.count,value.pos_x+5,value.pos_y+value.height+15);
			}
		}
		//draw drag belt
		if(BeltMode==2)
		{
			//console.log("BeltMode = 2 "+MouseOnPart);
			ctx.strokeStyle = 'red';
			if((MouseOnPart!=-1)&&(PartConnectionFree(MouseOnPart)==true))
			{
				//console.log("MouseOnPart = ",LevelJson.Parts[MouseOnPart].TimType);
				if(PartDef[LevelJson.Parts[MouseOnPart].TimType].node_x!=undefined)
					ctx.strokeStyle = 'lightgreen';
			}
			
			
			const  [x,y]=GetNodePos(LevelJson.Parts[beltStart]);
			
			ctx.beginPath();
			//ctx.moveTo(LevelJson.Parts[beltStart].pos_x, LevelJson.Parts[beltStart].pos_y);
			ctx.moveTo(x+playgroundOffsetX, y+playgroundOffsetY);
			ctx.lineTo(Mouse_pos_x+playgroundOffsetX, Mouse_pos_y+playgroundOffsetY);
			ctx.stroke();
		}
		//draw belts
		LevelJson.Parts.forEach(part => {
			if(part.TimType==8)//belt
			{
				//console.log("belt");
				if((part.connected_part_1!=undefined)&&(part.connected_part_2!=undefined))
				{
					//console.log("belt from "+part.connected_part_1+" to "+part.connected_part_2);
					const  [x1,y1]=GetNodePos(LevelJson.Parts[part.connected_part_1]);
					const  [x2,y2]=GetNodePos(LevelJson.Parts[part.connected_part_2]);
					drawLine(x1+playgroundOffsetX, y1+playgroundOffsetY,x2+playgroundOffsetX, y2+playgroundOffsetY,6);
					drawLine(x1+playgroundOffsetX, y1+playgroundOffsetY,x2+playgroundOffsetX, y2+playgroundOffsetY,-6);
				}
			}
		});
		displayScore();
		displayBoard();
		if(ShowWinConditions==true)
		{
			if(WinCondition[CurrentLevel]!=undefined)
			{
				for (let index = 0; index < WinCondition[CurrentLevel].Conditions.length; ++index) 
				{
					ctx.fillStyle = "rgba(0,125,125,255)";
					ctx.fillRect(WinCondition[CurrentLevel].Conditions[index].x1, WinCondition[CurrentLevel].Conditions[index].y1, WinCondition[CurrentLevel].Conditions[index].dx, WinCondition[CurrentLevel].Conditions[index].dy);
				}
			}
		}
		//level info after level load
		if((Test==false)&&(loadingLevel==true))
		{
			
			NewLevel();	
			
		}
	}