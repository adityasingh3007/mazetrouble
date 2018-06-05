let player_name;				//Variable to store player's name

let obstacle=[];				//Array to hold obstacle object as its child.

let score;						//Variable to count the score.

let msg;						//Variable to different messages(Pause,Game Over etc.) as and when required.

let pause_menu;					//Object to create a pause menu.

let deep_crash_wall=false; 	   	//Boolean to flag whenever Deep crashes with the wall.

let show_rules=1;				//Variable to flag whether to show instruction or not.

//Variables declared to define the speed of respective thing.(Speed w.r.t x-direction)
let speed_obstacle=2;			
let speed_deep=2;

let lvl=1;						//Variable to count the level.

let interval=90;				//Variable which sets the interval after which new wall will be pusjed inside the screen.

let deep_shot=false;			//Object when Deep fires a shot.

let enemy=false;				//Object which adds enemy.

let enemy_killed=0;				//Variable which is used to flag whether the enemy is killed or not.

let enemy_kill_count=0;			//Variable to count the number of times enemy has been shot.

//Object Variables to add the audio tag into the page and load the page with the audio .
let background_music;					//Sound for background music
let pause_menu_sound;					//Sound for Pause menu
let winner_sound;						//Sound when WINNER is decided.
let game_over_sound;					//Sound when game ends.
let deep_death_sound;					//Sound when Deep dies
let alien_pain_sound;					//Sound when alien dies
let deep_gunshot;						//Deep's gunshot sound
let alien_gunshot;						//alien's gunshot sound
let level_sound;						//Sound when Level scene is shown


//Function to show the caption field as and when required.
function user_input(id) {
	let value=document.getElementById(id).value;
	if(value!="")
		document.getElementById("input_caption").style.height="15px";
	else
	if(value=="")
		document.getElementById("input_caption").style.height="0px";
}

//Function to show the rules and instruction after taking name as input.
function initiallize() {
	document.getElementById("loading").style.display="none";
	document.getElementById("welcome_screen_container").style.display="none";
	document.getElementById("game_container").style.display="block";
	document.getElementById("player_name_cont").innerHTML=player_name;
	if(localStorage.getItem("Maze_trouble_show_inst")!=null)
		show_rules=localStorage.getItem("Maze_trouble_show_inst");
	if(show_rules==1) {
		document.getElementById("rules_container").style.display="block";
		document.getElementById("canvas_container").style.display="none";
		document.getElementById("options_container").style.display="none";
	}
	else {
		document.getElementById("rules_container").style.display="none";
		document.getElementById("canvas_container").style.display="block";
		document.getElementById("options_container").style.display="block";
		start_game();
	}
}

//Function to take the user's name.
function submit_game_data() {
	let value=document.getElementById("ui_text").value;
	if(value!="") {
		player_name=value;
		document.getElementById("error_container").style.display="none";
		document.getElementById("user_input_panel").style.display="none";
		document.getElementById("loading").style.display="block";
		setTimeout(initiallize,700);
		
	}
	else
	if(value=="") {
		document.getElementById("error_container").style.display="block";
		document.getElementById("ui_text").focus();
	}
}


//Object which get canvas from HTML page and sets its properties.
let  game_area = {
	canvas: document.getElementById("game_canvas"),
	start: function() {																//Function to initiallize the canvas and all required things.
		this.canvas.width=800;
		this.canvas.height=300;
		this.canvas.style.background="url('./bg_img.png')";
		this.canvas.style.backgroundRepeatx="no-repeat";
		this.canvas.style.borderRadius="5px";
		this.context=this.canvas.getContext("2d"),
		this.canvas.addEventListener("mousemove", mouseMoveHandler, false);			//Add mouseMove event for handling mouse movements.
		this.canvas.addEventListener("click", mouseFire, false);					//Add Click event for handling mouse click.
		this.frameNo=0;		
		this.interval = setInterval(updateGameArea, 33);							//Calls the update funtion to set the next frame. 33 means frame rate for this is 30 fps. (1000/33)
	},
	clear : function() {														 	//Function to clear the canvas.
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},
	stop : function() {																//Function to stop updating the frame.
        clearInterval(this.interval);
    },
	resume: function() {															//Function to resume updating the frame.
		this.interval = setInterval(updateGameArea, 33);
	}
}

