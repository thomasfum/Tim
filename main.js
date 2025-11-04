
//0,162,162
//https://www.vogons.org/viewtopic.php?p=1089143#p1089143
//https://codeberg.org/knt47/timgres
//https://moddingwiki.shikadi.net/wiki/The_Incredible_Machine_Level_Format
//https://classicreload.com/play/dosx-the-incredible-machine.html
//https://www.cursor.cc/?

//---------------------------
//Todo
// get all levels in french
// get all levels image in french 
// check all levels
// animations
// size 678x369
// langage management
// finish welcome page with level info
// souflet
//---------------------------
//bug




	var CurrentLevel=4;

	let Images={};
	let Icons={};
	let Boards={};
	let partsbin={};
	let NBImagesToLoad=0;
	let NBImagesLoaded=0;
	let NBIconsToLoad=0;
	let NBIconsLoaded=0;
	let NBBoardsToLoad=0;
	let NBBoardsLoaded=0;
	let Dragging=false;
	let SelectedPart=undefined;


	let LevelJson;
	let LevelJsonOrigin;
	var DraggingObject=undefined;
	var canvas=undefined;	
	var ctx=undefined;
	var engine=undefined;
	var runner=undefined;
	var render =undefined;
	var world=undefined;
	var wireframe=false;
	var ShowWinConditions=false;
	var Test=false;
	
	
	const playgroundWidth=578-15;//578
	const playgroundHeight=369;
	const playgroundOffsetX=10;
	const playgroundOffsetY=5;
	const MaxLevel=3;
	
	
	var BeltMode=0;
	var beltStart=-1;
	var Mouse_pos_x=0;
	var Mouse_pos_y=0;
	var MouseOnPart=0;
	var BeltNoConnecting=-1;
	
	
	
	var CurrentLevelWinned=false;
	var CurrentLevelRunning=false;
	var loadingLevel=false;
	var ExpandUnit=0;
	var Score=0;
	var Bonus1 =0;
	var Bonus2 =0;
	var myTimer;
	

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

//var decomp = require('poly-decomp');
//let  decomp=polygonDecomp.decomp;

const WinCondition={
	"1":{"Conditions":[{"unitNo":10,"x1":432,"y1":155,"dx":50,"dy":50}]},
	"2":{"Conditions":[{"unitNo":23,"x1":150,"y1":255,"dx":75,"dy":50},{"unitNo":24,"x1":355,"y1":255,"dx":75,"dy":50}]},
	"3":{"Conditions":[{"unitNo":8},{"unitNo":9},{"unitNo":10}]},
	"4":{"Conditions":[{"unitNo":24,"x1":425,"y1":300,"dx":140,"dy":50}]},
};	
		
