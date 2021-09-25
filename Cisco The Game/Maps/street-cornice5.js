(function(){
var id = 'street-cornice5';
maps[id] = {
	"id": id,
	"name": "Карниз 5 этажа",
	"w":30,
	"h":10,
	//"playerMoveTime":80,
	"playerStepLength":2,
	"playerMoveDelay":360,
	"walls":{"b":{"directed":false},"3":{"directed":false}},
	"doors":{
		"w1":{"dst":{"descr":"Окно в 518 аудиторию","map":"518","i":8,"j":8},"class":"window0","i":0,"j":28},
		"w2":{"dst":{"descr":"Окно в 518 аудиторию","map":"518","i":8,"j":7},"class":"window0","i":0,"j":27},
		"w3":{"dst":{"descr":"Окно в 518 аудиторию","map":"518","i":8,"j":6},"class":"window0","i":0,"j":26},
		"w6":{"dst":{"descr":"Окно в 518 аудиторию","map":"518","i":8,"j":3},"class":"window0","i":0,"j":23},
		"w7":{"dst":{"descr":"Окно в 518 аудиторию","map":"518","i":8,"j":2},"class":"window0","i":0,"j":22},
		"w8":{"dst":{"descr":"Окно в 518 аудиторию","map":"518","i":8,"j":1},"class":"window0","i":0,"j":21},
		"pipe1":{"dst":{"descr":"Труба на 6 этаж","map":"street-cornice6","i":8,"j":15},"class":"pipe","i":1,"j":6},
		"pipe2":{"dst":{"descr":"Труба на 6 этаж","map":"street-cornice6","i":8,"j":38},"class":"pipe","i":1,"j":29}
	},
	"styles":{
		"b":{"background-color":"LightGrey","background-image":"url(outerwall0.png)"},
		"c":{"background-color":"LightGrey","background-image":"url(cornice4.png)"},
		"3":{"background-color":"DarkGrey","background-image":"url(outerwall1.png)"},
		"2":{"background-color":"DarkGrey","background-image":"url(outerwall2.png)"},
		"1":{"background-color":"DarkGrey","background-image":"url(outerwall3.png)"},
		" ":{"background-color":"LightGrey"},
		"s":{"background-color":"DarkGrey","background-image":"url(street.png)"},
		"g":{"background-color":"Green","background-image":"url(grass.png)"}
	},
	"items":[
		{"class":"pipe","i":0,"j":6},
		{"class":"pipe","i":2,"j":6},
		{"class":"pipe","i":3,"j":6},
		{"class":"pipe","i":4,"j":6},
		{"class":"pipe","i":0,"j":29},
		{"class":"pipe","i":2,"j":29},
		{"class":"pipe","i":3,"j":29},
		{"class":"pipe","i":4,"j":29},
		{"class":"window0","i":0,"j":25},
		{"class":"window0","i":0,"j":24},
		{"class":"window0","i":0,"j":16},
		{"class":"window0","i":0,"j":15},
		{"class":"window0","i":0,"j":14},
		{"class":"window0","i":0,"j":13},
		{"class":"window0","i":0,"j":12},
		{"class":"window0","i":0,"j":11},
		{"class":"window0","i":0,"j":10},
		{"class":"window0","i":0,"j":5},
		{"class":"window0","i":0,"j":4},
		{"class":"window0","i":0,"j":3},
		{"class":"window0","i":0,"j":2},
		{"class":"window0","i":0,"j":1},
		{"class":"tree1","i":5,"j":4},
		{"class":"tree2","i":6,"j":2},
		{"class":"tree3","i":5,"j":20},
		{"class":"tree1","i":6,"j":4},
		{"class":"tree1","i":6,"j":7},
		{"class":"tree2","i":6,"j":8},
		{"class":"tree1","i":6,"j":13},
		{"class":"tree3","i":6,"j":14},
		{"class":"tree1","i":6,"j":27},
		{"class":"tree3","i":6,"j":28}
	],
	"npc":{
		"walker1":{"i":7,"j":26,"class":"littleWalker","imageBase":"littleWalker","speed":2,"beh":{"type":"poiWalkCycled","poi":["wlt","wld","wrd","wrt"]}},
		"walker2":{"i":8,"j":5,"class":"littleWalker","imageBase":"littleWalker","speed":2,"beh":{"type":"poiWalkCycled","poi":["wrd","wrt","wlt","wld"]}},
		"car":{"i":9,"j":2,"class":"littleCar","undirected":true,"speed":5,"beh":{"type":"custom","fn":function(i,j){
			if (j==29)
				removeNPC("car");
			else
				moveNPC("car",[0,1]);
		}}}
	},
	"poi":{
		"wlt":[7,0],
		"wrt":[7,29],
		"wld":[8,0],
		"wrd":[8,29],
		"sr":[9,29]
	}
};
var winRow = [21,22,23,26,27,28];
for (var i in maps[id].items)
{
	var item = maps[id].items[i];
	if (item.class != 'window0' || item.i!=0)
		continue;
	winRow.push(item.j);
}
for (var idx in winRow)
{
	for (var i = 2; i < 5; ++i)
		maps[id].items.push({"class":"outerwindow"+(i-1),"i":i,"j":winRow[idx]});
}
var data;
data  = "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";
data += "cccccccccccccccccccccccccccccc";
data += "333333333333333333333333333333";
data += "222222222222222222222222222222";
data += "111111111111111111111111111111";
data += "gggggggggggggggggggggggggggggg";
data += "gggggggggggggggggggggggggggggg";
data += "                              ";
data += "                              ";
data += "ssssssssssssssssssssssssssssss";
maps[id].data = [];
for (var i = 0; i < 10; ++i)
	maps[id].data[i] = data.substr(i*30, 30).split('');
var oldso;
var unhook = function(ename, einfo)
{
	setOrientation = oldso;
	if (einfo.door["class"]=="window0")
		einfo.door["class"]="openwindow0";
};
maps[id].onStart = function()
{
	if (dir[0]==1 && pos[1]>=21 && pos[1]<=28)
	{
		var door = doorsByCoords[(pos[0]-1)+" "+pos[1]];
		if (door && door["class"]=="window0")
		{
			door["class"]="openwindow0";
			jqField[door.i][door.j].find('.door').removeClass('window0').addClass('openwindow0');
		}
	}
	setOrientation(1,0);
	setAhead();
	oldso = setOrientation;
	setOrientation = function(i,j)
	{
		oldso(i,j);
		jqPlayer.removeClass('l r u').addClass('d');
	};
	addHook("mapLeave",unhook,"map");
};
})();