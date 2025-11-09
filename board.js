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
		for(let i=0;i<59;i++)//64->66 text bar
		{
			NBBoardsToLoad++;
			fileList[NBBoardsToLoad-1] = './images/CP-BMP/CP-'+i+".png";  
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

	function MsgBox(posX,posY,dx,dy)
	{
		
		
		//black
		ctx.fillStyle = "rgba(0,0,0,255)";
		ctx.fillRect(posX-8,posY+12, dx*8+20,dy*8+23);
		
		//black corners
		ctx.drawImage(Boards[37],posX-12,posY+8);
		ctx.drawImage(Boards[38],posX-12,posY+dy*8+15);
		ctx.drawImage(Boards[39],posX+dx*8-10,posY+dy*8+15);
		
		//back
		for(let y=0;y<dy*8;y=y+Boards[42].height)
			for(let x=0;x<dx*8;x=x+Boards[42].width)
			{
				ctx.drawImage(Boards[42],posX+x,posY+y);
			}
		//ctx.drawImage(Boards[42],posX,posY);
		//ctx.drawImage(Boards[42],posX+Boards[42].width,posY);
		//ctx.drawImage(Boards[42],posX+Boards[42].width,posY+Boards[42].height);
		//ctx.drawImage(Boards[42],posX,posY+Boards[42].height);
		
		
		//top bottom
		for(let x=0;x<dx;x++)
		{
			ctx.drawImage(Boards[18], posX+18+x*8, posY-2);
			ctx.drawImage(Boards[19], posX+18+x*8, posY+dy*8+20);
		}
		//left right
		for(let y=0;y<dy;y++)
		{
			ctx.drawImage(Boards[16], posX-2, 	posY+16 + y*8);
			ctx.drawImage(Boards[17],posX+dx*8+20, posY+	16 + y*8);
		}
		
		//CORNER
		ctx.drawImage(Boards[12],posX-5,posY-5);
		ctx.drawImage(Boards[13],posX+dx*8+3,posY-5);
		ctx.drawImage(Boards[14],posX-5,posY+dy*8+3);
		ctx.drawImage(Boards[15],posX+dx*8+3,posY+dy*8+3);
		
	}
	function drawText(posX,posY,dx,posTextY, txt)
	{
		dx=dx-7;
		ctx.drawImage(Boards[64],posX+15,posY+posTextY);
		for(let x=0;x<dx;x++)
		{
			ctx.drawImage(Boards[65],posX+15+24+x*8,posY+posTextY+2);
		}
		ctx.drawImage(Boards[66],posX+15+dx*8+22,posY+posTextY);
		
		ctx.font = "10px Arial";
		ctx.fillStyle = "black";
		ctx.textAlign = "center";
		ctx.fillText(txt,posX+(dx*4)+15+24,posY+posTextY+12);
	}
	
	

	
	function youWin()
	{	
		stop();
		TotalBonus=Bonus1+Bonus2;
		Score=Score+TotalBonus;
		Bonus1=0;
		Bonus2=0;
		displayScore();
					
		let posX=190;
		let posY=100;
		let dX=29;
		let dY=13;
		MsgBox(posX,posY,dX,dY);
		
		
		
		drawText(posX,posY,dX,30, GetPuzzleCompleted());
		drawText(posX,posY,dX,70,GetTotalBonusPoints());
		ctx.font = "10px Arial";
		ctx.fillStyle = "white";
		ctx.textAlign = "center";
		ctx.fillText(GetClickToContinue(),canvas.width/2,posY+105+12);
		
	}
	
	
	function getLines(ctx, text, maxWidth) 
	{
		var words = text.split(" ");
		var lines = [];
		var currentLine = words[0];

		for (var i = 1; i < words.length; i++) {
			var word = words[i];
			var width = ctx.measureText(currentLine + " " + word).width;
			if (width < maxWidth) {
				currentLine += " " + word;
			} else {
				lines.push(currentLine);
				currentLine = word;
			}
		}
		lines.push(currentLine);
		return lines;
	}


	function NewLevel()
	{	
		let posX=40;
		let posY=50;
		let dX=61;
		let dY=29;
		
		MsgBox(posX,posY,dX,dY);
		
		drawText(posX,posY,dX,20, GetPuzzleText());
		drawText(posX,posY,dX,50, GetPuzzleTitle() );
		
		let ox=8;
		//yellow background
		for(let x=0;x<7;x++)
		{
			ctx.drawImage(Boards[122],posX+ox+21+Boards[122].width*x,posY+90+4);
		}

		for(let x=0;x<55;x++)
		{
			ctx.drawImage(Boards[79],posX+ox+21+Boards[79].width*x,posY+90+2+58+2);
			ctx.drawImage(Boards[120],posX+ox+21+8*x,posY+94);
		}
		
		for(let y=0;y<8;y++)
		{
			ctx.drawImage(Boards[78],posX+ox+21,posY+90+y*8);
			ctx.drawImage(Boards[119],posX+ox+21+55*8+1,posY+90+y*8);
		}


		ctx.drawImage(Boards[74],posX+ox+15,posY+90);
		ctx.drawImage(Boards[75],posX+ox+15+439,posY+90);
		ctx.drawImage(Boards[76],posX+ox+15,posY+90+50);
		ctx.drawImage(Boards[77],posX+ox+15+435,posY+90+50+2);
		
		
		ctx.font = "10px Arial";
		ctx.fillStyle = "black";
		
		ctx.textAlign = "left";
		var lines = getLines(ctx,GetPuzzleGoal()/* + " "+LevelJson.Goal.EN+" "+LevelJson.Goal.EN+" "+LevelJson.Goal.EN+" "+LevelJson.Goal.EN+" " +LevelJson.Goal.EN+" "+LevelJson.Goal.EN */,400);
		 for (var n = 0; n < lines.length; n++) 
		 {
			 if(n==lines.length-1)
			 {
				ctx.textAlign = "center";
				ctx.fillText(lines[n],posX+ox+(dX*4),posY+75+n*12+(5-lines.length/2)*12);
			 }
			 else
				 ctx.fillText(lines[n],posX+ox+35,posY+75+n*12+(5-lines.length/2)*12);
		 }
	}
	
	//Language
	function GetPuzzleCompleted()
	{
		if(CurrentLanguage=="FR")
			return "Puzzle " + CurrentLevel + " terminé";
		else
			return "Puzzle " + CurrentLevel + " completed";
	}
	function GetTotalBonusPoints()
	{
		if(CurrentLanguage=="FR")
			return "Total des points bonus: "+TotalBonus;
		else
		return "Total bonus points: "+TotalBonus;
	}
	function GetClickToContinue()
	{
		if(CurrentLanguage=="FR")
			return "(cliquer pour continuer)";
		else
			return "(click button to continue)";
	}
	function GetPuzzleText()
	{
		return "Puzzle " + CurrentLevel;
	}
	function GetPuzzleTitle()
	{
		if(CurrentLanguage=="FR")
		{
			if (LevelJson.Title.FR!=undefined)
				return LevelJson.Title.FR;
		}
		return LevelJson.Title.EN;
	}
	function GetPuzzleGoal()
	{
		if(CurrentLanguage=="FR")
		{
			if (LevelJson.Goal.FR!=undefined)
				return LevelJson.Goal.FR;
		}
		return LevelJson.Goal.EN;
	}