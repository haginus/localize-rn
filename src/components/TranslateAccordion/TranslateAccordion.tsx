import React from 'react';

import { Accordion, AccordionSummary, AccordionDetails, Typography, Box } from '@mui/material';
import { TranslationContext } from '../../context/TranslationContext';
import { LanguageCode } from '../../lib/types';
import { accessTanslations } from '../../lib/utils';
import { TranslateString } from '../TranslateString/TranslateString';

interface Stats {
  total: number;
  translated: number;
  untranslated: number;
}

interface NestedStats {
  [key: string]: Stats;
}

interface TranslateAccordionProps {
  translationPath: string;
  onStats?: (stats: Stats) => void;
}

export const TranslateAccordion = ({ translationPath, onStats }: TranslateAccordionProps) => {
  const { selectedNamespace, translationFile, sourceLanguage, selectedTargetLanguage } = React.useContext(TranslationContext);
  const [nestedStats, setNestedStats] = React.useState<NestedStats>({ });

  const getTranslationObject = React.useCallback((language: LanguageCode) => {
    return accessTanslations(translationFile[language][selectedNamespace], translationPath);
  }, [translationPath, selectedNamespace, translationFile]);

  const sourceTranslationObject = React.useMemo(() => getTranslationObject(sourceLanguage), [sourceLanguage, getTranslationObject]);
  const targetTranslationObject = React.useMemo(() => getTranslationObject(selectedTargetLanguage), [selectedTargetLanguage, getTranslationObject]);

  const nests = React.useMemo(() => (
    Object.keys(sourceTranslationObject).filter(key => typeof sourceTranslationObject[key] === 'object')
  ), [sourceTranslationObject]);

  const strings = React.useMemo(() => (
    Object.keys(sourceTranslationObject).filter(key => typeof sourceTranslationObject[key] === 'string')
  ), [sourceTranslationObject]);

  const nestedStatsTotal = React.useMemo(() => {
    return Object.values(nestedStats).reduce<Stats>((acc, stats) => ({
      total: acc.total + stats.total,
      translated: acc.translated + stats.translated,
      untranslated: acc.untranslated + stats.untranslated,
    }), { total: 0, translated: 0, untranslated: 0 });
  }, [nestedStats]);

  const stats = React.useMemo(() => {
    const total = strings.length + nestedStatsTotal.total;
    const translated = strings.filter(key => targetTranslationObject[key] !== '').length + nestedStatsTotal.translated;
    const untranslated = total - translated;
    return { total, translated, untranslated };
  }, [strings, nestedStatsTotal, targetTranslationObject]);

  React.useEffect(() => {
    onStats?.(stats);
  }, [stats]);

  return (
    <Accordion defaultExpanded={true} expanded={translationPath == '' || undefined}>
      <AccordionSummary>
        <Typography fontWeight={500}>{translationPath || 'Translations'}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ mb: 2 }}>
          <Typography fontSize={12}>
            {stats.total} translations | {stats.translated} translated | {stats.untranslated} untranslated
          </Typography>
        </Box>
        {strings.map(key => (
          <TranslateString 
            key={key} 
            translationPath={`${translationPath}.${key}`} 
            sourceTranslation={sourceTranslationObject[key] as string} 
            targetTranslation={targetTranslationObject[key] as string} />
        ))}
        {nests.map(nest => (
          <TranslateAccordion 
            key={nest} 
            translationPath={`${translationPath}.${nest}`}
            onStats={(stats) => setNestedStats({ ...nestedStats, [nest]: stats })} />
        ))}
      </AccordionDetails>
    </Accordion>
  )
}