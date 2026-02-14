import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Map "mo:core/Map";

module {
  type OldProduct = {
    id : Nat;
    brand : Text;
    name : Text;
    shortDescription : Text;
    imgPath : Text;
    mrpInRupees : Nat;
    tags : ?[Text];
  };

  type OldActor = {
    products : Map.Map<Nat, OldProduct>;
  };

  type NewProduct = {
    id : Nat;
    brand : Text;
    name : Text;
    shortDescription : Text;
    imgPath : Text;
    originalMrp : Nat;
    discountedPrice : Nat;
    tags : ?[Text];
  };

  type NewActor = {
    products : Map.Map<Nat, NewProduct>;
  };

  public func run(old : OldActor) : NewActor {
    let newProducts = old.products.map<Nat, OldProduct, NewProduct>(
      func(_id, oldProduct) {
        {
          oldProduct with
          originalMrp = oldProduct.mrpInRupees + 200;
          discountedPrice = (oldProduct.mrpInRupees + 200) * 95 / 100;
        };
      }
    );
    { products = newProducts };
  };
};
