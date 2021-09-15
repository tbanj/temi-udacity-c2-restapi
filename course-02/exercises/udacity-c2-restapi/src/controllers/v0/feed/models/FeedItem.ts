import { Table, Column, Model, HasMany, PrimaryKey, CreatedAt, UpdatedAt, ForeignKey } from 'sequelize-typescript';
import { User } from '../../users/models/User';

@Table
export class FeedItem extends Model<FeedItem> {
  @Column
  public caption!: string; // for nullable fields

  @Column
  public url!: string; // for nullable fields

  @Column
  @CreatedAt //this means that is the progress that will add this field whenever  new record is being created
  public createdAt: Date = new Date(); // not nullable fields

  @Column
  @UpdatedAt //this means that is the progress that will add this field whenever  new record is being created
  public updatedAt: Date = new Date();
}
