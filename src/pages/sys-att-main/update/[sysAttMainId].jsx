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
import { sysAttMainApi } from 'services';
import { useSelector } from 'react-redux';
import * as yup from 'yup';
import { getSysAttMainList } from 'utils/label/';
import { useRouter } from 'next/dist/client/router';


const UpdateSysAttMainModal = () => {
    const [dataLabel, setDataLabel] = useState([]);
    const [pageLoading, setPageLoading] = useState(false);

    const schema = yup.object().shape({
        code: yup.string().required(`Code can't empty`),
        id: yup.number().min(1, 'id must over than 1').required(`id can't not empty`),
        isEdit: yup.bool().required(`active can't not empty`),
        sysAttMain: yup.array().of(
            yup.object().shape({
                name: yup.string().required(`sysAttMain name can't empty`),
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
    const router = useRouter();
    const { sysAttMainId } = router.query;

    const updateSysAttMain = async (formData) => {
        setLoading(true);
        try {
            const res = await sysAttMainApi.editItemSysAttMain({
                id: formData.id,
                translate: formData.sysAttMain,
                is_edit: formData.isEdit,
                name: "1",
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
        async function getSysAttMainLabel() {
            try {
                let response = await sysAttMainApi.getSysAttMainLabel();
                if (response.status === 200) {
                    const sysAttMainLabel = getSysAttMainList(response.data.data);
                    setDataLabel(sysAttMainLabel);
                } else {
                    swal.fire({ text: response.statusText, icon: 'error' });
                }
            } catch (error) {
                swal.fire({ text: error.message, icon: 'error' });
            }
            setPageLoading(false);
        }
        getSysAttMainLabel();
    }, []);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const res = await sysAttMainApi.getItemSysAttMain(sysAttMainId);
                if (res?.data && res.data?.data) {
                    setData(res.data.data);
                }
            } catch (e) {
                console.log(e);
                const errorMessage = get(e, response.data.error);
                swal.fire({ text: errorMessage || 'An occur error', icon: 'error' });
                setLoading(false);
                setPopupUpdateSysAttMain(false);
            }
            setLoading(false);
        };
        loadData();
    }, []);

    return (
        <Fragment>
            <Head>
                <title>
                    {dataLabel.textTitleUpdate != undefined ? dataLabel.textTitleUpdate.name : ''}
                </title>
            </Head>
            <Container fluid>
                {loading && (
                    <div class="spinner-border" role="status">
                        <span class="sr-only">Loading...</span>
                    </div>
                )}
                {data.id && dataLabel.sortCreate != undefined && (
                    <form onSubmit={handleSubmit(updateSysAttMain)}>
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
                            <label className="form-label">{dataLabel.codeUpdate.name}</label>
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
                                                {...register(`sysAttMain.${index}.idLanguage`)}
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
                                                {...register(`sysAttMain.${index}.name`)}
                                                className="form-control"
                                                type="text"
                                                defaultValue={item.name}
                                                required
                                            />
                                            {errors && errors[`sysAttMain[${index}].name`] && (
                                                <div style={{ display: 'block' }} className="invalid-feedback">
                                                    {errors[`sysAttMain[${index}].name`]?.message}
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


export default withAuth(withLayout(UpdateSysAttMainModal));