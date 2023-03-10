import {
  COUNTRY_INDEX,
  COUNTRY_INDEX_CREATE,
  COUNTRY_INDEX_UPDATE,
  COUNTRY_INDEX_DETAIL,
  COUNTRY_LABEL,
  COUNTRY_LABEL_UPDATE,
  COUNTRY_LABEL_DETAIL,
} from 'config/data-label';

export function getCountryList(data) {
  return {
    titlePage: data.find((item) => item.code === COUNTRY_INDEX.text_title) || {},

    btnExport: data.find((item) => item.code === COUNTRY_INDEX.button_export) || {},
    btnPdf: data.find((item) => item.code === COUNTRY_INDEX.button_pdf) || {},
    btnCsv: data.find((item) => item.code === COUNTRY_INDEX.button_csv) || {},
    btnExcel: data.find((item) => item.code === COUNTRY_INDEX.button_excel) || {},
    btnExportAllData: data.find((item) => item.code === COUNTRY_INDEX.button_export_all_data) || {},
    btnExportCurrentPage: data.find((item) => item.code === COUNTRY_INDEX.button_export_current_page) || {},
    btnExportSearchData: data.find((item) => item.code === COUNTRY_INDEX.button_export_search_data) || {},
    btnImport: data.find((item) => item.code === COUNTRY_INDEX.button_import) || {},
    btnCreate: data.find((item) => item.code === COUNTRY_INDEX.button_create) || {},

    tooltipSwitch: data.find((item) => item.code === COUNTRY_INDEX.tooltip_switch) || {},
    tooltipSearch: data.find((item) => item.code === COUNTRY_INDEX.tooltip_search) || {},
    tooltipFilter: data.find((item) => item.code === COUNTRY_INDEX.tooltip_filter) || {},
    tooltipShowHideColumn: data.find((item) => item.code === COUNTRY_INDEX.tooltip_show_hide_column) || {},
    tooltipUpdate: data.find((item) => item.code === COUNTRY_INDEX.tooltip_update) || {},
    tooltipCreate: data.find((item) => item.code === COUNTRY_INDEX.tooltip_create) || {},
    tooltipChildren: data.find((item) => item.code === COUNTRY_INDEX.tooltip_children) || {},
    tooltipDetail: data.find((item) => item.code === COUNTRY_INDEX.tooltip_detail) || {},
    tooltipDelete: data.find((item) => item.code === COUNTRY_INDEX.tooltip_delete) || {},

    id: data.find((item) => item.code === COUNTRY_INDEX.column_id) || {},
    country: data.find((item) => item.code === COUNTRY_INDEX.column_country) || {},
    code: data.find((item) => item.code === COUNTRY_INDEX.column_code) || {},
    icon: data.find((item) => item.code === COUNTRY_INDEX.column_icon) || {},
    dateFormat: data.find((item) => item.code === COUNTRY_INDEX.column_date_format) || {},
    culture: data.find((item) => item.code === COUNTRY_INDEX.column_culture) || {},
    isActive: data.find((item) => item.code === COUNTRY_INDEX.column_is_active) || {},
    sort: data.find((item) => item.code === COUNTRY_INDEX.column_sort) || {},
    regions: data.find((item) => item.code === COUNTRY_INDEX.column_regions) || {},
    action: data.find((item) => item.code === COUNTRY_INDEX.column_action) || {},
    paginateGoto: data.find((item) => item.code === COUNTRY_INDEX.paginate_go_to) || {},
    paginateTotalPage: data.find((item) => item.code === COUNTRY_INDEX.paginate_total_page) || {},
    paginateRowsPerPage: data.find((item) => item.code === COUNTRY_INDEX.paginate_rows_per_page) || {},
    paginateOf: data.find((item) => item.code === COUNTRY_INDEX.paginate_of) || {},
    paginateShow: data.find((item) => item.code === COUNTRY_INDEX.paginate_show) || {},

    titlePageCreate: data.find((item) => item.code === COUNTRY_INDEX_CREATE.text_title) || {},
    idCreate: data.find((item) => item.code === COUNTRY_INDEX_CREATE.column_id) || {},
    countryCreate: data.find((item) => item.code === COUNTRY_INDEX_CREATE.column_country) || {},
    codeCreate: data.find((item) => item.code === COUNTRY_INDEX_CREATE.column_code) || {},
    iconCreate: data.find((item) => item.code === COUNTRY_INDEX_CREATE.column_icon) || {},
    dateFormatCreate: data.find((item) => item.code === COUNTRY_INDEX_CREATE.column_date_format) || {},
    cultureCreate: data.find((item) => item.code === COUNTRY_INDEX_CREATE.column_culture) || {},
    isActiveCreate: data.find((item) => item.code === COUNTRY_INDEX_CREATE.column_is_active) || {},
    sortCreate: data.find((item) => item.code === COUNTRY_INDEX_CREATE.column_sort) || {},
    regionsCreate: data.find((item) => item.code === COUNTRY_INDEX_CREATE.column_regions) || {},
    actionCreate: data.find((item) => item.code === COUNTRY_INDEX_CREATE.column_action) || {},
    btnCloseCreate: data.find((item) => item.code === COUNTRY_INDEX_CREATE.button_close) || {},
    btnBackCreate: data.find((item) => item.code === COUNTRY_INDEX_CREATE.button_back) || {},
    btnSaveCreate: data.find((item) => item.code === COUNTRY_INDEX_CREATE.button_save) || {},

    titlePageUpdate: data.find((item) => item.code === COUNTRY_INDEX_UPDATE.text_title) || {},
    idUpdate: data.find((item) => item.code === COUNTRY_INDEX_UPDATE.column_id) || {},
    countryUpdate: data.find((item) => item.code === COUNTRY_INDEX_UPDATE.column_country) || {},
    codeUpdate: data.find((item) => item.code === COUNTRY_INDEX_UPDATE.column_code) || {},
    iconUpdate: data.find((item) => item.code === COUNTRY_INDEX_UPDATE.column_icon) || {},
    dateFormatUpdate: data.find((item) => item.code === COUNTRY_INDEX_UPDATE.column_date_format) || {},
    cultureUpdate: data.find((item) => item.code === COUNTRY_INDEX_UPDATE.column_culture) || {},
    isActiveUpdate: data.find((item) => item.code === COUNTRY_INDEX_UPDATE.column_is_active) || {},
    sortUpdate: data.find((item) => item.code === COUNTRY_INDEX_UPDATE.column_sort) || {},
    regionsUpdate: data.find((item) => item.code === COUNTRY_INDEX_UPDATE.column_regions) || {},
    actionUpdate: data.find((item) => item.code === COUNTRY_INDEX_UPDATE.column_action) || {},
    btnCloseUpdate: data.find((item) => item.code === COUNTRY_INDEX_UPDATE.button_close) || {},
    btnBackUpdate: data.find((item) => item.code === COUNTRY_INDEX_UPDATE.button_back) || {},
    btnSaveUpdate: data.find((item) => item.code === COUNTRY_INDEX_UPDATE.button_save) || {},

    titlePageDetail: data.find((item) => item.code === COUNTRY_INDEX_DETAIL.text_title) || {},
    idDetail: data.find((item) => item.code === COUNTRY_INDEX_DETAIL.column_id) || {},
    countryDetail: data.find((item) => item.code === COUNTRY_INDEX_DETAIL.column_country) || {},
    codeDetail: data.find((item) => item.code === COUNTRY_INDEX_DETAIL.column_code) || {},
    iconDetail: data.find((item) => item.code === COUNTRY_INDEX_DETAIL.column_icon) || {},
    dateFormatDetail: data.find((item) => item.code === COUNTRY_INDEX_DETAIL.column_date_format) || {},
    cultureDetail: data.find((item) => item.code === COUNTRY_INDEX_DETAIL.column_culture) || {},
    isActiveDetail: data.find((item) => item.code === COUNTRY_INDEX_DETAIL.column_is_active) || {},
    sortDetail: data.find((item) => item.code === COUNTRY_INDEX_DETAIL.column_sort) || {},
    regionsDetail: data.find((item) => item.code === COUNTRY_INDEX_DETAIL.column_regions) || {},
    actionDetail: data.find((item) => item.code === COUNTRY_INDEX_DETAIL.column_action) || {},
    btnCloseDetail: data.find((item) => item.code === COUNTRY_INDEX_DETAIL.button_close) || {},
    btnBackDetail: data.find((item) => item.code === COUNTRY_INDEX_DETAIL.button_back) || {},
  };
}

