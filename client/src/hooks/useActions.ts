import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../state';

/**
 * Binds Action Creators with Dispatch Function
 */
export const useActions = () => {
  const dispatch = useDispatch();
  // Memo the function so it wont trigger re-renders when the actionCreators are added in the dependency array
  return useMemo(() => {
    return bindActionCreators(actionCreators, dispatch);
  }, [dispatch]);
};
