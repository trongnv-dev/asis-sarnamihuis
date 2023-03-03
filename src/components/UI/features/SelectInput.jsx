import { borderRadius } from '@mui/system';
import Select from 'react-select';

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    borderBottom: '1px dotted pink',
    color: state.isSelected ? 'white' : 'blue',
  }),
  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.95 : 1;
    const transition = 'opacity 300ms';
    return { ...provided, opacity, transition };
  },
};

const SelectInput = (props) => {
  const { options, onChange, defaultValue, value, isDisabled, menuPlacement } = props;
  return (
    <>
      <Select
        menuPlacement= {menuPlacement??"top"}
        styles={customStyles}
        options={options}
        onChange={onChange}
        value={value}
        defaultValue={defaultValue}
        isDisabled={isDisabled}
      />
    </>
  );
};

export default SelectInput;
