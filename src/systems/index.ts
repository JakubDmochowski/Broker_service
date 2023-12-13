import type { PropertyPayload } from '../propertyBroker/IPropertyBroker';

export abstract class System {
  protected abstract url: string;
  public abstract register(payload: PropertyPayload): void
}
