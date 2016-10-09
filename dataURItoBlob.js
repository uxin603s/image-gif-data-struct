function dataURItoBlob(dataURI) {
	var byteString = atob(dataURI.split(',')[1]);
	var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
	var arrayBuffer = new ArrayBuffer(byteString.length);
		
	
	var dataView = new DataView(arrayBuffer);
	for (var i = 0; i < byteString.length; i++) {
		var value=byteString.charCodeAt(i);
		dataView.setUint8(i,value)
	}
	
	// var tmp=[]
	// for(var i=0;i<byteString.length;i++){
		// var value=byteString.charCodeAt(i).toString(16);
		// if(value.length==1){
			// value="0"+value;
		// }
		// tmp.push(value)
	// }
	// console.log(tmp)
	// console.log(byteString.charCodeAt(6),byteString.charCodeAt(7))
	// console.log(dataURI.length,_ia)
		
	var blob = new Blob([dataView],{type:mimeString});
	// console.log(URL.createObjectURL(blob));
	return blob;
}