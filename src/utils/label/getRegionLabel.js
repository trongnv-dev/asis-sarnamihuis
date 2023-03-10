import {
  REGION_INDEX,
  REGION_INDEX_CREATE,
  REGION_INDEX_UPDATE,
  REGION_INDEX_DETAIL,
  REGION_LABEL,
  REGION_LABEL_UPDATE,
  REGION_LABEL_DETAIL,
} from 'config/data-label';

export function getRegionList(data) {
  return {
    titlePage: data.find((item) => item.code === REGION_INDEX.text_title) || {},

    btnExport: data.find((item) => item.code === REGION_INDEX.button_export) || {},
    btnPdf: data.find((item) => item.code === REGION_INDEX.button_pdf) || {},
    btnCsv: data.find((item) => item.code === REGION_INDEX.button_csv) || {},
    btnExcel: data.find((item) => item.code === REGION_INDEX.button_excel) || {},
    btnExportAllData: data.find((item) => item.code === REGION_INDEX.button_export_all_data) || {},
    btnExportCurrentPage: data.find((item) => item.code === REGION_INDEX.button_export_current_page) || {},
    btnExportSearchData: data.find((item) => item.code === REGION_INDEX.button_export_search_data) || {},
    btnImport: data.find((item) => item.code === REGION_INDEX.button_import) || {},
    btnCreate: data.find((item) => item.code === REGION_INDEX.button_create) || {},

    tooltipSwitch: data.find((item) => item.code === REGION_INDEX.tooltip_switch) || {},
    tooltipSearch: data.find((item) => item.code === REGION_INDEX.tooltip_search) || {},
    tooltipFilter: data.find((item) => item.code === REGION_INDEX.tooltip_filter) || {},
    tooltipShowHideColumn: data.find((item) => item.code === REGION_INDEX.tooltip_show_hide_column) || {},
    tooltipUpdate: data.find((item) => item.code === REGION_INDEX.tooltip_update) || {},
    tooltipCreate: data.find((item) => item.code === REGION_INDEX.tooltip_create) || {},
    tooltipChildren: data.find((item) => item.code === REGION_INDEX.tooltip_children) || {},
    tooltipDetail: data.find((item) => item.code === REGION_INDEX.tooltip_detail) || {},
    tooltipDelete: data.find((item) => item.code === REGION_INDEX.tooltip_delete) || {},

    id: data.find((item) => item.code === REGION_INDEX.column_id) || {},
    parent_id: data.find((item) => item.code === REGION_INDEX.column_parent_id) || {},
    region: data.find((item) => item.code === REGION_INDEX.column_region) || {},
    code: data.find((item) => item.code === REGION_INDEX.column_code) || {},
    icon: data.find((item) => item.code === REGION_INDEX.column_icon) || {},
    dateFormat: data.find((item) => item.code === REGION_INDEX.column_date_format) || {},
    culture: data.find((item) => item.code === REGION_INDEX.column_culture) || {},
    isActive: data.find((item) => item.code === REGION_INDEX.column_is_active) || {},
    sort: data.find((item) => item.code === REGION_INDEX.column_sort) || {},
    action: data.find((item) => item.code === REGION_INDEX.column_action) || {},
    paginateGoto: data.find((item) => item.code === REGION_INDEX.paginate_go_to) || {},
    paginateTotalPage: data.find((item) => item.code === REGION_INDEX.paginate_total_page) || {},
    paginateRowsPerPage: data.find((item) => item.code === REGION_INDEX.paginate_rows_per_page) || {},
    paginateOf: data.find((item) => item.code === REGION_INDEX.paginate_of) || {},
    paginateShow: data.find((item) => item.code === REGION_INDEX.paginate_show) || {},

    titlePageCreate: data.find((item) => item.code === REGION_INDEX_CREATE.text_title) || {},
    idCreate: data.find((item) => item.code === REGION_INDEX_CREATE.column_id) || {},
    parent_idCreate: data.find((item) => item.code === REGION_INDEX_CREATE.column_parent_id) || {},
    regionCreate: data.find((item) => item.code === REGION_INDEX_CREATE.column_region) || {},
    codeCreate: data.find((item) => item.code === REGION_INDEX_CREATE.column_code) || {},
    iconCreate: data.find((item) => item.code === REGION_INDEX_CREATE.column_icon) || {},
    dateFormatCreate: data.find((item) => item.code === REGION_INDEX_CREATE.column_date_format) || {},
    cultureCreate: data.find((item) => item.code === REGION_INDEX_CREATE.column_culture) || {},
    isActiveCreate: data.find((item) => item.code === REGION_INDEX_CREATE.column_is_active) || {},
    sortCreate: data.find((item) => item.code === REGION_INDEX_CREATE.column_sort) || {},
    actionCreate: data.find((item) => item.code === REGION_INDEX_CREATE.column_action) || {},
    btnCloseCreate: data.find((item) => item.code === REGION_INDEX_CREATE.button_close) || {},
    btnSaveCreate: data.find((item) => item.code === REGION_INDEX_CREATE.button_save) || {},

    titlePageUpdate: data.find((item) => item.code === REGION_INDEX_UPDATE.text_title) || {},
    idUpdate: data.find((item) => item.code === REGION_INDEX_UPDATE.column_id) || {},
    parent_idUpdate: data.find((item) => item.code === REGION_INDEX_UPDATE.column_parent_id) || {},
    regionUpdate: data.find((item) => item.code === REGION_INDEX_UPDATE.column_region) || {},
    codeUpdate: data.find((item) => item.code === REGION_INDEX_UPDATE.column_code) || {},
    iconUpdate: data.find((item) => item.code === REGION_INDEX_UPDATE.column_icon) || {},
    dateFormatUpdate: data.find((item) => item.code === REGION_INDEX_UPDATE.column_date_format) || {},
    cultureUpdate: data.find((item) => item.code === REGION_INDEX_UPDATE.column_culture) || {},
    isActiveUpdate: data.find((item) => item.code === REGION_INDEX_UPDATE.column_is_active) || {},
    sortUpdate: data.find((item) => item.code === REGION_INDEX_UPDATE.column_sort) || {},
    actionUpdate: data.find((item) => item.code === REGION_INDEX_UPDATE.column_action) || {},
    btnCloseUpdate: data.find((item) => item.code === REGION_INDEX_UPDATE.button_close) || {},
    btnSaveUpdate: data.find((item) => item.code === REGION_INDEX_UPDATE.button_save) || {},

    titlePageDetail: data.find((item) => item.code === REGION_INDEX_DETAIL.text_title) || {},
    idDetail: data.find((item) => item.code === REGION_INDEX_DETAIL.column_id) || {},
    parent_idDetail: data.find((item) => item.code === REGION_INDEX_DETAIL.column_parent_id) || {},
    regionDetail: data.find((item) => item.code === REGION_INDEX_DETAIL.column_region) || {},
    codeDetail: data.find((item) => item.code === REGION_INDEX_DETAIL.column_code) || {},
    iconDetail: data.find((item) => item.code === REGION_INDEX_DETAIL.column_icon) || {},
    dateFormatDetail: data.find((item) => item.code === REGION_INDEX_DETAIL.column_date_format) || {},
    cultureDetail: data.find((item) => item.code === REGION_INDEX_DETAIL.column_culture) || {},
    isActiveDetail: data.find((item) => item.code === REGION_INDEX_DETAIL.column_is_active) || {},
    sortDetail: data.find((item) => item.code === REGION_INDEX_DETAIL.column_sort) || {},
    actionDetail: data.find((item) => item.code === REGION_INDEX_DETAIL.column_action) || {},
    btnCloseDetail: data.find((item) => item.code === REGION_INDEX_DETAIL.button_close) || {},
  };
}

