import IHashProvider from './HashProvider/models/IHashProvider';
import BCryptHashProvider from './HashProvider/implementations/BCryptHashProvider';

export const HashProvider: IHashProvider = new BCryptHashProvider();
