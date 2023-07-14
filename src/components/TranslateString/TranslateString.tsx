import React from 'react';
import './TranslateString.scoped.scss';
import { TextField, Typography, Box, IconButton, CircularProgress } from '@mui/material';
import { Translate as TranslateIcon } from '@mui/icons-material';
import { accessTanslations } from '../../lib/utils';
import { TranslationContext } from '../../context/TranslationContext';
import { debounce } from 'lodash';
import { translateText } from '../../lib/translate';
import { useSnackbar } from 'notistack';

interface TranslateStringProps {
  translationPath: string;
  sourceTranslation?: string;
  targetTranslation?: string;
}

export const TranslateString = ({ translationPath, sourceTranslation, targetTranslation }: TranslateStringProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const { selectedNamespace, translationFile, selectedTargetLanguage, setTranslationFile, translateApiKey, sourceLanguage } = React.useContext(TranslationContext);
  const stringName = React.useMemo(() => translationPath.split('.').pop()!, [translationPath]);

  const onChange = React.useCallback((value: string) => {
    const parentPath = translationPath.split('.').slice(0, -1).join('.');
    const newTranslationFile = { ...translationFile };
    const parent = accessTanslations(newTranslationFile[selectedTargetLanguage][selectedNamespace], parentPath);
    parent[stringName] = value;
    setTranslationFile(newTranslationFile);
  }, [stringName, translationPath, selectedNamespace, selectedTargetLanguage, translationFile]);


  const [value, setValue] = React.useState<string>(targetTranslation || '');
  const [loading, setLoading] = React.useState<boolean>(false);

  const debouncedOnChange = React.useMemo(() => debounce(onChange, 500), [onChange]);

  React.useEffect(() => {
    setValue(targetTranslation || '');
  }, [selectedTargetLanguage, selectedNamespace]);

  const canAutoTranslate = React.useMemo(() => {
    return !!sourceTranslation && !!selectedTargetLanguage && !!translateApiKey;
  }, [sourceTranslation, selectedTargetLanguage, translateApiKey]);

  const autoTranslate = async () => {
    try {
      setLoading(true);
      const translatedText = await translateText(sourceTranslation!, sourceLanguage, selectedTargetLanguage, translateApiKey);
      setValue(translatedText);
      onChange(translatedText);
    } catch (error) {
      enqueueSnackbar(`${error}`, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  } 

  return (
    <Box sx={{ mb: 2 }}>
      <TextField 
        label={stringName} 
        variant='outlined' 
        fullWidth
        value={value}
        className={!value ? 'highlight' : undefined}
        onChange={(event) => {
          setValue(event.target.value);
          debouncedOnChange(event.target.value);
        }}
        InputProps={{
          endAdornment: loading ? (
            <CircularProgress />
          ) : canAutoTranslate ? (
            <IconButton onClick={autoTranslate}>
              <TranslateIcon />
            </IconButton>
          ) : undefined,
        }}
        helperText={(
          <Typography component={'span'}>
            <Typography variant='caption' component='span' fontWeight={500}>Source: </Typography>
            <Typography variant='caption' component='span' sx={{ fontStyle: !!sourceTranslation ? 'initial' : 'italic' }}>
              {sourceTranslation || 'No source translation.'}
            </Typography>
          </Typography>
        )} />
    </Box>
  );
};