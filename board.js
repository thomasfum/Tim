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



	function youWin()
	{	
		stop();
		ctx.fillStyle = "rgba(0,243,243,255)";
		ctx.fillRect(canvas.width/2-40,canvas.height/2-40, 80,80);
		ctx.font = "10px Arial";
		ctx.fillStyle = "purple";
		ctx.fillText("You win",canvas.width/2-20,canvas.height/2-20);
	}