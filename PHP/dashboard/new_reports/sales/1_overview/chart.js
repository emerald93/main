Ext.require('Ext.chart.*');
Ext.require(['Ext.Window', 'Ext.fx.target.Sprite', 'Ext.layout.container.Fit', 'Ext.window.MessageBox']);

var department_cookie = Ext.util.Cookies.get('dashboard_department');
var class_cookie = Ext.util.Cookies.get('dashboard_class');
var fineline_cookie = Ext.util.Cookies.get('dashboard_fineline');
var location_cookie = Ext.util.Cookies.get('dashboard_location_selection');
if (department_cookie == '' || department_cookie == null) department_cookie='All';
if (class_cookie == '' || class_cookie == null) class_cookie='All';
if (fineline_cookie == '' || fineline_cookie == null) fineline_cookie='All';
if (location_cookie =='' || location_cookie == null) location_cookie='All';

var sortColumn = Ext.util.Cookies.get('dashboard_sortColumn');
if(sortColumn){
	sortColumn = sortColumn.split(',');
	if(sortColumn[0] != 'ty_net_sales' && sortColumn[0] != 'ly_net_sales'){
		sortColumn[0] = 'ly_net_sales';
		sortColumn[1] = 'ASC';
	}
}else{
	var sortColumn = [];
	sortColumn[0] = "ly_net_sales";
	sortColumn[1] = "ASC";
}


