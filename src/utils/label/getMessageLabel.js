import {
  MESSAGE_INDEX,
  MESSAGE_INDEX_UPDATE,
  MESSAGE_INDEX_DETAIL,
  MESSAGE_LABEL_UPDATE,
  MESSAGE_LABEL,
  MESSAGE_LABEL_DETAIL,
} from 'config/data-label';

export function getMessageList(data) {
  return {
    titlePage: data.find((item) => item.code === MESSAGE_INDEX.text_title) || {},

    btnExport: data.find((item) => item.code === MESSAGE_INDEX.button_export) || {},
    btnPdf: data.find((item) => item.code === MESSAGE_INDEX.button_pdf) || {},
    btnCsv: data.find((item) => item.code === MESSAGE_INDEX.button_csv) || {},
    btnExcel: data.find((item) => item.code === MESSAGE_INDEX.button_excel) || {},
    btnExportAllData: data.find((item) => item.code === MESSAGE_INDEX.button_export_all_data) || {},
    btnExportCurrentPage: data.find((item) => item.code === MESSAGE_INDEX.button_export_current_page) || {},
    btnExportSearchData: data.find((item) => item.code === MESSAGE_INDEX.button_export_search_data) || {},
    btnImport: data.find((item) => item.code === MESSAGE_INDEX.button_import) || {},

    tooltipSwitch: data.find((item) => item.code === MESSAGE_INDEX.tooltip_switch) || {},
    tooltipSearch: data.find((item) => item.code === MESSAGE_INDEX.tooltip_search) || {},
    tooltipFilter: data.find((item) => item.code === MESSAGE_INDEX.tooltip_filter) || {},
    tooltipShowHideColumn: data.find((item) => item.code === MESSAGE_INDEX.tooltip_show_hide_column) || {},
    tooltipUpdate: data.find((item) => item.code === MESSAGE_INDEX.tooltip_update) || {},
    tooltipDetail: data.find((item) => item.code === MESSAGE_INDEX.tooltip_detail) || {},
    tooltipCreate: data.find((item) => item.code === MESSAGE_INDEX.tooltip_create) || {},
    tooltipDelete: data.find((item) => item.code === MESSAGE_INDEX.tooltip_delete) || {},

    id: data.find((item) => item.code === MESSAGE_INDEX.column_id) || {},
    code: data.find((item) => item.code === MESSAGE_INDEX.column_code) || {},
    name: data.find((item) => item.code === MESSAGE_INDEX.column_name) || {},
    sort: data.find((item) => item.code === MESSAGE_INDEX.column_sort) || {},
    action: data.find((item) => item.code === MESSAGE_INDEX.column_action) || {},

    paginateTotalPage: data.find((item) => item.code === MESSAGE_INDEX.paginate_total_page) || {},
    paginateRowsPerPage: data.find((item) => item.code === MESSAGE_INDEX.paginate_rows_per_page) || {},
    paginateOf: data.find((item) => item.code === MESSAGE_INDEX.paginate_of) || {},
    paginateShow: data.find((item) => item.code === MESSAGE_INDEX.paginate_show) || {},
    paginateShow: data.find((item) => item.code === MESSAGE_INDEX.paginate_show) || {},
    paginateGoto: data.find((item) => item.code === MESSAGE_INDEX.paginate_go_to) || {},

    // update
    textTitleUpdate: data.find((item) => item.code === MESSAGE_INDEX_UPDATE.text_title) || {},

    idUpdate: data.find((item) => item.code === MESSAGE_INDEX_UPDATE.column_id) || {},
    codeUpdate: data.find((item) => item.code === MESSAGE_INDEX_UPDATE.column_code) || {},
    nameUpdate: data.find((item) => item.code === MESSAGE_INDEX_UPDATE.column_name) || {},
    sortUpdate: data.find((item) => item.code === MESSAGE_INDEX_UPDATE.column_sort) || {},

    btnCloseUpdate: data.find((item) => item.code === MESSAGE_INDEX_UPDATE.button_close) || {},
    btnSaveUpdate: data.find((item) => item.code === MESSAGE_INDEX_UPDATE.button_save) || {},
    btnBackUpdate: data.find((item) => item.code === MESSAGE_INDEX_UPDATE.button_back) || {},
    btnCreateUpdate: data.find((item) => item.code === MESSAGE_INDEX_UPDATE.button_create) || {},

    // detail
    textTitleDetail: data.find((item) => item.code === MESSAGE_INDEX_DETAIL.text_title) || {},

    idDetail: data.find((item) => item.code === MESSAGE_INDEX_DETAIL.column_id) || {},
    codeDetail: data.find((item) => item.code === MESSAGE_INDEX_DETAIL.column_code) || {},
    nameDetail: data.find((item) => item.code === MESSAGE_INDEX_DETAIL.column_name) || {},
    sortDetail: data.find((item) => item.code === MESSAGE_INDEX_DETAIL.column_sort) || {},

    btnCloseDetail: data.find((item) => item.code === MESSAGE_INDEX_DETAIL.button_close) || {},
    btnBackDetail: data.find((item) => item.code === MESSAGE_INDEX_DETAIL.button_back) || {},
  };
}
// ok