//Function to load all the music and start the game.
function start_game() {
	//Load background musin and level music.
	background_music=new sound("bgmusic.mp3");				
	level_sound=new sound("level.mp3");
	game_area.start();																//Canvas initiallized. Game area is ready.									
	deep.update();																	//Updates the position of Deep on screen.(For the first run, load Deep onto the screen).
	show_level();																	//Show the level screen.
	score=new add_text("score");													//Add the score
	//Load the other sound effects
	pause_menu_sound=new sound ("pause.mp3");					
	winner_sound=new sound ("win.mp3");
	game_over_sound=new sound ("over.mp3");
	deep_death_sound=new sound ("deep_death.mp3");
	deep_gunshot=new sound ("deep_fire.mp3");
	alien_gunshot=new sound ("Alien_fire.mp3");
	alien_pain_sound=new sound ("Alien_death.mp3");
}

//Function to load the sound inside the canvas tag aand set its properties.
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
	if(src=="bgmusic.mp3") {
		this.sound.loop=true;
		this.sound.volume=0.4;
	}
	else
	if(src=="pause.mp3"||src=="over.mp3") {
		this.sound.loop=true;
	}
    this.sound.style.display = "none";
    document.getElementById("canvas_container").appendChild(this.sound);
    this.play = function(){
        this.sound.play();
		this.sound.currentTime=0;
    }
    this.stop = function(){
        this.sound.pause();
    }
}

//Function which shows the Level scene on the screen.
function show_level() {
	background_music.stop();
	level_sound.play();
	//Remove all mouse events while screen is being displayed.
	game_area.canvas.removeEventListener("mousemove", mouseMoveHandler, false);
	game_area.canvas.removeEventListener("click", mouseFire, false);
	document.getElementById("play_pause_restart").disabled=true;					//Disable pause button
	game_area.stop();																//Stop the game from updating the frames.
	let ctx=game_area.context;
	ctx.fillStyle = "#80808096";
	ctx.fillRect(0,0,800,300);
	msg=new add_text("LEVEL");
	msg.update();																	//Show the screen.
	setTimeout(function() { 														//Function to move back to initial state.
				game_area.clear();													
				game_area.resume();
				document.getElementById("play_pause_restart").disabled=false;				//Enable pause button
				//Enable all mouse events again
				game_area.canvas.addEventListener("mousemove", mouseMoveHandler, false);
				game_area.canvas.addEventListener("click", mouseFire, false);
				background_music.play();
				},5000);
}

//Display Winner message when players wins.
function winner() {
	game_area.canvas.removeEventListener("mousemove", mouseMoveHandler, false);
	game_area.canvas.removeEventListener("click", mouseFire, false);
	background_music.stop();
	winner_sound.play();
	game_area.stop();
	let ctx=game_area.context;
	ctx.fillStyle = "#80808096";
	ctx.fillRect(0,0,800,300);
	msg=new add_text("WINNER");
	msg.update();
	document.getElementById("play_pause_restart").value="RESTART";
	document.getElementById("play_pause_restart").style.background="red";
	return;
}

//Function to check when to add walls/obstacle to screen.
function everyinterval(n) {
    if ((game_area.frameNo / n) % 1 == 0) {
		return true;
	}
    return false;
}

