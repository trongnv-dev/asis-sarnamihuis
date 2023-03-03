import { Button, Spinner } from '@blueupcode/components';
import { swal } from 'components/swal/instance';
import { get } from 'lodash';
import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { personUploadApi } from 'services';
import { MESSAGE_TABLE } from '../../../../const/message_table';

const ModalDeletePersonUpload = (props) => {
  const { popUpConfirm, setPopUpConfirm, currentIdPersonUpload, setIsReloadData, isReloadData } = props;
  const [isLoading, setIsLoading] = useState(false);

  const switchActivePersonUpload = async (currentIdPersonUpload) => {
    setIsLoading(true);
    try {
      const response = await personUploadApi.deleteItemPersonUpload(currentIdPersonUpload);
      if (response.status == 200) {
        setIsReloadData(!isReloadData);
        swal.fire({ text: response.data.update, icon: 'success' });
      } else {
        swal.fire({ text: 'update failed', icon: 'error' });
      }
    } catch (e) {
      console.log(e);
      const errorMessage = get(e, response.data.error);
      swal.fire({ text: errorMessage || 'An occur error', icon: 'error' });
    }
    setIsLoading(false);
    setPopUpConfirm(false);
  };

  return (
    <div>
      {' '}
      <Modal show={popUpConfirm} centered>
        <Modal.Body>{MESSAGE_TABLE.DELETE}</Modal.Body>
        <Modal.Footer>
          <Button
            style={{
              height: 36,
              width: 75,
              margin: 8,
            }}
            onClick={() => setPopUpConfirm(false)}
            variant="outline-secondary"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            style={{
              height: 36,
              width: 75,
              margin: 8,
            }}
            onClick={() => switchActivePersonUpload(currentIdPersonUpload)}
            variant="outline-primary"
          >
            {isLoading ? <Spinner style={{ width: '1.5rem', height: '1.5rem' }} className="mr-2" /> : 'OK'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ModalDeletePersonUpload;
