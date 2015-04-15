var SvgLayout = (function($) {

	var 
		moduleMap = {
			slBlock: function(module) {
				this.type = module.type;
				this.modkey = module.modkey;
				this.containerName = module.containerName;
				this.snapObj = null;
				this.pathArray = [];
				this.contentArray = [];
				this.content = module.content;
				this.viewParams = {
					color: {
						text: '#fff',
						back: 'rgba(240, 79, 15, 0.6)',
						border: 'rgba(0, 0, 0, 0.7)'
					},
					size: {
						text: '15',
						border: 2
					},
					fontFamily: 'Sans-serif',
					animationSpeed: 1000
				};
				this.draw = function(){ 

					switch(module.type) {
						case 'horizontal': methodMap.horizontalButtons(module.modkey)
							break
						case 'vertical': methodMap.verticalButtons(module.modkey)
							break
						default: console.log("No such module '"+module.type+"'")
							break
					}
				}
			},
			slGrid: function(module) {

				this.rows = module.rows;
				this.cols = module.cols;
				this.modkey = module.modkey;
				this.containerName = module.containerName;
				this.buttons = [];

				if(module.params == undefined)
					module.params = {};

				this.viewParams = {
					fontFamily: (module.params.fontFamily? module.params.fontFamily : 'Sans-serif'),
					fontSize: ((module.params.fontSize)? module.params.fontSize : '20px'),
					borderWidth: ((module.params.borderWidth)? module.params.borderWidth : '0'),
					borderRadius: ((module.params.borderRadius)? module.params.borderRadius : '50'),
					marginSize: ((module.params.marginSize)? module.params.marginSize : '10px')
				};
			},
		},

		themeMap = {
			simple: {
				green: {
					fontColor: '#CAF5D2',
					backColor: '#17BC36',
					borderColor: '#045012'
				},
				yellow: {
					fontColor: '#5F5E4F',
					backColor: '#F6EE45',
					borderColor: '#242203'
				},
				red: {
					fontColor: '#F9E0E0',
					backColor: '#F63E3E',
					borderColor: '#510505'
				},
				blue: {
					fontColor: '#D8F1F9',
					backColor: '#3AACD2',
					borderColor: '#063F51'
				},
				orange: {
					fontColor: '#F8E3D1',
					backColor: '#ED8125',
					borderColor: '#3C1C00'
				}
			}
		},
		modulesOnPage = {},
		methodMap = {
			svgInit: null,
			moduleInit: null,

			makeButtons: null,

			horizontalButtons: null,
			verticalButtons: null,

			animate: {
				path: null,
				block: null
			},

			shuffleArray: null
		};

	methodMap.moduleInit = function(module) {

		modulesOnPage[module.modkey] = new moduleMap[module.type](module);

		jQuery(modulesOnPage[module.modkey].containerName).css({
			position: 'absolute',
			top: '0',
			left: '0',
			width: '100%',
			height: '100%'
		});

		methodMap.makeButtons(module.modkey, module.buttons);
	}

	methodMap.shuffleArray = function(array) {

		var currentIndex = array.length, temporaryValue, randomIndex ;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {

			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;

			console.log(randomIndex);
		}

		return array;
	}

	methodMap.animate.path = function(modkey, index = 0) {

		var path = modulesOnPage[modkey].pathArray[index], 
			pathLength = path.getTotalLength();

		path.animate({"stroke-dashoffset": 0}, modulesOnPage[modkey].viewParams.animationSpeed, mina.linear);

		setTimeout(function() {
			if(modulesOnPage[modkey].pathArray[++index]) {
				methodMap.animate.path(modkey, index++);
			}else{
				methodMap.animate.content(modkey);
			}
		}, modulesOnPage[modkey].viewParams.animationSpeed/2);
		return false;
	}

	methodMap.animate.content = function(modkey, index = 0) {
		
		modulesOnPage[modkey].contentArray[index].animate({ 'transform': 'T 0' }, 
		modulesOnPage[modkey].viewParams.animationSpeed, mina.linear);

		setTimeout(function() {
			if(modulesOnPage[modkey].contentArray[++index]) {
				methodMap.animate.content(modkey, index++);
			}else{
				return true			
			}
		}, modulesOnPage[modkey].viewParams.animationSpeed/2);
		return false;
	}

	methodMap.makeButtons = function(modkey, buttons) {

		if(buttons.length <  1) {
			console.log('No Links in module '+ modkey);
			return false;
		}

		var blockHeight = parseInt(jQuery(modulesOnPage[modkey].containerName).height()),
			blockWidth = parseInt(jQuery(modulesOnPage[modkey].containerName).width()),
			marginSize = parseInt(modulesOnPage[modkey].viewParams.marginSize),
			links = buttons.length,
			linkWidth = blockWidth/buttons[0].length - marginSize*2,
			linkHeight = blockHeight/buttons.length - marginSize*2,
			snap = new Snap(modulesOnPage[modkey].containerName),
			rect = null,
			filter = snap.filter('<feGaussianBlur in="SourceGraphic" stdDeviation="'+marginSize+'" result="blur" />'
								+'<feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"/>'),
			filterGroup = snap.g().attr({filter: filter});

		for(var i = 0; i<buttons.length; i++) {

			modulesOnPage[modkey].buttons.push([]);

			for(var j = 0; j<buttons[0].length; j++) {

				var button = snap.g()

				// path = snap.path('M '+(linkWidth*j+marginSize*(2*j+0.5))+' '+(linkHeight*i+marginSize*(2*i+0.5))
				// 	+'L '+(linkWidth*j+marginSize*(2*j+0.5))+' '+(linkHeight*(i+1)+marginSize*(2*i+1.5))
				// 	+', '+(linkWidth*(j+1)+marginSize*(2*j+1.5))+' '+(linkHeight*(i+1)+marginSize*(2*i+1.5))
				// 	+', '+(linkWidth*(j+1)+marginSize*(2*j+1.5))+' '+(linkHeight*i+marginSize*(2*i+0.5))
				// 	+', '+(linkWidth*j+marginSize*(2*j+0.5))+' '+(linkHeight*i+marginSize*(2*i+0.5))).attr({stroke: '#000'});

				rect = snap.rect( (linkWidth*j+marginSize*(2*j+1)), (linkHeight*i+marginSize*(2*i+1)), linkWidth, linkHeight).attr({
					rx: blockHeight/modulesOnPage[modkey].viewParams.borderRadius,
					ry: blockHeight/modulesOnPage[modkey].viewParams.borderRadius,
					strokeWidth: modulesOnPage[modkey].viewParams.borderWidth,
					stroke: buttons[i][j].theme.borderColor,
					fill: buttons[i][j].theme.backColor
				}).drag();

				text = snap.text(((linkWidth+marginSize*2)*(j+0.5)), ((linkHeight+marginSize*2)*(i+0.5)), buttons[i][j].content).attr({
					fill: buttons[i][j].theme.fontColor,
					'font-family': modulesOnPage[modkey].viewParams.fontFamily,
					'font-size': modulesOnPage[modkey].viewParams.fontSize,
					'dominant-baseline': 'middle',
					'font-weight': 'bold',
					textAnchor: "middle"
				});

				filterGroup.add(rect);
			}
		}
	}

	methodMap.slInit = function(modules) {

		for (var key in modules) {

			if(moduleMap.hasOwnProperty(modules[key].type)) {
				methodMap.moduleInit(modules[key]);
			}
		}
	}

	return {
		init: methodMap.slInit,
		mods: modulesOnPage,
		theme: themeMap
	};

}(Snap));

