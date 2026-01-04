page 50001 "LSC Work Location API"
{
    PageType = API;
    APIPublisher = 'lsretail';
    APIGroup = 'timeregistration';
    APIVersion = 'v2.0';
    EntityName = 'workLocation';
    EntitySetName = 'workLocations';
    SourceTable = "LSC Work Location"; // Table 10015021
    DelayedInsert = true;
    ODataKeyFields = SystemId;
    Editable = false; // Read-only API
    InsertAllowed = false;
    DeleteAllowed = false;
    ModifyAllowed = false;

    layout
    {
        area(Content)
        {
            repeater(GroupName)
            {
                field(id; Rec.SystemId)
                {
                    Caption = 'Id';
                    Editable = false;
                }
                field(code; Rec.Code)
                {
                    Caption = 'Code';
                }
                field(description; Rec.Description)
                {
                    Caption = 'Description';
                }
                field(workRegion; Rec."Work Region")
                {
                    Caption = 'Work Region';
                }
                field(storeNo; Rec."Store No.")
                {
                    Caption = 'Store No.';
                }
                field(responsiblePerson; Rec."Responsible Person")
                {
                    Caption = 'Responsible Person';
                }
                field(status; Rec.Status)
                {
                    Caption = 'Status';
                }
                field(globalDimension1Code; Rec."Global Dimension 1 Code")
                {
                    Caption = 'Global Dimension 1 Code';
                }
                field(globalDimension2Code; Rec."Global Dimension 2 Code")
                {
                    Caption = 'Global Dimension 2 Code';
                }
            }
        }
    }
}
