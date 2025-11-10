
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

//trempolin active only if contact on top
//managing pos of tooter
//---------------------------
//bug
//restrating simul speed is increasing... see level 6 run+run+run



	var CurrentLevel=8;
	const MaxLevel=9;
	var CurrentLanguage="FR";
	//var CurrentLanguage="EN";

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
	var TotalBonus=0;
	var Bonus1 =0;
	var Bonus2 =0;
	var myTimer;
	



//var decomp = require('poly-decomp');
//let  decomp=polygonDecomp.decomp;

	function refreshClicked()
	{
		refresh(true);
	}

	function stopClicked()
	{
		stop();
	}
	function runClicked()
	{
		run();
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
	
	function showSolutionClicked()
	{
		//"5":{"Parts":[{"unitNo":29,"name":"Teeter-totter","x":432,"y":155,"FlipH":0,"FlipV":0},{"unitNo":30,"name":"Teeter-totter","x":332,"y":155,"FlipH":0,"FlipV":0}]},
		//console.log("solution",Solutions[CurrentLevel]);
		Solutions[CurrentLevel].Parts.forEach((sPart) => {
				
				//console.log("solution part ->",sPart);
				LevelJson.Parts.forEach(part => {
					
					if(part.no==sPart.unitNo)
					{
						part.pos_x=sPart.x;
						part.pos_y=sPart.y;
						part.flipH=sPart.FlipH;
						part.flipV=sPart.FlipV;
						part.in_partsbin=0;
						if(part.TimType==8)//belt
						{
							part.connected_part_1=sPart.cp1;
							part.connected_part_2=sPart.cp2;
						}
						if(part.TimType==2)//wood incilned
						{
							part.size=sPart.size;
							part.width=sPart.width;
						}
					}
				});
				
			});
		refresh(true);
	}
	
	function saveSolutionClicked()
	{
		console.log("solution",Solutions[CurrentLevel]);
		Solutions[CurrentLevel].Parts.forEach((sPart) => {
				
				
				LevelJson.Parts.forEach(part => {
					
					if(part.no==sPart.unitNo)
					{
						sPart.x=part.pos_x;;
						sPart.y=part.pos_y;
						sPart.name=part.name;
						sPart.FlipH=part.flipH;
						sPart.FlipV=part.flipV;
						if(part.TimType==8)//belt
						{
							sPart.cp1=part.connected_part_1;
							sPart.cp2=part.connected_part_2;
						}
						if(part.TimType==2)//wood incilned
						{
							sPart.size=part.size;
							sPart.width=part.width;
						}
							
					}
				});
				console.log("solution part ->", JSON.stringify(sPart));
			});
	}
	function runWireframeClicked()
	{
		wireframe=true;
		render.options.wireframes=wireframe;
		run();
	}
	function winClicked()
	{
		youWin(45891);
	}
	//--------------------------------------------------
	// init
	//--------------------------------------------------
	function init(_test)
	{
		Test=_test;
		if(Test==false)
			CurrentLevel=1;
		
		
		let params = new URLSearchParams(document.location.search);
		let CurrentLanguage = params.get("l"); // ?l=FR
		console.log("language:",CurrentLanguage)
		if((CurrentLanguage!="FR")&&(CurrentLanguage!="EN"))
			CurrentLanguage="EN";
		console.log("language:",CurrentLanguage)
		
		
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
		
		document.addEventListener('keypress', e => {
			console.log('show solutions:'+e.key);
			if (e.key === 'q') {
				showSolutionClicked();
			}
		});

		
		LoadBoard();
		document.getElementById("myCanvas").style.cursor =  "url('./images/MOUSE-BMP/MOUSE-0.cur'), auto";//standatd cursor
	}
	