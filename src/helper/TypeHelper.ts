export class TypeHelper {

  public static interfaceToEnum<T>() {
    return new Proxy(
      {},
      {
        get: function (_target, prop, _receiver) {
          return prop;
        },
      }
    ) as {
      [P in keyof T]-?: P;
    };
  }

}
