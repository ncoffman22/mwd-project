import React from 'react';

const Display = ({ instructions }) => {
    // split instructions into steps if they're numbered or bulleted
    const formatInstructions = (text) => {
        if (!text) return [];
        
        return text.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map(line => {
                // remove number/bullet prefixes but keep the content
                return line.replace(/^\d+\.\s*|-\s*/, '').trim();
            });
    };

    const steps = formatInstructions(instructions);

    return (
        <div className="desc-inst-section">
            <div className="description-content">
                <h6 className="border-top pt-3 mb-3">Instructions</h6>
                <ol className="instruction-steps">
                    {steps.map((step, index) => (
                        <li key={index} className="mb-2">
                            <span className="instruction-step">{step}</span>
                        </li>
                    ))}
                </ol>
            </div>
        </div>
    );
};


export default Display;