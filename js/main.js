//Globals
var Graphs;

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

  
    $( "#mainwindow" ).sortable({placeholder: "ui-state-highlight", axis: 'y', distance: 100});
    $( "#mainwindow" ).disableSelection();
 

	// Tabs
	$('#tabs').tabs().resizable("aspectRatio");
    


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

	
	$('#dialogAlert').dialog ('close');
			
    $('#progressbar').progressbar();  
    $('#lapselector').hide();
}

function presentInformation(info) {
	
	var infostr;
	
	infostr="<table><tr class='infostyle'><td class='infoheader'>Format:</td><td>"+info.format+"</td></tr>";
	infostr=infostr+"<tr class='infostyle'><td class='infoheader'>Venue:</td><td>"+info.venue+"</td></tr>";
	infostr=infostr+"<tr class='infostyle'><td class='infoheader'>Vehicle:</td><td>"+info.vehicle+"</td></tr>";
	infostr=infostr+"<tr class='infostyle'><td class='infoheader'>User:</td><td>"+info.user+"</td></tr>";
	infostr=infostr+"</table>";
	$('#informationcontent').append(infostr);
	
	infostr="<table><tr class='detailsstyle'><td class='infoheader'>DataSource:</td><td>"+info.datasource+"</td></tr>";
	infostr=infostr+"<tr class='detailsstyle'><td class='infoheader'>Comment:</td><td>"+info.comment+"</td></tr>";
	infostr=infostr+"<tr class='detailsstyle'><td class='infoheader'>Date:</td><td>"+info.date+"</td></tr>";
	infostr=infostr+"<tr class='detailsstyle'><td class='infoheader'>Time:</td><td>"+info.time+"</td></tr>";
	infostr=infostr+"<tr class='detailsstyle'><td class='infoheader'>SampleRate:</td><td>"+info.samplerate+"</td></tr>";
	infostr=infostr+"<tr class='detailsstyle'><td class='infoheader'>Duration:</td><td>"+info.duration+"</td></tr>";
	infostr=infostr+"<tr class='detailsstyle'><td class='infoheader'>Segment:</td><td>"+info.segment+"</td></tr>";
	infostr=infostr+"<tr class='detailsstyle'><td class='infoheader'>Beacon Markers:</td><td>"+info.beaconmarkers+"</td></tr>";
	infostr=infostr+"</table>";
	
	$('#detailscontent').append(infostr);
	
	
}

function presentLaps(laps) {
	
	var infostr;
    var lapselect;
	
    lapselect="<div id='lapset'>";
	infostr="<table><tr><td></td><td>Laps</td><td>Time</td></tr>";
	for(var count=0;count<laps.length; count++) {
		infostr=infostr+"<tr><td><input type='checkbox' name='checklap' value="+laps[count].lap+"/></td><td>"+laps[count].lap+"</td><td>"+laps[count].laptime+"</td></tr>";
        lapselect=lapselect+"<input type='checkbox' checked value='"+laps[count].lap+"' id='"+laps[count].lap+"'/><label for="+laps[count].lap+">"+laps[count].lap+"</label>";
    }
    
	infostr=infostr+"</table>";
    lapselect=lapselect+"</div>";
	
	$('#laps').append(infostr);
    $('#lapselector').append(lapselect);
    
    $('#lapset').buttonset();
    $('#lapset input[type=checkbox]').change(function() {
            var s = $("#lapset > input:checkbox:checked");
            var un= $("#lapset > input:[type=checkbox][checked=false]");
            var sids=Array();
            var uids=Array();
            for (count=0; count<s.length; count++){
                sids.push(s[count].value);
            }
            for (count=0; count<un.length; count++){
                uids.push(un[count].value);
            }
            //var us= $("#lapset > input:checkbox:unchecked");
            changeSeriesState(sids,uids);  
    });
    
    /*$("#lapset input[type=checkbox]").change( function() {
            var s = $("#lapset > input:checkbox:checked");
            var us= $("#lapset > input:checkbox:unchecked");
            changeSeriesState(s,us);
     });*/
    
}


