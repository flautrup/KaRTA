//Objects
function information() {
	this.format;
	this.venue;
	this.vehicle;
	this.user;
	this.datasource;
	this.comment;
	this.date;
	this.time;
	this.samplerate;
	this.duration;
	this.segment;
	this.beaconmarkers;
}



//JQuery
function UI(){

	// Accordion
	$("#accordion").accordion({autoHeight: false, header: "h3" });

	$("#sidebaraccordion").accordion({autoHeight: false, header: "h3" });

	// Tabs
	$('#tabs').tabs();


	// Dialog			
	$('#dialogAlert').dialog({
		autoOpen: true,
		width: 600,
		buttons: {
			"Ok": function() { 
				$(this).dialog("close"); 
			}, 
			"Cancel": function() { 
				$(this).dialog("close"); 
			} 
		}
	});



	// Datepicker
	$('#datepicker').datepicker({
		inline: true
	});

	// Slider
	$('#slider').slider({
		range: true,
		values: [17, 67]
	});
	
	$('#dialogAlert').dialog ('close');
			
	
}

function presentInformation(info) {
	
	var infostr;
	
	infostr="<table><tr><td>Format:</td><td>"+info.format+"</td></tr>";
	infostr=infostr+"<tr><td>Venue:</td><td>"+info.venue+"</td></tr>";
	infostr=infostr+"<tr><td>Veichle:</td><td>"+info.vehicle+"</td></tr>";
	infostr=infostr+"<tr><td>User:</td><td>"+info.user+"</td></tr>";
	infostr=infostr+"</table>";
	$('#information').append(infostr);
	
	infostr="<table><tr><td>DataSource:</td><td>"+info.datasource+"</td></tr>";
	infostr=infostr+"<tr><td>Comment:</td><td>"+info.comment+"</td></tr>";
	infostr=infostr+"<tr><td>Date:</td><td>"+info.date+"</td></tr>";
	infostr=infostr+"<tr><td>Time:</td><td>"+info.time+"</td></tr>";
	infostr=infostr+"<tr><td>SampleRate:</td><td>"+info.samplerate+"</td></tr>";
	infostr=infostr+"<tr><td>Duration:</td><td>"+info.duration+"</td></tr>";
	infostr=infostr+"<tr><td>Segment:</td><td>"+info.segment+"</td></tr>";
	infostr=infostr+"<tr><td>Beacon Markers:</td><td>"+info.beaconmarkers+"</td></tr>";
	infostr=infostr+"</table>";
	
	$('#details').append(infostr);
	
	
}

function presentLaps(laps) {
	
	var infostr;
	
	infostr="<table><tr><td></td><td>Laps</td><td>Time</td></tr>";
	for(var count=0;count<laps.length; count++) {
		infostr=infostr+"<tr><td><input type='checkbox' name='checklap' value="+laps[count].lap+"/></td><td>"+laps[count].lap+"</td><td>"+laps[count].laptime+"</td></tr>";
	}
	infostr=infostr+"</table>";
	
	$('#laps').append(infostr);
	
}

/*function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    // files is a FileList of File objects. List some properties.
    var output = [];
    f = files[0];
      output.push('<li><strong>', f.name, '</strong> (', f.type || 'n/a', ') - ',
                  f.size, ' bytes, last modified: ',
                  f.lastModifiedDate.toLocaleDateString(), '</li>');

      document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';

      var reader = new FileReader();

      // Closure to capture the file information.
      reader.onload = (function(theFile) {
        return function(e) {
        	//Return JSON of CVS
        };
      })(f);

      // Read in the telemetry file as a text.
      reader.readAsText(f);
    //}
        window.filecontent=reader.result;
  } */

//HighGraph
function map(container, teldatastr, laps) {
	var options;
	var chart;

	options = {
			chart: {
				renderTo: container, 
				defaultSeriesType: 'scatter',
				zoomType: 'xy'
			},
			xAxis: {
				startOnTick: true,
				endOnTick: true,
				showLastLabel: true
			},
			tooltip: {
				formatter: function() {
					return ''+
					this.x +' , '+ this.y +' ';
				}
			},
			plotOptions: {
				scatter: {
					linewidth: 1,
					marker: {
						radius: 2,
						symbol: 'circle'
					},
				}
			},
			series: []
	};

	var series = {
			data: []
	};

	var gearcolor=['#000000','#0000FF','#000080','#00FF00','#FFFF00','#FF0000','#800080'];
	
	var teldata=JSON.parse(teldatastr);
	var gear=0;

	for(var lapcount=0; lapcount<laps.length; lapcount++) {
		series.name = 'Lap'+lapcount;
		for(var count=laps[lapcount].start;count<laps[lapcount].stop; count++) {
			if (gear==parseInt(teldata[count].Gear) || parseInt(teldata[count].Gear)==0) {
				var point=[parseFloat(teldata[count].PosX),parseFloat(teldata[count].PosY)];
				series.data.push(point);
			} else {
				var point={ 
						name: teldata[count].Gear,
						marker: { 
							enabled: true,
							symbol: 'circle', 
							radius: 3,
							fillColor: gearcolor[parseInt(teldata[count].Gear)] 
						},
						x: parseFloat(teldata[count].PosX),
						y: parseFloat(teldata[count].PosY)
				};
				gear=parseInt(teldata[count].Gear);
				series.data.push(point);
			}
		}
		options.series.push(series);
		
		var series = {
				data: []
		};
	}
	chart=new Highcharts.Chart(options);
}


