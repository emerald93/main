/*if(Ext.is.Phone || Ext.is.Tablet){
 var scrollType = 'both';
 }else{
 var scrollType = 'vertical';
 }*/
console.log(scrollType);

var companyComp = Ext.create('Ext.data.Store', {
    autoLoad: false,
    autoDestroy: true,
    fields: [{
        name: 'location',
        type: 'string',
    }, {
        name: 'location_name',
        type: 'string',
    }, {
        name: 'company_comp_ty',
        type: 'number',
        useNull: true,
    }, {
        name: 'company_comp_ly',
        type: 'number',
        useNull: true,
    }, {
        name: 'company_comp_dollar_change',
        type: 'number',
        useNull: true,
    }, {
        name: 'company_comp_percent_change',
        type: 'number',
        useNull: true,
    }, {
        name: 'push_pull',
        type: 'number',
        useNull: true,
    }, {
        name: 'percent_of_business',
        type: 'number',
        useNull: true,
    }, {
        name: 'ty_gross_margin_percent',
        type: 'number',
        useNull: true,
    }, {
        name: 'ly_gross_margin_percent',
        type: 'number',
        useNull: true,
    }, {
        name: 'gross_margin_percent_var',
        type: 'number',
        useNull: true,
    }, {
        name: 'ty_gross_margin',
        type: 'number'
    }, {
        name: 'ly_gross_margin',
        type: 'number',
        useNull: true,
    }, {
        name: 'gross_margin_dollar_change',
        type: 'number',
        useNull: true,
    }, {
        name: 'gross_margin_percent_change',
        type: 'number',
        useNull: true,
    }, {
        name: 'ty_sales_units',
        type: 'number'
    }, {
        name: 'ly_sales_units',
        type: 'number',
        useNull: true,
    }, {
        name: 'sales_units_number_change',
        type: 'number',
        useNull: true,
    }, {
        name: 'sales_units_percent_change',
        type: 'number',
        useNull: true,
    }, {
        name: 'cost_sales',
        type: 'number',
        useNull: true,
    }],
    proxy: {
        type: 'memory',
        url: 'sales.php',
        reader: {
            type: 'json',
            root: 'summaryData'
        },
    },
    listeners: {
        load: function (store, records) {
            //console.log(store);
            //Ext.getCmp('compPanel').loadRecord(records[0]);
            Ext.getBody.unmask();
        },
        beforeload: function (store) {
            Ext.getBody.mask("Loading");
        }
    }
});

var compPanel = {
    xtype: 'grid',
    id: 'compPanel',
    //scroll: false,
    overflowY: 'scroll',
    store: companyComp,
    dock: 'bottom',
    hideHeaders: true,
    disableSelection: true,
    //trackMouseOver: false,
    columns: [{
        dataIndex: 'location',
        header: '#',
        width: 50,
        locked: true,
        hidden: true,
    }, {
        dataIndex: 'location_name',
        header: 'Name',
        width: 175,
        locked: true
    }, {
        dataIndex: 'company_comp_ty',
        header: 'This Year',
        align: 'right',
        renderer: currency,
        category: 'net_sales',
    }, {
        dataIndex: 'company_comp_ly',
        header: 'Last Year',
        align: 'right',
        renderer: currency,
        category: 'net_sales',
    }, {
        dataIndex: 'company_comp_dollar_change',
        header: 'Dollar Change',
        align: 'right',
        renderer: currency,
        category: 'net_sales',
    }, {
        dataIndex: 'company_comp_percent_change',
        header: 'Percent Change',
        align: 'right',
        renderer: percent_change,
        category: 'net_sales',
    }, {
        dataIndex: 'push_pull',
        renderer: currency,
        header: "Push / Pull",
        align: 'right',
        category: 'net_sales',
    }, {
        dataIndex: 'percent_of_business',
        renderer: percent,
        header: "% of Total",
        align: 'right',
        category: 'net_sales',
    }, {
        dataIndex: 'ty_gross_margin',
        renderer: currency,
        header: 'This Year',
        align: 'right',
        category: 'gross_margin',
    }, {
        dataIndex: 'ly_gross_margin',
        renderer: currency,
        header: 'Last Year',
        align: 'right',
        category: 'gross_margin',
    }, {
        dataIndex: 'gross_margin_dollar_change',
        renderer: currency,
        header: 'Dollar Change',
        align: 'right',
        category: 'gross_margin',
    }, {
        dataIndex: 'gross_margin_percent_change',
        renderer: percent_change,
        header: 'Percent Change',
        align: 'right',
        category: 'gross_margin',
    }, {
        dataIndex: 'ty_gross_margin_percent',
        renderer: percent,
        header: 'This Year',
        align: 'right',
        category: 'gross_margin_percent',
    }, {
        dataIndex: 'ly_gross_margin_percent',
        renderer: percent,
        header: 'Last Year',
        align: 'right',
        category: 'gross_margin_percent',
    }, {
        dataIndex: 'gross_margin_percent_var',
        renderer: percent_change,
        header: 'Variance',
        align: 'right',
        category: 'gross_margin_percent',
    }, {
        dataIndex: 'ty_sales_units',
        renderer: units,
        header: 'This Year',
        align: 'right',
        category: 'sales_units',
    }, {
        dataIndex: 'ly_sales_units',
        renderer: units,
        header: 'Last Year',
        align: 'right',
        category: 'sales_units',
    }, {
        dataIndex: 'sales_units_number_change',
        renderer: units_number_change,
        header: 'Number Change',
        align: 'right',
        category: 'sales_units',
    }, {
        dataIndex: 'sales_units_percent_change',
        renderer: percent_change,
        header: 'Percent Change',
        align: 'right',
        category: 'sales_units',
    }, {
        dataIndex: 'spaceHolder',
        width: 17,
    }],
    viewConfig: {
        stripeRows: false,
        //overflowY: 'scroll',
    },
    listeners: {
        itemclick: function () {
            if (window.opener)
                var parent = window.opener;
            else
                var parent = window.parent;
            parent.Ext.getCmp('parameters_panel').mask('Setting Selection...');
            Ext.Ajax.request({
                url: '/content/dashboard/parameters/location/different_locations.php?query=2',
                success: function () {
                    parent.Ext.getCmp('parameters_panel').unmask();
                    //parent.reloadIframes();
                    Ext.util.Cookies.set('dashboard_location_selection', 'Same Stores (Financial)');
                    parent.updateLocations();
                    reports_navigation('O');
                },
                failure: function () {
                    parent.Ext.getCmp('parameters_panel').unmask();
                }
            });
        }
    }
}

