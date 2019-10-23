Ext.require('Ext.ux.IFrame');
if(Ext.is.Phone || Ext.is.Tablet){
    var scrollType = 'both';
}else{
    var scrollType = 'vertical';
}
/*
function currency(val) {
	if(!val) {
		return '-';
	} else {
		if(val < 0){
			var negative = 1;
			val = val * -1;
		} else {
			var negative = 0;
		}
		
		var parts = (+val).toFixed(2).split(".");
		
		var left = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		
		if(parts[1].length == 0){
			var right = '00';
		} else if(parts[1].length == 1){
			var right = parts[1] + '0';
		} else {
			var right = parts[1];
		}
		
		if(negative == 1){
			return '<span style="color:#9C0006;">($ ' + left + '.' + right + ')</span>';
		} else {
			return '<span style="color:#000000;">$ ' + left + '.' + right + '</span>';
		}
	}
};
*/


function currency(val){
	if(!val) {
		return '-';
	} else {
		if(val < 0){
			var negative = 1;
			val = val * -1;
		} else {
			var negative = 0;
		}

		if(val > 1000){
			val = Ext.util.Format.currency(val,'$',0);
		}else{
			val = Ext.util.Format.currency(val);
		}
		

		if(negative == 1){
			return '<span style="color:#9C0006;">(' + val + ')</span>';
		} else {
			return val;
		}
		
	}

}


function percent(val) {
	if(!val)
		return '-';
	val = val.toFixed(2);
	if (val > 0) {
		return '' + val.toLocaleString() + ' %';
	}else{
		return '(' + (val * -1).toLocaleString() + ' %)';
	}
	return val;
}

function percent_change(val,offset,flip) {

	if(!val)
		return '-';
	val = val.toFixed(2);
	//offset = 0;
	if(isNaN(offset)){
		offset=0;
	}
	if(flip != 1){
		if (val >= 0 + offset) {
			return '<span style="color:#006100;">' + val.toLocaleString() + ' %</span>';
		} else if (val < 0) {
			return '<span style="color:#9C0006;">(' + (val * -1).toLocaleString() + ' %)</span>';
		} else if(val < 0 + offset){
			return '<span style="color:#9C0006;">' + (val).toLocaleString() + ' %</span>';
		}

	}else{
		if (val > 0 + offset) {
			return '<span style="color:#9C0006;">' + val.toLocaleString() + ' %</span>';
		} else if (val < 0) {
			return '<span style="color:#9C0006;">(' + (val * -1).toLocaleString() + ' %)</span>';
		} else if(val < 0 + offset){
			return '<span style="color:#006100;">' + (val).toLocaleString() + ' %</span>';
		}
		
	}
	return val;
}
//LABOR
function percent_hundred(val) {
	if(!val)
		return '-';
	val = val.toFixed(2);
	if (val >= 100) {
		return '<span style="color:#006100;">' + val.toLocaleString() + ' %</span>';
	} else if (val < 100) {
		return '<span style="color:#9C0006;">' + (val).toLocaleString() + ' %</span>';
	}
	return val;
}
//LABOR
function percent_hundred_over(val) {
	if(!val)
		return '-';
	val = val.toFixed(2);
	if (val <= 95) {
		return '<span style="color:#FF9900;">' + val.toLocaleString() + ' %</span>';
	}else if (val <= 100) {
		return '<span style="color:#006100;">' + val.toLocaleString() + ' %</span>';
	} else if (val > 100) {
		return '<span style="color:#9C0006;">' + (val).toLocaleString() + ' %</span>';
	}
	return val;
}

function units(val) {
	if(!val)
		return '-';
	return '<span>' + val.toLocaleString() + '</span>';
	return val;
}

function units_number_change(val) {
	if(!val)
		return '-';
	if (val > 0) {
		return '<span style="color:#006100;">' + val.toLocaleString() + '</span>';
	} else if (val < 0) {
		return '<span style="color:#9C0006;">(' + (val * -1).toLocaleString() + ')</span>';
	}
	return val;
}

