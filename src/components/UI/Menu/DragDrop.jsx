import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { swal } from 'components/swal/instance';
import { FormMenuEdit } from 'components/UI/Menu';
import React, { useEffect, useState } from 'react';
import Nestable from 'react-nestable';
import { menuApi } from 'services';
import styles from 'styles/pages/menu.module.scss';
import { convertMenu, orderMenu, saveMenu } from 'utils/menu';

const DragDrop = (props) => {
  const { menuList, getMenuList, setOrderMenu, setIsChangeOrder, handleEdit, orderMenuList } = props;
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState([]);

  const handleDelete = (item) => {
    async function fetchApi() {
      try {
        let response = await menuApi.deleteMenu(item.id);
        if (response.status === 200) {
          swal.fire({ text: 'Your file has been deleted.', icon: 'success' });
          getMenuList();
        } else {
          swal.fire({ text: response.statusText, icon: 'error' });
        }
      } catch (e) {
        console.log(e);
        swal.fire({ text: e.message, icon: 'error' });
      }
    }

    swal
      .fire({
        text: item.parent_id === 0 ? 'Will you delete all sub menu ?' : 'Are you sure delete it ?',
        icon: 'error',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      })
      .then((result) => {
        if (result.value) {
          fetchApi();
        }
      });
  };

  const confirmChange = (e) => {
    const parentId = e.dragItem.parent_id;
    const destinationParent = e.destinationParent;
    if (parentId === 0 && destinationParent !== null) return false;
    return true;
  };

  const handleChangeMenu = (e) => {
    if (JSON.stringify(e.items) !== JSON.stringify(menu)) {
      setIsChangeOrder(true);
      setMenu(e.items);
    }
  };

  const renderItem = ({ item, collapseIcon }) => {
    return (
      <>
        <div className={styles.text}>
          {collapseIcon}
          {collapseIcon != null ? <span style={{ marginLeft: 25 }}>{item.name}</span> : item.name}
          {!item.uri.includes('settings') && (
            <>
              <div className={styles.delete} onClick={() => handleDelete(item)}>
                <DeleteIcon sx={{ fontSize: 23 }} />
              </div>
            </>
          )}
          <div className={styles.edit} onClick={() => handleEdit(item.id, item.key)}>
            <EditIcon sx={{ fontSize: 23 }} />
          </div>
        </div>
      </>
    );
  };

  useEffect(() => {
    if (menuList && menuList.length > 0) {
      const menu = JSON.parse(localStorage.getItem('menu'));
      if (menu && menu.length > 0) {
        setMenu(orderMenu(menu, menuList));
      } else {
        const newMenu = convertMenu(menuList);
        saveMenu(newMenu);
        setMenu(newMenu);
      }
    }
  }, [menuList]);

  useEffect(() => {
    setOrderMenu(menu);
  }, [menu]);

  return (
    <div>
      {menu && (
        <Nestable
          onChange={handleChangeMenu}
          confirmChange={confirmChange}
          items={orderMenuList}
          renderItem={renderItem}
          collapsed={true}
          maxDepth={2}
        />
      )}
    </div>
  );
};

export default DragDrop;
