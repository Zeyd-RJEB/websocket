import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
  maxHeight: '90vh',
  overflowY: 'auto', // Scrollable content
  bgcolor: 'background.paper', // Use theme background
  boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.3)',
  p: 4,
  borderRadius: '12px',
};

const buttonStyle = {
  mt: 3,
  display: 'block',
  ml: 'auto',
  fontSize: '0.9rem',
  padding: '8px 16px',
  color: '#1976d2',
  borderColor: '#1976d2',
  '&:hover': {
    backgroundColor: '#1976d2',
    color: 'white',
  },
};

const ModalWithAlternatingRows = ({ open, handleClose, rowData, fixFieldMap }) => {
  const filteredRowData = Object.fromEntries(
    Object.entries(rowData || {}).filter(
      ([key]) => key !== 'id' && key !== 'isValid'
    )
  );

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <Typography
          variant="h4"
          color="#DFFF00"
          component="h2"
          sx={{ fontWeight: 'bold', textAlign: 'center' }}
        >
          Message
        </Typography>

        {/* Spacer */}
        <Box sx={{ height: '50px' }} />

        <TableContainer>
          <Table>
            <TableBody>
              {Object.entries(filteredRowData || {}).map(([key, value], index) => {
                const fieldInfo = fixFieldMap[key] || {};
                const fieldName = fieldInfo.name || key;
                const displayValue = fieldInfo.enums?.[value] || value;

                return (
                  <TableRow
                    key={key}
                    sx={{
                      backgroundColor: index % 2 === 0 ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
                    }}
                  >
                    {/* Field Name */}
                    <TableCell
                      sx={{
                        fontWeight: 'bold',
                        padding: '12px 16px',
                      }}
                    >
                      {fieldName}
                    </TableCell>

                    {/* Field Value */}
                    <TableCell sx={{ padding: '12px 16px', color: "#d4efdf" }}>{displayValue}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <Button variant="outlined" sx={buttonStyle} onClick={handleClose}>
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default ModalWithAlternatingRows;
