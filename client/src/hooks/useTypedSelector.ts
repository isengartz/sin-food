import { useSelector, TypedUseSelectorHook } from 'react-redux';
import { RootState } from '../state';

/**
 * In order to be able to use useSelector alongside with Typescript
 */
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
