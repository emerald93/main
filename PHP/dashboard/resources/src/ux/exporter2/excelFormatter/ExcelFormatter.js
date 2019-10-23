/**
 * @class Ext.ux.exporter2.ExcelFormatter
 * @extends Ext.ux.exporter2.Formatter
 * Specialised Format class for outputting .xls files
 */
Ext.define("Ext.ux.exporter2.excelFormatter.ExcelFormatter", {
    extend: "Ext.ux.exporter2.Formatter",
    uses: [
        "Ext.ux.exporter2.excelFormatter.Cell",
        "Ext.ux.exporter2.excelFormatter.Style",
        "Ext.ux.exporter2.excelFormatter.Worksheet",
        "Ext.ux.exporter2.excelFormatter.Workbook"
    ],
    contentType: 'data:application/vnd.ms-excel;base64,',
    extension: "xls",

    format: function(store, config) {
      var workbook = new Ext.ux.exporter2.excelFormatter.Workbook(config);
      workbook.addWorksheet(store, config || {});

      return workbook.render();
    }
});