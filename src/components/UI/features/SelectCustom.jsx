import React, { MouseEventHandler, useState } from "react";
import FontAwesomeSvgIcon from 'components/UI/atoms/FontAwesomeSvgIcon';
import { Button } from '@blueupcode/components';
import Select, {
  components
} from "react-select";
import { faPlus, faMinus, faInfo, faRecycle } from '@fortawesome/free-solid-svg-icons';
const Control = ({ children, ...props }) => {
  const { onCreate, onRefresh, onDetail } = props.selectProps;
  return (
    <components.Control {...props}>
      {children[0]}
      <span/>
      <div>
        <Button variant="outline-primary" onClick={()=>onCreate()}>
          <FontAwesomeSvgIcon icon={faPlus} />
        </Button>
        {children[0].props.hasValue && <Button variant="outline-primary" onClick={() => onDetail()}>
          <FontAwesomeSvgIcon icon={faInfo} />
        </Button>}
        <Button variant="outline-primary" onClick={() => onRefresh()}>
          <FontAwesomeSvgIcon icon={faRecycle} />
        </Button>
      </div>
      {children[1]}
    </components.Control>
  );
};

const CustomSelectProps = (props) => {

  const styles = {
    control: (css) => ({ ...css, paddingLeft: "1rem" })
  };

  const { options, onChange, defaultValue, value, onCreate, onRefresh, onDetail } = props;
  return (
    <>
      <Select
        styles={styles}
        options={options}
        onChange={onChange}
        value={value}
        defaultValue= {defaultValue}
        components={{ Control }}
        onCreate={onCreate}
        onRefresh = {onRefresh}
        onDetail = {onDetail}
      />
    </>
  );
};

export default CustomSelectProps;
