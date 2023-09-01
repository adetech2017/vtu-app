import React from 'react';





const TabNavigationComponent = ({ activeTab, setActiveTab }) => {
    return (
        <div>
        <button onClick={() => setActiveTab('countries')} disabled={activeTab === 'countries'}>
            Countries eSim plans
        </button>
        <button onClick={() => setActiveTab('regions')} disabled={activeTab === 'regions'}>
            Regions eSim plans
        </button>
        <button onClick={() => setActiveTab('global')} disabled={activeTab === 'global'}>
            Global eSim Plans
        </button>
        </div>
    );
};

export default TabNavigationComponent;