//HighGraph
function map(container, teldatastr, laps) {
	var options;
	var chart;

    var accwidth=($(document).width())*0.35;
    
    $("mapcontainer").width(accwidth);
    var teldata=JSON.parse(teldatastr);
    
	options = {
			chart: {
				renderTo: container, 
				defaultSeriesType: 'scatter',
				zoomType: 'xy',
                spacingTop: 20,
                spacingBottom: 20,
                spacingRight: 20,
                spacingLeft: 20,
                width: accwidth,
	            height: accwidth,
                ignoreHiddenSeries: false,
			},
            title: {
              text: ''  
            },
			xAxis: {
                labels: {
                  enabled: true  
                },
                title: {
                    enabled: null,
                    text: null
                },
				startOnTick: true,
				endOnTick: true,
				showLastLabel: true,
                maxPadding: 0.0,
                minPadding: 0.0,
                tickInterval: 10,
                gridLineWidth: 1
			},
            yAxis: {
                labels: {
                    enabled: true
                },
                title: {
                    enabled: null,
                    text: null
                },
                startOnTick: true,
				endOnTick: true,
				showLastLabel: true,
                maxPadding: 0.0,
                minPadding: 0.0,
                tickInterval: 10
            },
			tooltip: {
				formatter: function() {
                    manipulateID(this.point.id,"highlight");
                    return Highcharts.numberFormat(teldata[this.point.id].Speed, 0, ',');
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
	
	
	var gear=0;

	for(var lapcount=0; lapcount<laps.length; lapcount++) {
		series.name = 'Lap'+lapcount;
        series.id='Lap'+lapcount;
		for(var count=laps[lapcount].start;count<laps[lapcount].stop; count++) {
			if (gear==parseInt(teldata[count].Gear) || parseInt(teldata[count].Gear)==0) {
				    var point={
                        id: count,
						name: teldata[count].Gear,
						marker: { 
							enabled: true,
							symbol: 'circle', 
							radius: 1,
							fillColor: gearcolor[parseInt(teldata[count].Gear)] 
						},
						x: parseFloat(teldata[count].PosX),
						y: parseFloat(teldata[count].PosY)
				};
				series.data.push(point);
			} else {
				var point={
                        id: count,
						name: teldata[count].Gear,
						marker: { 
							enabled: true,
							symbol: 'circle', 
							radius: 1,
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
    
    return chart;
}


function analysisGraph(container,attr,teldatastr,laps, tickmark) {
	var options;
	var chart;
    
    var accwidth=($(document).width())*0.54;
    

	options = {
			chart: {
				renderTo: container,
				zoomType: 'x',
				defaultSeriesType: 'line',
                reflow: true,
                spacingTop: 10,
                spacingBottom: 10,
                spacingRight: 10,
                spacingLeft: 10,
                width: accwidth,
                height: 200,
                plotBackgroundColor: '#000000',
                backgroundColor: '#000000',
                ignoreHiddenSeries: false
			},
			title: {
				text: null,
				x: -20 //center
			},
			xAxis: {
				type: 'linear',
                labels: {
                    enabled: false
                },
			},
			yAxis: {
				title: {
					text: attr
				},
                maxPadding: 0.0,
                minPadding: 0.0,
                tickInterval: tickmark,
				plotLines: [{
					value: 0,
					width: 1,
					color: '#808080'
				}]
			},
			plotOptions: {
				line: {
					linewidth : 0.5,
					marker : {
						enabled: true,
						radius: 0,
						symbol: 'circle',
                        states: {
                            select: {
                                enabled: true,
                                radius: 3
                            }
                        }
					}
				}
			},
			tooltip: {
				formatter: function() {
                    manipulateID(this.point.id,"highlight");
					return Highcharts.numberFormat(this.y, 0, ',');
				}
			},
			legend: {
                enabled: false
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
        series.id= 'Lap'+lapcount;
		for(var count=laps[lapcount].start;count<laps[lapcount].stop-1; count++) {
			if (gear==parseInt(teldata[count].Gear) || parseInt(teldata[count].Gear)==0) {
				var point={ 
                        id: count,
    					name: teldata[count].Gear,
						marker: { 
							enabled: false, 
						},
						x: parseFloat(teldata[count].Distance),
						y: parseFloat(teldata[count][attr])
				};
				series.data.push(point);
			} else {
				var point={
                        id: count,
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
    
    return chart;
}

function manipulateID(id,effect) {
    
    for(var count=0; count < Graphs.length;count++) {
        Graphs[count].get(id).select(true, false);
    }
    
}

function changeSeriesState(sids,uids) {
    for(var count=0; count < Graphs.length;count++) {
        for(var count2=0;count2<sids.length;count2++) {
            if(! Graphs[count].get('Lap'+sids[count2]).visible) {
                Graphs[count].get('Lap'+sids[count2]).show();
            }
        }
        for(var count2=0;count2<uids.length;count2++) {
            if(Graphs[count].get('Lap'+uids[count2]).visible) {
                Graphs[count].get('Lap'+uids[count2]).hide();
            }
        }
    }
}

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
			$('#progressbar').progressbar({
    		value: percentLoaded
		    });
		}
	}
}

function handleFileSelect(evt) {

	var reader;
	var progress = document.querySelector('.percent');

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
		$('#progressbar').progressbar({
    		value: 100
	    });

		$('#dialogAlert').append('<h1>File Loaded</h1>');
		$('#dialogAlert').dialog('open');

		var filecontent=reader.result;
		
		var info=parseInformation(filecontent);
		var data=parseDataFile(filecontent);
		var laps=parseLap(data);
		
		presentInformation(info);
        $('#progressbar').hide();
        $('#lapselector').show();
		presentLaps(laps);
        
		//speedGraph(data,laps);
        var speedgraph=analysisGraph('speedgraph','Speed',data,laps,20);
        var accelgraph=analysisGraph('accelgraph','LonAcc',data,laps,1);
        var steergraph=analysisGraph('steergraph','Steer',data,laps,20);           
        var throttlegraph=analysisGraph('throttlegraph','Throttle',data,laps,20);
        var breakgraph=analysisGraph('brakegraph','Brake',data,laps,20);
		
		var mapgraph=map('map',data,laps);
        
        Graphs=[speedgraph, accelgraph, steergraph, throttlegraph, breakgraph, mapgraph];
        
        // on event triggered change graphs
        
       //     manipulateID(graphs,"highlight",id);
        
	};

	// Read in the image file as a binary string.
	reader.readAsText(evt.target.files[0]);
}

// Data

function parseInformation(content) {
	var rows=content.replace(/[\"\r]/g,"").split("\n");

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
	
	var rows=content.replace(/[\"\r]/g,"").split("\n");
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
	var lapcount=0;
	var laps=new Array();
	var start=1;
	
	for(var count=1;count<dataobj.length; count++) {
		if (parseFloat(dataobj[count].Distance)+1<parseFloat(dataobj[count-1].Distance)) {
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
	
    if (dataobj.length > start) {
        var lapdata=new Object;
        lapdata.start=start;
	    lapdata.stop=dataobj.length;
	    lapdata.lap=lapcount;
	    lapdata.laptime=parseFloat(dataobj[dataobj.length-1].Time)-parseFloat(dataobj[start].Time);
	    laps[lapcount]=lapdata;
    }
            
	return laps;
	
}

function parseDataFile(content) {
	
	var data = new Array;
	    
	var rows=content.replace(/[\"\r]/g,"").split("\n");	
        
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