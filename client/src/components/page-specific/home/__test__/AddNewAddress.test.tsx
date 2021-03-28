import React from 'react';
import { unmountComponentAtNode } from 'react-dom';
import { Provider } from 'react-redux';

import { render, screen } from '@testing-library/react';

import { store } from '../../../../state';
import AddNewAddress from '../AddNewAddress';
import userEvent from '@testing-library/user-event';

describe('Testing the <AddNewAddress/> Component', () => {
  it('should render the component', () => {
    render(
      <Provider store={store}>
        <AddNewAddress />
      </Provider>,
    );
    // The wrapper should have nothing inside when visible is false
    expect(screen.queryByRole('button')).toBeInTheDocument();
  });

  it('should render the modal component', () => {
    render(
      <Provider store={store}>
        <AddNewAddress />
      </Provider>,
    );
    // The wrapper should have nothing inside when visible is false
    const button = screen.getByRole('button', { name: /Add Address/i });

    // userEvent.click(button);
  });
});
