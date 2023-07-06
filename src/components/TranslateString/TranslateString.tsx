import React from 'react';
import { TextField, Typography } from '@mui/material';
import { accessTanslations } from '../../lib/utils';
import { TranslationContext } from '../../context/TranslationContext';


interface TranslateStringProps {
  translationPath: string;
  sourceTranslation?: string;
  targetTranslation?: string;
}

export const TranslateString = ({ translationPath, sourceTranslation, targetTranslation }: TranslateStringProps) => {
  const { selectedNamespace, translationFile, selectedTargetLanguage, setTranslationFile } = React.useContext(TranslationContext);
  const stringName = React.useMemo(() => translationPath.split('.').pop()!, [translationPath]);

  const onChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const parentPath = translationPath.split('.').slice(0, -1).join('.');
    const newTranslationFile = { ...translationFile };
    const parent = accessTanslations(newTranslationFile[selectedTargetLanguage][selectedNamespace], parentPath);
    parent[stringName] = value;
    setTranslationFile(newTranslationFile);
  }, [stringName, translationPath, selectedNamespace, selectedTargetLanguage, translationFile]);

  return (
    <TextField 
      label={stringName} 
      variant='outlined' 
      fullWidth
      value={targetTranslation}
      onChange={onChange}
      helperText={(
        <Typography component={'span'}>
          <Typography variant='caption' component='span' fontWeight={500}>Source:</Typography>
          <Typography variant='caption' component='span'> {sourceTranslation}</Typography>
        </Typography>
      )} />
  );
};