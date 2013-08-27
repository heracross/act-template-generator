$(document).ready(function(){
	var $list = $('.mod-template__list');
	var $block = $('.mod-template__block');
	var list = new Array();
	var customs = [];
	var list_choosen = {};
	var list_custom = {};
	var dragable = new Boolean(false);
	var list_length = $list.length;
	var $submit = $(".mod-template__submit");
	var $addbtn = $(".mod-template__file");
	var jsonString;
	var datas = [];
	var custom_datas = [];
	var cssSource = '';
	var htmlSource = '';
	var cssSingle = '';
	var htmlSingle = '';
	var bgHTML = "";
	var boxPos = {
		l: 0,
		t: 0
	}
	var mousePos = {
		l: 0,
		t: 0
	}
	var currentPos = {
		l: 0,
		t: 0
	}
	var choosen_length = 0;

	function Elem(name,elem1,elem2,fullname){
		this.use = false;
		this.l = 0;
		this.t = 0;
		this.fullname = fullname;
		this.name = name;
		this.selector = elem1;
		this.block = elem2;
		Elem.prototype.showOrHide = function(){
			if(!this.use){
				this.block.addClass("mod-template__block_show");
				this.selector.addClass("mod-template__checked");
			}else{
				this.block.removeClass("mod-template__block_show");
				this.selector.removeClass("mod-template__checked");
			}
			this.use = !this.use;
		};
		Elem.prototype.init = function(x,y){
			this.block.css({
				"left" : x + 'px',
				"top" : y + 'px'
			});
		}
	}

	function initElem(){
		for(var i = 0;i<list_length;i++){
			(function(num){
				list[num] = new Elem($list.eq(num).attr("name"),$list.eq(num),$block.eq(num));
			})(i);
		}
	}

	function toChoose(){
		$(".mod-template__ul").delegate("li","click",function(){
			var i = $(this).index(".mod-template__list");
			list[i].showOrHide();
		});
	}

	function initBoxPos(){
		boxPos.l = $('.mod-template__wrapper').eq(0).offset().left;
		boxPos.t = $('.mod-template__wrapper').eq(0).offset().top;
	}

	function moveBlock(){
		$(".mod-template__wrapper").delegate(".mod-template__block","mousedown",function(event){
			dragable = true;
			event.preventDefault();
			var num = $(this).index(".mod-template__block");
			var x = list[num].block.offset();
			mousePos.l = event.pageX;
			mousePos.t = event.pageY;
			$(document).mousemove(function(event){
				if(dragable){
				moveIt(list[num],event.pageX-mousePos.l,event.pageY-mousePos.t);
				mousePos.l = event.pageX;
				mousePos.t = event.pageY;
				}else{
					$(document).unbind();
					return false;
				}
			}).mouseup(function(){
					$(document).unbind();
					dragable = false;
			});
		});
	}

	function moveIt(elem,x,y){
		elem.l += x;
		elem.t += y;
		elem.init(elem.l,elem.t);
	}

	function buildJSON(){
		datas = [];
		for(var i = 0;i<list_length;i++){
			(function(num){
				if(list[num].use){
					choosen_length++;
					list_choosen = {
						"name" : list[num].name,
						"left" : list[num].l,
						"top" : list[num].t
					}
				jsonString = JSON.stringify(list_choosen);
				datas.push(list_choosen);
				}
			})(i);

		}
	}

	function getChoosenCustom(){
		custom_datas = [];
		for(var i = 0;i<customs.length;i++){
			(function(num){
				if(customs[num].use){
					list_custom = {
						"name" : customs[num].name,
						"left" : customs[num].l,
						"top" : customs[num].t,
						"fullname" : customs[num].fullname					}
					custom_datas.push(list_custom);
					createCustomOutput(list_custom);
				}
			})(i);
		}
	}



	function getLess(){
		for(var i = 0;i<datas.length;i++){
			(function(num){
				var lessURL = "mod-" + datas[num].name + "/css/import-mod-" + datas[num].name + ".less";
				$.get(lessURL,function(result){
					cssSingle = REGvalue(result,num);
					cssSource += cssSingle;
				}).done(function(){
					if(num==datas.length-1){	
						$.ajax({
				     		type: 'POST',
				     		url: "css-server.php",
					    	data: {
					    		"contain" : cssSource
					    	}
						});
					}
				});
			})(i);
		}
	}


	//将其属性值替换掉
	function REGvalue(result,n){
		var reg = /([\s\S]*)\/\*start\*\/([\s\S]*)\/\*end\*\//m;
		result = result.replace(reg,"$2");
		var r_left = /@left/g;
		var r_top = /@top/g;
		result = result.replace(r_left,datas[n].left+'px');
		result = result.replace(r_top,datas[n].top+'px');
		return result;
	}

	//匹配出div元素
	function matchHTML(result){
		var reg = /([\s\S]*)<body>([\s\S]*)<\/body>([\s\S]*)/m;
		result = result.replace(reg,"$2");
		return result;
	}

	function buildHTML(){
		console.log(datas.length);
		if(datas.length!=0){
		for(var i = 0;i<datas.length;i++){
			(function(num){
				var htmlURL = "mod-" + datas[num].name + "/html/index.html";
				$.get(htmlURL,function(result){
					result = matchHTML(result);
					htmlSource += result;
				}).done(function(){
					if(num==datas.length-1){	
						console.log(htmlSource);
						$.ajax({
				     		type: 'POST',
				     		url: "html-server.php",
					    	data: {
					    		"html" : htmlSource,
							    "bg" : bgHTML
					    	}
						});
					}
				});
			})(i);
		}
		}else{
			$.ajax({
				type: 'POST',
				url: "html-server.php",
				data: {
					"html" : htmlSource,
					"bg" : bgHTML
				}
			});
		}
	}

	function createCustomList(name,fullname){
		var c_list = '<li class="mod-template__list" name="'+name+'"><p class="mod-template__title">自定义</p><label><img class="mod-template__img" src="build/img/'+fullname+'"/><div class="mod-template__tick"></div></label></li>';
		var c_block ='<div class="mod-template__block"><img class="mod-template__img" src="build/img/'+fullname+'"/></div>';
		$("#mod-template__list-box").append(c_list);
		$("#mod-template__block-box").append(c_block);
		var newElem = new Elem(name,$(".mod-template__list").last(),$(".mod-template__block").last(),fullname);
		list.push(newElem);
		customs.push(newElem);
	}

	function createCustomOutput(obj){
		var c_html = '<div class="mod-custom__'+obj.name+'"><a class="mod-custom__link" href="#"><img src="../img/'+obj.fullname+'" class="mod-custom__img" alt=""></a></div>';
		var c_css = '.mod-custom__'+obj.name+'{position:absolute;left:'+obj.left+'px;top:'+obj.top+'px;}';
		htmlSource += c_html;
		cssSource += c_css;
	}

	$addbtn.change(function(){
		createFormdata();
	});


	function createFormdata(){
		var formElement = document.getElementById("mod-template__add-form");
		var formData = new FormData(formElement);
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "custom.php");
		xhr.send(formData);
		xhr.onreadystatechange = function(){
			if (xhr.readyState==4 && xhr.status==200){
				var shortName = xhr.responseText.replace(/(.*).(jpg|png|bmp|gif)/i,"$1");
				createCustomList(shortName,xhr.responseText);
			}
		}
	}

	function addBG(){
		var bg_form = document.getElementById("mod-template__addbg_form");
		var formData = new FormData(bg_form);
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "background.php");
		xhr.send(formData);
		xhr.onreadystatechange = function(){
			if (xhr.readyState==4 && xhr.status==200){
				var jsontext = JSON.parse(xhr.responseText);
				$(".mod-template__bg-box").css({
					"height" : jsontext.height + 'px',
					"background-image": "url(build/img/"+jsontext.name+")"
				});
				var number = parseInt((jsontext.height-1)/300)+1;
				var exheight = jsontext.height-((number-1)*300);
				buildBG(number,exheight);
			}
		}
	}

	$(".mod-template__submit-bg").click(function(){
		addBG();
		showMenu();
	});

	function initJSON(){
		$submit.click(function(){
			htmlSource = '';
			cssSource = '';
			getChoosenCustom();
			buildJSON();
			getLess();
			buildHTML();
		});
	}

	function buildBG(num,ex){
		for(var i=0;i<num-1;i++){
			(function(number){
				var background = '<div class="mod-template__bg mod-template__bg_'+number+'"></div>';
				bgHTML += background;
			})(i+1);
		}
		var lastbackground = '<div height='+ex+'px class="mod-template__bg mod-template__bg_'+num+'"></div>';
		bgHTML += lastbackground;
	}

	function showMenu(){
		$('.mod-template__ul').animate({
			"height" : "200px"
		},'2400');
		$(".mod-template__add").animate({
			"right" : "30px"
		},'2400');
		$(".mod-template__add_bg").animate({
			"opacity" : "0"
		},function(){
			$(this).css({
				"display" : "none"
			});
		});
	}


	initElem();
	toChoose();
	initBoxPos();
	moveBlock();
	initJSON();



});