//Object which adds Deep to the screen.
let deep = {
	x:25,
	y:150,
	height:45,
	width:50,
	startx:0,											//For sprite image
	starty:0,
	img:document.getElementById("deep_img"),
	update:function() {
		ctx=game_area.context;
		ctx.drawImage(this.img,this.startx,this.starty,198,151,this.x,this.y,this.width,this.height);
		if(!deep_crash_wall) {								//If Deep hasn't crashed with wall, then update its appearance according to sprite.
			this.startx+=198;
				if(this.startx>=1980) {
					this.startx=0;
				}
		}
	},
	crash_check:function(obj) {													//Function to check whether deep has crashed with any of the walls added so far.
		let myleft_x=this.x
		let myright_x=this.x+this.width;
		let mytop_y=this.y;
		let mybottom_y=this.y+this.height;
		let otherleft_x=obj.x;
		let otherright_x=obj.x+obj.width;
		let othertop_y=obj.y;
		let otherbottom_y=obj.y+obj.height;
		let crash=true;
		if ((mybottom_y < othertop_y) || (mytop_y > otherbottom_y) ||  (myright_x < otherleft_x)|| (myleft_x > otherright_x)) {
				crash = false;
        }
		return crash;
	}
}


//Function to add gun fire when Deep fires a shot
function add_shot() {
	this.x=deep.x+deep.width;											//Set the position according to Deep's current position.
	this.y=deep.y+deep.height-8;
	this.update=function() {
		ctx=game_area.context;
		ctx.beginPath();
		ctx.arc(this.x,this.y,2.5,0,2*Math.PI);
		ctx.fillStyle="yellow";
		ctx.fill();
		ctx.closePath();
		if(((this.x+2.5)<=enemy.x+enemy.width)&&(this.x-2.5>=enemy.x+5)) {						//2.5 is used to account for spherical shape.
				if(((this.y+3)<=enemy.y+enemy.height)&&((this.y-3)>=enemy.y+25))  {			//Other number is used to account for blank image portion in sprite image.
					deep_shot=false;
					score.value+=50;
					alien_pain_sound.play();
					++enemy_kill_count;
					if(enemy_kill_count==lvl) {
						alien_pain_sound.play();
						enemy=false;															//If enemy is killed,remove enemy from screen.
						enemy_killed=1;
						enemy_kill_count=0;														//reset the counter.
						score.value+=100*lvl;
					}
				}
		}
		deep_shot.x+=15;																		//Updates the fire image position.
		if(deep_shot.x-5>800)
			deep_shot=false;
	}
}

//Function to add fire whenever user clicks.
function mouseFire() {
	if(deep_shot==false) {								//If ther is no fire present on the screen.
		deep_shot=new add_shot();
		deep_gunshot.play();
	}
	
  }
  
//Function to handle the mouse move events.  
function mouseMoveHandler(e) {
	let rect=game_area.canvas.getBoundingClientRect();	
	deep.y=e.clientY-rect.top;
	if(deep.y<1)
		deep.y=1;
	if(deep.y+deep.height>300)
		deep.y=300-deep.height;
	
  }
  
