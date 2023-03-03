import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import styles from 'styles/pages/permission.module.scss';
import { alpha, styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import Box from '@mui/material/Box';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { OutlinedInputProps } from '@mui/material/OutlinedInput';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

const CssTextField = styled(TextField)({
  width: '200px',
  height: '70px',
  '& label': {
    marginLeft: '10px',
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.87)',
  },
  '& label.Mui-focused': {
    // color: 'green',
    marginLeft: '10px',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: 'green',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      padding: '18px',
      // borderColor: 'red',
    },
    '&:hover fieldset': {
      // borderColor: 'yellow',
    },
    '&.Mui-focused fieldset': {
      padding: '18px',
      // borderColor: 'green',
    },
    '& input': {
      padding: '18px',
      paddingRight: '45px',
      fontSize: 14,
      // borderColor: 'red',
    },
  },
});
export default function Search(props) {
  const { keyword, setKeyword } = props;

  return (
    <div style={{ position: 'relative' }}>
      <CssTextField
        label="Search"
        placeholder="Search By Code or Name"
        id="custom-css-outlined-input"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        autoComplete="off"
      />
      {keyword && (
        <div
          style={{ position: 'absolute', top: '22%', right: '10%', cursor: 'pointer' }}
          onClick={() => setKeyword('')}
        >
          <HighlightOffIcon />
        </div>
      )}
    </div>
  );
}
