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
			let AutherExtremity=PartBeltExtremity(PartNo);
			if(AutherExtremity!=-1)
			{
				console.log("from Part "+PartNo+" action on "+AutherExtremity);
				AnimPart(AutherExtremity,false,flipH,flipV,false,false)
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
			if(part.is_moving)
			{
				//apply gravity
				//if(part.movingObj.mass2>0)
				Body.applyForce(part.movingObj, part.movingObj.position, { x: part.movingObj.force.x, y: part.movingObj.mass2 * 0.0005 })
				//check if in contact with a belt
				engine.world.bodies.forEach((body)=>{
					if(body.TimNo!=undefined)
					{
						if((LevelJson.Parts[body.TimNo].TimType==5)&&(LevelJson.Parts[body.TimNo].anim==true))//moving belt
						{
							if (Matter.Collision.collides(part.movingObj, body) != null) 
							{
								// collision happened
								//console.log("moving part"+part.no +"on a moving belt"+body.TimNo);
								//console.log("moving part direction "+LevelJson.Parts[body.TimNo].animDirectionX);
								if(LevelJson.Parts[body.TimNo].animDirectionX==0)
									Body.applyForce(part.movingObj, part.movingObj.position, { x: 0.003, y: 0 })
								if(LevelJson.Parts[body.TimNo].animDirectionX==1)
									Body.applyForce(part.movingObj, part.movingObj.position, { x: -0.003, y: 0 })
							}
						}
					}
				});
			}
			/*
			if(part.TimType==3)//"Teeter-totter (3)"
			{
				if(part.movingObj!=undefined)
				{
					if(part.movingObj.angle>0.3)
						part.movingObj.angle=0.3;
					if(part.movingObj.angle<-0.3)
						part.movingObj.angle=-0.3;
				}
				
			}
			*/
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
	
	function collision_ballon(_boby)
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
			Body.setVelocity(collision.bodyA, { x:vx*scaleX, y: vy });
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
			Body.setVelocity(collision.bodyB, { x:vx*scaleX, y: vy });
			//collision.body.TimDirectionX=scaleX;
			//console.log("collisions ->",collision.body);
			}
		});
		
		//_TeeterTotterBoby.angle=_TeeterTotterBoby.angle*-1;
		//_TeeterTotterBoby.isStatic=false;
	}
	function collision_TeeterTotter(_TeeterTotterBoby,_impactorBody)//Teeter-totter (3)
	{
		//console.log("TT "+_TeeterTotterBoby.TimNo+"=> xt=" +_TeeterTotterBoby.position.x+" xi="+_impactorBody.position.x+" st="+LevelJson.Parts[_TeeterTotterBoby.TimNo].animStep+" sw="+LevelJson.Parts[_TeeterTotterBoby.TimNo].flipH);
		
		if(_impactorBody.position.x<_TeeterTotterBoby.position.x)
		{
			if(LevelJson.Parts[_TeeterTotterBoby.TimNo].flipH==0)
			{
				//console.log("TT "+_TeeterTotterBoby.TimNo+"=> falling left");
				if((LevelJson.Parts[_TeeterTotterBoby.TimNo].animStep==undefined)||(LevelJson.Parts[_TeeterTotterBoby.TimNo].animStep==0))
				{
					console.log("TT "+_TeeterTotterBoby.TimNo+"=> "+_impactorBody.TimNo+" falling left, no move");
				}
				else
				{
					console.log("TT "+_TeeterTotterBoby.TimNo+"=> "+_impactorBody.TimNo+" falling left, move=>");
					
					LevelJson.Parts[_TeeterTotterBoby.TimNo].anim=true;
					LevelJson.Parts[_TeeterTotterBoby.TimNo].animStep=1;
					LevelJson.Parts[_TeeterTotterBoby.TimNo].animDelay=0;
					LevelJson.Parts[_TeeterTotterBoby.TimNo].animDirectionX=0;
					LevelJson.Parts[_TeeterTotterBoby.TimNo].animOnce=true;
					LevelJson.Parts[_TeeterTotterBoby.TimNo].animCleanAtEnd=false;
					
					TeeterTotterTilt(_TeeterTotterBoby,_impactorBody);
					
				}
			}
			else
			{
				//console.log("TT "+_TeeterTotterBoby.TimNo+"=> falling right (swapped)");
				if((LevelJson.Parts[_TeeterTotterBoby.TimNo].animStep==undefined)||(LevelJson.Parts[_TeeterTotterBoby.TimNo].animStep==0))
				{
					
					console.log("TT "+_TeeterTotterBoby.TimNo+"=> "+_impactorBody.TimNo+" falling right (swapped), move=>");
					
					LevelJson.Parts[_TeeterTotterBoby.TimNo].anim=true;
					LevelJson.Parts[_TeeterTotterBoby.TimNo].animStep=1;
					LevelJson.Parts[_TeeterTotterBoby.TimNo].animDelay=0;
					LevelJson.Parts[_TeeterTotterBoby.TimNo].animDirectionX=0;
					LevelJson.Parts[_TeeterTotterBoby.TimNo].animOnce=true;
					LevelJson.Parts[_TeeterTotterBoby.TimNo].animCleanAtEnd=false;
								
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
			if(LevelJson.Parts[_TeeterTotterBoby.TimNo].flipH==0)
			{
				//console.log("TT "+_TeeterTotterBoby.TimNo+"=> falling right");
				if((LevelJson.Parts[_TeeterTotterBoby.TimNo].animStep==undefined)||(LevelJson.Parts[_TeeterTotterBoby.TimNo].animStep==0))
				{
					console.log("TT "+_TeeterTotterBoby.TimNo+"=> falling "+_impactorBody.TimNo+" right, move=>");
					
					LevelJson.Parts[_TeeterTotterBoby.TimNo].anim=true;
					LevelJson.Parts[_TeeterTotterBoby.TimNo].animStep=1;
					LevelJson.Parts[_TeeterTotterBoby.TimNo].animDelay=0;
					LevelJson.Parts[_TeeterTotterBoby.TimNo].animDirectionX=0;
					LevelJson.Parts[_TeeterTotterBoby.TimNo].animOnce=true;
					LevelJson.Parts[_TeeterTotterBoby.TimNo].animCleanAtEnd=false;
					
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
					
					LevelJson.Parts[_TeeterTotterBoby.TimNo].anim=true;
					LevelJson.Parts[_TeeterTotterBoby.TimNo].animStep=1;
					LevelJson.Parts[_TeeterTotterBoby.TimNo].animDelay=0;
					LevelJson.Parts[_TeeterTotterBoby.TimNo].animDirectionX=0;
					LevelJson.Parts[_TeeterTotterBoby.TimNo].animOnce=true;
					LevelJson.Parts[_TeeterTotterBoby.TimNo].animCleanAtEnd=false;
					
					
					TeeterTotterTilt(_TeeterTotterBoby,_impactorBody);
				}
			}
		}
		//AnimPart(_boby.TimNo,false,LevelJson.Parts[_TeeterTotterBoby.TimNo].flipH,LevelJson.Parts[_TeeterTotterBoby.TimNo].flipV,true,false);
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
				if(Matter.Collision.collides(GearBody, part.movingObj) != null)
				{
					if(part.anim==undefined)//ballon is not yet exploding
					{
						console.log("CheckGear touching ballon"+part.no);
						collision_ballon(part.movingObj);
					}
				}
			}
		});
	}
	
	function boxing(BoxingBody)
	{
		if((LevelJson.Parts[BoxingBody.TimNo].animStep==undefined)||(LevelJson.Parts[BoxingBody.TimNo].animStep==0)||(LevelJson.Parts[BoxingBody.TimNo].animStep==10))
			return;
		
		console.log("Boxing collision step",LevelJson.Parts[BoxingBody.TimNo].animStep);
		let scaleX=-1;
		let x=LevelJson.Parts[BoxingBody.TimNo].pos_x+playgroundOffsetX+LevelJson.Parts[BoxingBody.TimNo].width;
		
		if(LevelJson.Parts[BoxingBody.TimNo].flipH==1)
		{
			scaleX=1;
			x=LevelJson.Parts[BoxingBody.TimNo].pos_x;
		}
		if(LevelJson.Parts[BoxingBody.TimNo].animStep!=undefined)
		{
			console.log("w="+LevelJson.Parts[BoxingBody.TimNo].TimType+"-"+LevelJson.Parts[BoxingBody.TimNo].animStep);
			let imageWidth=Images[LevelJson.Parts[BoxingBody.TimNo].TimType+"-"+LevelJson.Parts[BoxingBody.TimNo].animStep].width;
			console.log("w="+imageWidth);
			let startPoint = { x: x, y: LevelJson.Parts[BoxingBody.TimNo].pos_y+playgroundOffsetY+LevelJson.Parts[BoxingBody.TimNo].height/2 };
			var collisions = [];
			let  bodies = Composite.allBodies(engine.world);
			let  endPoint = { x:x +(imageWidth)*scaleX, y: LevelJson.Parts[BoxingBody.TimNo].pos_y+playgroundOffsetY+LevelJson.Parts[BoxingBody.TimNo].height/2};
			
			
			collisions= Matter.Query.ray(bodies, startPoint, endPoint,LevelJson.Parts[BoxingBody.TimNo].height) ;
			console.log("collisions",collisions);
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
		console.log("Boxing collision",BoxingBody);
		AnimPart(BoxingBody.TimNo,false,LevelJson.Parts[BoxingBody.TimNo].flipH,LevelJson.Parts[BoxingBody.TimNo].flipV,true,false);
		boxing(BoxingBody);
		
	}
	function collision_Trampoline(_TrampolineBoby,_impactorBody)
	{
		console.log("collision_Trampoline ->",_impactorBody);
		Body.setVelocity(_impactorBody, { x:_impactorBody.velocity.x*4.9, y: -10 });
		AnimPart(_TrampolineBoby.TimNo,false,LevelJson.Parts[_TrampolineBoby.TimNo].flipH,LevelJson.Parts[_TrampolineBoby.TimNo].flipV,true,false);
	}
	//--------------------------------------------------
	// collisionStart
	//--------------------------------------------------
	function collisionStart(event)
	{
	  event.pairs.forEach((collision) => {
		  
		if((collision.bodyA.TimNo!=undefined)&&(collision.bodyB.TimNo!=undefined))
		{
			//console.log("Collision Parts No: "+collision.bodyA.TimNo +"="+LevelJson.Parts[collision.bodyA.TimNo].name+" - "+ collision.bodyB.TimNo+"="+LevelJson.Parts[collision.bodyB.TimNo].name);
			if(LevelJson.Parts[collision.bodyA.TimNo].TimType==6)
				collision_mouse(collision.bodyA.TimNo);
			if(LevelJson.Parts[collision.bodyB.TimNo].TimType==6)
				collision_mouse(collision.bodyB.TimNo);

			if(LevelJson.Parts[collision.bodyA.TimNo].TimType==16)
				collision_bellow(collision.bodyA);
			if(LevelJson.Parts[collision.bodyB.TimNo].TimType==16)
				collision_bellow(collision.bodyB);
			
			if(LevelJson.Parts[collision.bodyA.TimNo].TimType==3)
				collision_TeeterTotter(collision.bodyA,collision.bodyB)//Teeter-totter (3)
			if(LevelJson.Parts[collision.bodyB.TimNo].TimType==3)
				collision_TeeterTotter(collision.bodyB,collision.bodyA)//Teeter-totter (3)
			
			
			if(LevelJson.Parts[collision.bodyA.TimNo].TimType==4)//baloon
			{
				if(LevelJson.Parts[collision.bodyB.TimNo].TimType==14)//gear
				{
					if(LevelJson.Parts[collision.bodyB.TimNo].part!=undefined)
						if(LevelJson.Parts[collision.bodyB.TimNo].part.anim==true)//only if rotating
							collision_ballon(collision.bodyA);
				}
				if(LevelJson.Parts[collision.bodyB.TimNo].TimType==37)//scisor
				{
					let flipH=1;
					if(LevelJson.Parts[collision.bodyB.TimNo].flipH==0)
						flipH=-1;
					console.log("cisor :"+collision.bodyA.TimDirectionX+" "+flipH);
					
					if(flipH==collision.bodyA.TimDirectionX)
						collision_ballon(collision.bodyA);
				}
			}
			
			if(LevelJson.Parts[collision.bodyB.TimNo].TimType==4)//baloon
			{
				if(LevelJson.Parts[collision.bodyA.TimNo].TimType==14)//gear
				{
					if(LevelJson.Parts[collision.bodyA.TimNo].part!=undefined)
						if(LevelJson.Parts[collision.bodyA.TimNo].part.anim==true)//only if rotating
							collision_ballon(collision.bodyB);
				}
				if(LevelJson.Parts[collision.bodyA.TimNo].TimType==37)//scisor
				{
					let flipH=1;
					if(LevelJson.Parts[collision.bodyA.TimNo].flipH==0)
						flipH=-1;
					console.log("cisor :"+collision.bodyB.TimDirectionX+" "+flipH);
					if(flipH==collision.bodyB.TimDirectionX)
						collision_ballon(collision.bodyB);
				}
			}
		
		
		
		
			if(LevelJson.Parts[collision.bodyA.TimNo].TimType==35)//Boxing glove (35)
			{
				collision_Boxing(collision.bodyA);
			}
			if(LevelJson.Parts[collision.bodyB.TimNo].TimType==35)//Boxing glove (35)
			{
				collision_Boxing(collision.bodyB);
			}
			if(LevelJson.Parts[collision.bodyA.TimNo].TimType==39)//Trampoline (39)
			{
				collision_Trampoline(collision.bodyA,collision.bodyB);
			}
			if(LevelJson.Parts[collision.bodyB.TimNo].TimType==39)//Trampoline (39)
			{
				collision_Trampoline(collision.bodyB,collision.bodyA);
			}
			
		
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
			Runner.stop(runner);
		
		
		if(LevelJson!=undefined)
		{
			console.log("reset LevelJson");
			LevelJson.Parts.forEach(part => {
				
				part.staticObj=undefined;
				part.movingObj=undefined;
				part.selected=0;
				if(LevelJsonOrigin!=undefined)
				{
					part.is_moving=LevelJsonOrigin.Parts[part.no].is_moving;
					part.pos_x=LevelJsonOrigin.Parts[part.no].pos_x;
					part.pos_y=LevelJsonOrigin.Parts[part.no].pos_y;
					part.in_partsbin=LevelJsonOrigin.Parts[part.no].in_partsbin;
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
	//--------------------------------------------------
	// run
	//--------------------------------------------------
	function run()
	{

		//remove the link with physics
		LevelJson.Parts.forEach(part => {
			part.staticObj=undefined;
			part.movingObj=undefined;
		});
		LevelJsonOrigin =JSON.parse(JSON.stringify(LevelJson));
		
		console.log("LevelJsonOrigin! ",LevelJsonOrigin);
		CurrentLevelRunning=true;
		//console.log("run! "+engine.world.gravity.y);
		CurrentLevelWinned=false;
		
		selectPart(-1);
		
		//clean the World
		cleanPhysics(false);
		engine.world.gravity.y = 0;
		LevelJson.Parts.forEach(part => {
			let start=part.name.indexOf('(');
			let end=part.name.indexOf(')');
			let result = part.name.substring(start+1, end);
			
			
			
			if(part.in_partsbin==0)
			{
				//console.log(part);
				if(part.is_moving)
				{
					var restitution=PartDef[result].restitution;
					if(restitution==undefined)
						restitution=0;
					var mass=PartDef[result].mass;
					if(mass==undefined)
						mass=1;
					let ox=0;
					let oy=0;
					if(PartDef[part.TimType].ox!=undefined)
						ox=PartDef[part.TimType].ox;
					if(PartDef[part.TimType].oy!=undefined)
						oy=PartDef[part.TimType].oy;
					var movingObj = Bodies.circle(playgroundOffsetX+part.pos_x+part.Images[part.TimType+"-0"].width/2, playgroundOffsetY+part.pos_y+part.Images[part.TimType+"-0"].height/2,  part.Images[part.TimType+"-0"].width/2, {
						TimNo:part.no,
						isSleeping: false,
						isStatic: false,
						restitution: restitution, 
						
						//	density:mass, 
						mass:Math.abs(mass),
						mass2:mass,
						render: {
						  sprite: { texture: part.Images[part.TimType+"-0"].src,/*, 
						  xScale: ratio,
						  yScale: ratio,
						  */
						    
							xOffset: ox,
							yOffset: oy//-0.18
						  
						  }
						  }
						  });
					
					//movingObj.friction=1;
 					movingObj.frictionAir=0.02;
					//movingObj.frictionAir=0.1;
					//movingObj.sleepThreshold=2;

					Composite.add(world, [movingObj]);
					part.movingObj=movingObj;
				}
				else
				{
					let _isStatic=true;
					if(part.TimType==3)	//"Teeter-totter (3)"
						_isStatic=false;
					//if(part.TimType==16)//bellows (soufflet)
					//	_isStatic=false;		
					
					if(part.TimType==3)//"Teeter-totter (3)"
					{
						console.log("Teeter-totter=",part.no);
						var staticObj = Bodies.rectangle(playgroundOffsetX+part.pos_x+part.width/2,playgroundOffsetY+part.pos_y+part.height/2+2, part.width-4, 5, {
							isStatic: _isStatic, 
							TimNo:part.no,
							render: { fillStyle: "rgba(0, 0, 255, 0)" }
							});
							
						if(part.flipH==0)
							Matter.Body.rotate(staticObj,-0.3);
						else
							Matter.Body.rotate(staticObj,0.3);
						
						staticObj.friction=1;
 						staticObj.frictionAir=0.01*20;
						staticObj.frictionStatic=0.5*20;

						Composite.add(world, [staticObj]);
						part.staticObj=staticObj;
						part.staticObjId=staticObj.id;
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
							bodyB: staticObj,
							length: 0, 
							render: { visible: false }
						});
						//console.log("constraint",constraint);
						Composite.add(world, [constraint]);
						
						
					}
					else if(PartDef[part.TimType].phy_poly!=undefined)
					{
						console.log("poly");
						
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
							if(part.TimType==16)//bellows (soufflet)
							{
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
							
							var staticObj =Bodies.fromVertices(playgroundOffsetX+ox, playgroundOffsetY+oy, verts, {
								isStatic: _isStatic, 
								TimNo:part.no,
								render: { fillStyle: "rgba(0, 0, 255, 0)"}
								}, true, 0.001, 20);
							if(part.TimType==16)//bellows (soufflet)
							{
								console.log("bellows=",staticObj);
								staticObj.friction=1;
								staticObj.frictionStatic=0.8;
							}
							Composite.add(world, [staticObj]);
							part.staticObj=staticObj;
							part.staticObjId=staticObj.id;
							//console.log("id=",part.staticObjId);
							
						}
					}
					else
					{
						var staticObj = Bodies.rectangle(playgroundOffsetX+part.pos_x+part.width/2,playgroundOffsetY+part.pos_y+part.height/2, part.width, part.height, {
							isStatic: _isStatic, 
							TimNo:part.no,
							render: { fillStyle: "rgba(0, 0, 255, 0)" }
							});
						Composite.add(world, [staticObj]);
						part.staticObj=staticObj;
						part.staticObjId=staticObj.id;
						//console.log("id=",part.staticObjId);
					}
				}
			}
		});
		clearInterval(myTimer);
		Render.run(render);
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
		World.remove(world, allBody);
		const allCosntraints= [];
		console.log("engine.world.constraints",engine.world.constraints);
		engine.world.constraints.forEach((constraint)=>{
			if(all==false)
			{
				allCosntraints.push(constraint);
			}
		});
		World.remove(world, allCosntraints);
	}