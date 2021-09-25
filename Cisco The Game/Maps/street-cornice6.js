(function(){
var id = 'street-cornice6';
maps[id] = {
	"id": id,
	"name": "Карниз 6 этажа",
	"w":40,
	"h":10,
	"playerStepLength":2,
	"playerMoveDelay":360,
	"walls":{"5":{"directed":false},"6":{"directed":false}},
	"doors":{
		"w1":{"dst":{"descr":"Окно в деканат","map":"dean-office","i":8,"j":9},"class":"openwindow0","i":7,"j":7},
		"pipe1":{"dst":{"descr":"Труба на 5 этаж","map":"street-cornice5","i":1,"j":7},"class":"pipe","i":8,"j":16},
		"pipe2":{"dst":{"descr":"Труба на 5 этаж","map":"street-cornice5","i":1,"j":28},"class":"pipe","i":8,"j":39}
	},
	"styles":{
		"5":{"background-color":"LightGrey","background-image":"url(outerwall0.png)"},
		"c":{"background-color":"LightGrey","background-image":"url(cornice4.png)"},
		"6":{"background-color":"LightGrey","background-image":"url(outerwall0.png)"},
		"7":{"background-color":"DarkGrey","background-image":"url(outerwall3.png)"},
		" ":{"background-color":"LightBlue"},
		"r":{"background-color":"DarkGreen","background-image":"url(roof.png)"}
	},
	"items":[
		{"class":"pipe","i":6,"j":16},
		{"class":"pipe","i":7,"j":16},
		{"class":"pipe","i":9,"j":16},
		{"class":"pipe","i":6,"j":39},
		{"class":"pipe","i":7,"j":39},
		{"class":"pipe","i":9,"j":39},
		{"class":"cornice-debris","hint":"Обрыв карниза","i":8,"j":20},
		{"class":"window0","i":7,"j":38},
		{"class":"window0","i":7,"j":37},
		{"class":"window0","i":7,"j":36},
		{"class":"window0","i":7,"j":35},
		{"class":"window0","i":7,"j":34},
		{"class":"window0","i":7,"j":33},
		{"class":"window0","i":7,"j":32},
		{"class":"window0","i":7,"j":31},
		{"class":"window0","i":7,"j":26},
		{"class":"window0","i":7,"j":25},
		{"class":"window0","i":7,"j":24},
		{"class":"window0","i":7,"j":23},
		{"class":"window0","i":7,"j":22},
		{"class":"window0","i":7,"j":21},
		{"class":"window0","i":7,"j":20},
		{"class":"window0","i":7,"j":15},
		{"class":"window0","i":7,"j":14},
		{"class":"window0","i":7,"j":13},
		{"class":"window0","i":7,"j":12},
		{"class":"window0","i":7,"j":11},
		{"class":"window0","i":7,"j":8},
		{"class":"window0","i":7,"j":6},
		{"class":"window0","i":7,"j":4},
		{"class":"window0","i":7,"j":3},
		{"class":"window0","i":7,"j":1},
		{"class":"window0","i":7,"j":0}
	]
};
var winRow = [7];
for (var i in maps[id].items)
{
	var item = maps[id].items[i];
	if (item.class != 'window0')
		continue;
	winRow.push(item.j);
}
for (var idx in winRow)
{
	maps[id].items.push({"class":"outerwindowtop","i":6,"j":winRow[idx]});
	maps[id].items.push({"class":"window0","i":9,"j":winRow[idx]});
}
var data;
data  = "                                        ";
data += "                                        ";
data += "                                        ";
data += "rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr";
data += "rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr";
data += "rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr";
data += "7777777777777777777777777777777777777777";
data += "6666666666666666666666666666666666666666";
data += "6ccccccccccccccccccccccccccccccccccccccc";
data += "5555555555555555555555555555555555555555";
maps[id].data = [];
for (var i = 0; i < 10; ++i)
	maps[id].data[i] = data.substr(i*40, 40).split('');
var oldso;
maps[id].onStart = function()
{
	setOrientation(1,0);
	setAhead();
	oldso = setOrientation;
	setOrientation = function(i,j)
	{
		oldso(i,j);
		jqPlayer.removeClass('l r u').addClass('d');
	};
};
maps[id].onLeave = function()
{
	setOrientation = oldso;
};
})();