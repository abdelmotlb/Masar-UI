// LoadingProvider.jsx

import { createContext, useContext, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";

const LoadingContext = createContext(null);

function LoadingSpinnerProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const show = (message) => {
    setMessage(message);
    setLoading(true);
  };
  const hide = () => {
    setLoading(false);
    setMessage("");
  };

  return (
    <LoadingContext.Provider
      value={{ show, hide, loading }}
    >
      {loading && <LoadingSpinner message={message} />}
      {children}
    </LoadingContext.Provider>
  );
}


export const useLoadingSpinner = () => {
  return useContext(LoadingContext);
}

export default LoadingSpinnerProvider;