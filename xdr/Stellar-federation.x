// Copyright 2015 Stellar Development Foundation and contributors. Licensed
// under the Apache License, Version 2.0. See the COPYING file at the root
// of this distribution or at http://www.apache.org/licenses/LICENSE-2.0

%#include "xdr/Stellar-ledger-entries.h"

namespace stellar
{

struct FederationResponse
{

    string64 stellarAddress; // Stellar uses string32 for domain name, using double for the federation name
    AccountID accountID;
    Memo memo;

    // reserved for future use
    union switch (int v)
    {
    case 0:
        void;
    }
    ext;
};

}
