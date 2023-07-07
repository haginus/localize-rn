import * as React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Typography } from '@mui/material';
import { TranslationContext } from '../../context/TranslationContext';

interface ExportDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function ExportDialog({ open, setOpen }: ExportDialogProps) {

  const { translationFile } = React.useContext(TranslationContext);

  const [filename, setFilename] = React.useState<string>('translations');
  const [extension, setExtension] = React.useState<'ts' | 'js' | 'json'>('json');

  const handleClose = () => {
    setOpen(false);
  };

  const canExport = React.useMemo(() => {
    return filename.length > 0;
  }, [filename]);

  const exportFile = () => {
    if(!canExport) return;
    let data = JSON.stringify(translationFile, null, 2);
    if(extension === 'ts') {
      data = `export default ${data}`;
    } else if(extension === 'js') {
      data = `module.exports = ${data}`;
    }
    const blob = new Blob([data], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `${filename}.${extension}`;
    link.href = url;
    link.click();
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Export translation file</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch' },
          }}
          noValidate
          autoComplete="off"
        >
          <div>
            <TextField
              label='Filename'
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              fullWidth
              helperText='Filename of the exported file'
            />
          </div>
          <div>
            <Typography variant='subtitle1'>Extension</Typography>
            <ToggleButtonGroup value={extension} exclusive onChange={(_, value) => value && setExtension(value)}>
              <ToggleButton value="ts">TS</ToggleButton>
              <ToggleButton value="js">JS</ToggleButton>
              <ToggleButton value="json">JSON</ToggleButton>
            </ToggleButtonGroup>
          </div>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={exportFile} disabled={!canExport}>Export</Button>
      </DialogActions>
    </Dialog>
  );
}