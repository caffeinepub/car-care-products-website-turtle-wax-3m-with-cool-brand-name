import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Migration "migration";

(with migration = Migration.run)
actor {
  type Product = {
    id : Nat;
    brand : Text;
    name : Text;
    shortDescription : Text;
    imgPath : Text;
    originalMrp : Nat;
    discountedPrice : Nat;
    tags : ?[Text];
  };

  module Product {
    public func compareByBrand(product1 : Product, product2 : Product) : Order.Order {
      Text.compare(product1.brand, product2.brand);
    };

    public func compareById(product1 : Product, product2 : Product) : Order.Order {
      Nat.compare(product1.id, product2.id);
    };
  };

  let products = Map.empty<Nat, Product>();

  public shared ({ caller }) func addProduct(
    id : Nat,
    brand : Text,
    name : Text,
    shortDescription : Text,
    imgPath : Text,
    originalMrp : Nat,
    discountedPrice : Nat,
    tags : ?[Text],
  ) : async () {
    let product : Product = {
      id;
      brand;
      name;
      shortDescription;
      imgPath;
      originalMrp;
      discountedPrice;
      tags;
    };
    products.add(id, product);
  };

  public query ({ caller }) func getProduct(id : Nat) : async Product {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product does not exist") };
      case (?product) { product };
    };
  };

  public query ({ caller }) func getAllProducts() : async [Product] {
    products.values().toArray().sort(Product.compareById);
  };

  public query ({ caller }) func getProductsByBrand(brand : Text) : async [Product] {
    let filtered = products.values().toArray().filter(func(product) { product.brand == brand });
    filtered.sort(Product.compareById);
  };

  public query ({ caller }) func getProductsGroupedByBrand() : async [(Text, [Product])] {
    let groupedMap = Map.empty<Text, [Product]>();

    products.values().forEach(
      func(product) {
        let current = switch (groupedMap.get(product.brand)) {
          case (null) { [] };
          case (?existing) { existing };
        };
        groupedMap.add(
          product.brand,
          Array.fromIter([product].values()).concat(Array.fromIter(current.values())),
        );
      }
    );

    Array.fromIter(groupedMap.entries());
  };
};
