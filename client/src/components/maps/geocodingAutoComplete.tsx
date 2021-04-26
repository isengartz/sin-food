import { Input, AutoComplete } from 'antd';
import React, { useEffect, useState } from 'react';

const renderTitle = (title: string) => <span>{title}</span>;

const renderItem = (title: string, payload: google.maps.GeocoderResult) => ({
  value: title,
  payload,
  label: (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      {title}
    </div>
  ),
});

interface AutoCompleteOptions {
  label: JSX.Element;
  options: {
    label: JSX.Element;
    value: string;
    payload?: google.maps.GeocoderResult;
  }[];
}

interface GeocodingAutoCompleteProps {
  onComplete: (data: any) => void;
}

/**
 * Custom Geocoding Component. NOT USED ANY MORE
 * @param onComplete
 * @constructor
 */
const GeocodingAutoComplete: React.FC<GeocodingAutoCompleteProps> = ({
  onComplete,
}) => {
  const [options, setOptions] = useState<AutoCompleteOptions[]>();
  const [searchTerm, setSearchTerm] = useState('');

  const geocoder = new google.maps.Geocoder();
  // Instead of doing the Geocoding in client side
  // I should add a new geocoding service and handle it there
  // @todo: move all this logic in a new service and dont forget to remove the google cdn from index.html
  useEffect(() => {
    let timer = setTimeout(async () => {
      if (searchTerm.length > 3) {
        // do the geocoding stuff
        geocoder.geocode({ address: searchTerm }, (results, status) => {
          // Check if the request failed
          if (status !== 'OK') {
            // if we have 0 result empty the array
            if (status === 'ZERO_RESULTS') {
              setOptions([{ label: renderTitle('Results'), options: [] }]);
            }
            console.error('Geocoding went wrong !', status);
            return;
          }
          console.debug(results);
          // Render the options
          const renderedOptions = results.map((result) => {
            return renderItem(result.formatted_address, result);
          });
          setOptions([
            { label: renderTitle('Results'), options: renderedOptions },
          ]);
        });
      }
    }, 750);

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);

  return (
    <AutoComplete
      dropdownClassName="certain-category-search-dropdown"
      dropdownMatchSelectWidth={500}
      style={{ width: '100%' }}
      options={options}
      onSelect={(value, option) => onComplete(option)}
    >
      <Input.Search
        onChange={(e) => setSearchTerm(e.target.value)}
        size={'large'}
        placeholder="Write your address here"
      />
    </AutoComplete>
  );
};

export default GeocodingAutoComplete;
