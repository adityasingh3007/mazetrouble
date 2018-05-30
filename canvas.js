let player_name="";
let obstacle=[];
let score;
let msg;
let pause_menu;

function user_input(id) {
	let value=document.getElementById(id).value;
	if(value!="")
		document.getElementById("input_caption").style.height="15px";
	else
	if(value=="")
		document.getElementById("input_caption").style.height="0px";
}

function initiallize() {
	document.getElementById("loading").style.display="none";
	document.getElementById("welcome_screen_container").style.display="none";
	document.getElementById("game_container").style.display="block";
	document.getElementById("player_name_cont").innerHTML=player_name;
	start_game();
}
function submit_game_data() {
	let value=document.getElementById("ui_text").value;
	if(value!="") {
		player_name=value;
		document.getElementById("error_container").style.display="none";
		document.getElementById("user_input_panel").style.display="none";
		document.getElementById("loading").style.display="block";
		setTimeout(initiallize,2000);
		
	}
	else
	if(value=="") {
		document.getElementById("error_container").style.display="block";
		document.getElementById("ui_text").focus();
	}
}

function start_game() {
	game_area.start();
	deep.update();
	score=new add_text("score");
}
let  game_area = {
	canvas: document.getElementById("game_canvas"),
	start: function() {
		this.canvas.width=800;
		this.canvas.height=300;
		this.canvas.style.background="url('./bg_img.png')";
		this.canvas.style.backgroundRepeatx="no-repeat";
		this.canvas.style.borderRadius="5px";
		this.context=this.canvas.getContext("2d"),
		this.canvas.addEventListener("mousemove", mouseMoveHandler, false);
		this.frameNo=0;		
		this.interval = setInterval(updateGameArea, 33);
	},
	clear : function() {														
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},
	stop : function() {
        clearInterval(this.interval);
    },
	resume: function() {
		this.interval = setInterval(updateGameArea, 33);
	}
}

function everyinterval(n) {
    if ((game_area.frameNo / n) % 1 == 0) {
		return true;
	}
    return false;
}

let deep = {
	x:25,
	y:150,
	radius:20,
	update:function() {
		ctx=game_area.context;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2,true);
		ctx.fillStyle = "#FFD801";
		ctx.fill();
		ctx.closePath();
	},
	crash_check:function(obj) {
		let myleft_x=this.x-this.radius;
		let myright_x=this.x+this.radius;
		let mytop_y=this.y-this.radius;
		let mybottom_y=this.y+this.radius;
		let otherleft_x=obj.x;
		let otherright_x=obj.x+obj.width;
		let othertop_y=obj.y;
		let otherbottom_y=obj.y+obj.height;
		let crash=true;
		if ((mybottom_y < othertop_y) || (mytop_y > otherbottom_y) ||  (myright_x < otherleft_x) || (myleft_x > otherright_x)) {
				crash = false;
        }
		return crash;
	}
}

function mouseMoveHandler(e) {
	let rect=game_area.canvas.getBoundingClientRect();
	deep.x=e.clientX-rect.left;
	deep.y=e.clientY-rect.top;
	if(deep.x-20<0)
		deep.x=21;
	if(deep.y-20<0)
		deep.y=21;
	if(deep.x+20>800)
		deep.x=779;
	if(deep.y+20>300)
		deep.y=279;
	
  }

function add_text(text) {
	this.value=0;
	this.update=function() {
		ctx=game_area.context;
		if(text=="score") {
			ctx.fillStyle = "#fff";
			ctx.textAlign = "center";
			ctx.font="20px CodeBold";
			ctx.fillText("SCORE: "+this.value,game_area.canvas.width/2,20);
		}
		else
		if(text=="GAME OVER") {
			ctx.fillStyle = "yellow";
			ctx.textAlign = "center";
			ctx.font="50px CodeBold";
			ctx.fillText(text,game_area.canvas.width/2,game_area.canvas.height/2);
			ctx.font="30px CodeBold";
			ctx.fillText("Your final score is "+score.value,game_area.canvas.width/2,game_area.canvas.height/2+50);
			ctx.fillStyle = "#fff";
			ctx.font="15px CodeBold";
			ctx.fillText("Press 'RESATART' to Play Again",game_area.canvas.width/2,game_area.canvas.height-10);
		}
		else
		if(text=="PAUSE") {
			ctx.fillStyle = "yellow";
			ctx.textAlign = "center";
			ctx.font="60px CodeBold";
			ctx.fillText("PAUSED",game_area.canvas.width/2,game_area.canvas.height/2);
			ctx.fillStyle = "#fff";
			ctx.font="15px CodeBold";
			ctx.fillText("Press 'RESUME' to continu playing.",game_area.canvas.width/2,game_area.canvas.height-10);
		}
	}
}
	
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


function updateGameArea() {
	for(i=0;i<obstacle.length;i++) {
		if (deep.crash_check(obstacle[i])) {
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
		game_area.clear();
		deep.update();
		game_area.frameNo+=1;
		if (game_area.frameNo == 1 || everyinterval(90)) {
			x=game_area.canvas.width;
			minH=20;
			maxH=230;
			minGap=60;
			maxGap=70;
			height=Math.floor(Math.random()*(maxH-minH)+minH);
			gap=Math.floor(Math.random()*(maxGap-minGap)+minGap);
			obstacle.push(new component(20,height,"#E41B17",x,0));
			obstacle.push(new component(20,300-height-gap,"#E41B17",x,height+gap));
			score.value+=10;
		}
		for(i=0;i<obstacle.length;i++) {
			obstacle[i].x-=2;
			obstacle[i].update();
		}
		score.update();
}

function takeaction(value) {
	if(value=="PAUSE" || value=="pause") {
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
		game_area.resume();
		document.getElementById("play_pause_restart").value="PAUSE";
		document.getElementById("play_pause_restart").style.background="#1589FF";
	}
	else
	if(value=="RESTART" || value=="restart") {
		 window.location.reload();
	}
}
    