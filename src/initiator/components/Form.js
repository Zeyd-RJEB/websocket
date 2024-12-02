import React, { useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import FormLabel from '@mui/material/FormLabel';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid2';
import OutlinedInput from '@mui/material/OutlinedInput';
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded';
import InputLabel from '@mui/material/InputLabel';
import { styled } from '@mui/system';
import { visuallyHidden } from '@mui/utils';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { SnackbarProvider, useSnackbar } from 'notistack';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

export default function Form({ fixMessage, onFixMessageUpdate }) {
  const [websocket, setWebsocket] = React.useState(null);
  const [connectionStatus, setConnectionStatus] = React.useState("Disconnected");
  const [isConnected, setIsConnected] = React.useState(false); // Track the connection state
  const [localMessage, setLocalMessage] = useState(fixMessage);
  const { enqueueSnackbar } = useSnackbar();

  const handleFileChange = (event) => {
    const files = event.target.files;

    if (files && files.length > 0) {
      const promises = Array.from(files).map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();

          reader.onload = () => resolve(reader.result); // Resolve with file content
          reader.onerror = () => reject(`Error reading file: ${file.name}`);
          reader.readAsText(file); // Read file as text
        });
      });

      // Wait for all files to be read
      Promise.all(promises)
        .then((fileContents) => {
          const updatedMessage = localMessage + fileContents.join(""); // Combine all file contents
          setLocalMessage(updatedMessage); // Update local state
          onFixMessageUpdate(updatedMessage); // Notify parent of the update
        })
        .catch((error) => {
          console.error(error);
          enqueueSnackbar(error, { variant: "error" }); // Show error notification
        });
    }
  };

  const handleConnectDisconnect = () => {
    if (isConnected) {
      // Disconnect
      websocket.close();
      setConnectionStatus("Disconnected");
      setIsConnected(false);
    } else {
      // Connect
      const url = document.getElementById("address").value || "ws://localhost:8444";
      const ws = new WebSocket(url);

      ws.onopen = () => {
        setConnectionStatus("Connected");
        setIsConnected(true);
      };
      ws.onclose = (event) => {
        setConnectionStatus("Disconnected");
        setIsConnected(false);
        console.warn(`[WebSocket] Connection closed. Code: ${event.code}, Reason: ${event.reason}`);

        switch (event.code) {
          case 1000:
            enqueueSnackbar("Connection closed gracefully by the server.", { variant: 'info' });
            break;
          case 1001:
            enqueueSnackbar("Connection closed: Server went offline unexpectedly.", { variant: 'error' });
            break;
          case 1006:
            enqueueSnackbar("Connection failed: Server unreachable.", { variant: 'error' });
            break;
          case 1011:
            enqueueSnackbar("Server error: The server encountered an internal issue.", { variant: 'error' });
            break;
          default:
            break;
        }
      };
      ws.onerror = (error) => {
        setConnectionStatus("Error");
        setIsConnected(false);
      };
      ws.onmessage = (message) => console.log("Received:", message.data);

      setWebsocket(ws);
    }
  };

  setInterval(() => {
    if (websocket && websocket.readyState === WebSocket.OPEN) {
      websocket.send(JSON.stringify({ type: "ping" }));
    }
  }, 30000); // Send every 30 seconds


  const handleSend = () => {
    if (websocket && websocket.readyState === WebSocket.OPEN) {
      if (localMessage && localMessage.trim() !== '') {
        try {
          onFixMessageUpdate(localMessage);
          websocket.send(localMessage);
          console.log('Message sent:', localMessage);
          enqueueSnackbar('Message sent successfully.', { variant: 'success' });
        } catch (error) {
          console.error('Error sending message:', error);
          enqueueSnackbar('Failed to send message. Check the console for details.', { variant: 'error' });
        }
      } else {
        enqueueSnackbar('FIX message is empty or invalid.', { variant: 'error' });
      }
    } else {
      enqueueSnackbar('WebSocket is not connected.', { variant: 'error' });
    }
  };


  return (
    <Grid container spacing={5}>
      <Stack>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          useFlexGap
          sx={{ flexGrow: 1 }} size={{ xs: 12 }}
        >
          <InputLabel htmlFor="address" sx={visuallyHidden}>
            Url
          </InputLabel>
          <TextField
            id="address"
            hiddenLabel
            size="small"
            variant="outlined"
            aria-label="Remote address"
            placeholder="ws://localhost:8444"
            fullWidth
            slotProps={{
              htmlInput: {
                autoComplete: 'off',
                'aria-label': 'Enter your remote address',
              },
            }}
          />
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            sx={{ marginRight: 15, minWidth: "fit-content" }}
            onClick={handleConnectDisconnect}
          >
            {isConnected ? "Disconnect" : "Connect"}
          </Button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3' }}>
            <ConstructionRoundedIcon />
            <span>status:</span><Typography>&nbsp;</Typography>
            <Chip
              variant="text"
              size="medium"
              color={
                connectionStatus === "Connected"
                  ? "success"
                  : connectionStatus === "Disconnected"
                    ? "error"
                    : "default"
              }
              label={connectionStatus}
            />
          </div>

        </Stack>
      </Stack>
      <Stack>
        <Button
          component="label"
          role={undefined}
          color="secondary"
          variant="outlined"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
        >
          Upload files
          <VisuallyHiddenInput
            type="file"
            onChange={handleFileChange}
            multiple
          />
        </Button>
      </Stack>
      <FormGrid sx={{ flexGrow: 1 }} size={{ xs: 12 }}>
        <FormLabel htmlFor="message">
          FIX Message
        </FormLabel>
        <OutlinedInput
          id="message"
          name="message"
          type="message"
          autoComplete="off"
          placeholder="8=FIX.4.4|9=77|35=8|...|10=234|"
          size="large"
          multiline
          rows={10} // Set the initial height to 10 rows
          style={{
            resize: 'vertical', // Allow vertical resizing
            overflowY: 'auto', // Enable vertical scrolling
            width: '100%',
            padding: '10px',
            boxSizing: 'border-box',
          }}
          inputProps={{
            style: {
              textAlign: 'left', // Align text to the left
              color: 'grey',
              lineHeight: '1.5', // Match placeholder line height to content
              fontSize: '11px', // Match font size of placeholder to content
            },
          }}
          sx={{
            '&::placeholder': {
              textAlign: 'left', // Align placeholder text to the left
              whiteSpace: 'pre-wrap', // Allow multiline placeholder text
            },
          }}
          value={localMessage} // Use the local state for the input field
          onChange={(e) => setLocalMessage(e.target.value)} // Update the local state on change
        />
      </FormGrid>

      <Box
        sx={[
          {
            display: 'flex',
            flexDirection: { xs: 'column-reverse', sm: 'row' },
            alignItems: 'end',
            flexGrow: 1,
            gap: 1,
            pb: { xs: 12, sm: 0 },
            mt: { xs: 2, sm: 0 },
            mb: '60px',
          },
          { justifyContent: 'flex-end' },

        ]}
      >
      </Box>
      <Button
        variant="outlined"
        endIcon={<ChevronRightRoundedIcon />}
        onClick={handleSend}
        sx={{ width: { xs: '100%', sm: 'fit-content' } }}
      >
        {'Submit'}
      </Button>
    </Grid>
  );
}
