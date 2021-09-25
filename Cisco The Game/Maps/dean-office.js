(function(){
var id = 'dean-office';
maps[id] = {
	"id": id,
	"name": "Деканат",
	"w":12,
	"h":10,
	"walls":{"w":{"directed":false}},
	"doors":{
		"mainDoor":{"dst":{"descr":"Дверь в коридор 6 этажа","map":"6floor","i":0,"j":0},"class":"cavedoor","i":0,"j":7,"locked":true,"key":"dean_office_key"},
		"w0":{"dst":{"descr":"Окно на карниз 6 этажа","map":"street-cornice6","i":8,"j":7},"class":"openwindow0","i":9,"j":9}
	},
	"styles":{
		"w":{"background-color":"LightGray","background-image":"url(mario.png)"},
		"b":{"background-color":"Black"},
		"g":{"background-color":"DarkGray"},
		" ":{"background-color":"LightGray","background-image":"url(floor.png)"}
	},
	"items":[
		{"class":"window0","i":9,"j":10},
		{"class":"window0","i":9,"j":8},
		{"class":"window0","i":9,"j":6},
		{"class":"window0","i":9,"j":5},
		{"class":"window0","i":9,"j":3},
		{"class":"window0","i":9,"j":2},
		{"class":"window0","i":9,"j":1},
		{"class":"woodinnerdoorr","i":2,"j":6,"action":"openlocked"},
		{"class":"woodinnerdoorl","i":2,"j":8,"action":"openlocked"},
		{"class":"deandesk0","i":6,"j":9,"hint":"Многочисленные награды факультета"},
		{"class":"deanchair","i":6,"j":10},
		{"class":"deandesk1","i":7,"j":9},
		{"class":"deandesk2","i":7,"j":10,"active":true,"action":"lookForKey","hint":"Посмотреть на бумаги"},
		{"class":"secretarydesk","i":6,"j":5},
		{"class":"groupslogsshelf","i":3,"j":5,"hint":"Шкаф с журналами и мелом"},
		{"class":"deanlocker","i":7,"j":5,"id":"deanlocker","active":true,"action":"takeRecordBook","hint":"Взять зачётку"},
		{"class":"wooddesku","i":7,"j":3},
		{"class":"wooddeskr","i":6,"j":3},
		{"class":"wooddesku","i":7,"j":2},
		{"class":"wooddeskd","i":4,"j":1},
		{"class":"wooddeskd","i":4,"j":2},
		{"class":"wooddeskd","i":4,"j":3},
		{"class":"wooddeskr","i":5,"j":1},
		{"class":"wooddeskr","i":6,"j":1},
		{"class":"wooddeskr","i":7,"j":1},
		{"class":"wooddeskr","i":8,"j":1},
		{"class":"wooddeskr","i":3,"j":1},
		{"class":"wooddeskd","i":3,"j":2},
		{"class":"wooddeskl","i":3,"j":3}
	],
	"actions":{
		"takeRecordBook":function(locker)
		{
			addToInventory(inventory,createItem('recordbook','recordbook'));
			locker.active = false;
			locker.hint = "Шкаф с зачётками";
		},
		"openlocked":function(door)
		{
			if (getCountFromInventory(inventory,"deankey"))
				defaultActions.opendoor(door);
			else
				addStatusEntry("Закрыто на ключ");
		},
		"lookForKey":function(deandesk)
		{
			if (!storage['mini_lookForKey'])
			{
				storage['mini_lookForKey'] = {'paper1':{'left':'830px','top':'230px','transform':'matrix(-1,0,0,-1,0,0)'},'paper2':{'left':'660px','top':'230px','transform':'matrix(-1,0,0,-1,0,0)'},'paper3':{'left':'490px','top':'230px','transform':'matrix(-1,0,0,-1,0,0)'},'paper4':{'left':'320px','top':'230px','transform':'matrix(-1,0,0,-1,0,0)'},'paper5':{'left':'40px','top':'50px','transform':'matrix(-1,0,0,-1,0,0)'},'deankey':{}};
				storage['mini_lookForKey_stat'] = [[830,230],[660,230],[490,230],[320,230],[40,50]];
			}
			var s = storage['mini_lookForKey'];
			var removeBindings = function()
			{
				$('#minigame').off('mouseup mouseleave');
				$('.mini-dean-paper').off('mousedown mousemove');
			};
			initMinigameField({'html':'<div id="paper1"><div style="align:center;font-size:15px;margin-top:15px;margin-left:15px;">Всех отчислить.</div><div id="findkeyreject" style="position:absolute;top:100px;left:25px;color:Red;font-size:10px;border:1px Solid Red;text-align:center;">Отказать<br/>Декан <span style="background-color:Grey;color:Grey;">Тызнаешь</span></div><div style="position:absolute;bottom:20px;">Зам.декана <span style="background-color:Grey;color:Grey;">Тожезнаешь</span></div></div><div id="paper2">Замечено, что студенты портят экземпляры Демидовичей, каковые выдаются только во временное пользование таковым. Замечено, что таковые марают каковые посредством клякс, каковые уменьшают ценность каковых, не давая возможности следующим группам таковых пользоваться каковыми. Также замечено, что из каковых вырываются страницы таковыми, что свидетельствует о недооценке каковых таковыми. Впредь если будут замечены таковые, портящие каковые, то из университета будут изыматься вместе с каковыми и таковые.</div><div id="paper3">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div><div id="paper4">Поросёнок Пётр отправляется в ад<br/>Сегодня случилось несчастье - глупая корова Машка случайно задавила лучшую подругу Петра - собаку Марусю. Пётр был убит горем и всё своё свободное время он проводил в больнице рядом с Марусей. Но однажды доктор сказал, что Маруся умрёт и медицина тут бессильна. Когда Маруся умерла, Пётр решил, что не может бездействовать. Он надел себе на голову кастрюлю, взял в руки крышку и кухонный нож и начертил на полу пентаграмму для телепортации в загробный мир. И вот уже доблестный рыцарь Пётр готов прыгнуть в ад за своей возлюбленной! Он храбро вошёл в портал и встретил там Сотону. Пётр одержал победу в этой ожесточённой схватке и спас собаку Марусю. Дома они сели пить свой любимый чай с конфетами. У Маруси почему-то был нездоровый зелёный оттенок лица, и она всё время кричала МОЗГИ!, но Пётр решил, что с этим недостатком вполне можно смириться.</div><div id="paper5"><div style="margin-top:15px;margin-left:10px;font-size:14px;">Главам подразделений и институтов.</div><div style="margin-left:60px;">От REDACTED <span style="background-color:Grey;color:Grey;">Всезнают</span>.</div><div style="margin-top:10px;">REDACTED</div><div style="position:absolute;bottom:15px;left:15px;font-size:5px;">REDACTED <span style="background-color:Grey;color:Grey;">Всезнают</span></div><div style="position:absolute;bottom:15px;right:15px;width:20px;height:20px;background-image:url(universign.png)"></div></div><div id="deankey"/>','css':{'width':'1000px','height':'500px','background-color':'#DEB887'},'canClose':true,'onClose':removeBindings});
			$('#findkeyreject').css('transform','rotate(-45deg)');
			var zIdx = [];
			for (var i = 1; i < 6; ++i)
			{
				$('#paper'+i).css({'width':'150px','height':'250px','background-color':'White','position':'absolute','z-index':1,'border':'1px solid LightGrey','cursor':'default','font-size':'8px','overflow':'hidden','padding':'5px'}).addClass('mini-dean-paper');
				zIdx[i] = s['paper'+i]['z-index'] || 1;
			}
			var hasKey = !!getCountFromInventory(inventory,'deankey');
			var setupFrames = function()
			{
				for (var i in storage['mini_lookForKey_stat'])
				{
					var lt = storage['mini_lookForKey_stat'][i];
					$('#minigame').append('<div style="border:1px dotted Red;position:absolute;z-index:0;left:'+lt[0]+'px;top:'+lt[1]+'px;width:160px;height:260px;"/>');
				}
			};
			if (hasKey)
				setupFrames();
			$('#deankey').css({'width':'40px','height':'40px','background-image':'url(deankey.png)','position':'absolute','z-index':0,'left':'700px','top':'280px'}).on('click',function(){
				addToInventory(inventory,createItem('deankey','deankey'));
				$('#deankey').hide();
				s['deankey'].display='none';
				hasKey = true;
				showMessage('Я нашёл ключ от дверей деканата. Теперь нужно привести стол в порядок, чтобы не вызвать подозрений.');
				setupFrames();
			});
			var onCleanup = function()
			{
				deandesk.active=false;
				deandesk.hint="Стол с аккуратно разложенными документами";
				window.setTimeout(function(){window.closeMinigame();},2000);
				showMessage('Отлично. Теперь можно взять зачётку.');
			};
			var checkCleanup = function()
			{
				var frameUsed = [];
				var ss = storage['mini_lookForKey_stat'];
				for (var i = 0; i < 5; ++i)
					frameUsed[i]=false;
				for (var i = 1; i < 6; ++i)
				{
					var l = parseInt($('#paper'+i).css('left'));
					var t = parseInt($('#paper'+i).css('top'));
					var f = false;
					for (var j = 0; j < 5; ++j)
						if (!frameUsed[j] && Math.abs(l-ss[j][0])<2 && Math.abs(t-ss[j][1])<2)
						{
							frameUsed[j]=true;
							f = true;
							break;
						}
					if (!f)
						return false;
				}
				return true;
			};
			for (var id in s)
				$('#'+id).css(s[id]);
			var mouseDown = false;
			var downPos = [];
			var downTarget = null;
			var downTargetId = null;
			var parentEl = $('#minigame');
			var maxIdx = function()
			{
				var r = 1;
				for (var i in zIdx)
					if (zIdx[i]>r)
						r = zIdx[i];
				return r;
			};
			var minIdx = function()
			{
				var r = 1;
				for (var i in zIdx)
					if (zIdx[i]<r)
						r = zIdx[i];
				return r;
			};
			parentEl.on('mouseup',function(){
				mouseDown=false;
				var r = minIdx()-1;
				if (r>0)
				{
					for (var i = 1; i < 6; ++i)
					{
						var v = s['paper'+i]['z-index']-r;
						s['paper'+i]['z-index']=v;
						$('#paper'+i).css('z-index',v);
						zIdx[i]=v;
					}
				}
				if (hasKey && checkCleanup())
					onCleanup();
			}).on('mouseleave',function(){mouseDown=false;});
			$('.mini-dean-paper').on('mousedown',function(ev){
				mouseDown=true;
				downTarget=$(this);
				var off = downTarget.offset();
				downPos=[ev.pageX-off.left,ev.pageY-off.top];
				var zIndex = maxIdx()+1;
				downTarget.css('z-index',zIndex);
				downTargetId=downTarget.attr('id');
				s[downTargetId]['z-index'] = zIndex;
				zIdx[downTargetId.substr(5)] = zIndex;
			}).on('mousemove',function(ev){
				if (!mouseDown)
					return;
				var x = Math.min(858,Math.max(0,ev.clientX-downPos[0]-parseInt(parentEl.css('left'))));
				var y = Math.min(258,Math.max(0,ev.clientY-downPos[1]-parseInt(parentEl.css('top'))));
				s[downTargetId].top=y;
				s[downTargetId].left=x;
				downTarget.css({'left':x,'top':y});
			});
		}
	}
};
var data;
data  = "bbbwwwwwwwwb";
data += "bbbw      wb";
data += "wwwwww w www";
data += "w   w  w   w";
data += "w   w  w   w";
data += "w      w   w";
data += "w   w  w   w";
data += "w   w  w   w";
data += "w   w  w   w";
data += "wwwwwwwwwwww";
maps[id].data = [];
for (var i = 0; i < 10; ++i)
	maps[id].data[i] = data.substr(i*12, 12).split('');
})();