//Function to add enemy.
function add_enemy() {
	this.x=730;
	this.y=0;
	this.startx=0;														//To have sprite.
	this.starty=0;
	this.dy=lvl+3;														//Speed at which its y coordinate will change.
	this.img=document.getElementById("evil1");
	this.selection_height=258;
	this.selection_width=256;
	this.width=60;
	this.height=65;
	this.shot_x=730;													//Enemy's bullet x and y-coordinate.
	this.shot_y=this.y+this.height;
	this.shot_update=function() {										//Function to add/update bullets position 
		    if(this.shot_x==this.x)
				alien_gunshot.play();
				ctx=game_area.context;
				ctx.beginPath();
				ctx.arc(this.shot_x,this.shot_y,3,0,2*Math.PI);
				ctx.fillStyle="green";
				ctx.fill();
				ctx.closePath();
			//Condition to check whether bullet has hit Deep or not.
			if(((this.shot_x-3)<=deep.x+deep.width)	&& ((this.shot_x+3)>=deep.x)) {
				if(((this.shot_y+3)<=deep.y+deep.height)&&((this.shot_y-3)>=deep.y)) {
					document.getElementById("play_pause_restart").disabled=true;
					deep_death_sound.play();
					game_area.stop();
					setTimeout(function() {
						background_music.stop();
						game_over_sound.play();
						game_area.stop();
						let ctx=game_area.context;
						ctx.fillStyle = "#80808096";
						ctx.fillRect(0,0,800,300);
						msg=new add_text("GAME OVER");
						msg.update();
						document.getElementById("play_pause_restart").disabled=false;
						document.getElementById("play_pause_restart").value="RESTART";
						document.getElementById("play_pause_restart").style.background="red";
						return;
					},2000);
				}
			}
			this.shot_x-=15;														//Update bullet's x-cordinate.	
			if(this.shot_x-3<=0) {													//If there is no bullet from enemy's side on the screen, then add another bullet.
				this.shot_x=this.x;
				this.shot_y=this.y+this.height;
			}
	}
	this.update=function() {														//Function to updates enemy's position.
		ctx=game_area.context;
		ctx.drawImage(this.img,this.startx,this.starty,this.selection_width,this.selection_height,this.x,this.y,this.width,this.height);
		this.startx+=this.selection_width;
		if(this.startx>=this.selection_width*4) {
			this.startx=0;
			this.starty+=this.selection_height;
		}
		if(this.starty>=this.selection_height*3)
			this.starty=0;
		this.y+=this.dy;
		if(this.y<0)
			this.dy=3+lvl;
		if(this.y+this.height>290)
			this.dy=-(3+lvl);
		//Condition to check whether Deep has collided with enemy or not.
		if((((this.y+25)>=deep.y)&&((this.y+25)<=deep.y+deep.height))||(this.y+this.height-20>=deep.y&&this.y+this.height-20<=deep.y+deep.height))  {
			if((this.x+20>=deep.x&&this.x+20<=deep.x+deep.width)||(this.x+this.width>=deep.x&&this.x+this.width<=deep.x+deep.width)) {
				document.getElementById("play_pause_restart").disabled=true;
				deep_death_sound.play();
					game_area.stop();
					setTimeout(function() {
						background_music.stop();
						game_over_sound.play();
						game_area.stop();
						let ctx=game_area.context;
						ctx.fillStyle = "#80808096";
						ctx.fillRect(0,0,800,300);
						msg=new add_text("GAME OVER");
						msg.update();
						document.getElementById("play_pause_restart").disabled=false;
						document.getElementById("play_pause_restart").value="RESTART";
						document.getElementById("play_pause_restart").style.background="red";
						return;
					},2000);
			}
		}
		this.shot_update();												//Update enemy's bullet position.
	}
}

