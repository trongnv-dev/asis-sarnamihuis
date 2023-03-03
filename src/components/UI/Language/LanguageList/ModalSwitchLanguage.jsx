import { Button, Spinner } from '@blueupcode/components';
import { swal } from 'components/swal/instance';
import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { languageApi } from 'services';
import { setLanguage } from 'store/actions';
import { MESSAGE_TABLE } from '../../../../const/message_table';

const ModalSwitchLanguage = (props) => {
  const {
    popUpConfirm,
    setPopUpConfirm,
    currentStatusLanguage,
    currentIdLanguage,
    setIsReloadData,
    isReloadData,
    isActive,
  } = props;
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const switchActiveLanguage = async (currentIdLanguage, currentStatusLanguage) => {
    setIsLoading(true);
    try {
      const response = await languageApi.switchActiveLanguage({
        id: currentIdLanguage,
        status: currentStatusLanguage,
      });

      if (response.status == 200) {
        dispatch(setLanguage());
        setIsReloadData(!isReloadData);
        swal.fire({ text: response.data.update, icon: 'success' });
      } else {
        swal.fire({ text: 'update failed', icon: 'error' });
      }
    } catch (e) {
      console.log(e);
      swal.fire({ text: e.message, icon: 'error' });
    }
    setIsLoading(false);
    setPopUpConfirm(false);
  };

  return (
    <div>
      <Modal show={popUpConfirm} centered>
        <Modal.Body>{isActive ? MESSAGE_TABLE.INACTIVE : MESSAGE_TABLE.ACTIVE}</Modal.Body>
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
            onClick={() => switchActiveLanguage(currentIdLanguage, currentStatusLanguage)}
            variant="outline-primary"
          >
            {isLoading ? <Spinner style={{ width: '1.5rem', height: '1.5rem' }} className="mr-2" /> : 'OK'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ModalSwitchLanguage;
