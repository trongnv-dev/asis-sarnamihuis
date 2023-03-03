import { Button, Spinner } from '@blueupcode/components';
import { Grid } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { swal } from 'components/swal/instance';
import { material_icons } from 'config/constant';
import { useComponentVisible } from 'hooks';
import { get } from 'lodash';
import React, { Fragment, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { menuApi } from 'services';
import styles from 'styles/pages/ui/Menu/form-menu.module.scss';

const FormMenu = (props) => {
  const { getMenuList, menuList, uri } = props;
  const [loading, setLoading] = useState(false);
  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);
  const languages = useSelector((state) => state.language.listLanguageActive);
  const [icon, setIcon] = useState('');
  const [parent, setParent] = useState('');
  const [type, setType] = useState('');
  const [uriSelected, setUriSelected] = useState('');

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm();

  const handleSelect = (item, changeValue, valueForm, validate) => {
    changeValue(item);
    setIsComponentVisible(false);
    setValue(valueForm, item, {
      shouldValidate: validate,
      shouldDirty: true,
    });
  };

  const onReset = () => {
    handleSelect('', setParent, 'parent', false);
    handleSelect('', setUriSelected, 'key', false);
    handleSelect('', setIcon, 'icon', false);
    reset();
  };

  const fetchApiMenu = async (data) => {
    setLoading(true);
    try {
      const response = await menuApi.addMenu({
        sort:
          Math.max.apply(
            Math,
            menuList.map(function (o) {
              return o.sort;
            })
          ) + 1,
        parentId: data.type !== 0 ? data.parent : 0,
        uri: data.type !== 0 ? uri.find((item) => item.key === data.key).value : 'no-uri',
        key: data.type !== 0 ? data.key : 'no-key',
        icon: data.icon,
        menu: data.translate.map((item) => {
          return { idLanguage: item.idLanguage, name: item.name };
        }),
      });
      if (response.status === 200) {
        swal.fire({ text: 'Create Successful !!', icon: 'success' });
        getMenuList();
      }
    } catch (e) {
      console.log(e);
      const errorMessage = get(e, 'response.data.error');
      swal.fire({ text: errorMessage || 'An occur error', icon: 'error' });
    }
    setLoading(false);
  };

  return (
    <Fragment>
      <form onSubmit={handleSubmit(fetchApiMenu)}>
        <div className="form-group">
          <Grid container spacing={2} columnGap={1}>
            <Grid item xs className={styles.form}>
              <Grid container>
                <Grid item xs={2} display="flex" alignItems="center" justifyContent="start">
                  Type
                </Grid>
                <Grid item xs={10} className="mb-3">
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Type</InputLabel>
                    <Select
                      {...register('type', { required: true })}
                      label="Type"
                      onChange={(e) => {
                        handleSelect(e.target.value, setType, 'type', true);
                        onReset();
                      }}
                      MenuProps={{
                        style: {
                          maxHeight: 400,
                        },
                      }}
                      value={type}
                    >
                      <MenuItem key={0} value={0}>
                        Main menu
                      </MenuItem>
                      <MenuItem key={1} value={1}>
                        Sub Menu
                      </MenuItem>
                    </Select>
                  </FormControl>
                  {errors.type && errors.type.type === 'required' && (
                    <span role="alert" style={{ fontSize: '12px', color: 'red' }}>
                      This field is required
                    </span>
                  )}
                </Grid>

                {!!type && (
                  <>
                    <Grid item xs={2} display="flex" alignItems="center" justifyContent="start">
                      Parent
                    </Grid>
                    <Grid item xs={10} className="mb-3">
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Parent</InputLabel>
                        <Select
                          {...register('parent', { required: true })}
                          label="Parent"
                          onChange={(e) => handleSelect(e.target.value, setParent, 'parent', true)}
                          MenuProps={{
                            style: {
                              maxHeight: 400,
                            },
                          }}
                          value={uri.find((item) => item.key === uriSelected)?.value === '/' ? 0 : parent}
                          readOnly={uri.find((item) => item.key === uriSelected)?.value === '/' ? true : false}
                          className={
                            uri.find((item) => item.key === uriSelected)?.value === '/' ? styles.disableInput : null
                          }
                        >
                          {menuList &&
                            menuList.length > 0 &&
                            menuList
                              .filter((item) => item.parent_id === 0)
                              .map((item) => <MenuItem value={item.id}>{item.name}</MenuItem>)}
                        </Select>
                      </FormControl>
                      {errors.parent && errors.parent.type === 'required' && (
                        <span role="alert" style={{ fontSize: '12px', color: 'red' }}>
                          This field is required
                        </span>
                      )}
                    </Grid>

                    <Grid item xs={2} display="flex" alignItems="center" justifyContent="start">
                      Uri
                    </Grid>
                    <Grid item xs={10} className="mb-3">
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Uri</InputLabel>
                        <Select
                          {...register('key', { required: true })}
                          id="demo-simple-select"
                          label="Uri"
                          onChange={(e) => handleSelect(e.target.value, setUriSelected, 'key', true)}
                          MenuProps={{
                            style: {
                              maxHeight: 400,
                            },
                          }}
                          value={uriSelected}
                        >
                          {uri &&
                            uri.length > 0 &&
                            uri.map((item) => <MenuItem value={item.key}>{item.name}</MenuItem>)}
                        </Select>
                      </FormControl>
                      {errors.key && errors.key.type === 'required' && (
                        <span role="alert" style={{ fontSize: '12px', color: 'red' }}>
                          This field is required
                        </span>
                      )}
                    </Grid>
                  </>
                )}

                <Grid item xs={2} display="flex" alignItems="center" justifyContent="start">
                  Icon
                </Grid>
                <Grid item xs={10}>
                  <div ref={ref}>
                    <input
                      id="icon"
                      onClick={() => setIsComponentVisible(true)}
                      className={styles.icon}
                      value={icon}
                      {...register('icon', { required: true })}
                      autoComplete="off"
                      onKeyPress={(e) => e.preventDefault()}
                    />
                    {errors.icon && errors.icon.type === 'required' && (
                      <span role="alert" style={{ fontSize: '12px', color: 'red' }}>
                        This field is required
                      </span>
                    )}
                    {isComponentVisible && (
                      <>
                        <div className={styles.triangle}></div>
                        <div className={styles.iconList}>
                          {material_icons.map((item, index) => (
                            <span
                              className="material-icons"
                              key={index}
                              onClick={() => handleSelect(item, setIcon, 'icon', true)}
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </Grid>

                <Grid item xs={2} display="flex" alignItems="center" justifyContent="start" sx={{ mt: 1.5 }}>
                  Name
                </Grid>
                <Grid item xs={12}>
                  <div className="list-group">
                    {languages &&
                      languages.map((item, index) => (
                        <li>
                          <input {...register(`translate.${index}.id`)} type="text" defaultValue={item.id} hidden />
                          <input
                            {...register(`translate.${index}.idLanguage`)}
                            type="text"
                            defaultValue={item.idLanguage}
                            hidden
                          />
                          <span>
                            <img src={item.icon} alt="icon" />
                            <label
                              for={`trans_${item.id}`}
                              className="form-label"
                              style={{ margin: '10px 0 10px 10px' }}
                            >
                              {item.name}
                            </label>
                          </span>
                          <input
                            id={`translate.${index}.name`}
                            {...register(`translate.${index}.name`, { required: true, maxLength: 30 })}
                            className="form-control"
                            type="text"
                            required
                            key={item.id}
                            style={{ padding: '5px 10px', height: '45px' }}
                          />
                          {errors && errors?.translate && errors?.translate[index]?.name?.type === 'required' && (
                            <span role="alert" style={{ fontSize: '12px', color: 'red' }}>
                              This field is required
                            </span>
                          )}
                        </li>
                      ))}
                  </div>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <div className="row no-gutters justify-content-end" style={{ paddingRight: '20px' }}>
            <Button type="button" variant="outline-danger" className="mr-2" onClick={() => onReset()}>
              Reset
            </Button>
            <Button type="submit" variant="primary" onClick={handleSubmit(fetchApiMenu)} className="float-right">
              {loading ? <Spinner style={{ width: '1.5rem', height: '1.5rem' }} className="mr-2" /> : 'Create'}
            </Button>
          </div>
        </div>
      </form>
    </Fragment>
  );
};

export default FormMenu;
