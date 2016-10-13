function getData(binary_arr,image_struct,length,callback,callback_arg){
	var start=image_struct.pointer;
	if((typeof length)==="number"){
		var count=start+length;
	}else{
		var count=start
		count+=binary_arr[image_struct.pointer+length.start];//長度
		count+=length.start+1;
		// if(binary_arr[image_struct.pointer+length.start]==255){
			// console.log(binary_arr[image_struct.pointer+length.start+1])
		// }
		if(length.end)
			count+=length.end;
	}
	
	image_struct.pointer=count;
	
	var value=binary_arr.slice(start,count);
	
	var fn=window[callback];
	if((typeof fn)==="function"){
		var value=fn(value,callback_arg);
	}
	return {start:start,count:count,value:value,binary:binary_arr.slice(start,count)};
}
function getFormat(array){
	return array.map(function(value){
		return String.fromCharCode(value);
	}).join("");
}
function getEdge(array){
	return array.reduce(function(prev,curr,i){
		return prev+curr*(1+i*255);
	},0)
}
function getPackedField(array,field_arr){
	var array=array.pop().toString(2).split("");
	while(array.length<8)array.unshift("0");
	var result={};
	for(var i in field_arr){
		result[i]=array.splice(0,field_arr[i]).join("");
	}
	return result;
}
function getColorTable(array){
	var result=[];
	while(array.length){
		result.push(array.splice(0,3))
	}
	return result;
}



function PlainTextExtension(binary_arr){
	console.log("PlainTextExtension")
	// if(binary_arr[0]==33 && binary_arr[1]==1){
		// binary_arr.shift()
		// binary_arr.shift()
		// var tmp_arr=binary_arr.splice(0,binary_arr.shift());
		// binary_arr.shift()
	// }
}
function GraphicsControlExtension(binary_arr){
	console.log("GraphicsControlExtension")
	// if(binary_arr[0]==33 && binary_arr[1]==249){
		// var tmp_arr=binary_arr.splice(0,8);
	// }
}
function CommentExtension(binary_arr){
	console.log("CommentExtension")
	// if(binary_arr[0]==33 && binary_arr[1]==254){
		// binary_arr.shift()
		// binary_arr.shift()
		// var tmp_arr=binary_arr.splice(0,binary_arr.shift());
		// binary_arr.shift()
	// }
}
function ApplicationExtension(array){
	// console.log(array)
	console.log("ApplicationExtension");
	var dd=getFormat(array.slice(3,3+11));
	return dd;
	
}

function decode_byte(array){
	console.log("decode_byte")
	
	var data=array.reverse().map(function(value){
		var tmp=value.toString(2).split("");
		while(tmp.length<8)tmp.unshift("0");
		return tmp.join("");
	}).join("").split("");
	
	return data;
	
	while(data.length){
		var count=(result.length*1+Math.pow(2,lzw_min_code)).toString(2).length;
		console.log(count)
		if(data.length<count){// 補滿8位元用 可捨棄
			break;
		}
		var t1=data.splice(-1*count,count).join("");
		var t2=parseInt(t1,2);
		result.push(t2);
	}
	return result;
}

function lzw_decode(lzw_min_code,array){
	console.log("lzw_decode")
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
	}
	
	var code2=array.indexOf(count+1)
	if(code2!=-1){
		array.splice(code2,1)
	}
	// console.log(code1,code2)
	
	// return []
	var result=[];
	var k;
	
	// console.log(JSON.parse(JSON.stringify(array)))
	for(var i in array){
		if(i==0){
			k=table[array[0]][0];
			result.push(k);
			continue;
		}
		
		if(table[array[i]]){
			result=result.concat(table[array[i]]);
			k=table[array[i]][0];
			var tmp=table[array[i-1]].concat(k);
		}else{
			k=table[array[i-1]][0];
			var tmp=table[array[i-1]].concat(k)
			result=result.concat(tmp);
		}
		
		// console.log(table[array[i]]?'yes':'no',array[i],array[i-1],table.length,tmp)
		table.push(tmp);
	}
	// console.log(table.length)
	return result;
}
