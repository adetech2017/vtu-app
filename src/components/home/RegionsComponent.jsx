import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMoreRounded';





const RegionsComponent = ({ regionsProducts }) => {
    return (
        <div>
            <h1>Regions</h1>
            {Object.keys(regionsProducts).length > 0 ? (
                <ul>
                {Object.entries(regionsProducts).map(([regionName, products]) => (
                    <li key={regionName}>
                        <Accordion>
                            <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={`${regionName}-content`}
                            id={`${regionName}-header`}
                            >
                                <Typography>{regionName}</Typography>
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
                <p>No regional products found.</p>
            )}
        </div>
    );
};

export default RegionsComponent;
