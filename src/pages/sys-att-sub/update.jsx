import { Container } from '@blueupcode/components';
import withAuth from 'components/auth/tokenWithAuth';
import withLayout from 'components/layout/withLayout';
import Head from 'next/head';

import { Button, Spinner } from '@blueupcode/components';
import { Switch } from '@material-ui/core';
import { swal } from 'components/swal/instance';
import { yupResolver } from 'components/validation/yupResolver';
import React, { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { sysAttSubApi } from 'services';
import { useSelector } from 'react-redux';
import * as yup from 'yup';
import { getSysAttSubList } from 'utils/label/';
import { useRouter } from 'next/dist/client/router';

const UpdateSysAttSubModal = () => {
    const router = useRouter();
    const [dataLabel, setDataLabel] = useState([]);
    const isSwitch = useSelector((state) => state.page.isQuickEdit);
    const [pageLoading, setPageLoading] = useState(false);

    const schema = yup.object().shape({
        code: yup.string().required(`Code can't empty`),
        id: yup.number().min(1, 'id must over than 1').required(`id can't not empty`),
        isEdit: yup.bool().required(`active can't not empty`),
        sysAttSub: yup.array().of(
            yup.object().shape({
                name: yup.string().required(`sysAttSub name can't empty`),
            })
        ),
    });

    const formOptions = { resolver: yupResolver(schema) };

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm(formOptions);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);

    const updateSysAttSub = async (formData) => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams(window.location.search);
            const res = await sysAttSubApi.editItemSysAttSub({
                id: formData.id,
                translate: formData.sysAttSub,
                is_edit: formData.isEdit,
                name: "1",
                id_sysatt_main: queryParams.get('sysAttMainId'),
                code: formData.code,
            });

            if (res.status == 200) {
                await swal.fire({ text: res.data.update, icon: 'success' });
                closeTab();
            } else {
                swal.fire({ text: 'network error', icon: 'error' });
            }
        } catch (e) {
            console.log(e);
            setLoading(false);
        }
        setLoading(false);
    };

    const closeTab = () => {
        router.back();
      };

    useEffect(() => {
        setPageLoading(true);
        async function getSysAttSubLabel() {
            try {
                let response = await sysAttSubApi.getSysAttSubLabel();
                if (response.status === 200) {
                    const sysAttSubLabel = getSysAttSubList(response.data.data);
                    setDataLabel(sysAttSubLabel);
                } else {
                    swal.fire({ text: response.statusText, icon: 'error' });
                }
            } catch (error) {
                swal.fire({ text: error.message, icon: 'error' });
            }
            setPageLoading(false);
        }
        getSysAttSubLabel();
    }, []);

    useEffect(() => {
        const loadData = async () => {
            const queryParams = new URLSearchParams(window.location.search);
            const id = queryParams.get('id');
            setLoading(true);
            try {
                const res = await sysAttSubApi.getItemSysAttSub(id);
                if (res?.data && res.data?.data) {
                    setData(res.data.data);
                }
            } catch (e) {
                console.log(e);
                const errorMessage = get(e, response.data.error);
                swal.fire({ text: errorMessage || 'An occur error', icon: 'error' });
                setLoading(false);
                setPopupUpdateSysAttSub(false);
            }
            setLoading(false);
        };
        loadData();
    }, []);

    return (
        <Fragment>
            <Head>
                <title>
                    {dataLabel.textTitleUpdate != undefined ? dataLabel.textTitleUpdate.name:''}
                </title>
            </Head>
            <Container fluid>
                {loading && (
                    <div class="spinner-border" role="status">
                        <span class="sr-only">Loading...</span>
                    </div>
                )}
                {data.id && dataLabel.sortCreate != undefined && (
                    <form onSubmit={handleSubmit(updateSysAttSub)}>
                        <div className="form-group">
                            <label for="id" className="form-label">
                                {dataLabel.idUpdate.name}
                            </label>
                            <input
                                id="id"
                                name="id"
                                {...register('id')}
                                type="text"
                                className="form-control"
                                defaultValue={data.id}
                                readOnly
                            />
                            {errors.id && (
                                <div style={{ display: 'block' }} className="invalid-feedback">
                                    {errors.id?.message}
                                </div>
                            )}
                        </div>
                        <div className="form-group">
                            <label className="form-label">Code</label>
                            <input {...register('code')} className="form-control" defaultValue={data.code} />
                            {errors.code && (
                                <div style={{ display: 'block' }} className="invalid-feedback">
                                    {errors.code?.message}
                                </div>
                            )}
                        </div>
                        <div className="form-group">
                            <label className="form-label">Translate</label>
                            <div
                                className="list-group"
                                style={{
                                    maxHeight: 240,
                                    overflowY: 'scroll',
                                    scrollbarWidth: 'thin',
                                }}
                            >
                                {data.translate &&
                                    data.translate.map((item, index) => (
                                        <li className="list-group-item">
                                            <input
                                                {...register(`sysAttSub.${index}.idLanguage`)}
                                                type="text"
                                                defaultValue={item.idLanguage}
                                                hidden
                                            />
                                            <span>
                                                <img src={item.languageIcon} alt="icon" />
                                                {'	'}
                                                <label for={`trans_${item.id}`} className="form-label">
                                                    {item.nameLanguage}
                                                </label>
                                            </span>
                                            <input
                                                id={`trans_${item.id}`}
                                                {...register(`sysAttSub.${index}.name`)}
                                                className="form-control"
                                                type="text"
                                                defaultValue={item.name}
                                                required
                                            />
                                            {errors && errors[`sysAttSub[${index}].name`] && (
                                                <div style={{ display: 'block' }} className="invalid-feedback">
                                                    {errors[`sysAttSub[${index}].name`]?.message}
                                                </div>
                                            )}
                                        </li>
                                    ))}
                            </div>
                        </div>
                        <div className="form-group">
                            <label for="isEdit" className="form-label">
                            {dataLabel.isEditDetail.name}
                            </label>
                            <Switch
                                id="isEdit"
                                {...register('isEdit')}
                                size="lg"
                                defaultChecked={data.isEdit}
                                color="primary"
                            />
                            {errors.isEdit && (
                                <div style={{ display: 'block' }} className="invalid-feedback">
                                    {errors.isEdit?.message}
                                </div>
                            )}
                        </div>
                        {/* Button action */}
                        <div className="form-group">
                            <Button className="mr-2" type="button" variant="outline-danger" onClick={closeTab}>
                                {dataLabel.btnBackUpdate?.name || 'Back'}
                            </Button>
                            <Button type="submit" variant="primary">
                                {loading && (
                                    <Spinner
                                        style={{
                                            width: '1.5rem',
                                            height: '1.5rem',
                                        }}
                                    />
                                )}
                                {dataLabel.btnSaveUpdate?.name}
                            </Button>
                        </div>
                    </form>
                )}
            </Container>
        </Fragment>
    );
};


export default withAuth(withLayout(UpdateSysAttSubModal));