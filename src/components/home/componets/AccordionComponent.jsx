import React from 'react';
import { Accordion, AccordionSummary, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMoreRounded';






const AccordionComponent = ({ countryName, openAccordion, handleAccordionClick }) => {
    return (
        <div key={countryName}>
        <Accordion expanded={openAccordion === countryName} onChange={() => handleAccordionClick(countryName)}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`${countryName}-content`} id={`${countryName}-header`}>
            <Typography>{countryName}</Typography>
            </AccordionSummary>
        </Accordion>
        </div>
    );
};

export default AccordionComponent;
