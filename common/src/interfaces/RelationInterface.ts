export interface RelationInterface {
  model: string;
  parentIdentifier: string;
  childIdentifier: string;
  [key: string]: string;
}
