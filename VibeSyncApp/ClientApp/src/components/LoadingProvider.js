import React, { createContext, useContext, useState } from 'react';

const LoadingContext = createContext();

export const useLoadingContext = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);

    const setLoadingState = (isLoading) => {
        setLoading(isLoading);
    };

    return (
        <LoadingContext.Provider value={{ loading, setLoading: setLoadingState }}>
            {children}
        </LoadingContext.Provider>
    );
};