export function getMessageLabel(data) {
  return {
    titlePage: data.find((item) => item.code === MESSAGE_LABEL.text_title) || {},

    btnExport: data.find((item) => item.code === MESSAGE_LABEL.button_export) || {},
    btnPdf: data.find((item) => item.code === MESSAGE_LABEL.button_pdf) || {},
    btnCsv: data.find((item) => item.code === MESSAGE_LABEL.button_csv) || {},
    btnExcel: data.find((item) => item.code === MESSAGE_LABEL.button_excel) || {},
    btnExportAllData: data.find((item) => item.code === MESSAGE_LABEL.button_export_all_data) || {},
    btnExportCurrentPage: data.find((item) => item.code === MESSAGE_LABEL.button_export_current_page) || {},
    btnExportSearchData: data.find((item) => item.code === MESSAGE_LABEL.button_export_search_data) || {},
    btnImport: data.find((item) => item.code === MESSAGE_LABEL.button_import) || {},

    tooltipSwitch: data.find((item) => item.code === MESSAGE_LABEL.tooltip_switch) || {},
    tooltipSearch: data.find((item) => item.code === MESSAGE_LABEL.tooltip_search) || {},
    tooltipFilter: data.find((item) => item.code === MESSAGE_LABEL.tooltip_filter) || {},
    tooltipShowHideColumn: data.find((item) => item.code === MESSAGE_LABEL.tooltip_show_hide_column) || {},
    tooltipUpdate: data.find((item) => item.code === MESSAGE_LABEL.tooltip_update) || {},
    tooltipDetail: data.find((item) => item.code === MESSAGE_LABEL.tooltip_detail) || {},

    id: data.find((item) => item.code === MESSAGE_LABEL.column_id) || {},
    name: data.find((item) => item.code === MESSAGE_LABEL.column_name) || {},
    code: data.find((item) => item.code === MESSAGE_LABEL.column_code) || {},
    sort: data.find((item) => item.code === MESSAGE_LABEL.column_sort) || {},
    action: data.find((item) => item.code === MESSAGE_LABEL.column_action) || {},
    paginateGoto: data.find((item) => item.code === MESSAGE_LABEL.paginate_go_to) || {},
    paginateTotalPage: data.find((item) => item.code === MESSAGE_LABEL.paginate_total_page) || {},
    paginateRowsPerPage: data.find((item) => item.code === MESSAGE_LABEL.paginate_rows_per_page) || {},
    paginateOf: data.find((item) => item.code === MESSAGE_LABEL.paginate_of) || {},
    paginateShow: data.find((item) => item.code === MESSAGE_LABEL.paginate_show) || {},

    idUpdate: data.find((item) => item.code === MESSAGE_LABEL_UPDATE.column_id) || {},
    nameUpdate: data.find((item) => item.code === MESSAGE_LABEL_UPDATE.column_name) || {},
    codeUpdate: data.find((item) => item.code === MESSAGE_LABEL_UPDATE.column_code) || {},
    sortUpdate: data.find((item) => item.code === MESSAGE_LABEL_UPDATE.column_sort) || {},
    actionUpdate: data.find((item) => item.code === MESSAGE_LABEL_UPDATE.column_action) || {},
    textTitleUpdate: data.find((item) => item.code === MESSAGE_LABEL_UPDATE.text_title) || {},
    btnCloseUpdate: data.find((item) => item.code === MESSAGE_LABEL_UPDATE.button_close) || {},
    btnSaveUpdate: data.find((item) => item.code === MESSAGE_LABEL_UPDATE.button_save) || {},

    idDetail: data.find((item) => item.code === MESSAGE_LABEL_DETAIL.column_id) || {},
    nameDetail: data.find((item) => item.code === MESSAGE_LABEL_DETAIL.column_name) || {},
    codeDetail: data.find((item) => item.code === MESSAGE_LABEL_DETAIL.column_code) || {},
    sortDetail: data.find((item) => item.code === MESSAGE_LABEL_DETAIL.column_sort) || {},
    actionDetail: data.find((item) => item.code === MESSAGE_LABEL_DETAIL.column_action) || {},
    textTitleDetail: data.find((item) => item.code === MESSAGE_LABEL_DETAIL.text_title) || {},
    btnCloseDetail: data.find((item) => item.code === MESSAGE_LABEL_DETAIL.button_close) || {},
  };
}
