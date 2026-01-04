page 50002 "LSC Time Entry Reg. API"
{
    PageType = API;
    APIPublisher = 'lsretail';
    APIGroup = 'timeregistration';
    APIVersion = 'v2.0';
    EntityName = 'timeEntryRegistration';
    EntitySetName = 'timeEntryRegistrations';
    SourceTable = "LSC Time Entry Registration"; // Table 10015007
    DelayedInsert = true;
    ODataKeyFields = SystemId;
    Editable = true; // Read/Write API
    InsertAllowed = true;
    DeleteAllowed = false; // Typically don't allow deletion of time entries
    ModifyAllowed = true;

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
                field(employeeNo; Rec."Employee No.")
                {
                    Caption = 'Employee No.';
                }
                field(workLocation; Rec."Work Location")
                {
                    Caption = 'Work Location';
                }
                field(workRoleCode; Rec."Work Role Code")
                {
                    Caption = 'Work Role Code';
                }
                field(systemDateEntry; Rec."System Date (Entry)")
                {
                    Caption = 'System Date (Entry)';
                }
                field(systemTimeEntry; Rec."System Time (Entry)")
                {
                    Caption = 'System Time (Entry)';
                }
                field(systemDateExit; Rec."System Date (Exit)")
                {
                    Caption = 'System Date (Exit)';
                }
                field(systemTimeExit; Rec."System Time (Exit)")
                {
                    Caption = 'System Time (Exit)';
                }
                field(userDateEntry; Rec."User Date (Entry)")
                {
                    Caption = 'User Date (Entry)';
                }
                field(userTimeEntry; Rec."User Time (Entry)")
                {
                    Caption = 'User Time (Entry)';
                }
                field(userDateExit; Rec."User Date (Exit)")
                {
                    Caption = 'User Date (Exit)';
                }
                field(userTimeExit; Rec."User Time (Exit)")
                {
                    Caption = 'User Time (Exit)';
                }
                field(noOfHours; Rec."No. Of Hours")
                {
                    Caption = 'No. Of Hours';
                }
                field(status; Rec.Status)
                {
                    Caption = 'Status';
                }
                field(entryStatus; Rec."Entry Status")
                {
                    Caption = 'Entry Status';
                }
                field(leavingStatus; Rec."Leaving Status")
                {
                    Caption = 'Leaving Status';
                }
                field(entryMethod; Rec."Entry Method")
                {
                    Caption = 'Entry Method';
                }
                field(entryEmployeeComment; Rec."Entry Employee Comment")
                {
                    Caption = 'Entry Employee Comment';
                }
                field(originLogon; Rec."Origin (Logon)")
                {
                    Caption = 'Origin (Logon)';
                }
                field(checkInDateTime; CheckInDateTime)
                {
                    Caption = 'Check-In DateTime';
                    Editable = false;
                }
                field(checkOutDateTime; CheckOutDateTime)
                {
                    Caption = 'Check-Out DateTime';
                    Editable = false;
                }
                field(durationMinutes; DurationMinutes)
                {
                    Caption = 'Duration (Minutes)';
                    Editable = false;
                }
            }
        }
    }

    var
        CheckInDateTime: DateTime;
        CheckOutDateTime: DateTime;
        DurationMinutes: Decimal;

    trigger OnAfterGetRecord()
    begin
        CalculateComputedFields();
    end;

    trigger OnNewRecord(BelowxRec: Boolean)
    begin
        // Set defaults for new records
        Rec."System Date (Entry)" := Today;
        Rec."System Time (Entry)" := Time;
        Rec."Entry Method" := Rec."Entry Method"::"Automatic Entry";
        Rec.Status := Rec.Status::Open;
        Rec."Entry Status" := Rec."Entry Status"::OK;
        Rec."Origin (Logon)" := 'PowerApp';
    end;

    trigger OnInsertRecord(BelowxRec: Boolean): Boolean
    begin
        // Ensure entry time is set
        if Rec."System Date (Entry)" = 0D then
            Rec."System Date (Entry)" := Today;
        if Rec."System Time (Entry)" = 0T then
            Rec."System Time (Entry)" := Time;
    end;

    trigger OnModifyRecord(): Boolean
    begin
        // Calculate hours when exit time is set
        if (Rec."System Date (Exit)" <> 0D) and (Rec."System Time (Exit)" <> 0T) then begin
            CalculateHours();
            if Rec.Status = Rec.Status::Open then
                Rec.Status := Rec.Status::Closed;
        end;
    end;

    local procedure CalculateComputedFields()
    var
        EntryDateTime: DateTime;
        ExitDateTime: DateTime;
    begin
        // Calculate check-in datetime
        if (Rec."System Date (Entry)" <> 0D) and (Rec."System Time (Entry)" <> 0T) then
            CheckInDateTime := CreateDateTime(Rec."System Date (Entry)", Rec."System Time (Entry)")
        else
            CheckInDateTime := 0DT;

        // Calculate check-out datetime
        if (Rec."System Date (Exit)" <> 0D) and (Rec."System Time (Exit)" <> 0T) then
            CheckOutDateTime := CreateDateTime(Rec."System Date (Exit)", Rec."System Time (Exit)")
        else
            CheckOutDateTime := 0DT;

        // Calculate duration in minutes
        if Rec."No. Of Hours" <> 0 then
            DurationMinutes := Rec."No. Of Hours" * 60
        else
            DurationMinutes := 0;
    end;

    local procedure CalculateHours()
    var
        EntryDateTime: DateTime;
        ExitDateTime: DateTime;
        DurationMs: BigInteger;
    begin
        if (Rec."System Date (Entry)" = 0D) or (Rec."System Time (Entry)" = 0T) or
           (Rec."System Date (Exit)" = 0D) or (Rec."System Time (Exit)" = 0T)
        then
            exit;

        EntryDateTime := CreateDateTime(Rec."System Date (Entry)", Rec."System Time (Entry)");
        ExitDateTime := CreateDateTime(Rec."System Date (Exit)", Rec."System Time (Exit)");

        if ExitDateTime > EntryDateTime then begin
            DurationMs := ExitDateTime - EntryDateTime;
            Rec."No. Of Hours" := DurationMs / 3600000; // Convert milliseconds to hours
        end;
    end;
}