function date(value){
	var bad_date = new Date('12/31/1969 18:00');
	var bad_date2 = new Date('12/31/1969');
	//console.log(bad_date);
	//console.log(value);
	if(value ){
		var today = new Date();
		if(value == "Yesterday"){
			var today = new Date();
			today.setDate(today.getDate() - 1);
			var new_value = new Date(today);
			
		}else if(value == "Today"){
			var new_value = new Date();
		
		}else if(value == "Last Sunday"){
			
			today.setDate(today.getDate() - today.getDay());
			var new_value = new Date(today);
			
		}else if(value == "First Day of this Month"){
			today = Ext.Date.getFirstDateOfMonth(today);
			var new_value = new Date(today);
			var last_year_begin = Ext.Date.add(new_value, Ext.Date.YEAR, -1);
			
		}else if(value == "1/1 this Year"){
			today.setMonth(0);
			today.setDate(1);
			var new_value = new Date(today);
			var last_year_begin = Ext.Date.add(new_value, Ext.Date.YEAR, -1);
			
		}else if(value instanceof Date){
			var new_value = value;
			//console.log('instance')
		}else
			var new_value = new Date(value);
		//var day = Ext.Date.format(value,'l');
		var date = Ext.Date.format(new_value,'m/d/Y');
		if(value instanceof Date){
			if(value.getTime() == bad_date.getTime() || value.getTime() == bad_date2.getTime()){
				return '-';
			}
		}
		return date;
	}else
		return '-';
}

function daydate(value){
	if(value){
		var day = Ext.Date.format(value,'l');
		var date = Ext.Date.format(value,'m/d/Y');
		return day + ', ' + date;
	}else
		return value;
}

function timestamp(value){
	if(value){
		var date = Ext.Date.format(value,'U');
		return date;
	}else
		return value;
}

function getSunday(d) {
  d = new Date(d);
  var day = d.getDay(),
      diff = d.getDate() - day; // adjust when day is sunday
  var value = new Date(d.setDate(diff));

  return Ext.Date.format(value,'m/d/Y');
}

function getMonday(d) {
  d = new Date(d);
  var day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
  return new Date(d.setDate(diff));
}

function getDayOfWeek(d,x) {
	var adjust = -7 + x;
  d = new Date(d);
  var day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? adjust:x); // adjust when day is sunday
  return new Date(d.setDate(diff));
}

Ext.Ajax.timeout = 1000 * 60 * .5; // minutes

Ext.Ajax.on('beforerequest', function(conn, options){ 
	var start = new Date().getTime();
	this.startTime = start;
});

Ext.Ajax.on('requestexception',function(conn, response, options){
	var end = new Date().getTime();
	var time = (end - this.startTime) / 1000;
	console.warn(options.url);
	console.warn(response);
});

Ext.Ajax.on('requestcomplete', function(conn, response, options){ 
	var end = new Date().getTime();
	this.endTime = end;
	writeInJsConsole('ajax request to: '+options.url+' with start time='+this.startTime + ' - endTime='+ this.endTime + ' -> '+ (this.endTime - this.startTime + ' (' + (this.endTime - this.startTime)/1000 + 's)' ));
});

Ext.data.proxy.Ajax.override({
	timeout: 1000 * 60 * 1
});
function writeInJsConsole (text) { 
    if (typeof console !== 'undefined') { 
        console.log(text);     
    } 
}

