import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import styles from 'styles/pages/permission.module.scss';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

export default function MultipleSelectCheckmarks(props) {
  const { label, options, setOptions, setSelected } = props;

  const handleChange = (item) => {
    function checkSelected(ele) {
      return ele.selected === true;
    }
    // click check box ALL
    if (item.id === 0) {
      if (options.every(checkSelected)) {
        // if all items selected is true => switch all to false
        setOptions(
          options.map((e) => {
            return { ...e, selected: false };
          })
        );
      } else {
        // if exist 1 items selected is false => switch all to true
        setOptions(
          options.map((e) => {
            return { ...e, selected: true };
          })
        );
      }
    } else {
      const selected = item.selected;
      // if current selected current is true and the others is true => switch id = 0, id current to false
      if (selected && options.every(checkSelected)) {
        setOptions(
          options.map((e) => {
            return { ...e, selected: e.id === 0 || e.id === item.id ? false : true };
          })
        );
        // if current selected current is false and the others is false => switch all items to selected equals true
      } else if (!selected && [...options].filter((e) => e.id !== 0 && e.id !== item.id).every(checkSelected)) {
        setOptions(
          options.map((e) => {
            return { ...e, selected: true };
          })
        );
      } else {
        setOptions(
          options.map((e) => {
            return { ...e, selected: e.id === item.id ? !e.selected : e.selected };
          })
        );
      }
    }
  };

  return (
    <>
      <FormControl sx={{ ml: 1, mr: 1, width: 300 }}>
        <InputLabel className={styles.text} id="demo-multiple-checkbox-label">
          {label}
        </InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          onClose={() => setSelected(options.filter((e) => e.id !== 0 && e.selected === true))}
          value={options.reduce((prev, current) => {
            const newArr = prev;
            if (current.name !== 'All' && current.selected === true) {
              newArr.push(current.name);
            }
            return newArr;
          }, [])}
          // onChange={handleChange}
          input={<OutlinedInput label="Permission" />}
          renderValue={(selected) => selected.join(', ')}
          className={styles.dropdownSelectMultiple}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: ITEM_HEIGHT * 4 + ITEM_PADDING_TOP,
              },
            },
            classes: { paper: styles.dropdownOptions },
            variant: 'menu',
          }}
        >
          {options &&
            options.length > 0 &&
            options.map((item, index) => (
              <MenuItem key={index} value={item.name} onClick={() => handleChange(item)}>
                <Checkbox className={styles.Checkbox} checked={item.selected} />
                <ListItemText className={styles.text} primary={item.name} />
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </>
  );
}
