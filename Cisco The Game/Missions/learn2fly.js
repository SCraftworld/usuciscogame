missions["learn2fly"] = {
	"playerId":"sal",
	"playerName":"Ярсал",
	"startMapId":"518",
	"quests":{
		"primary":{
			"name":"Понедельник - день тяжёлый",
			"primary": true,
			"start":"appear",
			"appear":
			{
				"logEntry": "В углу аудитории стоит огнетушитель. Стоит взять его с собой на случай опасности.",
				"triggeredBy": {"mapStarted":{"map":"518"}},
				"next": ["extinguisherAdded","takeTest"]
			},
			"extinguisherAdded":
			{
				"logEntry": "Огнетушитель помещён в инвентарь. Теперь можно заняться другими делами. Надо заглянуть в мой компьютер.",
				"triggeredBy": {"inventoryAdd":{"item":"fireex"}},
				"next": "takeTest"
			},
			"takeTest":
			{
				"logEntry": "На преподавательском компьютере кто-то оставил открытый тест! Нужно закончить его.",
				"triggeredBy": {"walk":{"map":"518","i":2,"j":8}},
				"next": "goToDean"
			},
			"goToDean":
			{
				"logEntry": "Так себе результат. Видимо, много ошибок было в первых 37 вопросах. Ладно, максимальный балл больше 70, а значит пришло время порисовать в зачётке. Только как попасть в деканат, если уже 15:01 и он закрыт? Не через окно же лезть...",
				"action":function(){
					var c = getItem("instructor");
					c.active = false;
					c.hint = "";
					for (var i = 1; i <= 8; ++i)
						if (i != 4 && i != 5)
							maps['518'].doors['w'+i].locked = false;
				},
				"triggeredBy": {"dialogEnd":{"id":"takeQuiz"}},
				"next": "atDean"
			},
			"atDean":
			{
				"logEntry": "Я в кабинете декана. Теперь нужно каким-то образом открыть дверь в комнату секретаря. Наверняка у декана есть запасной ключ где-то неподалёку.",
				"triggeredBy": {"mapStarted":{"map":"dean-office"}},
				"next": "return518"
			},
			"return518":
			{
				"logEntry": "Фух, ну и денёк. Зачётка у меня. Пора возвращаться в 518.",
				"triggeredBy": {"inventoryAdd":{"item":"recordbook"}},
				"next": "greatSuccess"
			},
			"greatSuccess":
			{
				"logEntry": "Ну что же. Кровь в зачётке студента уже подсохла да и день уже кончается. Пора идти домой.",
				"triggeredBy": {"mapStarted":{"map":"518"}},
				"success": true
			}
		},
		"fixRack":{
			"start":"approach",
			"approach":
			{
				"logEntry": "С оборудованием в этой стойке творится что-то неладное...",
				"triggeredBy": {"walk":{'map':'518','i':2,"j":5}},
				"action":function(){
					getItem("rack").active = true;
				},
				"next":"fix"
			},
			"fix":
			{
				"logEntry": "Студенты беспорядочно повтыкали провода в свитчи, пытаясь построить какую-то топологию. Однако, они не учли, что оборудование настолько старое, что не поддерживает STP! Нужно убрать лишние соединения, оставив связь между всеми свичами. Коробки с проводами были где-то неподалёку...",
				"triggeredBy": {"useItem":{"item":"rack"}},
				"next":"fixed"
			},
			"fixed":
			{
				"logEntry": "Вот и всё. Я прекрасно справился с задачей физического STP.",
				"triggeredBy": {"minigameFinish":{"id":"rackFix","result":"success"}},
				"success": true
			},
			"name":"Привести в порядок стойку с оборудованием"
		},
		"takeCert":
		{
			"start":"approach",
			"approach":
			{
				"logEntry": "На столе лежит сертификат CCNP. Он может мне пригодиться.",
				"triggeredBy": {"walk":{'map':'518','_condition':function(i,j){return (i<4&&j>5);},'_conditionArgs':['i','j']}},
				"next": "taken"
			},
			"taken":
			{
				"logEntry": "Хорошо. Теперь у меня есть сертификат CCNP.",
				"triggeredBy": {"inventoryAdd":{"item":"cert"}},
				"success": true
			},
			"name": "Защита знаний"
		}
	}
};