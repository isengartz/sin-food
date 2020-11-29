import mongoose from 'mongoose';
import { RelationInterface } from '../interfaces/RelationInterface';

export class RelationHelper<T extends mongoose.Document> {
  private relations: RelationInterface[] = [];

  constructor(private document: T) {}

  public addRelation(relation: RelationInterface) {
    this.relations.push(relation);
  }

  public addRelations(relations: RelationInterface[]) {
    relations.forEach((relation) => {
      this.addRelation(relation);
    });
  }

  // Remove references from relation
  // Used when deleting a Document
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

  // Insert a new reference to relation
  // Used when creating or updating a Document
  insertReferencesBasedOnId() {
    this.relations.forEach(async (relation) => {
      const model = mongoose.model(relation.model);
      await model.updateMany(
        { _id: { $in: this.document[relation.parentIdentifier as keyof T] } },
        {
          $addToSet: {
            [relation.childIdentifier]: this.document._id,
          },
        },
      );
    });
  }

  // Removes the reference from Collection
  // Used when updating a Document ( and removing it )
  removeUpdatedReferencesBasedOnId() {
    this.relations.forEach(async (relation) => {
      const model = mongoose.model(relation.model);
      await model.updateMany(
        { _id: { $nin: this.document[relation.parentIdentifier as keyof T] } },
        {
          $pull: {
            [relation.childIdentifier]: this.document._id,
          },
        },
      );
    });
  }
}
