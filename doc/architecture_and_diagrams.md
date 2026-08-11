# MyTravelAgent: System Architecture & Block Diagrams

This document contains the complete block diagrams, multi-agent frameworks, sequence flows, and state machine diagrams for **MyTravelAgent**.

---

## 1. High-Level System Block Diagram

```mermaid
graph TB
    subgraph UI_Layer ["1. User Interface Layer (React SPA)"]
        UI_Main["App Dashboard & Navigation"]
        UI_Dest["Destination Explorer View"]
        UI_Search["Multi-Modal Transit Search (Date & Time Window)"]
        UI_Checkout["Checkout & Payment Gateway (Card & UPI)"]
        UI_Notif["Omnichannel Ticket Preview (SMS, WhatsApp, Email)"]
        UI_Diagram["Embedded Visual MAS Architecture Viewer"]
    end

    subgraph Agent_Runtime ["2. Multi-Agent System Runtime"]
        Supervisor["Supervisor / Master Orchestrator Agent"]
        EventBus["Event & Message Bus (Pub/Sub)"]
        SessionStore["Session & Context Memory"]

        Supervisor <--> EventBus
        Supervisor <--> SessionStore
    end

    subgraph Specialized_Agents ["3. Autonomous Specialized Agents"]
        DestAgent["Destination Exploration Agent"]
        RouterAgent["Transit Router Agent"]
        FlightAgent["Flight Search Agent"]
        TrainAgent["Train Search Agent"]
        BusAgent["Bus Search Agent"]
        BookingAgent["Booking & Checkout Agent"]
        PaymentAgent["Payment Gateway Agent"]
        NotifAgent["Omnichannel Notification Agent"]
    end

    subgraph External_Services ["4. Integration Services Layer"]
        PlacesAPI["Places, Images & Weather API"]
        FlightAPI["Flight Inventory Engine"]
        RailAPI["Railway Network Engine"]
        BusAPI["Bus Operator Engine"]
        CardService["Credit Card Auth Gateway"]
        UPIService["UPI VPA/QR Gateway"]
        SMSService["Twilio SMS Gateway"]
        WAService["WhatsApp Business API"]
        EmailService["Nodemailer/SMTP Service"]
    end

    %% Connections
    UI_Main <--> Supervisor
    EventBus <--> DestAgent
    EventBus <--> RouterAgent
    EventBus <--> BookingAgent
    EventBus <--> PaymentAgent
    EventBus <--> NotifAgent

    RouterAgent <--> FlightAgent
    RouterAgent <--> TrainAgent
    RouterAgent <--> BusAgent

    DestAgent <--> PlacesAPI
    FlightAgent <--> FlightAPI
    TrainAgent <--> RailAPI
    BusAgent <--> BusAPI

    BookingAgent <--> PaymentAgent
    PaymentAgent <--> CardService
    PaymentAgent <--> UPIService

    BookingAgent <--> NotifAgent
    NotifAgent <--> SMSService
    NotifAgent <--> WAService
    NotifAgent <--> EmailService
```

---

## 2. Multi-Agent Framework & Interaction Diagram

```mermaid
graph TD
    User([User Request]) --> Supervisor[Supervisor Agent]

    subgraph Domain_Exploration ["Exploration Domain"]
        Supervisor <--> DestAgent["Destination Agent"]
        DestAgent <--> PlacesDB[("Places & Weather DB")]
    end

    subgraph Domain_Transit ["Transit Search Domain"]
        Supervisor <--> TransitRouter["Transit Router Agent"]
        TransitRouter <--> FlightAgent["Flight Agent ✈️"]
        TransitRouter <--> TrainAgent["Train Agent 🚆"]
        TransitRouter <--> BusAgent["Bus Agent 🚌"]
    end

    subgraph Domain_Payment ["Payment Domain"]
        Supervisor <--> BookingAgent["Booking Agent"]
        BookingAgent <--> PaymentAgent["Payment Agent"]
        PaymentAgent <--> CardAuth["Credit Card 3DS Auth"]
        PaymentAgent <--> UPIAuth["UPI VPA / Dynamic QR"]
    end

    subgraph Domain_Fulfillment ["Notification Domain"]
        BookingAgent --> NotifAgent["Notification Agent"]
        NotifAgent --> SMSOut["SMS Gateway"]
        NotifAgent --> WAOut["WhatsApp Business API"]
        NotifAgent --> EmailOut["Email SMTP Server"]
    end
```

---

