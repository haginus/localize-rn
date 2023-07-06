import React from 'react';
import './TranslatePage.scss';
import { TranslationContext } from '../../context/TranslationContext';
import { TranslateAccordion } from '../../components/TranslateAccordion/TranslateAccordion';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';

export const TranslatePage = () => {
  const {
    targetLanguages,
    selectedTargetLanguage,
    setSelectedTargetLanguage,
    selectedNamespace,
    setSelectedNamespace,
    translationFile,
  } = React.useContext(TranslationContext);

  return (
    <div className="translate-page">
      <Box sx={{ m: 2, display: 'flex', flexDirection: 'row', columnGap: 2 }}>
        <FormControl>
          <InputLabel>Target language</InputLabel>
          <Select
            value={selectedTargetLanguage}
            label="Target language"
            sx={{ minWidth: 200 }}
            onChange={(e) => setSelectedTargetLanguage(e.target.value as string)}
          >
            {targetLanguages.map(l => (
              <MenuItem key={l} value={l}>{l}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel>Selected namespace</InputLabel>
          <Select
            value={selectedNamespace}
            label="Selected namespace"
            sx={{ minWidth: 200 }}
            onChange={(e) => setSelectedNamespace(e.target.value as string)}
          >
            {Object.keys(translationFile[selectedTargetLanguage]).map(l => (
              <MenuItem key={l} value={l}>{l}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <TranslateAccordion translationPath='' />
    </div>
  )
};