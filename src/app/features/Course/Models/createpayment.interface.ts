export interface ICreatePaymentRequest {
  purchaseType: 'Course' | 'PointPackage';
  courseId?: string;
  pointPackageId?: string;
}