import { Button } from '@blueupcode/components';
import { swal } from 'components/swal/instance';
import { ChangeLabel } from 'components/UI/features';
import { get } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

const ImportData = (props) => {
  const { label, api, handleReload, disableBtn } = props;
  const isSwitch = useSelector((state) => state.page.isQuickEdit);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInput = useRef(null);

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size / 1024 / 1024 > 2) return swal.fire({ text: 'File size cannot exceed more than 2MB', icon: 'error' });
    setSelectedFile(e.target.files[0]);
  };

  useEffect(() => {
    if (!selectedFile) return;
    async function uploadFile() {
      try {
        const data = new FormData();
        data.append('file', selectedFile);
        const res = await api(data);
        if (res.status === 200) swal.fire({ text: 'Uploaded Success', icon: 'success' });
        handleReload();
      } catch (e) {
        console.log(e);
        const errorMessage = get(e, response.data.error);
        swal.fire({ text: errorMessage || 'An occur error', icon: 'error' });
      }
    }
    uploadFile();
  }, [selectedFile]);

  return (
    <div style={{ marginLeft: '8px', pointerEvents: `${disableBtn ? 'none' : 'default'}` }}>
      <Button onClick={(e) => (isSwitch ? null : fileInput.current && fileInput.current.click())}>
        {isSwitch ? <ChangeLabel label={label.btnImport || {}} /> : <>{label.btnImport.name}</>}
      </Button>
      <input type="file" ref={fileInput} onChange={handleFileInput} hidden accept=".xls,.xlsx" />
    </div>
  );
};

export default ImportData;
