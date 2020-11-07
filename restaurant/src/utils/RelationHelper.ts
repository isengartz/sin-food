import mongoose from 'mongoose';

export interface RelationUpdateInterface {
  model: string;
  parentIdentifier: string;
  childIdentifier: string;
  [key: string]: string;
}
export class RelationHelper<T extends mongoose.Document> {
  private relations: RelationUpdateInterface[] = [];

  constructor(private document: T) {}

  public addRelation(relation: RelationUpdateInterface) {
    this.relations.push(relation);
  }

  public addRelations(relations: RelationUpdateInterface[]) {
    relations.forEach((relation) => {
      this.addRelation(relation);
    });
  }

  removeReferencesBasedOnId() {
    this.relations.forEach(async (relation) => {
      const model = mongoose.model(relation.model);
      await model.updateMany(
        { _id: { $in: this.document[relation.parentIdentifier as keyof T] } },
        {
          $pull: {
            [relation.childIdentifier]: this.document._id,
          },
        },
      );
    });
  }

  // async removeReferencesBasedOnId<T> = (
  //     document: T extends mongoose.Document
  // ) {
  //
  //     await relations.model.updateMany(
  //         { _id: { $in: this[relations.parentIdentifier] } },
  //         {
  //             $pull: {
  //                 [relations.childIdentifier]: this._id,
  //             },
  //         }
  //     );
  // };
}
