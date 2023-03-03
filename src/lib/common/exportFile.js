import jsPDF from 'jspdf';
import 'jspdf-autotable';
import _ from 'lodash';
import * as XLSX from 'xlsx';
import moment from 'moment';

function convertData(data) {
  const newData = _.cloneDeep(data);
  return newData.map((item) => {
    if (item.icon) {
      item.icon = item.icon.props ? item.icon.props.src : item.icon;
    }

    if (item.isActive || item.isActive === 0) {
      item.isActive = item.isActive.props
        ? item.isActive.props.isActive === 1
          ? 'TRUE'
          : 'FALSE'
        : item.isActive == 1
        ? 'TRUE'
        : 'FALSE';
    }
    delete item.action;
    return item;
  });
}

export function downloadExcel(data, fileName) {
  if (data.length > 0) {
    const ws = XLSX.utils.json_to_sheet(convertData(data));
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');
    XLSX.writeFile(wb, fileName ? `${fileName}_${getDateTimeCreate()}.xlsx` : `export_${getDateTimeCreate()}.xlsx`);
  }
}

function convertArrayOfObjectsToCSV(array) {
  let result;
  const columnDelimiter = ',';
  const lineDelimiter = '\n';
  const keys = Object.keys(array[0]);

  result = '';
  result += keys.join(columnDelimiter);
  result += lineDelimiter;

  array.forEach((item) => {
    let ctr = 0;
    keys.forEach((key) => {
      if (ctr > 0) result += columnDelimiter;

      result += item[key];

      ctr++;
    });
    result += lineDelimiter;
  });

  return result;
}

export function downloadCSV(array, fileName) {
  if (array.length > 0) {
    const link = document.createElement('a');
    let csv = convertArrayOfObjectsToCSV(convertData(array));
    if (csv == null) return;

    if (!csv.match(/^data:text\/csv/i)) {
      csv = `data:text/csv;charset=utf-8,${csv}`;
    }

    link.setAttribute('href', encodeURI(csv));
    link.setAttribute('download', `${fileName}_${getDateTimeCreate()}.csv` || `export_${getDateTimeCreate()}.csv`);
    link.click();
  }
}

export function downloadPDF(array, columns, label, fileName) {
  const unit = 'pt';
  const size = 'A4'; // Use A1, A2, A3 or A4
  const orientation = 'landscape'; // portrait or landscape

  const marginLeft = 40;
  const doc = new jsPDF(orientation, unit, size);

  doc.setFontSize(15);

  // const title = "My Awesome Report";
  const headers = {};
  columns.map((item) => {
    if (item.visibility && !(item.key == 'action' || item.key == 'is_active')) {
      headers[item.label] = label[item.label]?.name;
    }
    return item;
  });
  const data = convertData(array);
  data.unshift(headers);
  let content = {
    startY: 50,
    //head: headers,
    body: data,
  };

  // doc.text(title, marginLeft, 40);
  doc.autoTable(content);
  doc.save(`${fileName}_${getDateTimeCreate()}` || `export_${getDateTimeCreate()}.pdf`);
}
function getDateTimeCreate() {
  var createDate = moment(new Date()).format('DD/MM/YYYY/HH/mm');
  return createDate.toString().split('/').join('');
}
