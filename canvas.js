var player_name="";

function user_input(id) {
	var value=document.getElementById(id).value;
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
	
}
function submit_game_data() {
	var value=document.getElementById("ui_text").value;
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
}
var  game_area = {
	canvas: document.getElementById("game_canvas"),
	start: function() {
		this.canvas.width=800;
		this.canvas.height=300;
		this.canvas.style.background="url('./bg_img.png')";
		this.canvas.style.backgroundRepeatx="no-repeat";
		this.context=this.canvas.getContext("2d"),
		this.interval = setInterval(updateGameArea, 33);
	},
	clear : function() {														
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
}

var deep = {
	x:100,
	y:100,
	radius:10,
	update:function() {
		ctx=game_area.context;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2,true);
		ctx.fillStyle = "blue";
		ctx.fill();
		ctx.closePath();
  }
}

game_area.canvas.addEventListener("mousemove", mouseMoveHandler, false);		
function mouseMoveHandler(e) {
	var rect=game_area.canvas.getBoundingClientRect();
	deep.x=e.clientX-rect.left;
	deep.y=e.clientY-rect.top;
  }
function updateGameArea() {
    game_area.clear();
	deep.update();
}