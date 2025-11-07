const WinCondition={
	"1":{"Conditions":[{"t":"p","unitNo":10,"x1":432,"y1":155,"dx":50,"dy":50}]},
	"2":{"Conditions":[{"t":"p","unitNo":23,"x1":150,"y1":255,"dx":75,"dy":50},{"t":"p","unitNo":24,"x1":355,"y1":255,"dx":75,"dy":50}]},
	"3":{"Conditions":[{"t":"d","unitNo":8},{"t":"d","unitNo":9},{"t":"d","unitNo":10}]},
	"4":{"Conditions":[{"t":"p","unitNo":24,"x1":425,"y1":300,"dx":140,"dy":50}]},
	"5":{"Conditions":[{"t":"p","unitNo":23,"x1":30,"y1":250,"dx":70,"dy":30}]},
	
	"6":{"Conditions":[{"t":"a","unitNo":0}]},
	"8":{"Conditions":[{"t":"d","unitNo":11}]},
};	
const Solutions={
	"1":{"Parts":[{"unitNo":14,"x":577,"y":115,"name":"Belt (8)","FlipH":0,"FlipV":0,"cp1":17,"cp2":8},{"unitNo":15,"x":577,"y":115,"name":"Belt (8)","FlipH":0,"FlipV":0,"cp1":18,"cp2":9},{"unitNo":16,"x":577,"y":115,"name":"Belt (8)","FlipH":0,"FlipV":0,"cp1":19,"cp2":2},{"unitNo":17,"x":8,"y":296,"name":"Mouse cage (6)","FlipH":0,"FlipV":0},
	{"unitNo":18,"x":152,"y":280,"name":"Mouse cage (6)","FlipH":0,"FlipV":0},{"unitNo":19,"x":264,"y":200,"name":"Mouse cage (6)","FlipH":0,"FlipV":0},{"unitNo":20,"x":344,"y":72,"name":"Wood incline (2)","FlipH":0,"FlipV":0,"size":3,"width":64}]},
	"2":{"Parts":[{"unitNo":25,"x":472,"y":56,"name":"Basketball (9)","FlipH":0,"FlipV":0},{"unitNo":26,"x":577,"y":115,"name":"Belt (8)","FlipH":0,"FlipV":0,"cp1":27,"cp2":7},{"unitNo":27,"x":456,"y":104,"name":"Mouse cage (6)","FlipH":1,"FlipV":0}]},
	"3":{"Parts":[{"unitNo":13,"x":424,"y":24,"name":"Basketball (9)","FlipH":0,"FlipV":0},{"unitNo":14,"x":456,"y":232,"name":"Tennis ball (44)","FlipH":0,"FlipV":0},{"unitNo":15,"x":408,"y":264,"name":"Bellows (16)","FlipH":1,"FlipV":0},{"unitNo":16,"x":376,"y":72,"name":"Bellows (16)","FlipH":1,"FlipV":0},{"unitNo":17,"x":312,"y":264,"name":"Scrissors (37)","FlipH":0,"FlipV":0}]},
	"4":{"Parts":[{"unitNo":30,"x":184,"y":88,"name":"Teeter-totter (3)","FlipH":0,"FlipV":0},{"unitNo":31,"x":88,"y":264,"name":"Teeter-totter (3)","FlipH":1,"FlipV":0},{"unitNo":32,"x":200,"y":264,"name":"Teeter-totter (3)","FlipH":1,"FlipV":0},{"unitNo":33,"x":312,"y":264,"name":"Teeter-totter (3)","FlipH":1,"FlipV":0}]},
	"5":{"Parts":[ {"unitNo":29,"name":"Teeter-totter (3)","x":72,"y":104,"FlipH":0,"FlipV":0},{"unitNo":30,"name":"Teeter-totter (3)","x":296,"y":200,"FlipH":1,"FlipV":0},{"unitNo":31,"x":88,"y":168,"name":"Boxing glove (35)","FlipH":1,"FlipV":0},{"unitNo":32,"x":312,"y":264,"name":"Boxing glove (35)","FlipH":0,"FlipV":0}]},
	
	"6":{"Parts":[ {"unitNo":4,"x":232,"y":216,"name":"Trampoline (39)","FlipH":0,"FlipV":0}, {"unitNo":5,"x":344,"y":152,"name":"Trampoline (39)","FlipH":0,"FlipV":0},{"unitNo":6,"x":424,"y":104,"name":"Trampoline (39)","FlipH":0,"FlipV":0}]},
	"8":{"Parts":[ {"unitNo":15,"x":104,"y":184,"name":"Bellows (16)","FlipH":0,"FlipV":0},{"unitNo":16,"x":392,"y":280,"name":"Bellows (16)","FlipH":1,"FlipV":0},{"unitNo":17,"x":577,"y":170,"name":"Belt (8)","FlipH":0,"FlipV":0,"cp1":19,"cp2":9},{"unitNo":18,"x":577,"y":170,"name":"Belt (8)","FlipH":0,"FlipV":0,"cp1":20,"cp2":6},{"unitNo":19,"x":296,"y":56,"name":"Windmill (40)","FlipH":1,"FlipV":0},{"unitNo":20,"x":200,"y":184,"name":"Windmill (40)","FlipH":0,"FlipV":0}]},
};

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
	
	function myTimerBonus1()
	{
		if(Bonus1>0)
			Bonus1--;
		displayScore();
	}
	
	function AllImagesLoaded()
	{
		console.log("All images loaded: "+NBImagesLoaded) ;
		if(Test==true)
			myTimer = setInterval(myTimerBonus1, 1000);
		refresh(true);
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
			//console.log(part.name +" =>"+result+":"+PartDef[result]) ;
			//console.log(part);
			for (let index = 0; index < PartDef[result].count; ++index) 
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
							if (WinCondition[CurrentLevel].Conditions[index].t=="p")//position
								win++;
						}
						else if(WinCondition[CurrentLevel].Conditions[index].x1==undefined)
						{
							//console.log("test condition WIN");
							if(LevelJson.Parts[body.TimNo].anim!=undefined)
								if(LevelJson.Parts[body.TimNo].anim==true)
									if (WinCondition[CurrentLevel].Conditions[index].t=="a")//anim
										win++;
						}
						
					}
					
				});
				if(found==false)
					if (WinCondition[CurrentLevel].Conditions[index].t=="d")//destroy
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
	