var checkDiffModule = (function () {
	var latestContents = '';
	var newContents;
	var splitChar = '</p>\n\n';
	
	var setLatestContents = function() {
		latestContents = $editor.getData().split(splitChar);
		console.log(latestContents);
	};
	
	var checkDiff = function() {
		newContents = $editor.getData().split(splitChar);
		console.log(latestContents);
		console.log(newContents);
		compareContents();
	};
	
	var compareContents = function() {
		console.log("내용 비교 시작");
		var length = (latestContents.length>=newContents.length) ? latestContents.length : newContents.length;
		for(i=0; i<length; i++){
			console.log(latestContents[i]);
			console.log(newContents[i]);
			if(latestContents[i] != newContents[i])
				findDifferentPosition(latestContents[i].split(''), newContents[i].split(''));
		}
	};
	
	var findDifferentPosition = function(latestContents, newContents) {
		var length = (latestContents.length>=newContents.length) ? latestContents.length : newContents.length;
		var diffArray = new Array;
		var start, end;
		for(i=3; i<length; i++){
			if(latestContents[i]==null || newContents[i]==null)
				diffArray.push(0);
			else if(latestContents[i] != newContents[i])
				diffArray.push(0);
			else
				diffArray.push(1);
		}
		console.log(diffArray);
		start = diffArray.indexOf(0);
		console.log(start);
	
	};
	
	
	return {
		checkDiff : checkDiff,
		setLatestContents : setLatestContents
	}
})();