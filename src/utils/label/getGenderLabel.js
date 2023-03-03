import {
  GENDER_INDEX,
  GENDER_INDEX_CREATE,
  GENDER_INDEX_UPDATE,
  GENDER_INDEX_DETAIL,
  GENDER_LABEL,
  GENDER_LABEL_UPDATE,
  GENDER_LABEL_DETAIL,
} from 'config/data-label';

export function getGenderList(data) {
  return {
    titlePage: data.find((item) => item.code === GENDER_INDEX.text_title) || {},

    btnExport: data.find((item) => item.code === GENDER_INDEX.button_export) || {},
    btnPdf: data.find((item) => item.code === GENDER_INDEX.button_pdf) || {},
    btnCsv: data.find((item) => item.code === GENDER_INDEX.button_csv) || {},
    btnExcel: data.find((item) => item.code === GENDER_INDEX.button_excel) || {},
    btnExportAllData: data.find((item) => item.code === GENDER_INDEX.button_export_all_data) || {},
    btnExportCurrentPage: data.find((item) => item.code === GENDER_INDEX.button_export_current_page) || {},
    btnExportSearchData: data.find((item) => item.code === GENDER_INDEX.button_export_search_data) || {},
    btnImport: data.find((item) => item.code === GENDER_INDEX.button_import) || {},
    btnCreate: data.find((item) => item.code === GENDER_INDEX.button_create) || {},

    tooltipSwitch: data.find((item) => item.code === GENDER_INDEX.tooltip_switch) || {},
    tooltipSearch: data.find((item) => item.code === GENDER_INDEX.tooltip_search) || {},
    tooltipFilter: data.find((item) => item.code === GENDER_INDEX.tooltip_filter) || {},
    tooltipShowHideColumn: data.find((item) => item.code === GENDER_INDEX.tooltip_show_hide_column) || {},
    tooltipUpdate: data.find((item) => item.code === GENDER_INDEX.tooltip_update) || {},
    tooltipDetail: data.find((item) => item.code === GENDER_INDEX.tooltip_detail) || {},
    tooltipCreate: data.find((item) => item.code === GENDER_INDEX.tooltip_create) || {},
    tooltipDelete: data.find((item) => item.code === GENDER_INDEX.tooltip_delete) || {},

    id: data.find((item) => item.code === GENDER_INDEX.column_id) || {},
    name: data.find((item) => item.code === GENDER_INDEX.column_name) || {},
    code: data.find((item) => item.code === GENDER_INDEX.column_code) || {},
    icon: data.find((item) => item.code === GENDER_INDEX.column_icon) || {},
    dateFormat: data.find((item) => item.code === GENDER_INDEX.column_date_format) || {},
    culture: data.find((item) => item.code === GENDER_INDEX.column_culture) || {},
    isActive: data.find((item) => item.code === GENDER_INDEX.column_is_active) || {},
    sort: data.find((item) => item.code === GENDER_INDEX.column_sort) || {},
    action: data.find((item) => item.code === GENDER_INDEX.column_action) || {},
    paginateGoto: data.find((item) => item.code === GENDER_INDEX.paginate_go_to) || {},
    paginateTotalPage: data.find((item) => item.code === GENDER_INDEX.paginate_total_page) || {},
    paginateRowsPerPage: data.find((item) => item.code === GENDER_INDEX.paginate_rows_per_page) || {},
    paginateOf: data.find((item) => item.code === GENDER_INDEX.paginate_of) || {},
    paginateShow: data.find((item) => item.code === GENDER_INDEX.paginate_show) || {},

    isActiveCreate: data.find((item) => item.code === GENDER_INDEX_CREATE.column_is_active) || {},
    idCreate: data.find((item) => item.code === GENDER_INDEX_CREATE.column_id) || {},
    sortCreate: data.find((item) => item.code === GENDER_INDEX_CREATE.column_sort) || {},
    textTitleCreate: data.find((item) => item.code === GENDER_INDEX_CREATE.text_title) || {},
    btnCloseCreate: data.find((item) => item.code === GENDER_INDEX_CREATE.button_close) || {},
    btnBackCreate: data.find((item) => item.code === GENDER_INDEX_CREATE.button_back) || {},
    btnSaveCreate: data.find((item) => item.code === GENDER_INDEX_CREATE.button_save) || {},

    isActiveUpdate: data.find((item) => item.code === GENDER_INDEX_UPDATE.column_is_active) || {},
    idUpdate: data.find((item) => item.code === GENDER_INDEX_UPDATE.column_id) || {},
    sortUpdate: data.find((item) => item.code === GENDER_INDEX_UPDATE.column_sort) || {},
    textTitleUpdate: data.find((item) => item.code === GENDER_INDEX_UPDATE.text_title) || {},
    btnCloseUpdate: data.find((item) => item.code === GENDER_INDEX_UPDATE.button_close) || {},
    btnBackUpdate: data.find((item) => item.code === GENDER_INDEX_UPDATE.button_back) || {},
    btnSaveUpdate: data.find((item) => item.code === GENDER_INDEX_UPDATE.button_save) || {},

    isActiveDetail: data.find((item) => item.code === GENDER_INDEX_DETAIL.column_is_active) || {},
    idDetail: data.find((item) => item.code === GENDER_INDEX_DETAIL.column_id) || {},
    sortDetail: data.find((item) => item.code === GENDER_INDEX_DETAIL.column_sort) || {},
    textTitleDetail: data.find((item) => item.code === GENDER_INDEX_DETAIL.text_title) || {},
    btnCloseDetail: data.find((item) => item.code === GENDER_INDEX_DETAIL.button_close) || {},
    btnBackDetail: data.find((item) => item.code === GENDER_INDEX_DETAIL.button_back) || {},
  };
}

