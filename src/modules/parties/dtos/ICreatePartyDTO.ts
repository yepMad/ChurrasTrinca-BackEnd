export default interface ICreateUserDTO {
  name: string;
  owner_id: string;
  date: Date;
  description: string;
  observation?: string;
}