//Constructor to add text on the game screen.
function add_text(text) {
	this.value=0;											//Score value is stored here.
	this.update=function() {
		ctx=game_area.context;
		if(text=="score") {
			ctx.fillStyle = "#fff";
			ctx.textAlign = "center";
			ctx.font="20px CodeBold";
			ctx.fillText("SCORE: "+this.value,game_area.canvas.width/2,20);
			ctx.fillStyle = "yellow";
			ctx.textAlign = "center";
			ctx.font="20px CodeBold";
			ctx.fillText("Level: "+lvl,750,20);
		}
		else
		if(text=="GAME OVER") {
			game_area.canvas.removeEventListener("mousemove", mouseMoveHandler, false);
			game_area.canvas.removeEventListener("click", mouseFire, false);
			ctx.fillStyle = "yellow";
			ctx.textAlign = "center";
			ctx.font="50px CodeBold";
			ctx.fillText(text,game_area.canvas.width/2,game_area.canvas.height/2);
			ctx.font="30px CodeBold";
			ctx.fillText("Your final score is "+score.value,game_area.canvas.width/2,game_area.canvas.height/2+50);
			ctx.fillStyle = "#fff";
			ctx.font="15px CodeBold";
			ctx.fillText("Press 'RESTART' to Play Again",game_area.canvas.width/2,game_area.canvas.height-10);
		}
		else
		if(text=="WINNER") {
			ctx.fillStyle = "green";
			ctx.textAlign = "center";
			ctx.font="50px CodeBold";
			ctx.fillText(text,game_area.canvas.width/2,game_area.canvas.height/2);
			ctx.fillStyle = "yellow";
			ctx.font="30px CodeBold";
			ctx.fillText("Your final score is "+score.value,game_area.canvas.width/2,game_area.canvas.height/2+50);
			ctx.fillStyle = "#fff";
			ctx.font="15px CodeBold";
			ctx.fillText("Press 'RESTART' to Play Again",game_area.canvas.width/2,game_area.canvas.height-10);
		}
		else
		if(text=="LEVEL") {
			ctx.fillStyle = "yellow";
			ctx.textAlign = "center";
			ctx.font="50px CodeBold";
			ctx.fillText("LEVEL "+lvl,game_area.canvas.width/2,game_area.canvas.height/2);
			ctx.fillStyle = "#fff";
			ctx.font="15px CodeBold";
			ctx.fillText("Be ready! Game will continue soon",game_area.canvas.width/2-10,game_area.canvas.height-10);
		}
		else
		if(text=="PAUSE") {
			ctx.fillStyle = "yellow";
			ctx.textAlign = "center";
			ctx.font="60px CodeBold";
			ctx.fillText("PAUSED",game_area.canvas.width/2,game_area.canvas.height/2);
			ctx.fillStyle = "#fff";
			ctx.font="15px CodeBold";
			ctx.fillText("Press 'RESUME' to continue playing.",game_area.canvas.width/2,game_area.canvas.height-10);
		}
	}
}

//Function to add rectangle to the screen (For obstacle and the grey rect. behind every message)	
function component(width, height, color, x,y) {
    this.width = width;
    this.height = height;
    this.x = x;
	this.y=y;
    this.update = function(){
        ctx = game_area.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x,this.y, this.width, this.height);
    }
}

//Function which clears the canvas and updates the frame.
function updateGameArea() {
	let count=0;								//Variable to store number of walls with which deep hasn't crashed.
	
	for(i=0;i<obstacle.length;i++) {			//Loop to check whether deep has crashed with any waal or not.
		if (deep.crash_check(obstacle[i])) {
			
		}
		else 
			++count;
    }
	
	if(count<obstacle.length) {				//If number of walls in obstacle array is greater than number of walls with which deeps hasnt collided, this means crash occured.
		deep_crash_wall=true;
	}
	else {
		deep_crash_wall=false;
	}
	
	game_area.clear();						//Clear the game area.
	
	if(deep_crash_wall) {					//If deep has crashed with wall then update deep's x-position with wall's speed(Left direction).
			deep.x-=speed_obstacle;
	}
	else
		deep.x+=speed_deep;					//Otherwise update deeps position in right direction
	
	game_area.frameNo+=1;					//Update frame number.
	
	if (game_area.frameNo == 1 || everyinterval(interval)) {		//If condition is met then a new set of walls will be added.
			x=game_area.canvas.width+40;
			minH=20;
			maxH=200;
			minGap=80;
			maxGap=100;
			height=Math.floor(Math.random()*(maxH-minH)+minH);
			gap=Math.floor(Math.random()*(maxGap-minGap)+minGap);
			obstacle.push(new component(20,height,"#E41B17",x,0));						//Add the wall
			obstacle.push(new component(20,300-height-gap,"#E41B17",x,height+gap));
			score.value+=10;															//Add the score
			if(obstacle.length==10)			//Wait till atleast 10 walls has been added or not.
				enemy=new add_enemy();													//Add the enemy
		}
	//Update each wall's x-position.	
	for(i=0;i<obstacle.length;i++) {
			obstacle[i].x-=speed_obstacle;
			obstacle[i].update();
			
	}
	
	deep.update();																		//Updates deep's position.
	
	if(enemy!=false)
		enemy.update();																	//If enemy is present then update its position.
	
	if(deep_shot!=false) {
		deep_shot.update();																//If deeps'shot is present update its position.
	}
	
	score.update();																		//Update the score.
	
	if(deep_crash_wall) {																//If deep crashed with the wall
			if(deep.x<=1) {																//And also with the back wall => Deep dies
					background_music.stop();
					game_over_sound.play();
					game_area.stop();
					let ctx=game_area.context;
					ctx.fillStyle = "#80808096";
					ctx.fillRect(0,0,800,300);
					msg=new add_text("GAME OVER");
					msg.update();
					document.getElementById("play_pause_restart").value="RESTART";
					document.getElementById("play_pause_restart").style.background="red";
					return;
				}
	}
	
	if(deep.x+deep.width>=800) {										//If deep is on the border to croos the level
		if(enemy_killed==0)												//Check whether enemy of that level has been killed or not.
			speed_deep=0										//If not killed then dont update its position further.
		else
			speed_deep=2;													
	}
	
	if(deep.x>=0&&deep.x<=800-deep.width)								//If deeps position is between the screen then updates its position.
			speed_deep=2;
		
	if((deep.x)>801) {																//If deep has crossed the level border
			deep.x=2;																//reset deep to left
			++lvl;																	//Update level.
			if(lvl>=6) {	
				winner();
				return;
			}
			interval-=15;															//Decrease the interval at which wall is being added.
			show_level();
			speed_obstacle+=1;
			obstacle.splice(0,obstacle.length);										//Clear the obstacle array to add new obstacle freshley for a new level.
			enemy_killed=0;															//Restore back that enemy is not killed.
	}
}

