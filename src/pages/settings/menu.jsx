import { Container } from '@blueupcode/components';
import { Button, CircularProgress, Divider, Grid, Box } from '@mui/material';
import withAuth from 'components/auth/tokenWithAuth';
import withLayout from 'components/layout/withLayout';
import { swal } from 'components/swal/instance';
import { DragDrop, FormMenu, FormMenuEdit } from 'components/UI/Menu';
import PAGE from 'config/page.config';
import Head from 'next/head';
import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { menuApi } from 'services';
import { pageChangeHeaderTitle, asideMenuUpdate } from 'store/actions';
import styles from 'styles/pages/menu.module.scss';
import { saveMenu, convertMenu } from 'utils/menu';

const uri = [
  { key: 'language-list', value: '/languages/list', name: 'Language List' },
  { key: 'language-label', value: '/languages/label', name: 'Language Label' },
  { key: 'person-list', value: '/persons/list', name: 'Persons List' },
  { key: 'person-label', value: '/persons/label', name: 'Person Label' },
  { key: 'gender-list', value: '/genders/list', name: 'Gender List' },
  { key: 'gender-label', value: '/genders/label', name: 'Gender Label' },
  { key: 'country-list', value: '/countries/list', name: 'Country List' },
  { key: 'country-label', value: '/countries/label', name: 'Country Label' },
  { key: 'region-list', value: '/regions/list', name: 'Region List' },
  { key: 'region-label', value: '/regions/label', name: 'Region Label' },
  { key: 'user-groups-list', value: '/user-groups/list', name: 'User Group List' },
  { key: 'user-groups-label', value: '/user-groups/label', name: 'User Group Label' },
  { key: 'settings-menu', value: '/settings/menu', name: 'Sidebar' },
  { key: 'permission-add', value: '/permission/add', name: 'Permission Add' },
  { key: 'permission-list', value: '/permission/list', name: 'Permission List' },
  { key: 'person-uploads-label', value: '/person-uploads/label', name: 'Person upload Label' },
  { key: 'sys-att-main-list', value: '/sys-att-main/list', name: 'SysAttMain List' },
  { key: 'sys-att-main-label', value: '/sys-att-main/label', name: 'SysAttMain Label' },
  { key: 'sys-att-sub-label', value: '/sys-att-sub/label', name: 'SysAttSub Label' },
];