Ext.onReady(function () {    
var hourlySales = Ext.create('Ext.data.Store', {
    autoLoad : true,
    fields:[{
		name: 'location', 
		type: 'number',
	},{
		name: 'location_name', 
		type: 'string',
	},{
		name: 'net_sales_dollar_change', 
		type: 'number',
	},{
		name: 'net_sales_percent_change', 
		type: 'number',
	},{
		name: 'ty_net_sales', 
		type: 'number',
	},{
		name: 'ly_net_sales', 
		type: 'number',
	},{
		name: 'ty_gross_margin', 
		type: 'number',
	},{
		name: 'ty_sales_units', 
		type: 'number',
	},{
		name: 'push_pull',
		type: 'number'
	},{
		name: 'sales_units_number_change', 
		type: 'number',
		useNull: true,
	},{
		name: 'sales_units_percent_change', 
		type: 'number',
		useNull: true,
	},{
		name: 'percent_of_business', 
		type: 'number',
		useNull: true,
	}],
    proxy: {
        type: 'ajax',
        url : 'sales.php',
        reader: {
            type: 'json',
            root: 'data' 
        }
    },
	sorters: [{
		property: sortColumn[0],
		direction: sortColumn[1],
	}],
	lastSortProperty: sortColumn[0],
	lastSortDirection: sortColumn[1],
	listeners: {
		load: function(store,records,successful,eOpts){
			//Ext.getCmp('last_transaction').update(records[0].get('last_transaction'));
			Ext.getCmp('chart').unmask();
		},
		beforeload: function(store,operation,eOpts){
			var chart = Ext.getCmp('chart');
			if(chart)
				chart.mask("Loading Chart...");
		}
	}
});
	
	var pie_chart = Ext.create('Ext.chart.Chart', {
		width: '100%',
		height: 410,
		id:'piechart_salespercent',
		autoScroll: false,
		padding: '10 0 0 0',
		//resizable: false,
		style: 'background: #fff',
		animate: true,
		shadow: true,
		store: hourlySales,
		insetPadding: 40,
		legend: {
			field: 'location_name' ,
			position: 'left',
			boxStrokeWidth: 0,
			labelFont: '12px Helvetica'
		},
		items:[{
			type  : 'text',
			text  : 'Percentage of Sale for each Location - '+ Ext.util.Cookies.get('dashboard_start_date') + " to " + Ext.util.Cookies.get('dashboard_end_date'),
			font  : '12px Helvetica',
			width : 100,
			height: 30,
			x : 40, //the sprite x position
			y : 12  //the sprite y position
		/*}, {
			type: 'text',
			text: 'Data: ATK',
			font: '10px Helvetica',
			x: 12,
			y: 380
		}, {
			type: 'text',
			text: 'Source: Internet',
			font: '10px Helvetica',
			x: 12,
			y: 390*/
		}],
		series:[{
			type: 'pie',
			angleField: 'percent_of_business',
			label: {
				field: 'location',
				display: 'inside',
				calloutLine: true
			},
			showInLegend: false,
			highlight: true,
			highlightCfg: {
				fill: '#000',
				'stroke-width': 20,
				stroke: '#fff'
			},
			tips: {
				trackMouse: true,
				renderer: function(storeItem, item) {
					this.setTitle(storeItem.get('location_name') +' ('+storeItem.get('location')+ '): ' + storeItem.get('percent_of_business') + '%');
				}
			}
		}]
	});

	var pieChartWindow=Ext.create('Ext.window.Window', {
		title:'Percentage of Sales for each Location - '+ Ext.util.Cookies.get('dashboard_start_date') + " to " + Ext.util.Cookies.get('dashboard_end_date'),
		maximizable:true,
		autoScroll: true,
		width: 500,
		resizable: true,
		closeAction:'hide',
		layout:'fit',
		items: [pie_chart],
		tools:[{
			type:'refresh',
			tooltip: 'Refresh Inbox',
			// hidden:true,
			handler: function(event, toolEl, panel){
				hourlySales.reload();
			}
		},{
			type:'help',
			tooltip: 'Get Help',
			handler: function(event, toolEl, panel){
				// show help here
			}
		},{
			type:'save',
			tooltip:'Download Chart',
			handler: function(){
				Ext.getCmp('piechart_salespercent').save({type: 'image/png'});
			}
		}],
	});
	
	var paretoChart=Ext.create('Ext.chart.Chart', {
		xtype: 'chart',
		width: '100%',
		id:'paretochart_saleschange',
		height: 410,
		autoScroll: true,
		padding: '10 0 0 0',
		style: 'background: #fff',
		animate: true,
		shadow: false,
		store:hourlySales ,
		insetPadding: 40,
		legend: {
			position: 'bottom',
			boxStrokeWidth: 0,
			labelFont: '12px Helvetica'
		},
		items: [{
			type  : 'text',
			text  : 'Sales Change in dollars and percent ('+ Ext.util.Cookies.get('dashboard_start_date') + " to " + Ext.util.Cookies.get('dashboard_end_date')+' vs. last year)',
			font  : '12px Helvetica',
			width : 100,
			height: 30,
			x : 40, //the sprite x position
			y : 12  //the sprite y position
		/*}, {
			type: 'text',
			text: 'Data: ATK Department',
			font: '10px Helvetica',
			x: 12,
			y: 380*/
		}],
		axes: [{
			type: 'Numeric',
			position: 'left',
			title: 'Dollar Change',
			fields: 'net_sales_dollar_change',
			label: {
				renderer: Ext.util.Format.numberRenderer('0,0')
			},
			grid: true,
			//minimum: 0
		}, {
			type: 'Category',
			position: 'bottom',
			title: 'Location',
			fields: 'location',
			label: {
				rotate: {
					degrees: -90
				}
			}
		}, {
			type: 'Numeric',
			position: 'right',
			title:' Percent Change',
			fields: 'net_sales_percent_change',
			label: {
				renderer: function(v) {
					return v + '%';
				}
			}
		}],
		series: [{
			type: 'column',
			title: 'Sales Dollar Change',
			xField: 'location',
			yField: 'net_sales_dollar_change',
			axis: 'left',
			showInLegend: true,
			style: {
				opacity: 0.80
			},
			highlight: {
				fill: '#000',
				'stroke-width': 2,
				stroke: '#fff'
			},
			tips: {
				trackMouse: true,
				style: 'background: #FFF',
				height: 20,
				renderer: function(storeItem, item) {
					this.setTitle('<table width=\'100%\' style=\'border-collapse:collapse; background-color: #fff\'><tr><td align=\'right\' style=\'border-bottom: 1px solid #0066FF\' colspan=\'2\'><font color=\'#0066FF\'>'+storeItem.get('location_name')+' ('+storeItem.get('location') + ')</font></td></tr><tr><td>Net Sales Dollar Change:</td><td align=\'right\'>$'+Ext.util.Format.number(storeItem.get('net_sales_dollar_change'),'0,0')+'</td></tr><tr><td>Net Sales Percent Change</td><td align=\'right\'>'+Ext.util.Format.number(storeItem.get('net_sales_percent_change'),'0.0')+'%</td></tr></table>');
				}
			}
		}, {
			type: 'line',
			axis: 'right',
			showInLegend: true,
			title: 'Percentage Change',
			xfield: 'location',
			yField: 'net_sales_percent_change',
			style: {
				'stroke-width': 4
			},
			markerConfig: {
				radius: 4
			},
			highlight: {
				fill: '#000',
				radius: 5,
				'stroke-width': 2,
				stroke: '#fff'
			},
			tips: {
				trackMouse: true,
				style: 'background: #FFF',
				height: 20,
				renderer: function(storeItem, item) {
					this.setTitle('<table width=\'100%\' style=\'border-collapse:collapse; background-color: #fff\'><tr><td align=\'right\' style=\'border-bottom: 1px solid #0066FF\' colspan=\'2\'><font color=\'#0066FF\'>'+storeItem.get('location_name')+' ('+storeItem.get('location') + ')</font></td></tr><tr><td>Net Sales Dollar Change:</td><td align=\'right\'>$'+Ext.util.Format.number(storeItem.get('net_sales_dollar_change'),'0,0')+'</td></tr><tr><td>Net Sales Percent Change</td><td align=\'right\'>'+Ext.util.Format.number(storeItem.get('net_sales_percent_change'),'0.0')+'%</td></tr></table>');
				}
			}
		}]
	});
	var paretoChartWindow=Ext.create('Ext.window.Window', {
		title:'Sales Change ('+ Ext.util.Cookies.get('dashboard_start_date') + " to " + Ext.util.Cookies.get('dashboard_end_date')+' vs last year)',
		maximizable:true,
		autoScroll: true,
		resizable: true,
		closeAction:'hide',
		layout:'fit',
		items: [paretoChart],
		tools:[{
			type:'refresh',
			tooltip: 'Refresh Inbox',
			// hidden:true,
			handler: function(event, toolEl, panel){
				hourlySales.reload();
			}
		},{
			type:'help',
			tooltip: 'Get Help',
			handler: function(event, toolEl, panel){
				// show help here
			}
		},{
			type:'save',
			tooltip:'Download Chart',
			handler: function(){
				Ext.getCmp('paretochart_saleschange').save({type: 'image/png'});
			}
		}],
	});
	
	var overviewSaleGMUnit= Ext.create('Ext.chart.Chart', {
		xtype: 'chart',
		width: '100%',
		id:'overviewsalegmunit',
		autoSize: false,
		height: 410,
		padding: '10 0 0 0',
		style: 'background: #fff',
		animate: true,
		shadow: false,
		store:hourlySales ,
		insetPadding: 40,
		legend: {
			position: 'bottom',
			boxStrokeWidth: 1,
			labelFont: '12px Helvetica'
		},
		items: [{
			type  : 'text',
			text  : 'Sales, Gross Margin, and Units ('+ Ext.util.Cookies.get('dashboard_start_date') + " to " + Ext.util.Cookies.get('dashboard_end_date')+')',
			font  : '12px Helvetica',
			width : 100,
			height: 30,
			x : 40, //the sprite x position
			y : 12  //the sprite y position
		/*}, {
			type: 'text',
			text: 'Data: ATK Department',
			font: '10px Helvetica',
			x: 12,
			y: 380*/
		}],
		axes: [{
			type: 'Numeric',
			position: 'left',
			fields: ['ty_net_sales','ty_gross_margin'],
			title: '$',
			grid: true,
			//minimum: -1400,
			label: {
				renderer: Ext.util.Format.numberRenderer('0,0')
			},
			
		}, {
			type: 'Category',
			position: 'bottom',
			title:'Department',
			fields: 'location',
			label: {
				rotate: {
					degrees: -90
				}
			}
		}, {
			type: 'Numeric',
			position: 'right',
			fields: 'ty_sales_units',
			//minimum: -60,
			title:'Units',
			label: {
				renderer:Ext.util.Format.numberRenderer('0,0')	
			}
		}],
		series: [{
			type: 'column',
			title: 'Sales Units',
			xField: 'location',
			yField: 'ty_sales_units',
			axis: 'right',
			showInLegend: true,
			style: {
				opacity: 0.80
			},
			highlight: {
				fill: '#000',
				'stroke-width': 2,
				stroke: '#fff'
			},
			tips: {
				trackMouse: true,
				style: 'background: #FFF',
				height: 20,
				renderer: function(storeItem, item) {
					this.setTitle('<table width=\'100%\' style=\'border-collapse:collapse; background-color: #fff\'><tr><td align=\'right\' style=\'border-bottom: 1px solid #0066FF\' colspan=\'2\'><font color=\'#0066FF\'>'+storeItem.get('location_name')+' ('+storeItem.get('location') + ')</font></td></tr><tr><td>Net Sales:</td><td align=\'right\'>$'+Ext.util.Format.number(storeItem.get('ty_net_sales'),'0,0')+'</td></tr><tr><td>Gross Margin:</td><td align=\'right\'>$'+Ext.util.Format.number(storeItem.get('ty_gross_margin'),'0,0')+'</td></tr><tr><td>Units:</td><td align=\'right\'>' + storeItem.get('ty_sales_units').toLocaleString()+' units</td></tr></table>');
				}
			}
		
		}, {
			type: 'line',
			axis: 'left',
			showInLegend: true,
			title: 'Gross Margin',
			xfield: 'location',
			yField: ['ty_gross_margin'],
			style: {
				'stroke-width': 4
			},
			markerConfig: {
				radius: 4
			},
			highlight: {
				fill: '#000',
				radius: 5,
				'stroke-width': 2,
				stroke: '#fff'
			},
			tips: {
				trackMouse: true,
				style: 'background: #FFF',
				height: 20,
				renderer: function(storeItem, item) {
					this.setTitle('<table width=\'100%\' style=\'border-collapse:collapse; background-color: #fff\'><tr><td align=\'right\' style=\'border-bottom: 1px solid #0066FF\' colspan=\'2\'><font color=\'#0066FF\'>'+storeItem.get('location_name')+' ('+storeItem.get('location') + ')</font></td></tr><tr><td>Net Sales:</td><td align=\'right\'>$'+Ext.util.Format.number(storeItem.get('ty_net_sales'),'0,0')+'</td></tr><tr><td>Gross Margin:</td><td align=\'right\'>$'+Ext.util.Format.number(storeItem.get('ty_gross_margin'),'0,0')+'</td></tr><tr><td>Units:</td><td align=\'right\'>' + storeItem.get('ty_sales_units').toLocaleString()+' units</td></tr></table>');
				}
			}
		}, {
			type: 'line',
			axis: 'left',
			showInLegend: true,
			title: 'Sales',
			xfield: 'location',
			yField: 'ty_net_sales',
			style: {
				'stroke-width': 4
			},
			markerConfig: {
				radius: 4
			},
			highlight: {
				fill: '#000',
				radius: 5,
				'stroke-width': 2,
				stroke: '#fff'
			},
			tips: {
				trackMouse: true,
				style: 'background: #FFF',
				height: 20,
				renderer: function(storeItem, item) {
					this.setTitle('<table width=\'100%\' style=\'border-collapse:collapse; background-color: #fff\'><tr><td align=\'right\' style=\'border-bottom: 1px solid #0066FF\' colspan=\'2\'><font color=\'#0066FF\'>'+storeItem.get('location_name')+' ('+storeItem.get('location') + ')</font></td></tr><tr><td>Net Sales:</td><td align=\'right\'>$'+Ext.util.Format.number(storeItem.get('ty_net_sales'),'0,0')+'</td></tr><tr><td>Gross Margin:</td><td align=\'right\'>$'+Ext.util.Format.number(storeItem.get('ty_gross_margin'),'0,0')+'</td></tr><tr><td>Units:</td><td align=\'right\'>' + storeItem.get('ty_sales_units').toLocaleString()+' units</td></tr></table>');
				}
			}
		}]
	});
	
	var overviewSaleGMUnitWindow=Ext.create('Ext.window.Window', {
		title:'Overview of Sales, Gross Margin, and Unit ('+ Ext.util.Cookies.get('dashboard_start_date') + " to " + Ext.util.Cookies.get('dashboard_end_date')+')',
		maximizable:true,
		autoScroll: true,
		resizable: true,
		width: 500,
		constrain: true,
		closeAction:'hide',
		layout:'fit',
		items: [overviewSaleGMUnit],
		tools:[{
			type:'refresh',
			tooltip: 'Refresh Inbox',
			// hidden:true,
			handler: function(event, toolEl, panel){
				hourlySales.reload();
			}
		},{
			type:'help',
			tooltip: 'Get Help',
			handler: function(event, toolEl, panel){
				// show help here
			}
		},{
			type:'save',
			tooltip:'Download Chart',
			handler: function(){
				Ext.getCmp('overviewsalegmunit').save({type: 'image/png'});
			}
		}],
	});
	
	



 
    var chart = Ext.create('Ext.chart.Chart', {
			region: 'center',
			id: 'chart',
            style: 'background:#fff',
            animate: true,
			duration: 1000,
            store: hourlySales,
            shadow: true,
            legend: {
                position: 'bottom'
            },
             axes: [{
                type: 'Numeric',
                position: 'left',
                fields: ['ty_net_sales', 'push_pull', 'ly_net_sales'],
                label: {
                    renderer: Ext.util.Format.numberRenderer('0,0')
                },
                title: 'Net Sales',
                grid: true,
                minimum: 0
            }, {
                type: 'Category',
                position: 'bottom',
                fields: ['location'],
                title: 'Location'
            }],
            series: [{
                type: 'column',
                axis: 'left',
                highlight: true,
                tips: {
                  trackMouse: true,
                  //width: 150,
                 // height: 120,
                  renderer: function(storeItem, item) {
                    this.setTitle('<div align=\'center\'><font color=\'#0066FF\'>Location ' + storeItem.get('location') +'<br/>'+storeItem.get('location_name')+ '</font></div><hr><table width=\'100%\'><tr><td>Last Year:</td><td align=\'right\'>$ ' + storeItem.get('ly_net_sales').toLocaleString() + '</tr><tr><td>This Year:</td><td align=\'right\'>$ ' + storeItem.get('ty_net_sales').toLocaleString() + '</tr><tr><td>Change:</td><td align=\'right\'>$ ' + storeItem.get('sales_units_number_change').toLocaleString() + '</tr><tr><td>Change:</td><td align=\'right\'>' + storeItem.get('sales_units_percent_change').toLocaleString() + ' %</td></tr></table>');
                  }
                },
                label: {
                  display: 'insideStart',
                  'text-anchor': 'bottom',
                    field: 'ty_net_sales',
                    renderer: Ext.util.Format.usMoney,
                    orientation: 'vertical',
					color: '#111'
                },
                xField: 'location',
                yField: 'ty_net_sales',
				renderer: function(sprite, record, attr, index, store){
					if(record.get('ly_net_sales') < record.get('ty_net_sales'))
						var fillColor = '#C6EFCE';
					else 
						var fillColor = '#FFC7CE';
					
					return Ext.apply(attr, {
						fill: fillColor,
					});
				},
				style: {
					fill: '#C6EFCE'
				}
			},{
				type: 'line',
                axis: 'left',
                highlight: true,
                xField: 'location',
                yField: 'ly_net_sales',
				renderer: function(sprite, record, attr, index, store){
					return Ext.apply(attr, {
					fill: '#0066FF'
					});
				},
				style: {
					fill: '#0066FF'
				}
			
			
            }],
			
        });

	var northPanel = {
		region: 'north',
		//title: 'Overview',
		dockedItems : [{
			title: 'Location: '+ location_cookie+ ' - Department: '+department_cookie+' - Class: '+class_cookie+' - Fineline: '+fineline_cookie + ' (' + Ext.util.Cookies.get('dashboard_start_date') + " to " + Ext.util.Cookies.get('dashboard_end_date')+')',
			tools:[{
				type:'save',
				handler: function(){
					Ext.getCmp('chart').save({type: 'image/png'});
				}
			}],
		}]
	};
	
	if(sortColumn[0] == "ty_net_sales")
		var btnText = "Sort By ly_net_sales";
	else
		var btnText = "Sort By ty_net_sales";
	
	var southPanel = {
		region: 'south',
		//title: 'Overview',
		items : [{
			xtype: 'button',
			text: btnText,
			handler: function(btn){
				
				var chart = Ext.getCmp('chart');
				var store = chart.getStore();
				//console.log(store.sorters);
				if(store.sorters.items[0].property == 'ly_net_sales'){
					store.sort('ty_net_sales');
					btn.setText('Sort By ly_net_sales');
					
				}else{
					store.sort('ly_net_sales');
					btn.setText('Sort By ty_net_sales');
				}
			}
		},{
			xtype:'button',
			text: 'Sale Percent Chart',
			/*handler: function(btn){
				//var pie_chart=Ext.getCmp('pie_chart');
				pieChartWindow.show();
					//pie_chart.show();
			}*/
			enableToggle:true,
			toggleHandler: function(button,state){
				if(this.pressed){
					pieChartWindow.show();
				}else{
					pieChartWindow.hide();
				}
			}
		},{
			xtype:'button',
			text: 'Sale Change Chart',
			/*handler: function(btn){
				//var pie_chart=Ext.getCmp('pie_chart');
				paretoChartWindow.show();
					//pie_chart.show();
			}*/
			enableToggle:true,
			toggleHandler: function(button,state){
				if(this.pressed){
					paretoChartWindow.show();
				}else{
					paretoChartWindow.hide();
				}
			}
		},{
			xtype:'button',
			text: 'Sales, GM, Units Chart',
			/*handler: function(btn){
				//var pie_chart=Ext.getCmp('pie_chart');
				overviewSaleGMUnitWindow.show();
					//pie_chart.show();
			}*/
			enableToggle:true,
			toggleHandler: function(button,state){
				if(this.pressed){
					overviewSaleGMUnitWindow.show();
				}else{
					overviewSaleGMUnitWindow.hide();
				}
			}
		
		}]
	};

	
	Ext.application({
    name: 'Simple Extjs Grid',
    launch: function() {
        Ext.create('Ext.container.Viewport', {
            layout: 'border',
            items: [chart,northPanel,southPanel],
        });
    }
});
	
});

function reload(){
	Ext.getCmp('chart').getStore().reload();
	//hourlySales.reload();
 }
