	function isFiring(part)
	{
		if((part.TimType==18)||(part.TimType==19)||(part.TimType==36)||(part.TimType==45))//canon, dynamit,rocket or Candle (45)
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
	function isDestructibleByExplosive(part)
	{
		if((part.TimType==1)||(part.TimType==2)||(part.TimType==48))//brick wall, wood incline, wood wall
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
	function GetNodeRopePos2(part)
	{
		var x=part.pos_x+(part.width*PartDef[part.TimType].rx2);
		let y=part.pos_y+(part.height*PartDef[part.TimType].ry2);
		//console.log("GetNodePos = "+x+":"+y);
		
		if(part.flipH!=0)
		{
			let nx=(part.width-(part.width*PartDef[part.TimType].rx2));
			x=part.pos_x+nx;
		}
		return [x, y];
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
		
		if(LevelJson.Parts[partNo].MatterBody==undefined)
		{
			if(LevelJson.Parts[partNo].flipH==0)
				return playgroundOffsetX+LevelJson.Parts[partNo].pos_x+ox;
			else
				return playgroundOffsetX+LevelJson.Parts[partNo].pos_x+LevelJson.Parts[partNo].width-ox;
		}
		else
		{
			if(LevelJson.Parts[partNo].flipH==0)
				return LevelJson.Parts[partNo].MatterBody.position.x-LevelJson.Parts[partNo].width/2+ox;
			else
				return LevelJson.Parts[partNo].MatterBody.position.x+LevelJson.Parts[partNo].width-LevelJson.Parts[partNo].width/2-ox;
		}
	}
	function getPosYFire(partNo)
	{
		let fy=0.5;
		if(PartDef[LevelJson.Parts[partNo].TimType].fy!=undefined)
			fy=PartDef[LevelJson.Parts[partNo].TimType].fy;
		let oy=LevelJson.Parts[partNo].height*fy;
		if(LevelJson.Parts[partNo].MatterBody==undefined)
			return playgroundOffsetY+LevelJson.Parts[partNo].pos_y+oy;
		else
			return LevelJson.Parts[partNo].MatterBody.position.y+oy-LevelJson.Parts[partNo].height/2;
	}
	function getPosXRope(ropePart,partNo,to)
	{
		
		let posx=0;
		if(LevelJson.Parts[partNo].TimType==3)//Teeter-totter
		{
			
			let side=RopeStart_TeeterTotterSide;
			
			//console.log("getPosXRope ropePart",ropePart);
			//console.log("getPosXRope partNo",partNo);
	
			if(ropePart!=undefined)
			{
				if(LevelJson.Parts[partNo].ropeNoSide1==ropePart.no)
					side=1;
				else if(LevelJson.Parts[partNo].ropeNoSide2==ropePart.no)
					side=-1;
				else
				{
					console.log("Teeter-totter getPosXRope no side")
					if(LevelJson.Parts[partNo].ropeNoSide1==undefined)
						side=1;	
					else
						if(LevelJson.Parts[partNo].ropeNoSide2==undefined)
							side=-1;	
						
				}
			}	
			
			
			//if(to==false)
			if(side==1)
			{
				//console.log("GetNodePosX Teeter-totter ("+partNo+")",to);
				let rx=0.5;
				//console.log("getPosXRope",partNo);
				if(PartDef[LevelJson.Parts[partNo].TimType].rx!=undefined)
					rx=PartDef[LevelJson.Parts[partNo].TimType].rx;
				let ox=LevelJson.Parts[partNo].width*rx;
				if(LevelJson.Parts[partNo].flipH==0)
					posx= playgroundOffsetX+LevelJson.Parts[partNo].pos_x+ox;
				else
					posx= playgroundOffsetX+LevelJson.Parts[partNo].pos_x+LevelJson.Parts[partNo].width-ox;
				//console.log("GetNodePosX Teeter-totter ("+partNo+")",posx);
			}
			//if(to==true)
			if(side==-1)
			{
				//console.log("GetNodePosX Teeter-totter ("+partNo+")",to);
				let rx2=0.5;
				//console.log("getPosXRope",partNo);
				if(PartDef[LevelJson.Parts[partNo].TimType].rx2!=undefined)
					rx2=PartDef[LevelJson.Parts[partNo].TimType].rx2;
				let ox=LevelJson.Parts[partNo].width*rx2;
				if(LevelJson.Parts[partNo].flipH==0)
					posx= playgroundOffsetX+LevelJson.Parts[partNo].pos_x+ox;
				else
					posx= playgroundOffsetX+LevelJson.Parts[partNo].pos_x+LevelJson.Parts[partNo].width-ox;
				//console.log("GetNodePosX Teeter-totter ("+partNo+")",posx);
			}
		}
		else
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
			if(LevelJson.Parts[partNo].flipH==0)
				posx= playgroundOffsetX+LevelJson.Parts[partNo].pos_x+ox;
			else
				posx= playgroundOffsetX+LevelJson.Parts[partNo].pos_x+LevelJson.Parts[partNo].width-ox;
		}
		return posx;
	}
	function getPosYRope(ropePart,partNo,to)
	{
		let posy=0;
		if(LevelJson.Parts[partNo].TimType==3)//Teeter-totter
		{
			let side=RopeStart_TeeterTotterSide;
			if(ropePart!=undefined)
			{
				if(LevelJson.Parts[partNo].ropeNoSide1==ropePart.no)
					side=1;
				else if(LevelJson.Parts[partNo].ropeNoSide2==ropePart.no)
					side=-1;
				else
				{
					console.log("Teeter-totter getPosXRope no side")
					if(LevelJson.Parts[partNo].ropeNoSide1==undefined)
						side=1;	
					else
						if(LevelJson.Parts[partNo].ropeNoSide2==undefined)
							side=-1;	
						
				}
			}	
			//if(to==false)
			if(side==1)
			{
				let ry=0.5;
				if(PartDef[LevelJson.Parts[partNo].TimType].ry!=undefined)
					ry=PartDef[LevelJson.Parts[partNo].TimType].ry;
				let oy=LevelJson.Parts[partNo].height*ry;
				if(LevelJson.Parts[partNo].flipV==0)
					posy= playgroundOffsetY+LevelJson.Parts[partNo].pos_y+oy;
				else
					posy= playgroundOffsetY+LevelJson.Parts[partNo].pos_y+LevelJson.Parts[partNo].height-oy;
			}
			//(to==true)
			if(side==-1)
			{
				let ry2=0.5;
				if(PartDef[LevelJson.Parts[partNo].TimType].ry2!=undefined)
					ry2=PartDef[LevelJson.Parts[partNo].TimType].ry2;
				let oy=LevelJson.Parts[partNo].height*ry2;
				if(LevelJson.Parts[partNo].flipV==0)
					posy= playgroundOffsetY+LevelJson.Parts[partNo].pos_y+oy;
				else
					posy= playgroundOffsetY+LevelJson.Parts[partNo].pos_y+LevelJson.Parts[partNo].height-oy;
			}
		}
		else
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
				if(LevelJson.Parts[partNo].appearance=="left (1)")
				{
					
					if(to==false)
						oy=oy+7;
					else
						oy=oy-7;
				}
			}
			
			if(LevelJson.Parts[partNo].flipV==0)
				posy= playgroundOffsetY+LevelJson.Parts[partNo].pos_y+oy;
			else
				posy= playgroundOffsetY+LevelJson.Parts[partNo].pos_y+LevelJson.Parts[partNo].height-oy;
		}
		return posy;
	}
	function DisconnectTeeterTooter(RopeNo,partNo)
	{
		if(partNo!=undefined)
		{
			if(LevelJson.Parts[partNo].TimType==3)//Teeter-totter 
			{
				console.log("diconnect Teeter-totter ("+partNo+")");
				if(LevelJson.Parts[partNo].ropeNoSide1==RopeNo)
				{
					LevelJson.Parts[partNo].ropeNoSide1=undefined;
					console.log("diconnect Teeter-totter ("+partNo+") side 1");
				}
				if(LevelJson.Parts[partNo].ropeNoSide2==RopeNo)
				{
					LevelJson.Parts[partNo].ropeNoSide2=undefined;
					console.log("diconnect Teeter-totter ("+partNo+") side 2");
				}
			}
		}
	}
	
	function GetTeeterTotterSide(partNo,RopeNo)
	{
		if(partNo!=undefined)
		{
			if(LevelJson.Parts[partNo].TimType==3)//Teeter-totter 
			{
				console.log("GetTeeterTotterSide ("+partNo+")");
				if(LevelJson.Parts[partNo].ropeNoSide1==RopeNo)
				{
					console.log("GetTeeterTotterSide ("+partNo+") side 1");
					return 1;
				}
				if(LevelJson.Parts[partNo].ropeNoSide2==RopeNo)
				{
					console.log("GetTeeterTotterSide ("+partNo+") side 2");
					return -1;
				}
			}
		}
		return 0;
	}
	function getRopeDirectionY(partNoExtremity)
	{
		
		let LastPartNo=-1;
		let ropeNo=-1;
		LevelJson.Parts.forEach(part => {
			if(part.TimType==10)//rope
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
			
		
		if(engine.timing.timestamp>250)//let rope stabilize
		{
			
			let otherX=getPosXRopeBody(LastPartNo);
			let otherY=getPosYRopeBody(LastPartNo);
			let revert=1;
			if((ropeNo!=-1)&&(LevelJson.Parts[ropeNo].TimPulleys.length>0))
			{
				//console.log("through at pulley",LevelJson.Parts[ropeNo].TimPulleys);
				//if(LevelJson.Parts[ropeNo].TimPulleys[0].pos_y>otherY)//revert direction
					revert=-1;
					
					let pulleyPartNo=LevelJson.Parts[ropeNo].TimPulleys[0];
					//console.log("through at pulley 0",pulleyPartNo);
					
					otherX=getPosXRopePulleySimul(pulleyPartNo,false);
					otherY=getPosYRopePulleySimul(pulleyPartNo,true);
					//
					//console.log("through at pulley",LevelJson.Parts[ropeNo].TimPulleys[0]);
					//otherX=getPosXRopePulleySimul(LevelJson.Parts[ropeNo].TimPulleys[0],true);
			}
			
			let extremityX=getPosXRopeBody(partNoExtremity);
			let extremityY=getPosYRopeBody(partNoExtremity);
			let p1={};
			let p2={};
			p1.x=extremityX;
			p1.y=extremityY;
			p2.x=otherX;
			p2.y=otherY;
		
			let part=LevelJson.Parts[partNoExtremity];
			//console.log("velocity.y:",LevelJson.Parts[LastPartNo].MatterBody.velocity.y);
			//if(part.no==8)
			//	console.log("------------ last="+extremityX+", "+otherX);//+" v="+LevelJson.Parts[LastPartNo].MatterBody.velocity.y,LevelJson.Parts[LastPartNo].MatterBody); 
			//if(part.no==8)
			//	console.log("start=",part); 
			if((otherX>extremityX-50)&&(otherX<extremityX+50))
			{
				//console.log("In X=",part); 
				if(revert==1)//direct 
				{
					if(otherY>part.pos_y+part.height)//need to be below
					{
						//console.log("lower direct ("+part.no+")="+LevelJson.Parts[LastPartNo].MatterBody.velocity.y); 
						if(LevelJson.Parts[LastPartNo].MatterBody.velocity.y>0.025)
							return 1;						
					}
				
					if(otherY<part.pos_y+part.height)//need to be upper
					{
						//console.log("upper=",part); 
						if(LevelJson.Parts[LastPartNo].MatterBody.velocity.y<-0.025*revert)
							return -1;							
					}
					
				}
				else
				{
					if(otherY>part.pos_y+part.height)//need to be below
					{
						//console.log("lower INdirect ("+part.no+")="+LevelJson.Parts[LastPartNo].MatterBody.velocity.y); 
						if(LevelJson.Parts[LastPartNo].MatterBody.velocity.y<-0.15)
							return 1;						
					}
					if(otherY<part.pos_y+part.height)//need to be upper
					{
						//console.log("upper=",part); 
						if(LevelJson.Parts[LastPartNo].MatterBody.velocity.y<-0.025*revert)
							return -1;							
					}
				}
				
			}
			
		}
		
		return 0;
	}
	
	function getPosXRopePulleySimul(partNo,to, from_x)
	{
		let rx=0.5;
		
		if(PartDef[LevelJson.Parts[partNo].TimType].rx!=undefined)
			rx=PartDef[LevelJson.Parts[partNo].TimType].rx;
		
		//console.log("getPosXRope="+rx,LevelJson.Parts[partNo]);
		let ox=LevelJson.Parts[partNo].width*rx;
		if(LevelJson.Parts[partNo].TimType==7)//pulley
		{
			if((LevelJson.Parts[partNo].appearance=="top (2)")||(LevelJson.Parts[partNo].appearance=="bottom (0)"))
			{
				if(to==false)
					ox=ox+5;
				else
					ox=ox-5;
				if(from_x<LevelJson.Parts[partNo].pos_x+20)
					return playgroundOffsetX+LevelJson.Parts[partNo].pos_x+ox;
				else
					return playgroundOffsetX+LevelJson.Parts[partNo].pos_x+LevelJson.Parts[partNo].width-ox;
			}
			if(LevelJson.Parts[partNo].appearance=="right (3)")
			{
				ox=ox+5;
			}
			if(LevelJson.Parts[partNo].appearance=="left (1)")
			{
				//console.log("getPosXRopePulleySimul -5");
				ox=ox-10;
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
				oy=oy+10;
			}
		}
		
		return playgroundOffsetY+LevelJson.Parts[partNo].pos_y+oy;
	}
	