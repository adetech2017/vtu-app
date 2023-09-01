import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMoreRounded';






const GlobalPlansComponent = ({ globalPlanProducts }) => {
    return (
        <div>
            <h1>Global Plans</h1>
            {Object.keys(globalPlanProducts).length > 0 ? (
                <ul>
                    {Object.entries(globalPlanProducts).map(([planName, products]) => (
                        <li key={planName}>
                            <Accordion>
                                <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls={`${planName}-content`}
                                id={`${planName}-header`}
                                >
                                    <Typography>{planName}</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                <ul>
                                    {products.map(product => (
                                        <li key={product.id}>
                                            <p>Name: {product.name}</p>
                                            <p>Price: {product.price}</p>
                                            <p>Data: {product.data}</p>
                                        </li>
                                    ))}
                                </ul>
                                </AccordionDetails>
                            </Accordion>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No global plan products found.</p>
            )}
        </div>
    );
};

export default GlobalPlansComponent;
