function lzw_encode(){
	
}
function lzw_decode(lzw_min_code,array){
	// console.log(lzw_min_code,array)
	// return [];
	var count=Math.pow(2,lzw_min_code);
	var table=[];
	for(var i=0;i<count;i++){
		table.push([i])
	}
	table.push(["clear code"])
	table.push(["end of information code"])
	
	var code1=array.indexOf(count)
	if(code1!=-1){
		array.splice(code1,1)
	}else{
		// array.shift();
	}
	var code2=array.indexOf(count+1)
	if(code2!=-1){
		array.splice(code2,1)
	}
	// console.log(table)
	// return []
	var result=[];
	var k;
	for(var i in array){
		if(i==0){
			k=table[array[i]][0];
			result.push(k);
			continue;
		}
		
		var color=table[array[i]];
		console.log(i-1,i,array[i],k)
		if(color){
			result=result.concat(color);
			k=color[0];
			console.log("y")
			
			var tmp=table[array[i-1]].concat(k);
		}else{
			console.log("n")
			k=table[array[i-1]][0];
			var tmp=table[array[i-1]].concat(k)
			result=result.concat(tmp);
		}
		table.push(tmp);
	}
	return result;
}
function decode_byte(binary_arr){
	console.log("decode_byte")
	// console.log(JSON.parse(JSON.stringify(binary_arr)))
	var lzw_min_code=binary_arr.shift();
	var lzw_len=binary_arr.shift();
	// console.log(lzw_min_code,lzw_len)
	var data=binary_arr.splice(0,lzw_len).reverse().map(function(value){
		var tmp=value.toString(2).split("");
		while(tmp.length<8)tmp.unshift("0");
		return tmp.join("");
	}).join("").split("");
	
	
	var lzw_end=binary_arr.shift();
	
	var result=[];
	while(data.length){
		var count=(result.length*1+4).toString(2).length;
		if(data.length<count){// 補滿8位元用 可捨棄
			// console.log(count,data)
			break;
		}
		var t1=data.splice(-1*count,count).join("");
		var t2=parseInt(t1,2);
		result.push(t2);
	}
	// console.log(JSON.parse(JSON.stringify(result)))
	
	return lzw_decode(lzw_min_code,result);
	// return [];
}
function get_canvas_edge(binary_arr){
	var tmp_arr=binary_arr.splice(0,2);
	var edge=0;
	for(var i in tmp_arr){
		edge+=tmp_arr[i]*(1+i*255);
	}
	return edge;
}

function packed_field(binary_arr,split_arr,callback){
	var data=binary_arr.splice(0,1).pop().toString(2).split("");

	while(data.length<8)data.unshift("0");
	var result={};
	for(var i in split_arr){
		result[i]=data.splice(0,split_arr[i]).join("");
	}
	return result;
}
function get_format(binary_arr){
	var tmp_arr=binary_arr.splice(0,6);
	var format="";
	for(var i in tmp_arr){
		format+=String.fromCharCode(tmp_arr[i]);
	}
	return format;
}


function Extension_process(binary_arr){
	function PlainTextExtension(binary_arr){
		console.log("PlainTextExtension")
		if(binary_arr[0]==33 && binary_arr[1]==1){
			binary_arr.shift()
			binary_arr.shift()
			var tmp_arr=binary_arr.splice(0,binary_arr.shift());
			binary_arr.shift()
		}
	}
	function GraphicsControlExtension(binary_arr){
		console.log("GraphicsControlExtension")
		if(binary_arr[0]==33 && binary_arr[1]==249){
			var tmp_arr=binary_arr.splice(0,8);
		}
	}
	function CommentExtension(binary_arr){
		console.log("CommentExtension")
		if(binary_arr[0]==33 && binary_arr[1]==254){
			binary_arr.shift()
			binary_arr.shift()
			var tmp_arr=binary_arr.splice(0,binary_arr.shift());
			binary_arr.shift()
		}
	}
	function ApplicationExtension(binary_arr){
		console.log("ApplicationExtension")
		if(binary_arr[0]==33 && binary_arr[1]==255){
			binary_arr.shift()
			binary_arr.shift()
			var tmp_arr=binary_arr.splice(0,binary_arr.shift());
			binary_arr.shift();
			binary_arr.shift();
			binary_arr.shift();
			binary_arr.shift();
			binary_arr.shift();
		}
	}
	if(binary_arr[0]==33){
		if(binary_arr[1]==1){//Plain Text Extension
			PlainTextExtension(binary_arr);
		}
		if(binary_arr[1]==249){//Graphics Control Extension
			GraphicsControlExtension(binary_arr);
		}
		if(binary_arr[1]==254){//Comment Extension
			CommentExtension(binary_arr);
		}
		if(binary_arr[1]==255){//Application Extension
			ApplicationExtension(binary_arr);
		}
	}
}
function ImageDescriptor(binary_arr){
	console.log("ImageDescriptor")
	// console.log(JSON.parse(JSON.stringify(binary_arr)))
	var tmp_arr=binary_arr.splice(0,9);
	var packed_field_result=packed_field(binary_arr,{
		LocalColorTableFlag:1,
		InterlaceFlag:1,
		SortFlag:1,
		ReservedForFutureUse:2,
		LocalColorTableSize:3,
	})
	// console.log(JSON.parse(JSON.stringify(binary_arr)))
	// console.log(packed_field_result.LocalColorTableFlag)
	if(packed_field_result.LocalColorTableFlag==1){
		getColorTable(binary_arr,packed_field_result.LocalColorTableSize);
	}
}
function getColorTable(binary_arr,size){
	var count=Math.pow(2,parseInt(size,2)+1)
	var result=[];
	for(var i=0;i<count;i++){
		result.push(binary_arr.splice(0,3))
	}
	return result;
}