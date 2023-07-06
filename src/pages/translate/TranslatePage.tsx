import React from 'react';
import './TranslatePage.scss';
import { TranslationContext } from '../../context/TranslationContext';
import { TranslateAccordion } from '../../components/TranslateAccordion/TranslateAccordion';

export const TranslatePage = () => {
  const { } = React.useContext(TranslationContext);
  
  return (
    <div className="translate-page">
      <TranslateAccordion translationPath='' />
    </div>
  )
};