const LanguageLabelPage = () => {
  const [loading, setLoading] = useState(false);
  const [menuList, setMenuList] = useState([]);
  const [orderMenu, setOrderMenu] = useState([]);
  const [isChangeOrder, setIsChangeOrder] = useState(false);
  const [isAddMode, setIsAddMode] = useState(true);
  const [updateItem, setUpdateItem] = useState({});
  const [newItemUpdate, setNewItemUpdate] = useState(null);

  const needUpdateSideMenu = useSelector((state) => state.sidemenu?.needUpdate);

  const dispatch = useDispatch();

  async function updateParentId(ids) {
    try {
      setLoading(true);
      await Promise.all(
        ids.map(async (item) => {
          await menuApi.editMenu(item);
        })
      )
        .then(async () => {
          let newMenu = await menuApi.getMenuList({
            orderBy: 'sort',
            direction: 'asc',
            perPage: '',
            page: 1,
            searchAll: '',
          });
          if (newMenu.status === 200) {
            setMenuList(newMenu.data.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });

      saveMenu(orderMenu);

      if (needUpdateSideMenu == null) dispatch(asideMenuUpdate(true));
      else dispatch(asideMenuUpdate(!needUpdateSideMenu));
      swal.fire({ text: 'Update Successful.', icon: 'success' });
    } catch (error) {
      swal.fire({ text: error.message, icon: 'error' });
    }
    setLoading(false);
  }

  function handleClickSave() {
    const ids = [];
    orderMenu.map((item) => {
      if (item.children && item.children.length > 0) {
        item.children.map((ele) => {
          if (ele.parent_id != item.id) ids.push({ id: ele.id, parentId: item.id });
        });
      }
      if (item.parent_id != 0) ids.push({ id: item.id, parentId: 0 });
    });
    updateParentId(ids);
    setIsChangeOrder(false);
  }

  function handleClickReset() {
    if (!newItemUpdate) {
      const newMenuList = [...menuList];
      setMenuList(newMenuList);
      setIsChangeOrder(false);
    } else {
      const fetchData = async () => {
        try {
          let newMenu = await menuApi.getMenuList({
            orderBy: 'sort',
            direction: 'asc',
            perPage: '',
            page: 1,
            searchAll: '',
          });
          if (newMenu.status === 200) {
            setMenuList(newMenu.data.data);
          } else {
            swal.fire({ text: newMenu.statusText, icon: 'error' });
          }
        } catch (e) {
          console.log(e);
          swal.fire({ text: e, icon: 'error' });
        }
      };

      fetchData();
      setIsChangeOrder(false);
    }
  }

  async function fetchApi() {
    try {
      setLoading(true);
      let response = await menuApi.getMenuList({
        orderBy: 'sort',
        direction: 'asc',
        perPage: '',
        page: 1,
        searchAll: '',
      });
      if (response.status === 200) {
        setMenuList(response.data.data);
        if (needUpdateSideMenu == null) dispatch(asideMenuUpdate(true));
        else dispatch(asideMenuUpdate(!needUpdateSideMenu));
        setIsAddMode(true);
        setIsChangeOrder(false);
      } else {
        swal.fire({ text: response.statusText, icon: 'error' });
      }
    } catch (error) {
      swal.fire({ text: error.message, icon: 'error' });
    }
    setLoading(false);
  }

  const handleEdit = (id, name) => {
    setUpdateItem({ id: id, name: name });
    setIsAddMode(false);
  };

  useEffect(() => {
    dispatch(pageChangeHeaderTitle({ id: 'menu', name: 'Menu' }));
  }, []);

  useEffect(() => {
    fetchApi();
  }, []);

  useEffect(() => {
    if (!newItemUpdate) return;

    const orderMenuUpdated = orderMenu.map((menuItem) => {
      // parent or equal parent
      if (menuItem.id === newItemUpdate.id) {
        return {
          ...menuItem,
          icon: newItemUpdate.icon,
          key: newItemUpdate.key,
          sort: newItemUpdate.sort,
          name: newItemUpdate.translate[0]?.name,
          uri: newItemUpdate.uri,
        };
      }

      // children
      return {
        ...menuItem,
        children: menuItem.children?.map((child) => {
          if (child.id === newItemUpdate.id) {
            return {
              ...child,
              icon: newItemUpdate.icon,
              key: newItemUpdate.key,
              sort: newItemUpdate.sort,
              name: newItemUpdate.translate[0]?.name,
              uri: newItemUpdate.uri,
            };
          }
          return child;
        }),
      };
    });

    setOrderMenu(orderMenuUpdated);

    // update asideMenu
    if (needUpdateSideMenu == null) dispatch(asideMenuUpdate(true));
    else dispatch(asideMenuUpdate(!needUpdateSideMenu));
  }, [newItemUpdate]);

  return (
    <Fragment>
      <Head>
        <title>Table | {PAGE.siteName}</title>
      </Head>
      <Container fluid>
        {loading ? (
          <div className={styles.loading}>
            <CircularProgress disableShrink />
          </div>
        ) : (
          <>
            <Grid container>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={6}>
                  <DragDrop
                    menuList={menuList}
                    getMenuList={fetchApi}
                    setOrderMenu={setOrderMenu}
                    setIsChangeOrder={setIsChangeOrder}
                    handleEdit={handleEdit}
                    orderMenuList={orderMenu}
                  />
                  {isChangeOrder && (
                    <Grid>
                      <Button variant="contained" sx={{ mt: 2, mb: 3 }} onClick={() => handleClickSave()}>
                        Save
                      </Button>
                      <Button
                        variant="contained"
                        color="success"
                        sx={{ mt: 2, mb: 3, ml: 2 }}
                        onClick={() => handleClickReset()}
                      >
                        Reset
                      </Button>
                    </Grid>
                  )}
                </Grid>
                <Grid item xs={12} md={6} lg={6} className="w-100">
                  {isAddMode ? (
                    <div className={styles.form}>Create new menu</div>
                  ) : (
                    <>
                      <div className="d-flex justify-content-between align-items-center w-100">
                        <div className={styles.form}>Edit Menu {updateItem?.name}</div>
                        <Button variant="contained" onClick={() => setIsAddMode(true)}>
                          Back
                        </Button>
                      </div>
                    </>
                  )}

                  <Divider sx={{ mb: 1, mt: 1 }} />
                  {isAddMode ? (
                    <FormMenu getMenuList={fetchApi} menuList={menuList} uri={uri} />
                  ) : (
                    <>
                      <FormMenuEdit
                        getMenuList={fetchApi}
                        menuList={menuList}
                        updateItem={updateItem}
                        uri={uri}
                        setNewItemUpdate={setNewItemUpdate}
                      />
                    </>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </>
        )}
      </Container>
    </Fragment>
  );
};

export default withAuth(withLayout(LanguageLabelPage));
