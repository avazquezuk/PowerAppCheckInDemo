page 50000 "LSC Staff Employee API"
{
    PageType = API;
    APIPublisher = 'lsretail';
    APIGroup = 'timeregistration';
    APIVersion = 'v2.0';
    EntityName = 'staffEmployee';
    EntitySetName = 'staffEmployees';
    SourceTable = "LSC Staff Employee"; // Table 10015057
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
                field(number; Rec."No.")
                {
                    Caption = 'No.';
                }
                field(firstName; Rec."First Name")
                {
                    Caption = 'First Name';
                }
                field(lastName; Rec."Last Name")
                {
                    Caption = 'Last Name';
                }
                field(name; FullName)
                {
                    Caption = 'Name';
                }
                field(email; Rec."E-Mail")
                {
                    Caption = 'E-Mail';
                }
                field(mobilePhoneNo; Rec."Mobile Phone No.")
                {
                    Caption = 'Mobile Phone No.';
                }
                field(jobTitle; Rec."Job Title")
                {
                    Caption = 'Job Title';
                }
                field(status; Rec.Status)
                {
                    Caption = 'Status';
                }
                field(retailStaffId; Rec."Retail Staff ID")
                {
                    Caption = 'Retail Staff ID';
                }
                field(retailUserId; Rec."Retail User ID")
                {
                    Caption = 'Retail User ID';
                }
                field(employeeNo; Rec."Employee No.")
                {
                    Caption = 'BC Employee No.';
                }
                field(workRegion; Rec."Work Region")
                {
                    Caption = 'Work Region';
                }
                field(workLocation; Rec."Work Location")
                {
                    Caption = 'Work Location';
                }
                field(timeEntryId; Rec."Time Entry ID")
                {
                    Caption = 'Time Entry ID';
                }
                field(workRole; Rec."Work Role")
                {
                    Caption = 'Work Role';
                }
            }
        }
    }

    var
        FullName: Text;

    trigger OnAfterGetRecord()
    begin
        FullName := Rec."First Name" + ' ' + Rec."Last Name";
    end;
}
