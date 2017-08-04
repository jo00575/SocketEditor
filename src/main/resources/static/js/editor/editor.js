var $id = '';
var $revision;
var $keydownPosition = 0;
var $iskeyPressed = false;
var smartEditor = [];
var $editor;
var $editorReadConfig;
var $contents;

function editTitle() {
	stompClient.send("/app/editTitle/"+$id, {}, JSON.stringify({
    	'writer': $("#name").val(),
    	'title': $("#title").val()
    	}));
}

function updateTitle(message) {
	if( $("#name").val() != message.writer) {
		$("#title").val(message.title);
	}
}


function updateText(message) {
	//$revision = message.sequence;
	if( $("#name").val() != message.writer) { //본인이 수정한 메시지가 아닐 경우

		var position = updateTextModule.modifyCursorPosition(message);
		var line = cursorModule.getCurrentLine();
		if(line>message.line && message.keyCode==13)
			line++;
		updateTextModule.setCurrentState(message);
		updateTextModule.setText(message);
		console.log(position);
		console.log(line);
		if(position){
			$editor.focus();
			var selection = $editor.getSelection();
			var range = selection.getRanges()[0];
			var node = range.startContainer;
			var parents = node.getParents(true);
			var node = parents[parents.length - 2].getFirst();

			for(i=0; i<line; i++){
				node = node.getNext();
			}
			
			selection.selectElement(node);
			range = selection.getRanges()[0];
			range.collapse(false);
			selection.selectRanges(range);
			var element = selection.getStartElement();
			range.setStart(element.getFirst(), position);
			range.setEnd(element.getFirst(), position);
			range.select();
		}
			
		//var selection = $editor.getSelection();
		//console.dir(selection.root.$.childNodes);


	} else { //본인이 수정한 경우 : 내용 저장
		//saveContents(true);
		if(message.keyCode==8 && message.cursorPosition==0){
			if( message.lineText==null){
				var selection = $editor.getSelection();
				var range = selection.getRanges()[0];
				var position = range.startContainer.$.textContent.length;
				cursorModule.setCursorPosition(position);
			} else {
				var selection = $editor.getSelection();
				var range = selection.getRanges()[0];
				console.log(range);
				var position = range.startContainer.$.textContent.length - message.lineText.length;
				cursorModule.setCursorPosition(position);
				
				var node = range.startContainer;
				console.log(node);
				var childNode = node.$.childNodes;
				childNode[0].data += childNode[1].data;
				childNode[1].remove(false);
				console.log(childNode);
				cursorModule.setCursorPosition(position);
			}
			
		}
	}
	
}

function saveContents(isWriting) { //내용 저장 및 업데이트
	var form = {
			'id': $id,
			'latest_writer': $("#name").val(),
			'title': $('#titleInput').val(),
			'text': $editor.getData()
	};
	
	$.ajax({
		url: "/editor/save",
		method: "post",
		type: "json",
		contentType: "application/json",
		data: JSON.stringify(form),
		success: function(data){
			if(isWriting){ //텍스트 수정 중 : 실시간 저장
				console.log("내용 저장 완료");
			} else { //사용자가 'Save'를 클릭했을 경우
				alert("저장되었습니다.");
				$(location).attr('href', "/editList");
			}
		},
		error: function(result){
      	   console.log(result);
     	   console.dir(result);
        }
	})
}

function deleteContents() { //내용 삭제
	$.ajax({
		url: "/editor/delete/" + $id,
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


$(function () {
	$id = $('#id').val();
	$editor = CKEDITOR.replace('txtEdt');
	$( "#titleInput" ).hide();
	
	 $("form").on('submit', function (e) {
	        e.preventDefault();
	    });
	
	$editor.on("instanceReady", function(ev){
		$editorReadConfig = ev.editor;
		$editorReadConfig.setReadOnly(true);
		//console.log($editorReadConfig);
		
		this.document.on("keyup", function(event){
			var keyCode = event.data.$.keyCode;
			if(keyCode!=13)
				keyEventModule.onKeyUp(event.data.$);

		});
		this.document.on("keydown", function(event){
			var keyCode = event.data.$.keyCode;
			if(keyCode!=13)
				keyEventModule.onKeyDown(event.data.$);
		});
	});
	
	$editor.on('key', function(event){
		if(event.data.keyCode==13)
			keyEventModule.onEnterKey(event.data);
		else if(event.data.keyCode==8)
			keyEventModule.onBackspaceKey(event.data);
	});
	
	 $( "#titleDiv" ).click(function(event) { 
	    	$( "#titleDiv" ).hide();
	    	$( "#titleInput" ).show();
	    	$( "#titleInput" ).focus();
	    });
	 $( "#titleInput" ).blur(function(event) { 
	    	$( "#titleDiv" ).html('<h3>'+$( "#titleInput" ).val()+'</h3>');
	    	$( "#titleDiv" ).show();
	    	$( "#titleInput" ).hide();
	    });

    $( "#connect" ).click(function() { 
    	connect(); 
    	//setInterval("checkDiff(test)", 5000);
    	});
    
    $( "#save" ).click(function() { saveContents(false); });
    $( "#delete" ).click(function() { deleteContents(); });
    
    
});