var startDate = Ext.util.Cookies.get('dashboard_start_date');
var endDate = Ext.util.Cookies.get('dashboard_end_date');
var LYstartDate = Ext.util.Cookies.get('dashboard_ly_start_date');
var LYendDate = Ext.util.Cookies.get('dashboard_ly_end_date');

var location_cookie = (Ext.util.Cookies.get('dashboard_location_selection') !== null) ? Ext.util.Cookies.get('dashboard_location_selection') : 'All';

var groupby = Ext.util.Cookies.get('dashboard_groupby');
if (!groupby)
    groupby = "District";

var sortColumn = Ext.util.Cookies.get('dashboard_sortColumn');
if (sortColumn) {
    sortColumn = sortColumn.split(',');
} else {
    var sortColumn = [];
    sortColumn[0] = "ty_net_sales";
    sortColumn[1] = "DESC";
}


var EmployeeRecords = Ext.create('Ext.data.Store', {
    autoLoad: true,
    autoDestroy: true,
    storeId: 'test',
    defaultSortDirection: 'DESC',
    sorters: [{
        property: sortColumn[0],
        direction: sortColumn[1],
    }],
    lastSortProperty: sortColumn[0],
    lastSortDirection: sortColumn[1],
    groupField: groupby,
    fields: [{
        name: 'location',
        type: 'number',
        useNull: true,
    }, {
        name: 'District',
        type: 'number',
        useNull: true,
    }, {
        name: 'Volume',
        type: 'string',
        useNull: true,
    }, {
        name: 'State',
        type: 'string',
        useNull: true,
    }, {
        name: 'Zone',
        type: 'string',
        useNull: true,
    }, {
        name: 'Primary DC',
        type: 'number',
        useNull: true,
    }, {
        name: 'location_name',
        type: 'string',
    }, {
        name: 'ty_net_sales',
        type: 'number',
    }, {
        name: 'ly_net_sales',
        type: 'number',
        useNull: true,
    }, {
        name: 'net_sales_dollar_change',
        type: 'number',
        useNull: true,
    }, {
        name: 'net_sales_percent_change',
        type: 'number',
        useNull: true,
    }, {
        name: 'ty_gross_margin',
        type: 'number'
    }, {
        name: 'ly_gross_margin',
        type: 'number',
        useNull: true,
    }, {
        name: 'gross_margin_dollar_change',
        type: 'number',
        useNull: true,
    }, {
        name: 'gross_margin_percent_change',
        type: 'number',
        useNull: true,
    }, {
        name: 'ty_gross_margin_percent',
        type: 'number',
        useNull: true,
    }, {
        name: 'ly_gross_margin_percent',
        type: 'number',
        useNull: true,
    }, {
        name: 'gross_margin_percent_var',
        type: 'number',
        useNull: true,
    }, {
        name: 'ty_sales_units',
        type: 'number'
    }, {
        name: 'ly_sales_units',
        type: 'number',
        useNull: true,
    }, {
        name: 'sales_units_number_change',
        type: 'number',
        useNull: true,
    }, {
        name: 'sales_units_percent_change',
        type: 'number',
        useNull: true,
    }, {
        name: 'push_pull',
        type: 'number',
        useNull: true,
    }, {
        name: 'percent_of_business',
        type: 'number',
        useNull: true,
    }, {
        name: 'color',
        type: 'number',
        useNull: true,
    }, {
        name: 'cost_sales',
        type: 'number',
        useNull: true,
    }, {
        name: 'ly_cost_sales',
        type: 'number',
        useNull: true,
    }, {
        name: 'cost_sales_change',
        type: 'number',
        useNull: true,
    }],
    proxy: {
        type: 'ajax',
        url: 'sales.php',
        reader: {
            type: 'json',
            root: 'data'
        },
        //timeout: 1,
        listeners: {
            exception: function (proxy, response, operation, eOpts) {
                if (response.responseText)
                    console.log(response.responseText)
                Ext.Msg.confirm('Request Failure', 'Could not load data at this time.  Try again?', function (btn) {
                    if (btn == 'yes') {
                        reload();
                    }
                });
            }
        }
    },
    listeners: {
        beforesort: function (me, sorters, eOpts) {
            if (sorters) {
                if (me.lastSortProperty != sorters[0].property) {
                    me.lastSortProperty = sorters[0].property;
                    sorters[0].toggle();
                }
                me.lastSortDirection = sorters[0].direction;
            }
            if (me.lastSortProperty) {
                Ext.util.Cookies.set('dashboard_sortColumn', me.lastSortProperty + ',' + me.lastSortDirection);
            }
        },
        load: function (store) {
            //console.log(store.proxy.reader.jsonData);

            companyComp.loadRawData(store.proxy.reader.jsonData);

        }
    }
});