function analysisGraph(container,attr,teldatastr, laps) {
	var options;
	var chart;

	options = {
			chart: {
				renderTo: container,
				zoomType: 'x',
				defaultSeriesType: 'line',
			},
			title: {
				text: attr,
				x: -20 //center
			},
			subtitle: {
				text: '',
				x: -20
			},
			xAxis: {
				type: 'linear'
			},
			yAxis: {
				title: {
					text: 'Speed'
				},
				plotLines: [{
					value: 0,
					width: 1,
					color: '#808080'
				}]
			},
			plotOptions: {
				line: {
					linewidth : 1,
					marker : {
						enabled: true,
						radius: 0,
						symbol: 'circle'
					}
				}
			},
			tooltip: {
				formatter: function() {
					return '<b>'+ this.series.name +'</b><br/>'+
					this.x +': '+ this.y +'kmh';
				}
			},
			legend: {
				layout: 'vertical',
				align: 'right',
				verticalAlign: 'top',
				x: -10,
				y: 100,
				borderWidth: 0
			},
			series: []
	};

	var series = {
			data: []
	};

	var gearcolor=['#000000','#0000FF','#000080','#00FF00','#FFFF00','#FF0000','#800080'];
	
	teldata=JSON.parse(teldatastr);
	var gear=0;

	for(var lapcount=0; lapcount<laps.length; lapcount++) {
		series.name = 'Lap'+lapcount;
		for(var count=laps[lapcount].start;count<laps[lapcount].stop; count++) {
			if (gear==parseInt(teldata[count].Gear) || parseInt(teldata[count].Gear)==0) {
				var point=[parseFloat(teldata[count].Distance),parseFloat(teldata[count][attr])];
				series.data.push(point);
			} else {
				var point={ 
						name: teldata[count].Gear,
						marker: { 
							enabled: true,
							symbol: 'circle', 
							radius: 3,
							fillColor: gearcolor[parseInt(teldata[count].Gear)] 
						},
						x: parseFloat(teldata[count].Distance),
						y: parseFloat(teldata[count][attr])
				};
				gear=parseInt(teldata[count].Gear);
				series.data.push(point);
			}
		}
		options.series.push(series);
		
		var series = {
				data: []
		};
	}
	chart=new Highcharts.Chart(options);
}
//Raphael
/*function DrawGraph () {
	
	//Speed graph
	var speedgraph=Raphael("speedgraph");
	var lines = speedgraph.linechart(30, 50,300,200, [[1, 2, 3, 4, 5, 6, 7],[3.5, 4.5, 5.5, 6.5, 7, 8]], [[12, 32, 23, 15, 17, 27, 22], [10, 20, 30, 25, 15, 28]], { nostroke: false, axis: "0 0 1 1", symbol: "circle", smooth: true });

    //Acceleration             
    var accelgraph=Raphael("accelgraph");
 	var lines = accelgraph.linechart(30, 50,300,200, [[1, 2, 3, 4, 5, 6, 7],[3.5, 4.5, 5.5, 6.5, 7, 8]], [[12, 32, 23, 15, 17, 27, 22], [10, 20, 30, 25, 15, 28]], { nostroke: false, axis: "0 0 1 1", symbol: "circle", smooth: true });
         
    //Compare           
    var comparegraph=Raphael("comparegraph");
 	var lines = comparegraph.linechart(30, 50,300,200, [[1, 2, 3, 4, 5, 6, 7],[3.5, 4.5, 5.5, 6.5, 7, 8]], [[12, 32, 23, 15, 17, 27, 22], [10, 20, 30, 25, 15, 28]], { nostroke: false, axis: "0 0 1 1", symbol: "circle", smooth: true });
     
 	//Map
 	var map=Raphael("map",1024,500);
 	
 	var backrect=map.rect(0,0,1024,400,10);
 	backrect.attr("fill","#C0C0");
 	backrect.attr("stroke","#000000");
 	
	document.getElementById('telemetryfile').addEventListener('change', handleFileSelect, false);
     
};*/


//File load

function abortRead() {
	reader.abort();
}

function errorHandler(evt) {
	switch(evt.target.error.code) {
	case evt.target.error.NOT_FOUND_ERR:
		alert('File Not Found!');
		break;
	case evt.target.error.NOT_READABLE_ERR:
		alert('File is not readable');
		break;
	case evt.target.error.ABORT_ERR:
		break; // noop
	case evt.target.error.SECURITY_ERR:
		alert('Security Error');
		break;
	default:
		alert('An error occurred reading this file.');
	};
}

