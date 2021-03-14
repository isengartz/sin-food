/**
 * It takes as an input the result of Google Geocoder response
 * And should return the Full Address formatted
 * Note: Google says that we shouldn't programmatically use the full_address of response
 * Because countries like UK does not have the full_address attached to payload
 * @param result
 */
export const handleGeocodingFullAddress = (
  result: google.maps.GeocoderResult,
): string => {
  // If formatted address is set , return it
  if (result.formatted_address) {
    return result.formatted_address;
  }
  // Else build the string from address_components
  const addressArr: string[] = [];
  result.address_components.forEach((component) => {
    switch (component.types[0]) {
      case 'route':
        addressArr[0] = component.long_name;
        break;
      case 'street_number':
        addressArr[1] = component.long_name;
        break;
      case 'postal_code':
        addressArr[2] = component.long_name;
        break;
      case 'administrative_area_level_5':
      case 'locality':
        addressArr[3] = component.long_name;
        break;
      case 'administrative_area_level_2':
      case 'administrative_area_level_3':
        addressArr[4] = component.long_name;
        break;
      case 'country':
        addressArr[5] = component.long_name;
        break;
      default:
        break;
    }
  });
  // Format the address components
  return addressArr.reduce((acc, curr, index) => {
    if (index === 0) {
      // if its the first component just return it
      acc = acc + curr;
    } else if (index === 1) {
      // the second which is the address number , return it without a comma
      acc = acc + ' ' + curr;
    } else {
      // all the other should get a comma and space
      acc = acc + ', ' + curr;
    }

    return acc;
  }, '');

  // return addressArr.join(', ');
};
