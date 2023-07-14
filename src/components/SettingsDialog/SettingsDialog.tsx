import * as React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Typography } from '@mui/material';
import { TranslationContext } from '../../context/TranslationContext';

interface SettingsDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function SettingsDialog({ open, setOpen }: SettingsDialogProps) {

  const { translateApiKey, setTranslateApiKey  } = React.useContext(TranslationContext);
  const [_translateApiKey, _setTranslateApiKey] = React.useState<string>(translateApiKey);

  const handleClose = () => {
    setOpen(false);
  };

  const saveChanges = () => {
    setTranslateApiKey(_translateApiKey);
    handleClose();
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Settings</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1, width: '40ch' },
          }}
          noValidate
          autoComplete="off"
        >
          <div>
            <TextField
              label='Google Translate API Key'
              value={_translateApiKey}
              onChange={(e) => _setTranslateApiKey(e.target.value)}
              fullWidth
              helperText={
                <Typography variant='caption'>
                  <span>Used for auto translation. Get one from </span>
                  <a href='https://console.cloud.google.com/apis/credentials' target='_blank' rel='noreferrer'>Google Cloud Console.</a>
                </Typography>
              }
            />
          </div>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={saveChanges}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}