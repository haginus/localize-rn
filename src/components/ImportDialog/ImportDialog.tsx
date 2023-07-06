import * as React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { TranslationContext } from '../../context/TranslationContext';
import { MuiChipsInput } from 'mui-chips-input';
import { TranslationFile, Translations } from '../../lib/types';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

interface ImportDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

type ParsedFileData = 
  | { status: 'error' }
  | { status: 'success'; filename: string; file: TranslationFile; firstNamespace: string; languages: string[] }
  | null;

export default function ImportDialog({ open, setOpen }: ImportDialogProps) {

  const { setSourceLanguage, setTargetLanguages, setTranslationFile, setSelectedNamespace } = React.useContext(TranslationContext);
  const [_sourceLanguage, _setSourceLanguage] = React.useState<string>('');
  const [_targetLanguages, _setTargetLanguages] = React.useState<string[]>([]);
  const [parsedFileData, setParsedFileData] = React.useState<ParsedFileData>(null);

  React.useEffect(() => {
    if(open) {
      setParsedFileData(null);
      _setSourceLanguage('');
      _setTargetLanguages([]);
    }
  }, [open]);

  const handleClose = () => {
    setOpen(false);
  };

  const parseFile = async (file: File | undefined | null) => {
    if(!file) return;
    try {
      const fileText = await file.text();
      const parsedJSON = parseSomehow(fileText);
      const languages = Object.keys(parsedJSON);
      const firstNamespace = Object.keys(parsedJSON[languages[0]])[0];
      setParsedFileData({ status: 'success', filename: file.name, file: parsedJSON, firstNamespace, languages });
      _setTargetLanguages(languages.slice(1));
      _setSourceLanguage(languages[0]);
    } catch (error) {
      setParsedFileData({ status: 'error' });
      console.error(error);
    }
  }

  const parseSomehow = (json: string) => {
    try {
      return eval(json);
    } catch (error) {
      return JSON.parse(json);
    }
  }

  const importFile = () => {
    if(parsedFileData?.status !== 'success') return;
    setSourceLanguage(_sourceLanguage);
    setTargetLanguages(_targetLanguages);
    const mergedFile = { ...parsedFileData.file };
    mergeTranslations(mergedFile[_sourceLanguage], _targetLanguages.map(tl => mergedFile[tl]));
    setTranslationFile(mergedFile);
    setSourceLanguage(_sourceLanguage);
    setTargetLanguages(_targetLanguages);
    setSelectedNamespace(parsedFileData.firstNamespace);
    handleClose();
  }

  const mergeTranslations = (source: Translations, targets: Translations[]) => {
    Object.keys(source).forEach(key => {
      targets.forEach(target => {
        if(!target[key]) target[key] = typeof source[key] == 'string' ? '' : {};
        if(typeof source[key] == 'object') {
          // @ts-ignore
          mergeTranslations(source[key], targets.map(t => t[key]));
        }
      });
    });
  }

  const canImport = React.useMemo(() => {
    return parsedFileData?.status === 'success' && _sourceLanguage && _targetLanguages.length > 0 && !_targetLanguages.find(tl => tl === _sourceLanguage);
  }, [parsedFileData, _sourceLanguage, _targetLanguages]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Import translation file</DialogTitle>
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
            <Button variant="contained" component="label" sx={{ mb: 2 }}>
              {parsedFileData?.status == 'success' ? parsedFileData.filename : 'Select File' }
              <input type="file" hidden onChange={e=> parseFile(e.target.files?.[0])} />
            </Button>
          </div>
          <div>
            <FormControl fullWidth>
              <InputLabel>Source language</InputLabel>
              <Select
                value={_sourceLanguage}
                label="Source language"
                onChange={(e) => _setSourceLanguage(e.target.value as string)}
              >
                {parsedFileData?.status == 'success' && parsedFileData.languages.map(l => (
                  <MenuItem key={l} value={l}>{l}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div>
            <MuiChipsInput 
              value={_targetLanguages} 
              onChange={_setTargetLanguages} 
              fullWidth
              label="Target languages"
              placeholder=''
              helperText='Type and press enter'
              sx={{ minWidth: 500 }} />
            </div>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={importFile} disabled={!canImport}>Import</Button>
      </DialogActions>
    </Dialog>
  );
}