var stompClient = null;
var id = '';
var timer;
var cursorPos = 0;
var isWriting = 0;
var startPosition = 0;
var line;
var changedText = '';

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    $("#name").prop("disabled", connected);
    
    if(connected)
    	$("#edit_div").show();
    else {
    	$("#name").val("");
    	$("#edit_div").hide();
    }
}

function connect() {
    var socket = new SockJS('/intern-editing-websocket');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        setConnected(true);
        console.log('Connected: ' + frame);
        stompClient.subscribe('/subscribe/editingText/'+id, function (editedText) {
        	updateText(JSON.parse(editedText.body));
        });
        stompClient.subscribe('/user/subscribe/editingText/'+id, function (editedText) {
        	updateText(JSON.parse(editedText.body));
        });
        stompClient.subscribe('/subscribe/editingTitle/'+id, function (editedText) {
        	updateTitle(JSON.parse(editedText.body));
        });
    });
}

function disconnect() {
    if (stompClient != null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

function editText() {
	//test();
	
	var textArea = $("#textArea").val();
	var textArr = textArea.split('\n');
	cursorPos = $("#textArea").getCursorPosition();
	var insertedText = textArea.substring(0, cursorPos );
	var line = insertedText.split('\n').length;
	console.log("line: " + line);

    stompClient.send("/app/editText2/"+id, {}, JSON.stringify({
    	'writer': $("#name").val(),
    	'text': textArr[line-1],
    	'line': line
    	}));
}

function test() {
	var textArea = $("#textArea").val();
	var textArr = textArea.split('\n');
	cursorPos = $("#textArea").getCursorPosition();
	var insertedText = textArea.substring(0, cursorPos );
	
	var line = insertedText.split('\n').length;
	console.log(line + " 번째 문자열 : " + textArr[line-1]);
	
	
//	var point  = 0;
//	console.log("커서 위치: " + cursorPos);
//	
//	for(i=0; i<arr.length; i++){
//		point = cursorPos - (arr[i].length);
//		console.log("point 값: " + point);
//		if (point <= 0) {
//			console.log("줄번호: " + i);
//			//break;
//		}
//	}
	
	//console.log("point 값: " + point);
}

function updateText(message) {
	if( $("#name").val() != message.writer) {
//		var text = $("#textArea").val().split('\n');
//		text[message.line-1] = message.text;
//		
//		var textString = '';
//		
//		for(i=0; i<text.length; i++){
//			textString += text[i];
//			if(i != text.length-1)
//				textString += '\n';
//		}
		cursorPos = $("#textArea").getCursorPosition();
		$("#textArea").val(message.text);
		$("#textArea").setSelection(cursorPos,cursorPos);
	}
}

function editTitle() {
	stompClient.send("/app/editTitle/"+id, {}, JSON.stringify({
    	'writer': $("#name").val(),
    	'title': $("#title").val()
    	}));
}

function updateTitle(message) {
	if( $("#name").val() != message.writer) {
		cursorPos = $("#title").getCursorPosition();
		$("#title").val(message.title);
		$("#title").setCursorPosition(cursorPos);
	}
}

function saveContents() {
	var form = {
			'id': id,
			'latest_writer': $("#name").val(),
			'title': $('#title').val(),
			'text': $("#textArea").val()
	};
	
	$.ajax({
		url: "/editing/save",
		method: "post",
		type: "json",
		contentType: "application/json",
		data: JSON.stringify(form),
		success: function(data){
			alert("저장되었습니다.");
			$(location).attr('href', "/editList");
		},
		error: function(result){
      	   console.log(result);
     	   console.dir(result);
        }
	})
}

function deleteContents() {
	$.ajax({
		url: "/editing/delete/" + id,
		method: "post",
		success: function(data){
			alert("삭제되었습니다.");
			$(location).attr('href', "/editList");
		},
		error: function(result){
      	   console.log(result);
     	   console.dir(result);
        }
	})
}

function checkKey(event) {
	console.log("key : " + event.key);
	console.log("key code: " + event.keyCode);
	console.log("cursor position: " + $("#textArea").getCursorPosition());
}

function startInterval() {
	timer = setInterval(function(){
		console.log(new Date());
		isWriting = 0;
		changedText = getChangedText();
		sendSocket(changedText);
		clearInterval(timer);
	}, 4000);
}

function editing() {
	clearInterval(timer);
	if(isWriting == 0) {
		isWriting = 1;
		startPosition = $("#textArea").getCursorPosition();
		
		var insertedText = $("#textArea").val().substring(0, startPosition );
		line = insertedText.split('\n').length;
		
		console.log("startPosition: " + startPosition);
		console.log("line: " + line);
	}
	startInterval(timer);

}

function getChangedText() {
	cursorPos = $("#textArea").getCursorPosition();
	var text = $("#textArea").val().substring(startPosition, cursorPos);
	
	console.log(text);
	return text;
}

function sendSocket(changedText) {
	stompClient.send("/app/editText2/"+id, {}, JSON.stringify({
    	'writer': $("#name").val(),
    	'text': changedText,
    	'line': line,
    	'startPosition': startPosition
    	}));
}

$(function () {
	id = $('#id').val();
	//startInterval();
	
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $( "#connect" ).click(function() { connect(); });
    $( "#disconnect" ).click(function() { disconnect(); });
    $( "#textArea" ).keyup(function(data) { 
    	//console.dir(data);
    	//checkKey(data);
    	//editText();
    	//editing();
    });
    $( "#title" ).keyup(function() { editTitle(); });
    $( "#save" ).click(function() { saveContents(); });
    $( "#delete" ).click(function() { deleteContents(); });
    $( "#list" ).click(function() { disconnect(); });
    
   // $( "#textArea" ).on('input', function(data) { console.dir(data); editText(); });
});