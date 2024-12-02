import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import Form from './components/Form';
import CustomizedDataGrid from './components/CustomizedDataGrid';
import InfoMobile from './components/InfoMobile';
import AppTheme from '../shared-theme/AppTheme';
import Alert from '@mui/material/Alert';
import { SnackbarProvider, useSnackbar } from 'notistack';
import ColorModeIconDropdown from '../shared-theme/ColorModeIconDropdown';
import { rows } from './components/gridData';  // Adjust this import according to your grid data file

const parseFixSpecification = (xmlString) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "application/xml");
  const fields = xmlDoc.getElementsByTagName("field");
  const fieldMap = {};

  Array.from(fields).forEach((field) => {
    const tagNumber = field.getAttribute("number");
    const tagName = field.getAttribute("name");
    const enumValues = {};

    // Extract enum values, if present
    const values = field.getElementsByTagName("value");
    Array.from(values).forEach((value) => {
      const enumValue = value.getAttribute("enum");
      const description = value.getAttribute("description");
      enumValues[enumValue] = description;
    });

    fieldMap[tagNumber] = { name: tagName, enums: enumValues };
  });

  return fieldMap;
};

const parseFIXMessages = (input, fixFieldMap) => {
  const delimiter = input.includes('|') ? '|' : '\x01'; // Detect delimiter
  const messages = input.split(new RegExp(`(?=8=FIX.\\d\\.\\d)`)); // Split by FIX header
  const parsedResults = [];

  messages.forEach((message) => {
    const fields = message.split(delimiter);
    const parsedFields = {};
    let isValid = true;

    // Parse fields into key-value pairs
    fields.forEach((field) => {
      const [tag, value] = field.split('=');
      if (tag && value) {
        parsedFields[tag] = value;
      }
    });

    // Validate BodyLength (tag 9)
    if (parsedFields['9']) {
      const body = message.substring(message.indexOf('35='), message.lastIndexOf('10='));
      if (parseInt(parsedFields['9'], 10) !== body.length) {
        isValid = false;
      }
    }

    // Validate Checksum (tag 10)
    if (parsedFields['10']) {
      const expectedChecksum = calculateChecksum(message.substring(0, message.lastIndexOf('10=')));
      if (expectedChecksum !== parsedFields['10']) {
        isValid = false;
      }
    }

    parsedResults.push({
      rawMessage: message,
      parsedFields,
      isValid,
    });
  });

  return parsedResults.map((result) => {
    const { parsedFields, isValid } = result;

    const mappedFields = Object.fromEntries(
      Object.entries(parsedFields).map(([tag, value]) => {
        const fieldInfo = fixFieldMap[tag] || {};
        const fieldName = fieldInfo.name || `Tag ${tag}`;
        const enumValue = fieldInfo.enums?.[value] || value;
        return [fieldName, enumValue];
      })
    );

    return {
      id: parsedFields['11'] || Math.random(), // Use unique ID or ClOrdID (tag 11)
      ...mappedFields,
      isValid,
    };
  });
};

const calculateChecksum = (message) => {
  // Remove the checksum tag (e.g., 10=128) from the message, make it generic !
  const messageWithoutChecksum = message.replace(/10=\d{3}\|?$/, ''); // Remove last checksum tag
  const messageWithSOH = messageWithoutChecksum.replace(/\|/g, '\x01');
  // Calculate the sum of the ASCII values of all characters
  const sum = [...messageWithSOH].reduce((acc, char) => acc + char.charCodeAt(0), 0);

  // The checksum is the sum modulo 256, and it's padded to 3 digits
  return (sum % 256).toString().padStart(3, '0');
};

export default function Initiator(props) {
  const [fixMessage, setFixMessage] = React.useState('');
  const [fixFieldMap, setFixFieldMap] = React.useState({});
  const [gridRows, setGridRows] = React.useState(rows); // State to store the grid rows
  const { enqueueSnackbar } = useSnackbar();

  React.useEffect(() => {
    // Load FIX 4.4 XML specification
    fetch("/FIX44.xml")
      .then((response) => response.text())
      .then((xmlString) => setFixFieldMap(parseFixSpecification(xmlString)))
      .catch((error) => console.error("Error loading FIX spec:", error));
  }, []);

  const handleError = (error) => {
    enqueueSnackbar(error, { variant: 'error' });
  };

  const handleFixMessageUpdate = (message) => {
    const parsedMessages = parseFIXMessages(message, fixFieldMap);
    setFixMessage(message);
    setGridRows(parsedMessages.filter((msg) => msg.isValid)); // Only show valid messages
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <Box sx={{ position: 'fixed', top: '1rem', right: '1rem' }}>
        <ColorModeIconDropdown />
      </Box>

      <Grid
        container
        sx={{
          height: {
            xs: '100%',
            sm: 'calc(100dvh - var(--template-frame-height, 0px))',
          },
          mt: {
            xs: 4,
            sm: 0,
          },
        }}
      >
        <Grid
          size={{ sm: 12, md: 4, lg: 5 }}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            maxWidth: '100%',
            width: '100%',
            backgroundColor: { xs: 'transparent', sm: 'background.default' },
            alignItems: 'start',
            pt: { xs: 0, sm: 16 },
            px: { xs: 2, sm: 10 },
            gap: { xs: 4, md: 8 },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: { sm: 'space-between', md: 'flex-end' },
              alignItems: 'center',
              width: '100%',
              maxWidth: { sm: '100%', md: 600 },
            }}
          >
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                flexGrow: 1,
              }}
            >
              <Stepper
                id="desktop-stepper"
                sx={{ width: '100%', height: 40 }}
              >
                <Step
                  sx={{ ':first-child': { pl: 0 }, ':last-child': { pr: 0 } }}
                >
                  <StepLabel >
                    <Typography
                      variant="h4"
                      sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: 'center',
                      }}
                    >
                      <Typography
                        component="span"
                        variant="h4"
                        sx={(theme) => ({
                          fontSize: 'inherit',
                          color: 'primary.main',
                          ...theme.applyStyles('dark', {
                            color: 'primary.light',
                          }),
                        })}
                      >
                        FIX
                      </Typography>
                      &nbsp;Initiator&nbsp;& Parser&nbsp;
                    </Typography></StepLabel>
                </Step>
              </Stepper>
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              width: '100%',
              maxWidth: { sm: '100%', md: 600 },
              maxHeight: '720px',
              gap: { xs: 5, md: 'none' },
            }}
          >
            <React.Fragment>
              <Form
                fixMessage={fixMessage}
                onFixMessageUpdate={handleFixMessageUpdate}
              />
            </React.Fragment>
          </Box>
        </Grid>
        <Grid
          size={{ xs: 12, sm: 8, lg: 7 }}
          sx={{
            display: 'inline-flex',
            flexDirection: 'column',
            maxWidth: '100%',
            width: '100%',
            backgroundColor: 'background.paper',
            alignItems: 'start',
            pt: { xs: 0, sm: 16 },
            pb: { xs: 0, sm: 16 }, // Added padding at the bottom
            px: { xs: 2, sm: 10 },
            gap: { xs: 4, md: 8 },
          }}
        >
          <CustomizedDataGrid rows={gridRows} fixSpec={fixFieldMap} />
        </Grid>
      </Grid>
    </AppTheme>
  );
}

