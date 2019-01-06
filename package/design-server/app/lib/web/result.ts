export class Result<T> {
  success: boolean;
  msg: string;
  code: string;
  data: T;

  constructor(data: T) {
    this.success = true;
    this.data = data;
  }

}