export function getGenderLabel(data) {
  return {
    titlePage: data.find((item) => item.code === GENDER_LABEL.text_title) || {},

    btnExport: data.find((item) => item.code === GENDER_LABEL.button_export) || {},
    btnPdf: data.find((item) => item.code === GENDER_LABEL.button_pdf) || {},
    btnCsv: data.find((item) => item.code === GENDER_LABEL.button_csv) || {},
    btnExcel: data.find((item) => item.code === GENDER_LABEL.button_excel) || {},
    btnExportAllData: data.find((item) => item.code === GENDER_LABEL.button_export_all_data) || {},
    btnExportCurrentPage: data.find((item) => item.code === GENDER_LABEL.button_export_current_page) || {},
    btnExportSearchData: data.find((item) => item.code === GENDER_LABEL.button_export_search_data) || {},
    btnImport: data.find((item) => item.code === GENDER_LABEL.button_import) || {},

    tooltipSwitch: data.find((item) => item.code === GENDER_LABEL.tooltip_switch) || {},
    tooltipSearch: data.find((item) => item.code === GENDER_LABEL.tooltip_search) || {},
    tooltipFilter: data.find((item) => item.code === GENDER_LABEL.tooltip_filter) || {},
    tooltipShowHideColumn: data.find((item) => item.code === GENDER_LABEL.tooltip_show_hide_column) || {},
    tooltipUpdate: data.find((item) => item.code === GENDER_LABEL.tooltip_update) || {},
    tooltipDetail: data.find((item) => item.code === GENDER_LABEL.tooltip_detail) || {},

    id: data.find((item) => item.code === GENDER_LABEL.column_id) || {},
    name: data.find((item) => item.code === GENDER_LABEL.column_name) || {},
    code: data.find((item) => item.code === GENDER_LABEL.column_code) || {},
    sort: data.find((item) => item.code === GENDER_LABEL.column_sort) || {},
    action: data.find((item) => item.code === GENDER_LABEL.column_action) || {},
    paginateGoto: data.find((item) => item.code === GENDER_LABEL.paginate_go_to) || {},
    paginateTotalPage: data.find((item) => item.code === GENDER_LABEL.paginate_total_page) || {},
    paginateRowsPerPage: data.find((item) => item.code === GENDER_LABEL.paginate_rows_per_page) || {},
    paginateOf: data.find((item) => item.code === GENDER_LABEL.paginate_of) || {},
    paginateShow: data.find((item) => item.code === GENDER_LABEL.paginate_show) || {},

    idUpdate: data.find((item) => item.code === GENDER_LABEL_UPDATE.column_id) || {},
    nameUpdate: data.find((item) => item.code === GENDER_LABEL_UPDATE.column_name) || {},
    codeUpdate: data.find((item) => item.code === GENDER_LABEL_UPDATE.column_code) || {},
    sortUpdate: data.find((item) => item.code === GENDER_LABEL_UPDATE.column_sort) || {},
    actionUpdate: data.find((item) => item.code === GENDER_LABEL_UPDATE.column_action) || {},
    textTitleUpdate: data.find((item) => item.code === GENDER_LABEL_UPDATE.text_title) || {},
    btnCloseUpdate: data.find((item) => item.code === GENDER_LABEL_UPDATE.button_close) || {},
    btnBackUpdate: data.find((item) => item.code === GENDER_LABEL_UPDATE.button_back) || {},
    btnSaveUpdate: data.find((item) => item.code === GENDER_LABEL_UPDATE.button_save) || {},

    idDetail: data.find((item) => item.code === GENDER_LABEL_DETAIL.column_id) || {},
    nameDetail: data.find((item) => item.code === GENDER_LABEL_DETAIL.column_name) || {},
    codeDetail: data.find((item) => item.code === GENDER_LABEL_DETAIL.column_code) || {},
    sortDetail: data.find((item) => item.code === GENDER_LABEL_DETAIL.column_sort) || {},
    actionDetail: data.find((item) => item.code === GENDER_LABEL_DETAIL.column_action) || {},
    textTitleDetail: data.find((item) => item.code === GENDER_LABEL_DETAIL.text_title) || {},
    btnCloseDetail: data.find((item) => item.code === GENDER_LABEL_DETAIL.button_close) || {},
    btnBackDetail: data.find((item) => item.code === GENDER_LABEL_DETAIL.button_back) || {},
  };
}
