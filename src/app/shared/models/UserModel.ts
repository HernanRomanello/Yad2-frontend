import { AdvertisementModelStatistic } from './AdvertisementModelStatistic';
import { AdvertisementsModel } from './AdvertisementsModel';
import { LastsearchesModel } from './LastsearchesModel';

export type UserModel = {
  // id: string;
  // name: string;
  // lastName: string;
  email: string;
  // isAdmin: boolean;
  // age?: number;
  // address?: string;
  // phoneNumber?: string;
  // priceDiscount?: number;

  name: string;
  phoneNumber?: string;
  lastName: string;
  birthDate: string;
  city: string;
  street: string;
  houseNumber: number;
  picture: string;
  favoriteAdvertisements: AdvertisementsModel[];
  myAdvertisements: AdvertisementsModel[];
  statistics: AdvertisementModelStatistic;
  lastsearches: LastsearchesModel[];
};
