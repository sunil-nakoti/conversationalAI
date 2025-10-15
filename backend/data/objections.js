const initialObjections = [
    {
        id: 'obj1',
        name: "I can't afford to pay",
        category: "Stalls & Financial Hardship",
        keywords: ["can't afford", "no money", "lost my job", "broke", "unemployed"],
        linkedPlaybookId: "pb1",
        linkedPlaybookName: "Hardship Payment Plan"
    },
    {
        id: 'obj2',
        name: "This isn't my debt",
        category: "Disputes & Questioning Validity",
        keywords: ["not my debt", "don't owe this", "never heard of this", "wrong person"],
        linkedPlaybookId: "pb2",
        linkedPlaybookName: "Debt Validation Script"
    },
    {
        id: 'obj3',
        name: "Stop calling me",
        category: "Refusals & Legal Challenges",
        keywords: ["stop calling", "cease and desist", "harassing", "remove my number"],
        linkedPlaybookId: "pb3",
        linkedPlaybookName: "Cease & Desist Protocol"
    },
    {
        id: 'obj4',
        name: "I already paid this",
        category: "Disputes & Questioning Validity",
        keywords: ["already paid", "paid this off", "settled this"],
        linkedPlaybookId: "pb7",
        linkedPlaybookName: "Payment Tracing & Verification"
    },
    {
        id: 'obj5',
        name: "I need to speak to my spouse/partner",
        category: "Stalls & Financial Hardship",
        keywords: ["talk to my wife", "ask my husband", "check with my partner"],
        linkedPlaybookId: "pb12",
        linkedPlaybookName: "Spousal/Partner Deferral"
    },
    {
        id: 'obj6',
        name: "You're a scam",
        category: "Third-Party & Scammer Defenses",
        keywords: ["scam", "fraud", "not real", "prove who you are"],
        linkedPlaybookId: "pb5",
        linkedPlaybookName: "Company Legitimacy & Verification"
    },
    {
        id: 'obj7',
        name: "I'm filing for bankruptcy",
        category: "Refusals & Legal Challenges",
        keywords: ["bankruptcy", "filing chapter 7", "filing chapter 13"],
        linkedPlaybookId: "pb10",
        linkedPlaybookName: "Bankruptcy Cease Communication"
    },
    {
        id: 'obj8',
        name: "Call me back later",
        category: "Stalls & Financial Hardship",
        keywords: ["call me back", "not a good time", "busy right now"],
        linkedPlaybookId: "pb8",
        linkedPlaybookName: "Future Payment Commitment"
    }
];

module.exports = initialObjections;