//Function to take action according to value of the button.
function takeaction(value) {					
	if(value=="PAUSE" || value=="pause") {
		game_area.canvas.removeEventListener("mousemove", mouseMoveHandler, false);
		game_area.canvas.removeEventListener("click", mouseFire, false);
		background_music.stop();
		pause_menu_sound.play();
		game_area.stop();
		let ctx=game_area.context;
		ctx.fillStyle = "#80808096";
		ctx.fillRect(0,0,800,300);
		pause_menu=new add_text("PAUSE");
		pause_menu.update();
		document.getElementById("play_pause_restart").value="RESUME";
		document.getElementById("play_pause_restart").style.background="#13b300";
	}
	else
	if(value=="RESUME" || value=="resume") {
		game_area.canvas.addEventListener("mousemove", mouseMoveHandler, false);
		game_area.canvas.addEventListener("click", mouseFire, false);
		background_music.play();
		pause_menu_sound.stop();
		game_area.resume();
		document.getElementById("play_pause_restart").value="PAUSE";
		document.getElementById("play_pause_restart").style.background="#1589FF";
	}
	else
	if(value=="RESTART" || value=="restart") {													//Reset all game data.
		 score.value=0;
		 lvl=1;
		 game_over_sound.stop();
		 game_area.clear();
		 enemy=false;
		 deep.x=2;
		 deep.y=150;
		 interval=90;	
		 speed_obstacle=2;
		 obstacle.splice(0,obstacle.length);
		 enemy_kill_count=0;
		 enemy_killed=0;	
		 deep_shot=false;
		 start_game();
		 document.getElementById("play_pause_restart").value="PAUSE";
		 document.getElementById("play_pause_restart").style.background="#1589FF";
	}
}
    
//Function to skip rules and start game.
function skip_rules() {															
	document.getElementById("rules_container").style.display="none";
	document.getElementById("canvas_container").style.display="block";
	document.getElementById("options_container").style.display="block";
	start_game();
}

//Function to start game and also to check whether user has checked  "dont show the instruction" or not.
function check_checkbox_start_game() {
	if(document.getElementById("check_instruction").checked) 
		show_rules=0;
	else
		show_rules=1;
	localStorage.setItem("Maze_trouble_show_inst",show_rules);
	skip_rules();
}

function clear_data() {
	if(confirm("Are you sure want to delete all game data.?")) { 
		localStorage.removeItem("Maze_trouble_show_inst");
		alert("All game data deleted");
	}
	else
		alert("Aborted!!!");
}

