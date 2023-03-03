import { Button, Modal, Spinner } from '@blueupcode/components';
import { Switch } from '@material-ui/core';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { swal } from 'components/swal/instance';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import { userApi } from 'services';
import { isEmpty } from 'lodash';

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'idUserGroup', headerName: 'Id User Group', width: 130 },
  { field: 'username', headerName: 'Username', width: 130 },
];

const AddUserIntoUserGroup = (props) => {
  const { tableAddUser, setTableAddUser, selectedUserGroup } = props;
  const [users, setUsers] = useState([]);
  const [selectedRow, setSelectedRow] = useState({});
  const handleCancel = () => {
    setTableAddUser(false);
  };

  const handleOk = () => {
    setTableAddUser(false);
    changeUserByIdUSerGroup();
  };

  const changeUserByIdUSerGroup = async () => {
    if (isEmpty(selectedRow)) return;
    await Promise.all(
      selectedRow.map((item) => userApi.editUserByIdUserGroup({ id: item, idUserGroup: selectedUserGroup }))
    )
      .then(() => {
        swal.fire({ text: 'Updated Successful', icon: 'success' });
      })
      .catch((error) => console.log(Promise.resolve(error)));
  };

  useEffect(() => {
    async function getUserList() {
      const res = await userApi.getUserList();
      if (res.status === 200) {
        setUsers(res.data.data);
      }
    }
    getUserList();
  }, []);

  return (
    <>
      <Modal centered isOpen={tableAddUser}>
        <Modal.Body>
          <DialogContent>
            <div style={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={users.map((item) => {
                  return { id: item.id, idUserGroup: item.idUserGroup, username: item.username };
                })}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                checkboxSelection
                onSelectionModelChange={(newSelectionModel) => {
                  setSelectedRow(newSelectionModel);
                }}
                selectionModel={selectedRow}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleOk}>Ok</Button>
          </DialogActions>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AddUserIntoUserGroup;