document.addEventListener("DOMContentLoaded", function () {

	var consoleFunction = function() {
			console.log(this);
		},
		themes = SvgLayout.theme;

	SvgLayout.init([
		{
			type: 'slGrid',
			modkey: 'gridTest',
			containerName: '#gridTest',
			buttons: [
				[
					{content: "\uf206", click: consoleFunction, theme: themes.simple.green},
					{content: "\uf1e2", click: consoleFunction, theme: themes.simple.red},
					{content: "\uf1ce", click: consoleFunction, theme: themes.simple.yellow},
					{content: "\uf0c2", click: consoleFunction, theme: themes.simple.blue},
					{content: "\uf126", click: consoleFunction, theme: themes.simple.orange},
				],
				[
					{content: "\uf0f4", click: consoleFunction, theme: themes.simple.green},
					{content: "\uf0e5", click: consoleFunction, theme: themes.simple.red},
					{content: "\uf219", click: consoleFunction, theme: themes.simple.yellow},
					{content: "\uf0f3", click: consoleFunction, theme: themes.simple.blue},
					{content: "\uf06d", click: consoleFunction, theme: themes.simple.orange}
				]
			],
			params : {
				fontFamily: 'FontAwesome',
				fontSize: '30px'
			}
		}
	]);
}, false);

//Проверить совпадение имен модулей на странице
//Сделать обертку
//Сделать резиновые модули
//Сетка()