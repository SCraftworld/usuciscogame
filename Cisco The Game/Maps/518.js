(function(){
var id = '518';
maps[id] = {
	"id": id,
	"name": "518",
	"w":10,
	"h":10,
	"startPos":[1,4],
	"startDir":[1,0],
	"walls":{"w":{"directed":false}},
	"doors":{
		"mainDoor":{"dst":{"descr":"Дверь в коридор 5 этажа","map":"5floor","i":8,"j":5},"class":"cavedoor","i":0,"j":4,"locked":true,"key":"518_key"},
		"w1":{"dst":{"descr":"Окно на улицу","map":"street-cornice5","i":1,"j":21},"class":"window0","i":9,"j":1,"locked":true,"key":"518_key"},
		"w2":{"dst":{"descr":"Окно на улицу","map":"street-cornice5","i":1,"j":22},"class":"window0","i":9,"j":2,"locked":true,"key":"518_key"},
		"w3":{"dst":{"descr":"Окно на улицу","map":"street-cornice5","i":1,"j":23},"class":"window0","i":9,"j":3,"locked":true,"key":"518_key"},
		"w6":{"dst":{"descr":"Окно на улицу","map":"street-cornice5","i":1,"j":26},"class":"window0","i":9,"j":6,"locked":true,"key":"518_key"},
		"w7":{"dst":{"descr":"Окно на улицу","map":"street-cornice5","i":1,"j":27},"class":"window0","i":9,"j":7,"locked":true,"key":"518_key"},
		"w8":{"dst":{"descr":"Окно на улицу","map":"street-cornice5","i":1,"j":28},"class":"window0","i":9,"j":8,"locked":true,"key":"518_key"}
	},
	"styles":{
		"w":{"background-color":"LightGrey","background-image":"url(mario.png)"},
		" ":{"background-color":"LightGrey","background-image":"url(floor.png)"}
	},
	"items":[
		{"class":"window0","i":9,"j":4},
		{"class":"window0","i":9,"j":5},
		{"class":"extinguisher","i":1,"j":1,"id":"fireex"},
		{"class":"as5800","i":2,"j":1,"id":"as5800"},
		{"class":"compleft","i":3,"j":1},
		{"class":"compleft","i":4,"j":1},
		{"class":"compleft","i":5,"j":1},
		{"class":"compleft","i":6,"j":1},
		{"class":"compleft","i":7,"j":1},
		{"class":"compdown","active":true,"dialog":"takeQuiz","i":3,"j":8,"id":"instructor","hint":"Сесть за компьютер преподавателя"},
		{"class":"teachdesk2","i":3,"j":7},
		{"class":"teachdesk1","i":2,"j":7,"prior":0},
		{"class":"cert","i":2,"j":7,"prior":1,"id":"cert"},
		{"class":"compright","i":4,"j":8},
		{"class":"compright","i":5,"j":8,"prior":0},
		{"class":"loop","i":5,"j":8,"prior":1,"hint":"Дёрнуть локальную петлю","active":true,"action":"curse"},
		{"class":"compright","i":6,"j":8},
		{"class":"compright","i":7,"j":8},
		{"class":"whiteboard","action":"watchTopology","hint":"Посмотреть на доску","i":8,"j":5,"id":"whiteboard"},
		{"class":"compdown","i":8,"j":4},
		{"class":"compright","i":4,"j":4},
		{"class":"compright","i":5,"j":4},
		{"class":"compleft","i":4,"j":5},
		{"class":"compleft","i":5,"j":5},
		{"class":"rack","active":false,"action":"fixRack","i":1,"j":5,"id":"rack","hint":"Прибрать стойку"},
		{"class":"crossbox","action":"takeCross","hint":"Взять кроссовый патч-корд","i":3,"j":5},
		{"class":"straightbox","action":"takeStraight","hint":"Взять прямой патч-корд","i":3,"j":4}
	],
	"dialogs":{
		"takeQuiz":{
			"start":"38",
			"person":["instructor","Финальный тест, 38 вопрос"],
			"data":{
				"38":{
					"txt":"Как отличить человека от маршрутизатора?",
					"ch":[
						["У человека меньше лампочек","39"],
						["Маршрутизатор может выполнять полезную работу","39"],
						["Маршрутизатор можно выдернуть из сети, не нарушив УК","39"],
						["Никак. Данные понятия взаимозаменяемы","39"]
					]
				},
				"39":{
					"txt":"Какой тип кабеля наиболее подходит для прокладывания межгалактических сетей?",
					"person":["instructor","Финальный тест, 39 вопрос"],
					"ch":[
						["Serial","40"],
						["Serial","40"],
						["Serial","40"],
						["Serial","40"]
					]
				},
				"40":{
					"txt":"Что может изменить природу человека?",
					"person":["instructor","Финальный тест, 40 вопрос"],
					"ch":[
						['Понимание Frame Relay','fin'],
						['Топор','fin'],
						['Использование Netspace','fin'],
						['Час настройки 2500 маршрутизатора','fin']
					]
				},
				"fin":{
					"txt":"Завершить тестирование?",
					"person":["instructor","Финальный тест"],
					"ch":[
						["Да","end"],
						["Нет","38"]
					]
				},
				"end":{
					"txt":"Тестирование завершено.<br/>Оценка 70/100.<br/>Взвешенная оценка 68/100.",
					"person":["instructor","Тестирование завершено"],
					"ch":[
						["Закрыть",null]
					]
				}
			}
		}
	},
	"actions":{
		"fixRack": function()
		{
			storage['mini_fixRack'] = storage['mini_fixRack'] || {};
			var lstor = storage['mini_fixRack'];
			if (!lstor.c || !lstor.d)
			{
				lstor['c'] = [];
				lstor['d'] = [];
				var d = lstor.d;
				for (var i = 0; i < 4; ++i)
					d[i] = [];
				for (var i = 0; i < 4; ++i)
				{
					for (var j = 0; j < 10; ++j)
					{
						var p1 = Math.floor(24*Math.random())%22;
						var s2 = Math.floor(4*Math.random())%4;
						var p2 = Math.floor(24*Math.random())%22;
						if ((p1!=p2 || i!=s2) && !d[i][p1] && !d[s2][p2])
						{
							var cross = Math.random()>0.8?false:true;
							var point1 = {'s':i,'p':p1};
							var point2 = {'s':s2,'p':p2};
							d[i][p1] = {'to':point2,'cross':cross};
							d[s2][p2] = {'to':point1,'cross':cross};
							lstor.c.push([point1,point2,cross]);
						}
					}
				}
			}
			initMinigameField({'html':'<div><img id="selectStraight" src="straight-i.png"/><span style="position:relative;bottom:25px;margin:0px 140px 0px -95px;" id="straightCount"></span><img id="selectCross" src="cross-i.png"/><span style="position:relative;bottom:25px;margin:0px 140px 0px -15px;" id="crossCount"></span></div><div style="position:relative;"><canvas id="fixRackCanvas" width="800px" height="600px" style="position:relative;top:0px;left:0px;"></canvas><canvas id="middleRackCanvas" width="800px" height="600px" style="position:absolute;top:0px;left:0px;"></canvas><canvas id="frontRackCanvas" width="800px" height="600px" style="position:absolute;top:0px;left:0px;"></canvas></div>','css':{'width':'800px'},'canClose':true,'onClose':function(){window.clearInterval(pingInt);}});
			var c = $('#fixRackCanvas')[0].getContext('2d');
			var m = $('#middleRackCanvas')[0].getContext('2d');
			var f = $('#frontRackCanvas')[0].getContext('2d');
			var drawSwitchBase = function(no)
			{
				c.fillStyle = "#3B6983";
				c.fillRect(20,20+140*no,780,120);
			};
			var drawSwitch = function(no)
			{
				drawSwitchBase(no);
				for (var i = 0; i < 22; ++i)
					drawPort(no,i);
			};
			var getPortCoords = function(sNo,cNo)
			{
				if (cNo<20)
					if (cNo%2==1)
						return {'t':20+140*sNo+65,'l':(80+Math.floor(cNo/2)*45),'r':true};
					else
						return {'t':20+140*sNo+30,'l':(80+Math.floor(cNo/2)*45),'r':false};
				else
					return {'t':20+140*sNo+45,'l':(660+(cNo-20)*45),'r':false};
			};
			var drawLamp = function(cc,left)
			{
				c.fillRect((cc.l + ((!left)?23:2)),(cc.t + (cc.r?20:2)),4,3);
			};
			var drawInactiveLamps = function(sNo,cNo)
			{
				var cc = getPortCoords(sNo,cNo);
				c.fillStyle = "DarkGrey";
				drawLamp(cc,!cc.r);
				drawLamp(cc,cc.r);
			};
			var drawBadLamps = function(sNo,cNo)
			{
				var cc = getPortCoords(sNo,cNo);
				c.fillStyle = "DarkGrey";
				drawLamp(cc,!cc.r);
				c.fillStyle = "Red";
				drawLamp(cc,cc.r);
			};
			var drawGoodLamps = function(sNo,cNo)
			{
				var cc = getPortCoords(sNo,cNo);
				c.fillStyle = "Green";
				drawLamp(cc,!cc.r);
				c.fillStyle = "DarkGrey";
				drawLamp(cc,cc.r);
			};
			var drawPort = function(sNo,cNo)
			{
				var sTop = 20+140*sNo;
				var cc = getPortCoords(sNo,cNo);
				c.fillStyle = "LightGrey";
				c.fillRect(cc.l,cc.t,29,25);
				c.fillStyle = "Black";
				if (!cc.r)
				{
					c.fillRect(cc.l+2,cc.t+11,25,12);
					c.fillRect(cc.l+7,cc.t+7,15,4);
					c.fillRect(cc.l+11,cc.t+2,7,5);
					c.fillStyle = "Gold";
					for (var i = 0; i < 8; i++)
						c.fillRect(cc.l+7+i*2,cc.t+18,1,5);
				} else
				{
					c.fillRect(cc.l+2,cc.t+2,25,12);
					c.fillRect(cc.l+7,cc.t+14,15,4);
					c.fillRect(cc.l+11,cc.t+18,7,5);
					c.fillStyle = "Gold";
					for (var i = 0; i < 8; i++)
						c.fillRect(cc.l+7+i*2,cc.t+2,1,5);
				}
				drawInactiveLamps(sNo,cNo);
			};
			var drawConnector = function(sNo,cNo,cross)
			{
				var sTop = 20+140*sNo;
				var cc = getPortCoords(sNo,cNo);
				m.fillStyle = cross?"#FB8432":"#00395F";
				if (!cc.r)
				{
					m.fillRect(cc.l+2,cc.t+7,25,16);
					m.beginPath();
					m.arc(cc.l+15,cc.t+7,7,0,2*Math.PI);
					m.fill();
				} else
				{
					m.fillRect(cc.l+2,cc.t+2,25,16);
					m.beginPath();
					m.arc(cc.l+15,cc.t+18,7,0,2*Math.PI);
					m.fill();
				}
			};
			var getPortByCoords = function(h,w)
			{
				var sNo = Math.floor((h-20)/140);
				var t1 = h - sNo*140 - 20;
				if (h<20 || t1<30)
					return null;
				var nr = (w - 80)/45;
				if (nr > 10)
				{
					if (t1>=45&&t1<=70)
					{
						if (w>660&&w<690)
							return {'s':sNo,'p':20};
						if (w>660+45&&w<660+75)
							return {'s':sNo,'p':21};
					}
				} else if (nr>=0)
				{
					var r = (w-80)%45;
					if (r>0 && r < 30){
						if (t1>30&&t1<55)
						{
							return {'s':sNo,'p':Math.floor(nr)*2};
						} else
						if (t1>65&&t1<90)
						{
							return {'s':sNo,'p':1+Math.floor(nr)*2};
						}
					}
				}
				return null;
			};
			var firstPoint;
			var isCurCross;
			var drawCableAndConn = function(pd1,pd2,cross)
			{
				drawConnector(pd1.s,pd1.p,cross);
				drawConnector(pd2.s,pd2.p,cross);
				drawCable(pd1,pd2);
				drawInactiveLamps(pd1.s,pd1.p);
				drawInactiveLamps(pd2.s,pd2.p);
			};
			var drawCable = function(p1,p2)
			{
				if (!p1.l || !p1.t || !p2.l || !p2.t)
				{
					var p = getPortCoords(p1.s,p1.p);
					p1.l = p.l;
					p1.t = p.t;
					p = getPortCoords(p2.s,p2.p);
					p2.l = p.l;
					p2.t = p.t;
				}
				var t1 = p1.l+15;
				var t2 = p1.t+15;
				var t3 = p2.l+15;
				var t4 = p2.t+15;
				f.beginPath();
				f.moveTo(t1,t2);
				f.bezierCurveTo(t3,t2,t1,t4,t3,t4);
				f.lineCap = "round";
				f.strokeStyle = "Black";
				f.lineWidth = 6;
				f.stroke();
				f.strokeStyle = "White"
				f.lineWidth = 4;
				f.stroke();
			};
			var onClick = function(h,w)
			{
				var port = getPortByCoords(h,w);
				if (!port)
					return;
				var point = getPortCoords(port.s,port.p);
				point.s=port.s;
				point.p=port.p;
				if (lstor.d[port.s][port.p])
				{
					for (var i in lstor.c)
					{
						var cableDescr = lstor.c[i];
						if ((cableDescr[0].s==port.s && cableDescr[0].p==port.p) || (cableDescr[1].s==port.s && cableDescr[1].p==port.p))
						{
							var itemId = cableDescr[2]?"cross":"straight";
							addToInventory(inventory,createItem(itemId,itemId));
							updateCableCount();
							lstor.c.splice(i,1);
							var t = lstor.d[port.s][port.p];
							drawInactiveLamps(t.to.s,t.to.p);
							drawInactiveLamps(port.s,port.p);
							lstor.d[t.to.s][t.to.p] = null;
							lstor.d[port.s][port.p] = null;
							break;
						}
					}
					redrawFront();
					return;
				}
				if (firstPoint)
				{
					if (firstPoint.s!=point.s || firstPoint.p!=point.p)
					{
						drawConnector(port.s,port.p,isCurCross);
						drawCable(firstPoint,point);
						drawInactiveLamps(port.s,port.p);
						drawInactiveLamps(firstPoint.s,firstPoint.p);
						lstor.c.push([firstPoint,point,isCurCross]);
						lstor.d[firstPoint.s][firstPoint.p] = {'to':port,'cross':isCurCross};
						lstor.d[point.s][point.p] = {'to':{'s':firstPoint.s,'p':firstPoint.p},'cross':isCurCross};
						removeFromInventory(inventory,{'id':isCurCross?"cross":"straight"});
						updateCableCount();
						resetCableSelection();
					} else
					{
						redrawFront();
					}
					firstPoint = null;
				} else
				{
					if (isCurCross == null)
						return;
					firstPoint = point;
					drawConnector(port.s,port.p,isCurCross);
				}
			};
			var resetCableSelection = function()
			{
				isCurCross = null;
				$('#selectCross').removeClass('highlited');
				$('#selectStraight').removeClass('highlited');
			};
			var updateCableCount = function()
			{
				$('#crossCount').html(getCountFromInventory(inventory,'cross'));
				$('#straightCount').html(getCountFromInventory(inventory,'straight'));
			};
			var redrawFront = function()
			{
				m.clearRect(0,0,800,600);
				f.clearRect(0,0,800,600);
				var s = lstor.c;
				for (var i in s)
					drawCableAndConn.apply(this,s[i]);
			};
			c.fillStyle = "White";
			c.fillRect(0,0,800,600);
			for (var i = 0; i < 4; ++i)
				drawSwitch(i);
			$('#frontRackCanvas').on('click',function(e){
				onClick(e.offsetY,e.offsetX);
			});
			var getOnClick = function(cross)
			{
				var name = cross?"cross":"straight";
				return function(e)
				{
					if (firstPoint || !getCountFromInventory(inventory,name)) return;
					if (isCurCross===!cross)
					{
						$(cross?'#selectStraight':'#selectCross').removeClass('highlited');
					}
					if (isCurCross===cross)
					{
						isCurCross = null;
						$(e.target).removeClass('highlited');
						return;
					}
					isCurCross=cross;
					$(e.target).addClass('highlited');
				};
			};
			$('#selectCross').on('click',getOnClick(true));
			$('#selectStraight').on('click',getOnClick(false));
			redrawFront();
			updateCableCount();
			var goodPorts = [];
			var sendPing = function(s1,s2,excl)
			{
				excl = excl || [];
				var ex = excl.slice(0,excl.length);
				ex[s1] = true;
				var pathsCount = [0,0,0,0];
				var lastPorts = [];
				for (var i in lstor.d[s1])
				{
					var port = lstor.d[s1][i];
					if (port)
					{
						if (port.cross)
						{
							var ts = port.to.s;
							pathsCount[ts]+=1;
							lastPorts[ts]=i;
						}
					}
				}
				var result = (pathsCount[s2] == 1);
				for (var i in pathsCount)
				{
					if (pathsCount[i] == 1)
					{
						var port = lstor.d[s1][lastPorts[i]];
						drawGoodLamps(s1,lastPorts[i]);
						drawGoodLamps(port.to.s,port.to.p);
						goodPorts[s1][lastPorts[i]]=true;
						goodPorts[port.to.s][port.to.p]=true;
						if (!result && !ex[i])
							result = sendPing(i,s2,ex);
					}
				}
				return result;
			};
			var checkCycles = function(a)
			{
				var visited = [];
				var marked = {};
				var st = [];
				for (var i in a)
				{
					for (var j in a[i])
					{
						marked[i+' '+j] = true;
						var port = lstor.d[i][j].to;
						marked[port.s+' '+port.p] = true;
						st.push([i,j]);
					}
					visited[i] = true;
					break;
				}
				while (st.length)
				{
					var edge = st.pop();
					var port = lstor.d[edge[0]][edge[1]];
					var ds = port.to.s;
					if (visited[ds])
						return false;
					visited[ds] = true;
					for (var i in a[ds])
					{
						if (!marked[ds+' '+i])
						{
							st.push([ds,i]);
							marked[ds+' '+i] = true;
							var otherEnd = lstor.d[ds][i].to;
							marked[otherEnd.s+' '+otherEnd.p] = true;
						}
					}
				}
				return true;
			};
			var pingInt = window.setInterval(function(){
				var res = true;
				for (var i = 0; i < 4; ++i)
				{
					goodPorts[i] = [];
					for (var j = 0; j < 22; ++j)
						if (lstor.d[i][j])
							drawBadLamps(i,j);
				}
				for (var i = 0; i < 4; ++i)
					for (var j = i + 1; j < 4; ++j)
						res = res && sendPing(i,j);
				for (var i = 0; i < 4 && res; ++i)
					for (var j = 0; j < 22; ++j)
						if (lstor.d[i][j] && !goodPorts[i][j])
						{
							res = false;
							break;
						}
				res = res && checkCycles(goodPorts);
				if (res)
				{
					window.clearInterval(pingInt);
					var rack = getItem('rack');
					getItemContainer(rack).removeClass('rack').addClass('rackfix');
					rack['class'] = "rackfix";
					rack.hint = null;
					showMessage("Успех!");
					addStatusEntry("Стойка приведена в порядок!");
					rack.active = false;
					triggerEvent("minigameFinish",{"id":"rackFix","result":"success"});
					window.setTimeout(function(){window.closeMinigame();},5000);
				}
			},5000);
		},
		"takeCross": function()
		{
			addToInventory(inventory,createItem('cross','cross'));
		},
		"takeStraight": function()
		{
			addToInventory(inventory,createItem('straight','straight'));
		},
		"watchTopology": function()
		{
			initMinigameField({'html':'<img src="whiteboard-big.png" style="border:1px solid Black"></img><p>Хм... Кто-то опять не успел доделать лабораторную.</p>','css':{'width':'202px'},'canClose':true});
		},
		"curse": function()
		{
			pause();
			$('#anticlick').hide();
			$('<div id="ball-curses"/>').appendTo($('#field'));
			for (var i = 0; i < 402/30; ++i)
				for (var j = 0; j < 402/30; ++j)
					$('<div class="ball-curse'+(Math.random()*5>1?'-empty':'')+'"/>').appendTo($('#ball-curses')).css({'left':i*30+'px','top':j*30+'px'});
			$('<div id="ball"/>').appendTo($('#field')).css({'position':'absolute','width':'60px','height':'60px','z-index':1000001,'background-image':'url(ball-cursed.png)','background-repeat':'no-repeat','background-position':'0px -60px','left':'171px','top':'171px'}).animate({'background-position-y':'0px'},{'duration':1500,'complete':function(){
				$('#ball-curses').show().animate({'transform':'rotate(750deg)'},{'duration':10000,'queue':false});
				$('.ball-curse').animate({'transform':'rotate(9000deg)'},{'duration':10000,'queue':false,'complete':function(){
					$('#ball-curses').remove();
					$('#ball').animate({'background-position-y':'-60px'},{'duration':1500,'complete':function(){
						$('#ball').remove();
						resume();
					}});
				}});
			}});
		}
	}
};
var data;
data  = "wwwwwwwwww";
data += "w        w";
data += "w        w";
data += "w        w";
data += "w        w";
data += "w        w";
data += "w        w";
data += "w        w";
data += "w        w";
data += "wwwwwwwwww";
maps[id].data = [];
for (var i = 0; i < 10; ++i)
	maps[id].data[i] = data.substr(i*10, 10).split('');
maps[id].onStart = function()
{
	var openWindowHook = function(en,ei)
	{
		if (ei.door["class"]=="window0")
			ei.door["class"]="openwindow0";
	};
	var door = doorsByCoords[(pos[0]+1)+' '+pos[1]];
	if (door && door["class"]=="window0")
	{
		door["class"]="openwindow0";
		jqField[door.i][door.j].find('.door').removeClass('window0').addClass('openwindow0');
	}
	addHook("mapLeave",openWindowHook,"map");
};
})();