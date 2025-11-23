
	
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

	function GetNodeRopePos(part)
	{
		
	
		
		var x=part.pos_x+(part.width*PartDef[part.TimType].rx);
		let y=part.pos_y+(part.height*PartDef[part.TimType].ry);
		//console.log("GetNodePos = "+x+":"+y);
		
		if(part.flipH!=0)
		{
			let nx=(part.width-(part.width*PartDef[part.TimType].rx));
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
		//console.log("draw image "+img.src);
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
			if(part.anim==true)
				part.animDelay++;
			if(part.animDelay>animSpeed)
			{
				part.animDelay=0;
				if(part.megaloop!=5)
					part.animStep++;
				else
					if(part.animStep2<10)
						part.animStep2++;
				if(part.animStep>=part.nb_anim)
				{
					if(part.fixed==1)
						part.animStep=1;
					else
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
	
	function RefreshPartially(allObjects, part,zIndex,allObjects)
	{
		//console.log("RefreshPartially ",part.no);
		if((zIndex==0)&&((PartDef[part.TimType].nb_anim!=undefined)&&(PartDef[part.TimType].nb_anim!=0)))
			return;
		if((zIndex==1)&&((PartDef[part.TimType].nb_anim==undefined)||(PartDef[part.TimType].nb_anim==0)))
			return;
		if((zIndex==3)&&(PartDef[part.TimType].zIndex!=3))
			return;
		if(part.visible==false)			
			return;
			
		if((PartDef[part.TimType].zIndex==-1)&&(allObjects==false))
		{
			//console.log("zIndex -1 ",part.no);
			ctx.globalCompositeOperation = "destination-over";
		}
		else
			ctx.globalCompositeOperation = "source-over";
/*				
		
			ctx.fillStyle = "rgba(0,0,162,255)";
			ctx.fillRect(0, 0, 100, 100);
		ctx.globalCompositeOperation = "source-over";
*/
		
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
					if((part.width>Images[part.TimType+"-0"].width)&&(part.size==undefined)&&(part.TimType!=24)&&(part.TimType!=26)&&(part.TimType!=18))//electrical fan, canon
					{
						//console.log("refresh 3 -",part.no);
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
					else if((part.height>Images[part.TimType+"-0"].height)&&(part.size==undefined)&&(part.TimType!=24)&&(part.TimType!=26)&&(part.TimType!=18))
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
						else if(part.TimType==36)//rocket
						{
							
							drawImage(Images[part.TimType+"-0"], part.pos_x, part.pos_y+0,part.flipV,part.flipH);
							drawImage(Images[part.TimType+"-1"], part.pos_x-2, part.pos_y+Images[part.TimType+"-0"].height-7,part.flipV,part.flipH);
							
						}
						else{
							if(part.no==13)
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
						
						//console.log("refresh 4 -",part.no);
						let size=0;
						if(part.size!=undefined)
							size=part.size;
						
							
						if((part.anim==undefined)||(part.anim==false))
						{
							
							if(part.TimType==18)//canon
							{
								drawImage(Images[part.TimType+"-"+0], part.pos_x, part.pos_y,part.flipV,part.flipH);
								if(part.flipH==0)
									drawImage(Images[part.TimType+"-"+9], part.pos_x+9, part.pos_y+13,part.flipV,part.flipH);
								else
									drawImage(Images[part.TimType+"-"+9], part.pos_x+15, part.pos_y+13,part.flipV,part.flipH);
							}
							else if(part.TimType==21)//Electric switch & outlet 
							{
								if(allObjects==true)
									drawImage(Images[part.TimType+"-"+size], part.pos_x, part.pos_y,part.flipV,part.flipH);
								//console.log("switch");
								if(part.switch=="down")
								{
									drawImage(Images[part.TimType+"-2"],part.pos_x+8,part.pos_y+7,part.flipV,part.flipH);
								}
								if(part.switch=="up")
								{
									drawImage(Images[part.TimType+"-1"],part.pos_x+8,part.pos_y+8,part.flipV,part.flipH);
								}
								if(part.connected_part_1!=undefined)
								{
									drawImage(Images[part.TimType+"-3"],part.pos_x+29,part.pos_y+4,part.flipV,part.flipH);
								}
								if(part.connected_part_2!=undefined)
								{
									drawImage(Images[part.TimType+"-3"],part.pos_x+29,part.pos_y+18,part.flipV,part.flipH);
								}
								if(allObjects==false)
									drawImage(Images[part.TimType+"-"+size], part.pos_x, part.pos_y,part.flipV,part.flipH);
							}
							else
							{
								
								//if(part.no==21)
								//	console.log("dynamite",part);
								let x=part.pos_x;//
								let y=part.pos_y+part.height/2-Images[part.TimType+"-"+size].height/2;
								//console.log("refresh 4 s-"+part.no + x+","+y);
								part.fixed=0;
								if(PartDef[part.TimType].fixed!=undefined)
									part.fixed=PartDef[part.TimType].fixed;
								part.nb_anim=PartDef[part.TimType].nb_anim;
								//console.log("draw "+part.TimType+"-"+size);
								drawImage(Images[part.TimType+"-"+size], x, y,part.flipV,part.flipH);
								if(part.fixed==1)//background
									drawImage(Images[part.TimType+"-1"],x,y,part.flipV,part.flipH);
									
								if(part.TimType==26)//Generator (26)
								{
									if(part.connected_part_1!=undefined)
									{
										drawImage(Images[part.TimType+"-5"],part.pos_x+5,part.pos_y+4,part.flipV,part.flipH);
									}
									if(part.connected_part_2!=undefined)
									{
										drawImage(Images[part.TimType+"-5"],part.pos_x+5,part.pos_y+18,part.flipV,part.flipH);
									}
								}
								if(part.TimType==38)//Solar panels (38)
								{
									if(part.connected_part_1!=undefined)
									{
										drawImage(Images[part.TimType+"-1"],part.pos_x+52,part.pos_y+4,part.flipV,part.flipH);
									}
									if(part.connected_part_2!=undefined)
									{
										drawImage(Images[part.TimType+"-1"],part.pos_x+52,part.pos_y+18,part.flipV,part.flipH);
									}
								}
								
							}
							
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
							else if(part.TimType==18)//canon
							{
								//
								let ox_e=0;
								let ox_e2=0;
								let ox_1=0;
								let ox_2=0;
								let ox_3=0;
								let ox_4=0;
								let ox_5=0;
								let ox_o=0;
								if(part.flipH==1)
								{
									ox_e=60;
									ox_e2=59;//8
									ox_1=22;//8
									ox_2=16;//0
									ox_3=-36;//<<32
									ox_4=-36;//>>
									ox_5=-4;
									ox_o=-180;
									//console.log("rrr",part.width);
								}
								if(part.animStep<5)
								{
									//console.log("cannon "+part.TimType+"-"+(part.animStep+10),Images );
									drawImage(Images[part.TimType+"-"+(part.animStep+10)], part.pos_x-4+ox_e, part.pos_y-4,part.flipV,part.flipH);
									drawImage(Images[part.TimType+"-"+0], part.pos_x, part.pos_y,part.flipV,part.flipH);
								}
								else
								{
									if(part.animStep==5)
										drawImage(Images[part.TimType+"-"+1], part.pos_x-7+ox_1, part.pos_y-8,part.flipV,part.flipH);
									if(part.animStep==6)
										drawImage(Images[part.TimType+"-"+2], part.pos_x-8+ox_2, part.pos_y-11,part.flipV,part.flipH);
									if(part.animStep==7)
									{
										drawImage(Images[part.TimType+"-"+3], part.pos_x+ox_3, part.pos_y-8,part.flipV,part.flipH);
										drawImage(Images[part.TimType+"-"+4], part.pos_x+86+ox_3+ox_o, part.pos_y-39,part.flipV,part.flipH);
									}
									if(part.animStep==8)
									{
										drawImage(Images[part.TimType+"-"+5], part.pos_x+ox_4, part.pos_y-12,part.flipV,part.flipH);
										drawImage(Images[part.TimType+"-"+6], part.pos_x+86+10+ox_4+ox_o, part.pos_y-39-5,part.flipV,part.flipH);
									}
									if(part.animStep==9)
									{
										drawImage(Images[part.TimType+"-"+7], part.pos_x+ox_5, part.pos_y-10,part.flipV,part.flipH);
										drawImage(Images[part.TimType+"-"+8], part.pos_x+86+10+ox_5+ox_o, part.pos_y-39-5,part.flipV,part.flipH);
									}
									if(part.animStep>9)
									{
										drawImage(Images[part.TimType+"-"+0], part.pos_x, part.pos_y,part.flipV,part.flipH);
										drawImage(Images[part.TimType+"-"+15], part.pos_x-1+ox_e2, part.pos_y+2,part.flipV,part.flipH);
									}
								}
								
								
								//wheel
								if(part.flipH==0)
									drawImage(Images[part.TimType+"-"+9], part.pos_x+9, part.pos_y+13,part.flipV,part.flipH);
								else
									drawImage(Images[part.TimType+"-"+9], part.pos_x+15, part.pos_y+13,part.flipV,part.flipH);
								
							}
							else
							{
								//console.log("anim1 "+part.no+ " "+part.name);
								//let x=part.pos_x;
								let x=part.pos_x;//
								let y=part.pos_y+part.height/2-Images[part.TimType+"-"+(size+part.animStep)].height/2;
								
								if(PartDef[part.TimType].at=="tl")
								{
									if(part.flipH==1)
									{
										x=part.pos_x+part.width-Images[part.TimType+"-"+(size+part.animStep)].width;
									}
									else
									{
										x=part.pos_x;
									}
									y=part.pos_y-part.height/2;
									
								}
								
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
								if(PartDef[part.TimType].animLeft==1)
								{
									if(part.flipH==1)
									{
										
										x=part.pos_x+part.width-Images[part.TimType+"-"+(size+part.animStep)].width;
									}
									else
									{
										x=part.pos_x;
									}
									y=part.pos_y;
								}
								
								//console.log("refresh 4 d-"+part.no + x+","+y);
								if(part.fixed==1)//background
									//drawImage(Images[part.TimType+"-0"],part.pos_x,part.pos_y,part.flipV,part.flipH);
									drawImage(Images[part.TimType+"-0"],x,y,part.flipV,part.flipH);
									
								//if(part.no==10)
								//		console.log("anim1 "+(size+part.animStep));
								drawImage(Images[part.TimType+"-"+(size+part.animStep)],x, y,part.flipV,part.flipH);
								
								if(part.TimType==26)//Generator (26)
								{
									if(part.connected_part_1!=undefined)
									{
										drawImage(Images[part.TimType+"-5"],part.pos_x+5,part.pos_y+4,part.flipV,part.flipH);
									}
									if(part.connected_part_2!=undefined)
									{
										drawImage(Images[part.TimType+"-5"],part.pos_x+5,part.pos_y+18,part.flipV,part.flipH);
									}
								}
							}
						}
					}
				}
				else //part.appearance == something
				{
					//console.log("refresh 4 -",part.no);
					//console.log("*****refresh apparence ("+part.no+") "+part.name);
					//if(part.no==0)
					//	console.log("refresh 5 -",part.no);
					//console.log("refresh "+part.no+" "+part.anim);
					let start=part.appearance.indexOf('(');
					let end=part.appearance.indexOf(')');
					let subResult = part.appearance.substring(start+1, end);
					//console.log(part.TimType+"_"+subResult);
					if(part.TimType==29)//Light bulb (29)
					{
						if((part.anim==undefined)||(part.anim==false))
						{
							drawImage(Images[part.TimType+"-"+subResult], part.pos_x, part.pos_y,part.flipV,part.flipH);
							if(subResult==0)
								drawImage(Images[part.TimType+"-"+4], part.pos_x+21, part.pos_y+28,part.flipV,part.flipH);
							else
								drawImage(Images[part.TimType+"-"+4], part.pos_x+21, part.pos_y+4,part.flipV,part.flipH);
						}
						else
						{
							if(subResult==0)
							{
								drawImage(Images[part.TimType+"-"+(parseInt(subResult)+1)], part.pos_x-8, part.pos_y-18,part.flipV,part.flipH);
								drawImage(Images[part.TimType+"-"+5], part.pos_x+21, part.pos_y+28,part.flipV,part.flipH);
							}
							else
															{
								drawImage(Images[part.TimType+"-"+(parseInt(subResult)+1)], part.pos_x-8, part.pos_y,part.flipV,part.flipH);
								drawImage(Images[part.TimType+"-"+5], part.pos_x+21, part.pos_y+4,part.flipV,part.flipH);
							}
						}
					}
					else if((part.anim==undefined)||(part.anim==false))
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
	
		else//moving part
		{

			if(part.TimType==36)//rocket
			{
				if(part.anim==true)
				{
					if(part.animStep<8)
					{
						let x=part.MatterBody.position.x;
						let y=part.MatterBody.position.y;	
						part.pos_x=x;
						part.pos_y=y;
						if(part.animStep>=6)
							x=x+2;
						drawImage(Images[part.TimType+"-"+(part.animStep+1)], x-Images[part.TimType+"-0"].width/2-12, y+Images[part.TimType+"-0"].height/2-12,0,0);
					}
					else
					{
						
						let anim=(part.animStep-7)%2;
						//console.log("rocket "+anim);
						
						let x=part.MatterBody.position.x;
						let y=part.MatterBody.position.y;	
						part.pos_x=x;
						part.pos_y=y;
						drawImage(Images[part.TimType+"-"+(anim+9)], x-Images[part.TimType+"-0"].width/2-12+2, y+Images[part.TimType+"-0"].height/2-12,0,0);
						
					}
				}
				else
					drawImage(Images[part.TimType+"-"+1], part.MatterBody.position.x-Images[part.TimType+"-0"].width-4, part.MatterBody.position.y+Images[part.TimType+"-0"].height/2-12,0,0);
					
			}			
			if((part.TimType==45)&&(part.anim==true))//Candle (45)
			{
				part.animOnce=false;
				part.fixed=1;
				let x=part.MatterBody.position.x;
				let y=part.MatterBody.position.y;	
				drawImage(Images[part.TimType+"-"+part.animStep], x-18, y-24,0,0);
			}
			if((part.TimType==19)&&(part.anim==true))//dynamite
			{
				if(part.animStep<6)
				{
					let x=part.MatterBody.position.x;
					let y=part.MatterBody.position.y;	
					part.pos_x=x;
					part.pos_y=y;
					
					//console.log("dynamite anim"+part.animStep +" x="+x+", y="+y,PartDef[part.TimType].nb_anim);
					//drawImage(Images[part.TimType+"-"+part.animStep], x, y,part.flipV,part.flipH);
					if(part.flipH==1)
					{
						x=x-40+(part.animStep);
						
					}
					y=y-10+(part.animStep*2);
					drawImage(Images[part.TimType+"-"+part.animStep], x, y,0,0);
				}
				else if(part.animStep<12)
				{
					//console.log("dynamite explode 41-"+(part.animStep-6) +" x="+part.pos_x+", y="+part.pos_y,PartDef[part.TimType].nb_anim);
					drawImage(Images["41-"+(part.animStep-6)], part.pos_x-Images["41-"+(part.animStep-6)].width/2, part.pos_y-Images["41-"+(part.animStep-6)].height/2,0,0);
				}
					
				//drawImage(Images[part.TimType+"-"+0], part.pos_x, part.pos_y,part.flipV,part.flipH);
			}
		}
		ctx.globalCompositeOperation = "source-over";
	
	}


	
	function getPosXRopeBody(partNo)
	{
		let x=0;
		engine.world.constraints.forEach((constraint)=>{
			//console.log("constraint :",constraint.bodyA);
			if(constraint.bodyA!=undefined)
			{
				if(constraint.bodyB!=undefined)
				{
					if((constraint.bodyA.TimNo==partNo)&&(constraint.bodyB.label=="rope"))
					{
						x= constraint.bodyA.position.x+constraint.pointA.x;
						//console.log("---------------XRopeBody A",x);
					}
				
					if((constraint.bodyB.TimNo==partNo)&&(constraint.bodyA.label=="rope"))
					{
						x= constraint.bodyB.position.x+constraint.pointB.x;				
						//console.log("---------------XRopeBody B",x);
					}
				}
			}	
		});
		return x;
	}
	
	function getPosYRopeBody(partNo)
	{
		let y=0;
		engine.world.constraints.forEach((constraint)=>{
			//console.log("constraint :",constraint.bodyA);
			if(constraint.bodyA!=undefined)
			{
				if(constraint.bodyB!=undefined)
				{
				
					if((constraint.bodyA.TimNo==partNo)&&(constraint.bodyB.label=="rope"))
					{
						y= constraint.bodyA.position.y+constraint.pointA.y;							
						//console.log("---------------YRopeBody A",y);
					}
				
					if((constraint.bodyB.TimNo==partNo)&&(constraint.bodyA.label=="rope"))
					{
						y= constraint.bodyB.position.y+constraint.pointB.y;
						//console.log("---------------YRopeBody B",y);
					}
				}
			}	
		});
		return y;
	}
	
	
	function getPosXFire(partNo)
	{
	
		let fx=0.5;	
		//console.log("getPosXRope",partNo);
		if(PartDef[LevelJson.Parts[partNo].TimType].fx!=undefined)
			fx=PartDef[LevelJson.Parts[partNo].TimType].fx;
		let ox=LevelJson.Parts[partNo].width*fx;	
		if(LevelJson.Parts[partNo].flipH==0)
			return playgroundOffsetX+LevelJson.Parts[partNo].pos_x+ox;
		else
			return playgroundOffsetX+LevelJson.Parts[partNo].pos_x+LevelJson.Parts[partNo].width-ox;
		
	}
	function getPosYFire(partNo)
	{
		let fy=0.5;
		if(PartDef[LevelJson.Parts[partNo].TimType].fy!=undefined)
			fy=PartDef[LevelJson.Parts[partNo].TimType].fy;
		let oy=LevelJson.Parts[partNo].height*fy;
		return playgroundOffsetY+LevelJson.Parts[partNo].pos_y+oy;
	}
	function getPosXRope(partNo,to)
	{
		
		
		if((CurrentLevel==13)&&(partNo==6))//TRICK_13
		{
			
			let rx2=0.5;
			if(PartDef[LevelJson.Parts[partNo].TimType].rx2!=undefined)
				rx2=PartDef[LevelJson.Parts[partNo].TimType].rx2;
			//console.log("GetNodePosX level 13 ",rx2);
			let ox=LevelJson.Parts[partNo].width*rx2;
			return playgroundOffsetX+LevelJson.Parts[partNo].pos_x+ox;
		}
		
		
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
		if(LevelJson.Parts[partNo].flipH==0)
			return playgroundOffsetX+LevelJson.Parts[partNo].pos_x+ox;
		else
			return playgroundOffsetX+LevelJson.Parts[partNo].pos_x+LevelJson.Parts[partNo].width-ox;
	}
	function getPosYRope(partNo,to)
	{
		
		if((CurrentLevel==13)&&(partNo==6))//TRICK_13
		{
			
			let ry2=0.5;
			if(PartDef[LevelJson.Parts[partNo].TimType].ry2!=undefined)
				ry2=PartDef[LevelJson.Parts[partNo].TimType].ry2;
			//console.log("GetNodePosY level 13 ",ry2);
			let oy=LevelJson.Parts[partNo].height*ry2;
			return playgroundOffsetY+LevelJson.Parts[partNo].pos_y+oy;
		}
		
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
			if(LevelJson.Parts[partNo].appearance=="left (1)")
			{
				
				if(to==false)
					oy=oy+7;
				else
					oy=oy-7;
			}
		}
		
		if(LevelJson.Parts[partNo].flipV==0)
			return playgroundOffsetY+LevelJson.Parts[partNo].pos_y+oy;
		else
			return playgroundOffsetY+LevelJson.Parts[partNo].pos_y+LevelJson.Parts[partNo].height-oy;
		
	}
	
	function getRopeDirectionY(partNoExtremity)
	{
		
		let LastPartNo=-1;
		let ropeNo=-1;
		LevelJson.Parts.forEach(part => {
			if(part.TimType==10)
			{
				if(part.connected_part_1==partNoExtremity)
				{
					ropeNo=part.no;
					LastPartNo=part.connected_part_2;
				}
				if(part.connected_part_2==partNoExtremity)
				{
					ropeNo=part.no;
					LastPartNo=part.connected_part_1;
				}
			}
		});
		if(LastPartNo==-1)
			return 0;
			
		if(engine.timing.timestamp<250)//let rope stabilize
		{
			LevelJson.Parts[LastPartNo].MatterBody.refVelocityY=LevelJson.Parts[LastPartNo].MatterBody.velocity.y;
			console.log("+++++++++++++++++++++++++++set ref"+LevelJson.Parts[LastPartNo].MatterBody.refVelocityY);
		}
		if(engine.timing.timestamp>250)//let rope stabilize
		{
			
			let otherX=getPosXRopeBody(LastPartNo);
			let otherY=getPosYRopeBody(LastPartNo);
			let revert=1;
			if((ropeNo!=-1)&&(LevelJson.Parts[ropeNo].TimPulleys.length>0))
			{
				console.log("through at pulley",LevelJson.Parts[ropeNo].TimPulleys);
				//if(LevelJson.Parts[ropeNo].TimPulleys[0].pos_y>otherY)//revert direction
					revert=-1;
					
					otherX=getPosXRopeBody(LevelJson.Parts[ropeNo].TimPulleys[0].no);
					otherY=getPosYRopeBody(LevelJson.Parts[ropeNo].TimPulleys[0].no);
					
			}
			
				

			let part=LevelJson.Parts[partNoExtremity];
			//console.log("velocity.y:",LevelJson.Parts[LastPartNo].MatterBody.velocity.y);
			if(part.no==22)
				console.log("last="+otherX+", "+otherY+" v="+LevelJson.Parts[LastPartNo].MatterBody.velocity.y,LevelJson.Parts[LastPartNo].MatterBody); 
			if(part.no==22)
				console.log("start=",part); 
			if((otherX>part.pos_x-10)&&(otherX<part.pos_x+part.width+10))
			{
				console.log("In X=",part); 
				if(revert==1)//direct 
				{
					if(otherY>part.pos_y+part.height)//need to be below
					{
						if(part.no==22)
							console.log("below="+(LevelJson.Parts[LastPartNo].MatterBody.velocity.y+" / "+ LevelJson.Parts[LastPartNo].MatterBody.refVelocityY)); 
						if(LevelJson.Parts[LastPartNo].MatterBody.velocity.y>0.025)
							return 1;						
					}
				
					if(otherY<part.pos_y+part.height)//need to be upper
					{
						console.log("upper=",part); 
						if(LevelJson.Parts[LastPartNo].MatterBody.velocity.y<-0.025*revert)
							return -1;							
					}
					
				}
				else
				{
					if(otherY>part.pos_y+part.height)//need to be below
					{
						if((part.no==22)&&(LevelJson.Parts[LastPartNo].MatterBody.velocity.y<0.2))
							console.log("below inv="+(LevelJson.Parts[LastPartNo].MatterBody.velocity.y+" / "+ LevelJson.Parts[LastPartNo].MatterBody.refVelocityY)); 
						if(LevelJson.Parts[LastPartNo].MatterBody.velocity.y<-0.015)
							return 1;						
					}
					if(otherY<part.pos_y+part.height)//need to be upper
					{
						console.log("upper=",part); 
						if(LevelJson.Parts[LastPartNo].MatterBody.velocity.y<-0.025*revert)
							return -1;							
					}
				}
				
			}
			
		}
		
		return 0;
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
			if((LevelJson.Parts[partNo].appearance=="top (2)")||(LevelJson.Parts[partNo].appearance=="bottom (0)"))
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
			if(LevelJson.Parts[partNo].appearance=="left (1)")
			{
				//console.log("getPosXRopePulleySimul -5");
				ox=ox-5;
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
			if(LevelJson.Parts[partNo].appearance=="left (1)")
			{
				//console.log("getPosYRopePulleySimul -5");
				if(to==false)
					oy=oy+5;
				else
					oy=oy-5;
			}
			if(LevelJson.Parts[partNo].appearance=="top (2)")
			{
				oy=oy-5;
			}
			if(LevelJson.Parts[partNo].appearance=="bottom (0)")
			{
				oy=oy+5;
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
		//step 0 
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
		
		
		
		
		//step 1
		//z index 0
		//console.log("-------------- 0 -------------" );
		LevelJson.Parts.forEach(part => {
			if(part.in_partsbin==0)
			{
				RefreshPartially(allObjects,part,0,allObjects);
			}
		});//
		//console.log("-------------- 1 -------------" );
		//z index 1 (nb_anim>0)
		LevelJson.Parts.forEach(part => {
			if(part.in_partsbin==0)
			{
				RefreshPartially(allObjects,part,1,allObjects);
			}
		});//
		
		//----------------
		//string here
		LevelJson.Parts.forEach(part => {
			
			if(part.TimType==30)//Magnifying glass (30)
				{
					if((part.isfiring!=undefined)&&(part.anim==true))
					{
						let fireX=getPosXFire(part.isfiring);
						let fireY=getPosYFire(part.isfiring);
						ctx.strokeStyle = "rgb(243, 243, 0)";//243,178,0
						ctx.fillStyle = "rgb(243, 243, 0)";//243,178,0
						ctx.beginPath();
						ctx.moveTo( playgroundOffsetX+part.pos_x+part.width/2, playgroundOffsetY+part.pos_y);
						ctx.lineTo(fireX,fireY);
						
						ctx.lineTo( playgroundOffsetX+part.pos_x+part.width/2,playgroundOffsetY+part.pos_y+part.height/2);
						ctx.closePath(); // automatically moves back to bottom left corner
						ctx.fill();
						
					}
				}
				
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
						
							drawImage(Images["8-0"], getPosXRope(part.connected_part_1)-playgroundOffsetX-Images["8-0"].width/2, getPosYRope(part.connected_part_1)-playgroundOffsetY-Images["8-0"].height/2-5,false,false);
							drawImage(Images["8-0"], getPosXRope(part.connected_part_2)-playgroundOffsetX-Images["8-0"].width/2, getPosYRope(part.connected_part_2)-playgroundOffsetY-Images["8-0"].height/2-5,false,false);
						
					}
					else
					{
						drawImage(Images["8-0"], getPosXRopeBody(part.connected_part_1)-playgroundOffsetX-Images["8-0"].width/2, getPosYRopeBody(part.connected_part_1)/*-playgroundOffsetY*/-Images["8-0"].height/2,false,false);
						drawImage(Images["8-0"], getPosXRopeBody(part.connected_part_2)-playgroundOffsetX-Images["8-0"].width/2, getPosYRopeBody(part.connected_part_2)/*-playgroundOffsetY*/-Images["8-0"].height/2,false,false);
					}
					
					
				}
			}
		});

		//console.log("-------------- 3 -------------" );
		//z index 1 (nb_anim>0)
		LevelJson.Parts.forEach(part => {
			if(part.in_partsbin==0)
			{
				RefreshPartially(allObjects,part,3,allObjects);
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
		
		//draw drag rope
		if(RopeMode==2)
		{
			//console.log("BeltMode = 2 "+MouseOnPart);
			ctx.strokeStyle = 'red';
			if((MouseOnPart!=-1)&&(PartConnectionFreeRope(MouseOnPart)==true))
			{
				//console.log("MouseOnPart = ",LevelJson.Parts[MouseOnPart].TimType);
				if(PartDef[LevelJson.Parts[MouseOnPart].TimType].rx!=undefined)
					ctx.strokeStyle = 'lightgreen';
			}
		
			const  [x,y]=GetNodeRopePos(LevelJson.Parts[RopeStart]);
			
			ctx.beginPath();
			ctx.moveTo(getPosXRope(RopeStart,false),getPosYRope(RopeStart,false));
			for(var key in RopeIntermdiatePulley)
			{
				
				ctx.lineTo(getPosXRope(RopeIntermdiatePulley[key],true), getPosYRope(RopeIntermdiatePulley[key],true));
				ctx.moveTo(getPosXRope(RopeIntermdiatePulley[key],false), getPosYRope(RopeIntermdiatePulley[key],false));
			}
			ctx.lineTo(Mouse_pos_x+playgroundOffsetX, Mouse_pos_y+playgroundOffsetY);
			ctx.stroke();
		}
		
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