function reports_navigation(type){
	
	if(!Ext.getCmp('reportsWindow')){	
	
		var reportsStore = Ext.create('Ext.data.Store', {
			autoLoad : true,
			id: 'reportsStore',
			fields:[{
				name: 'title', 
				type: 'string',
			},{
				name: 'description', 
				type: 'string',
			},{
				name: 'type', 
				type: 'string',
			},{
				name: 'tab_id', 
				type: 'string',
			},{
				name: 'id', 
				type: 'string',
			},{
				name: 'f', 
				type: 'number',
			},{
				name: 'src', 
				type: 'string',
			},{
				name: 'width', 
				type: 'number',
			},{
				name: 'height', 
				type: 'number',
			}],
			proxy: {
				type: 'ajax',
				url : '/content/dashboard/reports_navigation.php?type=' + type,
				reader: {
					type: 'json',
					root: 'data' 
				}
			},
			listeners: {
				load: function(store, records, successful){
					var grid = Ext.getCmp('reportGrid');
					grid.getSelectionModel().select(records[0]);
					grid.fireEvent('itemclick', grid.getView(), records[0]);
				}
			}
			
		});
	
		var bookTplMarkup = [
			'<table width=100%>',
			'<tr><td>{description}</td></tr>',
			'</table>',
		];
		var bookTpl = Ext.create('Ext.Template', bookTplMarkup);
		
		var today = new Date();
		var start_date = Ext.util.Cookies.get('dashboard_start_date');
		var end_date = Ext.util.Cookies.get('dashboard_end_date');
		
		
		if(start_date == "Yesterday"){
			var today = new Date();
			today.setDate(today.getDate() - 1);
			var begin = new Date(today);
			
		}else if(start_date == "Today"){
			var begin = new Date();
		
		}else if(start_date == "Last Sunday"){
			
			today.setDate(today.getDate() - today.getDay());
			var begin = new Date(today);
			
		}else if(start_date == "First Day of this Month"){
			today = Ext.Date.getFirstDateOfMonth(today);
			var begin = new Date(today);
			var last_year_begin = Ext.Date.add(begin, Ext.Date.YEAR, -1);
			
		}else if(start_date == "1/1 this Year"){
			today.setMonth(0);
			today.setDate(1);
			var begin = new Date(today);
			var last_year_begin = Ext.Date.add(begin, Ext.Date.YEAR, -1);
		}else{
			var begin = new Date(start_date);
		}
		
		if(end_date == "Yesterday"){
			var today = new Date();
			today.setDate(today.getDate() - 1);
			var end = new Date(today);
			
		}else if(end_date == "Today"){
			var end = new Date();
		
		}else
			var end = new Date(end_date);
		
		var editableTplMarkup = [
			'<table width=100%>',
			'<tr><td>Start Date</td><td>' + start_date + '</td></tr>',
			'<tr><td>End Date</td><td>' + end_date + '</td></tr>',
			'<tr><td>Locations</td><td>' + Ext.util.Cookies.get('dashboard_location_selection') + '</td></tr>',
			'<tr><td>Department</td><td>' + Ext.util.Cookies.get('dashboard_department') + '</td></tr>',
			'<tr><td>Class</td><td>' + Ext.util.Cookies.get('dashboard_class') + '</td></tr>',
			'<tr><td>Fineline</td><td>' + Ext.util.Cookies.get('dashboard_fineline') + '</td></tr>',
			'<tr><td>Vendor</td><td>' + Ext.util.Cookies.get('dashboard_vendor') + '</td></tr>',
			'<tr><td>Buyer</td><td>' + Ext.util.Cookies.get('dashboard_buyer') + '</td></tr>',
			'</table>',
			'<textarea id="reportNote"></textarea>'
		];
		var editableTpl = Ext.create('Ext.Template', editableTplMarkup);
		
		var addNoteForm = {
			xtype: 'form',
			id: "addNoteForm",
			//title: "event Grid",
			//layout: 'fit',
			url: '/content/dashboard/report_note_submit.php',
			defaultType: 'displayfield',
			items: [{
				fieldLabel: 'Start Date',
				name: 'start_date',
				xtype: 'datefield',
				allowBlank: false,
				value: begin
			},{
				fieldLabel: 'End Date',
				name: 'end_date',
				xtype: 'datefield',
				allowBlank: false,
				value: end
			},{
				fieldLabel: 'LY Start Date',
				name: 'ly_start_date',
				xtype: 'datefield',
				allowBlank: false,
				value: new Date(Ext.util.Cookies.get('dashboard_ly_start_date')),
			},{
				fieldLabel: 'LY End Date',
				name: 'ly_end_date',
				xtype: 'datefield',
				allowBlank: true,
				value: new Date(Ext.util.Cookies.get('dashboard_ly_end_date')),
			},{
				fieldLabel: 'Location',
				name: 'location',
				allowBlank: true,
				//xtype: 'displayfield',
				value: Ext.util.Cookies.get('dashboard_location_selection'),
			},{
				fieldLabel: 'Department',
				name: 'department',
				allowBlank: true,
				value: Ext.util.Cookies.get('dashboard_department'),
			},{
				fieldLabel: 'Class',
				name: 'class',
				allowBlank: true,
				value: Ext.util.Cookies.get('dashboard_class'),
			},{
				fieldLabel: 'Fineline',
				name: 'fineline',
				allowBlank: true,
				value: Ext.util.Cookies.get('dashboard_fineline'),
			},{
				fieldLabel: 'Vendor',
				name: 'vendor',
				allowBlank: true,
				value: Ext.util.Cookies.get('dashboard_vendor'),
			},{
				fieldLabel: 'Buyer',
				name: 'buyer',
				allowBlank: true,
				value: Ext.util.Cookies.get('dashboard_buyer'),
			},{
				fieldLabel: 'Note',
				name: 'note',
				allowBlank: false,
				xtype: 'textareafield',
			},{
				fieldLabel: 'Type',
				name: 'type',
				allowBlank: true,
				value: type,
				hidden: true,
				xtype: 'textfield',
			}/*,{
				xtype: 'panel',
				html: '* Required Fields',
				border: 0,
			}*/],
			 buttons: [{
				text: 'Reset',
				handler: function() {
					this.up('form').getForm().reset();
				}
			}, {
				text: 'Submit',
				formBind: true, //only enabled once the form is valid
				disabled: true,
				handler: function() {
					var form = this.up('form').getForm();
					if (form.isValid()) {
						form.submit({
							success: function(form, action) {
							   Ext.Msg.alert('Success', action.result.msg);
							   eventRecords.reload();
							},
							failure: function(form, action) {
								Ext.Msg.alert('Failed', action.result.msg);
							}
						});
					}
				}
			}],
		};

		
		var reportWestPanel = {
			id: 'reportGrid',
			//layout: 'fit',
			
			region: 'center',
			xtype: 'grid',
			flex: 20,
			store: reportsStore,
			columns: [
			{
				flex: 1,
				dataIndex: 'title',
				header: 'Title',
			}],
			listeners: {
				itemclick: function(view, record, item,x,eventObj){
					var id = record.get('tab_id');
					var f = record.get('f');
					var reportDetails = Ext.getCmp('reportDetails');
					if(f == "0"){
						//reportDetails.update(editableTpl.apply());
						reportDetails.removeAll();
						reportDetails.update();
						reportDetails.add(addNoteForm);
						Ext.getCmp('reportSubmitBtn').hide();
					}else if(f == "3"){
						var iframe = {
							xtype: 'uxiframe',
							layout: 'fit',
							src: record.get('src'),
							id: id //,
							//id: id + '-uxiframe',
						}
						console.log(iframe);
						reportDetails.removeAll();
						reportDetails.update();
						reportDetails.add(iframe);
						Ext.getCmp('reportSubmitBtn').hide();
					}else{
						//var reportDetails = Ext.getCmp('reportDetails');
						reportDetails.removeAll();
						reportDetails.update(bookTpl.apply(record.data));
						Ext.getCmp('reportSubmitBtn').show();
					}
				},
			}
		};
	
		var reportCenterPanel = {
			width: 400,
			flex: 80,
			region: 'east',
			layout: 'fit',
			xtype: 'panel',
			id: 'reportDetails',
			html: 'Pick a report to see description.  Click "Go to Report" to view the selected report.',
		}

		var submitButton = {
			id: 'reportSubmitBtn',
			region: 'south',
			xtype: 'button',
			text: 'Go to Report',
			handler: function(){
				var record = Ext.getCmp('reportGrid').getSelectionModel().getSelection()[0];
				//var tab_name = record.get('tab_name');
				//var tab_url = record.get('tab_url');
				var id = record.get('id');
				var tab_id = record.get('tab_id');
				var f = record.get('f');
				
				if(f == 1){
					new_tab(tab_id);
					
					reportsWindow.close();
				}else if(f == 0){
					var note = document.getElementById('reportNote').value;
					console.log(note);
					Ext.Ajax.request({
						url: '/content/dashboard/report_note_submit.php',
						method: 'POST',
						params: {
							note: note,
							type: type,
						},
						success: function(){
							if(window.parent)
								window.parent.Notify('Note Successfully Added');
							reportsWindow.close();
						}
						});
				}else if(f == 2){
					var src = record.get('src');
					var title = record.get('title');
					if(window.opener){
						//window.opener.drill(tab_id,tab_name,tab_url);
						window.opener.unseenTab(src,tab_id,title);
						window.opener.updateDCF();
						window.close();
					}
					else if(window.parent){
						//window.parent.drill(tab_id,tab_name,tab_url);
						window.parent.unseenTab(src,tab_id,title);
						window.parent.updateDCF();
					}
					
					reportsWindow.close();
				}else if(f == 4){
					newReportWindow(record.get('src'),record.get('title'),record.get('width'),record.get('height'));
					reportsWindow.close();
				}else if(f == 5){
					var item = Ext.util.Cookies.get('dashboard_skus');
					var detailPanel = Ext.getCmp('detailPanel');
					detailPanel.mask("Loading Item " + item);
					SKUdetails.load({url:'details.php?item_number=' + item});
					monthlySales.load({url:'month_sales.php?item_number=' + item});
					reportsWindow.close();
				}else if(f == 6){
					openTab(tab_id);
				}
			}
		}
	
		var reportsWindow = Ext.create('Ext.window.Window', {
			id: 'reportsWindow',
			title: 'Reports',
			layout: 'border',
			height: 450,
			width: 600,
			bbar:[submitButton],
			maximizable: true,
			items:[reportWestPanel,reportCenterPanel],
			//closeAction: 'hide',
		}).show();
	}
	
}
function Notify(text){
	Ext.create('widget.uxNotification', {
		title: 'Notification',
		position: 'br',
		manager: 'demo1',
		iconCls: 'ux-notification-icon-information',
		autoCloseDelay: 3000,
		spacing: 20,
		//Entering from the component\'s br corner. 3000 milliseconds autoCloseDelay.<br />Increasd spacing.
		html: text,
	}).show();
}