function updateProgress(evt) {
	// evt is an ProgressEvent.
	if (evt.lengthComputable) {
		var percentLoaded = Math.round((evt.loaded / evt.total) * 100);
		// Increase the progress bar length.
		if (percentLoaded < 100) {
			progress.style.width = percentLoaded + '%';
			progress.textContent = percentLoaded + '%';
		}
	}
}

function handleFileSelect(evt) {

	var reader;
	var progress = document.querySelector('.percent');

	// Reset progress indicator on new file selection.
	progress.style.width = '0%';
	progress.textContent = '0%';

	reader = new FileReader();
	reader.onerror = errorHandler;
	reader.onprogress = updateProgress;
	reader.onabort = function(e) {
		alert('File read cancelled');
	};
	reader.onloadstart = function(e) {
		document.getElementById('progress_bar').className = 'loading';
	};
	reader.onload = function(e) {
		// Ensure that the progress bar displays 100% at the end.
		progress.style.width = '100%';
		progress.textContent = '100%';
		setTimeout("document.getElementById('progress_bar').className='';", 2000);
		$('#dialogAlert').append('<h1>File Loaded</h1>');
		$('#dialogAlert').dialog('open');
	
		var filecontent=reader.result;
		
		var info=parseInformation(filecontent);
		var data=parseDataFile(filecontent);
		var laps=parseLap(data);
		
		presentInformation(info);
		presentLaps(laps);
		//speedGraph(data,laps);
		analysisGraph('speedgraph','Speed',data,laps);
		analysisGraph('accelgraph','LonAcc',data,laps);
		analysisGraph('throttlegraph','Throttle',data,laps);
		analysisGraph('steergraph','Steer',data,laps);
		analysisGraph('brakegraph','Brake',data,laps);
		map('map',data,laps);
	};

	// Read in the image file as a binary string.
	reader.readAsText(evt.target.files[0]);
}

// Data

function parseInformation(content) {
	var rows=content.replace(/\"/g,"").split("\n");

	var tmpinfo=new information();
	
	tmpinfo.format=rows[0].split(",")[1];
	tmpinfo.venue=rows[1].split(",")[1];
	tmpinfo.vehicle=rows[2].split(",")[1];
	tmpinfo.user=rows[3].split(",")[1];
	tmpinfo.datasource=rows[4].split(",")[1];
	tmpinfo.comment=rows[5].split(",")[1];
	tmpinfo.date=rows[6].split(",")[1];
	tmpinfo.time=rows[7].split(",")[1];
	tmpinfo.samplerate=rows[8].split(",")[1];
	tmpinfo.duration=rows[9].split(",")[1];
	tmpinfo.segment=rows[10].split(",")[1];
	tmpinfo.beaconmarkers=rows[11].split(",")[1];

	
	return tmpinfo;
}

function parseUnits(content){
	
	var rows=content.replace(/\"/g,"").split("\n");
	var tmpunits=rows[14].split(",");	
	
	var units = new Array();
	
	for (var count=0;count < tmpunits.length; count++) {
		units.push(tmpunits[count]);
	};
	
	return units;
	
}

function parseLap(datastring) {

	var dataobj=JSON.parse(datastring);
	dataobj.sort(function (a,b) {return a.Time*1000 - b.Time*1000;});
	var deltadistance=0;
	var lapcount=0;
	var laps=new Array();
	var start=0;
	
	for(var count=0;count<dataobj.length; count++) {
		if (parseFloat(dataobj[count].Distance)>=parseFloat(deltadistance)-1) {
			deltadistance=dataobj[count].Distance;
		} else {
			deltadistance=dataobj[count].Distance;
			var lapdata=new Object;
			lapdata.start=start;
			lapdata.stop=count;
			lapdata.lap=lapcount;
			lapdata.laptime=parseFloat(dataobj[count].Time)-parseFloat(dataobj[start].Time);
			laps[lapcount]=lapdata;
			start=count+1;
			lapcount++;
		}
	}
	
/* 	lapdata.start=start;
	lapdata.stop=count;
	lapdata.lap=lapcount;
	lapdata.laptime=parseFloat(dataobj[count].Time)-parseFloat(dataobj[start].Time);
	laps[lapcount]=lapdata; */ 
	
	return laps;
	
}

function parseDataFile(content) {
	
	var data = new Array;
	
	var rows=content.replace(/\"/g,"").split("\r\n");	
		
	var headings1=rows[13].split(",");

	var headings = new Array();
		
	for (var count=0;count < headings1.length; count++) {
		headings.push(headings1[count]);
	};
	

for (var count=16;count < rows.length; count++) {
		var dataobj= new Object;
		datarow=rows[count].split(",");
		for (var count2=0; count2<headings.length; count2++) {
			dataobj[headings[count2]]=datarow[count2];
		}
		data.push(dataobj);
	}
	
	var datastring=JSON.stringify(data);
	
	return datastring;
}