const files={			 
	"0":{"count":1,"restitution":0.2,"mass":10},//Bowling ball
	"1":{"count":8},
	"2":{"count":4,"FlipH":1,"FlipV":1,"phy_poly":[{"p":"0 0  1 0.5  1 1  0 0.5  0 0"}] },//wood incline
	//"2":{"count":4,"phy_poly":[[0, 0],  [1, 0.5],  [1, 1],  [0, 0.5],  [0, 0]] },//wood incline
	"3":{"count":3,"FlipH":1,"specialTest":1,"mass":1,"nb_anim":3},//Teeter-totter 
	"4":{"count":7,"mass":-1,"oy":-0.18,"nb_anim":7},//ballon
	"5":{"count":35,"FlipH":1,"node_x":70,"node_y":50,"node_d":20,"nb_anim":7},//conveyor belt
	"6":{"count":2,"FlipH":1,"node_x":75,"node_y":25,"node_d":20,"nb_anim":2},//mouse cage
	"7":{"count":4},
	"8":{"count":1},//belt
	"9":{"count":1,"restitution":0.8,"mass":4},//Basketball 
	"10":{"count":1},//rope
	"11":{"count":1},
	"12":{"count":10},
	"13":{"count":21},
	"14":{"count":4,"node_x":50,"node_y":50,"node_d":5,"nb_anim":4},//gear
	"15":{"count":26},
	"16":{"count":3,"FlipH":1,"nb_anim":3},//bellows (soufflet)
	"17":{"count":1},
	"18":{"count":16},
	"19":{"count":6},
	"20":{"count":3},
	"21":{"count":4},
	"22":{"count":3},
	"23":{"count":1},
	"24":{"count":5},
	"25":{"count":2},
	"26":{"count":6},
	"27":{"count":6},
	"28":{"count":1,"restitution":0.8,"mass":2},//baseball
	"29":{"count":6},
	"30":{"count":1},
	"31":{"count":10},
	"32":{"count":1},
	"33":{"count":1},
	"34":{"count":1},
	"35":{"count":10},
	"36":{"count":11},
	"37":{"count":3,"FlipH":1},//cisore
	"38":{"count":2},
	"39":{"count":8},
	"40":{"count":4},
	"41":{"count":6},
	"42":{"count":2},
	"43":{"count":1,"restitution":0.4,"mass":2},//canon ball
	"44":{"count":1,"restitution":0.2,"mass":2},//tenis ball
	"45":{"count":6},
	"46":{"count":8},//pipe wall
	//"47":{"count":4,"phy_poly":[{"p":"0 0  1 0  1 1  0.5 1 0.5 0.5 0 0.5  0 0"}]},//curved pipe wall
	//"47":{"count":4,"phy_poly":[[0,0],[1, 0], [1, 1], [0.5, 1] [0.5, 0.5], [0,0.5], [0, 0]]},//curved pipe wall
	"47":{"count":4,"phy_poly":[{"p":"0 0  1 0  1 0.5  0 0.5  0 0","y":0.25},{"p":"0.5 0  1 0  1 1  0.5 1  0.5 0","x":-0.25}]},//curved pipe wall
	"48":{"count":8},//wood wall
	"49":{"count":1},
	"50":{"count":3},
	"51":{"count":1},
	"52":{"count":1},
	"53":{"count":1},
	"54":{"count":1},
	"55":{"count":1},
	"56":{"count":7}
};


	



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

	function AllImagesLoaded()
	{
		console.log("All images loaded: "+NBImagesLoaded) ;
		if(Test==true)
			myTimer = setInterval(myTimerBonus1, 1000);
		refresh(true);
	}
	function GetFlipH(part)
	{
		let flipHs="0";
		if(part.direction_r_to_l!=undefined)//top-down (0); bottom-up (1); 2 and 3 ???
		{
			let start=part.direction_r_to_l.indexOf('(');
			let end=part.direction_r_to_l.indexOf(')');
			let _flipHs = part.direction_r_to_l.substring(start+1, end);
			console.log("flipHs="+_flipHs);
			if(_flipHs=="2")
				flipHs="0";
			if(_flipHs=="3")
				flipHs="1";
		}
		
		if(part.orientation!=undefined)
		{
			//console.log("orientation");
			let start=part.orientation.indexOf('(');
			let end=part.orientation.indexOf(')');
			flipHs = part.orientation.substring(start+1, end);
			//console.log("flipH="+flipH);
		}
		if(flipHs=="0")
			return 0;
		else
			return 1;
	}
	function GetFlipV(part)
	{
		let flipV=0;
		if(part.direction_r_to_l!=undefined)//top-down (0); bottom-up (1)
		{
			let start=part.direction_r_to_l.indexOf('(');
			let end=part.direction_r_to_l.indexOf(')');
			let flipVs = part.direction_r_to_l.substring(start+1, end);
			if(flipVs=="0")
				flipV=0;
			if(flipVs=="1")
				flipV=1;
			//console.log("flipV="+flipV);
		}
		return flipV;
	}
	function refresh( allObjects)
	{
		if(wireframe==true)
			return;
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
		//step 1
		LevelJson.Parts.forEach(part => {
			
			if(part.in_partsbin==0)
			{
				//if(part.no==9)
				//	console.log("refresh 1 -"+part.no+ " m="+part.is_moving);
				if((allObjects==true)||((allObjects==false)&&(part.is_moving==0))	)
				{
					//if(part.no==9)
					//	console.log("refresh 2 -",part.no);
					if(part.TimType!=8)//not belt
					{
						if(part.appearance==undefined)
						{
							//if(part.no==17)
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
							else
							{
								let size=0;
								if(part.size!=undefined)
									size=part.size;
								if((part.anim==undefined)||(part.anim==false))
									drawImage(Images[part.TimType+"-"+size], part.pos_x, part.pos_y,part.flipV,part.flipH);
								else
								{
									//console.log("draw "+part.TimType+"-"+(size+part.animStep));
									//console.log("anim1 "+part.anim);
									if((part.animOnce==true)&&(part.animStep==files[part.TimType].nb_anim-1)&&(part.animCleanAtEnd==true))
									{
										//console.log("1 no image for "+part.no+" : "+part.animStep);
									}
									else
										drawImage(Images[part.TimType+"-"+(size+part.animStep)], part.pos_x, part.pos_y+part.height/2-Images[part.TimType+"-"+(size+part.animStep)].height/2,part.flipV,part.flipH);
									//console.log("static part=",part.staticObj);
									//console.log("static part ("+part.TimType+") "+part.height/2+" / "+Images[part.TimType+"-"+(size+part.animStep)].height/2);
									//part.staticObj.position.y=part.staticObj.position.y+part.height/2-Images[part.TimType+"-"+(size+part.animStep)].height/2;
									
									//console.log("static part ici ("+part.TimType+")",part.staticObj);
									
									//part.staticObj.height=Images[part.TimType+"-"+(size+part.animStep)].height;
									//part.staticObj.bounds.min.y=100;//.position.y=part.staticObj.position.y-5;
									//part.staticObj.position.y=100;
									if(part.staticObj!=undefined)
										part.staticObj.height=12;
									part.animDelay++;
									if(part.animDelay>10)
									{
										part.animDelay=0;
										part.animStep++;
										if(part.animStep>=files[part.TimType].nb_anim)
										{
											part.animStep=0;
											if(part.animOnce==true)
												part.animStep=files[part.TimType].nb_anim-1;
										}
									}
								}
							}
						}
						else
						{
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
								if((part.animOnce==true)&&(part.animStep==files[part.TimType].nb_anim-1)&&(part.animCleanAtEnd==true))
								{
									console.log("2 no image for "+part.no+" : "+part.animStep);
								}
								else
									drawImage(Images[part.TimType+"-"+val], part.pos_x, part.pos_y,part.flipV,part.flipH);
								//console.log("static part=",part.staticObj);
								part.staticObj.height=Images[part.TimType+"-"+val].height;
								
								part.animDelay++;
								if(part.animDelay>10)
								{
									part.animDelay=0;
									part.animStep++;
									if(part.animStep>=files[part.TimType].nb_anim)
									{
										part.animStep=0;
										if(part.animOnce==true)
											part.animStep=files[part.TimType].nb_anim-1;
									}
								}
							}							
						}
					}
				}
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
					if((files[part.TimType].FlipH!=undefined)&&(files[part.TimType].FlipH==1))
					{
						ctx.drawImage(Boards[62], part.pos_x+playgroundOffsetX-14, part.pos_y+part.height+playgroundOffsetY);//swap
					}
					if((files[part.TimType].FlipV!=undefined)&&(files[part.TimType].FlipV==1))
					{
						ctx.drawImage(Boards[63], part.pos_x+playgroundOffsetX+part.width, part.pos_y+part.height+playgroundOffsetY);//swap
					}
					//console.log("overlap",part);
				}	
		
				
			}
			else//part.in_partsbin==1
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
		//----------------
		//string here
		
		
		//--------------------------
		//step 2 //cisor
		LevelJson.Parts.forEach(part => {
			
			if(part.in_partsbin==0)
			{
				if(part.TimType==37)
				{
					//console.log("cisor 2");
					if(part.flipH==1)
						drawImage(Images[part.TimType+"-1"], part.pos_x-5, part.pos_y+part.height/2,part.flipV,part.flipH);
					else
						drawImage(Images[part.TimType+"-1"], part.pos_x+20, part.pos_y+part.height/2,part.flipV,part.flipH);
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
			//console.log("BeltMode = 2");
			ctx.strokeStyle = 'red';
			if((MouseOnPart!=-1)&&(PartConnectionFree(MouseOnPart)==true))
			{
				//console.log("MouseOnPart = ",LevelJson.Parts[MouseOnPart].TimType);
				if(files[LevelJson.Parts[MouseOnPart].TimType].node_x!=undefined)
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
					drawLine(x1+playgroundOffsetX, y1+playgroundOffsetY,x2+playgroundOffsetX, y2+playgroundOffsetY,8);
					drawLine(x1+playgroundOffsetX, y1+playgroundOffsetY,x2+playgroundOffsetX, y2+playgroundOffsetY,-8);
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
			ctx.fillStyle = "rgba(0,243,243,255)";
			let w_with=400;
			ctx.fillRect(canvas.width/2-w_with/2,canvas.height/2-60, w_with,120);
			ctx.font = "10px Arial";
			ctx.fillStyle = "purple";
			ctx.fillText("Start level "+CurrentLevel,canvas.width/2-40,canvas.height/2-40);
			
			ctx.fillText( LevelJson.Title.EN,canvas.width/2-w_with/2+5,canvas.height/2-10);
			ctx.fillText( LevelJson.Goal.EN,canvas.width/2-w_with/2+5,canvas.height/2+20);
					
			
		}
	}
		
	function drawLine(x1,y1,x2,y2, offset = 0) 
	{
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

	function GetNodePos(part)
	{
		
		var x=part.pos_x+(part.width*files[part.TimType].node_x/100);
		let y=part.pos_y+(part.height*files[part.TimType].node_y/100);
		//console.log("GetNodePos = "+x+":"+y);
		
		if(part.flipH!=0)
		{
			let nx=(part.width-(part.width*files[part.TimType].node_x/100));
			x=part.pos_x+nx;
		}
		return [x, y];
	}
	
	function displayRightBoard()
	{
		let dy=8;
		ctx.drawImage(Boards[48], 72*8+4, 16 -dy);//top run
		ctx.drawImage(Boards[49], 72*8+4, 10+27-dy);//middle run
		ctx.drawImage(Boards[50], 72*8+4, 10+32-dy);//lower run
		ctx.drawImage(Boards[51], 72*8+4+24, 28-dy);//arbitre
		ctx.drawImage(Boards[55], 72*8+4+12, 51-dy);//runner
		
		ctx.drawImage(Boards[11], 72*8+4, 76-dy);//<- ->
		for(let y=0;y<45;y++)
		{
			ctx.drawImage(Boards[24], 72*8-4, 8 + y*8);
			ctx.drawImage(Boards[24], 637, 8 + y*8);
			
		}
		ctx.drawImage(Boards[10], 72*8-3, 68-dy);//horizontal bar at right
		ctx.drawImage(Boards[10], 72*8-3, 100-dy);//horizontal bar at right
	}

	function displayScoreDigit(digit,pos, offset)
	{
		//console.log("s="+digit);
		if(digit==undefined)
			digit=0;
		if(digit<5)
			ctx.drawImage(Boards[46], 0,20+(digit*21),24,38,offset+32*pos, 408-13 +1,24,38);
		else
			ctx.drawImage(Boards[47], 0,20+(digit-5)*21,24,38,offset+32*pos, 408-13+1,24,38);
		
	}
	function displayScoreNumber(number,nbdigits, offset)
	{
		var digits = number.toString().split('');
		var realDigits = digits.map(Number);
		var z=nbdigits-realDigits.length;
		for(let i=0;i<z;++i)
		{
			realDigits.unshift(0);
		}
	
		
		for(let x=0;x<nbdigits;x++)
		{
			displayScoreDigit(realDigits[x], x,offset)
		}
	}
	function displayScore()
	{
		//ctx.fillStyle = "rgba(0,0,0,255)";
		//ctx.fillRect(0, 368, canvas.width,80);
		//bonus 1 is going down with time to 0
		// if puzzle successfull done score=score + bonus1 +bonus 2
		
		//Score
		displayScoreNumber(Score,6, 45);
		//Bonus1
		displayScoreNumber(Bonus1,4, 294);
		//Bonus2
		displayScoreNumber(Bonus2,4, 478);
	}

	function displayBoard()
	{
		//Boards: 678x369
		for(let x=0;x<79;x++)
		{
			ctx.drawImage(Boards[26], 16+x*8, 0);
			ctx.drawImage(Boards[26], 16+x*8, 369-9);
		}
		for(let y=0;y<45;y++)
		{
			ctx.drawImage(Boards[24], 0, 	8 + y*8);
		}
		
		ctx.drawImage(Boards[1], 71*8-4, 0);//top right corner
		ctx.drawImage(Boards[0], 0, 0);//top left corner
		ctx.drawImage(Boards[2], 0, 44*8);//bottom left corner
		ctx.drawImage(Boards[3], 71*8-4, 44*8);//bottom right corner
		
		ctx.drawImage(Boards[10], 72*8-3, 0);//horizontal bar at right top
		ctx.fillStyle = "rgba(0,0,0,255)";
		ctx.fillRect(0, 368, canvas.width,80);
		displayScore();
		
		ctx.fillRect(0, 368, canvas.width,28);
		ctx.fillRect(0, 438, canvas.width,80);
		
		
		ctx.drawImage(Boards[43], 0, 368);
		ctx.drawImage(Boards[44], 264, 368);
		ctx.drawImage(Boards[45], 264+184, 368);
		
		
	}

	function loadImage(filename,part,imgType)
	{
		NBImagesToLoad++;
		//console.log("load: "+filename) ;
		Images[filename] = new Image();  
		part.Images[filename]=Images[filename];
		if(imgType==0)
			Images[filename].src = './images/PARTS/PART'+filename+".png";  
		else
			Images[filename].src = './images/'+filename+".png";  
		Images[filename].onload = () => {  
			NBImagesLoaded++;
		
			if(NBImagesLoaded==NBImagesToLoad)
				AllImagesLoaded();
		};
	}			

	function loadIcon(filename)
	{
		NBIconsToLoad++;
		//console.log("load: "+filename) ;
		Icons[filename] = new Image();  
		Icons[filename].src = './images/ICONS-BMP/ICONS-'+filename+".png";  
		Icons[filename].onload = () => {  
			NBIconsLoaded++;
		
			if(NBIconsLoaded==NBIconsToLoad)
			{
				console.log("All icons loaded: "+NBIconsLoaded) ;
				refresh(true);
			}
		};
	}	

	function ReadJson(json)
	{
		//LevelJsonOrigin = structuredClone(LevelJson);
		LevelJson=json;
		//console.log(LevelJson.Puzzle_info);
		if(document.getElementById("title")!=undefined)
			document.getElementById("title").innerHTML = LevelJson.Title.EN;
		if(document.getElementById("goal")!=undefined)
			document.getElementById("goal").innerHTML = LevelJson.Goal.EN;
		Bonus1=LevelJson.Puzzle_info.bonus_1;
		Bonus2=LevelJson.Puzzle_info.bonus_2;
		
		
		NBImagesToLoad=0;
		NBImagesLoaded=0;
		NBIconsToLoad=0;
		NBIconsLoaded=0;
		Images={};
		partsbin={};
		LevelJson.Parts.forEach(part => {
			let start=part.name.indexOf('(');
			let end=part.name.indexOf(')');
			let result = part.name.substring(start+1, end);
			part.TimType=result;
			part.movingObj=undefined;
			part.selected=0;
			part.flipH=GetFlipH(part);
			part.flipV=GetFlipV(part);
			if(part.in_partsbin==1)
			{
				part.pos_x=-1;
				part.pos_y=-1;
			}
			part.Images={};
			//console.log(part.name +" =>"+result+":"+files[result]) ;
			//console.log(part);
			for (let index = 0; index < files[result].count; ++index) 
			{
				let filename=result+"-"+index;
				//console.log("imag="+Images[filename]);
				if(Images[filename]==undefined)
				{
					Images[filename]=0;
					loadImage(filename,part,0);
				}
				else
					part.Images[filename]=Images[filename];
				
				if(part.in_partsbin==1)
				{
					if(Icons[result]==undefined)
					{
						Icons[result]=0;
						loadIcon(result);
					}
				}
			}
		});
	}

	function LoadLevel(level)
	{
		loadingLevel=true;
		if(document.getElementById("levelInput")!=null)
			document.getElementById("levelInput").value=level;
		CurrentLevel=level;
		CurrentLevelWinned=false;
		stop();
		cleanPhysics(true);
		console.log("loading level "+level);
		
		ctx.fillStyle = "rgba(0,162,162,255)";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		
		fetch('./levels/level_'+level+'.json')
			.then((response) => response.json())
			.then((json) => ReadJson(json));
	}


	function previousLevelClicked()
	{
		CurrentLevel--;
		if(CurrentLevel<1)
			CurrentLevel=1;
		LoadLevel(CurrentLevel);
	}
	function nextLevelClicked()
	{
		CurrentLevel++;
		LoadLevel(CurrentLevel);
	}
	function loadLevelClicked()
	{
		let l=document.getElementById("levelInput").value;
		LoadLevel(l);
	}
	function checkIfWin()
	{
		let win=0;
		if(WinCondition[CurrentLevel]!=undefined)
		{
			for (let index = 0; index < WinCondition[CurrentLevel].Conditions.length; ++index) 
			{
				//ctx.fillStyle = "rgba(0,125,125,255)";
				//ctx.fillRect(WinCondition[CurrentLevel].Conditions[index].x1, WinCondition[CurrentLevel].Conditions[index].y1, WinCondition[CurrentLevel].Conditions[index].dx, WinCondition[CurrentLevel].Conditions[index].dy);
				let unitNo=WinCondition[CurrentLevel].Conditions[index].unitNo;
				let found=false;
				engine.world.bodies.forEach((body)=>{
					if(body.TimNo==unitNo)
					{
						found=true;
						if((body.position.x>WinCondition[CurrentLevel].Conditions[index].x1)&&
						(body.position.x<WinCondition[CurrentLevel].Conditions[index].x1+WinCondition[CurrentLevel].Conditions[index].dx)&&
						(body.position.y>WinCondition[CurrentLevel].Conditions[index].y1)&&
						(body.position.y<WinCondition[CurrentLevel].Conditions[index].y1+WinCondition[CurrentLevel].Conditions[index].dy)
						)
						{
							//console.log("test condition WIN");
							win++;
						}
					}
					
				});
				if(found==false)
					win++;
			}
		
			if(win==WinCondition[CurrentLevel].Conditions.length)
			{
				if(CurrentLevelWinned==false)
				{
					CurrentLevelWinned=true;
					Score=Score+Bonus1+Bonus2;
					Bonus1=0;
					Bonus2=0;
					displayScore();
					setTimeout(function() { youWin(); }, 2000);
				}
			}
		}
	}
	
	function youWin()
	{	
		stop();
		ctx.fillStyle = "rgba(0,243,243,255)";
		ctx.fillRect(canvas.width/2-40,canvas.height/2-40, 80,80);
		ctx.font = "10px Arial";
		ctx.fillStyle = "purple";
		ctx.fillText("You win",canvas.width/2-20,canvas.height/2-20);
	}
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
					var restitution=files[result].restitution;
					if(restitution==undefined)
						restitution=0;
					var mass=files[result].mass;
					if(mass==undefined)
						mass=1;
					let ox=0;
					let oy=0;
					if(files[part.TimType].ox!=undefined)
						ox=files[part.TimType].ox;
					if(files[part.TimType].oy!=undefined)
						oy=files[part.TimType].oy;
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
					
					Composite.add(world, [movingObj]);
					part.movingObj=movingObj;
				}
				else
				{
					if(part.TimType==3)//"Teeter-totter (3)"
					{
						console.log("Teeter-totter=",part.no);
						var staticObj = Bodies.rectangle(playgroundOffsetX+part.pos_x+part.width/2,playgroundOffsetY+part.pos_y+part.height/2+2, part.width-4, 5, {
							isStatic: false, 
							TimNo:part.no,
							render: { fillStyle: "rgba(0, 0, 255, 0)" }
							});
						if(part.flipH==0)
							Matter.Body.rotate(staticObj,-0.3);
						else
							Matter.Body.rotate(staticObj,0.3);
						
						//staticObj.friction=1;
 						//staticObj.frictionAir=0.01*20;
						//staticObj.frictionStatic=0.5*40;

						Composite.add(world, [staticObj]);
						part.staticObj=staticObj;
						part.staticObjId=staticObj.id;
						//console.log("id=",part.staticObjId);
						
						var staticObjBloc1 = Bodies.rectangle(playgroundOffsetX+part.pos_x+12,playgroundOffsetY+part.pos_y+part.height+3, 5, 5, {
							isStatic: true, 
							render: { fillStyle: "rgba(0, 0, 255, 0)" }
							});
						var staticObjBloc2 = Bodies.rectangle(playgroundOffsetX+part.pos_x+part.width-12,playgroundOffsetY+part.pos_y+part.height+3, 5, 5, {
							isStatic: true, 
							render: { fillStyle: "rgba(0, 0, 255, 0)" }
							});
						Composite.add(world, [staticObjBloc1,staticObjBloc2]);	
						 
						 var constraint = Constraint.create({
							pointA: { x: playgroundOffsetX+part.pos_x+part.width/2, y: playgroundOffsetY+part.pos_y+part.height/2 },
							bodyB: staticObj,
							length: 0
						});
						Composite.add(world, [constraint]);
						
						
					}
					else if(files[part.TimType].phy_poly!=undefined)
					{
						console.log("poly");
						
						//console.log("phy_poly.length="+files[part.TimType].phy_poly.length);
						for(let i=0;i<files[part.TimType].phy_poly.length;i++)
						{
							
						
						/*
							console.log("verts1=",files[part.TimType].phy_poly);
							let ret=polygonMakeCCW(files[part.TimType].phy_poly);
							console.log(ret);
							console.log("verts2=",files[part.TimType].phy_poly);
							// Decompose into convex polygons, using the faster algorithm
							var result2;
							
							var convexPolygons = polygonQuickDecomp(files[part.TimType].phy_poly,result2);
							console.log("verts3=",result2);
							//let verts = Matter.Vertices.fromPath(files[part.TimType].phy_poly[0]);
							//let verts = Matter.Vertices.fromPath(convexPolygons);
							//let verts = Vertices.create(points, body);
							console.log("verts3=",convexPolygons);
							*/
							let verts = Matter.Vertices.fromPath(files[part.TimType].phy_poly[i].p);
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
							if(files[part.TimType].phy_poly[i].x!=undefined)
							{
								//console.log("ggg  x");
								ox=ox-(files[part.TimType].phy_poly[i].x*part.width)*scaleX;
							}
							if(files[part.TimType].phy_poly[i].y!=undefined)
							{
								//console.log("ggg  y");
								oy=oy-(files[part.TimType].phy_poly[i].y*part.height)*scaleY;
							}
							
							var staticObj =Bodies.fromVertices(playgroundOffsetX+ox, playgroundOffsetY+oy, verts, {
								isStatic: true, 
								TimNo:part.no,
								render: { fillStyle: "rgba(0, 0, 255, 0)"}
								}, true, 0.001, 20);
							Composite.add(world, [staticObj]);
							part.staticObj=staticObj;
							part.staticObjId=staticObj.id;
							//console.log("id=",part.staticObjId);
						}
					}
					else
					{
						var staticObj = Bodies.rectangle(playgroundOffsetX+part.pos_x+part.width/2,playgroundOffsetY+part.pos_y+part.height/2, part.width, part.height, {
							isStatic: true, 
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
	function myTimerBonus1()
	{
		if(Bonus1>0)
			Bonus1--;
		displayScore();
	}
	function PartConnectionFree(part_no)
	{
		let partFree=true;
		LevelJson.Parts.forEach(part => {
			if(part.TimType==8)
			{
				if(part.connected_part_1==part_no)
					partFree=false;
				if(part.connected_part_2==part_no)
					partFree=false;
			}
		});
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

	function checkConnection(pos_x,pos_y)
	{
		let no=-1;
		LevelJson.Parts.forEach(part => {
			if(doPartsOverlapMouse(part,pos_x,pos_y))
			{
				if(PartConnectionFree(part.no))
					no= part.no;
			}
		});
		return no;
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
			if(DraggingObject.TimType==8)
			{
				document.getElementById("myCanvas").style.cursor =  "url('./images/MOUSE-BMP/MOUSE-8.cur'), auto";//belt cursor
				BeltMode=1;
				Dragging=false;
				BeltNoConnecting=DraggingObject.no;
			}
			else
			{
				document.getElementById("myCanvas").style.cursor =  "url('./images/MOUSE-BMP/MOUSE-0.cur'), auto";//standatd cursor
				BeltMode=0;
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
		if(BeltMode==0)
		{
			if(SelectedPart!=undefined)
					{
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
				if(doPartsOverlapMouse(part,Xclick,Yclick	))
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
			});
		
			if(BeltMode==2)
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
							console.log("drag=",part);
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
			
			DraggingObject.pos_x=Math.round((e.pageX-playgroundOffsetX-canvas.offsetLeft-DraggingObject.width/2)/16)*16+8;
			DraggingObject.pos_y=Math.round((e.pageY-playgroundOffsetY-canvas.offsetTop-DraggingObject.height/2)/16)*16+8;
			
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
					if(BeltMode==0)
						document.getElementById("myCanvas").style.cursor =  "url('./images/MOUSE-BMP/MOUSE-0.cur'), auto";//standatd cursor
					else
						document.getElementById("myCanvas").style.cursor =  "url('./images/MOUSE-BMP/MOUSE-8.cur'), auto";//belt cursor
				}
			}
			MouseOnPart=onPartNo;
			if(BeltMode==2)
			{
				Mouse_pos_x=e.pageX-playgroundOffsetX-canvas.offsetLeft;
				Mouse_pos_y=e.pageY-playgroundOffsetY-canvas.offsetTop;
				refresh(true);
			}
			
		}
	}
	function doPartsOverlaps(part1, part2)
	{
		if((files[part1.TimType].specialTest!=undefined)||(files[part2.TimType].specialTest!=undefined))
		{
			console.log("test overlap special test");
			return false;
		}
		
		if(part1.no==part2.no)
			return false;
		//if(part2.no==1)
		//{
	
		let max1x=part1.pos_x+part1.width;
		let min1x=part1.pos_x;
		
		let max2x=part2.pos_x+part2.width;
		let min2x=part2.pos_x;
		
		let max1y=part1.pos_y+part1.height;
		let min1y=part1.pos_y;
		
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
	
	function doPartsOverlapMouse(part1, x,y)
	{
		if(files[part1.TimType].node_x==undefined)
			return false;
	
		const  [xn,yn]=GetNodePos(part1)
	/*
		let max1x=part1.pos_x+((files[part1.TimType].node_x+files[part1.TimType].node_d)*+part1.width)/100;
		let min1x=part1.pos_x+((files[part1.TimType].node_x-files[part1.TimType].node_d)*+part1.width)/100;
				
		let max1y=part1.pos_y+((files[part1.TimType].node_y+files[part1.TimType].node_d)*+part1.height)/100;
		let min1y=part1.pos_y+((files[part1.TimType].node_y-files[part1.TimType].node_d)*+part1.height)/100;
		*/
		
		let max1x=xn+(files[part1.TimType].node_d*part1.width)/100;
		let min1x=xn-(files[part1.TimType].node_d*part1.width)/100;
				
		let max1y=yn+(files[part1.TimType].node_d*+part1.height)/100;
		let min1y=yn-(files[part1.TimType].node_d*+part1.height)/100;
		
		let aLeftOfB = max1x < x;
		let aRightOfB = min1x > x;
		let aAboveB = min1y > y;
		let aBelowB = max1y < y;
		
		//console.log("test overlap1:"+aLeftOfB+"/"+aRightOfB+"/"+aAboveB+"/"+aBelowB,part2);
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
	
	function LoadBoard()
	{
		NBBoardsToLoad=0;
		let fileList=[];
		for(let i=0;i<43;i++)//0->42 GP_BORD-BMP
		{
			NBBoardsToLoad++;
			fileList[NBBoardsToLoad-1] = './images/GP_BORD-BMP/GP_BORD-'+i+".png";  
		}
		for(let i=0;i<3;i++)//43->45 SCORE1-BMP
		{
			NBBoardsToLoad++;
			fileList[NBBoardsToLoad-1] = './images/SCORE1-BMP/SCORE1-'+i+".png";  
		}
		for(let i=0;i<2;i++)//46->47 SCORE2-BMP
		{
			NBBoardsToLoad++;
			fileList[NBBoardsToLoad-1] = './images/SCORE2-BMP/SCORE2-'+i+".png";  
		}
		for(let i=0;i<11;i++)//48->59 GP_MENU
		{
			NBBoardsToLoad++;
			fileList[NBBoardsToLoad-1] = './images/GP_MENU-BMP/GP_MENU-'+i+".png";  
		}
		for(let i=27;i<32;i++)//59->64 small Icons
		{
			NBBoardsToLoad++;
			fileList[NBBoardsToLoad-1] = './images/MOUSE-BMP/MOUSE-'+i+".png";  
		}
		//console.log("Board:",fileList);
		
		for(let i=0;i<NBBoardsToLoad;i++)
		{
			Boards[i] = new Image();  
			Boards[i].src = fileList[i];  
			Boards[i].onload = () => {  
				NBBoardsLoaded++;
				if(NBBoardsLoaded==NBBoardsToLoad)
				{
					console.log("All extra images loaded: "+NBBoardsLoaded) ;
					LoadLevel(CurrentLevel);
				}
			};
		}
		return;
		
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
									Body.applyForce(part.movingObj, part.movingObj.position, { x: 0.001, y: 0 })
								if(LevelJson.Parts[body.TimNo].animDirectionX==1)
									Body.applyForce(part.movingObj, part.movingObj.position, { x: -0.001, y: 0 })
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
		refresh(false);
		checkIfWin();
	}
	
	function collision_mouse(TimNo)
	{
		
			console.log("moving part direction "+LevelJson.Parts[TimNo].flipH+" "+LevelJson.Parts[TimNo].flipV);
		
			AnimPart(TimNo,true,LevelJson.Parts[TimNo].flipH,LevelJson.Parts[TimNo].flipV,false,false);
	}
	function collision_bellow(TimNo)
	{
		
		console.log("moving part direction "+LevelJson.Parts[TimNo].flipH+" "+LevelJson.Parts[TimNo].flipV);
		AnimPart(TimNo,false,LevelJson.Parts[TimNo].flipH,LevelJson.Parts[TimNo].flipV,true,false);
	
		let scaleX=1;
		if(LevelJson.Parts[TimNo].flipH==1)
			scaleX=-1;
		
		let startPoint = { x: LevelJson.Parts[TimNo].pos_x+playgroundOffsetX+LevelJson.Parts[TimNo].width/2, y: LevelJson.Parts[TimNo].pos_y+playgroundOffsetY+LevelJson.Parts[TimNo].height/2 };
		var collisions = [];
        let  bodies = Composite.allBodies(engine.world);
        let  endPoint = { x: LevelJson.Parts[TimNo].pos_x+playgroundOffsetX+LevelJson.Parts[TimNo].width/2+100*scaleX, y: LevelJson.Parts[TimNo].pos_y+playgroundOffsetY+LevelJson.Parts[TimNo].height/2};
		
		
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
		let vx=1.55;//2.3
		let vy=-3.8;//2.5
		collisions.forEach((collision) => {
			if((collision.bodyA.isStatic==false)&&(collision.bodyA.id!=_impactorBody.id))
			{
				let scaleX=-1;
				if(collision.bodyA.position.x>_TeeterTotterBoby.position.x)
					scaleX=1;
				console.log("collisions -> apply force 1");
			//collision.body.isSleeping=true;
			//Body.applyForce(collision.body, collision.body.position, { x:33, y: 0.0010 });
			//Body.applyForce(collision.bodyA, collision.bodyA.position, { x:40, y: -40 });
			Body.setVelocity(collision.bodyA, { x:vx*scaleX, y: vy });
			//collision.body.TimDirectionX=scaleX;
			//console.log("collisions ->",collision.body);
			}
			if((collision.bodyB.isStatic==false)&&(collision.bodyB.id!=_impactorBody.id))
			{
				let scaleX=-1;
				if(collision.bodyB.position.x>_TeeterTotterBoby.position.x)
					scaleX=1;
				console.log("collisions -> apply force 2");
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
				console.log("TT "+_TeeterTotterBoby.TimNo+"=> falling left");
				if((LevelJson.Parts[_TeeterTotterBoby.TimNo].animStep==undefined)||(LevelJson.Parts[_TeeterTotterBoby.TimNo].animStep==0))
				{
					console.log("TT "+_TeeterTotterBoby.TimNo+"=> falling left, no move");
				}
				else
				{
					console.log("TT "+_TeeterTotterBoby.TimNo+"=> falling left, move=>");
					
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
				console.log("TT "+_TeeterTotterBoby.TimNo+"=> falling right (swapped)");
				if((LevelJson.Parts[_TeeterTotterBoby.TimNo].animStep==undefined)||(LevelJson.Parts[_TeeterTotterBoby.TimNo].animStep==0))
				{
					console.log("TT "+_TeeterTotterBoby.TimNo+"=> falling right (swapped), no move");
				}
				else
				{
					console.log("TT "+_TeeterTotterBoby.TimNo+"=> falling right (swapped), move=>");
					
					
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
		else
		{
			if(LevelJson.Parts[_TeeterTotterBoby.TimNo].flipH==0)
			{
				console.log("TT "+_TeeterTotterBoby.TimNo+"=> falling right");
				if((LevelJson.Parts[_TeeterTotterBoby.TimNo].animStep==undefined)||(LevelJson.Parts[_TeeterTotterBoby.TimNo].animStep==0))
				{
					console.log("TT "+_TeeterTotterBoby.TimNo+"=> falling right, move=>");
					
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
					console.log("TT "+_TeeterTotterBoby.TimNo+"=> falling right, no move");
				}
			}
			else
			{
				if((LevelJson.Parts[_TeeterTotterBoby.TimNo].animStep==undefined)||(LevelJson.Parts[_TeeterTotterBoby.TimNo].animStep==0))
				{
					console.log("TT "+_TeeterTotterBoby.TimNo+"=> falling left(swapped), no move");
				}
				else
				{
					console.log("TT "+_TeeterTotterBoby.TimNo+"=> falling left(swapped), move=>");
					
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
				collision_bellow(collision.bodyA.TimNo);
			if(LevelJson.Parts[collision.bodyB.TimNo].TimType==16)
				collision_bellow(collision.bodyB.TimNo);
			
			if(LevelJson.Parts[collision.bodyA.TimNo].TimType==3)
				collision_TeeterTotter(collision.bodyA,collision.bodyB)//Teeter-totter (3)
			if(LevelJson.Parts[collision.bodyB.TimNo].TimType==3)
				collision_TeeterTotter(collision.bodyB,collision.bodyA)//Teeter-totter (3)
			
			
			if(LevelJson.Parts[collision.bodyA.TimNo].TimType==4)//baloon
			{
				if(LevelJson.Parts[collision.bodyB.TimNo].TimType==14)//gear
				{
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
		}
		});
	  
	}
	//--------------------------------------------------
	// init
	//--------------------------------------------------
	function init(_test)
	{
		Test=_test;
		if(Test==false)
			CurrentLevel=1;
		//import { poly-decomp } from './decomp.js';
		//Common.setDecomp('poly-decomp');
		//Common.setDecomp(require('poly-decomp'));
		canvas = document.getElementById("myCanvas");
		wireframeCheckbox =  document.getElementById("wireframe");
		if(wireframeCheckbox!=undefined)
			wireframeCheckbox.addEventListener('change', function(){console.log("render.options:",render.options);if(wireframe==true) wireframe=false; else wireframe=true;render.options.wireframes=wireframe;refresh(true);})
		winConditionCheckbox =  document.getElementById("winCondition");
		if(winConditionCheckbox!=undefined)
			winConditionCheckbox.addEventListener('change', function(){if(ShowWinConditions==true) ShowWinConditions=false; else ShowWinConditions=true;refresh(true);})

		canvas.onmousedown = MouseClickDown;
		canvas.onmouseup = MouseClickUp;
		canvas.onmousemove = MouseMove;
		ctx = canvas.getContext("2d");
		engine = Engine.create();
		runner=undefined;
		render = Render.create({
			  engine, 
			  canvas: canvas,
			  options: {
				wireframes: wireframe,
				background: "rgba(0,162,162,255)",
				width: canvas.width,
				height: canvas.height,
				pixelRatio:  window.devicePixelRatio // here
			  }
			}); 

		world = engine.world;
		
		Events.on(render, "beforeRender", (event) => {beforeRender();});
		Events.on(render, "afterRender", (event) => {afterRender();});
		Events.on(engine,"collisionStart", (event) => {collisionStart(event);});
			
		LoadBoard();
		document.getElementById("myCanvas").style.cursor =  "url('./images/MOUSE-BMP/MOUSE-0.cur'), auto";//standatd cursor
	}
	