import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Iter "mo:core/Iter";

import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";


actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

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
    public func compareById(product1 : Product, product2 : Product) : Order.Order {
      Nat.compare(product1.id, product2.id);
    };
  };

  let products = Map.empty<Nat, Product>();

  // Product management - write operations require user authentication
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add products");
    };

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

  public shared ({ caller }) func updateProduct(
    id : Nat,
    brand : ?Text,
    name : ?Text,
    shortDescription : ?Text,
    imgPath : ?Text,
    originalMrp : ?Nat,
    discountedPrice : ?Nat,
    tags : ?[Text],
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update products");
    };

    switch (products.get(id)) {
      case (null) { Runtime.trap("Product does not exist") };
      case (?product) {
        let updatedProduct : Product = {
          id = product.id;
          brand = switch (brand) { case (null) { product.brand }; case (?b) { b } };
          name = switch (name) { case (null) { product.name }; case (?n) { n } };
          shortDescription = switch (shortDescription) {
            case (null) { product.shortDescription };
            case (?desc) { desc };
          };
          imgPath = switch (imgPath) {
            case (null) { product.imgPath };
            case (?path) { path };
          };
          originalMrp = switch (originalMrp) {
            case (null) { product.originalMrp };
            case (?mrp) { mrp };
          };
          discountedPrice = switch (discountedPrice) {
            case (null) { product.discountedPrice };
            case (?price) { price };
          };
          tags = switch (tags) {
            case (null) { product.tags };
            case (?t) { ?t };
          };
        };
        products.add(id, updatedProduct);
      };
    };
  };

  public shared ({ caller }) func deleteProduct(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete products");
    };

    switch (products.get(id)) {
      case (null) { Runtime.trap("Product does not exist") };
      case (?_) {
        products.remove(id);
      };
    };
  };

  // Product queries - accessible to everyone including guests
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

  public query ({ caller }) func getProductDetails(id : Nat) : async Product {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product does not exist") };
      case (?product) {
        product;
      };
    };
  };
};
