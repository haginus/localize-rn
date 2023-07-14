import * as React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { TranslationContext } from '../../context/TranslationContext';
import { MuiChipsInput } from 'mui-chips-input';
import { LanguageCode, TranslationFile, Translations } from '../../lib/types';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { jsonrepair } from 'jsonrepair'
import { Typography } from '@mui/material';
import i18n from '../../lib/i18n';

interface ImportDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

type ParsedFileData = 
  | { status: 'error' }
  | { status: 'success'; filename: string; file: TranslationFile; firstNamespace: string; languages: string[] }
  | null;

export default function ImportDialog({ open, setOpen }: ImportDialogProps) {

  const { 
    setSourceLanguage, 
    setTargetLanguages,
    setTranslationFile, 
    setSelectedNamespace,
    setSelectedTargetLanguage,
  } = React.useContext(TranslationContext);
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
    const regex = /.*?(?<obj>{(.|\n)*})/gm;
    const match = regex.exec(json)?.groups?.obj;
    if(!match) throw new Error('Could not parse file');
    const repaired = jsonrepair(match);
    return JSON.parse(repaired);
  }

  const importFile = () => {
    if(parsedFileData?.status !== 'success') return;
    setSourceLanguage(_sourceLanguage);
    setTargetLanguages(_targetLanguages);
    const mergedFile = mergeTranslations(parsedFileData.file, _sourceLanguage, _targetLanguages);
    setTranslationFile(mergedFile);
    setSourceLanguage(_sourceLanguage);
    setTargetLanguages(_targetLanguages);
    setSelectedTargetLanguage(_targetLanguages[0]);
    setSelectedNamespace(parsedFileData.firstNamespace);
    handleClose();
  }

  const mergeTranslations = (file: TranslationFile, sourceCode: LanguageCode, targetCodes: LanguageCode[]) => {

    function getKeysMetadata(source: Translations, pluralSuffixes: string[]) {
      return Object.keys(source).map(key => {
        const pluralKeyIndex = pluralSuffixes.findIndex(suffix => key.endsWith(suffix));
        const isPlural = pluralKeyIndex !== -1;
        const keyWithoutPluralSuffix = isPlural ? key.slice(0, -pluralSuffixes[pluralKeyIndex].length) : key;
        return { originalKey: key, isPlural, keyWithoutPluralSuffix };
      });
    }
    function mergeTarget(source: Translations, target: Translations, options: MergeTargetOptions) {
      const sourceKeysMetadata = getKeysMetadata(source, options.sourcePluralSuffixes);
      const uniqueSourceKeys = sourceKeysMetadata.reduce((acc, keyMeta) => {
        acc[keyMeta.keyWithoutPluralSuffix] = keyMeta;
        return acc;
      }, {} as Record<string, typeof sourceKeysMetadata[number]>);
      Object.entries(uniqueSourceKeys).forEach(([key, metadata]) => {
        if(metadata.isPlural) {
          options.targetPluralSuffixes.forEach(suffix => {
            const targetKey = key + suffix;
            if(!target[targetKey]) target[targetKey] = '';
          });
        } else {
          if(!target[key]) target[key] = typeof source[key] == 'string' ? '' : {};
          if(typeof source[key] == 'object') {
            mergeTarget(source[key] as any, target[key] as any, options);
          }
        }
      });
      // Remove dangling keys
      const targetKeysMetadata = getKeysMetadata(target, options.targetPluralSuffixes);
      targetKeysMetadata.forEach(keyMeta => {
        if(!uniqueSourceKeys[keyMeta.keyWithoutPluralSuffix]) {
          delete target[keyMeta.originalKey];
        }
        if(uniqueSourceKeys[keyMeta.keyWithoutPluralSuffix]?.isPlural && keyMeta.originalKey == keyMeta.keyWithoutPluralSuffix) {
          delete target[keyMeta.originalKey];
        }
      });
    }
    const mergedFile = { ...file };
    targetCodes.forEach(tl => {
      if(!mergedFile[tl]) mergedFile[tl] = {};
    });
    const sourcePluralSuffixes = i18n.services.pluralResolver.getSuffixes(sourceCode);
    targetCodes.forEach(targetCode => {
      const targetPluralSuffixes = i18n.services.pluralResolver.getSuffixes(targetCode);
      mergeTarget(mergedFile[sourceCode], mergedFile[targetCode], { sourcePluralSuffixes, targetPluralSuffixes });
    });
    console.log(mergedFile)
    return mergedFile;
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
            <Button variant="contained" component="label">
              {parsedFileData?.status == 'success' ? parsedFileData.filename : 'Select File' }
              <input type="file" hidden onChange={e=> parseFile(e.target.files?.[0])} />
            </Button>
          </div>
          {parsedFileData?.status == 'error' && (
            <Typography color="error" sx={{ mt: 1 }}>Could not parse file</Typography>
          )}
          <div>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Source language</InputLabel>
              <Select
                disabled={!parsedFileData || parsedFileData.status !== 'success'}
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
              disabled={!parsedFileData || parsedFileData.status !== 'success'}
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

interface MergeTargetOptions {
  sourcePluralSuffixes: string[];
  targetPluralSuffixes: string[];
}