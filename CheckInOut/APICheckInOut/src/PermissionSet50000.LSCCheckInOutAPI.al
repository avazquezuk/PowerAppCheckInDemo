// ------------------------------------------------------------------------------------------------
// Copyright (c) LS Retail. All rights reserved.
// ------------------------------------------------------------------------------------------------

/// <summary>
/// Permission set for LSC TimeRegistration API - Read access only
/// </summary>
permissionset 50000 "TimeReg Read"
{
    Assignable = true;
    Caption = 'LSC TimeRegistration API - Read';

    Permissions =
        page "LSC Staff Employee API" = X,
        page "LSC Work Location API" = X,
        page "LSC Time Entry Reg. API" = X,
        tabledata "LSC Staff Employee" = R,
        tabledata "LSC Work Location" = R,
        tabledata "LSC Time Entry Registration" = R;
}

/// <summary>
/// Permission set for LSC TimeRegistration API - Full access
/// </summary>
permissionset 50001 "TimeReg Full"
{
    Assignable = true;
    Caption = 'LSC TimeRegistration API - Full';

    Permissions =
        page "LSC Staff Employee API" = X,
        page "LSC Work Location API" = X,
        page "LSC Time Entry Reg. API" = X,
        tabledata "LSC Staff Employee" = R,
        tabledata "LSC Work Location" = R,
        tabledata "LSC Time Entry Registration" = RIMD;
}