//create a new window
function newReportWindow(src,title,width,height){
	console.log(width);
	if(!width & !height){
		var maximized = true;
	}else
		var maximized = false;
	if(!height)
		height = 500;
	if(!width)
		width = 500;



	var tempWindow = Ext.create('Ext.window.Window', {
		title: title,
		height: height,
		width: width,
		layout: 'fit',
		maximizable: true,
		maximized: maximized,
		items: [{
			xtype: 'uxiframe',
			src: src,
		}],
		tools: [{
			type: 'refresh',
			callback: function(panel){
				window.frames[panel.down('uxiframe').frameName].reload();
			}
		}]
	});
	tempWindow.show();
}

function reportMenu(type,menu){

	if(!Ext.getStore('reportsMenuStore')){
		var menuReports = Ext.create('Ext.data.Store', {
			id: 'reportsMenuStore',
			autoLoad : false,
			autoDestroy: true,
			fields:[{
					name: 'title', 
					type: 'string',
				},{
					name: 'description', 
					type: 'string',
				},{
					name: 'type', 
					type: 'string',
				},{
					name: 'tab_id', 
					type: 'string',
				},{
					name: 'id', 
					type: 'string',
				},{
					name: 'f', 
					type: 'number',
				},{
					name: 'src', 
					type: 'string',
				},{
					name: 'width', 
					type: 'number',
				},{
					name: 'height', 
					type: 'number',
				},{
					name: 'icon', 
					type: 'string',
				}],
			proxy: {
				type: 'ajax',
				url : '/content/dashboard/reports_navigation.php?type=' + type,
				reader: {
					type: 'json',
					root: 'list' 
				}
			}
		});
	}
	var menuItems = new Array();
	Ext.getStore('reportsMenuStore').load({
		//scope: this,
		callback: function(records){
			//var menuItems = new Array();

			Ext.Array.each(records, function(record) {
			    var x = {
					text:record.get('title'),
					icon: '/content/dashboard/images/' + record.get('icon'),
					handler:function(){
						window.parent.openTab(record.get('tab_id'));
					}
				}
				menu.add(x);
				//console.log(menuItems);
			});
			//console.log(menuItems);
			//this.menuItems = menuItems;
			
		}
	});
}

