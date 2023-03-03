import {
  PERSON_UPLOAD_INDEX,
  PERSON_UPLOAD_INDEX_CREATE,
  PERSON_UPLOAD_INDEX_UPDATE,
  PERSON_UPLOAD_INDEX_DETAIL,
  PERSON_UPLOAD_LABEL,
  PERSON_UPLOAD_LABEL_UPDATE,
  PERSON_UPLOAD_LABEL_DETAIL,
} from 'config/data-label';

export function getPersonUploadList(data) {
  return {
    titlePage: data.find((item) => item.code === PERSON_UPLOAD_INDEX.text_title) || {},

    btnExport: data.find((item) => item.code === PERSON_UPLOAD_INDEX.button_export) || {},
    btnPdf: data.find((item) => item.code === PERSON_UPLOAD_INDEX.button_pdf) || {},
    btnCsv: data.find((item) => item.code === PERSON_UPLOAD_INDEX.button_csv) || {},
    btnExcel: data.find((item) => item.code === PERSON_UPLOAD_INDEX.button_excel) || {},
    btnExportAllData: data.find((item) => item.code === PERSON_UPLOAD_INDEX.button_export_all_data) || {},
    btnExportCurrentPage: data.find((item) => item.code === PERSON_UPLOAD_INDEX.button_export_current_page) || {},
    btnExportSearchData: data.find((item) => item.code === PERSON_UPLOAD_INDEX.button_export_search_data) || {},
    btnImport: data.find((item) => item.code === PERSON_UPLOAD_INDEX.button_import) || {},
    btnCreate: data.find((item) => item.code === PERSON_UPLOAD_INDEX.button_create) || {},

    tooltipSwitch: data.find((item) => item.code === PERSON_UPLOAD_INDEX.tooltip_switch) || {},
    tooltipSearch: data.find((item) => item.code === PERSON_UPLOAD_INDEX.tooltip_search) || {},
    tooltipFilter: data.find((item) => item.code === PERSON_UPLOAD_INDEX.tooltip_filter) || {},
    tooltipShowHideColumn: data.find((item) => item.code === PERSON_UPLOAD_INDEX.tooltip_show_hide_column) || {},
    tooltipUpdate: data.find((item) => item.code === PERSON_UPLOAD_INDEX.tooltip_update) || {},
    tooltipDetail: data.find((item) => item.code === PERSON_UPLOAD_INDEX.tooltip_detail) || {},
    tooltipCreate: data.find((item) => item.code === PERSON_UPLOAD_INDEX.tooltip_create) || {},
    tooltipDelete: data.find((item) => item.code === PERSON_UPLOAD_INDEX.tooltip_delete) || {},

    id: data.find((item) => item.code === PERSON_UPLOAD_INDEX.column_id) || {},
    name: data.find((item) => item.code === PERSON_UPLOAD_INDEX.column_name) || {},
    code: data.find((item) => item.code === PERSON_UPLOAD_INDEX.column_code) || {},
    icon: data.find((item) => item.code === PERSON_UPLOAD_INDEX.column_icon) || {},
    dateFormat: data.find((item) => item.code === PERSON_UPLOAD_INDEX.column_date_format) || {},
    culture: data.find((item) => item.code === PERSON_UPLOAD_INDEX.column_culture) || {},
    isActive: data.find((item) => item.code === PERSON_UPLOAD_INDEX.column_is_active) || {},
    sort: data.find((item) => item.code === PERSON_UPLOAD_INDEX.column_sort) || {},
    action: data.find((item) => item.code === PERSON_UPLOAD_INDEX.column_action) || {},
    nameRelPerson: data.find((item) => item.code === PERSON_UPLOAD_INDEX.column_name_rel_person) || {},
    idRelPerson: data.find((item) => item.code === PERSON_UPLOAD_INDEX.column_id_rel_person) || {},
    actionRelPerson: data.find((item) => item.code === PERSON_UPLOAD_INDEX.column_action_rel_person) || {},
    uploadFile: data.find((item) => item.code === PERSON_UPLOAD_INDEX.column_upload_file) || {},

    lastName: data.find((item) => item.code === PERSON_UPLOAD_INDEX.column_lastName) || {},
    middleName: data.find((item) => item.code === PERSON_UPLOAD_INDEX.column_middleName) || {},
    firstName: data.find((item) => item.code === PERSON_UPLOAD_INDEX.column_firstName) || {},
    genderName: data.find((item) => item.code === PERSON_UPLOAD_INDEX.column_gender) || {},
    address: data.find((item) => item.code === PERSON_UPLOAD_INDEX.column_address) || {},
    zipcode: data.find((item) => item.code === PERSON_UPLOAD_INDEX.column_zipcode) || {},
    place: data.find((item) => item.code === PERSON_UPLOAD_INDEX.column_place) || {},
    country: data.find((item) => item.code === PERSON_UPLOAD_INDEX.column_country) || {},
    region: data.find((item) => item.code === PERSON_UPLOAD_INDEX.column_region) || {},
    latitude: data.find((item) => item.code === PERSON_UPLOAD_INDEX.column_latitude) || {},
    longtitude: data.find((item) => item.code === PERSON_UPLOAD_INDEX.column_longtitude) || {},
    telephone1: data.find((item) => item.code === PERSON_UPLOAD_INDEX.column_telephone1) || {},
    telephone2: data.find((item) => item.code === PERSON_UPLOAD_INDEX.column_telephone2) || {},
    email1: data.find((item) => item.code === PERSON_UPLOAD_INDEX.column_email1) || {},
    email2: data.find((item) => item.code === PERSON_UPLOAD_INDEX.column_email2) || {},
    memo: data.find((item) => item.code === PERSON_UPLOAD_INDEX.column_memo) || {},
    memoAdministration: data.find((item) => item.code === PERSON_UPLOAD_INDEX.column_memoAdministration) || {},
    wantsNewsletter: data.find((item) => item.code === PERSON_UPLOAD_INDEX.column_wantsNewsletter) || {},
    idRelPersonUpload: data.find((item) => item.code === PERSON_UPLOAD_INDEX.column_person) || {},
    paginateGoto: data.find((item) => item.code === PERSON_UPLOAD_INDEX.paginate_go_to) || {},
    paginateTotalPage: data.find((item) => item.code === PERSON_UPLOAD_INDEX.paginate_total_page) || {},
    paginateRowsPerPage: data.find((item) => item.code === PERSON_UPLOAD_INDEX.paginate_rows_per_page) || {},
    paginateOf: data.find((item) => item.code === PERSON_UPLOAD_INDEX.paginate_of) || {},
    paginateShow: data.find((item) => item.code === PERSON_UPLOAD_INDEX.paginate_show) || {},

    titlePageCreate: data.find((item) => item.code === PERSON_UPLOAD_INDEX_CREATE.text_title) || {},
    btnSaveCreate: data.find((item) => item.code === PERSON_UPLOAD_INDEX_CREATE.button_save) || {},
    btnCloseCreate: data.find((item) => item.code === PERSON_UPLOAD_INDEX_CREATE.button_close) || {},
    idCreate: data.find((item) => item.code === PERSON_UPLOAD_INDEX_CREATE.column_id) || {},
    nameCreate: data.find((item) => item.code === PERSON_UPLOAD_INDEX_CREATE.column_name) || {},
    codeCreate: data.find((item) => item.code === PERSON_UPLOAD_INDEX_CREATE.column_code) || {},
    iconCreate: data.find((item) => item.code === PERSON_UPLOAD_INDEX_CREATE.column_icon) || {},
    dateFormatCreate: data.find((item) => item.code === PERSON_UPLOAD_INDEX_CREATE.column_date_format) || {},
    cultureCreate: data.find((item) => item.code === PERSON_UPLOAD_INDEX_CREATE.column_culture) || {},
    isActiveCreate: data.find((item) => item.code === PERSON_UPLOAD_INDEX_CREATE.column_is_active) || {},
    sortCreate: data.find((item) => item.code === PERSON_UPLOAD_INDEX_CREATE.column_sort) || {},
    actionCreate: data.find((item) => item.code === PERSON_UPLOAD_INDEX_CREATE.column_action) || {},
    lastNameCreate: data.find((item) => item.code === PERSON_UPLOAD_INDEX_CREATE.column_lastName) || {},
    middleNameCreate: data.find((item) => item.code === PERSON_UPLOAD_INDEX_CREATE.column_middleName) || {},
    firstNameCreate: data.find((item) => item.code === PERSON_UPLOAD_INDEX_CREATE.column_firstName) || {},
    genderNameCreate: data.find((item) => item.code === PERSON_UPLOAD_INDEX_CREATE.column_gender) || {},
    addressCreate: data.find((item) => item.code === PERSON_UPLOAD_INDEX_CREATE.column_address) || {},
    zipcodeCreate: data.find((item) => item.code === PERSON_UPLOAD_INDEX_CREATE.column_zipcode) || {},
    placeCreate: data.find((item) => item.code === PERSON_UPLOAD_INDEX_CREATE.column_place) || {},
    countryCreate: data.find((item) => item.code === PERSON_UPLOAD_INDEX_CREATE.column_country) || {},
    regionCreate: data.find((item) => item.code === PERSON_UPLOAD_INDEX_CREATE.column_region) || {},
    latitudeCreate: data.find((item) => item.code === PERSON_UPLOAD_INDEX_CREATE.column_latitude) || {},
    longtitudeCreate: data.find((item) => item.code === PERSON_UPLOAD_INDEX_CREATE.column_longtitude) || {},
    telephone1Create: data.find((item) => item.code === PERSON_UPLOAD_INDEX_CREATE.column_telephone1) || {},
    telephone2Create: data.find((item) => item.code === PERSON_UPLOAD_INDEX_CREATE.column_telephone2) || {},
    email1Create: data.find((item) => item.code === PERSON_UPLOAD_INDEX_CREATE.column_email1) || {},
    email2Create: data.find((item) => item.code === PERSON_UPLOAD_INDEX_CREATE.column_email2) || {},
    memoCreate: data.find((item) => item.code === PERSON_UPLOAD_INDEX_CREATE.column_memo) || {},
    memoAdministrationCreate: data.find((item) => item.code === PERSON_UPLOAD_INDEX_CREATE.column_memoAdministration) || {},
    wantsNewsletterCreate: data.find((item) => item.code === PERSON_UPLOAD_INDEX_CREATE.column_wantsNewsletter) || {},
    idRelPersonUploadCreate: data.find((item) => item.code === PERSON_UPLOAD_INDEX_CREATE.column_person) || {},
    personNameCreate: data.find((item) => item.code === PERSON_UPLOAD_INDEX_CREATE.column_name_person) || {},
    uploadFileCreate: data.find((item) => item.code === PERSON_UPLOAD_INDEX_CREATE.column_upload_file) || {},

    titlePageUpdate: data.find((item) => item.code === PERSON_UPLOAD_INDEX_UPDATE.text_title) || {},
    btnSaveUpdate: data.find((item) => item.code === PERSON_UPLOAD_INDEX_UPDATE.button_save) || {},
    btnCloseUpdate: data.find((item) => item.code === PERSON_UPLOAD_INDEX_UPDATE.button_close) || {},
    idUpdate: data.find((item) => item.code === PERSON_UPLOAD_INDEX_UPDATE.column_id) || {},
    nameUpdate: data.find((item) => item.code === PERSON_UPLOAD_INDEX_UPDATE.column_name) || {},
    codeUpdate: data.find((item) => item.code === PERSON_UPLOAD_INDEX_UPDATE.column_code) || {},
    iconUpdate: data.find((item) => item.code === PERSON_UPLOAD_INDEX_UPDATE.column_icon) || {},
    dateFormatUpdate: data.find((item) => item.code === PERSON_UPLOAD_INDEX_UPDATE.column_date_format) || {},
    cultureUpdate: data.find((item) => item.code === PERSON_UPLOAD_INDEX_UPDATE.column_culture) || {},
    isActiveUpdate: data.find((item) => item.code === PERSON_UPLOAD_INDEX_UPDATE.column_is_active) || {},
    sortUpdate: data.find((item) => item.code === PERSON_UPLOAD_INDEX_UPDATE.column_sort) || {},
    actionUpdate: data.find((item) => item.code === PERSON_UPLOAD_INDEX_UPDATE.column_action) || {},
    lastNameUpdate: data.find((item) => item.code === PERSON_UPLOAD_INDEX_UPDATE.column_lastName) || {},
    middleNameUpdate: data.find((item) => item.code === PERSON_UPLOAD_INDEX_UPDATE.column_middleName) || {},
    firstNameUpdate: data.find((item) => item.code === PERSON_UPLOAD_INDEX_UPDATE.column_firstName) || {},
    genderNameUpdate: data.find((item) => item.code === PERSON_UPLOAD_INDEX_UPDATE.column_gender) || {},
    addressUpdate: data.find((item) => item.code === PERSON_UPLOAD_INDEX_UPDATE.column_address) || {},
    zipcodeUpdate: data.find((item) => item.code === PERSON_UPLOAD_INDEX_UPDATE.column_zipcode) || {},
    placeUpdate: data.find((item) => item.code === PERSON_UPLOAD_INDEX_UPDATE.column_place) || {},
    countryUpdate: data.find((item) => item.code === PERSON_UPLOAD_INDEX_UPDATE.column_country) || {},
    regionUpdate: data.find((item) => item.code === PERSON_UPLOAD_INDEX_UPDATE.column_region) || {},
    latitudeUpdate: data.find((item) => item.code === PERSON_UPLOAD_INDEX_UPDATE.column_latitude) || {},
    longtitudeUpdate: data.find((item) => item.code === PERSON_UPLOAD_INDEX_UPDATE.column_longtitude) || {},
    telephone1Update: data.find((item) => item.code === PERSON_UPLOAD_INDEX_UPDATE.column_telephone1) || {},
    telephone2Update: data.find((item) => item.code === PERSON_UPLOAD_INDEX_UPDATE.column_telephone2) || {},
    email1Update: data.find((item) => item.code === PERSON_UPLOAD_INDEX_UPDATE.column_email1) || {},
    email2Update: data.find((item) => item.code === PERSON_UPLOAD_INDEX_UPDATE.column_email2) || {},
    memoUpdate: data.find((item) => item.code === PERSON_UPLOAD_INDEX_UPDATE.column_memo) || {},
    memoAdministrationUpdate: data.find((item) => item.code === PERSON_UPLOAD_INDEX_UPDATE.column_memoAdministration) || {},
    wantsNewsletterUpdate: data.find((item) => item.code === PERSON_UPLOAD_INDEX_UPDATE.column_wantsNewsletter) || {},
    idRelPersonUploadUpdate: data.find((item) => item.code === PERSON_UPLOAD_INDEX_UPDATE.column_person) || {},
    personNameUpdate: data.find((item) => item.code === PERSON_UPLOAD_INDEX_UPDATE.column_name_person) || {},
    uploadFileUpdate: data.find((item) => item.code === PERSON_UPLOAD_INDEX_UPDATE.column_upload_file) || {},

    titlePageDetail: data.find((item) => item.code === PERSON_UPLOAD_INDEX_DETAIL.text_title) || {},
    btnCloseDetail: data.find((item) => item.code === PERSON_UPLOAD_INDEX_DETAIL.button_close) || {},
    idDetail: data.find((item) => item.code === PERSON_UPLOAD_INDEX_DETAIL.column_id) || {},
    nameDetail: data.find((item) => item.code === PERSON_UPLOAD_INDEX_DETAIL.column_name) || {},
    codeDetail: data.find((item) => item.code === PERSON_UPLOAD_INDEX_DETAIL.column_code) || {},
    iconDetail: data.find((item) => item.code === PERSON_UPLOAD_INDEX_DETAIL.column_icon) || {},
    dateFormatDetail: data.find((item) => item.code === PERSON_UPLOAD_INDEX_DETAIL.column_date_format) || {},
    cultureDetail: data.find((item) => item.code === PERSON_UPLOAD_INDEX_DETAIL.column_culture) || {},
    isActiveDetail: data.find((item) => item.code === PERSON_UPLOAD_INDEX_DETAIL.column_is_active) || {},
    sortDetail: data.find((item) => item.code === PERSON_UPLOAD_INDEX_DETAIL.column_sort) || {},
    actionDetail: data.find((item) => item.code === PERSON_UPLOAD_INDEX_DETAIL.column_action) || {},
    lastNameDetail: data.find((item) => item.code === PERSON_UPLOAD_INDEX_DETAIL.column_lastName) || {},
    middleNameDetail: data.find((item) => item.code === PERSON_UPLOAD_INDEX_DETAIL.column_middleName) || {},
    firstNameDetail: data.find((item) => item.code === PERSON_UPLOAD_INDEX_DETAIL.column_firstName) || {},
    genderNameDetail: data.find((item) => item.code === PERSON_UPLOAD_INDEX_DETAIL.column_gender) || {},
    addressDetail: data.find((item) => item.code === PERSON_UPLOAD_INDEX_DETAIL.column_address) || {},
    zipcodeDetail: data.find((item) => item.code === PERSON_UPLOAD_INDEX_DETAIL.column_zipcode) || {},
    placeDetail: data.find((item) => item.code === PERSON_UPLOAD_INDEX_DETAIL.column_place) || {},
    countryDetail: data.find((item) => item.code === PERSON_UPLOAD_INDEX_DETAIL.column_country) || {},
    regionDetail: data.find((item) => item.code === PERSON_UPLOAD_INDEX_DETAIL.column_region) || {},
    latitudeDetail: data.find((item) => item.code === PERSON_UPLOAD_INDEX_DETAIL.column_latitude) || {},
    longtitudeDetail: data.find((item) => item.code === PERSON_UPLOAD_INDEX_DETAIL.column_longtitude) || {},
    telephone1Detail: data.find((item) => item.code === PERSON_UPLOAD_INDEX_DETAIL.column_telephone1) || {},
    telephone2Detail: data.find((item) => item.code === PERSON_UPLOAD_INDEX_DETAIL.column_telephone2) || {},
    email1Detail: data.find((item) => item.code === PERSON_UPLOAD_INDEX_DETAIL.column_email1) || {},
    email2Detail: data.find((item) => item.code === PERSON_UPLOAD_INDEX_DETAIL.column_email2) || {},
    memoDetail: data.find((item) => item.code === PERSON_UPLOAD_INDEX_DETAIL.column_memo) || {},
    memoAdministrationDetail: data.find((item) => item.code === PERSON_UPLOAD_INDEX_DETAIL.column_memoAdministration) || {},
    wantsNewsletterDetail: data.find((item) => item.code === PERSON_UPLOAD_INDEX_DETAIL.column_wantsNewsletter) || {},
    idRelPersonUploadDetail: data.find((item) => item.code === PERSON_UPLOAD_INDEX_DETAIL.column_person) || {},
    personNameDetail: data.find((item) => item.code === PERSON_UPLOAD_INDEX_DETAIL.column_name_person) || {},
    uploadFileDetail: data.find((item) => item.code === PERSON_UPLOAD_INDEX_DETAIL.column_upload_file) || {},

  };
}

