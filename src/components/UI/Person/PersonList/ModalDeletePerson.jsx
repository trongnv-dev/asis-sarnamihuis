import { Button, Spinner } from '@blueupcode/components';
import { swal } from 'components/swal/instance';
import { get } from 'lodash';
import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { personApi } from 'services';
import { MESSAGE_TABLE } from '../../../../const/message_table';

const ModalDeletePerson = (props) => {
  const { popUpConfirm, setPopUpConfirm, currentIdPerson, setIsReloadData, isReloadData } = props;
  const [isLoading, setIsLoading] = useState(false);

  const switchActivePerson = async (currentIdPerson) => {
    setIsLoading(true);
    try {
      const response = await personApi.deleteItemPerson(currentIdPerson);
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
            onClick={() => switchActivePerson(currentIdPerson)}
            variant="outline-primary"
          >
            {isLoading ? <Spinner style={{ width: '1.5rem', height: '1.5rem' }} className="mr-2" /> : 'OK'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ModalDeletePerson;