export function getCountryLabel(data) {
  return {
    titlePage: data.find((item) => item.code === COUNTRY_LABEL.text_title) || {},

    btnExport: data.find((item) => item.code === COUNTRY_LABEL.button_export) || {},
    btnPdf: data.find((item) => item.code === COUNTRY_LABEL.button_pdf) || {},
    btnCsv: data.find((item) => item.code === COUNTRY_LABEL.button_csv) || {},
    btnExcel: data.find((item) => item.code === COUNTRY_LABEL.button_excel) || {},
    btnExportAllData: data.find((item) => item.code === COUNTRY_LABEL.button_export_all_data) || {},
    btnExportCurrentPage: data.find((item) => item.code === COUNTRY_LABEL.button_export_current_page) || {},
    btnExportSearchData: data.find((item) => item.code === COUNTRY_LABEL.button_export_search_data) || {},
    btnImport: data.find((item) => item.code === COUNTRY_LABEL.button_import) || {},

    tooltipSwitch: data.find((item) => item.code === COUNTRY_LABEL.tooltip_switch) || {},
    tooltipSearch: data.find((item) => item.code === COUNTRY_LABEL.tooltip_search) || {},
    tooltipFilter: data.find((item) => item.code === COUNTRY_LABEL.tooltip_filter) || {},
    tooltipShowHideColumn: data.find((item) => item.code === COUNTRY_LABEL.tooltip_show_hide_column) || {},
    tooltipUpdate: data.find((item) => item.code === COUNTRY_LABEL.tooltip_update) || {},
    tooltipDetail: data.find((item) => item.code === COUNTRY_LABEL.tooltip_detail) || {},

    id: data.find((item) => item.code === COUNTRY_LABEL.column_id) || {},
    name: data.find((item) => item.code === COUNTRY_LABEL.column_name) || {},
    code: data.find((item) => item.code === COUNTRY_LABEL.column_code) || {},
    sort: data.find((item) => item.code === COUNTRY_LABEL.column_sort) || {},
    action: data.find((item) => item.code === COUNTRY_LABEL.column_action) || {},
    paginateGoto: data.find((item) => item.code === COUNTRY_LABEL.paginate_go_to) || {},
    paginateTotalPage: data.find((item) => item.code === COUNTRY_LABEL.paginate_total_page) || {},
    paginateRowsPerPage: data.find((item) => item.code === COUNTRY_LABEL.paginate_rows_per_page) || {},
    paginateOf: data.find((item) => item.code === COUNTRY_LABEL.paginate_of) || {},
    paginateShow: data.find((item) => item.code === COUNTRY_LABEL.paginate_show) || {},

    idUpdate: data.find((item) => item.code === COUNTRY_LABEL_UPDATE.column_id) || {},
    nameUpdate: data.find((item) => item.code === COUNTRY_LABEL_UPDATE.column_name) || {},
    codeUpdate: data.find((item) => item.code === COUNTRY_LABEL_UPDATE.column_code) || {},
    sortUpdate: data.find((item) => item.code === COUNTRY_LABEL_UPDATE.column_sort) || {},
    actionUpdate: data.find((item) => item.code === COUNTRY_LABEL_UPDATE.column_action) || {},
    textTitleUpdate: data.find((item) => item.code === COUNTRY_LABEL_UPDATE.text_title) || {},
    btnCloseUpdate: data.find((item) => item.code === COUNTRY_LABEL_UPDATE.button_close) || {},
    btnBackUpdate: data.find((item) => item.code === COUNTRY_LABEL_UPDATE.button_back) || {},
    btnSaveUpdate: data.find((item) => item.code === COUNTRY_LABEL_UPDATE.button_save) || {},

    idDetail: data.find((item) => item.code === COUNTRY_LABEL_DETAIL.column_id) || {},
    nameDetail: data.find((item) => item.code === COUNTRY_LABEL_DETAIL.column_name) || {},
    codeDetail: data.find((item) => item.code === COUNTRY_LABEL_DETAIL.column_code) || {},
    sortDetail: data.find((item) => item.code === COUNTRY_LABEL_DETAIL.column_sort) || {},
    actionDetail: data.find((item) => item.code === COUNTRY_LABEL_DETAIL.column_action) || {},
    textTitleDetail: data.find((item) => item.code === COUNTRY_LABEL_DETAIL.text_title) || {},
    btnCloseDetail: data.find((item) => item.code === COUNTRY_LABEL_DETAIL.button_close) || {},
    btnBackDetail: data.find((item) => item.code === COUNTRY_LABEL_DETAIL.button_back) || {},
  };
}
