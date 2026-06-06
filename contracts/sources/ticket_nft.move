/// TicketLedger — event tickets minted as Aptos Digital Assets (NFTs).
///
/// All tickets live in a single, platform-owned collection. The collection is
/// created automatically on publish (`init_module`) under a module-owned
/// object, and an `ExtendRef` is stored so the module can re-derive the
/// collection creator's signer on every mint — without the publisher having to
/// co-sign. This lets any wallet self-mint a ticket while keeping the tokens
/// part of one verifiable, transferable on-chain collection.
module ticketledger::ticket_nft {
    use std::option;
    use std::signer;
    use std::string::{Self, String};

    use aptos_framework::event;
    use aptos_framework::object::{Self, ExtendRef};

    use aptos_token_objects::collection;
    use aptos_token_objects::royalty::Royalty;
    use aptos_token_objects::token::{Self, Token};

    /// Deterministic seed used to derive the platform's creator object address.
    const APP_OBJECT_SEED: vector<u8> = b"ticketledger::ticket_nft";

    /// Identity of the single shared ticket collection.
    const COLLECTION_NAME: vector<u8> = b"TicketLedger Events";
    const COLLECTION_DESCRIPTION: vector<u8> = b"On-chain event tickets minted as Aptos Digital Assets.";
    const COLLECTION_URI: vector<u8> = b"https://ticketledger.example/collection.json";

    // --- Error codes ---

    /// The module has not been initialized (collection missing). Should be
    /// unreachable after publish because `init_module` runs automatically.
    const E_NOT_INITIALIZED: u64 = 1;
    /// A ticket field (name/uri) was empty.
    const E_EMPTY_FIELD: u64 = 2;

    #[event]
    /// Emitted whenever a ticket is minted and transferred to its buyer.
    struct TicketMinted has drop, store {
        owner: address,
        token: address,
        name: String,
    }

    /// Stored under the module-owned creator object. Lets the module mint on
    /// behalf of the platform after publish, when only the buyer's signer is
    /// available at the call site.
    struct TicketCreator has key {
        extend_ref: ExtendRef,
    }

    /// Runs automatically when the package is published. Creates the shared
    /// collection under a module-owned object and stores the extend ref.
    fun init_module(publisher: &signer) {
        let constructor_ref = object::create_named_object(publisher, APP_OBJECT_SEED);
        let object_signer = object::generate_signer(&constructor_ref);

        collection::create_unlimited_collection(
            &object_signer,
            string::utf8(COLLECTION_DESCRIPTION),
            string::utf8(COLLECTION_NAME),
            option::none<Royalty>(),
            string::utf8(COLLECTION_URI),
        );

        move_to(
            &object_signer,
            TicketCreator { extend_ref: object::generate_extend_ref(&constructor_ref) },
        );
    }

    /// Mint a new event ticket (a Digital Asset NFT) to `buyer`.
    ///
    /// Unlike the previous resource-based design, a single account can hold any
    /// number of tickets, and each ticket is a first-class, transferable token.
    public entry fun mint_ticket(
        buyer: &signer,
        name: String,
        description: String,
        uri: String,
    ) acquires TicketCreator {
        assert!(!string::is_empty(&name), E_EMPTY_FIELD);
        assert!(!string::is_empty(&uri), E_EMPTY_FIELD);

        let creator_addr = creator_object_address();
        assert!(exists<TicketCreator>(creator_addr), E_NOT_INITIALIZED);
        let creator = borrow_global<TicketCreator>(creator_addr);
        let creator_signer = object::generate_signer_for_extending(&creator.extend_ref);

        let constructor_ref = token::create(
            &creator_signer,
            string::utf8(COLLECTION_NAME),
            description,
            name,
            option::none<Royalty>(),
            uri,
        );

        let token_obj = object::object_from_constructor_ref<Token>(&constructor_ref);
        let buyer_addr = signer::address_of(buyer);
        object::transfer(&creator_signer, token_obj, buyer_addr);

        event::emit(TicketMinted {
            owner: buyer_addr,
            token: object::address_from_constructor_ref(&constructor_ref),
            name,
        });
    }

    // --- Views ---

    #[view]
    /// Address of the module-owned object that creates and owns the collection.
    public fun creator_object_address(): address {
        object::create_object_address(&@ticketledger, APP_OBJECT_SEED)
    }

    #[view]
    /// Whether `init_module` has run and the collection exists.
    public fun is_initialized(): bool {
        exists<TicketCreator>(creator_object_address())
    }

    #[view]
    /// Name of the shared ticket collection.
    public fun collection_name(): String {
        string::utf8(COLLECTION_NAME)
    }

    // ===================== Tests =====================

    #[test_only]
    use std::vector;
    #[test_only]
    use aptos_framework::account;

    #[test_only]
    fun setup(publisher: &signer) {
        account::create_account_for_test(signer::address_of(publisher));
        init_module(publisher);
    }

    #[test(publisher = @ticketledger, buyer = @0xb0b)]
    fun mint_creates_and_transfers_ticket(publisher: &signer, buyer: &signer)
    acquires TicketCreator {
        setup(publisher);
        account::create_account_for_test(signer::address_of(buyer));
        assert!(is_initialized(), 0);

        mint_ticket(
            buyer,
            string::utf8(b"VIP Pass"),
            string::utf8(b"Front-row seat"),
            string::utf8(b"https://ticketledger.example/vip.json"),
        );

        let events = event::emitted_events<TicketMinted>();
        assert!(vector::length(&events) == 1, 1);
        let minted = vector::borrow(&events, 0);
        assert!(minted.owner == signer::address_of(buyer), 2);

        let token_obj = object::address_to_object<Token>(minted.token);
        assert!(object::owner(token_obj) == signer::address_of(buyer), 3);
    }

    #[test(publisher = @ticketledger, buyer = @0xb0b)]
    fun account_can_hold_multiple_tickets(publisher: &signer, buyer: &signer)
    acquires TicketCreator {
        setup(publisher);
        account::create_account_for_test(signer::address_of(buyer));

        mint_ticket(buyer, string::utf8(b"Ticket A"), string::utf8(b"d"), string::utf8(b"https://x/a.json"));
        mint_ticket(buyer, string::utf8(b"Ticket B"), string::utf8(b"d"), string::utf8(b"https://x/b.json"));

        let events = event::emitted_events<TicketMinted>();
        assert!(vector::length(&events) == 2, 0);
    }

    #[test(buyer = @0xb0b)]
    #[expected_failure(abort_code = E_NOT_INITIALIZED, location = Self)]
    fun mint_requires_initialization(buyer: &signer) acquires TicketCreator {
        account::create_account_for_test(signer::address_of(buyer));
        mint_ticket(buyer, string::utf8(b"X"), string::utf8(b"d"), string::utf8(b"https://x/x.json"));
    }

    #[test(publisher = @ticketledger, buyer = @0xb0b)]
    #[expected_failure(abort_code = E_EMPTY_FIELD, location = Self)]
    fun mint_rejects_empty_name(publisher: &signer, buyer: &signer) acquires TicketCreator {
        setup(publisher);
        account::create_account_for_test(signer::address_of(buyer));
        mint_ticket(buyer, string::utf8(b""), string::utf8(b"d"), string::utf8(b"https://x/x.json"));
    }
}