var groupStore = Ext.create('Ext.data.Store', {
    fields: ['name'],
    data: [
        {"name": "District"},
        {"name": "Volume"},
        {"name": "State"},
        {"name": "Primary DC"},
        {"name": "Zone"},
    ],
});

var compareStore = Ext.create('Ext.data.Store', {
    fields: ['name'],
    data: [
        {"name": "District"},
        {"name": "Volume"},
        {"name": "State"},
        {"name": "Selection"},
        {"name": "SS(F)"},
        {"name": "SS(A)"},
        {"name": "SS(F) - Internet"},
    ],
});


var helpWindow = Ext.create('Ext.window.Window', {
    title: 'Help',
    height: 400,
    width: 600,
    maximizable: true,
    layout: 'fit',
    closeAction: 'hide',
    items: [{
        xtype: 'component',
        layout: 'fit',
        border: false,
        autoEl: {
            tag: "iframe",
            src: "help.html",
        },
    }],
});

var helpTool = {
    xtype: 'tool',
    type: 'help',
    tooltip: 'Get Help',
    handler: function (event, toolEl, panelHeader) {
        //window.open('help.html','Help','height=300,width=300');
        helpWindow.show();
    }
};


Ext.application({
    name: 'Simple Extjs Grid',
    requires: ['Ext.ux.exporter.Exporter', 'Ext.ux.grid.Printer'],
    launch: function () {


        var grouping = Ext.util.Cookies.get('grouping');
        if (grouping != 'true')
            grouping = false;
        else
            grouping = true;

        if (grouping)
            var collpaseTitle = "";
        Ext.create('Ext.container.Viewport', {
            layout: 'fit',
            items: [{
                xtype: 'gridpanel',
                scroll: scrollType,
                id: 'overview-gridpanel',
                title: startDate + ' - ' + endDate + ' | Locations: ' + location_cookie,

                //stateful: true,
                tools: [
                    {
                        type: 'collapse',
                        tooltip: 'Collapse Rows',
                        handler: function (event, toolEl, panelHeader) {
                            var panel = panelHeader.up();
                            var view = panel.view;
                            view = view.normalView;
                            var feature = view.features;
                            if (this.type == "collapse") {
                                feature[0].collapseAll();
                                this.setType("expand");
                            } else {
                                feature[0].expandAll();
                                this.setType("collapse");
                            }

                        }
                    }, helpTool],
                store: EmployeeRecords,
                bufferedRenderer: false,
                dockedItems: [{
                    xtype: 'toolbar',
                    autoScroll: true,
                    dock: 'bottom',
                    items: [
                        {
                            //text:'Menu',
                            icon: '/content/page_management/icons/Menu-100.png',
                            iconCls: 'icon',
                            menu: {
                                xtype: 'menu',
                                items: [

                                    {
                                        xtype: 'combo',
                                        //id: 'groupComboBtn',
                                        store: compareStore,
                                        displayField: 'name',
                                        valueField: 'name',
                                        value: Ext.util.Cookies.get('dashboard_compare'),
                                        fieldLabel: 'Push/Pull Comparison',
                                        listeners: {
                                            select: function (combo, records, eOpts) {
                                                var compare = records[0].get('name');
                                                Ext.util.Cookies.set('dashboard_compare', compare);
                                                reload();
                                            }
                                        },
                                    },
                                    {
                                        xtype: 'combo',
                                        id: 'groupComboBtn',
                                        store: groupStore,
                                        displayField: 'name',
                                        valueField: 'name',
                                        value: groupby,
                                        fieldLabel: 'Group by',
                                        listeners: {
                                            select: function (combo, records, eOpts) {
                                                var groupby = records[0].get('name');
                                                EmployeeRecords.group(groupby);
                                                var collapseBtn = Ext.getCmp('groupCollapseBtn');
                                                if (collapseBtn.pressed) {
                                                    collapseBtn.toggle(false);
                                                    collapseBtn.toggle(true);
                                                } else {
                                                    collapseBtn.toggle(true);
                                                    collapseBtn.toggle(false);
                                                }
                                                Ext.util.Cookies.set('dashboard_groupby', groupby);

                                            }
                                        },
                                    }, {
                                        xtype: 'menuseparator'
                                    }, {
                                        xtype: 'button',
                                        text: 'Disable Grouping',
                                        id: 'groupingBtn',
                                        enableToggle: true,
                                        toggleHandler: function (button, state) {
                                            var panel = Ext.getCmp('overview-gridpanel');
                                            var view = panel.view;
                                            var normal = view.normalView;
                                            var locked = view.lockedView;
                                            var feature = normal.features;
                                            var feature2 = locked.features;
                                            if (this.pressed) {
                                                feature[0].disable();
                                                feature2[0].disable();
                                                this.setText("Enable Grouping");
                                                Ext.util.Cookies.set('grouping', 'false');
                                                Ext.getCmp('groupComboBtn').hide();
                                                Ext.getCmp('groupCollapseBtn').hide();
                                            } else {
                                                feature[0].enable();
                                                feature2[0].enable();
                                                this.setText("Disable Grouping");
                                                Ext.util.Cookies.set('grouping', 'true');
                                                Ext.getCmp('groupComboBtn').show();
                                                Ext.getCmp('groupCollapseBtn').show();
                                            }
                                        }
                                    }, {
                                        xtype: 'button',
                                        text: 'Collapse All',
                                        id: 'groupCollapseBtn',
                                        enableToggle: true,
                                        toggleHandler: function (button, state) {
                                            var panel = Ext.getCmp('overview-gridpanel');
                                            var view = panel.view;
                                            view = view.normalView;
                                            var feature = view.features;
                                            if (this.pressed) {
                                                feature[0].collapseAll();
                                                this.setText("Expand All");
                                            } else {
                                                feature[0].expandAll();
                                                this.setText("Collapse All");
                                            }
                                        }
                                    }, {
                                        xtype: 'button',
                                        text: 'Hide Summary',
                                        id: 'hideSummaryBtn',
                                        enableToggle: true,
                                        toggleHandler: function (button, state) {
                                            var panel = Ext.getCmp('overview-gridpanel');
                                            var view = panel.view;
                                            var normal = view.normalView;
                                            var locked = view.lockedView;
                                            var feature = normal.features;
                                            var feature2 = locked.features
                                            if (this.pressed) {
                                                feature[0].toggleSummaryRow(false);
                                                feature[1].toggleSummaryRow(false);
                                                feature2[0].toggleSummaryRow(false);
                                                feature2[1].toggleSummaryRow(false);
                                                //feature[0].collapseAll();
                                                //feature2[0].collapseAll();
                                                feature[0].expandAll();
                                                feature2[0].expandAll();
                                                this.setText("Show Summary");
                                            } else {
                                                feature[0].toggleSummaryRow(true);
                                                feature[1].toggleSummaryRow(true);
                                                feature2[0].toggleSummaryRow(true);
                                                feature2[1].toggleSummaryRow(true);
                                                //feature[0].collapseAll();
                                                //feature2[0].collapseAll();
                                                feature[0].expandAll();
                                                feature2[0].expandAll();
                                                this.setText("Hide Summary");
                                            }
                                        }
                                    }, {
                                        xtype: 'menuseparator'
                                    }, {
                                        xtype: 'button',
                                        id: 'netSalesBtn',
                                        text: 'Hide Net Sales',
                                        enableToggle: true,
                                        //hidden: true,
                                        toggleHandler: function (button, state) {
                                            var panel = Ext.getCmp('overview-gridpanel');
                                            var panel2 = Ext.getCmp('compPanel');
                                            if (this.pressed) {
                                                var columns = panel.columns;
                                                for (var i = 0; i < columns.length; i++) {
                                                    if (columns[i].up().text == "Net Sales") {
                                                        columns[i].up().hide();
                                                        break;
                                                    }
                                                }

                                                var columns = panel2.columns;
                                                for (var i = 0; i < columns.length; i++) {
                                                    if (columns[i].category == "net_sales") {
                                                        columns[i].hide();
                                                    }
                                                }

                                                this.setText("Show Net Sales");
                                            } else {
                                                var columns = panel.columns;
                                                for (var i = 0; i < columns.length; i++) {
                                                    if (columns[i].up().text == "Net Sales")
                                                        columns[i].up().show();
                                                }

                                                var columns = panel2.columns;
                                                for (var i = 0; i < columns.length; i++) {
                                                    if (columns[i].category == "net_sales")
                                                        columns[i].show();
                                                }
                                                this.setText("Hide Net Sales");
                                            }
                                        }
                                    }, {
                                        xtype: 'button',
                                        id: 'grossBtn',
                                        text: 'Hide Gross Margin',
                                        enableToggle: true,
                                        //hidden: true,
                                        toggleHandler: function () {
                                            var panel = Ext.getCmp('overview-gridpanel');
                                            var panel2 = Ext.getCmp('compPanel');
                                            if (this.pressed) {
                                                var columns = panel.columns;
                                                for (var i = 0; i < columns.length; i++) {
                                                    if (columns[i].up().text == "Gross Margin")
                                                        columns[i].up().hide();
                                                }

                                                var columns = panel2.columns;
                                                for (var i = 0; i < columns.length; i++) {
                                                    if (columns[i].category == "gross_margin")
                                                        columns[i].hide();
                                                }

                                                this.setText("Show Gross Margin");
                                            } else {
                                                var columns = panel.columns;
                                                for (var i = 0; i < columns.length; i++) {
                                                    if (columns[i].up().text == "Gross Margin")
                                                        columns[i].up().show();
                                                }

                                                var columns = panel2.columns;
                                                for (var i = 0; i < columns.length; i++) {
                                                    if (columns[i].category == "gross_margin")
                                                        columns[i].show();
                                                }
                                                this.setText("Hide Gross Margin");
                                            }
                                        }
                                    }, {
                                        xtype: 'button',
                                        id: 'grossPercentBtn',
                                        text: 'Hide Gross Margin Percent',
                                        enableToggle: true,
                                        //hidden: true,
                                        toggleHandler: function () {
                                            var panel = Ext.getCmp('overview-gridpanel');
                                            var panel2 = Ext.getCmp('compPanel');
                                            if (this.pressed) {
                                                var columns = panel.columns;
                                                for (var i = 0; i < columns.length; i++) {
                                                    if (columns[i].up().text == "Gross Margin Percent")
                                                        columns[i].up().hide();
                                                }

                                                var columns = panel2.columns;
                                                for (var i = 0; i < columns.length; i++) {
                                                    if (columns[i].category == "gross_margin_percent")
                                                        columns[i].hide();
                                                }

                                                this.setText("Show Gross Margin Percent");
                                            } else {
                                                var columns = panel.columns;
                                                for (var i = 0; i < columns.length; i++) {
                                                    if (columns[i].up().text == "Gross Margin Percent")
                                                        columns[i].up().show();
                                                }

                                                var columns = panel2.columns;
                                                for (var i = 0; i < columns.length; i++) {
                                                    if (columns[i].category == "gross_margin_percent")
                                                        columns[i].show();
                                                }
                                                this.setText("Hide Gross Margin Percent");
                                            }
                                        }
                                    }, {
                                        xtype: 'button',
                                        id: 'unitsBtn',
                                        text: 'Hide Units',
                                        enableToggle: true,
                                        //hidden: true,
                                        toggleHandler: function () {
                                            var panel = Ext.getCmp('overview-gridpanel');
                                            var panel2 = Ext.getCmp('compPanel');
                                            if (this.pressed) {
                                                var columns = panel.columns;
                                                for (var i = 0; i < columns.length; i++) {
                                                    if (columns[i].up().text == "Units")
                                                        columns[i].up().hide();
                                                }

                                                var columns = panel2.columns;
                                                for (var i = 0; i < columns.length; i++) {
                                                    if (columns[i].category == "sales_units")
                                                        columns[i].hide();
                                                }

                                                this.setText("Show Units");
                                            } else {
                                                var columns = panel.columns;
                                                for (var i = 0; i < columns.length; i++) {
                                                    if (columns[i].up().text == "Units")
                                                        columns[i].up().show();
                                                }

                                                var columns = panel2.columns;
                                                for (var i = 0; i < columns.length; i++) {
                                                    if (columns[i].category == "sales_units")
                                                        columns[i].show();
                                                }

                                                this.setText("Hide Units");
                                            }
                                        },
                                    }
                                ]
                            }

                        }
                        , '->', {
                            xtype: 'button',
                            text: 'Drill Highlighted Locations',
                            icon: '/content/page_management/icons/Drill-100.png',
                            iconCls: 'icon',
                            handler: function (btn) {
                                var panel = Ext.getCmp('overview-gridpanel');
                                var store = panel.getStore();
                                store.filter("color", "1");
                                var locations = store.collect('location');
                                console.log(locations);

                                if (locations != "") {
                                    if (locations.length == 1) {
                                        Ext.util.Cookies.set('dashboard_location_selection', locations);
                                    } else {
                                        Ext.util.Cookies.set('dashboard_location_selection', 'Custom');
                                    }

                                    Ext.util.Cookies.set('dashboard_locations', locations);


                                }
                                if (window.opener)
                                    window.opener.updateLocations();
                                else if (window.parent)
                                    window.parent.updateLocations();

                                //reload();
                                store.clearFilter();
                                reports_navigation('O');
                            }
                        }/*,{
                         xtype: 'exporterbutton',
                         text: 'CSV',
                         icon: "/content/dashboard/images/CSV-24.png",
                         }*/, {
                            xtype: 'exporterbutton',
                            text: 'Excel',
                            format: 'excel',
                            hidden: true,
                            icon: "/content/dashboard/images/excel24.png",
                        }, {
                            xtype: 'button',
                            text: 'Export',
                            icon: "/content/dashboard/images/excel24.png",
                            handler: function () {
                                window.open('export.php');
                            }
                        }]
                }, compPanel],
                viewConfig: {
                    //scroll: 'vertical',
                    stripeRows: true,
                    enableTextSelection: true,
                    getRowClass: function (record) {
                        if (record.get('location') < 1) {
                            return 'total-row';
                        }
                        if (record.get('color') == 1) {
                            return 'custom-highlight';
                        }
                    }
                },
                columns: [
                    {
                        dataIndex: 'location',
                        header: '#',
                        width: 50,
                        sortable: true,
                        locked: true,
                        showSummaryRow: false,
                        editor: {
                            xtype: 'textfield'
                        },
                        items: {
                            xtype: 'textfield',
                            flex: 1,
                            margin: 2,
                            enableKeyEvents: true,
                            listeners: {
                                keyup: function () {
                                    var store = this.up('tablepanel').store;
                                    store.clearFilter();
                                    if (this.value) {
                                        store.filter({
                                            property: 'location',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    }
                                },
                                //buffer: 500
                            }
                        }
                    }, {
                        dataIndex: 'location_name',
                        header: 'Name',
                        width: 125,
                        sortable: true,
                        locked: true,
                        showSummaryRow: true,
                        renderer: location_renderer,
                        summaryType: function (records) {
                            var group = this.getGroupField();
                            //var value = records[0].get(group);
                            //return group + " " + value + " Total";
                            if (records.length == this.count())
                                return "Total"
                            return group + " Total";
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items: {
                            xtype: 'textfield',
                            flex: 1,
                            margin: 2,
                            enableKeyEvents: true,
                            listeners: {
                                keyup: function () {
                                    var store = this.up('tablepanel').store;
                                    store.clearFilter();
                                    if (this.value) {
                                        store.filter({
                                            property: 'location_name',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    }
                                },
                                //buffer: 500
                            }
                        }
                    }, {
                        dataIndex: 'District',
                        header: 'District',
                        width: 50,
                        sortable: true,
                        showSummaryRow: false,
                        hidden: true,
                    }, {
                        dataIndex: 'Volume',
                        header: 'Volume',
                        width: 50,
                        sortable: true,
                        showSummaryRow: false,
                        hidden: true,
                    }, {
                        dataIndex: 'State',
                        header: 'State',
                        width: 50,
                        sortable: true,
                        showSummaryRow: false,
                        hidden: true,
                    }, {
                        dataIndex: 'Zone',
                        header: 'Zone',
                        width: 50,
                        sortable: true,
                        showSummaryRow: false,
                        hidden: true,
                    }, {
                        dataIndex: 'primary_dc',
                        header: 'Primary DC',
                        width: 50,
                        sortable: true,
                        showSummaryRow: false,
                        hidden: true,
                    }, {
                        text: 'Net Sales',
                        listeners: {
                            headerclick: function (ct, column, e, t, eOpts) {
                                //column.hide();
                                var btn = Ext.getCmp('netSalesBtn');
                                btn.toggle();
                                //btn.show();
                            }
                        },
                        columns: [{
                            id: 'ty_net_sales',
                            dataIndex: 'ty_net_sales',
                            renderer: currency,
                            header: 'This Year',
                            align: 'right',
                            sortable: true,
                            summaryRenderer: currency,
                            summaryType: 'sum',
                            //tdCls: 'custom-sort-highlight',
                        }, {
                            id: 'ly_net_sales',
                            dataIndex: 'ly_net_sales',
                            renderer: currency,
                            header: 'Previous Year',
                            align: 'right',
                            sortable: true,
                            summaryRenderer: currency,
                            summaryType: 'sum',
                        }, {
                            id: 'net_sales_dollar_change',
                            dataIndex: 'net_sales_dollar_change',
                            renderer: currency,
                            header: 'Dollar Change',
                            align: 'right',
                            sortable: true,
                            //summaryRenderer: currency,
                            //summaryType: 'sum',
                            summaryRenderer: function (value, summaryData, dataIndex) {
                                summaryData['net_sales_dollar_change'] = summaryData['ty_net_sales'] - summaryData['ly_net_sales'];
                                return currency(summaryData['ty_net_sales'] - summaryData['ly_net_sales']);
                            }
                        }, {
                            dataIndex: 'net_sales_percent_change',
                            renderer: percent_change,
                            header: 'Percent change',
                            align: 'right',
                            sortable: true,
                            //4.2.0
                            /*summaryRenderer: function(value, metaData, record, rowIdx, colIdx, store, view){
                             return percent_change((record.get('net_sales_dollar_change') / record.get('ly_net_sales')) * 100);
                             }*/
                            //4.2.3
                            summaryRenderer: function (value, summaryData, dataIndex) {
                                return percent_change(((summaryData['net_sales_dollar_change'] / summaryData['ly_net_sales'])) * 100);
                            }
                        }, {
                            dataIndex: 'push_pull',
                            renderer: currency,
                            header: "Push / Pull",
                            align: 'right',
                            sortable: true,
                            summaryRenderer: currency,
                            summaryType: 'sum',

                            /*items:[
                             {
                             xtype: 'combo',
                             layout:'fit',
                             //id: 'groupComboBtn',
                             store: compareStore,
                             displayField: 'name',
                             valueField: 'name',
                             value: Ext.util.Cookies.get('dashboard_compare'),
                             fieldLabel: 'P/P Compare',
                             listeners: {
                             select: function(combo, records, eOpts){
                             var compare = records[0].get('name');
                             Ext.util.Cookies.set('dashboard_compare',compare);
                             reload();
                             }
                             },
                             }
                             ]*/
                        }, {
                            dataIndex: 'percent_of_business',
                            renderer: percent,
                            header: "% of Total",
                            align: 'right',
                            sortable: true,
                        }]
                    }, {
                        text: 'Gross Margin',
                        listeners: {
                            headerclick: function (ct, column, e, t, eOpts) {
                                //column.hide();
                                var btn = Ext.getCmp('grossBtn');
                                //btn.setText("Show Gross Margin");
                                btn.toggle();
                                //btn.show();
                            }
                        },
                        columns: [{
                            id: 'ty_gross_margin',
                            dataIndex: 'ty_gross_margin',
                            renderer: currency,
                            header: 'This Year',
                            align: 'right',
                            sortable: true,
                            summaryRenderer: currency,
                            summaryType: 'sum',
                        }, {
                            id: 'ly_gross_margin',
                            dataIndex: 'ly_gross_margin',
                            renderer: currency,
                            header: 'Last Year',
                            align: 'right',
                            sortable: true,
                            summaryRenderer: currency,
                            summaryType: 'sum',
                        }, {
                            id: 'gross_margin_dollar_change',
                            dataIndex: 'gross_margin_dollar_change',
                            renderer: currency,
                            header: 'Dollar Change',
                            align: 'right',
                            sortable: true,
                            //summaryRenderer: currency,
                            //summaryType: 'sum',
                            summaryRenderer: function (value, summaryData, dataIndex) {
                                value = summaryData['ty_gross_margin'] - summaryData['ly_gross_margin'];
                                summaryData['gross_margin_dollar_change'] = value;

                                return currency(value);
                            }
                        }, {
                            dataIndex: 'gross_margin_percent_change',
                            renderer: percent_change,
                            header: 'Percent Change',
                            align: 'right',
                            sortable: true,
                            //4.2.0
                            /*summaryRenderer: function(value, metaData, record, rowIdx, colIdx, store, view){
                             return percent_change((record.get('gross_margin_dollar_change') / record.get('ly_gross_margin')) * 100);
                             }*/
                            //4.2.3
                            summaryRenderer: function (value, summaryData, dataIndex) {
                                return percent_change((summaryData['gross_margin_dollar_change'] / summaryData['ly_gross_margin']) * 100);
                            }
                        }]
                    }, {
                        text: 'Gross Margin Percent',
                        listeners: {
                            headerclick: function (ct, column, e, t, eOpts) {
                                //column.hide();
                                var btn = Ext.getCmp('grossPercentBtn');
                                //btn.setText("Show Gross Margin");
                                btn.toggle();
                                //btn.show();
                            }
                        },
                        columns: [{
                            id: 'ty_gross_margin_percent',
                            dataIndex: 'ty_gross_margin_percent',
                            renderer: percent,
                            header: 'This Year',
                            align: 'right',
                            sortable: true,
                            summaryRenderer: function (value, summaryData, dataIndex) {
                                value = summaryData['ty_gross_margin'] / summaryData['ty_net_sales'] * 100;
                                summaryData['ty_gross_margin_percent'] = value;
                                return percent_change(value);
                            }
                        }, {
                            id: 'ly_gross_margin_percent',
                            dataIndex: 'ly_gross_margin_percent',
                            renderer: percent,
                            header: 'Last Year',
                            align: 'right',
                            sortable: true,
                            summaryRenderer: function (value, summaryData, dataIndex) {
                                value = summaryData['ly_gross_margin'] / summaryData['ly_net_sales'] * 100;
                                summaryData['ly_gross_margin_percent'] = value;
                                return percent_change(value);
                            }
                        }, {
                            dataIndex: 'gross_margin_percent_var',
                            renderer: percent_change,
                            header: 'Variance',
                            align: 'right',
                            sortable: true,
                            summaryRenderer: function (value, summaryData, dataIndex) {
                                return percent_change(summaryData['ty_gross_margin_percent'] - summaryData['ly_gross_margin_percent']);
                            }
                        }]
                    }, {
                        text: 'Units',
                        listeners: {
                            headerclick: function (ct, column, e, t, eOpts) {
                                //column.hide();
                                var btn = Ext.getCmp('unitsBtn');
                                //btn.setText("Show Units");
                                btn.toggle();
                                //btn.show();
                            }
                        },
                        columns: [{
                            id: 'ty_sales_units',
                            dataIndex: 'ty_sales_units',
                            renderer: units,
                            header: 'This Year',
                            align: 'right',
                            summaryRenderer: units,
                            summaryType: 'sum',
                        }, {
                            id: 'ly_sales_units',
                            dataIndex: 'ly_sales_units',
                            renderer: units,
                            header: 'Last Year',
                            align: 'right',
                            sortable: true,
                            summaryRenderer: units,
                            summaryType: 'sum',
                        }, {
                            id: 'sales_units_number_change',
                            dataIndex: 'sales_units_number_change',
                            renderer: units_number_change,
                            header: 'Number Change',
                            align: 'right',
                            sortable: true,
                            //summaryRenderer: units_number_change,
                            //summaryType: 'sum'
                            summaryRenderer: function (value, summaryData, dataIndex) {
                                value = summaryData['ty_sales_units'] - summaryData['ly_sales_units'];
                                summaryData['sales_units_number_change'] = value;

                                return currency(value);
                            }
                        }, {
                            dataIndex: 'sales_units_percent_change',
                            renderer: percent_change,
                            header: 'Percent Change',
                            align: 'right',
                            sortable: true,
                            //4.2.0
                            /*summaryRenderer: function(value, metaData, record, rowIdx, colIdx, store, view){
                             return percent_change((record.get('sales_units_number_change') / record.get('ly_sales_units')) * 100);
                             }*/
                            //4.2.3
                            summaryRenderer: function (value, summaryData, dataIndex) {
                                return percent_change((summaryData['sales_units_number_change'] / summaryData['ly_sales_units']) * 100);

                            }
                        }]
                    },
                    {
                        text: 'Cost Sales',
                        columns: [
                            {
                                dataIndex: 'cost_sales',
                                id: 'cost_sales',
                                renderer: currency,
                                header: 'Cost Sales',
                                align: 'right',
                                sortable: true,
                                hidden: true,
                                summaryType: 'sum',
                                summaryRenderer: currency,

                                //4.2.3
                            }, {
                                dataIndex: 'ly_cost_sales',
                                id: 'ly_cost_sales',
                                renderer: currency,
                                header: 'Cost Sales',
                                align: 'right',
                                sortable: true,
                                hidden: true,
                                summaryType: 'sum',
                                summaryRenderer: currency,

                                //4.2.3
                            }, {
                                dataIndex: 'cost_sales_change',
                                id: 'cost_sales_change',
                                renderer: percent_change,
                                header: 'Cost Sales Change',
                                align: 'right',
                                sortable: true,
                                hidden: true,
                                summaryRenderer: function (value, summaryData, dataIndex) {
                                    return percent_change((summaryData['cost_sales'] / summaryData['ly_cost_sales'] - 1) * 100);

                                }

                                //4.2.3
                            }
                        ]
                    }
                ],
                listeners: {
                    itemclick: function (view, rec, item, index, eventObj) {
                        var color = rec.get('color');
                        if (color == 1) {
                            rec.set('color', 0);
                            view.removeRowCls(rec, 'custom-highlight');
                        } else {
                            rec.set('color', 1);
                            view.addRowCls(rec, 'custom-highlight');
                        }
                    },
                    ////////// Summary Click Event //////////////
                    click: {
                        element: 'body',
                        //delegate: '.x-grid-cell',
                        delegate: '.x-grid-row-summary',
                        fn: function (e, target) {
                            //alert('clicked');
                            if (Ext.fly(target).up('tfoot')) {
                                reports_navigation('O');
                            } else {
                                var groupEl;
                                var row = Ext.fly(target).up('.x-grid-row');
                                while (row && !groupEl) {
                                    groupEl = row.down('.x-grid-group-hd');
                                    row = row.prev('.x-grid-row');
                                }
                                var panel = Ext.getCmp('overview-gridpanel');
                                var view = panel.view;
                                var feature = view.normalView.features;
                                var feature2 = view.lockedView.features;
                                var groupName = feature[0].getGroupName(groupEl);

                                if (!groupName) {
                                    groupName = feature2[0].getGroupName(groupEl);
                                }
                                var groupType = EmployeeRecords.getGroupField();
                                //console.log('Group type ' + groupType);
                                //console.log('Group clicked: ' + groupName);


                                Ext.util.Cookies.set('dashboard_location_selection', groupType + " " + groupName);
                                if (groupType == "Primary DC")
                                    groupType = "primary_dc";

                                Ext.Ajax.request({
                                    url: '/content/dashboard/parameters/location/comp.php?' + groupType + '[]=' + groupName,
                                    success: function () {
                                        reports_navigation('O');
                                        if (window.opener) {
                                            window.opener.updateLocations();
                                        } else if (window.parent) {
                                            window.parent.updateLocations();
                                        }
                                    }
                                });
                            }
                        }
                    },
                    headerclick: function (headerCt, column, event, html) {

                    }
                },
                features: [{
                    id: 'grouptograb',
                    ftype: 'groupingsummary',
                    startCollapsed: false,
                    hideGroupedHeader: true,
                    enableGroupingMenu: false, //4.2.3 => true is bugged.
                }, {
                    ftype: 'summary',
                    //dock: 'bottom',
                    //remoteRoot: 'summaryData',
                }],
            }],
        });
        if (!grouping)
            Ext.getCmp('groupingBtn').toggle(true);
        var gridOne = Ext.getCmp('overview-gridpanel');
        var gridTwo = Ext.getCmp('compPanel');
        gridOne.view.getEl().on('scroll', function (e, t) {
            gridTwo.view.getEl().dom.scrollLeft = t.scrollLeft;
        });
        gridTwo.view.getEl().on('scroll', function (e, t) {
            gridOne.view.getEl().dom.scrollLeft = t.scrollLeft;
        });
    }
});

function close() {
    Ext.util.Cookies.clear('dashboard_locations');
    Ext.util.Cookies.set('dashboard_location_selection', 'All');
    if (window.parent) {
        window.parent.updateLocations();
    } else if (window.opener) {
        window.opener.updateLocations();
    }
}

function reload() {
    EmployeeRecords.reload();
    var location_cookie = (Ext.util.Cookies.get('dashboard_location_selection') !== null) ? Ext.util.Cookies.get('dashboard_location_selection') : 'All';
    var startDate = Ext.util.Cookies.get('dashboard_start_date');
    var endDate = Ext.util.Cookies.get('dashboard_end_date');
    Ext.getCmp('overview-gridpanel').setTitle(startDate + ' - ' + endDate + ' | Locations: ' + location_cookie);
}

Ext.EventManager.on(window, 'unload', function () {
    Ext.getCmp('overview-gridpanel').destroy();
});

function print(pnl) {
    var grid = Ext.getCmp('overview-gridpanel');
    Ext.ux.grid.Printer.print(grid);

}

function printOverview() {
    var panel = Ext.getCmp('overview-gridpanel');
    print(panel);
}