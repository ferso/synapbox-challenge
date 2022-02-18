import { NotValidId } from '../exceptions/not-valid-id.exception';

export class Id {
  value: number;
  constructor(value: number) {
    this.of(value);
  }
  getValue(): number {
    return this.value;
  }

  of(value?: number): this {
    if (this.validate(value)) {
      this.value = Number(value);
    }
    return this;
  }

  validate(value: any) {
    if (isNaN(value)) {
      throw new NotValidId(`id { ${value} } is not a valid integer number`);
    }
    return true;
  }
}
