import { LearningCircleListItem } from './learning-circle.models';

export type CircleMembershipAction = 'join' | 'leave';

export interface CircleConfirmationData {
  action: CircleMembershipAction;
  circle: LearningCircleListItem;
}
