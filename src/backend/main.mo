import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Migration "migration";

import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

// Add migration logic to the actor's with-clause
(with migration = Migration.run)
actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User profile type
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // User profile management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Product type with owner tracking
  public type Product = {
    id : Nat;
    brand : Text;
    name : Text;
    shortDescription : Text;
    imgPath : Text;
    originalMrp : Nat;
    discountedPrice : Nat;
    tags : ?[Text];
    owner : Principal;
  };

  module Product {
    public func compareById(product1 : Product, product2 : Product) : Order.Order {
      Nat.compare(product1.id, product2.id);
    };
  };

  let products = Map.empty<Nat, Product>();

  // Product management - write operations require user authentication and ownership
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

    // Check if product ID already exists
    switch (products.get(id)) {
      case (?_) { Runtime.trap("Product with this ID already exists") };
      case (null) {};
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
      owner = caller;
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
        // Check ownership: only the owner or an admin can update
        if (product.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the product owner or admin can update this product");
        };

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
          owner = product.owner; // Preserve original owner
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
      case (?product) {
        // Check ownership: only the owner or an admin can delete
        if (product.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the product owner or admin can delete this product");
        };
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

  // Get products owned by the caller
  public query ({ caller }) func getMyProducts() : async [Product] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their products");
    };

    let filtered = products.values().toArray().filter(func(product) { product.owner == caller });
    filtered.sort(Product.compareById);
  };
};