//Open a new tab, located at the given location
function new_tab(tab_id) {
	if(window.opener){
		window.opener.openTab(tab_id);
		window.opener.updateDCF();
		window.close();
	}
	else if(window.parent){
		window.parent.openTab(tab_id);
		window.parent.updateDCF();
	}
}

function print_things(pnl){
	//window.open();
        if (!pnl) {
            pnl = this;
        }
 
        // instantiate hidden iframe
 
        var iFrameId = "printerFrame";
        var printFrame = Ext.get(iFrameId);
 
        if (printFrame == null) {
            printFrame = Ext.getBody().appendChild({
                id: iFrameId,
                tag: 'iframe',
                cls: 'x-hidden',
                style: {
                    display: "none"
                }
            });
        }
 
        var cw = printFrame.dom.contentWindow;
        //var cw = window;
 
        // instantiate application stylesheets in the hidden iframe
 
        var stylesheets = "";
        for (var i = 0; i < document.styleSheets.length; i++) {
            stylesheets += Ext.String.format('<link rel="stylesheet" href="{0}" />', document.styleSheets[i].href);
        }
        // various style overrides
        stylesheets += ''.concat(
          "<style>", 
            ".x-panel-body {overflow: visible !important; height:100%}",
            //".x-panel-body {overflow: hidden !important;}",
            // experimental - page break after embedded panels
            // ".x-panel {page-break-after: always; margin-top: 10px}",
          "</style>"
         );
 
        // get the contents of the panel and remove hardcoded overflow properties
        var markup = pnl.getEl().dom.innerHTML;
        //console.log(pnl.getEl().dom)
        console.log(markup);
        /*scroll bar*/
        while (markup.indexOf('overflow: auto;') >= 0) {
            markup = markup.replace('overflow: auto;', '');
        }
 
        var str = Ext.String.format('<html><head>{0}</head><body>{1}</body></html>',stylesheets,markup);
 		//console.log(markup);
 		//console.log(stylesheets);
        // output to the iframe
        cw.document.open();
        cw.document.write('<style>.x-column-header-text{display:none;} #sublistGrid_header-innerCt{display:none;}</style>'+markup);
        //cw.document.write('<html><head>'+stylesheets+'</head><body>'+markup+'</body></html>');
        
        //cw.document.close();
        // remove style attrib that has hardcoded height property
        cw.document.getElementsByTagName('DIV')[0].removeAttribute('style');
         console.log(cw.document.getElementsByTagName('DIV'))

 
        // print the iframe
        cw.print();
        //cw.save();
 
        // destroy the iframe
        Ext.fly(iFrameId).destroy();
 
    }

    function setCookie(cname, cvalue, exdays) {
		var d = new Date();
		d.setTime(d.getTime() + (exdays*24*60*60*1000));
		var expires = "expires="+d.toUTCString();
		document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/";
	}

	function daysInMonth(month, year) {
		if(!year){
			var d = new Date();
			year = d.getFullYear();
		}
	    return new Date(year, month, 0).getDate();
	}

	function emptyText(val) {return '';}

	function getCookie(c_name) {
	    var c_value = " " + document.cookie;
	    var c_start = c_value.indexOf(" " + c_name + "=");
	    if (c_start == -1) {
	        c_value = null;
	    }
	    else {
	        c_start = c_value.indexOf("=", c_start) + 1;
	        var c_end = c_value.indexOf(";", c_start);
	        if (c_end == -1) {
	            c_end = c_value.length;
	        }
	        c_value = unescape(c_value.substring(c_start,c_end));
	    }
	    return c_value;
	}

	function information_window(id,type){//id: location #
    	Ext.util.Cookies.set('information_window_id',id);
    	Ext.util.Cookies.set('information_window_type',type);
    	var tools=new Array();
    	/*if(type=='markdown'){
    		tools[0]={
    			type:'save',
    			tooltip:'Download CVS',
    			handler:function(){
    				window.parent.location.href="/content/dashboard/new_reports/purchasing/9_markdown/export_item.php?item_number="+id;
    			}
    		}
    	}*/
    	Ext.create('Ext.window.Window',{
    		title: 'Detail',
		    height: 500,
		    width: 700,
		    bodyPadding:'10 30 10 10',//top left bottom right
		    layout: 'fit',
		    maximizable:true,
		    overflowY:'auto',
		    closeAction:'destroy',
		    tools:tools,
		   	items: [{
		   		xtype:'uxiframe',
		   		loader: {
			        url: '/content/dashboard/information_window.php',
			        autoLoad: true
			    },
		   	}]
    	}).show();

    }
    function location_renderer(value,metaData,record,rowIndex,colIndex,store,view){
		var number=record.data.location;
		//if(Ext.util.Cookies.get('atk_emp_number')=='22924')
			return "<a onclick=information_window('"+number+"');>"+value+"</a>";
		//else return value;
	}

	function fillEmpty(val){
	if(!val)
		return '-';
	else if(val == "NULL")
		return '-';
	else
		return val;
	}

	function fillZero(val){
		if(!val)
			return '0';
		else if(val == "NULL")
			return '0';
		else
			return val;
	}

	