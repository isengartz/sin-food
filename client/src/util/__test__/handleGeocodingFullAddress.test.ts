import { handleGeocodingFullAddress } from '../handleGeocodingFullAddress';

const mockedGmapsPayload = {
  formatted_address: 'Leonidou 21, Ag. Paraskevi 153 41, Greece',
  address_components: [
    {
      long_name: '21',
      types: ['street_number'],
    },
    {
      long_name: 'Leonidou',
      types: ['route'],
    },
    {
      long_name: 'Agia Paraskevi',
      types: ['locality', 'political'],
    },
    {
      long_name: 'Vorios Tomeas Athinon',
      types: ['administrative_area_level_3', 'political'],
    },
    {
      long_name: 'Greece',
      types: ['country', 'political'],
    },
    {
      long_name: '153 41',
      types: ['postal_code'],
    },
  ],
};

it('should return the formatted_address', () => {
  expect(
    handleGeocodingFullAddress(
      mockedGmapsPayload as google.maps.GeocoderResult,
    ),
  ).toEqual(mockedGmapsPayload.formatted_address);
});

it('should return the address built from components', () => {
  const shouldBe =
    'Leonidou 21, 153 41, Agia Paraskevi, Vorios Tomeas Athinon, Greece';

  // @ts-ignore
  delete mockedGmapsPayload.formatted_address;

  expect(
    handleGeocodingFullAddress(
      mockedGmapsPayload as google.maps.GeocoderResult,
    ),
  ).toEqual(shouldBe);
});
