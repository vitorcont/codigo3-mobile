import { createContext, useEffect, useState } from 'react';
import { Accuracy, watchPositionAsync } from 'expo-location';
import { setUserLocation } from '@mobile/store/User/action';
import { useDispatch } from 'react-redux';
import { PlaceFound } from '@mobile/models/module';
import { useReduxState } from '@mobile/hooks/useReduxState';
import { searchPlace } from '@mobile/store/Places/action';
import { setBottomModal } from '@mobile/store/Modal/action';

interface ISearchProvider {
  children: React.ReactNode;
}

export interface ISearchContext {
  firstSearch: boolean;
  setFirstSearch: (value: boolean) => void;
  searchText: string;
  setSearchText: (value: string) => void;
  showList: boolean;
  setShowList: (value: boolean) => void;
  placePressed: null | PlaceFound;
  setPlacePressed: (value: null | PlaceFound) => void;
  markers: models.PlaceMarker[];
  setMarkers: (value: models.PlaceMarker[]) => void;
  showDetails: boolean;
  setShowDetails: (value: boolean) => void;
  handleClose: () => void;
}

export const SearchContext = createContext<ISearchContext | null>(null);

export const SearchProvider = (props: ISearchProvider) => {
  const {
    user: { userLocation },
  } = useReduxState();
  const [firstSearch, setFirstSearch] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [showList, setShowList] = useState(false);
  const [placePressed, setPlacePressed] = useState<null | PlaceFound>(null);
  const [markers, setMarkers] = useState<models.PlaceMarker[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const dispatch = useDispatch();

  const handleClose = () => {
    setMarkers([]);
    dispatch(setBottomModal('close'));
    setShowList(false);
    setShowDetails(false);
    setSearchText('');
    setPlacePressed(null);
  };

  useEffect(() => {
    if (!firstSearch && userLocation) {
      console.log('AQUI', userLocation);
      setFirstSearch(true);
      dispatch(searchPlace('hospital', userLocation));
    }
  }, [userLocation]);

  const values = {
    firstSearch,
    setFirstSearch,
    searchText,
    setSearchText,
    showList,
    setShowList,
    placePressed,
    setPlacePressed,
    markers,
    setMarkers,
    showDetails,
    setShowDetails,
    handleClose,
  };

  return <SearchContext.Provider value={values}>{props.children}</SearchContext.Provider>;
};
