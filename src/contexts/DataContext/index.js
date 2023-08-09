import PropTypes from "prop-types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const DataContext = createContext({});

export const api = {
  loadData: async () => {
    const json = await fetch("/events.json");
    const data = await json.json();
    // Assurez-vous que "last" est inclus dans les données retournées par l'API
    // Si "last" est stocké à l'intérieur d'un objet "focus", par exemple :
    const last = data.focus[data.focus.length - 1];
    return { ...data, last }; // Inclure "last" dans les données renvoyées
  },
};

export const DataProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const getData = useCallback(async () => {
    try {
      setData(await api.loadData());
    } catch (err) {
      setError(err);
    }
  }, []);
  useEffect(() => {
    if (data) return;
    getData();
  }, [data, getData]);
  
  return (
    <DataContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        data,
        error,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const useData = () => {
  const { data, error } = useContext(DataContext);

  const last = data?.focus?.[data.focus.length - 1]; // Extrait "last" de "focus"

  return { data, error, last };
};

export default DataContext;
