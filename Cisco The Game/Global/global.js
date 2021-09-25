var missions={};
var maps={};
var defaultActions = {
	"opendoor":function(door)
	{
		var items = itemsByCoords[door.i+' '+door.j];
		jqField[door.i][door.j].find('.'+door["class"]).removeClass(door["class"]).addClass("open"+door["class"]);
		door["class"]="open"+door["class"];
		for (var i in items)
		{
			if (!isAllowed(items[i],"allowTransit"))
			{
				return;
			}
		}
		access[door.i][door.j] = true;
	}
};
var itemsClasses = {
	"as5800":{"active":true,"collectible":true},
	"rack":{"active":true},
	"extinguisher":{"active":true,"collectible":true,"animation":"hop"},
	"cert":{"active":true,"collectible":true,"animation":"hop"},
	"whiteboard":{"active":true},
	"crossbox":{"active":true},
	"straightbox":{"active":true},
	"window0":{"hint":"Закрытое окно"},
	"woodinnerdoorl":{"hint":"Открыть дверь","active":true,"action":defaultActions.opendoor},
	"woodinnerdoorr":{"hint":"Открыть дверь","active":true,"action":defaultActions.opendoor},
	"openwoodinnerdoorl":{"allowTransit":true},
	"openwoodinnerdoorr":{"allowTransit":true}
};
var itemsDescriptions = {
	"rack":{"name":"стойка","descr":"Стойка со старым, никому не нужным оборудованием"},
	"as5800":{"name":"AS5800","descr":"Старое, никому не нужное оборудование"},
	"cert":{"name":"сертификат CCNP","descr":"Сертификат воина Cisco"},
	"fireex":{"name":"огнетушитель","descr":"Тайный покровитель и ангел-хранитель 518 аудитории и сетевой академии"},
	"whiteboard":{"name":"доска","descr":"Доска с нарисованной топологией"},
	"cross":{"name":"патч-корд кроссовый","descr":"Кусок витой пары, обжатый как кроссовый"},
	"straight":{"name":"патч-корд прямой","descr":"Кусок витой пары, обжатый прямыми руками"},
	"recordbook":{"name":"зачётка","descr":"Эссенция и доказательство существования студента"},
	"deankey":{"name":"ключ Декана","descr":"Открывает двери в деканате"}
};
var tile = {
	"h": 40,
	"w": 40
};
var screen = {
	"h": 10,
	"w": 10
};
var missions = ["learn2fly"];
var animations = {
	"hop": function(jqElem){
		if (!this.d && !this.c)
		{
			this.d = 1;
			this.c = 0;
		}
		if (this.c == -4 || this.c == 4)
			this.d *= -1;
		this.c += this.d;
		if (this.c%2==0)
			jqElem.css("top", (parseInt(jqElem.css('top'))+this.d)+"px");
	}
};
var behaviors = {
	"poiWalkCycled": function(id,b){
		if (!this.poiIdx)
			this.poiIdx = 0;
		var startIdx = this.poiIdx;
		var npc = map.npc[id];
		var poi = map.poi[b.poi[this.poiIdx]];
		var moves = this.moves;
		if (!moves || !moves.length || !access[npc.i+moves[0][0]][npc.j+moves[0][1]])
		{
			moves = [];
			while (!moves.length)
			{
				moves = findShortestPath([npc.i,npc.j],poi);
				if (!moves.length)
				{
					this.poiIdx = (this.poiIdx + 1) % b.poi.length;
					if (this.poiIdx == startIdx)
						return;
					poi = map.poi[b.poi[this.poiIdx]];
				}
			}
			this.moves = moves;
		}
		moveNPC(id,this.moves.shift());
	},
	"pursuitPlayer": function(id,b){
		var npc = map.npc[id];
		if (!this.moves)
			this.moves = [];
		if (!this.moves.length)
		{
			this.moves = findShortestPath([npc.i,npc.j],pos);
		}
		if (this.moves.length || (this.moves[0][0]+npc.i==pos[0] && this.moves[0][1]+npc.j==pos[1]))
			return;
		moveNPC(id,this.moves.shift());
	},
	"standStill": function(id,b){
	},
	"custom": function(id,b){
		var npc = map.npc[id];
		npc.beh.fn.call(this,npc.i,npc.j);
	}
};