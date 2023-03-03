import Box from '@mui/material/Box';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import { visuallyHidden } from '@mui/utils';
import { ChangeLabel } from 'components/UI/features';
import * as React from 'react';
import { useSelector } from 'react-redux';

function TableHeader(props) {
  const { order, orderBy, setOrder, setOrderBy, columns, languageLabel } = props;
  const isSwitch = useSelector((state) => state.page.isQuickEdit);

  const createSortHandler = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  return (
    <TableHead>
      <TableRow>
        {columns.map(
          (headCell) =>
            headCell.visibility && (
              <TableCell
                key={headCell.key}
                align="left"
                sortDirection={orderBy === headCell.key ? order : false}
                style={{ fontSize: '15px', fontWeight: 'bold' }}
              >
                {isSwitch ? (
                  <ChangeLabel label={languageLabel[headCell.label]} />
                ) : headCell.sortable ? (
                  <TableSortLabel
                    active={orderBy === headCell.key}
                    direction={orderBy === headCell.key ? order : 'asc'}
                    onClick={() => createSortHandler(headCell.key)}
                    hideSortIcon={headCell.sortable}
                  >
                    <ChangeLabel label={languageLabel[headCell.label]} />
                    {orderBy === headCell.key ? (
                      <Box component="span" sx={visuallyHidden}>
                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                      </Box>
                    ) : null}
                  </TableSortLabel>
                ) : (
                  languageLabel[headCell.label].name
                )}
              </TableCell>
            )
        )}
      </TableRow>
    </TableHead>
  );
}

export default TableHeader;