export function getPersonUploadLabel(data) {
  return {
    titlePage: data.find((item) => item.code === PERSON_UPLOAD_LABEL.text_title) || {},

    btnExport: data.find((item) => item.code === PERSON_UPLOAD_LABEL.button_export) || {},
    btnPdf: data.find((item) => item.code === PERSON_UPLOAD_LABEL.button_pdf) || {},
    btnCsv: data.find((item) => item.code === PERSON_UPLOAD_LABEL.button_csv) || {},
    btnExcel: data.find((item) => item.code === PERSON_UPLOAD_LABEL.button_excel) || {},
    btnExportAllData: data.find((item) => item.code === PERSON_UPLOAD_LABEL.button_export_all_data) || {},
    btnExportCurrentPage: data.find((item) => item.code === PERSON_UPLOAD_LABEL.button_export_current_page) || {},
    btnExportSearchData: data.find((item) => item.code === PERSON_UPLOAD_LABEL.button_export_search_data) || {},
    btnImport: data.find((item) => item.code === PERSON_UPLOAD_LABEL.button_import) || {},

    tooltipSwitch: data.find((item) => item.code === PERSON_UPLOAD_LABEL.tooltip_switch) || {},
    tooltipSearch: data.find((item) => item.code === PERSON_UPLOAD_LABEL.tooltip_search) || {},
    tooltipFilter: data.find((item) => item.code === PERSON_UPLOAD_LABEL.tooltip_filter) || {},
    tooltipShowHideColumn: data.find((item) => item.code === PERSON_UPLOAD_LABEL.tooltip_show_hide_column) || {},
    tooltipUpdate: data.find((item) => item.code === PERSON_UPLOAD_LABEL.tooltip_update) || {},
    tooltipDetail: data.find((item) => item.code === PERSON_UPLOAD_LABEL.tooltip_detail) || {},

    id: data.find((item) => item.code === PERSON_UPLOAD_LABEL.column_id) || {},
    name: data.find((item) => item.code === PERSON_UPLOAD_LABEL.column_name) || {},
    code: data.find((item) => item.code === PERSON_UPLOAD_LABEL.column_code) || {},
    sort: data.find((item) => item.code === PERSON_UPLOAD_LABEL.column_sort) || {},
    action: data.find((item) => item.code === PERSON_UPLOAD_LABEL.column_action) || {},
    paginateGoto: data.find((item) => item.code === PERSON_UPLOAD_LABEL.paginate_go_to) || {},
    paginateTotalPage: data.find((item) => item.code === PERSON_UPLOAD_LABEL.paginate_total_page) || {},
    paginateRowsPerPage: data.find((item) => item.code === PERSON_UPLOAD_LABEL.paginate_rows_per_page) || {},
    paginateShow: data.find((item) => item.code === PERSON_UPLOAD_LABEL.paginate_show) || {},
    paginateOf: data.find((item) => item.code === PERSON_UPLOAD_LABEL.paginate_of) || {},

    idUpdate: data.find((item) => item.code === PERSON_UPLOAD_LABEL_UPDATE.column_id) || {},
    nameUpdate: data.find((item) => item.code === PERSON_UPLOAD_LABEL_UPDATE.column_name) || {},
    codeUpdate: data.find((item) => item.code === PERSON_UPLOAD_LABEL_UPDATE.column_code) || {},
    sortUpdate: data.find((item) => item.code === PERSON_UPLOAD_LABEL_UPDATE.column_sort) || {},
    actionUpdate: data.find((item) => item.code === PERSON_UPLOAD_LABEL_UPDATE.column_action) || {},
    textTitleUpdate: data.find((item) => item.code === PERSON_UPLOAD_LABEL_UPDATE.text_title) || {},
    btnCloseUpdate: data.find((item) => item.code === PERSON_UPLOAD_LABEL_UPDATE.button_close) || {},
    btnSaveUpdate: data.find((item) => item.code === PERSON_UPLOAD_LABEL_UPDATE.button_save) || {},

    idDetail: data.find((item) => item.code === PERSON_UPLOAD_LABEL_DETAIL.column_id) || {},
    nameDetail: data.find((item) => item.code === PERSON_UPLOAD_LABEL_DETAIL.column_name) || {},
    codeDetail: data.find((item) => item.code === PERSON_UPLOAD_LABEL_DETAIL.column_code) || {},
    sortDetail: data.find((item) => item.code === PERSON_UPLOAD_LABEL_DETAIL.column_sort) || {},
    actionDetail: data.find((item) => item.code === PERSON_UPLOAD_LABEL_DETAIL.column_action) || {},
    textTitleDetail: data.find((item) => item.code === PERSON_UPLOAD_LABEL_DETAIL.text_title) || {},
    btnCloseDetail: data.find((item) => item.code === PERSON_UPLOAD_LABEL_DETAIL.button_close) || {},
  };
}