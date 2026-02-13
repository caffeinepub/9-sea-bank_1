import Array "mo:core/Array";
import List "mo:core/List";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Order "mo:core/Order";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Types
  type Amount = Nat;
  type AccountLabel = Text;
  type UserId = Principal;

  public type UserProfile = {
    name : Text;
    email : Text;
    phone : Text;
  };

  public type MoneyTransfer = {
    fromAccount : AccountLabel;
    beneficiary : Text;
    amount : Amount;
    note : Text;
    transferType : TransferType;
    status : TransferStatus;
    timestamp : Time.Time;
  };
  public type TransferType = { #imps; #neft; #rtgs };
  public type TransferStatus = { #submitted; #completed; #failed };
  public type CardType = { #credit; #debit };
  public type Card = {
    nickname : Text;
    cardType : CardType;
    issuer : Text;
    last4 : Text;
    expiry : Text;
  };
  public type LoanType = { #vehicle; #business; #home };
  public type LoanApplication = {
    loanType : LoanType;
    name : Text;
    amount : Amount;
    tenure : Nat;
    income : Amount;
    purpose : Text;
    documents : Text;
    status : { #submitted; #underReview };
    timestamp : Time.Time;
  };
  public type InsuranceCategory = { #health; #life; #vehicle; #home };
  public type InsuranceInquiry = {
    category : InsuranceCategory;
    coverageAmount : Amount;
    notes : Text;
    contactPreference : Text;
    status : { #submitted; #reviewed };
    timestamp : Time.Time;
  };
  public type EmiPlan = {
    principal : Amount;
    rate : Float;
    tenureMonths : Nat;
    emi : Float;
    totalPayment : Float;
    totalInterest : Float;
    createdAt : Time.Time;
  };
  module Card {
    public func compare(c1 : Card, c2 : Card) : Order.Order {
      Text.compare(c1.nickname, c2.nickname);
    };
  };

  // State
  let userProfiles = Map.empty<Principal, UserProfile>();
  let allTransfers = Map.empty<UserId, List.List<MoneyTransfer>>();
  let allCards = Map.empty<UserId, List.List<Card>>();
  let allLoans = Map.empty<UserId, List.List<LoanApplication>>();
  let allInsurance = Map.empty<UserId, List.List<InsuranceInquiry>>();
  let allEmiPlans = Map.empty<UserId, List.List<EmiPlan>>();

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
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

  // Money Transfer Functions
  public shared ({ caller }) func createTransfer(
    fromAccount : AccountLabel,
    beneficiary : Text,
    amount : Amount,
    note : Text,
    transferType : TransferType,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create transfers");
    };
    if (amount == 0) { Runtime.trap("Cannot transfer 0 amount") };
    let newTransfer : MoneyTransfer = {
      fromAccount;
      beneficiary;
      amount;
      note;
      transferType;
      status = #submitted;
      timestamp = Time.now();
    };
    let transfers = switch (allTransfers.get(caller)) {
      case (null) { List.empty<MoneyTransfer>() };
      case (?existing) { existing };
    };
    transfers.add(newTransfer);
    allTransfers.add(caller, transfers);
  };

  public query ({ caller }) func getTransferHistory() : async [MoneyTransfer] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view transfer history");
    };
    switch (allTransfers.get(caller)) {
      case (null) { [] };
      case (?transfers) { transfers.reverse().toArray() };
    };
  };

  // Card Management Functions
  public shared ({ caller }) func addCard(
    nickname : Text,
    cardType : CardType,
    issuer : Text,
    last4 : Text,
    expiry : Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add cards");
    };
    let newCard : Card = {
      nickname;
      cardType;
      issuer;
      last4;
      expiry;
    };
    let cards = switch (allCards.get(caller)) {
      case (null) { List.empty<Card>() };
      case (?existing) { existing };
    };
    cards.add(newCard);
    allCards.add(caller, cards);
  };

  public query ({ caller }) func getAllCards() : async [Card] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view cards");
    };
    switch (allCards.get(caller)) {
      case (null) { [] };
      case (?cards) { cards.toArray().sort() };
    };
  };

  public shared ({ caller }) func removeCard(nickname : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove cards");
    };
    switch (allCards.get(caller)) {
      case (null) { Runtime.trap("No cards exist for this user") };
      case (?cards) {
        let filtered = List.empty<Card>();
        for (card in cards.values()) {
          if (card.nickname != nickname) {
            filtered.add(card);
          };
        };
        allCards.add(caller, filtered);
      };
    };
  };

  // Loan Application Functions
  public shared ({ caller }) func applyLoan(
    loanType : LoanType,
    name : Text,
    amount : Amount,
    tenure : Nat,
    income : Amount,
    purpose : Text,
    documents : Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can apply for loans");
    };
    if (amount == 0) { Runtime.trap("Cannot apply for 0 loan") };
    let newLoan : LoanApplication = {
      loanType;
      name;
      amount;
      tenure;
      income;
      purpose;
      documents;
      status = #submitted;
      timestamp = Time.now();
    };
    let loans = switch (allLoans.get(caller)) {
      case (null) { List.empty<LoanApplication>() };
      case (?existing) { existing };
    };
    loans.add(newLoan);
    allLoans.add(caller, loans);
  };

  public query ({ caller }) func getLoanApplications() : async [LoanApplication] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view loan applications");
    };
    switch (allLoans.get(caller)) {
      case (null) { [] };
      case (?loans) { loans.toArray() };
    };
  };

  // Insurance Functions
  public shared ({ caller }) func submitInsuranceInquiry(
    category : InsuranceCategory,
    coverageAmount : Amount,
    notes : Text,
    contactPreference : Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit insurance inquiries");
    };
    if (coverageAmount == 0) { Runtime.trap("Coverage amount cannot be 0") };
    let newInquiry : InsuranceInquiry = {
      category;
      coverageAmount;
      notes;
      contactPreference;
      status = #submitted;
      timestamp = Time.now();
    };
    let inquiries = switch (allInsurance.get(caller)) {
      case (null) { List.empty<InsuranceInquiry>() };
      case (?existing) { existing };
    };
    inquiries.add(newInquiry);
    allInsurance.add(caller, inquiries);
  };

  public query ({ caller }) func getInsuranceInquiries() : async [InsuranceInquiry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view insurance inquiries");
    };
    switch (allInsurance.get(caller)) {
      case (null) { [] };
      case (?inquiries) { inquiries.toArray() };
    };
  };

  // EMI Plan Functions
  public shared ({ caller }) func saveEmiPlan(
    principal : Amount,
    rate : Float,
    tenureMonths : Nat,
    emi : Float,
    totalPayment : Float,
    totalInterest : Float,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save EMI plans");
    };
    if (principal == 0) { Runtime.trap("Cannot save EMI with 0 principal") };
    let newPlan : EmiPlan = {
      principal;
      rate;
      tenureMonths;
      emi;
      totalPayment;
      totalInterest;
      createdAt = Time.now();
    };
    let plans = switch (allEmiPlans.get(caller)) {
      case (null) { List.empty<EmiPlan>() };
      case (?existing) { existing };
    };
    plans.add(newPlan);
    allEmiPlans.add(caller, plans);
  };

  public query ({ caller }) func getEmiPlans() : async [EmiPlan] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view EMI plans");
    };
    switch (allEmiPlans.get(caller)) {
      case (null) { [] };
      case (?plans) { plans.toArray() };
    };
  };

  // Dashboard Function
  public query ({ caller }) func getDashboardSummary() : async {
    recentTransfers : [MoneyTransfer];
    cardCount : Nat;
    loanCount : Nat;
    emiPlansCount : Nat;
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view dashboard");
    };
    let transfers = switch (allTransfers.get(caller)) {
      case (null) { [] };
      case (?transferList) { transferList.toArray() };
    };
    {
      recentTransfers = transfers;
      cardCount = allCards.get(caller).map(func(cards) { cards.size() }).unwrap();
      loanCount = allLoans.get(caller).map(func(loans) { loans.size() }).unwrap();
      emiPlansCount = allEmiPlans.get(caller).map(func(plans) { plans.size() }).unwrap();
    };
  };
};
