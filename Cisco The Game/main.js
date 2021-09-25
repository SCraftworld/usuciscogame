var debug = true;
function makeFullScreen(jqElem)
{
	var w = $(window).width()-parseInt(jqElem.css('padding-left'))-parseInt(jqElem.css('padding-right'))-jqElem.outerWidth(true)+jqElem.innerWidth();
	var h = $(window).height()-parseInt(jqElem.css('padding-top'))-parseInt(jqElem.css('padding-bottom'))-jqElem.outerHeight(true)+jqElem.innerHeight();
	jqElem.width(w).height(h);
}
function makeCentered(jqElem)
{
	var l = ($(window).width()-jqElem.outerWidth(true))/2;
	if (l < 0)
		l = 0;
	var t = ($(window).height()-jqElem.outerHeight(true))/2;
	if (t < 0)
		t = 0;
	jqElem.css({'left':l+"px","top":t+"px"});
}
$(window).on('resize',function(){
	makeFullScreen($('.fullscreen').filter(':visible'));
	makeCentered($('.centerscreen').filter(':visible'));
});
var storage = {};
var timers = {'auto':{},'timeout':{},'interval':{}};
var mission;
var map;
var jqField = [];
var itemsByCoords = [];
var itemsById = {};
var doorsByCoords = {};
var access = [];
var usedAnimations = [];
var npcActions = {};
var npcMoves = {};
var npcActionsLocks = {};
var npcByCoords = {};
var jqPlayer;
var log = {};
var activeQuest;
function getItemProperty(item, prop)
{
	if (item[prop] != null)
		return item[prop];
	if (item.class && itemsClasses[item.class] && itemsClasses[item.class][prop] != null)
		return itemsClasses[item.class][prop];
	return null;
}
function isAllowed(item, attrName)
{
	return (item[attrName] || (item[attrName]!==false && item.class && itemsClasses[item.class] && itemsClasses[item.class][attrName]));
}
function getItemDescription(item)
{
	if (item.descr && item.name)
		return item;
	if (item.id && itemsDescriptions[item.id])
		return itemsDescriptions[item.id];
	return null;
}
var screenTopLeftCache = [];
var previousTopLeftPos = [];
function getScreenTopLeft(plPos)
{
	var pp = plPos || pos;
	if (previousTopLeftPos.length && previousTopLeftPos[0]==pp[0] && previousTopLeftPos[1]==pp[1])
		return screenTopLeftCache;
	var t = (map.h-pp[0]<Math.floor(screen.h/2))?map.h-screen.h:pp[0]-Math.min(Math.ceil(screen.h/2),pp[0]);
	var l = (map.w-pp[1]<Math.floor(screen.w/2))?map.w-screen.w:pp[1]-Math.min(Math.ceil(screen.w/2),pp[1]);
	previousTopLeftPos = pp;
	screenTopLeftCache = [t,l];
	return [t,l];
}
function getRelativePos(absPos,playerPos)
{
	var tl = getScreenTopLeft(playerPos);
	return [absPos[0]-tl[0],absPos[1]-tl[1]];
}
function getScreenLine(h,w,vert)
{
	var res = [];
	if (vert)
		for (var i = h; i < h + screen.h && i < map.h; ++i)
			res.push(jqField[i][w].find('*').andSelf());
	else
		for (var j = w; j < w + screen.w && j < map.w; ++j)
			res.push(jqField[h][j].find('*').andSelf());
	return res;
}
function getInnerFrame(t,l)
{
	return getScreenLine(t,l+screen.w-1,true).concat(getScreenLine(t,l,true)).concat(getScreenLine(t,l,false)).concat(getScreenLine(t+screen.h-1,l,false));
}
function getOuterFrame(t,l)
{
	return (t>0?getScreenLine(t-1,l,false):[]).concat((l>0?getScreenLine(t,l-1,true):[])).concat((l+screen.w<map.w?getScreenLine(t,l+screen.w,true):[])).concat((t+screen.h<map.h?getScreenLine(t+screen.h,l,false):[]));
}
function cropScreen(initial)
{
	var tl = getScreenTopLeft();
	var l = tl[1];
	var t = tl[0];
	if (initial)
	{
		for (var j = 0; j < map.w; ++j)
		{
			for (var i = 0; i < t; ++i)
				jqField[i][j].hide();
			for (var i = t + screen.h; i < map.h; ++i)
				jqField[i][j].hide();
		}
		for (var i = t; i < t + screen.h && i < map.h; ++i)
		{
			for (var j = 0; j < l; ++j)
				jqField[i][j].hide();
			for (var j = l + screen.w; j < map.w; ++j)
				jqField[i][j].hide();
		}
	}
	else
	{
		var toShow = getInnerFrame(t,l);
		var toHide = getOuterFrame(t,l);
		$.each(toShow,function(i,v){v.show();});
		$.each(toHide,function(i,v){v.hide();});
	}
}
function initMap(mapId, startPos)
{
	clearHooksScope("map");
	controlLock = true;
	$('#ahead').html('');
	var loaderReady = false;
	var mapReady = false;
	var onReady = function()
	{
		if (!loaderReady || !mapReady)
			return;
		$('#load-screen').hide();
		$('#field').show();
		setAhead();
		controlLock = false;
		if (map.onStart)
			map.onStart();
		triggerEvent("mapStarted", {"map":mapId});
	};
	$('#load-screen').html('<div id="load-image-wrapper"><img id="load-image" src="loadScreen.gif"/></div>');
	window.setTimeout(function(){loaderReady=true;onReady();},2500);
	$('#field').hide();
	$('#load-screen').show();
	var initMapData = function()
	{
		itemsByCoords = [];
		doorsByCoords = {};
		npcByCoords = {};
		access = [];
		usedAnimations = [];
		npcActions = {};
		npcMoves = {};
		moveQueue = [];
		previousTopLeftPos = [];
		playerMoveTime = map.playerMoveTime || 40;
		playerMoveDelay = map.playerMoveDelay || 0;
		playerStep = map.playerStepLength || 4;
		if (tile.w%playerStep!=0 || tile.h%playerStep!=0)
			invokeError('Длина шага игрока должна быть кратна измерениям клетки');
		for (var i = 0; i < map.h; ++i)
		{
			access.push([]);
			for (var j = 0; j < map.w; ++j)
				access[i].push(!map.walls[map.data[i][j]]);
		}
	};
	var initField = function()
	{
		var ft = $('<div class="main-table"/>').width(map.w*tile.w).height(map.h*tile.h);
		jqField = [];
		var setWall = function(jElem, i, j)
		{
			var liter = map.data[i][j];
			if (map.walls[liter].directed)
			{
				var imgUrl = "";
				if (j > 0 && map.data[i][j-1]==liter)
					imgUrl += "l";
				if (j < map.w - 1 && map.data[i][j+1]==liter)
					imgUrl += "r";
				if (i < map.h - 1 && map.data[i+1][j]==liter)
					imgUrl += "d";
				if (i > 0 && map.data[i-1][j]==liter)
					imgUrl += "u";
				if (imgUrl == "l" || imgUrl == "r")
					imgUrl = "lr";
				if (imgUrl == "d" || imgUrl == "u")
					imgUrl = "du";
				imgUrl = "url(" + (map.walls[liter].liter || liter) + imgUrl + ".png)";
				jElem.css('background-image', imgUrl);
			}
			jElem.css('background-position', '0px 0px');
		};
		for (var i = 0; i < map.h; ++i)
		{
			var r = $('<div class="main-row"/>').width(tile.w*map.w).height(tile.h);
			jqField[i] = [];
			for (var j = 0; j < map.w; ++j)
			{
				jqField[i][j] = $('<div class="main-cell"/>').data({'i':i,'j':j}).width(tile.w+"px").height(tile.h+"px").css(map.styles[map.data[i][j]]).css({'float':'left','position':'relative'});
				if (map.walls[map.data[i][j]])
					setWall(jqField[i][j], i, j);
				r.append(jqField[i][j]);
			}
			ft.append(r);
		}
		$('#field').empty().append(ft).hide();
		var createItemElement = function(item, isDoor)
		{
			var i = item.i;
			var j = item.j;
			if (!isAllowed(item,'allowTransit'))
				access[i][j] = false;
			if (item.prior>=40)
				throw "Неправильные данные карты: приоритет предмета должен быть менее 40";
			var jqElem = $('<div/>').addClass(isDoor?'door':'item').addClass(item.class).width(tile.w).height(tile.h).css({'position': 'absolute', 'z-index': (item.prior?item.prior+10:10), 'top': '0px', 'left': '0px'});
			jqField[i][j].append(jqElem);
			return jqElem;
		};
		for (var id in map.doors)
		{
			var door = map.doors[id];
			door.id = id;
			if (door.removedFromMap)
				continue;
			doorsByCoords[door.i+' '+door.j] = door;
			createItemElement(door, true);
		}
		for (var idx in map.items)
		{
			var item = map.items[idx];
			if (item.id)
				itemsById[item.id] = item;
			if (item.removedFromMap)
				continue;
			var jqItemElem = createItemElement(item);
			var ipos = item.i+' '+item.j;
			if (!itemsByCoords[ipos])
				itemsByCoords[ipos] = [];
			if (item.prior != null)
				itemsByCoords[ipos][item.prior] = item;
			else
				itemsByCoords[ipos][0] = item;
			var animationName = getItemProperty(item,'animation');
			if (animationName)
				usedAnimations.push(createAnimation(animationName, jqItemElem));
		}
		makeCentered($('minigame'));
		if (!startPos)
			startPos = map.startPos;
		pos = startPos;
		for (var id in map.npc)
		{
			addNPC(id);
		}
		var relPos = getRelativePos(pos);
		jqPlayer = $('<div id="player" class="'+mission.playerId+'"/>').css({'top':relPos[0]*tile.h+'px','left':relPos[1]*tile.w+'px'}).height(tile.h).width(tile.w).appendTo($('#field'));
		$('#field').width(Math.min(map.w,screen.w)*tile.w+'px').height(Math.min(map.h,screen.h)*tile.h+'px');
		var sdir = dir || map.startDir;
		dir = [];
		setOrientation(sdir[0],sdir[1]);
		cropScreen(true);
	};
	var onLoaded = function()
	{
		map = maps[mapId];
		initMapData();
		initField();
		mapReady = true;
		onReady();
	};
	if (!maps[mapId])
		$.getScript('Maps/'+mapId+'.js',function(data,status){
			if (status!="success")
			{
				invokeError('Ошибка: невозможно загрузить карту');
				return;
			}
			onLoaded();
		});
	else
		onLoaded();
}
function createAnimation(name, jqItemElem)
{
	var context = {};
	return function(){animations[name].call(context, jqItemElem);};
}
function createNPCAction(id)
{
	if (!map.npc[id].context)
		map.npc[id].context = {};
	var b = map.npc[id].beh;
	return function(){behaviors[b.type].call(map.npc[id].context,id,b)};
}
function invokeError(errorMessage)
{
	alert(errorMessage);
}
var dir;
var startPos;
var pos;
var inventory = {};
var worklog = [];
var directionHash = {1:'u',2:'l',4:'r',5:'d'};
var playerMoveTime;
var playerMoveDelay;
var playerStep;
function setOrientation(di,dj)
{
	if (dir[0] == di && dir[1] == dj)
		return;
	dir = [di, dj];
	jqPlayer.removeClass('l r d u').addClass(directionHash[2*(di + 1) + (dj + 1)]);
}
function setAhead()
{
	var msg = "";
	var front = [pos[0]+dir[0],pos[1]+dir[1]];
	var door = doorsByCoords[front[0]+' '+front[1]];
	var npc = npcByCoords[front[0]+' '+front[1]];
	if (door)
	{
		msg = '<div class="ahead-button">&'+directionHash[2*(dir[0] + 1) + (dir[1] + 1)]+'arr;</div> '+door.dst.descr;
	} else if (npc && npc.dialog)
	{
		msg = '<div class="ahead-button">E</div> '+(npc.hint || "поговорить с "+npc.name);
	} else
	{
		var hintItems = getItemsWithHint(front);
		if (hintItems.length)
		{
			var hintItem = hintItems[hintItems.length-1];
			var activateActMsg = getItemProperty(hintItem,'hint') || ((isAllowed(hintItem,"collectible")? "взять" : "использовать")+" "+getItemDescription(hintItem).name);
			msg = (isAllowed(hintItem,"active")?'<div class="ahead-button">E</div> ':'')+activateActMsg;
		}
	}
	$('#ahead').html(msg);
}
function addStatusEntry(msg)
{
	var s = $('#status');
	var sc = s.find('.mCSB_container');
	sc.html(sc.html()+msg+'<br/>');
	s.mCustomScrollbar('update');
	s.mCustomScrollbar('scrollTo','bottom');
}
function getItemsWithHint(front)
{
	var pos = front[0]+' '+front[1];
	var items = itemsByCoords[pos];
	var resItems = [];
	for (var idx in items)
	{
		var item = items[idx];
		if ((getItemProperty(item,'hint') || isAllowed(item, "active")) && getItemContainer(item).length)
			resItems.push(item);
	}
	return resItems;
}
function getActiveItems(front)
{
	var pos = front[0]+' '+front[1];
	var items = itemsByCoords[pos];
	var activeItems = [];
	for (var idx in items)
	{
		var item = items[idx];
		if (isAllowed(item, "active") && getItemContainer(item).length)
			activeItems.push(item);
	}
	return activeItems;
}
var moveLock = false;
var moveQueue = [];
function actualMove()
{
	if (!moveQueue.length || moveLock)
		return;
	var temp = moveQueue.shift();
	var di = temp[0];
	var dj = temp[1];
	var adi = Math.abs(di);
	var adj = Math.abs(dj);
	setOrientation(di,dj);
	if (access[pos[0]+di][pos[1]+dj])
	{
		var counter = tile.w/playerStep;
		var total = counter;
		var moveAnimation = function()
		{
			--counter;
			if (!moveBack)
			{
				var left = parseInt(jqPlayer.css('left')) + playerStep*dj;
				var top = parseInt(jqPlayer.css('top')) + playerStep*di;
				jqPlayer.css({'left':left+"px",'top':top+"px"});
			} else
			{
				$.each(appLine,function(i,v){
					if (di + dj == -1)
					{
						var bgp = v.css('background-position').split(' ');
						v.css('background-position',(parseInt(bgp[0])-playerStep*dj)+"px "+(parseInt(bgp[1])-playerStep*di)+"px");
					}
					v.css({'width':(v.width()+playerStep*adj)+'px','height':(v.height()+playerStep*adi)+"px"});
				});
				$.each(disLine,function(i,v){
					if (di + dj == 1)
					{
						var bgp = v.css('background-position').split(' ');
						v.css('background-position',(parseInt(bgp[0])-playerStep*dj)+"px "+(parseInt(bgp[1])-playerStep*di)+"px");
					}
					v.css({'width':(v.width()-playerStep*adj)+'px','height':(v.height()-playerStep*adi)+"px"});
				});
				for (var id in map.npc)
					alignNPC(id,[-playerStep*di,-playerStep*dj]);
			}
			if (counter==0)
			{
				if (moveBack)
				{
					$.each(disLine,function(i,v){v.hide().css({'width':(tile.w)+'px','height':(tile.h)+"px","background-position":"0px 0px"});});
					$.each(appLine,function(i,v){v.css('background-position',"0px 0px");});
				}
				triggerEvent('walk',{'map':map.id,'i':pos[0],'j':pos[1]});
				var fn = function(){moveLock = false;actualMove();};
				window.setTimeout(fn,playerMoveDelay);
			} else
				window.setTimeout(moveAnimation,playerMoveTime);
		}
		moveLock = true;
		var rel1 = getRelativePos(pos);
		var rel2 = getRelativePos([pos[0]+di,pos[1]+dj],[pos[0]+di,pos[1]+dj]);
		var moveBack = (rel1[0]==rel2[0] && rel1[1]==rel2[1]);
		var disLine;
		var appLine;
		if (moveBack)
		{
			var t = getScreenTopLeft();
			switch (di+' '+dj)
			{
				case "1 0":
					disLine = getScreenLine(t[0],t[1],false);
					appLine = getScreenLine(t[0]+screen.h,t[1],false);
					break;
				case "-1 0":
					disLine = getScreenLine(t[0]+screen.h-1,t[1],false);
					appLine = getScreenLine(t[0]-1,t[1],false);
					$.each(appLine,function(i,v){v.css("background-position","0px -"+tile.h+"px");});
					break;
				case "0 1":
					disLine = getScreenLine(t[0],t[1],true);
					appLine = getScreenLine(t[0],t[1]+screen.w,true);
					break;
				case "0 -1":
					disLine = getScreenLine(t[0],t[1]+screen.w-1,true);
					appLine = getScreenLine(t[0],t[1]-1,true);
					$.each(appLine,function(i,v){v.css("background-position","-"+tile.w+"px 0px");});
					break;
			}
			$.each(appLine,function(i,v){v.css({'width':(tile.w*(1-adj))+'px','height':(tile.h*(1-adi))+"px"}).show();});
			for (var id in map.npc)
				alignNPC(id,[di*tile.h,dj*tile.w]);
		}
		pos = [pos[0]+di,pos[1]+dj];
		moveAnimation();
	} else {
		var door = doorsByCoords[(pos[0]+di)+' '+(pos[1]+dj)];
		if (door)
		{
			openDoor(door);
		} else
		{
			window.setTimeout(actualMove,0);
		}
	}
	setAhead();
}
function makeMove(mdi,mdj)
{
	if (mdi!=null && mdj!=null && moveQueue.length<100)
		moveQueue.push([mdi,mdj]);
	if (!moveLock)
		actualMove();
}
function alignNPC(id, posCorr)
{
	var npc = map.npc[id];
	var jqnpc = npc.container;
	var relativePos = getRelativePos([npc.i,npc.j]);
	if (posCorr)
	{
		npc.correction[0]+=posCorr[0];
		npc.correction[1]+=posCorr[1];
	}
	if (relativePos[0]<-1 || relativePos[1]<-1 || relativePos[0]>screen.h || relativePos[1]>screen.w)
	{
		if (!npc.hidden)
		{
			jqnpc.hide();
			npc.hidden = true;
		}
		return;
	}
	var resPos = [relativePos[0]*tile.h+npc.correction[0],relativePos[1]*tile.w+npc.correction[1]];
	jqnpc.css({'left':resPos[1]+'px','top':resPos[0]+'px'});
	if (npc.hidden)
	{
		jqnpc.show();
		npc.hidden = false;
	}
}
function addNPC(id)
{
	var npc = map.npc[id];
	access[npc.i][npc.j] = false;
	if (npc.removed)
		return;
	var jqnpc = $('<div class="npc"/>').width(tile.w).height(tile.h);
	if (npc.style)
		jqnpc.css(npc.style);
	if (npc.class)
		jqnpc.addClass(npc.class);
	jqnpc.appendTo($('#field'));
	npc.container = jqnpc;
	npc.correction = [0,0];
	alignNPC(id);
	npcActionsLocks[id] = false;
	npcByCoords[npc.i+' '+npc.j] = npc;
	npcActions[id] = createNPCAction(id);
}
function removeNPC(id)
{
	var npc = map.npc[id];
	npc.container.remove();
	npc.removed = true;
	if (!jqField[npc.i][npc.j].children('div').length)
		access[npc.i][npc.j] = true;
	delete npcByCoords[npc.i+' '+npc.j];
	delete npcActions[id];
}
function moveNPC(id,direction)
{
	var npc = map.npc[id];
	var jqnpc = npc.container;
	var oldi = npc.i;
	var oldj = npc.j;
	if (jqField[oldi][oldj].children('div').length == 1)
		access[oldi][oldj] = true;
	delete npcByCoords[oldi+' '+oldj];
	npc.i += direction[0];
	npc.j += direction[1];
	access[npc.i][npc.j] = false;
	npcByCoords[npc.i+' '+npc.j] = npc;
	npcActionsLocks[id] = true;
	var total = tile.w/npc.speed;
	var cur = 0;
	alignNPC(id,[-tile.h*direction[0],-tile.w*direction[1]]);
	npcMoves[id] = function(){
		++cur;
		alignNPC(id,[direction[0]*npc.speed,direction[1]*npc.speed]);
		if (cur==total)
		{
			npcActionsLocks[id]=false;
			delete npcMoves[id];
		}
	};
	if (!npc.undirected)
		jqnpc.css('background-image','url('+npc.imageBase+directionHash[2*(direction[0] + 1) + (direction[1] + 1)]+'.png)');
}
function getItem(id)
{
	return itemsById[id];
}
function getItemContainer(item)
{
	return jqField[item.i][item.j].find('div.'+item.class);
}
function deleteItemContainer(item)
{
	item.removedFromMap = true;
	jqField[item.i][item.j].find('div.'+item.class).remove();
	if (!jqField[item.i][item.j].find('div').length)
		access[item.i][item.j] = true;
}
function createItem(id,itemClass)
{
	var i = {'id':id,'class':itemClass,'removedFromMap':true};
	itemsById[id] = i;
	return i;
}
function addToInventory(inv,item)
{
	if (inv[item.id] == null)
		inv[item.id] = 0;
	++inv[item.id];
	addStatusEntry('Взята вещь: '+getItemDescription(item).name);
	triggerEvent('inventoryAdd',{'item':item.id});
}
function getCountFromInventory(inv,id)
{
	return inv[id] || 0;
}
function removeFromInventory(inv,item)
{
	--inv[item.id];
	if (!inv[item.id])
	{
		delete(inv[item.id]);
	}
	triggerEvent('inventoryRemove',{'item':item.id});
}
var currentInfoTab = "";
function showInfoView(type)
{
	if (currentInfoTab == type || $('#minigame').is(':visible'))
		return;
	currentInfoTab = type;
	var jqEl = $('#info');
	makeFullScreen(jqEl);
	var contentEl;
	switch (type)
	{
		case "log":
			contentEl = getLogView();
			break;
		case "inventory":
			contentEl = getInventoryView();
			break;
		default:
			invokeError('Неопознанный тип информации: '+type);
	}
	$('#info-content').empty().append(contentEl).mCustomScrollbar('update');
	$('#info-tabs').find('.info-tab.active-tab').removeClass('active-tab');
	$('#'+type+'Tab').addClass('active-tab');
	if (jqEl.is(':hidden'))
		jqEl.show();
}
function closeInfoView()
{
	currentInfoTab = "";
	$('#info').hide();
}
function showLogEntry(jqLogHeader)
{
	activeQuest = jqLogHeader.data('qid');
	jqLogHeader.addClass('expanded').next().slideDown();
	jqLogHeader.find('.log-arrow').animate({'transform':'rotate(90deg)'},{'complete':function(){$('#info-content').mCustomScrollbar('update');}});
}
function hideLogEntry(jqLogHeader)
{
	jqLogHeader.removeClass('expanded').next().slideUp();
	jqLogHeader.find('.log-arrow').animate({'transform':'rotate(0deg)'},{'complete':function(){$('#info-content').mCustomScrollbar('update');}});
}
function getLogView()
{
	var logEl = $('<div id="log"/>');
	var sortedQuestIds = [];
	var temp = [];
	for (var qId in log)
		if (!quests[qId]['_finished'])
			sortedQuestIds.push(qId);
		else
			temp.push(qId);
	sortedQuestIds = sortedQuestIds.concat(temp);
	for (var idx in sortedQuestIds)
	{
		var qId = sortedQuestIds[idx];
		if (!log[qId].length) continue;
		var fin = quests[qId]['_finished'];
		logEl.append('<h1 class="log-header'+(fin?' log-header-finished':'')+'" data-qid="'+qId+'"><div class="log-arrow"/>'+quests[qId].name+(fin?' (завершён)':'')+'</h1>');
		var contHtml = '<div style="display:none;">';
		for (var i in log[qId])
			contHtml+='<div class="log-entry">'+log[qId][i]+'</div>';
		contHtml += '</div>';
		logEl.append(contHtml);
		if (activeQuest == qId)
			showLogEntry(logEl.find('.log-header').last());
	}
	return logEl;
}
var invViewItemsArr;
var invViewPageLength;
var curInvViewStartIdx;
function updateInventoryView(startIdx,invTab,pager,force)
{
	var pageLength = Math.max(1,Math.floor(($(window).height()-74-80)/117));
	if (!force && invViewPageLength == pageLength && curInvViewStartIdx == startIdx)
		return;
	invTab = invTab || $('#invWrapper');
	pager = pager || $('#invPager');
	invViewPageLength = pageLength;
	invTab.empty();
	var topIdx = Math.min(startIdx+pageLength,invViewItemsArr.length);
	pager.find('.inv-pager-digit').html(Math.ceil(topIdx/pageLength)+'/'+Math.ceil(invViewItemsArr.length/pageLength));
	for (var i = startIdx; i < topIdx; ++i)
	{
		var itemId = invViewItemsArr[i];
		var item = getItem(itemId);
		var invItem = $('<tr class="inv-item"/>');
		var imgSrc = itemId+'-i.png';
		$('<td class="inv-item-img"/>').appendTo(invItem).append('<img src="'+imgSrc+'"/>');
		$('<td class="inv-item-descr">'+getItemDescription(item).name+"("+inventory[itemId]+") - "+getItemDescription(item).descr+'</td>').appendTo(invItem);
		invTab.append(invItem);
	}
	curInvViewStartIdx = startIdx;
	if (pageLength>=invViewItemsArr.length)
		pager.hide();
}
function getInventoryView()
{
	var invEl = $('<div id="inventory"/>');
	var invTab = $('<table id="invWrapper" style="margin-top:20px;"></table>');
	var pager = $('<div id="invPager"><div class="inv-pager-arrow inv-pager-left"/><div class="inv-pager-digit"/><div class="inv-pager-arrow inv-pager-right"/></div>');
	invViewItemsArr = [];
	for (var itemId in inventory)
		invViewItemsArr.push(itemId);
	invEl.append(invTab);
	invEl.append(pager);
	updateInventoryView(0,invTab,pager,true);
	return invEl;
}
function startDialog(npc)
{
	$('#ahead').html('');
	var id = npc.dialog;
	var dialog = (map.dialogs && map.dialogs[id]) ? map.dialogs[id] : mission.dialogs[id];
	var jqDialog = $('#dialog');
	var jqParent = $('#dialog').parent();
	var jqPerson = $('#dialog-person');
	var jqPersonName = $('#dialog-person-name');
	var jqContent = $('#dialog-content');
	var jqChoices = $('#dialog-choices');
	var jqTopPart = $('#dialog-top');
	var person = dialog.person[0];
	var personName = dialog.person[1];
	var data = dialog.data[dialog.start];
	jqDialog.show().width(jqParent.innerWidth()-36).height(jqParent.innerHeight()-36);
	var endDialog = function()
	{
		$('#dialog').hide();
		$('.dialog-choice').off('click');
		setAhead();
		triggerEvent('dialogEnd',{'id':id,'dialog':dialog});
	}
	var appendChoice = function (chText, chOnClick) {
		$('<div class="dialog-choice">'+chText+'</div>').appendTo(jqChoices).on('click',chOnClick);
	};
	var nextReplica = function(replicaId)
	{
		data = dialog.data[replicaId];
		if (data.person)
		{
			person = data.person[0];
			personName = data.person[1];
		}
		updateDialogView();
		triggerEvent('dialogNext',{'id':id,'dialog':dialog,'repId':replicaId});
	};
	var updateDialogView = function()
	{
		jqPerson.attr('class','').addClass(person);
		jqPersonName.html(personName);
		jqContent.html(data.txt);
		jqChoices.find('.dialog-choice').off('click').parent().empty();
		var idx = 1;
		if (!data.ch || !data.ch.length)
		{
			appendChoice('&lt;Завершить диалог&gt;',endDialog);
		} else
			for (var i in data.ch)
			{
				var choice = data.ch[i];
				appendChoice(idx+'.'+choice[0],choice[1]!=null?(function(chId){return function(){nextReplica(chId);};})(choice[1]):endDialog);
				++idx;
			}
		jqTopPart.css('height',(jqDialog.innerHeight()-jqChoices.outerHeight()-32)+'px');
		jqTopPart.mCustomScrollbar('update');
	};
	updateDialogView();
	triggerEvent('dialogStart',{'id':id,'dialog':dialog});
}
function openDoor(door)
{
	moveQueue = [];
	if (door.locked && getCountFromInventory(inventory,door.key))
		door.locked = false;
	if (!door.locked)
	{
		if (map.onLeave)
			map.onLeave();
		triggerEvent('mapLeave',{'map':map.id,'door':door});
		window.setTimeout(function(){initMap(door.dst.map,[door.dst.i,door.dst.j]);},0);
	} else
	{
		triggerEvent('doorBump',{'map':map.id,'door':door.id});
		addStatusEntry('Дверь заперта');
	}
}
function useItem(item)
{
	var activeItems = item?[item]:getActiveItems([pos[0]+dir[0],pos[1]+dir[1]]);
	for (var i in activeItems)
	{
		var item = activeItems[i];
		var action = getItemProperty(item,"action");
		if (action)
		{
			if (action instanceof Function)
				action(item);
			else
				map.actions[item.action](item);
			triggerEvent("useItem",{'item':item.id});
			setAhead();
		}
		//TODO:relocate to npc
		var dialog = getItemProperty(item, "dialog");
		if (dialog)
		{
			startDialog(item);
		}
		if (isAllowed(item, "collectible"))
		{
			addToInventory(inventory,item);
			deleteItemContainer(item);
			setAhead();
		}
	}
}
var eventHooks;
var hooksScopes;
var quests;
function compareEventInfo(initial,incoming)
{
	for (var i in initial)
	{
		if (!initial.hasOwnProperty(i))
			continue;
		if (i.charAt(0)=="_")
		{
			switch(i)
			{
				case "_condition":
					var args = [];
					for (var j in initial["_conditionArgs"])
						args.push(incoming[initial["_conditionArgs"][j]]);
					if (!initial[i].apply(window, args))
						return false;
					break;
				default:
					break;
			}
			continue;
		}
		if (initial[i] instanceof Object)
		{
			if (!(initial[i] instanceof Array))
				return false;
			if (!compareEventInfo(initial[i],incoming[j]))
				return false;
		} else if (initial[i] != incoming[i])
			return false;
	}
	return true;
}
function hookQuests()
{
	var hookStage = function(questId, stageId)
	{
		var quest = quests[questId];
		var stage = quest[stageId];
		for (var eventName in stage.triggeredBy)
		{
			var eventHook = createQuestHook(questId, stageId, stage.triggeredBy[eventName]);
			//var t = {};
			//t[eventName] = eventHook;
			//quest["_activeHooks"].push(t);
			addHook(eventName, eventHook, '_quest_'+questId);
		}
	};
	var createQuestHook = function(questId, stageId, triggeringEventInfo)
	{
		return function(eventName, eventInfo){
			if (!compareEventInfo(triggeringEventInfo, eventInfo)) return;
			var q = quests[questId];
			var s = q[stageId];
			//for (var i in q["_activeHooks"])
			//	for (var j in q["_activeHooks"][i])
			//		removeHook(j, q["_activeHooks"][i][j]);
			//q["_activeHooks"] = [];
			clearHooksScope('_quest_'+questId);
			if (s.action)
				s.action();
			if (s.next)
			{
				var next;
				if (s.next instanceof Array)
					next = s.next;
				else
					next = [s.next];
				for (var i in next)
					hookStage(questId, next[i]);
			}
			log[questId].push(s.logEntry);
			activeQuest = questId;
			addStatusEntry('<span class="status-entry">'+s.logEntry+'</span>');
			if (s.success === true)
			{
				q['_finished'] = true;
				showMessage("Задание '"+q.name+"' успешно выполнено!");
				if (q.primary)
				{
					showMessage('Конец демо версии. Обновите страницу, чтобы начать игру заново.');
					$('#gamewindow').hide();
				}
			} else if (s.success === false)
				showMessage("Задание '"+q.name+"' потрачено!");
		};
	};
	eventHooks = {};
	quests = mission.quests;
	for (var qId in quests)
	{
		var quest = quests[qId];
		quest["_stage"] = "";
		quest["_activeHooks"] = [];
		log[qId] = [];
		hookStage(qId, quest.start);
	}
}
function addHook(eventName, hook, scopeName)
{
	if (!eventHooks[eventName])
		eventHooks[eventName] = [];
	eventHooks[eventName].push(hook);
	if (scopeName)
	{
		hooksScopes[scopeName] = hooksScopes[scopeName] || [];
		hooksScopes[scopeName].push([eventName,hook]);
	}	
}
function removeHook(eventName, hook)
{
	var hooks = eventHooks[eventName];
	if (!hooks) return;
	for (var i in hooks)
	{
		if (hooks[i] == hook)
		{
			eventHooks[eventName].splice(i,1);
			return;
		}
	}
}
function clearHooksScope(scopeName)
{
	var hs = hooksScopes[scopeName];
	if (!hs) return;
	for (var i in hs)
		removeHook(hs[i][0],hs[i][1]);
}
function initMinigameField(minigame)
{
	if (!minigame.noControlLock)
		controlLock = true;
	var jqMg = $('#minigame');
	jqMg.removeAttr('style').html(minigame.html).css(minigame.css);
	window.closeMinigame = function()
	{
		if (jqMg.is(':hidden'))
			return;
		jqMg.hide();
		controlLock = false;
		if (minigame.onClose)
			minigame.onClose();
		setAhead();
	};
	if (minigame.canClose)
	{
		jqMg.prepend('<div style="height:30px;"><div class="close close-cross" style="float:right;"/></div>');
		jqMg.on('click','.close',closeMinigame);
	}
	var imgs = jqMg.find('img');
	var total = imgs.length;
	if (total > 0)
		imgs.on('load',function(){--total; if (total == 0) makeCentered(jqMg.show());});
	else
		makeCentered(jqMg.show());
	return jqMg;
}
function findShortestPath(fromPos,toPos)
{
	var res = [];
	var curShortestLen = map.w * map.h;
	var wm = [];
	for (var i in access)
	{
		wm.push([]);
		for (var j in access[i])
			wm[i].push(curShortestLen);
	}
	wm[fromPos[0]][fromPos[1]] = 0;
	var di = toPos[0]-fromPos[0];
	var dj = toPos[1]-fromPos[1];
	var prim = Math.abs(di)>Math.abs(dj)?[di<0?-1:1,0]:[0,dj<0?-1:1];
	var chsgn = di*dj<0?-1:1;
	var ds = [prim,[prim[1]*chsgn,prim[0]*chsgn],[prim[0]*-1,prim[1]*-1],[prim[1]*chsgn*-1,prim[0]*chsgn*-1]];
	var evalTileDist = function(i,j)
	{
		var c = wm[i][j] + 1;
		if (c >= curShortestLen)
			return;
		for (var idx in ds)
		{
			var newi = i+ds[idx][0];
			var newj = j+ds[idx][1];
			if (newi<0 || newi>=map.h || newj<0 || newj>map.w || !access[newi][newj])
				continue;
			if (wm[newi][newj] > c)
			{
				wm[newi][newj] = c;
				if (newi==toPos[0] && newj==toPos[1])
					curShortestLen = c;
				evalTileDist(newi,newj);
			}
		}
	};
	evalTileDist(fromPos[0],fromPos[1]);
	if (wm[toPos[0]][toPos[1]] == map.w*map.h)
		return res;
	var c = wm[toPos[0]][toPos[1]];
	var backPos = toPos;
	ds = ds.reverse();
	while (c>0)
	{
		for (var i in ds)
		{
			var ni = backPos[0]-ds[i][0];
			var nj = backPos[1]-ds[i][1];
			if (wm[ni][nj]==c-1)
			{
				backPos=[ni,nj];
				--c;
				res[c]=[ds[i][0],ds[i][1]];
				break;
			}
		}
	}
	return res;
}
var msgQueue = [];
var msgboxVisible = false;
function showMessage(message)
{
	pause();
	if (message)
		msgQueue.push(message);
	if (msgboxVisible)
		return;
	if (!msgQueue.length)
	{
		resume();
		return;
	}
	msgboxVisible = true;
	var msg = msgQueue.shift();
	$('body').append('<div id="msgbox" class="centerscreen">'+msg.replace('\n','<br/>')+'<br/><div class="button" onclick="$(\'#msgbox\').remove();msgboxVisible=false;showMessage();">Ok</div></div>');
	makeCentered($('#msgbox').show());
	$('#msgbox').find('.button').focus();
}
function triggerEvent(eventName, eventInfo)
{
	var hooks = eventHooks[eventName];
	if (!hooks) return;
	hooks = hooks.slice(0);
	for (var i in hooks)
		hooks[i](eventName, eventInfo);
}
function mouseClickHandler(e)
{
	if (paused || controlLock)
		return;
	var jqEl = $(e.target);
	var isDoor = jqEl.hasClass('door');
	var isItem = jqEl.hasClass('item');
	if (isItem || isDoor)
	{
		var cell = jqEl.closest('.main-cell');
		var i = cell.data('i');
		var j = cell.data('j');
		if (Math.abs(i-pos[0])+Math.abs(j-pos[1]) == 1)
		{
			if (i-pos[0]==dir[0] && j-pos[1]==dir[1])
			{
				if (isDoor)
					openDoor(doorsByCoords[i+' '+j]);
				else
					useItem();
			} else {
				setOrientation(i-pos[0],j-pos[1]);
				setAhead();
			}
		}
		return;
	}
	if (jqEl.hasClass('main-cell'))
	{
		var i = jqEl.data('i');
		var j = jqEl.data('j');
		var moves = findShortestPath(pos,[i,j]);
		if (!moves.length)
			return;
		moveQueue = moves;
		var t = moveQueue.pop();
		makeMove(t[0],t[1]);
	}
}
function keyHandler(e)
{
	if (paused || controlLock)
		return;
	switch (e.keyCode)
	{
		case 87:
		case 38: makeMove(-1,0);
			break;
		case 83:
		case 40: makeMove(1,0);
			break;
		case 65:
		case 37: makeMove(0,-1);
			break;
		case 68:
		case 39: makeMove(0,1);
			break;
		case 13:
		case 69: useItem();
			break;
		case 73:
			if (currentInfoTab=="inventory")
				closeInfoView();
			else
				showInfoView("inventory");
			break;
		case 74:
			if (currentInfoTab=="log")
				closeInfoView();
			else
				showInfoView("log");
			break;
		case 27:
			if ($('#minigame').is(':visible'))
				$('#minigame').find('.close').click();
			else if ($('#info').is(':visible'))
				closeInfoView();
			break;
		default:
			//alert(e.keyCode);
			return true;
		return false;
	}
}
function clearQueue(e)
{
	if (paused || controlLock)
		return;
	switch (e.keyCode)
	{
		case 37:
		case 38:
		case 39:
		case 40:
		case 65:
		case 68:
		case 83:
		case 87:
			moveQueue = [];
			break;
	}
}
function registerTimer(type,id,fn,handler,timeInt)
{
	switch (type)
	{
		case "auto":
			timers.auto[id]={'fn':fn,'hndlr':handler};
			break;
		case "timeout":
		case "interval":
			timers[type][id]={'fn':fn,'hndlr':handler,'time':timeInt};
			break;
		default:
			invokeError('Неизвестный тип таймера');
	}
}
function startMission(id)
{
	controlLock = true;
	var onLoad = function(){
		paused = false;
		mission = missions[id];
		dir = null;
		timers = {'auto':{},'timeout':{},'interval':{}};
		log = {};
		storage = {};
		maps = {};
		hooksScopes = {};
		try {
			hookQuests();
			initMap(mission.startMapId);
			$('#field').show();
			$('#start-button').hide().blur();
			$(window).on('keydown', keyHandler);
			$(window).on('keyup', clearQueue);
			$('#field').on('click', '.main-cell', mouseClickHandler);
			registerTimer('auto','_animate',animate);
			registerTimer('auto','_ai',ai);
			animate();
			ai();
			controlLock = false;
		} catch (e)
		{
			invokeError("Ошибка: невозможно запустить миссию");
			throw e;
		}
	};
	if (!missions[id])
		$.getScript('Missions/'+id+'.js', function(data, status, jqxhr){
			if (jqxhr.status != 200)
			{
				invokeError('Ошибка: невозможно загрузить миссию');
				return;
			}
			onLoad();
		});
	else
		onLoad();
}
function animate()
{
	for (var idx in usedAnimations)
		usedAnimations[idx]();
	timers.auto['_animate'].hndlr = window.setTimeout(animate,40);
}
function ai()
{
	for (var id in npcActions)
		if (!npcActionsLocks[id])
			npcActions[id]();
	for (var idx in npcMoves)
		npcMoves[idx]();
	timers.auto['_ai'].hndlr = window.setTimeout(ai,40);
}
var controlLock = true;
var paused = false;
function pause()
{
	if (paused)
		return;
	makeFullScreen($('#anticlick').show());
	paused = true;
	moveQueue = [];
	for (var type in timers)
		for (var idx in timers[type])
		{
			var timerDescr = timers[type][idx];
			if (type=="interval")
				window.clearInterval(timerDescr.hndlr);
			else
				window.clearTimeout(timerDescr.hndlr);
		}
}
function resume()
{
	if (!paused)
		return;
	paused = false;
	$('#anticlick').hide()
	for (var idx in timers.auto)
		timers.auto[idx].fn();
	for (var idx in timers.interval)
	{
		var descr = timers.interval[idx];
		descr.hndlr = window.setInterval(descr.fn,descr.time);
	}
	for (var idx in timers.timeout)
	{
		var descr = timers.timeout[idx];
		descr.hndlr = window.setTimeout(descr.fn,descr.time);
	}
}
/*
function end()
{
	try {
		$('#field').hide();
		$('#start-button').show();
		$(window).off('keydown',keyHandler);
	} catch (e)
	{
		invokeError("Can't stop");
	}
}*/
$(document).on('ready',function(){
	$('#status').mCustomScrollbar({
		theme:'light-thick',
		mouseWheel:true,
		scrollButtons:{
		  enable:true,
		  scrollAmount:24
		},
		autoDraggerLength:true
	});
	$('#info-content').mCustomScrollbar({
		theme:'light-thick',
		mouseWheel:true,
		scrollButtons:{
			enable:true
		},
		autoDraggerLength:true
	});
	$('#dialog-top').mCustomScrollbar({
		theme:'light-thick',
		mouseWheel:true,
		scrollButtons:{
			enable:true
		},
		autoDraggerLength:true
	});
	$('#info').on('click','.log-header',function(){
		var jqEl = $(this);
		if (jqEl.hasClass('expanded'))
			hideLogEntry(jqEl);
		else
			showLogEntry(jqEl);
	});
	$('#info').on('click','.inv-pager-arrow',function(){
		var pos;
		if ($(this).hasClass('inv-pager-left'))
			pos = Math.max(0,curInvViewStartIdx-invViewPageLength);
		else
			pos = (curInvViewStartIdx+invViewPageLength>=invViewItemsArr.length)?curInvViewStartIdx:(curInvViewStartIdx+invViewPageLength);
		if (pos!=curInvViewStartIdx)
			updateInventoryView(pos);
	});
	$(window).on('resize',function(){if (currentInfoTab=="inventory") updateInventoryView(curInvViewStartIdx);})
});