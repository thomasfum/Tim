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
				AnimPart(otherExtremity,false,flipH,flipV,false,false)
			}
		}
	}
	
	//--------------------------------------------------
	// beforeRender
	//--------------------------------------------------
	function beforeRender()
	{
		//console.log("beforeRender");
		LevelJson.Parts.forEach(part => {
		if(part.in_partsbin==0)
		{
			if(part.is_moving!=0)
			{
				
				//apply gravity
				if(part.MatterBody!=undefined)
				{
					
					if(part.TimRope==1)
					{
						//if(part.MatterBody.force.y<part.MatterBody.mass2 * 0.0005)
						{
							part.MatterBody.force.y=part.MatterBody.force.y+(part.MatterBody.mass2 * 0.0005); 
							//part.MatterBody.force.y=part.MatterBody.force.y+(part.MatterBody.mass2 * 0.0005); 
							//part.MatterBody.force.y=part.MatterBody.force.y+(part.MatterBody.mass2 * 0.0005); 
							//Body.applyForce(part.MatterBody, part.MatterBody.position, { x: part.MatterBody.force.x, y: part.MatterBody.force.y});
							//Body.setVelocity(part.MatterBody, { x:0, y: 0.000001 });
						}
						console.log("TimRope "+part.MatterBody.mass2 * 0.0005,part.MatterBody.force);
					}
					else
						Body.applyForce(part.MatterBody, part.MatterBody.position, { x: part.MatterBody.force.x, y: part.MatterBody.mass2 * 0.0005 });
					
				}
				
				//apply gravity to rope also
				engine.world.bodies.forEach((body)=>{
					if(body.isStatic==false)
					{
						
						//if(body.TimNo==undefined)
						//	Body.applyForce(body, body.position, { x: body.force.x, y: body.mass2 * 0.00001 });
						/*
						let TimRope=2;
						if(body.TimNo!=undefined)//rope segment
						{
							TimRope=LevelJson.Parts[body.TimNo].TimRope;
						}
						if(TimRope==1)
							Body.applyForce(body, body.position, { x: body.force.x, y: body.mass2 * 0.00001 });
						else if(TimRope==2)
							Body.applyForce(body, body.position, { x: body.force.x, y: body.mass2 * 0.00000001 });
						else
							Body.applyForce(body, body.position, { x: body.force.x, y: body.mass2 * 0.0005 });
						*/
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
			}
			else //staticobj
			{
				if(part.TimType==3)//"Teeter-totter (3)"
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
										if(part1.animOnce==false)
										{
											console.log("-----------------check Jack-in-the-box break aquarium ("+part1.no+") "+part1.name);
											Composite.remove(world, [part1.MatterBody]);
											part1.nb_anim=17;
											part1.animStep=12;
											part1.animOnce=true;
											part1.fixed=0;
											part1.pos_x=part1.pos_x-22;
											part1.pos_y=part1.pos_y+7;

											/*
											LevelJson.Parts[_boby.TimNo].pos_x=_boby.position.x-40;
											LevelJson.Parts[_boby.TimNo].pos_y=_boby.position.y-28;
											Composite.remove(world, [_boby]);
											
											console.log("destroy ballon "+_boby.TimNo);
											LevelJson.Parts[_boby.TimNo].is_moving=0;
											AnimPart(_boby.TimNo,true,0,0,true,true);
											*/
										}
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
			}
		});
		
		refresh(false);
		LevelJson.Parts.forEach(part => {
			AdvanceAnimation(part);
			//part.MatterBody.height=Images[part.TimType+"-"+val].height;
		});
		
		checkIfWin();
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
					//collision.body.TimDirectionX=scaleX;
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

	}
	function destroy_ballon(_boby)
	{
		
		LevelJson.Parts[_boby.TimNo].pos_x=_boby.position.x-40;
		LevelJson.Parts[_boby.TimNo].pos_y=_boby.position.y-28;
		Composite.remove(world, [_boby]);
		
		console.log("destroy ballon "+_boby.TimNo);
		LevelJson.Parts[_boby.TimNo].is_moving=0;
		AnimPart(_boby.TimNo,true,0,0,true,true);
	}
	
	function TeeterTotterTilt(_TeeterTotterBoby,_impactorBody)
	{
		console.log("TT "+_TeeterTotterBoby.TimNo+"=> rotate ",_TeeterTotterBoby);
		let  bodies = Composite.allBodies(engine.world);
		const collisions = Matter.Query.collides(_TeeterTotterBoby, bodies);
		console.log("collisions",collisions);
		let vx=1.8;//1.8
		let vy=-6.5;//7.2
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
				Body.setVelocity(collision.body, { x:10*scaleX, y: 0 });
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
		Body.setVelocity(_impactorBody, { x:_impactorBody.velocity.x*4.9, y: -10 });
		AnimPart(_TrampolineBoby.TimNo,false,LevelJson.Parts[_TrampolineBoby.TimNo].flipH,LevelJson.Parts[_TrampolineBoby.TimNo].flipV,true,false);
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

				if(LevelJson.Parts[collision.bodyA.TimNo].TimType==16)//bellow (16)
					collision_bellow(collision.bodyA);
				if(LevelJson.Parts[collision.bodyB.TimNo].TimType==16)//bellow (16)
					collision_bellow(collision.bodyB);
			
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
		Render.stop(render)
		if(runner!=undefined)
		{
			console.log("Runner.stop");
			Runner.stop(runner);
		}
		
		if(LevelJson!=undefined)
		{
			console.log("reset LevelJson");
			LevelJson.Parts.forEach(part => {
				
				part.MatterBody=undefined;
				part.MatterBody=undefined;
				part.selected=0;
				if(LevelJsonOrigin!=undefined)
				{
					part.is_moving=LevelJsonOrigin.Parts[part.no].is_moving;
					part.pos_x=LevelJsonOrigin.Parts[part.no].pos_x;
					part.pos_y=LevelJsonOrigin.Parts[part.no].pos_y;
					part.in_partsbin=LevelJsonOrigin.Parts[part.no].in_partsbin;
					part.fixed=LevelJsonOrigin.Parts[part.no].fixed;
					
				}
				part.anim=false;
				part.animStep=0;
				part.animDelay=0;
				part.animDirectionX=0;
				part.animOnce=false;
				part.animCleanAtEnd=false;

			});
		}
	}
	
	function addRopeSegmentAroundPulley(partNo, rope)
	{
		if(LevelJson.Parts[partNo].appearance=="top (2)")
		{
			
		}
	}
	function addRopeSegment(start_x,start_y,next_x,next_y, rope)
	{
		let rope_segment_length = 6;
		let dx=next_x- start_x;
		let dy=next_y- start_y;
		console.log("dx",dx);
		console.log("dy",dy);
		
		let distance=Math.sqrt((dx*dx)+(dy*dy));
		console.log("distance",distance);
		let distanceBetween=10;
		
		for (var i = 0; i < distance/distanceBetween; i += 1) 
		{	
			let current_x=start_x+i*(dx/distance)*distanceBetween;
			let current_y=start_y+i*(dy/distance)*distanceBetween;
			
			//let RopeBody = Bodies.rectangle(current_x, current_y, rope_segment_length,rope_segment_length);
			let RopeBody = Bodies.circle(current_x, current_y, rope_segment_length);
			RopeBody.mass2=1;
			RopeBody.TimRope=2;
			RopeBody.TimNo=undefined;
			//RopeBody.friction=5;
			RopeBody.frictionAir=0.3;
			//RopeBody.frictionStatic=5;
			
			//RopeBody.sleepThreshold=2;
			
			
			last_RopeBody = rope.pop();
			let cons = Constraint.create({
				bodyA: last_RopeBody,
				bodyB: RopeBody,
				stiffness: 0.99,
				damping:1,
				//density: 9.5, 
				render: {
					anchors: false,
					lineWidth: 3,
					type: 'line'
				}
			})
			
			//if (last_rect) 
			rope.push(last_RopeBody)
			rope.push(cons)
			
			
			rope.push(RopeBody)
		}
	}
	//--------------------------------------------------
	// run
	//--------------------------------------------------
	function run()
	{

		//remove the link with physics
		LevelJson.Parts.forEach(part => {
			part.MatterBody=undefined;
			part.MatterBody=undefined;
		});
		LevelJsonOrigin =JSON.parse(JSON.stringify(LevelJson));
		
		//console.log("LevelJsonOrigin: ",LevelJsonOrigin);
		CurrentLevelRunning=true;
		//console.log("run! "+engine.world.gravity.y);
		CurrentLevelWinned=false;
		
		selectPart(-1);
		
		//clean the World
		cleanPhysics(false);
		engine.world.gravity.y = 0;
		LevelJson.Parts.forEach(part => {
			/*
			let start=part.name.indexOf('(');
			let end=part.name.indexOf(')');
			let result = part.name.substring(start+1, end);
			*/
			
			
			if(part.in_partsbin==0)
			{
				
				
				//console.log(part);
				if(part.is_moving!=0)
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
						var MatterBody = Bodies.circle(playgroundOffsetX+part.pos_x+part.Images[part.TimType+"-0"].width/2, playgroundOffsetY+part.pos_y+part.Images[part.TimType+"-0"].height/2,  part.Images[part.TimType+"-0"].width/2, {
							TimNo:part.no,
							isSleeping: false,
							isStatic: false,
							restitution: restitution, 
							
							//	density:mass, 
							mass:Math.abs(mass),
							mass2:mass,
							render: {
							  sprite: { texture: part.Images[part.TimType+"-0"].src, 
							  //xScale: ratio,
							  //yScale: ratio,
								xOffset: ox,
								yOffset: oy//-0.18
							  
							  }
							  }
							  });
						
						//MatterBody.friction=1;
						MatterBody.frictionAir=0.02;
						//MatterBody.frictionAir=0.1;
						//MatterBody.sleepThreshold=2;

						Composite.add(world, [MatterBody]);
						part.MatterBody=MatterBody;
					}
					
				}
				else
				{
					let _isStatic=true;
					if(part.TimType==3)	//"Teeter-totter (3)"
						_isStatic=false;
					//if(part.TimType==16)//bellows (soufflet)
					//	_isStatic=false;		
					if(part.TimType==37)
					{
					}else
					if(part.TimType==7)//"pulley (7)"
					{
						
						var MatterBody = Bodies.circle(playgroundOffsetX+part.pos_x+part.Images[part.TimType+"-0"].width/2, playgroundOffsetY+part.pos_y+part.Images[part.TimType+"-0"].height/2,  /*part.Images[part.TimType+"-0"].width/2*/8, {
							TimNo:part.no,
							isSleeping: false,
							isStatic: true,
							restitution: restitution, 
							
							//	density:mass, 
							mass:Math.abs(50),
							mass2:550,
							density:550,
							friction:1,
							frictionStatic:0.5*20,
							render: {
							  sprite: { texture: part.Images[part.TimType+"-0"].src, 
							  //xScale: ratio,
							  //yScale: ratio,
								xOffset: 0,
								yOffset: 0//-0.18
							  
							  }
							  }
							  });
						Composite.add(world, [MatterBody]);
						part.MatterBody=MatterBody;
						part.staticObjId=MatterBody.id;
						//console.log("id=",part.staticObjId);
					}
					else if(part.TimType==3)//"Teeter-totter (3)"
					{
						console.log("Teeter-totter=",part.no);
						var MatterBody = Bodies.rectangle(playgroundOffsetX+part.pos_x+part.width/2,playgroundOffsetY+part.pos_y+part.height/2+2, part.width-4, 5, {
							isStatic: _isStatic, 
							TimNo:part.no,
							render: { fillStyle: "rgba(0, 0, 255, 0)" }
							});
						//console.log("IIIIIIIIIIIIIIIIIIIII  Teeter-totter "+part.flipH);
						if(part.flipH==0)
							Matter.Body.rotate(MatterBody,-0.3);
						else
							Matter.Body.rotate(MatterBody,0.3);
						/*
						if(part.flipH2==0)
							Matter.Body.rotate(MatterBody,-0.3);
						else
							Matter.Body.rotate(MatterBody,0.3);
						*/
						MatterBody.friction=1;
 						MatterBody.frictionAir=0.01*20;
						MatterBody.frictionStatic=0.5*20;

						Composite.add(world, [MatterBody]);
						part.MatterBody=MatterBody;
						part.staticObjId=MatterBody.id;
						//console.log("id=",part.staticObjId);
						/*
						var staticObjBloc1 = Bodies.rectangle(playgroundOffsetX+part.pos_x+12,playgroundOffsetY+part.pos_y+part.height-3, 5, 5, {
							isStatic: true, 
							render: { fillStyle: "rgba(0, 0, 255, 0)" }
							});
						var staticObjBloc2 = Bodies.rectangle(playgroundOffsetX+part.pos_x+part.width-12,playgroundOffsetY+part.pos_y+part.height-3, 5, 5, {
							isStatic: true, 
							render: { fillStyle: "rgba(0, 0, 255, 0)" }
							});
						Composite.add(world, [staticObjBloc1,staticObjBloc2]);	
						*/
						 var staticObjBlocBottom = Bodies.rectangle(playgroundOffsetX+part.pos_x+part.width/2,playgroundOffsetY+part.pos_y+part.height-3, part.width-6, 5, {
							isStatic: true, 
							render: { fillStyle: "rgba(0, 0, 255, 0)" }
							});
						Composite.add(world, [staticObjBlocBottom]);	
						 var constraint = Constraint.create({
							pointA: { x: playgroundOffsetX+part.pos_x+part.width/2, y: playgroundOffsetY+part.pos_y+part.height/2 },
							bodyB: MatterBody,
							length: 0, 
							render: { visible: false }
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
							
						
						/*
							console.log("verts1=",PartDef[part.TimType].phy_poly);
							let ret=polygonMakeCCW(PartDef[part.TimType].phy_poly);
							console.log(ret);
							console.log("verts2=",PartDef[part.TimType].phy_poly);
							// Decompose into convex polygons, using the faster algorithm
							var result2;
							
							var convexPolygons = polygonQuickDecomp(PartDef[part.TimType].phy_poly,result2);
							console.log("verts3=",result2);
							//let verts = Matter.Vertices.fromPath(PartDef[part.TimType].phy_poly[0]);
							//let verts = Matter.Vertices.fromPath(convexPolygons);
							//let verts = Vertices.create(points, body);
							console.log("verts3=",convexPolygons);
							*/
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
						var MatterBody = Bodies.rectangle(playgroundOffsetX+part.pos_x+part.width/2,playgroundOffsetY+part.pos_y+part.height/2, part.width, part.height, {
							isStatic: _isStatic, 
							TimNo:part.no,
							render: { fillStyle: "rgba(0, 0, 255, 0)" }
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
				console.log("rope: "+part.no);
				if((part.connected_part_1!=undefined)&&(part.connected_part_2!=undefined))
				{
					console.log("rope: from " + getPosXRope(part.connected_part_1,false)+","+getPosYRope(part.connected_part_1,false));
					
					for(var key in part.TimPulleys)
					{
						console.log("rope: to pulley " + getPosXRope(part.TimPulleys[key],true)+","+getPosYRope(part.TimPulleys[key],true));
						console.log("rope: from pulley " + getPosXRope(part.TimPulleys[key],false)+","+getPosYRope(part.TimPulleys[key],false));
					}
					console.log("rope: to " + getPosXRope(part.connected_part_2,true)+","+getPosYRope(part.connected_part_2,true));
				
				
					
					var startbox = LevelJson.Parts[part.connected_part_1].MatterBody;
					var lastbox = LevelJson.Parts[part.connected_part_2].MatterBody;
					LevelJson.Parts[part.connected_part_1].TimRope=1;
					LevelJson.Parts[part.connected_part_2].TimRope=1;
					//startbox.TimRope=1;
					//lastbox.TimRope=1;
					console.log("part.connected_part_2",LevelJson.Parts[part.connected_part_2]);
					var rope = [];
					rope.push(startbox)
					
					
					let start_x=getPosXRope(part.connected_part_1,false);
					let start_y=getPosYRope(part.connected_part_1,false);
					
					
					
					for(var key in part.TimPulleys)
					{
						console.log("rope: to pulley " + getPosXRopePulleySimul(part.TimPulleys[key],true)+","+getPosYRopePulleySimul(part.TimPulleys[key],true));
						console.log("rope: from pulley " + getPosXRopePulleySimul(part.TimPulleys[key],false)+","+getPosYRopePulleySimul(part.TimPulleys[key],false));
						let next_x=getPosXRopePulleySimul(part.TimPulleys[key],true);
						let next_y=getPosYRopePulleySimul(part.TimPulleys[key],true);
						addRopeSegment(start_x,start_y,next_x,next_y, rope);
						
						
						start_x= getPosXRopePulleySimul(part.TimPulleys[key],true);
						start_y= getPosYRopePulleySimul(part.TimPulleys[key],true);
						
						
						next_x=getPosXRopePulleySimul(part.TimPulleys[key],false);
						next_y=getPosYRopePulleySimul(part.TimPulleys[key],false);
						addRopeSegment(start_x,start_y,next_x,next_y, rope);
						//addRopeSegmentAroundPulley(part.TimPulleys[key], rope);
						
						start_x= getPosXRopePulleySimul(part.TimPulleys[key],false);
						start_y= getPosYRopePulleySimul(part.TimPulleys[key],false);
						
					}					
					
					let next_x=getPosXRope(part.connected_part_2,false);
					let next_y=getPosYRope(part.connected_part_2,false);
					addRopeSegment(start_x,start_y,next_x,next_y, rope);
					
					
					
					/*
					let dx=next_x- start_x;
					let dy=next_y- start_y;
					console.log("dx",dx);
					console.log("dy",dy);
					
					let distance=Math.sqrt((dx*dx)+(dy*dy));
					console.log("distance",distance);
					let distanceBetween=8;
					
					for (var i = 0; i < distance/distanceBetween; i += 1) 
					{	
						
						let current_x=start_x+i*(dx/distance)*distanceBetween;
						let current_y=start_y+i*(dy/distance)*distanceBetween;
						
						let rect = Bodies.rectangle(current_x, current_y, rope_segment_length,rope_segment_length)
						let last_rect = i !== 0 ? rope.pop() : null
						let cons = Constraint.create({
							bodyA: i == 0 ? startbox : last_rect,
							bodyB: rect,
							stiffness: 1,
							damping:1,
							density: 9.5, 
							render: {
								anchors: false,
								lineWidth: 3,
								type: 'line'
							}
						})
						if (last_rect) 
							rope.push(last_rect)
						rope.push(cons)
						rope.push(rect)
					}
					*/
					let last_rect = rope.pop()
					console.log("last_rect",last_rect);
					console.log("lastbox",lastbox);
					let cons = Constraint.create({
						bodyA: last_rect,
						bodyB: lastbox,
						pointB:{ x: 0, y: -20 },
						stiffness: 1,
						damping:1,
						density: 9.5, 
						render: {
							anchors: false,
							lineWidth: 2,
							type: 'line'
						}
					})
					console.log("cons",cons);
					rope.push(last_rect)
					rope.push(cons)
					//rope.push(startbox)
					//rope.push(lastbox)


					// add all of the bodies to the world
					//World.add(engine.world, [wedge, pulley, constraint1, constraint2, ...rope, ground]);
					Composite.add(engine.world, [ ...rope]);
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