export function getRegionLabel(data) {
  return {
    titlePage: data.find((item) => item.code === REGION_LABEL.text_title) || {},

    btnExport: data.find((item) => item.code === REGION_LABEL.button_export) || {},
    btnPdf: data.find((item) => item.code === REGION_LABEL.button_pdf) || {},
    btnCsv: data.find((item) => item.code === REGION_LABEL.button_csv) || {},
    btnExcel: data.find((item) => item.code === REGION_LABEL.button_excel) || {},
    btnExportAllData: data.find((item) => item.code === REGION_LABEL.button_export_all_data) || {},
    btnExportCurrentPage: data.find((item) => item.code === REGION_LABEL.button_export_current_page) || {},
    btnExportSearchData: data.find((item) => item.code === REGION_LABEL.button_export_search_data) || {},
    btnImport: data.find((item) => item.code === REGION_LABEL.button_import) || {},

    tooltipSwitch: data.find((item) => item.code === REGION_LABEL.tooltip_switch) || {},
    tooltipSearch: data.find((item) => item.code === REGION_LABEL.tooltip_search) || {},
    tooltipFilter: data.find((item) => item.code === REGION_LABEL.tooltip_filter) || {},
    tooltipShowHideColumn: data.find((item) => item.code === REGION_LABEL.tooltip_show_hide_column) || {},
    tooltipUpdate: data.find((item) => item.code === REGION_LABEL.tooltip_update) || {},
    tooltipDetail: data.find((item) => item.code === REGION_LABEL.tooltip_detail) || {},

    id: data.find((item) => item.code === REGION_LABEL.column_id) || {},
    name: data.find((item) => item.code === REGION_LABEL.column_name) || {},
    code: data.find((item) => item.code === REGION_LABEL.column_code) || {},
    sort: data.find((item) => item.code === REGION_LABEL.column_sort) || {},
    action: data.find((item) => item.code === REGION_LABEL.column_action) || {},
    paginateGoto: data.find((item) => item.code === REGION_LABEL.paginate_go_to) || {},
    paginateTotalPage: data.find((item) => item.code === REGION_LABEL.paginate_total_page) || {},
    paginateRowsPerPage: data.find((item) => item.code === REGION_LABEL.paginate_rows_per_page) || {},
    paginateOf: data.find((item) => item.code === REGION_LABEL.paginate_of) || {},
    paginateShow: data.find((item) => item.code === REGION_LABEL.paginate_show) || {},

    idUpdate: data.find((item) => item.code === REGION_LABEL_UPDATE.column_id) || {},
    nameUpdate: data.find((item) => item.code === REGION_LABEL_UPDATE.column_name) || {},
    codeUpdate: data.find((item) => item.code === REGION_LABEL_UPDATE.column_code) || {},
    sortUpdate: data.find((item) => item.code === REGION_LABEL_UPDATE.column_sort) || {},
    actionUpdate: data.find((item) => item.code === REGION_LABEL_UPDATE.column_action) || {},
    textTitleUpdate: data.find((item) => item.code === REGION_LABEL_UPDATE.text_title) || {},
    btnCloseUpdate: data.find((item) => item.code === REGION_LABEL_UPDATE.button_close) || {},
    btnSaveUpdate: data.find((item) => item.code === REGION_LABEL_UPDATE.button_save) || {},

    idDetail: data.find((item) => item.code === REGION_LABEL_DETAIL.column_id) || {},
    nameDetail: data.find((item) => item.code === REGION_LABEL_DETAIL.column_name) || {},
    codeDetail: data.find((item) => item.code === REGION_LABEL_DETAIL.column_code) || {},
    sortDetail: data.find((item) => item.code === REGION_LABEL_DETAIL.column_sort) || {},
    actionDetail: data.find((item) => item.code === REGION_LABEL_DETAIL.column_action) || {},
    textTitleDetail: data.find((item) => item.code === REGION_LABEL_DETAIL.text_title) || {},
    btnCloseDetail: data.find((item) => item.code === REGION_LABEL_DETAIL.button_close) || {},
  };
}
