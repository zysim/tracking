
	
google.load("visualization", "1", {packages:["orgchart"]});
google.setOnLoadCallback(drawChart);

function renderuploadxml(a_id){

	$.ajax({
		type: "GET",
		url: "/uploadXMLAS",
		data: {attempt: {uploadxml_a_id: a_id}},
		
		success: function(data){
/*
			$("#generate-xml-file").click(function(){
				
				requestGenerateXML(a_id)
			})*/
			renderuploadjson(a_id)
		}       
		
	});
}

function renderuploadjson(a_id){

	$.ajax({
		type: "GET",
		url: "/uploadJsonAS",
		data: {attempt: {uploadxml_a_id: a_id}},
		
		success: function(data){
			$("#generate-xml-file").click(function(){
				
				requestGenerateXML(a_id)
			})
		}       
		
	});
}

function requestGenerateXML(a_id){
	$.ajax({
		type: "GET",
		url: "/generateXMLfile",
		data: {uploadxml_a_id: a_id},
		
		success: function(data){
			
		}       
		
	});
}

function drawChart() {
				var a_id
				var xml=false
				$("#draw-chart").click()
				$("#draw-chart").bind('ajax:success', function(evt, teaminfo, status, xhr){
/*
teaminfo[0] => info about robot
teaminfo[1] => info about missions => [mission,[attempts]]

*/	
				var robname=teaminfo[0].name
				
 				var data = new google.visualization.DataTable();
				data.addColumn('string', 'Name');
    		data.addColumn('string', 'Manager');
    		data.addColumn('string', 'ToolTip');
//============ add robot node ===============
				data.addRows([
//					[{v:robname, f:robname+'<div style="color:red; font-style:italic">Robot</div>'}, '', 'Your Robot']
					[robname, '', 'Your Robot']
				]);
//============ add mission node =================

				for (var i=0;i<teaminfo[1].length;i++){
// teaminfo[i] = [mission,[attempts]]
					//alert('i:'+i)
					m=teaminfo[1][i][0]
					data.addRows([
						[{v:m.name, f:m.name+'<div style="color:Crimson; font-style:italic; width: 100%; "><font size="2">'+'Start: '+m.start+'<br />End: '+m.end+'</font></div>'}, robname, 'Mission '+m.id]
					]);
					atts=teaminfo[1][i][1]
					for (var j=0; j< atts.length;j++){
						
						if (m.mtype=="AreaScanning"){
							xml=true
							a_id=atts[j].id
							data.addRows([
								//[atts[j].name, m.name, 'Attempt'],
								[{v:atts[j].name, f:atts[j].name+'<div style="color:red; font-style:italic; width: 250px"><font size="2">'+'Start: '+atts[j].start+'<br />End: '+atts[j].end+'</font></div>'+'<div id="upload-as-xml"></div><div id="uploading-json-file"></div>'}, m.name, 'Attempt'],
								['Tracker '+atts[j].tracker_id+' => '+atts[j].name, atts[j].name, 'Tracker'],
							
							]);	
						}else{	
							data.addRows([
								//[atts[j].name, m.name, 'Attempt'],
								[{v:atts[j].name, f:atts[j].name+'<div style="color:red; font-style:italic; width: 250px"><font size="2">'+'Start: '+atts[j].start+'<br />End: '+atts[j].end+'</font></div>'}, m.name, 'Attempt'],
								['Tracker '+atts[j].tracker_id+' => '+atts[j].name, atts[j].name, 'Tracker'],
							
							]);
						}
					}
				}
				var option={
					allowHtml:true,
					size: 'large'
				}
				var chart = new google.visualization.OrgChart(document.getElementById('chart_div'));
				chart.draw(data, option);
				if (xml==true)
					renderuploadxml(a_id)
			})
	    
}





 
    
