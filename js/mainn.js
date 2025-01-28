!(function () {
	var isDebug = false;
	var textCanvas = document.createElement("canvas");
	textCanvas.width=1000;
	textCanvas.height=300;
	if(isDebug){
		textCanvas.style.position="absolute";
		textCanvas.style.zIndex="9999";
		document.body.appendChild(textCanvas);
	}
	var textctx = textCanvas.getContext("2d");
	textctx.fillStyle = "#000000";
	textctx.fillRect(0,0,textCanvas.width,textCanvas.height);

	var canvas = document.createElement("canvas");
	document.body.appendChild(canvas);
	
	canvas.style.position= "fixed";
	canvas.style.left = "0";
	canvas.style.top = "0";
	canvas.style.zIndex = -1;

	var context = canvas.getContext("2d");

	function resizeCanvas() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		clearCanvas();
	}

	function clearCanvas() {
		context.fillStyle = "#000000";
		context.fillRect(0, 0, canvas.width, canvas.height);
	}

	resizeCanvas();
	window.addEventListener("resize", resizeCanvas);


	function mouseDownHandler(e) {
		var x = e.clientX;
		var y = e.clientY;
		createFireworks(x, y,['福蛇贺岁', '吉蛇迎春', '万事如意', '开开心心', '蛇年大吉', '平安喜乐', '瑞蛇呈祥', '快快乐乐', '心想事成', '万事如意', '喜乐无忧', '好运每日'][Math.floor(Math.random()*12)]);
	}
	document.addEventListener("mousedown", mouseDownHandler);

	var particles = [];

	function createFireworks(x, y,text="") {

		var hue = Math.random() * 360;
		var hueVariance = 30;

		function setupColors(p){
			p.hue = Math.floor(Math.random() * ((hue + hueVariance) - (hue - hueVariance))) + (hue - hueVariance);
			p.brightness = Math.floor(Math.random() * 21) + 50;
			p.alpha = (Math.floor(Math.random() * 61) + 40) / 100;
		}

		if(text!=""){
			
			var gap = 6;
			var fontSize = 120;

			textctx.font=fontSize+"px _sans";
			textctx.fillStyle = "#ffffff";
			
			var textWidth = Math.ceil(textctx.measureText(text).width);
			var textHeight = Math.ceil(fontSize*1.2);

			textctx.fillText(text,0,fontSize);
			var imgData = textctx.getImageData(0,0,textWidth,textHeight);

			if(isDebug)context.putImageData(imgData,400,300)
			
			textctx.fillStyle = "#000000";
			textctx.fillRect(0,0,textCanvas.width,textCanvas.height);

			for (var h = 0; h < textHeight; h+=gap) {
			    for(var w = 0; w < textWidth; w+=gap){
			            var position = (textWidth * h + w) * 4;
			            var r = imgData.data[position], g = imgData.data[position + 1], b = imgData.data[position + 2], a = imgData.data[position + 3];
			    
			    		if(r+g+b==0)continue;
			            var p = {};
						p.x = x;
						p.y = y;
						p.fx = x + w - textWidth/2;
						p.fy = y + h - textHeight/2;
						p.size = Math.floor(Math.random()*2)+1;
						p.speed = 1;
						setupColors(p);
						particles.push(p);
			    }
			}
		}else{
			var count = 100;
			for (var i = 0; i < count; i++) {
				var angle = 360 / count * i;
				var radians = angle * Math.PI / 180;
				var p = {};

				p.x = x;
				p.y = y;
				p.radians = radians;
				p.size = Math.random()*2+1;
				p.speed = Math.random()*5+.4;
				p.radius = Math.random()*81+50;
				p.fx = x + Math.cos(radians) * p.radius;
				p.fy = y + Math.sin(radians) * p.radius;
				setupColors(p);
				particles.push(p);
			}
		}
	}
	function drawFireworks() {
		clearCanvas();

		for (var i = 0; i < particles.length; i++) {
			var p = particles[i];
			p.x += (p.fx - p.x)/10;
			p.y += (p.fy - p.y)/10-(p.alpha-1)*p.speed;
			p.alpha -= 0.006;
			if (p.alpha<=0) {
				particles.splice(i, 1);
				continue;
			}
			context.beginPath();
			context.arc(p.x, p.y, p.size, 0, Math.PI * 2, false);
			context.closePath();
			context.fillStyle = 'hsla('+p.hue+',100%,'+p.brightness+'%,'+p.alpha+')';
			context.fill();
		}
	}
	var lastStamp = 0;
	function tick(opt=0) {
		if(opt-lastStamp>750){
			lastStamp=opt;
			createFireworks(Math.random()*canvas.width,Math.random()*canvas.height);
		}
		context.globalCompositeOperation = 'destination-out';
		context.fillStyle ='rgba(0,0,0,'+10/100+')';
		context.fillRect(0,0,canvas.width,canvas.height);
		context.globalCompositeOperation = 'lighter';
		drawFireworks();
		requestAnimationFrame(tick);
	}
	tick();
})();
// sqrt(-1) love you
