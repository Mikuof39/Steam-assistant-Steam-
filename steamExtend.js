/**
 * steamExtend.js
 * @file 存储对当前steam的功能增强代码 [steam功能拓展]
 */

function addRemoveFriendRemind(){ /*添加删除好友提醒*/
	let obj = document.getElementsByClassName("manage_action btnv6_lightblue_blue btn_medium");
	for (let i = 0; i < obj.length; i++) {
		if(obj[i].onclick == null)
			continue;
		let funcText = obj[i].onclick.toString();
		if(funcText.indexOf("ExecFriendAction('remove', 'friends/all')") != -1) //是否是移除好友按钮
		{
			obj[i].onclick = ()=>{
				ShowConfirmDialog('您点击了移除好友按钮', '是否要移除选择的好友?','移除好友').done( function(){
					console.log("移除好友");
					ExecFriendAction('remove', 'friends/all');
					}).fail( function(){
					console.log("取消移除好友");
					});
			}
			return 1;
		}
	}
	return 0;
}
//-----------------------------------------------------------------------------------
function getLoginStatus(){
	if(g_steamID == false)
		return false; //没有登陆
	else if(typeof g_steamID == "string" && g_steamID.indexOf('7656119')==0)
		return true; //成功登陆
}
//-------------------------------------------------------------------------------------------------------------
function addFriendMultipleSelectionMode(){ //添加好友多选模式
	var key_mode = 0;
	var index_arr = [2];
	index_arr[0] = undefined;
	index_arr[1] = undefined;


	var obj = document.getElementById("search_text_box");
	obj && obj.blur(); //搜索框取消获得的焦点
	
	jQuery("#search_results .selectable").click(function(e) {
		var id = jQuery(this).attr("id"); //id
		var index = jQuery(this).index(); //下标
		//console.log(id,index);//得到点击的a标签的title值
		
		switch (key_mode){
			case 0:
				index_arr[0] = index-2;
				//console.log(index_arr[0]);
				break;
			case 1: //~ 反选
				break;
			case 2: //alt 重新选择
				break;
			case 3: //shift 好友快速多选模式
				if(index_arr[0] == undefined)
					index_arr[0] = index-2;
				else if(index_arr[0] == index-2){ //同一个元素
					
				}
				else{
					//取消选择文字
					document.selection && document.selection.empty && ( document.selection.empty(), 1)
					|| window.getSelection && window.getSelection().removeAllRanges();
					//遍历并选择之间的内容
					index_arr[1] = index-2;
					var obj = jQuery("#search_results>.selectable");
					var arr = obj.slice( index_arr[0],index_arr[1]);
					arr.addClass("selected");
					for (let i = 0; i < arr.length; i++) {
						arr[i].getElementsByClassName("select_friend_checkbox")[0].checked = true; //选中
					}
					UpdateSelection(); //官方，更新计数
					console.log("好友快速多选已完成!",index_arr[0],index_arr[1]);
					//index_arr[0] = undefined;
					//index_arr[1] = undefined;
				}
				break;
			default:
				break;
		}
	}); //选择的朋友总数
	
	document.addEventListener("keydown", function(e){ //~ 反选
		//console.log(e.keyCode);
		//console.log(e.shiftKey,e.altKey);
		if(e.keyCode == 192){
			key_mode = 1;
			//console.log("~ down");
			
			var obj = jQuery("#search_results>.selectable");
			obj.toggleClass("selected");
			for (let i = 0; i < obj.length; i++) {
				var bool = obj[i].getElementsByClassName("select_friend_checkbox")[0].checked;
				obj[i].getElementsByClassName("select_friend_checkbox")[0].checked = !bool; //全部取消选中
			}
			UpdateSelection(); //官方，更新计数
			console.log("~ 反选");
			return false;
		}
	}, false);
	//-----------------------------------------------------------------------------------
	shortcut.add("Esc",function() { //alt 重新选择
		key_mode = 2;
		//console.log("Alt");
		
		var obj = jQuery("#search_results>.selectable");
		obj.removeClass("selected");
		for (let i = 0; i < obj.length; i++) {
			obj[i].getElementsByClassName("select_friend_checkbox")[0].checked = false; //全部取消选中
		}
		UpdateSelection(); //官方，更新计数
		console.log("Esc 重新选择");
	}, {
		'type':'keydown', //事件
		'propagate':false, //是否支持冒泡
		'disable_in_input':false, //是否在输入框内有效
		'target':document, //作用范围
	});
	//-----------------------------------------------------------------------------------
	shortcut.add("Shift",function() { //shift 好友快速多选模式
		key_mode = 3;
		//console.log("Shift");
	}, {
		'type':'keydown', //事件
		'propagate':false, //是否支持冒泡
		'disable_in_input':false, //是否在输入框内有效
		'target':document, //作用范围
	});
	//-----------------------------------------------------------------------------------
	document.addEventListener("keyup", function(e){
		//console.log(e.keyCode);
		//console.log(e.shiftKey,e.altKey);
		if(e.keyCode == 192){
			key_mode = 0;
			//console.log("~ UP");
			return false;
		}
		else if(e.keyCode == 27){
			key_mode = 0;
			//console.log("Esc UP");
			return false;
		}
		else if(e.keyCode == 16){
			key_mode = 0;
			//console.log("Shift UP");
			return false;
		}
	}, false);
}
//-------------------------------------------------------------------------------------------------------------------------------------------------
function getSelectedText() {
    if (window.getSelection) {
      return window.getSelection().toString();
    } else if (document.selection) {
      return document.selection.createRange().text;
    }
    return '';
}

