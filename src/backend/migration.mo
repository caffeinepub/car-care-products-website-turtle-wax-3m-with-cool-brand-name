import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";

module {
  // Old Product type (without owner)
  type OldProduct = {
    id : Nat;
    brand : Text;
    name : Text;
    shortDescription : Text;
    imgPath : Text;
    originalMrp : Nat;
    discountedPrice : Nat;
    tags : ?[Text];
  };

  // Old actor type
  type OldActor = {
    products : Map.Map<Nat, OldProduct>;
  };

  // New Product type (with owner)
  type NewProduct = {
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

  // New actor type
  type NewActor = {
    products : Map.Map<Nat, NewProduct>;
  };

  // Migration function called by the main actor via the with-clause
  public func run(old : OldActor) : NewActor {
    let newProducts = old.products.map<Nat, OldProduct, NewProduct>(
      func(_id, oldProduct) {
        { oldProduct with owner = Principal.anonymous() };
      }
    );
    { products = newProducts };
  };
};
