let 	
		Bodies = Matter.Bodies,
		Body = Matter.Body,
		Engine = Matter.Engine,
		Events = Matter.Events,
		Render = Matter.Render,
		Runner = Matter.Runner,
		Composite = Matter.Composite,
		Common = Matter.Common,
		Constraint = Matter.Constraint,
		World = Matter.World;

	let collisionCategory_general=1;
	let collisionCategory_rope=2;
	let collisionCategory_bullet=4;
	let collisionCategory_TeeterTotter =8;
	

	//--------------------------------------------------
	// AnimPart
	//--------------------------------------------------
	function AnimPart(PartNo, forwardMessage,flipH,flipV,once,cleanAtEnd)
	{
		console.log("anim "+PartNo+ "="+LevelJson.Parts[PartNo].name);
		LevelJson.Parts[PartNo].anim=true;
		LevelJson.Parts[PartNo].animStep=1;
		LevelJson.Parts[PartNo].animDelay=0;
		LevelJson.Parts[PartNo].animDirectionX=flipH;
		LevelJson.Parts[PartNo].animOnce=once;
		LevelJson.Parts[PartNo].animCleanAtEnd=cleanAtEnd;
		
	
		if(forwardMessage==true)
		{
			let otherExtremity=PartBeltExtremity(PartNo);
			if(otherExtremity!=-1)
			{
				console.log("from Part "+PartNo+" action on "+otherExtremity);
				AnimPart(otherExtremity,false,flipH,flipV,false,false);
				if(LevelJson.Parts[otherExtremity].TimType==26)//generator
				{
					if(LevelJson.Parts[otherExtremity].connected_part_1!=undefined)
						SwitchElectric(LevelJson.Parts[otherExtremity].connected_part_1);
					if(LevelJson.Parts[otherExtremity].connected_part_2!=undefined)
						SwitchElectric(LevelJson.Parts[otherExtremity].connected_part_2);
				}
			}
		}
	}
	
	//--------------------------------------------------
	// beforeRender
	//--------------------------------------------------
	function beforeRender()
	{
		
			ctx.fillStyle = "rgba(0,0,162,255)";
			ctx.fillRect(0, 0, canvas.width, canvas.height-80);
			
			
		//console.log("beforeRender");
		LevelJson.Parts.forEach(part => {
			
			
			
		if(part.in_partsbin==0)
		{
			if(part.is_moving!=0)//moving
			{
				
				//apply gravity
				if(part.MatterBody!=undefined)
				{
					if(part.MatterBody.isStatic==false)
						Body.applyForce(part.MatterBody, part.MatterBody.position, { x: part.MatterBody.force.x, y: part.MatterBody.mass2 * 0.0005 });
				}
				
				//apply gravity to rope also
				engine.world.bodies.forEach((body)=>{
					if(body.isStatic==false)
					{
						if(body.collisionFilter.category==collisionCategory_rope)//rope
						{
							//console.log("apply force to "+body.label, body.mass);
							Body.applyForce(body, body.position, { x: body.force.x, y: body.mass * 0.00001});
						}
					}
				});
				
				//check if in contact with a belt
				engine.world.bodies.forEach((body)=>{
					if(body.TimNo!=undefined)
					{
						if((LevelJson.Parts[body.TimNo].TimType==5)&&(LevelJson.Parts[body.TimNo].anim==true))//moving belt
						{
							if (Matter.Collision.collides(part.MatterBody, body) != null) 
							{
								// collision happened
								//console.log("moving part"+part.no +"on a moving belt"+body.TimNo);
								//console.log("moving part direction "+LevelJson.Parts[body.TimNo].animDirectionX);
								if(LevelJson.Parts[body.TimNo].animDirectionX==0)
									Body.applyForce(part.MatterBody, part.MatterBody.position, { x: 0.003, y: 0 })
								if(LevelJson.Parts[body.TimNo].animDirectionX==1)
									Body.applyForce(part.MatterBody, part.MatterBody.position, { x: -0.003, y: 0 })
							}
						}
					}
				});
				
				if(part.TimType==19)//dynamite
				{
					if(part.animStep==6)
						detroyDynamite(part);
				}
				if(part.TimType==36)//rocket
				{
					if(part.animStep>7)
					{
						Body.applyForce(part.MatterBody, part.MatterBody.position, { x: 0, y: -0.001 })
					}
					
				}
			}
			else //staticobj
			{
				if(part.TimType==3)//Teeter-totter (3)
				{
					if(part.MatterBody!=undefined)
					{
						part.anim=true;
						part.animStep=1;
						part.animDelay=0;
						part.animDirectionX=0;
						part.animOnce=false;
						part.animCleanAtEnd=false;
							
						if(part.MatterBody.angle>0.2)
						{
							if(part.flipH==0)
							{
								//console.log("Teeter-totter "+part.no+" >");
								part.animStep=2;
							}
							else
							{
								//console.log("Teeter-totter "+part.no+" <");
								part.animStep=0;
							}
								
						}
						if(part.MatterBody.angle<-0.2)
						{
							if(part.flipH==0)
							{
								//console.log("Teeter-totter "+part.no+" <");
								part.animStep=0;
							}
							else
							{
								//console.log("Teeter-totter "+part.no+" >");
								part.animStep=2;
							}
						}
						if((part.MatterBody.angle>-0.05)&&(part.MatterBody.angle<0.05))
						{
							//console.log("Teeter-totter "+part.no+" -");
							part.animStep=1;
						}
					}
				}
				if(part.TimType==13)//Jack-in-the-box (13)
				{
					if(part.overY!=0)
					{
						//console.log("check Jack-in-the-box at "+(part.pos_y+part.overY));
						LevelJson.Parts.forEach(part1 => {
							if(part1.no!=part.no)
							{
								if(doPartsOverlapsPoint(part1, part.pos_x+part.width/2,part.pos_y-part.overY)==true)
								{
									//console.log("check Jack-in-the-box collide ("+part1.no+")",part1);
									if(part1.TimType==15)//Aquarium (15)
									{
										//console.log("check Jack-in-the-box collide aquarium("+part1.no+")",part1);
										collision_Aquarium(part1.no,true);
									}
									else
									{
										if(part1.TimType==3)//"Teeter-totter (3)"
										{
											collision_TeeterTotter(part1.MatterBody,part.MatterBody,false);
											Body.applyForce(part1.MatterBody, {x:part.pos_x+part.width/2, y:part.pos_y-part.overY}, { x:0, y: -2 });
										}
										else
											Body.applyForce(part1.MatterBody, {x:part.pos_x+part.width/2, y:part.pos_y-part.overY}, { x:0, y: -2 });
											//Body.setVelocity(part1.body, { x:5*scaleX, y: 0 });
									}
								}
								if(part1.MatterBody!=undefined)
								{
									if (Matter.Collision.collides(part.MatterBody, part1.MatterBody) != null) 
									{
										//console.log("-----------------check Jack-in-the-box at ("+part1.no+") "+part1.name);
										Body.applyForce(part1.MatterBody, {x:part1.pos_x, y:part1.pos_y}, { x:0.01, y: -0.02 });
									}
								}
							}
						});
						
					}
				}
				if(part.TimType==18)//canon
				{
					if(part.animStep==7)
					{
						CanonFire(part);
					}
				}
				if(part.TimType==22)//Dynamite with plunger (22)
				{
					if(part.anim==true)
					{
						if((part.animStep==1)&&(part.animDelay==0))
						{
							DynamiteWithPlungerExplode(part);
						}
					}
				}
				if(part.TimType==31)//Monkey exercise bike (31)
				{
					if(part.anim!=true)
					{
						let directionY = getRopeDirectionY(part.no);
						//console.log("Monkey directionY ("+part.no+")"+directionY);
						if(directionY==1)
						{
							if(part.anim!=true)
							{
								console.log("Monkey ("+part.no+") start");
								AnimPart(part.no, true,part.flipH,part.flipV,false,false);	
							}
						}
							
					}
				}
				if(part.TimType==27)//Gun (27)
				{
					if(part.anim!=true)
					{
						let otherExtremity=PartRopetExtremity(part.no,false);
						
						if(otherExtremity>=0)
						{
							if(engine.timing.timestamp>100)
							{
								engine.world.bodies.forEach((body)=>{
									if(body.TimNo==otherExtremity)
									{
										//console.log("found Gun otherExtremity "+otherExtremity,body.speed);		
										if(body.speed>0.5)
										{
										console.log("fire Gun "+part.no);
										AnimPart(part.no, false,part.flipH,part.flipV,true,false);									
										}
									}
								});
							}
						}
						/*
						engine.world.constraints.forEach((constraint)=>{
						
							if(constraint.bodyA!=undefined)
							{
								if(constraint.bodyA.id==part.staticObjId)
								{
									//console.log("time:"+engine.timing.timestamp); 
									if(engine.timing.timestamp>100)
										//let time for rope to stabilize)
									{
										//console.log("found constraint");
										
										console.log("found Gun constraint part",part);
										console.log("found Gun constraint matterBody",part.MatterBody);
										console.log("found Gun constraint bodyA",constraint.bodyA);
										console.log("found Gun constraint bodyB",constraint.bodyB);
										
										//console.log("found Gun constraint "+ part.no,constraint);
											
										//console.log("found Gun constraint bodyB velocity x for "+ part.no,constraint.bodyB.velocity.x);
										//let Imp=(constraint.bodyB.constraintImpulse.x*constraint.bodyB.constraintImpulse.x)+(constraint.bodyB.constraintImpulse.y*constraint.bodyB.constraintImpulse.y)
										let impx=constraint.bodyB.constraintImpulse.x*constraint.bodyB.constraintImpulse.x*1000;
										let impy=constraint.bodyB.constraintImpulse.x*constraint.bodyB.constraintImpulse.y*1000;
										let Imp=Math.round((impx*impx)+(impy*impy)*100000);
										if(part.fliph==1)
											impx=impx*-1;
										if(impx>0)
										{
											//if(part.no==13)
											if(Imp>0)
													console.log("found Gun "+ part.no+" impulse="+Imp);
											if(Imp>=7000)
											{
												//console.log("found Gun constraint bodyB impulse=",impx);
												
												if(part.anim!=true)
												{
													console.log("fire Gun "+part.no);
													AnimPart(part.no, false,part.flipH,part.flipV,true,false);
												}
											}
										}
									}
								}
							}
						});
						*/
					}
				}
				if(part.TimType==29)//Light bulb (29)
				{
					if(part.anim!=true)
					{
						
						let directionY = getRopeDirectionY(part.no);
						//console.log("Light bulb directionY ("+part.no+")"+directionY);
						
						if(directionY==1)
						{
							console.log("light bulb "+part.no);
							AnimPart(part.no, false,part.flipH,part.flipV,true,false);									
						}
					}
				}
				if(part.TimType==38)//Solar panels (38)
				{
					LevelJson.Parts.forEach(part1 => {
						if(isLight(part1))//Light bulb (29)
						{
							if(part1.anim==true)//light on
							{
								let dx=part1.pos_x- part.pos_x;
								let dy=part1.pos_y- part.pos_y;
								let distance=Math.sqrt((dx*dx)+(dy*dy));
								//console.log("light on at "+distance);
								if(distance<100)
								{
									if(part.connected_part_1!=undefined)
										if(LevelJson.Parts[part.connected_part_1].anim!=true)
											SwitchElectric(part.connected_part_1);
									if(part.connected_part_2!=undefined)
										if(LevelJson.Parts[part.connected_part_2].anim!=true)
											SwitchElectric(part.connected_part_2);
								}
							}
						}
					});
				}
				if(part.TimType==30)//Magnifying glass (30)
				{
					LevelJson.Parts.forEach(part1 => {
						if(isLight(part1))//Light bulb (29)
						{
							if(part1.anim==true)//light on
							{
								let dx=part1.pos_x- part.pos_x;
								let dy=part1.pos_y- part.pos_y;
								let distance=Math.sqrt((dx*dx)+(dy*dy));
								
								if(distance<50)
								{
									//console.log("light Magnifying glass at "+distance);	
									if((part1.pos_x<part.pos_x)&&(part.flipH==0))
										Magnifying(true,part);
										
									if((part1.pos_x>part.pos_x)&&(part.flipH==1))
										Magnifying(false,part);
								}
							}
						}
					});
				}
			
			}
		}
		});
		//checkIfWin();
	}
	//--------------------------------------------------
	// afterRender
	//--------------------------------------------------
	function afterRender()
	{
		
		//console.log("afterRender");
		engine.world.bodies.forEach((body)=>{
			if(body.TimNo!=undefined)
			{
				if(LevelJson.Parts[body.TimNo].TimType==35)//Boxing glove (35)
					boxing(body);
				if(LevelJson.Parts[body.TimNo].TimType==14)//gear
					CheckGear(body);
				if(LevelJson.Parts[body.TimNo].TimType==27)//Gun (27)
					LaunchGunBullet(body);
				if(LevelJson.Parts[body.TimNo].TimType==36)//rocket (36)
					CheckRocket(body);
				if(LevelJson.Parts[body.TimNo].TimType==12)//Pokey Cat (12)
					CheckCat(body);
				if(LevelJson.Parts[body.TimNo].TimType==42)//Pokey Cat (12)
					CheckMouse(body);
			}
		});
		
		refresh(false);
		LevelJson.Parts.forEach(part => {
			AdvanceAnimation(part);
			//part.MatterBody.height=Images[part.TimType+"-"+val].height;
		});
		
		checkIfWin();
		//if(engine.timing.timestamp>0)
		//	stop();
	}
	function CheckMouse(MouseBody)
	{
		let scaleX=-1;
		if(LevelJson.Parts[MouseBody.TimNo].flipH==1)
			scaleX=1;
		
		let startPoint = { x: MouseBody.position.x+playgroundOffsetX, y: MouseBody.position.y+playgroundOffsetY};
		var collisions = [];
        let  bodies = Composite.allBodies(engine.world);
        let  endPoint = { x:  MouseBody.position.x+playgroundOffsetX+50*scaleX, y: MouseBody.position.y+playgroundOffsetY};
		
		drawRay( startPoint, endPoint);
		collisions= Matter.Query.ray(bodies, startPoint, endPoint) ;
		//console.log("collisions Mouse",collisions);
		collisions.forEach((collision) => {
			if(collision.body!=undefined)
			{
				if(collision.body.TimNo!=undefined)
				{
					if(LevelJson.Parts[collision.body.TimNo].TimType==12)//Pokey Cat (12)
					{
						if(LevelJson.Parts[MouseBody.TimNo].anim!=true)
						{
							console.log("mouse ("+MouseBody.TimNo+") has seen a cat");	
							if(LevelJson.Parts[MouseBody.TimNo].flipH==1)
								LevelJson.Parts[MouseBody.TimNo].flipH=0;
							else
								LevelJson.Parts[MouseBody.TimNo].flipH=1;
							AnimPart(MouseBody.TimNo,false,LevelJson.Parts[MouseBody.TimNo].flipH,LevelJson.Parts[MouseBody.TimNo].flipV,false,false);		
							
						}
					}
				}
			}
		});
		if(LevelJson.Parts[MouseBody.TimNo].anim==true)
		{
			let stopMouse=false;
			let x=MouseBody.position.x;
			let y=MouseBody.position.y;	
			let scaleX=-1;
			if(LevelJson.Parts[MouseBody.TimNo].flipH==1)
				scaleX=1;
			let bodies = Composite.allBodies(engine.world);
			let point={};
			if(LevelJson.Parts[MouseBody.TimNo].flipH==0)
				point.x=x+LevelJson.Parts[MouseBody.TimNo].width/2;
			else
				point.x=x+LevelJson.Parts[MouseBody.TimNo].width/2;
			point.y=y+LevelJson.Parts[MouseBody.TimNo].height/2+15;
			
			var collisions = [];		
			collisions =Matter.Query.point(bodies, point);
			console.log("collisions bellow mouse",collisions.length);
			if(collisions.length==0)
			{
				stopMouse=true;
			}
		
			//check in front
			let startPoint = { x: MouseBody.position.x+(LevelJson.Parts[MouseBody.TimNo].width/2+2)*scaleX, y: MouseBody.position.y };
			let  endPoint = { x: MouseBody.position.x+(LevelJson.Parts[MouseBody.TimNo].width/2+12)*scaleX, y: MouseBody.position.y};
			drawRay( startPoint, endPoint);
			collisions= Matter.Query.ray(bodies, startPoint, endPoint,LevelJson.Parts[MouseBody.TimNo].height-5) ;
			if(collisions.length>0)
			{
				console.log("collisions mouse in front",collisions);
				stopMouse=true;
			}
			if(stopMouse==true)
			{
				console.log("mouse stoped!!!");
				LevelJson.Parts[MouseBody.TimNo].anim=false;
				
			}
			else
				Body.applyForce(MouseBody, MouseBody.position, { x:0.0015*scaleX, y: 0.000 });
		}
	}
	function CheckCat(CatBody)
	{
		let scaleX=-1;
		if(LevelJson.Parts[CatBody.TimNo].flipH==1)
			scaleX=1;
		
		let startPoint = { x:  CatBody.position.x/*+playgroundOffsetX*/, y: CatBody.position.y/*+playgroundOffsetY*/+LevelJson.Parts[CatBody.TimNo].height/2-5};
		var collisions = [];
        let  bodies = Composite.allBodies(engine.world);
        let  endPoint = { x: CatBody.position.x/*+playgroundOffsetX*/+700*scaleX, y: CatBody.position.y/*+playgroundOffsetY*/+LevelJson.Parts[CatBody.TimNo].height/2-5};
		
		drawRay( startPoint, endPoint);
		collisions= Matter.Query.ray(bodies, startPoint, endPoint) ;
		//console.log("collisions",collisions);
		var somethingInFronToMove=false;
		collisions.forEach((collision) => {
			if(collision.body!=undefined)
			{
				if(collision.body.TimNo!=undefined)
				{
					if(LevelJson.Parts[collision.body.TimNo].TimType==42)//Mort Mouse (42)
					{
						if(LevelJson.Parts[CatBody.TimNo].anim!=true)
						{
							console.log("Cat ("+CatBody.TimNo+") has seen a mouse");	
							AnimPart(CatBody.TimNo,false,LevelJson.Parts[CatBody.TimNo].flipH,LevelJson.Parts[CatBody.TimNo].flipV,false,false);		
						}
						//console.log("Cat ("+CatBody.TimNo+") still seen a mouse");
						somethingInFronToMove=true;
					}
					
					if(LevelJson.Parts[collision.body.TimNo].TimType==15)//aquarium
					{
						if(LevelJson.Parts[collision.body.TimNo].animStep>12)
						{
							if(LevelJson.Parts[CatBody.TimNo].anim!=true)
							{
								console.log("Cat ("+CatBody.TimNo+") has seen a broken aquarium");	
								AnimPart(CatBody.TimNo,false,LevelJson.Parts[CatBody.TimNo].flipH,LevelJson.Parts[CatBody.TimNo].flipV,false,false);		
								//if(LevelJson.Parts[CatBody.TimNo].flipH==1)								
									//Body.applyForce(CatBody, CatBody.position, { x:0.01*scaleX, y: 0.000 });
									//Body.setVelocity(CatBody, { x:6*scaleX, y: 0 });

							}
							//console.log("Cat ("+CatBody.TimNo+") still seen a broken aquarium");
							somethingInFronToMove=true;		
						}
						
					}
					 
				}
			}
		});
		if(somethingInFronToMove==false)
			LevelJson.Parts[CatBody.TimNo].anim=false;
		
		
		if(LevelJson.Parts[CatBody.TimNo].anim==true)
		{				
			let stopCat=false;
			let x=CatBody.position.x;
			let y=CatBody.position.y;	
			
			let scaleX=-1;
			if(LevelJson.Parts[CatBody.TimNo].flipH==1)
				scaleX=1;
	
	
			let bodies = Composite.allBodies(engine.world);
			//check bellow
			let point={};
			if(LevelJson.Parts[CatBody.TimNo].flipH==0)
				point.x=x-2;
			else
				point.x=x+LevelJson.Parts[CatBody.TimNo].width+2;
			point.y=y+LevelJson.Parts[CatBody.TimNo].height/2+5;
			var collisions = [];		
			collisions =Matter.Query.point(bodies, point);
			//console.log("collisions bellow cat",collisions.length);
			if(collisions.length==0)
				stopCat=true;
			
			//check in front
			let startPoint = { x: CatBody.position.x+(LevelJson.Parts[CatBody.TimNo].width/2+2)*scaleX, y: CatBody.position.y };
			let  endPoint = { x: CatBody.position.x+(LevelJson.Parts[CatBody.TimNo].width/2+12)*scaleX, y: CatBody.position.y};
			drawRay( startPoint, endPoint);
			collisions= Matter.Query.ray(bodies, startPoint, endPoint,LevelJson.Parts[CatBody.TimNo].height-5) ;
			if(collisions.length>0)
			{
				//console.log("collisions cat in front",collisions);
				stopCat=true;
			}
			if(stopCat==true)
			{
				//console.log("Cat ("+LevelJson.Parts[CatBody.TimNo].no+") stoped!!!");
				LevelJson.Parts[CatBody.TimNo].anim=false;
				LevelJson.Parts[CatBody.TimNo].animStep=0;
			}
			else
				Body.applyForce(CatBody, CatBody.position, { x:0.002*scaleX, y: 0.000 });
		}
		
	}
	function CheckRocket(RocketBody)
	{
		if(LevelJson.Parts[RocketBody.TimNo].animStep>=6)//fired
		{
			engine.world.bodies.forEach((body)=>{
				if(body.TimNo!=undefined)//rope
				{
					let rocketBottom={};
					rocketBottom.x=RocketBody.position.x;
					rocketBottom.y=RocketBody.position.y+60;
					//console.log("rocketBottom",rocketBottom)
					//rocketBottom.y+=30;
					let dist= Matter.Vector.magnitude( Matter.Vector.sub(rocketBottom, body.position));
					if(dist<60)
					{
						//console.log("rocket fire touch body ("+body.TimNo+") "+LevelJson.Parts[body.TimNo].name,body);
						if(LevelJson.Parts[body.TimNo].TimType==19)//dynamite
						{
							//console.log("explode touch dynamite ("+body.TimNo+") "+LevelJson.Parts[body.TimNo].name);
							AnimPart(body.TimNo,false,LevelJson.Parts[body.TimNo].flipH,LevelJson.Parts[body.TimNo].flipV,true,false);
						}
						if(LevelJson.Parts[body.TimNo].TimType==4)//ballon
						{
							//console.log("explode touch ballon ("+body.TimNo+") "+LevelJson.Parts[body.TimNo].name);
							if(LevelJson.Parts[body.TimNo].anim==undefined)//ballon is not yet exploding
							{
								destroy_ballon(body);
							}
						}
						
					}
				}
			});
		}
	}
	
	function CanonFire(part)
	{
		if(part.isfiring!=true)
		{
			
			part.isfiring=true;
			
			let swap=1;
			if(part.flipH==1)
				swap=-1;
			//console.log("LaunchGunBullet "+LevelJson.Parts.length );
			let newPart={no:LevelJson.Parts.length,TimType: 20, width:0,height:0, is_moving: 1, in_partsbin: 0, is_scenery: 0,flipH:0, flipV:0,name:"bullet",pos_x:-100,pos_y:-100,selected:0};
			//console.log("LaunchGunBullet "+LevelJson.Parts );
			let x=0;
			if(swap==-1)//no swap
				x=part.pos_x-10;
			if(swap==1)//swap
				x=part.pos_x+part.Images[part.TimType+"-0"].width+10;
			//console.log("flip "+x);
			var MatterBody = Bodies.circle(playgroundOffsetX+x, playgroundOffsetY+part.pos_y+part.Images[part.TimType+"-0"].height/2-8,   Images["43-0"].height/2, {
								TimNo:newPart.no,
								isSleeping: false,
								isStatic: false,
								restitution: 0.1, 
								mass:1,
								mass2:1,
								label:"bullet",
								render: {
									sprite: { texture: Images["43-0"].src, 
										xOffset: 0,
										yOffset: 0
											}
									},
								//collisionFilter: { category:collisionCategory_bullet,mask: collisionCategory_general }
								});
						
			console.log("Canon "+part.no+" fire ",newPart);
			Composite.add(world, [MatterBody]);
			newPart.MatterBody=MatterBody;
			LevelJson.Parts.push(newPart);
			if(swap==-1)
				Body.rotate(MatterBody, 3.14);
			Body.setVelocity(MatterBody, { x:10*swap, y: -3 });				
			
			
		}
	}
	function LaunchGunBullet(GunBody)
	{
		if((LevelJson.Parts[GunBody.TimNo].animStep==3)&&(LevelJson.Parts[GunBody.TimNo].animDelay==0))
		{
			let swap=1;
			if(LevelJson.Parts[GunBody.TimNo].flipH==1)
				swap=-1;
			let part=LevelJson.Parts[GunBody.TimNo];
			//console.log("LaunchGunBullet "+LevelJson.Parts.length );
			let newPart={no:LevelJson.Parts.length,TimType: 20, width:0,height:0, is_moving: 0, in_partsbin: 0, is_scenery: 0,flipH:0, flipV:0,name:"bullet",pos_x:-100,pos_y:-100,selected:0};
			//console.log("LaunchGunBullet "+LevelJson.Parts );
			let x=0;
			if(swap==-1)//no swap
				x=part.pos_x-10;
			if(swap==1)//swap
				x=part.pos_x+part.Images[part.TimType+"-0"].width+10;
			//console.log("flip "+x);
			var MatterBody = Bodies.circle(playgroundOffsetX+x, playgroundOffsetY+part.pos_y+part.Images[part.TimType+"-0"].height/2-8,  5, {
								TimNo:newPart.no,
								isSleeping: false,
								isStatic: false,
								restitution: 0, 
								mass:0,
								mass2:0,
								label:"bullet",
								render: {
									sprite: { texture: Images["20-0"].src, 
										xOffset: 0,
										yOffset: 0
											}
									},
								collisionFilter: { category:collisionCategory_bullet,mask: collisionCategory_general}
								});
						

			Composite.add(world, [MatterBody]);
			newPart.MatterBody=MatterBody;
			LevelJson.Parts.push(newPart);
			if(swap==-1)
				Body.rotate(MatterBody, 3.14);
			Body.setVelocity(MatterBody, { x:10*swap, y: 0 });				
			
		}
	}
	function Magnifying(left, part)
	{
		//console.log("Magnifying glass "+part.no +" light left "+left);
		LevelJson.Parts.forEach(part1 => {
			if(isFiring(part1))//can be fired
			{
				//console.log("Magnifying glass "+part.no +" light left "+left, part);
				if((part.anim!=true)&&(part.isfiring==undefined))//not firing and not have fired
				{
					
					let fireX=getPosXFire(part1.no);
					let fireY=getPosYFire(part1.no);
					//console.log("Magnifying glass "+part.no +": "+fireX+";"+fireY);
					//console.log("light Magnifying glass will fired "+fireX+";"+fireY);
					let dx=fireX- part.pos_x;
					let dy=fireY- part.pos_y;
					let distance=Math.sqrt((dx*dx)+(dy*dy));
					if(distance<100)
					{
						console.log("light Magnifying glass will fired "+part1.no);
						part.animStep=0;
						part.isfiring=part1.no;
						part.animDelay=0;
						part.anim=true;
					}
				}
				else
				{
					if((part.isfiring==part1.no)&&(part.anim==true))
					{
						if(part.animDelay==PartDef[part.TimType].animSpeed)
						{
							//part.animStep=0;
							//part.animDelay=0;
							part.anim=false;
							console.log("light Magnifying glass fire "+part1.no );
							AnimPart(part1.no,false,part1.flipH,part1.flipV,true,false);
						}
					}
				}
			}
		});
		
		
	}
	function collision_mouse(TimNo)
	{
		console.log("moving part direction "+LevelJson.Parts[TimNo].flipH+" "+LevelJson.Parts[TimNo].flipV);
		AnimPart(TimNo,true,LevelJson.Parts[TimNo].flipH,LevelJson.Parts[TimNo].flipV,false,false);
	}
	function collision_bellow(bellowBody)
	{
		/*
		console.log("bellowBody collision",bellowBody);
		console.log("moving part direction "+LevelJson.Parts[bellowBody.TimNo].flipH+" "+LevelJson.Parts[bellowBody.TimNo].flipV);
		console.log("bellow anim",LevelJson.Parts[bellowBody.TimNo].animStep);
		*/
		if(LevelJson.Parts[bellowBody.TimNo].animStep>=1)
			return;
		
		AnimPart(bellowBody.TimNo,false,LevelJson.Parts[bellowBody.TimNo].flipH,LevelJson.Parts[bellowBody.TimNo].flipV,true,false);
	
		Matter.Body.scale(bellowBody, 1, 0.45);
	
		let scaleX=1;
		if(LevelJson.Parts[bellowBody.TimNo].flipH==1)
			scaleX=-1;
		
		let startPoint = { x: LevelJson.Parts[bellowBody.TimNo].pos_x+playgroundOffsetX+LevelJson.Parts[bellowBody.TimNo].width/2, y: LevelJson.Parts[bellowBody.TimNo].pos_y+playgroundOffsetY+LevelJson.Parts[bellowBody.TimNo].height/2 };
		var collisions = [];
        let  bodies = Composite.allBodies(engine.world);
        let  endPoint = { x: LevelJson.Parts[bellowBody.TimNo].pos_x+playgroundOffsetX+LevelJson.Parts[bellowBody.TimNo].width/2+100*scaleX, y: LevelJson.Parts[bellowBody.TimNo].pos_y+playgroundOffsetY+LevelJson.Parts[bellowBody.TimNo].height/2};
		
		
		collisions= Matter.Query.ray(bodies, startPoint, endPoint) ;
		//console.log("collisions",collisions);
		collisions.forEach((collision) => {
			if(collision.body.isStatic==false)
			{
			//console.log("collisions ->",collision.body);
				//collision.body.isSleeping=true;
				//Body.applyForce(collision.body, collision.body.position, { x:33, y: 0.0010 });
				Body.setVelocity(collision.body, { x:5*scaleX, y: 0 });
				collision.body.TimDirectionX=scaleX;
				//console.log("collisions ->",collision.body);
			}
			else
			{
				//console.log("bellow blow Type->",LevelJson.Parts[collision.body.TimNo].TimType);
				if(LevelJson.Parts[collision.body.TimNo].TimType==40)//Windmill (40)
				{
					console.log("bellow blow No->",collision.body.TimNo);
					collision.body.TimDirectionX=scaleX;
					AnimPart(collision.body.TimNo,true,LevelJson.Parts[collision.body.TimNo].flipH,LevelJson.Parts[collision.body.TimNo].flipV,false,false);
				}
			}
		});
		/*
		ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(endPoint.x, endPoint.y);
        if (collisions.length > 0) {
            ctx.strokeStyle = '#fff';
        } else {
            ctx.strokeStyle = '#555';
        }
        ctx.lineWidth = 0.5;
        ctx.stroke();
		*/

	}
	function collision_ballon(_ballonBoby,_impactorBody)
	{
		console.log("collision_ballon ");
		if(LevelJson.Parts[_impactorBody.TimNo].TimType==14)//gear
		{
			if(LevelJson.Parts[_impactorBody.TimNo].part!=undefined)
				if(LevelJson.Parts[_impactorBody.TimNo].part.anim==true)//only if rotating
					destroy_ballon(_ballonBoby);
		}
		if(LevelJson.Parts[_impactorBody.TimNo].TimType==37)//scisor
		{
			console.log("Collision scisor ");
			let flipH=1;
			if(LevelJson.Parts[_impactorBody.TimNo].flipH==0)//check cisor direction
				flipH=-1;
			console.log("cisor :"+_ballonBoby.TimDirectionX+" "+flipH);
			if(flipH==_ballonBoby.TimDirectionX)
				destroy_ballon(_ballonBoby);
		}
		if(LevelJson.Parts[_impactorBody.TimNo].TimType==20)//bullet
		{
				destroy_ballon(_ballonBoby);
				Composite.remove(world, [_impactorBody]);//delete bullet
		}

	}
	
	function DynamiteWithPlungerExplode(part)
	{
		
		let x=part.MatterBody.position.x-part.width/2+30;
		let y=part.MatterBody.position.y-part.height/2;
		if(part.flipH==1)
			x=part.MatterBody.position.x+part.width/2-30;
		let pos={};
		pos.x=x;
		pos.y=y;
		//console.log("DynamiteWithPlungerExplode");
	
		const BodyToDestroy= [];
		engine.world.bodies.forEach((body)=>{
			if(body.TimNo!=undefined)//rope
			{
				let dist= Matter.Vector.magnitude( Matter.Vector.sub(pos, body.position));
				//console.log("explode destroy ("+body.TimNo+") "+LevelJson.Parts[body.TimNo].name+" dist="+dist);
				if(dist<80)
				{
					//console.log("explode touch body ("+body.TimNo+") "+LevelJson.Parts[body.TimNo].name,body);
					if(isDestructibleByExplosive(LevelJson.Parts[body.TimNo])==true)//brick wall, wood incline, wood wall
					{
						//console.log("explode destroy ("+body.TimNo+") "+LevelJson.Parts[body.TimNo].name);
						BodyToDestroy.push(body);
						LevelJson.Parts[body.TimNo].visible=false;
						
					}
					if(body.isStatic==0)//moving Object
					{
						//console.log("explode move body ("+body.TimNo+") "+LevelJson.Parts[body.TimNo].name);
						let dx=x-body.position.x;
						let dy=y-body.position.y;
						Body.setVelocity(body, { x:dx*-0.1, y: dy*-0.05 });
					}
				}
			}
		});
		
		//BodyToDestroy.push(part.MatterBody);
		Composite.remove(world, BodyToDestroy);
		//part.MatterBody=undefined;
		//if(part.flipH==1)
		Matter.Body.scale(part.MatterBody, 0.7, 0.5);
		Matter.Body.translate(part.MatterBody,{x:20,y:0});
		
	}
	function detroyDynamite(part)
	{
		if(part.MatterBody!=undefined)
		{
			let x=part.MatterBody.position.x;
			let y=part.MatterBody.position.y;
			console.log("detroyDynamite ");
		
			const BodyToDestroy= [];
			engine.world.bodies.forEach((body)=>{
				if(body.TimNo!=undefined)//rope
				{
					let dist= Matter.Vector.magnitude( Matter.Vector.sub(part.MatterBody.position, body.position));
					if(dist<70)
					{
						//console.log("explode touch body ("+body.TimNo+") "+LevelJson.Parts[body.TimNo].name,body);
						if(isDestructibleByExplosive(LevelJson.Parts[body.TimNo])==true)//brick wall, wood incline, wood wall
						{
							//console.log("explode destroy ("+body.TimNo+") "+LevelJson.Parts[body.TimNo].name);
							setTimeout(function (){
							BodyToDestroy.push(body);
							Composite.remove(world, BodyToDestroy);
							LevelJson.Parts[body.TimNo].visible=false;
							}, 500);
						}
						
						if(LevelJson.Parts[body.TimNo].TimType==19) //other dynamite
						{
							if(LevelJson.Parts[body.TimNo].no!=part.no)//ot myself
							{
								console.log("dynamite explode other dynamite", body);
								body.isStatic=true;
								body.force.y=0;
								setTimeout(function (){
									AnimPart(body.TimNo, false,LevelJson.Parts[body.TimNo].flipH,LevelJson.Parts[body.TimNo].flipV,true,false);			
									LevelJson.Parts[body.TimNo].animStep=6;//jump to explosion
								}, 500);
							}
							
						}
						else if(body.isStatic==0)//moving Object
						{
							//console.log("explode move body ("+body.TimNo+") "+LevelJson.Parts[body.TimNo].name);
							let dx=x-body.position.x;
							let dy=y-body.position.y;
							Body.setVelocity(body, { x:dx*-0.1, y: dy*-0.05 });
						}
						
					}
				}
			});
			
			BodyToDestroy.push(part.MatterBody);
			Composite.remove(world, BodyToDestroy);
			part.MatterBody=undefined;
		}
	}
	
	function destroy_ballon(_boby)
	{
		
		LevelJson.Parts[_boby.TimNo].pos_x=_boby.position.x-40;
		LevelJson.Parts[_boby.TimNo].pos_y=_boby.position.y-28;
		
		let constraintToDestroy=undefined;
		engine.world.constraints.forEach((constraint)=>{
			if(constraint.bodyA!=undefined)
				if(constraint.bodyA.id==_boby.id)
				{
					//console.log("found constraint ballon A");
					console.log(constraint);	
					constraintToDestroy=constraint;
				}
			if(constraint.bodyB!=undefined)
				if(constraint.bodyB.id==_boby.id)
				{
					//console.log("found constraint ballon B");
					console.log(constraint);	
					constraintToDestroy=constraint;
				}
			});
		if(constraintToDestroy!=undefined)
			Composite.remove(world, [constraintToDestroy]);
		
		Composite.remove(world, [_boby]);
		
		console.log("destroy ballon "+_boby.TimNo);
		LevelJson.Parts[_boby.TimNo].is_moving=0;
		AnimPart(_boby.TimNo,true,0,0,true,true);
	}
	
	function TeeterTotterTilt(_TeeterTotterBoby,_impactorBody)
	{
		//console.log("TT "+_TeeterTotterBoby.TimNo+"=> rotate ",_TeeterTotterBoby);
		let  bodies = Composite.allBodies(engine.world);
		const collisions = Matter.Query.collides(_TeeterTotterBoby, bodies);
		//console.log("collisions",collisions);
		let vx=0.7;//1.8
		let vy=-5.5;//6.5
		collisions.forEach((collision) => {
			if((LevelJson.Parts[collision.bodyA.TimNo]!=undefined)&&(LevelJson.Parts[collision.bodyA.TimNo].TimType!=3)&&(collision.bodyA.id!=_impactorBody.id))
			{
				let scaleX=-1;
				if(collision.bodyA.position.x>_TeeterTotterBoby.position.x)
				{
					scaleX=1;
					console.log("collisions: apply force A to "+collision.bodyA.TimNo+" =>");
				}
				else
					console.log("collisions: apply force A to "+collision.bodyA.TimNo+" <=");
			//collision.body.isSleeping=true;
			//Body.applyForce(collision.body, collision.body.position, { x:33, y: 0.0010 });
			//Body.applyForce(collision.bodyA, collision.bodyA.position, { x:40, y: -40 });
			console.log("TeeterTotterTilt mass ", PartDef[LevelJson.Parts[collision.bodyA.TimNo].TimType].mass);
			if(PartDef[LevelJson.Parts[collision.bodyA.TimNo].TimType].mass>=1)
				Body.setVelocity(collision.bodyA, { x:vx*scaleX, y: vy });
			else
			{
				
				Body.setVelocity(collision.bodyA, { x:vx*scaleX*1.6, y: vy*1.6 });
			}
			//collision.body.TimDirectionX=scaleX;
			//console.log("collisions ->",collision.body);
			}
			if((LevelJson.Parts[collision.bodyB.TimNo]!=undefined)&&(LevelJson.Parts[collision.bodyB.TimNo].TimType!=3)&&(collision.bodyB.id!=_impactorBody.id))
			{
				let scaleX=-1;
				if(collision.bodyB.position.x>_TeeterTotterBoby.position.x)
				{
					scaleX=1;
					console.log("collisions: apply force B to "+collision.bodyB.TimNo+" =>");
				}
				else
					console.log("collisions: apply force B to "+collision.bodyB.TimNo+" <=");
				
			//console.log("collisions ->",collision.body);
			//collision.body.isSleeping=true;
			//Body.applyForce(collision.bodyB, collision.bodyB.position, { x:40, y: -40 });
			console.log("TeeterTotterTilt mass ", PartDef[LevelJson.Parts[collision.bodyA.TimNo].TimType].mass);
			if(PartDef[LevelJson.Parts[collision.bodyB.TimNo].TimType].mass>=1)
				Body.setVelocity(collision.bodyB, { x:vx*scaleX, y: vy });
			else
				Body.setVelocity(collision.bodyB, { x:vx*scaleX*1.6, y: vy*1.6 });
			//collision.body.TimDirectionX=scaleX;
			//console.log("collisions ->",collision.body);
			}
		});
		
		//_TeeterTotterBoby.angle=_TeeterTotterBoby.angle*-1;
		//_TeeterTotterBoby.isStatic=false;
	}
	function collision_TeeterTotter(_TeeterTotterBoby,_impactorBody,bFromTop)//Teeter-totter (3)
	{
		//console.log("TT "+_TeeterTotterBoby.TimNo+"=> xt=" +_TeeterTotterBoby.position.x+" xi="+_impactorBody.position.x+" st="+LevelJson.Parts[_TeeterTotterBoby.TimNo].animStep+" sw="+LevelJson.Parts[_TeeterTotterBoby.TimNo].flipH);
		let FlipH=0;
		if(bFromTop==false)//revert logic
			FlipH=1;
		if(_impactorBody.position.x<_TeeterTotterBoby.position.x)
		{
			if(LevelJson.Parts[_TeeterTotterBoby.TimNo].flipH==FlipH)
			{
				//console.log("TT "+_TeeterTotterBoby.TimNo+"=> falling left");
				if((LevelJson.Parts[_TeeterTotterBoby.TimNo].animStep==undefined)||(LevelJson.Parts[_TeeterTotterBoby.TimNo].animStep==0))
				{
					console.log("TT "+_TeeterTotterBoby.TimNo+"=> "+_impactorBody.TimNo+" falling left, no move");
				}
				else
				{
					console.log("TT "+_TeeterTotterBoby.TimNo+"=> "+_impactorBody.TimNo+" falling left, move=>");
					TeeterTotterTilt(_TeeterTotterBoby,_impactorBody);
				}
			}
			else
			{
				//console.log("TT "+_TeeterTotterBoby.TimNo+"=> falling right (swapped)");
				if((LevelJson.Parts[_TeeterTotterBoby.TimNo].animStep==undefined)||(LevelJson.Parts[_TeeterTotterBoby.TimNo].animStep==0))
				{
					console.log("TT "+_TeeterTotterBoby.TimNo+"=> "+_impactorBody.TimNo+" falling right (swapped), move=>");
					TeeterTotterTilt(_TeeterTotterBoby,_impactorBody);
				}
				else
				{
					console.log("TT "+_TeeterTotterBoby.TimNo+"=> "+_impactorBody.TimNo+" falling right (swapped), no move");
				}
			}
		}
		else
		{
			if(LevelJson.Parts[_TeeterTotterBoby.TimNo].flipH==FlipH)
			{
				//console.log("TT "+_TeeterTotterBoby.TimNo+"=> falling right");
				if((LevelJson.Parts[_TeeterTotterBoby.TimNo].animStep==undefined)||(LevelJson.Parts[_TeeterTotterBoby.TimNo].animStep==0))
				{
					console.log("TT "+_TeeterTotterBoby.TimNo+"=> falling "+_impactorBody.TimNo+" right, move=>");
					TeeterTotterTilt(_TeeterTotterBoby,_impactorBody);
				}
				else
				{
					console.log("TT "+_TeeterTotterBoby.TimNo+"=> falling "+_impactorBody.TimNo+" right, no move");
				}
			}
			else
			{
				if((LevelJson.Parts[_TeeterTotterBoby.TimNo].animStep==undefined)||(LevelJson.Parts[_TeeterTotterBoby.TimNo].animStep==0))
				{
					console.log("TT "+_TeeterTotterBoby.TimNo+"=> falling "+_impactorBody.TimNo+" left(swapped), no move");
				}
				else
				{
					console.log("TT "+_TeeterTotterBoby.TimNo+"=> falling "+_impactorBody.TimNo+" left(swapped), move=>");
					TeeterTotterTilt(_TeeterTotterBoby,_impactorBody);
				}
			}
		}
	}
	function CheckGear(GearBody)
	{
		//console.log("CheckGear");
		if((LevelJson.Parts[GearBody.TimNo].anim==undefined)||(LevelJson.Parts[GearBody.TimNo].anim==false))
			return;
		//console.log("CheckGear rotating");
		
		LevelJson.Parts.forEach(part => {
			//
			if(part.TimType==4)//baloon
			{
				if(Matter.Collision.collides(GearBody, part.MatterBody) != null)
				{
					if(part.anim==undefined)//ballon is not yet exploding
					{
						console.log("CheckGear touching ballon"+part.no);
						destroy_ballon(part.MatterBody);
					}
				}
			}
			if(part.TimType==14)//other gear
			{
				if(Matter.Collision.collides(GearBody, part.MatterBody) != null)
				{
					if(part.anim==undefined)//gear is not yet rotating
					{
						console.log("CheckGear touching gear"+part.no);
						AnimPart(part.no,false,part.flipH,part.flipV,false,false);	
					}
				}
			}
		});
	}
	
	function boxing(BoxingBody)
	{
		if((LevelJson.Parts[BoxingBody.TimNo].animStep==undefined)||(LevelJson.Parts[BoxingBody.TimNo].animStep==0)||(LevelJson.Parts[BoxingBody.TimNo].animStep==10))
			return;
		
		//console.log("Boxing collision step",LevelJson.Parts[BoxingBody.TimNo].animStep);
		let scaleX=-1;
		let x=LevelJson.Parts[BoxingBody.TimNo].pos_x+playgroundOffsetX+LevelJson.Parts[BoxingBody.TimNo].width;
		
		if(LevelJson.Parts[BoxingBody.TimNo].flipH==1)
		{
			scaleX=1;
			x=LevelJson.Parts[BoxingBody.TimNo].pos_x;
		}
		if(LevelJson.Parts[BoxingBody.TimNo].animStep!=undefined)
		{
			//console.log("w="+LevelJson.Parts[BoxingBody.TimNo].TimType+"-"+LevelJson.Parts[BoxingBody.TimNo].animStep);
			let imageWidth=Images[LevelJson.Parts[BoxingBody.TimNo].TimType+"-"+LevelJson.Parts[BoxingBody.TimNo].animStep].width;
			//console.log("w="+imageWidth);
			let startPoint = { x: x, y: LevelJson.Parts[BoxingBody.TimNo].pos_y+playgroundOffsetY+LevelJson.Parts[BoxingBody.TimNo].height/2 };
			var collisions = [];
			let  bodies = Composite.allBodies(engine.world);
			let  endPoint = { x:x +(imageWidth)*scaleX, y: LevelJson.Parts[BoxingBody.TimNo].pos_y+playgroundOffsetY+LevelJson.Parts[BoxingBody.TimNo].height/2};
			
			
			collisions= Matter.Query.ray(bodies, startPoint, endPoint,LevelJson.Parts[BoxingBody.TimNo].height) ;
			//console.log("collisions",collisions);
			collisions.forEach((collision) => {
				if(collision.body.isStatic==false)
				{
				//console.log("collisions ->",collision.body);
				//collision.body.isSleeping=true;
				//Body.applyForce(collision.body, collision.body.position, { x:33, y: 0.0010 });
				//Body.setVelocity(collision.body, { x:10*scaleX, y: 0 });//for ball
				Body.setVelocity(collision.body, { x:5*scaleX, y: 0 });
				collision.body.TimDirectionX=scaleX;
				//console.log("collisions ->",collision.body);
				}
			});
		}
	}
	function collision_Boxing(BoxingBody)//Boxing glove (35)
	{
		if(LevelJson.Parts[BoxingBody.TimNo].animStep>=1)
			return;
		//console.log("Boxing collision",BoxingBody);
		AnimPart(BoxingBody.TimNo,false,LevelJson.Parts[BoxingBody.TimNo].flipH,LevelJson.Parts[BoxingBody.TimNo].flipV,true,false);
		boxing(BoxingBody);
		
	}
	function collision_Trampoline(_TrampolineBoby,_impactorBody)
	{
		console.log("collision_Trampoline ->"+_impactorBody.id,_impactorBody.velocity.x);
		if((_impactorBody.velocity.y>0))
		{
			Body.setVelocity(_impactorBody, { x:_impactorBody.velocity.x*1.0, y: -1.4 *_impactorBody.velocity.y });//4.9 -10
			AnimPart(_TrampolineBoby.TimNo,false,LevelJson.Parts[_TrampolineBoby.TimNo].flipH,LevelJson.Parts[_TrampolineBoby.TimNo].flipV,true,false);
		}
	}
	
	function collision_cisor(_cisorBoby,_impactorBody)//cisor
	{
		//console.log("cisor collision",_cisorBoby);
		//console.log("_impactorBody collision",_impactorBody);
		if((_impactorBody.bounds.max.x>_cisorBoby.bounds.min.x)&&(_impactorBody.bounds.min.x<_cisorBoby.bounds.max.x))
		{
			console.log("cisor collision from top or bottom",_cisorBoby);
			AnimPart(_cisorBoby.TimNo,false,LevelJson.Parts[_cisorBoby.TimNo].flipH,LevelJson.Parts[_cisorBoby.TimNo].flipV,true,false);
			LevelJson.Parts[_cisorBoby.TimNo].animStep=2;
			
			//cut rope ?
			let distMin=99999;
			let ropePart=undefined;
			engine.world.bodies.forEach((body)=>{
				if(body.TimNo==undefined)//rope
				{
					let dist= Matter.Vector.magnitude( Matter.Vector.sub(_cisorBoby.position, body.position));
					if(dist<distMin)
					{
						distMin=dist;
						ropePart=body;
					}
				}
			});
			if(distMin<20)
			{
				//cut the rope
				console.log("distMin",distMin);
				console.log("distMin ropePart",ropePart);
				let ropeConstraint=undefined;
				engine.world.constraints.forEach((constraint)=>{
					
					if(constraint.bodyA.id==ropePart.id)
					{
						console.log("found constraint");
						console.log(constraint);	
						ropeConstraint=constraint;
					}
				});
				if(ropeConstraint!=undefined)
					Composite.remove(world, ropeConstraint);			
			}
			
		}
	}
	function startFan(partno)
	{
		let scaleX=1;
		if(LevelJson.Parts[partno].flipH==1)
			scaleX=-1;
		
		let startPoint = { x: LevelJson.Parts[partno].pos_x+playgroundOffsetX+LevelJson.Parts[partno].width/2, y: LevelJson.Parts[partno].pos_y+playgroundOffsetY+LevelJson.Parts[partno].height/2 };
		var collisions = [];
        let  bodies = Composite.allBodies(engine.world);
        let  endPoint = { x: LevelJson.Parts[partno].pos_x+playgroundOffsetX+LevelJson.Parts[partno].width/2+150*scaleX, y: LevelJson.Parts[partno].pos_y+playgroundOffsetY+LevelJson.Parts[partno].height/2};
		
		//drawRay( startPoint, endPoint);
		collisions= Matter.Query.ray(bodies, startPoint, endPoint) ;
		console.log("collisions",collisions);
		collisions.forEach((collision) => {
			if(collision.body.isStatic==false)
			{
			//console.log("collisions ->",collision.body);
				//collision.body.isSleeping=true;
				//Body.applyForce(collision.body, collision.body.position, { x:33, y: 0.0010 });
				Body.setVelocity(collision.body, { x:5*scaleX, y: 0 });
				collision.body.TimDirectionX=scaleX;
				//console.log("collisions ->",collision.body);
			}
			else
			{
				//console.log("bellow blow Type->",LevelJson.Parts[collision.body.TimNo].TimType);
				if(LevelJson.Parts[collision.body.TimNo].TimType==40)//Windmill (40)
				{
					
					console.log("fan blow No->"+collision.body.TimNo+" dir="+scaleX);
					collision.body.TimDirectionX=scaleX;
					if(scaleX==1)
						AnimPart(collision.body.TimNo,true,0,LevelJson.Parts[collision.body.TimNo].flipV,false,false);
					else
						AnimPart(collision.body.TimNo,true,1,LevelJson.Parts[collision.body.TimNo].flipV,false,false);
				}
			}
		});
	}
	function startElectricEngine(partno)
	{
		console.log("startElectricEngine ",LevelJson.Parts[partno]);
		
		
	}
	function SwitchElectric(partno)
	{
		if(LevelJson.Parts[partno].anim==true)
		{
			LevelJson.Parts[partno].anim=false;
			console.log("Electric stop "+partno);
		}
		else
		{
			
			console.log("Electric start "+partno);
			
			if(LevelJson.Parts[partno].TimType==24)//Electric fan
			{
				AnimPart(partno,false,LevelJson.Parts[partno].flipH,LevelJson.Parts[partno].flipV,false,false);
				startFan(partno);
			}
			if(LevelJson.Parts[partno].TimType==50)//Electric engine (50)
			{
				AnimPart(partno,true,LevelJson.Parts[partno].flipH,LevelJson.Parts[partno].flipV,false,false);
				startElectricEngine(partno);
			}
		}


		
	}
	function collision_ElectricSwitch(_switchBoby,_impactorBody)
	{
		
		if((_impactorBody.velocity.y>0)&&(LevelJson.Parts[_switchBoby.TimNo].switch=="up"))
		{
			//console.log("ElectricSwitch collision >down "+_switchBoby.TimNo,_impactorBody.velocity.y);
			LevelJson.Parts[_switchBoby.TimNo].switch="down";
			if(LevelJson.Parts[_switchBoby.TimNo].connected_part_1!=undefined)
				SwitchElectric(LevelJson.Parts[_switchBoby.TimNo].connected_part_1);
			if(LevelJson.Parts[_switchBoby.TimNo].connected_part_2!=undefined)
				SwitchElectric(LevelJson.Parts[_switchBoby.TimNo].connected_part_2);
		}
		else if((_impactorBody.velocity.y<0)&&(LevelJson.Parts[_switchBoby.TimNo].switch=="down"))
		{
			//console.log("ElectricSwitch collision >up "+_switchBoby.TimNo,_impactorBody.velocity.y);
			LevelJson.Parts[_switchBoby.TimNo].switch="up";
			if(LevelJson.Parts[_switchBoby.TimNo].connected_part_1!=undefined)
				SwitchElectric(LevelJson.Parts[_switchBoby.TimNo].connected_part_1);
			if(LevelJson.Parts[_switchBoby.TimNo].connected_part_2!=undefined)
				SwitchElectric(LevelJson.Parts[_switchBoby.TimNo].connected_part_2);
		}
	}
	
	function collision_FlashLight(_flashLightBoby,_impactorBody)
	{
		if((_impactorBody.velocity.y>0))
		{
			console.log("FlashLight collision >up "+_flashLightBoby.TimNo,_impactorBody.velocity.y);
			AnimPart(_flashLightBoby.TimNo,false,LevelJson.Parts[_flashLightBoby.TimNo].flipH,LevelJson.Parts[_flashLightBoby.TimNo].flipV,true,false);
		}
	}
	
	function collision_dynamite(_dynamiteBoby,_impactorBody)
	{
		if(LevelJson.Parts[_impactorBody.TimNo].TimType==20)//bullet
		{
			console.log("dynamite hitted by a bullet");
			Composite.remove(world, [_impactorBody]);//delete bullet
			
			AnimPart(_dynamiteBoby.TimNo, false,LevelJson.Parts[_dynamiteBoby.TimNo].flipH,LevelJson.Parts[_dynamiteBoby.TimNo].flipV,true,false);			
			LevelJson.Parts[_dynamiteBoby.TimNo].animStep=6;//jump to explosion
		}
	}
	function collision_DynamiteWithPlunger(_PlungerBoby,_impactorBody)
	{
		if(LevelJson.Parts[_PlungerBoby.TimNo].anim!=true)
		{
			if((_impactorBody.velocity.y>0))
			{
				if(LevelJson.Parts[_PlungerBoby.TimNo].flipH==0)//should colide on right
				{
					if(_impactorBody.position.x>LevelJson.Parts[_PlungerBoby.TimNo].pos_x+LevelJson.Parts[_PlungerBoby.TimNo].width*3/4)
					{
						console.log("DynamiteWithPlunger collision >up right "+_PlungerBoby.TimNo,_impactorBody.velocity.y);
						AnimPart(_PlungerBoby.TimNo,false,LevelJson.Parts[_PlungerBoby.TimNo].flipH,LevelJson.Parts[_PlungerBoby.TimNo].flipV,true,false);
					}
				}
				else//should colide on left
				{
					if(_impactorBody.position.x<LevelJson.Parts[_PlungerBoby.TimNo].pos_x+LevelJson.Parts[_PlungerBoby.TimNo].width*1/4)
					{
						console.log("DynamiteWithPlunger collision >up left "+_PlungerBoby.TimNo,_impactorBody.velocity.y);
						AnimPart(_PlungerBoby.TimNo,false,LevelJson.Parts[_PlungerBoby.TimNo].flipH,LevelJson.Parts[_PlungerBoby.TimNo].flipV,true,false);
					}
				}
				
			}
		}
	}
	
	function collision_Aquarium(partno,destroy)
	{
		let part1=LevelJson.Parts[partno];
		if(part1.animOnce==false)
		{
			console.log("----------------- break aquarium ("+part1.no+") "+part1.name);
			if(destroy==true)
				Composite.remove(world, [part1.MatterBody]);
			part1.nb_anim=26;
			part1.animStep=12;
			part1.animOnce=true;
			part1.fixed=0;
			part1.pos_x=part1.pos_x-22;
			part1.pos_y=part1.pos_y+7;

		}
	}
	
	
	function collision_Monkey(_MonkeyBoby,_impactorBody)
	{
		if((_impactorBody.velocity.y>0))
		{
			console.log("Monkey collision >up ");
			LevelJson.Parts[_MonkeyBoby.TimNo].animPause=true;
			let otherExtremity=PartBeltExtremity(_MonkeyBoby.TimNo);
			if(otherExtremity!=-1)
			{
				console.log("from Part "+_MonkeyBoby.TimNo+" stop action on "+otherExtremity);
				LevelJson.Parts[otherExtremity].anim=false;
				setTimeout(function (){
							console.log("from Part "+_MonkeyBoby.TimNo+" restart action on "+otherExtremity);
							if(LevelJson.Parts[_MonkeyBoby.TimNo].anim==true)
								AnimPart(otherExtremity,false,LevelJson.Parts[_MonkeyBoby.TimNo].flipH,LevelJson.Parts[_MonkeyBoby.TimNo].flipV,false,false);	
							LevelJson.Parts[_MonkeyBoby.TimNo].animPause=false;
							}, 2000);
			}
		}
	}
	//--------------------------------------------------
	// collisionStart
	//--------------------------------------------------
	function collisionStart(event)
	{
		const pairs = event.pairs;
		//console.log("Collision Pairs ",pairs);
		pairs.forEach((collision) => {
			if((collision.bodyA.TimNo!=undefined)&&(collision.bodyB.TimNo!=undefined))
			{
				//console.log("Collision Parts No: "+collision.bodyA.TimNo +"="+LevelJson.Parts[collision.bodyA.TimNo].name+" - "+ collision.bodyB.TimNo+"="+LevelJson.Parts[collision.bodyB.TimNo].name);
				
				if(LevelJson.Parts[collision.bodyA.TimNo].TimType==3)//Teeter-totter (3)
					collision_TeeterTotter(collision.bodyA,collision.bodyB,true);
				if(LevelJson.Parts[collision.bodyB.TimNo].TimType==3)//Teeter-totter (3)
					collision_TeeterTotter(collision.bodyB,collision.bodyA,true);
				
				if(LevelJson.Parts[collision.bodyA.TimNo].TimType==4)//baloon (4)
					collision_ballon(collision.bodyA,collision.bodyB);
				if(LevelJson.Parts[collision.bodyB.TimNo].TimType==4)//baloon (4)
					collision_ballon(collision.bodyB,collision.bodyA);
				
				if(LevelJson.Parts[collision.bodyA.TimNo].TimType==6)//mouse (6)
					collision_mouse(collision.bodyA.TimNo);
				if(LevelJson.Parts[collision.bodyB.TimNo].TimType==6)//mouse (6)
					collision_mouse(collision.bodyB.TimNo);
				
				if(LevelJson.Parts[collision.bodyA.TimNo].TimType==15)//Aquarium (15)
					collision_Aquarium(collision.bodyA.TimNo,false);
				if(LevelJson.Parts[collision.bodyB.TimNo].TimType==15)//Aquarium (15)
					collision_Aquarium(collision.bodyB.TimNo,false);

				

				if(LevelJson.Parts[collision.bodyA.TimNo].TimType==16)//bellow (16)
					collision_bellow(collision.bodyA);
				if(LevelJson.Parts[collision.bodyB.TimNo].TimType==16)//bellow (16)
					collision_bellow(collision.bodyB);
				
				if(LevelJson.Parts[collision.bodyA.TimNo].TimType==19)//Dynamite (19)
					collision_dynamite(collision.bodyA,collision.bodyB);
				if(LevelJson.Parts[collision.bodyB.TimNo].TimType==19)//Dynamite (19)
					collision_dynamite(collision.bodyB,collision.bodyA);
			
				if(LevelJson.Parts[collision.bodyA.TimNo].TimType==21)//Electric switch & outlet (21)
					collision_ElectricSwitch(collision.bodyA,collision.bodyB);
				if(LevelJson.Parts[collision.bodyB.TimNo].TimType==21)//Electric switch & outlet (21)
					collision_ElectricSwitch(collision.bodyB,collision.bodyA);
				
				if(LevelJson.Parts[collision.bodyA.TimNo].TimType==22)//Dynamite with plunger (22)
					collision_DynamiteWithPlunger(collision.bodyA,collision.bodyB);
				if(LevelJson.Parts[collision.bodyB.TimNo].TimType==22)//Dynamite with plunger (22) 
					collision_DynamiteWithPlunger(collision.bodyB,collision.bodyA);
				
				
				if(LevelJson.Parts[collision.bodyA.TimNo].TimType==25)//Flashlight (25)
					collision_FlashLight(collision.bodyA,collision.bodyB);
				if(LevelJson.Parts[collision.bodyB.TimNo].TimType==25)//Flashlight (25)
					collision_FlashLight(collision.bodyB,collision.bodyA);
				
				if(LevelJson.Parts[collision.bodyA.TimNo].TimType==31)//Monkey exercise bike (31)
					collision_Monkey(collision.bodyA,collision.bodyB);
				if(LevelJson.Parts[collision.bodyB.TimNo].TimType==31)//Monkey exercise bike (31)
					collision_Monkey(collision.bodyB,collision.bodyA);
			
				
				
				if(LevelJson.Parts[collision.bodyA.TimNo].TimType==35)//Boxing glove (35)
					collision_Boxing(collision.bodyA);
				if(LevelJson.Parts[collision.bodyB.TimNo].TimType==35)//Boxing glove (35)
					collision_Boxing(collision.bodyB);		
				
				if(LevelJson.Parts[collision.bodyA.TimNo].TimType==37)//scisor (37)
					collision_cisor(collision.bodyA,collision.bodyB);
				if(LevelJson.Parts[collision.bodyB.TimNo].TimType==37)//scisor (37)
					collision_cisor(collision.bodyB,collision.bodyA);

				if(LevelJson.Parts[collision.bodyA.TimNo].TimType==39)//Trampoline (39)
					collision_Trampoline(collision.bodyA,collision.bodyB);
				if(LevelJson.Parts[collision.bodyB.TimNo].TimType==39)//Trampoline (39)
					collision_Trampoline(collision.bodyB,collision.bodyA);
				

			
			}
		});
	  
	}
	//--------------------------------------------------
	// stop
	//--------------------------------------------------
	function stop()
	{
		clearInterval(myTimer);
		
		CurrentLevelRunning=false;
		if(world!=undefined)
		{
			World.clear(world);
			World.clear(engine.world);
		}
		if(engine!=undefined)
		{
			cleanPhysics(true);
			Engine.clear(engine);
			engine.events = {};
		}
		if(render!=undefined)
		{
			render.events = {};
			Render.stop(render);
		}
					
		if(runner!=undefined)
		{
			console.log("Runner.stop");
			//Runner.clear(runner);	
			Runner.stop(runner);
			
		}
		
		if(LevelJson!=undefined)
		{
			console.log("reset LevelJson");
			LevelJson.Parts.forEach(part => {
				
				part.MatterBody=undefined;
				part.selected=0;
				if((LevelJsonOrigin!=undefined)&&(LevelJsonOrigin.Parts[part.no]!=undefined))
				{
					part.is_moving=LevelJsonOrigin.Parts[part.no].is_moving;
					part.pos_x=LevelJsonOrigin.Parts[part.no].pos_x;
					part.pos_y=LevelJsonOrigin.Parts[part.no].pos_y;
					part.in_partsbin=LevelJsonOrigin.Parts[part.no].in_partsbin;
					part.fixed=LevelJsonOrigin.Parts[part.no].fixed;
					part.switch=LevelJsonOrigin.Parts[part.no].switch;
					
				}
				part.anim=false;
				part.visible=true;
				part.animStep=0;
				part.animDelay=0;
				part.animDirectionX=0;
				part.animOnce=false;
				part.animCleanAtEnd=false;
				part.isfiring=undefined;

			});
		}
	}
	function initMatterJS()
	{
		engine = Engine.create({
			positionIterations: 6,//default 6
			velocityIterations: 4,//12,//default 4
			constraintIterations:2////default 2
		});
		runner=undefined;
		render = Render.create({
			  engine, 
			  canvas: canvas,
			  options: {
				wireframes: wireframe,
				background: "rgba(0,162,162,255)",
				//background: 'transparent',
				width: canvas.width,
				height: canvas.height,
				pixelRatio:  window.devicePixelRatio // here
			  }
			}); 
		world = engine.world;
		
		Events.on(render, "beforeRender", (event) => {beforeRender();});
		Events.on(render, "afterRender", (event) => {afterRender();});
		Events.on(engine,"collisionStart", (event) => {collisionStart(event);});
	}
	
	
	
	function addRopeSegment(start_x,start_y,next_x,next_y, rope)
	{
		let rope_segment_length = 6;//6
		let dx=next_x- start_x;
		let dy=next_y- start_y;
		//console.log("dx",dx);
		//console.log("dy",dy);
		/*
		start_x+=playgroundOffsetX;
		start_y+=playgroundOffsetY;
		next_x+=playgroundOffsetX;
		next_y+=playgroundOffsetY;
		*/
		let distance=Math.sqrt((dx*dx)+(dy*dy));
		//console.log("distance",distance);
		let distanceBetween=9;//9
		
		for (var i = 0; i < distance/distanceBetween; i += 1) 
		{	
			let current_x=start_x+i*(dx/distance)*distanceBetween;
			let current_y=start_y+i*(dy/distance)*distanceBetween;
			
			let RopeBody = Bodies.rectangle(current_x, current_y, rope_segment_length,rope_segment_length,{label:"rope",friction:1,	frictionStatic:1, mass:0.1	,sleepThreshold:20 ,render: { visible: false} , collisionFilter: { category:collisionCategory_rope,mask: collisionCategory_rope }});
			//let RopeBody = Bodies.circle(current_x, current_y, rope_segment_length,{friction:1,	frictionStatic:1, mass:0.3	,sleepThreshold:5 ,render: { visible: true} });
			RopeBody.mass2=0.01;//0.01
			RopeBody.TimNo=undefined;
			
			
			
			last_RopeBody = rope.pop();
			if(last_RopeBody!=undefined)
			{
				let cons = Constraint.create({
					bodyA: last_RopeBody,
					bodyB: RopeBody,
					stiffness: 1,
					render: { anchors: false, lineWidth: 1, type: 'line', strokeStyle:"rgb(243, 178, 0)"}
					
				});
				rope.push(last_RopeBody);
				rope.push(cons);
			}
			rope.push(RopeBody)
		}
	}
	
	
	
	
	//--------------------------------------------------
	// run
	//--------------------------------------------------
	function run()
	{
		initMatterJS();
		//remove the link with physics
		LevelJson.Parts.forEach(part => {
			part.MatterBody=undefined;
		});
		LevelJsonOrigin =JSON.parse(JSON.stringify(LevelJson));
		
		//console.log("LevelJsonOrigin: ",LevelJsonOrigin);
		CurrentLevelRunning=true;
		//console.log("run! "+engine.world.gravity.y);
		CurrentLevelWinned=false;
		
		selectPart(-1);
		
		//clean the World
		//cleanPhysics(false);
		engine.world.gravity.y = 0;
		LevelJson.Parts.forEach(part => {
					
			
			if(part.in_partsbin==0)//not in bin
			{
				
				//console.log(part);
				if(part.is_moving!=0)//moving
				{
					if(part.TimType==10)//Rope (10)
					{
						
					}
					else
					{
						var restitution=PartDef[part.TimType].restitution;
						if(restitution==undefined)
							restitution=0;
						var mass=PartDef[part.TimType].mass;
						if(mass==undefined)
							mass=1;
						let ox=0;
						let oy=0;
						if(PartDef[part.TimType].ox!=undefined)
							ox=PartDef[part.TimType].ox;
						if(PartDef[part.TimType].oy!=undefined)
							oy=PartDef[part.TimType].oy;
						
						let sub=0;
						if(part.flipH==1)
						{
							if(part.TimType==19)//dynamite
							{
								console.log("dynamite Flip" );
								sub=6;
							}
						}
						
						if(PartDef[part.TimType].phy_poly===undefined)
						{
							var MatterBody = Bodies.circle(playgroundOffsetX+part.pos_x+part.Images[part.TimType+"-0"].width/2, playgroundOffsetY+part.pos_y+part.Images[part.TimType+"-0"].height/2,  part.Images[part.TimType+"-0"].width/2, {
								TimNo:part.no,
								isSleeping: false,
								isStatic: false,
								restitution: restitution, 
								
								//	density:mass, 
								mass:Math.abs(mass),
								mass2:mass,
								render: {
								  sprite: { texture: part.Images[part.TimType+"-"+sub].src, 
								  //xScale: ratio,
								  //yScale: ratio,
									xOffset: ox,
									yOffset: oy//-0.18
								  
								  }
								  },
								  collisionFilter: { category:collisionCategory_general,mask: -1&(~collisionCategory_TeeterTotter) }
								  });
						
							//MatterBody.friction=0.001;
							MatterBody.frictionAir=0.001;
							//MatterBody.frictionAir=0.1;
							//MatterBody.sleepThreshold=2;
							//Matter.Body.setInertia(MatterBody, 150);
							//Matter.Body.setInertia(MatterBody, Infinity);
							Composite.add(world, [MatterBody]);
							part.MatterBody=MatterBody;
						}
						else
						{
							var restitution=PartDef[part.TimType].restitution;
							if(restitution==undefined)
								restitution=0;
							var mass=PartDef[part.TimType].mass;
							if(mass==undefined)
								mass=1;
							//console.log("poly");
							//console.log("phy_poly.length="+PartDef[part.TimType].phy_poly.length);
							for(let i=0;i<PartDef[part.TimType].phy_poly.length;i++)
							{
								let verts = Matter.Vertices.fromPath(PartDef[part.TimType].phy_poly[i].p);
								let scaleX=1;
								let scaleY=1;
								
								if(part.flipH!=0)
									scaleX=-1;
								if(part.flipV!=0)
									scaleY=-1;
								
								Matter.Vertices.scale(verts, scaleX*part.width, scaleY*part.height);
								let ox=part.pos_x+(part.width/2);
								let oy=part.pos_y+(part.height/2);
								if(PartDef[part.TimType].phy_poly[i].x!=undefined)
								{
									//console.log("ggg  x");
									ox=ox-(PartDef[part.TimType].phy_poly[i].x*part.width)*scaleX;
								}
								if(PartDef[part.TimType].phy_poly[i].y!=undefined)
								{
									//console.log("ggg  y");
									oy=oy-(PartDef[part.TimType].phy_poly[i].y*part.height)*scaleY;
								}
								//console.log("Poly ox",ox);
								var MatterBody =Bodies.fromVertices(playgroundOffsetX+ox, playgroundOffsetY+oy, verts, {
									isStatic: false, 
									TimNo:part.no,
									restitution: restitution, 
								//	density:mass, 
									mass:Math.abs(mass),
									mass2:mass,
									render: {   
										sprite: { texture: part.Images[part.TimType+"-0"].src, 
									  //xScale: ratio,
									  //yScale: ratio,
										//xOffset: ox,
										//yOffset: oy//-0.18
												}	
									},		
									 collisionFilter: { category:collisionCategory_general,mask: -1&(~collisionCategory_TeeterTotter) }
									}, false, 0.0001, 100);
								
								//MatterBody.friction=1;
								MatterBody.frictionAir=0.02;
								
								if(part.flipH==1)
									Body.rotate(MatterBody, 3.14);
			
								//MatterBody.frictionAir=0.1;
								//MatterBody.sleepThreshold=2;
								//console.log("Poly move",MatterBody);
								Composite.add(world, [MatterBody]);
								part.MatterBody=MatterBody;
								//console.log(MatterBody);
								
								Matter.Body.setInertia(MatterBody, Infinity);
							}
						}
					}
					
				}
				else//not moving
				{
					let _isStatic=true;
					if(part.TimType==3)	//"Teeter-totter (3)"
						_isStatic=false;
				
					if(part.TimType==7)//"pulley (7)"
					{
						let oy=0;
						let ox=0;
						if(part.appearance=="left (1)")
							ox=5;
						if(part.appearance=="right (3)")
							ox=-5;
				
						if(part.appearance=="top (2)")
							oy=5;
						var MatterBody = Bodies.circle(playgroundOffsetX+part.pos_x+ox+part.Images[part.TimType+"-0"].width/2, playgroundOffsetY+part.pos_y+oy+part.Images[part.TimType+"-0"].height/2, 10, {
							TimNo:part.no,
							isSleeping: false,
							isStatic: true,
							//restitution: 0, 
							slop:1,//magic!!!
							/*
							restitution: restitution, 
							friction:1,
							frictionStatic:0.5*20,
							*/
							render: {fillStyle: "rgba(0, 0, 255, 0)" },
							collisionFilter: { category:collisionCategory_rope,mask: collisionCategory_rope }
							  });
						Composite.add(world, [MatterBody]);
						part.MatterBody=MatterBody;
						part.staticObjId=MatterBody.id;
						//console.log("id=",part.staticObjId);
					}
					else if(part.TimType==3)//"Teeter-totter (3)"
					{
						//console.log("Teeter-totter=",part.no);
						var MatterBody = Bodies.rectangle(playgroundOffsetX+part.pos_x+part.width/2,playgroundOffsetY+part.pos_y+part.height/2+2, part.width-4, 5, {
							isStatic: _isStatic, 
							TimNo:part.no,
							render: { fillStyle: "rgba(0, 0, 255, 0)" },
							//collisionFilter: { category:collisionCategory_bullet,mask: collisionCategory_general }
							});
						//console.log("IIIIIIIIIIIIIIIIIIIII  Teeter-totter "+part.flipH);
						if(part.flipH==0)
							Matter.Body.rotate(MatterBody,-0.3);
						else
							Matter.Body.rotate(MatterBody,0.3);
					
						MatterBody.friction=1;
 						MatterBody.frictionAir=0.01*20;
						MatterBody.frictionStatic=0.5*20;

						Composite.add(world, [MatterBody]);
						part.MatterBody=MatterBody;
						part.staticObjId=MatterBody.id;
						//console.log("id=",part.staticObjId);
			
						 var staticObjBlocBottom = Bodies.rectangle(playgroundOffsetX+part.pos_x+part.width/2,playgroundOffsetY+part.pos_y+part.height-3, part.width-6, 5, {
							isStatic: true, 
							render: { fillStyle: "rgba(0, 0, 255, 0)" },
							collisionFilter: { category:collisionCategory_TeeterTotter }
							});
						Composite.add(world, [staticObjBlocBottom]);	
						 var constraint = Constraint.create({
							pointA: { x: playgroundOffsetX+part.pos_x+part.width/2, y: playgroundOffsetY+part.pos_y+part.height/2 },
							bodyB: MatterBody,
							length: 0, 
							render: { visible: false},
							
						});
						//console.log("constraint",constraint);
						Composite.add(world, [constraint]);
						
						
					}
					else if(PartDef[part.TimType].phy_poly!=undefined)
					{
						//console.log("poly");
						//console.log("phy_poly.length="+PartDef[part.TimType].phy_poly.length);
						for(let i=0;i<PartDef[part.TimType].phy_poly.length;i++)
						{
							let verts = Matter.Vertices.fromPath(PartDef[part.TimType].phy_poly[i].p);
							let scaleX=1;
							let scaleY=1;
							
							if(part.flipH!=0)
								scaleX=-1;
							if(part.flipV!=0)
								scaleY=-1;
							if(part.TimType==47)
							{
								let start=part.appearance.indexOf('(');
								let end=part.appearance.indexOf(')');
								let subResult = part.appearance.substring(start+1, end);
								if(subResult==1)
									scaleX=-1;
								if(subResult==2)
									scaleY=-1;
								if(subResult==3)
								{
									scaleX=-1;
									scaleY=-1;
								}
							}
							
							Matter.Vertices.scale(verts, scaleX*part.width, scaleY*part.height);
							let ox=part.pos_x+(part.width/2);
							let oy=part.pos_y+(part.height/2);
							if(PartDef[part.TimType].phy_poly[i].x!=undefined)
							{
								//console.log("ggg  x");
								ox=ox-(PartDef[part.TimType].phy_poly[i].x*part.width)*scaleX;
							}
							if(PartDef[part.TimType].phy_poly[i].y!=undefined)
							{
								//console.log("ggg  y");
								oy=oy-(PartDef[part.TimType].phy_poly[i].y*part.height)*scaleY;
							}
							
							var MatterBody =Bodies.fromVertices(playgroundOffsetX+ox, playgroundOffsetY+oy, verts, {
								isStatic: _isStatic, 
								TimNo:part.no,
								render: { fillStyle: "rgba(0, 0, 255, 0)"}
								}, true, 0.001, 20);
							if(part.TimType==16)//bellows (soufflet)
							{
								//console.log("bellows=",MatterBody);
								MatterBody.friction=1;
								MatterBody.frictionStatic=0.8;
							}
							Composite.add(world, [MatterBody]);
							part.MatterBody=MatterBody;
							part.staticObjId=MatterBody.id;
							//console.log("id=",part.staticObjId);
							
						}
					}
					else
					{
						let _isSensor=false;
						if(part.TimType==21)//Electric switch & outlet 
							_isSensor=true;
												
						var MatterBody = Bodies.rectangle(playgroundOffsetX+part.pos_x+part.width/2,playgroundOffsetY+part.pos_y+part.height/2, part.width, part.height, {
							isStatic: _isStatic, 
							TimNo:part.no,
							render: { fillStyle: "rgba(0, 0, 255, 0)" },
							isSensor: _isSensor,
							
							collisionFilter: { category:collisionCategory_general,mask: -1&(~collisionCategory_bullet) }//
							});
						Composite.add(world, [MatterBody]);
						part.MatterBody=MatterBody;
						part.staticObjId=MatterBody.id;
						//console.log("id=",part.staticObjId);
					}
				}
			}
		});
		
		LevelJson.Parts.forEach(part => {
			if(part.TimType==10)//Rope (10)
			{
				//console.log("rope: "+part.no);
				if((part.connected_part_1!=undefined)&&(part.connected_part_2!=undefined))
				{
					
					
					var startboxRx=getPosXRope(part,part.connected_part_1,false)-(LevelJson.Parts[part.connected_part_1].pos_x+LevelJson.Parts[part.connected_part_1].width/2+playgroundOffsetX);
					var startboxRy=getPosYRope(part,part.connected_part_1,false)-(LevelJson.Parts[part.connected_part_1].pos_y+LevelJson.Parts[part.connected_part_1].height/2+playgroundOffsetY);
					
					var lastboxRx=getPosXRope(part,part.connected_part_2,true)-(LevelJson.Parts[part.connected_part_2].pos_x+LevelJson.Parts[part.connected_part_2].width/2+playgroundOffsetX);
					var lastboxRy=getPosYRope(part,part.connected_part_2,true)-(LevelJson.Parts[part.connected_part_2].pos_y+LevelJson.Parts[part.connected_part_2].height/2+playgroundOffsetY);
										
					var startbox = LevelJson.Parts[part.connected_part_1].MatterBody;
					var lastbox = LevelJson.Parts[part.connected_part_2].MatterBody;
					
					
					var rope = [];
					let start_x=getPosXRope(part,part.connected_part_1,false);
					let start_y=getPosYRope(part,part.connected_part_1,false);
					for(var key in part.TimPulleys)
					{
						//console.log("rope: to pulley " + getPosXRopePulleySimul(part.TimPulleys[key],true)+","+getPosYRopePulleySimul(part.TimPulleys[key],true));
						//console.log("rope: from pulley " + getPosXRopePulleySimul(part.TimPulleys[key],false)+","+getPosYRopePulleySimul(part.TimPulleys[key],false));
						let next_x=getPosXRopePulleySimul(part.TimPulleys[key],true,start_x);
						let next_y=getPosYRopePulleySimul(part.TimPulleys[key],true);
						addRopeSegment(start_x,start_y,next_x,next_y, rope);
						
						start_x= getPosXRopePulleySimul(part.TimPulleys[key],false,start_x);
						start_y= getPosYRopePulleySimul(part.TimPulleys[key],false);
					}					
					
					let next_x=getPosXRope(part,part.connected_part_2,true);
					let next_y=getPosYRope(part,part.connected_part_2,true);
					addRopeSegment(start_x,start_y,next_x,next_y, rope);
					
				
					// add all of the bodies and constraits to the world
					Composite.add(engine.world, [ ...rope]);

					let stiffnessLast=1;
					if(LevelJson.Parts[part.connected_part_2].TimType==31)//Monkey exercise bike
					{
						console.log("connected to Monkey E");
						stiffnessLast=0.01;
					}

					//connect to last part
					let consS = Constraint.create({
						bodyA: lastbox,
						bodyB: rope[rope.length-1],
						pointA:{ x: lastboxRx, y: lastboxRy },
						stiffness: stiffnessLast,
						//TimNode:1,
						render: {anchors: false, lineWidth: 1,type: 'line',	strokeStyle:"rgb(243, 178, 0)"}
						
					})
					
					
					let stiffnessStart=1;
					if(LevelJson.Parts[part.connected_part_1].TimType==31)//Monkey exercise bike
					{
						console.log("connected to Monkey S");
						stiffnessStart=0.01;
					}
					//connect to first part
					let consE = Constraint.create({
						bodyA: startbox,
						bodyB: rope[0],
						pointA:{ x: startboxRx, y: startboxRy },
						stiffness: stiffnessStart,
						//TimNode:2,
						render: { anchors: false, lineWidth: 1, type: 'line', strokeStyle:"rgb(243, 178, 0)"}
					})
					Composite.add(engine.world, [ consE,consS]);
					//Composite.add(engine.world, [ consE]);
					//Composite.add(engine.world, [ consS]);
				
						
				}
			}
		});	
		LevelJson.Parts.forEach(part => {
			if(PartDef[part.TimType].autoAnim!=undefined)
				AnimPart(part.no,true,part.flipH,part.flipV,false,false);
		});
		
		clearInterval(myTimer);
		Render.run(render);
		if(runner==undefined)
			runner=Runner.create()
		Runner.run(runner, engine);
		
	}
	
	
	//--------------------------------------------------
	// cleanPhysics
	//--------------------------------------------------
	function cleanPhysics(all)
	{
		const allBody= [];
		engine.world.bodies.forEach((body)=>{
			if(all==false)
			{
				if((body.isStatic==false)&&(body.isSleeping == false))
				{
					allBody.push(body);
				}
			}
			else
				allBody.push(body);
		});
		Composite.remove(world, allBody);
		const allCosntraints= [];
		//console.log("engine.world.constraints",engine.world.constraints);
		engine.world.constraints.forEach((constraint)=>{
			if(all==false)
			{
				allCosntraints.push(constraint);
			}
		});
		Composite.remove(world, allCosntraints);
		Engine.clear(engine);
	}