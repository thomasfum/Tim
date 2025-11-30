
//0,162,162
//https://classicreload.com/play/dosx-the-incredible-machine.html
//https://www.vogons.org/viewtopic.php?p=1089143#p1089143
//https://codeberg.org/knt47/timgres
//https://moddingwiki.shikadi.net/wiki/The_Incredible_Machine_Level_Format
//https://www.cursor.cc/?

//rope
//https://jsbin.com/tovoraqima/edit?js,output
//https://labs.phaser.io/edit.html?src=src\physics\matterjs\chain.js
//https://labs.phaser.io/view.html?src=src%5Cphysics%5Cmatterjs%5Cchain.js
//https://hinosstudio.itch.io/matter-js-cut-the-rope-demo
//https://codepen.io/rudtjd2548/pen/rNrxopK

//https://codepen.io/shshaw/pen/eYvrRXL  /kind of chain
//https://codepen.io/take80/pen/OJNYEXr brifge and string
//https://codepen.io/majman/pen/reqzBW intresting
//https://brm.io/matter-js/demo/#bridge

//https://brm.io/matter-js/demo/#chains  <======

//---------------------------
//Todo
// get all levels in french
// get all levels image in french 
// check all levels
// animations
// size 678x369


// noeud
//---------------------------
//bug
//finish getRopeDirectionY
//create getRopeDirectionX for gun
//level 15 le seau frotte

	var CurrentLevel=20;
	const MaxLevel=19;
	var CurrentLanguage="FR";
	//var CurrentLanguage="EN";

	let Images={};
	let Icons={};
	let Boards={};
	let partsbin={};
	let partsInBinAtStart=[];
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
	
	var RopeMode=0;
	var RopeStart=-1;
	var RopeStart_TeeterTotterSide=0;
	var RopeIntermdiatePulley=[];
	var RopeNoConnecting=-1;
	
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
						if(part.TimType==10)//rope
						{
							part.connected_part_1=sPart.cp1;
							part.connected_part_2=sPart.cp2;
							part.TimPulleys=sPart.pls;
						}
						if(part.TimType==2)//wood incilned
						{
							part.size=sPart.size;
							part.width=sPart.width;
						}
						if(part.TimType==3)//Teeter-totter 
						{
							part.ropeNoSide1=sPart.ropeNoSide1;
							part.ropeNoSide2=sPart.ropeNoSide2;
						}
						
						
					}
				});
				
			});
			connectPlugs();
		refresh(true);
	}
	
	function saveSolutionClicked()
	{
		console.log("Save solution for "+CurrentLevel);
		let tbs="\""+CurrentLevel+"\":{\"Parts\":[ ";
		//Solutions[CurrentLevel].Parts.forEach((sPart) => {
			partsInBinAtStart.forEach((sPart_unitNo) => {
				
				LevelJson.Parts.forEach(part => {
					
					if(part.no==sPart_unitNo)
					{
						let sPart={};
						sPart.unitNo=sPart_unitNo;
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
						if(part.TimType==10)//rope
						{
							sPart.cp1=part.connected_part_1;
							sPart.cp2=part.connected_part_2;
							sPart.pls=part.TimPulleys;
						}
						if(part.TimType==2)//wood incilned
						{
							sPart.size=part.size;
							sPart.width=part.width;
						}
						if(part.TimType==3)//Teeter-totter 
						{
							sPart.ropeNoSide1=part.ropeNoSide1;
							console.log("ropeNoSide2",part.ropeNoSide2);
							sPart.ropeNoSide2=part.ropeNoSide2;
						}
						
						
						tbs+=JSON.stringify(sPart);
						tbs+=",";
						//console.log("solution part ->", JSON.stringify(sPart));			
					}
				});
				
			});
			tbs+="]},";
		console.log( tbs);			
	}
	function runWireframeClicked()
	{
		wireframe=true;
		//render.options.wireframes=wireframe;
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
		
		
		wireframeCheckbox =  document.getElementById("wireframe");
		if(wireframeCheckbox!=undefined)
			wireframeCheckbox.addEventListener('change', function(){console.log("render.options:",render.options);if(wireframe==true) wireframe=false; else wireframe=true;render.options.wireframes=wireframe;refresh(true);})
		winConditionCheckbox =  document.getElementById("winCondition");
		if(winConditionCheckbox!=undefined)
			winConditionCheckbox.addEventListener('change', function(){if(ShowWinConditions==true) ShowWinConditions=false; else ShowWinConditions=true;refresh(true);})

		
		render = Render.create({
			engine, 
			element: document.body,
		options: {
				
				wireframes: wireframe,
				background: "rgba(0,162,162,255)",
				//background: 'transparent',
				width: 644,//canvas.width,
				height: 445,//canvas.height,
				pixelRatio:1// window.devicePixelRatio//1//'auto'// window.devicePixelRatio // here
			  }
			}); 

		canvas = render.canvas;
		/*
		canvas.onmousedown = MouseClickDown;
		canvas.onmouseup = MouseClickUp;
		canvas.onmousemove = MouseMove;
		*/
//		document.ontouchstart = MouseClickDown;
		//document.ontouchend = MouseClickUp;
		//document.ontouchmove  = MouseMove;
		
		canvas.onmousedown= function (e) {
		  // Will prevent default action
		  console.log("onmousedown",e);
		  MouseClickDown(e.pageX,e.pageY);
		 // e.preventDefault();
		};
		
		canvas.onmouseup= function (e) {
		  // Will prevent default action
		  console.log("onmouseup");
		  MouseClickUp(e.pageX,e.pageY);
		  //e.preventDefault();
		};
		canvas.onmousemove= function (e) {
		  // Will prevent default action
		  console.log("onmousemove");
		  MouseMove(e.pageX,e.pageY);
		  //e.preventDefault();
		};
		
		/*
		document.ontouchstart= function (e) {
		  // Will prevent default action
		  console.log("ontouchstart",e.changedTouches[0].pageX);
		  MouseClickDown(e.touches[0]);
		 // e.preventDefault();
		};
		*/
		
		document.addEventListener('touchstart', function (e) {
		  // Will prevent default action
		  console.log("ontouchstart",e);
		  MouseClickDown(e.touches[0].clientX,e.touches[0].clientY);
		  //alert("touchstart "+e.touches.length);
		  //e.preventDefault();
		});
		
		document.addEventListener('touchend', function (e) {
		  // Will prevent default action
		  console.log("ontouchend",e);
		 // alert("touchend "+e.changedTouches.length);
		  MouseClickUp(e.changedTouches[0].clientX,e.changedTouches[0].clientY);
		  //e.preventDefault();
		});
		document.addEventListener('touchmove', function (e) {
		  // Will prevent default action
		  console.log("ontouchmove");
		 // alert("touchmove "+e.touches[0].pageX+"; "+e.touches[0].pageY);
		  MouseMove(e.touches[0].clientX,e.touches[0].clientY);
		  
		  //e.preventDefault();
		});
		/*
		document.ontouchmove= function (e) {
		  // Will prevent default action
		  console.log("ontouchmove");
		  MouseMove(e.changedTouches[0]);
		  //e.preventDefault();
		};
		*/
		
		
		ctx = canvas.getContext("2d");
		
		
	
		console.log("-- press 'q' key for solution");
		document.addEventListener('keypress', e => {
			console.log('show solutions:'+e.key);
			if (e.key === 'q') {
				showSolutionClicked();
			}
		});
		let l=document.getElementById("levelInput");
		if(l!=undefined)
		{
			l.addEventListener("keyup", ({key}) => {
				if (key === "Enter") {
					LoadLevel(l.value);
					l.blur();//remove focus
				}
			});
		}
		
		LoadBoard();
		canvas.style.cursor =  "url('./images/MOUSE-BMP/MOUSE-0.cur'), auto";//standatd cursor
	}
	