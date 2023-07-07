import React from 'react';
import './TranslateString.scoped.scss';
import { TextField, Typography, Box } from '@mui/material';
import { accessTanslations } from '../../lib/utils';
import { TranslationContext } from '../../context/TranslationContext';
import { debounce, set } from 'lodash';

interface TranslateStringProps {
  translationPath: string;
  sourceTranslation?: string;
  targetTranslation?: string;
}

export const TranslateString = ({ translationPath, sourceTranslation, targetTranslation }: TranslateStringProps) => {
  const { selectedNamespace, translationFile, selectedTargetLanguage, setTranslationFile } = React.useContext(TranslationContext);
  const stringName = React.useMemo(() => translationPath.split('.').pop()!, [translationPath]);

  const onChange = React.useCallback((value: string) => {
    const parentPath = translationPath.split('.').slice(0, -1).join('.');
    const newTranslationFile = { ...translationFile };
    const parent = accessTanslations(newTranslationFile[selectedTargetLanguage][selectedNamespace], parentPath);
    parent[stringName] = value;
    setTranslationFile(newTranslationFile);
  }, [stringName, translationPath, selectedNamespace, selectedTargetLanguage, translationFile]);


  const [value, setValue] = React.useState<string>(targetTranslation || '');

  const debouncedOnChange = React.useMemo(() => debounce(onChange, 500), [onChange]);

  React.useEffect(() => {
    setValue(targetTranslation || '');
  }, [selectedTargetLanguage, selectedNamespace]);

  return (
    <Box sx={{ mb: 2 }}>
      <TextField 
        label={stringName} 
        variant='outlined' 
        fullWidth
        value={value}
        inputProps={!value ? { style: { backgroundColor: '#FFF176' }} : undefined}
        onChange={(event) => {
          setValue(event.target.value);
          debouncedOnChange(event.target.value);
        }}
        helperText={(
          <Typography component={'span'}>
            <Typography variant='caption' component='span' fontWeight={500}>Source:</Typography>
            <Typography variant='caption' component='span'> {sourceTranslation}</Typography>
          </Typography>
        )} />
    </Box>
  );
};