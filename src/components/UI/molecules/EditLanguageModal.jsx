import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { Button, CustomInput } from '@blueupcode/components'
import { Language } from 'interfaces/Language'

const EditLanguageModal = ({title, show, data, onUpdate, cancelButtonText, updateButtonText}) => {
  const [visible, setVisible] = useState(show)

  useEffect(() => {
    setVisible(show)
  }, [show])

  return (
    <Modal show={visible}>
      {title && <Modal.Header>{title}</Modal.Header>}
      <Modal.Body>
      </Modal.Body>
      { data &&
      <div>
        <div className="mb-3 row">
          <label className="col-sm-2 col-form-label">ID</label>
          <div className="col-sm-10">
            <input type="text" 
              className="form-control-plaintext" 
              defaultValue={data.id}
            />
          </div>
        </div>
        {data.translate.map((element) => {
          <div className="mb-3 row">
            <label className="col-sm-2 col-form-label">{element.nameLanguage}
              <span>
                <img src={element.icon} alt={element.nameLanguage}></img>
              </span>
            </label>
            <div className="col-sm-10">
              <input type="text" 
                className="form-control-plaintext" 
                defaultValue={element.name}
                name={`lang_${element.id}_${element.idLanguage}`}
              />
            </div>
          </div>
        })}
        <div className="mb-3 row">
          <label className="col-sm-2 col-form-label">Code</label>
          <div className="col-sm-10">
            <input type="text" 
              className="form-control-plaintext" 
              defaultValue={data.code}
              name="code"
            />
          </div>
        </div>
        <div className="mb-3 row">
          <label className="col-sm-2 col-form-label">Icon</label>
          <div className="col-sm-10">
            <img src={data.icon} alt="icon"/>
          </div>
        </div>
        <div className="mb-3 row">
          <label className="col-sm-2 col-form-label">Culture</label>
          <div className="col-sm-10">
            <input type="text" 
              className="form-control-plaintext" 
              defaultValue={data.culture}
              name="culture"
            />
          </div>
        </div>
        <div className="mb-3 row">
          <label className="col-sm-2 col-form-label">Sort</label>
          <div className="col-sm-10">
            <input type="number"
              className="form-control-plaintext" 
              defaultValue={data.sort}
              name="sort"
            />
          </div>
        </div>
        <div className="mb-3 row">
          <label className="col-sm-2 col-form-label">Date Format</label>
          <div className="col-sm-10">
            <input type="text" 
              className="form-control-plaintext" 
              defaultValue={data.dateFormat}
              name="dateFormat"
            />
          </div>
        </div>
        <div className="mb-3 row">
          <label className="col-sm-2 col-form-label">Active</label>
          <div className="col-sm-10">
            <CustomInput
              type="switch"
              id="isActive"
              size="lg"
            ></CustomInput>
          </div>
        </div>
      </div>
      }
      <Modal.Footer>
        <Button 
          style={{
            height: 36,
            width: 75,
            margin: 8,
          }}
          onClick={() => setVisible(false)}
        >{cancelButtonText}</Button>

        <Button
          style={{
            height: 36,
            width: 75,
            margin: 8,
          }}
          onClick={onUpdate}
        >{updateButtonText}</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default EditLanguageModal