## 3. End-to-End Sequence Diagram (Search -> Payment -> Multi-Channel Dispatch)

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant UI as Web App UI
    participant Sup as Supervisor Agent
    participant Dest as Destination Agent
    participant Router as Transit Router
    participant Flight as Flight Agent
    participant Train as Train Agent
    participant Bus as Bus Agent
    participant Pay as Payment Agent
    participant Notif as Notification Agent

    %% Phase 1: Exploration
    User->>UI: Select Destination (e.g., Paris, Goa, Tokyo)
    UI->>Sup: Request Destination Overview
    Sup->>Dest: Fetch POIs, Weather, Photos & Tips
    Dest-->>Sup: Return Destination Guide Object
    Sup-->>UI: Display Destination Card & Attractions

    %% Phase 2: Transit Search
    User->>UI: Submit Search (Source, Dest, Date Picker, Time Window, Mode)
    UI->>Sup: Dispatch Transit Search Request
    Sup->>Router: Execute Search Protocol

    par Parallel Search Execution
        Router->>Flight: Search Flights matching Date & Time
        Flight-->>Router: Flight Cards []
    and
        Router->>Train: Search Trains matching Date & Time
        Train-->>Router: Train Cards []
    and
        Router->>Bus: Search Buses matching Date & Time
        Bus-->>Router: Bus Cards []
    end

    Router-->>Sup: Aggregated & Price-Sorted Options List
    Sup-->>UI: Render Filterable Results (Price, Duration, Departure Time)

    %% Phase 3: Checkout & Payment
    User->>UI: Choose Transit Option & Select Payment (Credit Card / UPI)
    UI->>Sup: Initiate Booking
    
    alt Payment Method == Credit Card
        Sup->>Pay: Validate Card Details & Execute 3DS Auth
        Pay-->>Sup: Credit Card Success (TxnID: TXN_CARD_98124)
    else Payment Method == UPI
        Sup->>Pay: Verify UPI VPA / Generate Dynamic QR
        Pay-->>Sup: UPI Payment Verified (TxnID: TXN_UPI_55412)
    end

    %% Phase 4: Omnichannel Dispatch
    Sup->>Notif: Trigger Omnichannel Confirmation
    par Multi-Channel Notifications
        Notif->>User: Send Instant SMS Confirmation
    and
        Notif->>User: Send WhatsApp E-Ticket & Pass Link
    and
        Notif->>User: Send Email Receipt & Printable PDF Voucher
    end

    Notif-->>Sup: Confirmation Status Log
    Sup-->>UI: Display Celebration Screen with Ticket & Notification Previews
```

---

## 4. Payment Gateway State Machine Diagram

```mermaid
stateDiagram-v2
    [*] --> SelectMethod

    state CreditCardFlow {
        SelectMethod --> EnterCardDetails: Choose Credit/Debit Card
        EnterCardDetails --> ValidateInputs: Card #, Expiry, CVV
        ValidateInputs --> OTP_3DS_Simulation: Valid Inputs
        OTP_3DS_Simulation --> CardAuthorized: Enter 6-digit OTP
        ValidateInputs --> EnterCardDetails: Validation Error
    }

    state UPIFlow {
        SelectMethod --> ChooseUPIMode: Choose UPI
        ChooseUPIMode --> EnterVPA: Enter UPI ID (user@upi)
        ChooseUPIMode --> ScanDynamicQR: Generate Dynamic QR
        EnterVPA --> VerifyVPA: Check VPA Handle
        ScanDynamicQR --> AwaitQRScan: 3-Minute Live Timer
        VerifyVPA --> UPIAuthorized: Payment Approved
        AwaitQRScan --> UPIAuthorized: Payment Scanned & Approved
    }

    CardAuthorized --> BookingConfirmed: Generate Transaction ID
    UPIAuthorized --> BookingConfirmed: Generate Transaction ID
    BookingConfirmed --> TriggerNotifications: Dispatch SMS, WhatsApp, Email
    TriggerNotifications --> [*]
```

---

## 5. Agent Responsibilities & Data Contract Summary

| Agent Name | Input Schema | Core Operation | Output Schema |
| :--- | :--- | :--- | :--- |
| **Supervisor Agent** | User UI Action | Orchestrates intent, delegates to domain agents, maintains session state. | Updated Application State |
| **Destination Agent** | `{ destinationName: string }` | Queries weather, POIs, travel tips, and hero imagery. | `DestinationProfile` |
| **Transit Router Agent** | `{ source, destination, date, timeWindow, mode }` | Dispatches query to Flight, Train, Bus sub-agents & merges results. | `TransitOption[]` |
| **Flight Agent** | Route, Date, Time Window | Queries flight inventory (airlines, schedules, cabin classes). | `FlightOption[]` |
| **Train Agent** | Route, Date, Time Window | Queries rail timetables (trains, coaches 1A/2A/3A/SL, seats). | `TrainOption[]` |
| **Bus Agent** | Route, Date, Time Window | Queries bus operators (seater/sleeper, boarding points). | `BusOption[]` |
| **Payment Agent** | `PaymentDetails` (Card or UPI) | Validates credentials, executes 3DS / UPI QR check. | `TransactionResult` |
| **Notification Agent** | `BookingTransaction` | Formats e-tickets and dispatches SMS, WhatsApp, Email. | `DeliveryReceipts` |