function selectText(element) {
	var text = document.getElementById(element);
	text.focus();
	text.select();
	var selection = window.getSelection();
	return selection.toString();
}

function getDifferentIndex(str1,str2){
	var length =  str1.length < str2.length ? str2.length : str1.length; //取最大长度
	var value; //相差的长度
	if(length == str1.length)
		value= str1.length - str2.length;
	else
		value= str2.length - str1.length;
	
	var i;
	for (i = 0; i < length; i++) {
		if(str1.charCodeAt(i) != str2.charCodeAt(i)) //如果超出范围charCodeAt()返回NaN
		{
			if(str1.charCodeAt(i) == NaN || str2.charCodeAt(i) == NaN)
				return i+value; //选择的是末尾，从不一样的位置+不一样的长度
			else
				return i; //选择的是中间，两个数不一样，返回不一样的位置
		}
		
	}
	return -1; //没有找到返回-1
}

async function setSelectTextMode(mode){
	var eleName;
	
	const text_format = [{
			tag_start: "[h1]",
			tag_end: "[/h1]"
		},{
			tag_start: "[b]",
			tag_end: "[/b]"
		},{
			tag_start: "[u]",
			tag_end: "[/u]"
		},{
			tag_start: "[i]",
			tag_end: "[/i]"
		},{
			tag_start: "[strike]",
			tag_end: "[/strike]"
		},{
			tag_start: "[spoiler]",
			tag_end: "[/spoiler]"
		},{
			tag_start: "[noparse]",
			tag_end: "[/noparse]"
		},{
			tag_start: "[url=",
			tag_middle: "]",
			tag_end: "[/url]"
		}
	]
	var ele;
		switch (inBoxonblurID){
			case 0:
				ele = document.getElementById("comment_textarea");
				eleName = "comment_textarea";
				break;
			case 1:
				ele = document.getElementById("comment_textarea_en");
				eleName = "comment_textarea_en";
				break;
			case 2:
				ele = document.getElementById("comment_textarea_jp");
				eleName = "comment_textarea_jp";
				break;
			case 3:
				ele = document.getElementById("comment_textarea_zhc");
				eleName = "comment_textarea_zhc";
				break;
			case 4:
				ele = document.getElementById("comment_textarea_zh_sg");
				eleName = "comment_textarea_zh_sg";
				break;
			case 5:
				ele = document.getElementById("comment_textarea_zh_hant");
				eleName = "comment_textarea_zh_hant";
				break;
			case 6:
				ele = document.getElementById("comment_textarea_zh_hk");
				eleName = "comment_textarea_zh_hk";
				break;
			case 7:
				ele = document.getElementById("comment_textarea_zh_mo");
				eleName = "comment_textarea_zh_mo";
				break;
			case 8:
				ele = document.getElementById("comment_textarea_zh_tw");
				eleName = "comment_textarea_zh_tw";
				break;
			default:
				break;
		}
		//debugger
	var str = getSelectedText(); //获取选择的文本内容
	var oldText = ele.value; //输入框原来的值  document.activeElement.value
	var selection = window.getSelection();
	var selectionStr = selection.toString(); //为了区分是全选了还是根本就没有选择
	var obj = ele; //当前焦点所在的元素 document.activeElement
	var nSelectionStart;
	var elTextArea;
	if(str == ""){ //是否没有选择任何的文本
		elTextArea = ele; //设置为指定的留言框 document.activeElement
		if (elTextArea) {
			nSelectionStart = elTextArea.selectionStart;//
			if(nSelectionStart == undefined) //如果没有输入
			{
				nSelectionStart = 0;
				elTextArea.value = "";
			}
		    newMess = elTextArea.value.substr(0, nSelectionStart);
		}
	}
	else{
		var iindex = ele.selectionStart; //
		await window.getSelection().deleteFromDocument(); /*删除选择的文本*/
		var newText = selectText(eleName); //输入框现在的值
		if(newText == oldText){
			//debugger
			return;
		}
		//debugger
		var index;
		// if(iindex != 0 )//是否在开头(针对于相同的字符)
		// 	index = getDifferentIndex(oldText,newText); //getDifferentIndex(oldText,newText); //ele.selectionStart
		// else
			index = iindex;
		
		console.log("index",index);
		var endIndex = index + str.length;
		
		var newMess = oldText.slice(0,index); //添加开头
	}
	switch (mode){
		case 1:
			newMess += text_format[0].tag_start + str + text_format[0].tag_end; //处理选择的文本并添加
			if(selectionStr == "" && selection.toString() == ""){ //为了区分是全选了还是根本就没有选择
				elTextArea.selectionStart = nSelectionStart + (text_format[0].tag_start + str + text_format[0].tag_end).length;
			}
			break;
		case 2:
			newMess += text_format[1].tag_start + str + text_format[1].tag_end; //处理选择的文本并添加
			if(selectionStr == "" && selection.toString() == ""){
				elTextArea.selectionStart = nSelectionStart + (text_format[1].tag_start + str + text_format[1].tag_end).length;
			}
			break;
		case 3:
			newMess += text_format[2].tag_start + str + text_format[2].tag_end; //处理选择的文本并添加
			if(selectionStr == "" && selection.toString() == ""){
				elTextArea.selectionStart = nSelectionStart + (text_format[2].tag_start + str + text_format[2].tag_end).length;
			}
			break;
		case 4:
			newMess += text_format[3].tag_start + str + text_format[3].tag_end; //处理选择的文本并添加
			if(selectionStr == "" && selection.toString() == ""){
				elTextArea.selectionStart = nSelectionStart + (text_format[3].tag_start + str + text_format[3].tag_end).length
			}
			break;
		case 5:
			newMess += text_format[4].tag_start + str + text_format[4].tag_end; //处理选择的文本并添加
			if(selectionStr == "" && selection.toString() == ""){
				elTextArea.selectionStart = nSelectionStart + (text_format[4].tag_start + str + text_format[4].tag_end).length;
			}
			break;
		case 6:
			newMess += text_format[5].tag_start + str + text_format[5].tag_end; //处理选择的文本并添加
			if(selectionStr == "" && selection.toString() == ""){
				elTextArea.selectionStart = nSelectionStart + (text_format[5].tag_start + str + text_format[5].tag_end).length;
			}
			break;
		case 7:
			newMess += text_format[6].tag_start + str + text_format[6].tag_end; //处理选择的文本并添加
			if(selectionStr == "" && selection.toString() == ""){
				elTextArea.selectionStart = nSelectionStart + (text_format[6].tag_start + str + text_format[6].tag_end).length;
			}
			break;
		case 8:
			newMess += text_format[7].tag_start + text_format[7].tag_middle + str + text_format[7].tag_end; //处理选择的文本并添加
			if(selectionStr == "" && selection.toString() == ""){
				elTextArea.selectionStart = nSelectionStart + (text_format[7].tag_start + str + text_format[7].tag_end).length;
			}
			break;
		default:
			break;
	}
	if(selectionStr == "" && selection.toString() == ""){ //是否没有选择任何的文本
		newMess += elTextArea.value.substr(nSelectionStart)
	}
	else{
		newMess += oldText.slice(endIndex); //添加结尾
	}
	obj.value = newMess; //重新赋值给输入框
	obj.focus(); //获取焦点，如果不在视野里，会把镜头拉过去
}
//setSelectTextMode(1)
//-------------------------------------------------------------------------------------------------------------------------------------------------
function add_commentthread_textarea_allSelect(){ //添加留言框全选
	document.addEventListener("mousedown", function(e){
		//console.log(e.button);
		if(e.button == 1){
			if(document.activeElement.id.indexOf("comment_textarea") != -1){ //当前焦点所在的元素如果是留言框才全选
				let obj;
					switch (inBoxonblurID){
						case 0:
							obj = document.getElementById("comment_textarea");
							break;
						case 1:
							obj = document.getElementById("comment_textarea_en");
							break;
						case 2:
							obj = document.getElementById("comment_textarea_jp");
							break;
						case 3:
							obj = document.getElementById("comment_textarea_zhc");
							break;
						case 4:
							obj = document.getElementById("comment_textarea_zh_sg");
							break;
						case 5:
							obj = document.getElementById("comment_textarea_zh_hant");
							break;
						case 6:
							obj = document.getElementById("comment_textarea_zh_hk");
							break;
						case 7:
							obj = document.getElementById("comment_textarea_zh_mo");
							break;
						case 8:
							obj = document.getElementById("comment_textarea_zh_tw");
							break;
						default:
							break;
					}
					obj.focus();
					obj.select();
					e.stopPropagation(); 
					e.stopImmediatePropagation();
					e.preventDefault();
				return false;
			}
			return false;
		}
	}, false);
	
	
	document.addEventListener("keyup", function(e){
		//console.log(e.keyCode);
		//console.log(e.shiftKey,e.altKey);
		if(e.keyCode == 18){ //Alt
		let obj;
			switch (inBoxonblurID){
				case 0:
					obj = document.getElementById("comment_textarea");
					break;
				case 1:
					obj = document.getElementById("comment_textarea_en");
					break;
				case 2:
					obj = document.getElementById("comment_textarea_jp");
					break;
				case 3:
					obj = document.getElementById("comment_textarea_zhc");
					break;
				case 4:
					obj = document.getElementById("comment_textarea_zh_sg");
					break;
				case 5:
					obj = document.getElementById("comment_textarea_zh_hant");
					break;
				case 6:
					obj = document.getElementById("comment_textarea_zh_hk");
					break;
				case 7:
					obj = document.getElementById("comment_textarea_zh_mo");
					break;
				case 8:
					obj = document.getElementById("comment_textarea_zh_tw");
					break;
				default:
					break;
			}
			obj.focus();
			obj.select();
			e.stopPropagation(); 
			e.stopImmediatePropagation();
			e.preventDefault();
			//console.log("Alt UP");
			return false;
		}
	}, false);
}

